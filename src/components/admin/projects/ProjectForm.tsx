"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

import { createProject, updateProject } from "@/actions/projects";

type Project = {
  id: string;
  title: string;
  slug: string;
  description: string | null;
  coverImage: string | null;
  featured: boolean;
  published: boolean;
};

type ProjectFormProps = {
  project?: Project;
};

export default function ProjectForm({ project }: ProjectFormProps) {
  const router = useRouter();

  const isEditing = Boolean(project);

  const [isSubmitting, setIsSubmitting] = useState(false);

  const [formState, setFormState] = useState({
    title: project?.title ?? "",
    slug: project?.slug ?? "",
    description: project?.description ?? "",
    featured: project?.featured ?? false,
    published: project?.published ?? false,
  });

  const [coverImageFile, setCoverImageFile] = useState<File | null>(null);

  const [coverImagePreview, setCoverImagePreview] = useState<string | null>(
    project?.coverImage ?? null,
  );

  const [error, setError] = useState<string | null>(null);

  const handleChange = (
    field: keyof typeof formState,
    value: string | boolean,
  ) => {
    setFormState((current) => ({
      ...current,
      [field]: value,
    }));
  };

  function handleCoverImageChange(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0] ?? null;

    setCoverImageFile(file);

    if (coverImagePreview?.startsWith("blob:")) {
      URL.revokeObjectURL(coverImagePreview);
    }

    if (file) {
      setCoverImagePreview(URL.createObjectURL(file));
    } else {
      setCoverImagePreview(project?.coverImage ?? null);
    }

    setError(null);
  }

  const handleSubmit = async () => {
    if (isSubmitting) {
      return;
    }

    setIsSubmitting(true);
    setError(null);

    const formData = new FormData();

    formData.set("title", formState.title);
    formData.set("slug", formState.slug);

    formData.set("description", formState.description);
    formData.set("featured", String(formState.featured));
    formData.set("published", String(formState.published));

    if (project?.id) {
      formData.set("id", project.id);
    }

    if (coverImageFile) {
      formData.set("coverImage", coverImageFile);
    }

    const result = isEditing
      ? await updateProject(formData)
      : await createProject(formData);

    if (!result.success) {
      if (result.message) {
        setError(result.message);
      }

      toast.error(result.message);
      setIsSubmitting(false);
      return;
    }

    toast.success(result.message);

    router.push("/admin/projects");
    router.refresh();
  };

  return (
    <div className="space-y-10">
      {/* Project information */}
      <section>
        <div className="border-b border-border pb-4">
          <h2 className="font-display text-2xl">Project information</h2>

          <p className="mt-1 text-sm text-muted-foreground">
            Basic information about this portfolio project.
          </p>
        </div>

        <div className="mt-6 space-y-6">
          {/* Title */}
          <div className="space-y-2">
            <label htmlFor="title" className="text-sm font-medium">
              Title
            </label>

            <input
              id="title"
              type="text"
              value={formState.title}
              onChange={(event) => handleChange("title", event.target.value)}
              maxLength={200}
              className="w-full rounded-lg border border-border bg-background px-4 py-3 text-sm outline-none transition focus:border-accent"
            />
          </div>

          {/* Slug */}
          <div className="space-y-2">
            <label htmlFor="slug" className="text-sm font-medium">
              Slug
            </label>

            <input
              id="slug"
              type="text"
              value={formState.slug}
              onChange={(event) => handleChange("slug", event.target.value)}
              maxLength={200}
              className="w-full rounded-lg border border-border bg-background px-4 py-3 text-sm outline-none transition focus:border-accent"
            />
          </div>

          {/* Description */}
          <div className="space-y-2">
            <label htmlFor="description" className="text-sm font-medium">
              Description
            </label>

            <textarea
              id="description"
              value={formState.description}
              onChange={(event) =>
                handleChange("description", event.target.value)
              }
              rows={6}
              maxLength={5000}
              placeholder="Describe this project..."
              className="w-full resize-y rounded-lg border border-border bg-background px-4 py-3 text-sm outline-none transition focus:border-accent"
            />
          </div>
        </div>
      </section>

      {/* Cover image */}
      <section>
        <div className="border-b border-border pb-4">
          <h2 className="font-display text-2xl">Cover image</h2>

          <p className="mt-1 text-sm text-muted-foreground">
            Choose the main image that represents this project.
          </p>
        </div>

        <div className="mt-6 rounded-2xl border bg-card p-6 shadow-sm">
          <div className="flex flex-col gap-5 sm:flex-row sm:items-center">
            <div className="flex h-40 w-40 shrink-0 items-center justify-center overflow-hidden rounded-2xl border bg-muted">
              {coverImagePreview ? (
                <Image
                  width={160}
                  height={160}
                  src={coverImagePreview}
                  alt="Project cover preview"
                  className="h-full w-full object-cover"
                  unoptimized={coverImagePreview.startsWith("blob:")}
                />
              ) : (
                <span className="px-4 text-center text-xs text-muted-foreground">
                  No image selected
                </span>
              )}
            </div>

            <div>
              <label
                htmlFor="coverImage"
                className="mb-2 block text-sm font-medium"
              >
                {isEditing ? "Replace cover image" : "Cover image"}
              </label>

              <input
                id="coverImage"
                type="file"
                accept="image/jpeg,image/png,image/webp"
                onChange={handleCoverImageChange}
                className="block w-full text-sm"
              />

              <p className="mt-2 text-xs text-muted-foreground">
                JPEG, PNG, or WebP. Maximum 10MB.
              </p>

              {isEditing && (
                <p className="mt-1 text-xs text-muted-foreground">
                  Leave empty to keep the current image.
                </p>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Status */}
      <section>
        <div className="border-b border-border pb-4">
          <h2 className="font-display text-2xl">Status</h2>
        </div>

        <div className="mt-6 space-y-4">
          <label className="flex items-center gap-3">
            <input
              type="checkbox"
              checked={formState.featured}
              onChange={(event) =>
                handleChange("featured", event.target.checked)
              }
            />

            <span className="text-sm">Featured project</span>
          </label>

          <label className="flex items-center gap-3">
            <input
              type="checkbox"
              checked={formState.published}
              onChange={(event) =>
                handleChange("published", event.target.checked)
              }
            />

            <span className="text-sm">Published</span>
          </label>
        </div>
      </section>

      {error && (
        <div className="rounded-lg border border-destructive/30 bg-destructive/5 px-4 py-3 text-sm text-destructive">
          {error}
        </div>
      )}

      {/* Actions */}
      <div className="flex items-center gap-3 border-t border-border pt-6">
        <button
          type="button"
          onClick={handleSubmit}
          disabled={isSubmitting}
          className="rounded-lg bg-foreground px-5 py-3 text-sm font-medium text-background transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {isSubmitting
            ? isEditing
              ? "Updating..."
              : "Creating..."
            : isEditing
              ? "Update project"
              : "Create project"}
        </button>

        <button
          type="button"
          onClick={() => router.push("/admin/projects")}
          disabled={isSubmitting}
          className="rounded-lg border border-border px-5 py-3 text-sm font-medium transition hover:bg-muted disabled:opacity-50"
        >
          Cancel
        </button>
      </div>
    </div>
  );
}
