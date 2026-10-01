"use server";

import { requireAdmin } from "@/lib/permissions";
import { projectSchema } from "@/lib/validations/project";
import {
  createProject as createProjectRepository,
  deleteProject as deleteProjectRepository,
  getProjectByIdRepository,
  updateProject as updateProjectRepository,
} from "@/repositories/project.repository";
import { deleteProjectImage, saveProjectImage } from "@/lib/media/upload";

import { treeifyError } from "zod";

export type ProjectActionState = {
  success: boolean;
  message: string;
  errors?: Record<string, string[]>;
};

function getBooleanValue(value: FormDataEntryValue | null) {
  return value === "true";
}

export async function createProject(formData: FormData) {
  await requireAdmin();

  const result = projectSchema.safeParse({
    title: formData.get("title"),
    slug: formData.get("slug"),
    description: formData.get("description"),

    featured: formData.get("featured") === "true",
    published: formData.get("published") === "true",
  });

  if (!result.success) {
    const errors = treeifyError(result.error);
    return {
      success: false,
      message: "Please correct the errors and try again.",
      errors,
    };
  }
  const coverImageFile = formData.get("coverImage");

  let uploadedImageUrl: string | undefined;
  if (coverImageFile instanceof File && coverImageFile.size > 0) {
    const uploaded = await saveProjectImage(coverImageFile);
    uploadedImageUrl = uploaded.url;
  }
  try {
    await createProjectRepository({
      ...result.data,
      coverImage: uploadedImageUrl,
    });
  } catch (error) {
    console.error("Failed to create project:", error);

    return {
      success: false,
      message: "Unable to create project.",
    };
  }

  return {
    success: true,
    message: "Project created successfully",
  };
}

export async function updateProject(formData: FormData) {
  await requireAdmin();

  const id = String(formData.get("id") ?? "");

  if (!id) {
    return {
      success: false,
      message: "Project ID is required.",
    };
  }

  const result = projectSchema.safeParse({
    title: formData.get("title"),
    slug: formData.get("slug"),
    description: formData.get("description"),

    featured: getBooleanValue(formData.get("featured")),
    published: getBooleanValue(formData.get("published")),
  });

  if (!result.success) {
    return {
      success: false,
      message: "Please correct the errors and try again.",
      errors: treeifyError(result.error),
    };
  }

  const coverImageFile = formData.get("coverImage");

  try {
    const existingProject = await getProjectByIdRepository(id);
    if (!existingProject) {
      return {
        success: false,
        message: "Project not found.",
      };
    }
    let coverImage = existingProject.coverImage;
    let newImageUrl: string | null = null;
    if (coverImageFile instanceof File && coverImageFile.size > 0) {
      const uploaded = await saveProjectImage(coverImageFile);
      newImageUrl = uploaded.url;
      coverImage = newImageUrl;
    }

    const project = await updateProjectRepository(id, {
      ...result.data,
      coverImage,
    });

    if (!project) {
      if (newImageUrl) {
        await deleteProjectImage(newImageUrl);
      }
      return {
        success: false,
        message: "Project not found.",
      };
    }
    if (newImageUrl && existingProject.coverImage) {
      await deleteProjectImage(existingProject.coverImage);
    }

    return {
      success: true,
      message: "Project updated successfully.",
    };
  } catch (error) {
    console.error("Failed to update project:", error);

    return {
      success: false,
      message: "Unable to update project.",
    };
  }
}

export async function deleteProject(formData: FormData) {
  await requireAdmin();

  const id = String(formData.get("id") ?? "");

  if (!id) {
    return {
      success: false,
      message: "Project ID is required.",
    };
  }

  try {
    const project = await deleteProjectRepository(id);

    if (!project) {
      return {
        success: false,
        message: "Project not found.",
      };
    }

    if (project.coverImage) {
      try {
        await deleteProjectImage(project.coverImage);
      } catch (error) {
        console.error(
          "Project deleted but failed to delete cover image:",
          error,
        );
      }
    }

    return {
      success: true,
      message: "Project deleted successfully.",
    };
  } catch (error) {
    console.error("Failed to delete project:", error);

    return {
      success: false,
      message: "Unable to delete project.",
    };
  }
}
