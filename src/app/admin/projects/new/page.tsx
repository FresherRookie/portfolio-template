import Link from "next/link";

import ProjectForm from "@/components/admin/projects/ProjectForm";

export default function NewProjectPage() {
  return (
    <main className="space-y-8 p-6">
      <div>
        <Link href="/admin/projects" className="text-sm underline">
          ← Back to projects
        </Link>

        <h1 className="mt-4 text-3xl font-semibold">New project</h1>

        <p className="mt-1 text-sm text-muted-foreground">
          Create a new portfolio project.
        </p>
      </div>

      <ProjectForm />
    </main>
  );
}
