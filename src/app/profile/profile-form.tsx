"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { updateProfile } from "./actions";

export function ProfileForm({ currentName }: { currentName: string }) {
  const [message, setMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);
  const router = useRouter();

  async function handleSubmit(formData: FormData) {
    const result = await updateProfile(formData);
    if (result.error) {
      setMessage({ type: "error", text: result.error });
    } else {
      setMessage({ type: "success", text: "资料已更新" });
      router.refresh();
    }
  }

  return (
    <form action={handleSubmit} className="space-y-4">
      <div>
        <Label htmlFor="name">昵称</Label>
        <Input
          id="name"
          name="name"
          defaultValue={currentName}
          className="mt-1 max-w-sm"
        />
      </div>
      {message && (
        <p
          className={
            message.type === "success"
              ? "text-sm text-success"
              : "text-sm text-destructive"
          }
        >
          {message.text}
        </p>
      )}
      <Button type="submit">保存</Button>
    </form>
  );
}
