"use client";

import { Button } from "@/components/ui/button";

export function DeleteButton({
  action,
  id,
  name = "id",
  label = "Delete",
  confirmMessage = "Delete this item? This cannot be undone.",
}: {
  action: (formData: FormData) => void | Promise<void>;
  id: string;
  name?: string;
  label?: string;
  confirmMessage?: string;
}) {
  return (
    <form
      action={action}
      onSubmit={(event) => {
        if (!window.confirm(confirmMessage)) event.preventDefault();
      }}
    >
      <input type="hidden" name={name} value={id} />
      <Button type="submit" variant="destructive" size="sm">
        {label}
      </Button>
    </form>
  );
}
