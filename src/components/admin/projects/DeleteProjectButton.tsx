"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import { deleteProject } from "@/actions/projects";

type DeleteProjectButtonProps = {
  projectId: string;
};

export default function DeleteProjectButton({
  projectId,
}: DeleteProjectButtonProps) {
  const router = useRouter();

  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    if (isDeleting) {
      return;
    }

    const confirmed = window.confirm(
      "Are you sure you want to delete this project?",
    );

    if (!confirmed) {
      return;
    }

    setIsDeleting(true);

    const formData = new FormData();
    formData.set("id", projectId);

    const result = await deleteProject(formData);

    if (!result.success) {
      toast.error(result.message);

      setIsDeleting(false);

      return;
    }

    toast.success(result.message);

    router.refresh();
  };

  return (
    <button
      type="button"
      onClick={handleDelete}
      disabled={isDeleting}
      className="text-red-600 underline disabled:cursor-not-allowed disabled:opacity-50"
    >
      {isDeleting ? "Deleting..." : "Delete"}
    </button>
  );
}
