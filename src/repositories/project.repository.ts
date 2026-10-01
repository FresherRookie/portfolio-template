import { desc, eq } from "drizzle-orm";

import { db } from "@/db";
import { projects } from "@/db/schema";

export async function getProjectsRepository() {
  return db.select().from(projects).orderBy(desc(projects.createdAt));
}

export async function getProjectByIdRepository(id: string) {
  const [project] = await db
    .select()
    .from(projects)
    .where(eq(projects.id, id))
    .limit(1);

  return project ?? null;
}

export async function getProjectBySlug(slug: string) {
  const result = await db
    .select()
    .from(projects)
    .where(eq(projects.slug, slug))
    .limit(1);

  return result[0] ?? null;
}

export async function createProject(data: {
  title: string;
  slug: string;
  description?: string | null;
  coverImage?: string | null;
  featured?: boolean;
  published?: boolean;
}) {
  const result = await db
    .insert(projects)
    .values({
      title: data.title,
      slug: data.slug,
      description: data.description ?? null,
      coverImage: data.coverImage ?? null,
      featured: data.featured ?? false,
      published: data.published ?? false,
    })
    .returning();

  return result[0];
}

export async function updateProject(
  id: string,
  data: {
    title?: string;
    slug?: string;
    description?: string | null;
    coverImage?: string | null;
    featured?: boolean;
    published?: boolean;
  },
) {
  const result = await db
    .update(projects)
    .set({
      ...data,
      updatedAt: new Date(),
    })
    .where(eq(projects.id, id))
    .returning();

  return result[0] ?? null;
}

export async function deleteProject(id: string) {
  const result = await db
    .delete(projects)
    .where(eq(projects.id, id))
    .returning({
      id: projects.id,
      coverImage: projects.coverImage,
    });

  return result[0] ?? null;
}
