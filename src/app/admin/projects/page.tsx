import Link from "next/link";

import { getProjectsRepository } from "@/repositories/project.repository";
import DeleteProjectButton from "@/components/admin/projects/DeleteProjectButton";

export default async function ProjectsPage() {
  const projects = await getProjectsRepository();

  return (
    <main className="space-y-6 p-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Projects</h1>

          <p className="text-sm text-muted-foreground">
            Manage your portfolio projects.
          </p>
        </div>

        <Link
          href="/admin/projects/new"
          className="rounded-md bg-black px-4 py-2 text-sm text-white"
        >
          New project
        </Link>
      </div>

      {projects.length === 0 ? (
        <div className="rounded-lg border p-8 text-center">
          <h2 className="font-medium">No projects yet</h2>

          <p className="mt-1 text-sm text-muted-foreground">
            Create your first portfolio project.
          </p>

          <Link
            href="/admin/projects/new"
            className="mt-4 inline-block text-sm underline"
          >
            Create project
          </Link>
        </div>
      ) : (
        <div className="overflow-hidden rounded-lg border">
          <table className="w-full text-sm">
            <thead className="border-b bg-muted/50">
              <tr>
                <th className="px-4 py-3 text-left font-medium">Project</th>

                <th className="px-4 py-3 text-left font-medium">Status</th>

                <th className="px-4 py-3 text-left font-medium">Created</th>

                <th className="px-4 py-3 text-right font-medium">Actions</th>
              </tr>
            </thead>

            <tbody>
              {projects.map((project) => (
                <tr key={project.id} className="border-b last:border-0">
                  <td className="px-4 py-4">
                    <div className="font-medium">{project.title}</div>

                    <div className="text-xs text-muted-foreground">
                      /{project.slug}
                    </div>
                  </td>

                  <td className="px-4 py-4">
                    <div className="flex gap-2">
                      {project.published && (
                        <span className="rounded-full bg-green-100 px-2 py-1 text-xs">
                          Published
                        </span>
                      )}

                      {!project.published && (
                        <span className="rounded-full bg-muted px-2 py-1 text-xs">
                          Draft
                        </span>
                      )}

                      {project.featured && (
                        <span className="rounded-full bg-yellow-100 px-2 py-1 text-xs">
                          Featured
                        </span>
                      )}
                    </div>
                  </td>

                  <td className="px-4 py-4 text-muted-foreground">
                    {project.createdAt.toLocaleDateString()}
                  </td>

                  <td className="px-4 py-4">
                    <div className="flex items-center justify-end gap-4">
                      <Link
                        href={`/admin/projects/${project.id}/edit`}
                        className="underline"
                      >
                        Edit
                      </Link>

                      <DeleteProjectButton projectId={project.id} />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </main>
  );
}
