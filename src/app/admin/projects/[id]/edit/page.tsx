import { notFound } from "next/navigation";

import ProjectForm from "@/components/admin/projects/ProjectForm";
import { getProjectByIdRepository } from "@/repositories/project.repository";

type EditProjectPageProps = {
  params: Promise<{
    id: string;
  }>;
};

export default async function EditProjectPage({
  params,
}: EditProjectPageProps) {
  const { id } = await params;

  const project = await getProjectByIdRepository(id);

  if (!project) {
    notFound();
  }

  return (
    <main className="space-y-6 p-6">
      <div>
        <h1 className="text-2xl font-semibold">Edit Project</h1>

        <p className="text-sm text-muted-foreground">
          Update the details of your portfolio project.
        </p>
      </div>

      <ProjectForm project={project} />
    </main>
  );
}
