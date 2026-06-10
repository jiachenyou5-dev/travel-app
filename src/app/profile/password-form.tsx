"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { changePassword } from "./actions";

export function PasswordForm() {
  const [message, setMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  async function handleSubmit(formData: FormData) {
    setMessage(null);
    const result = await changePassword(formData);
    if (result.error) {
      setMessage({ type: "error", text: result.error });
    } else {
      setMessage({ type: "success", text: "密码已修改" });
      const form = document.getElementById("password-form") as HTMLFormElement;
      form?.reset();
    }
  }

  return (
    <form id="password-form" action={handleSubmit} className="space-y-4">
      <div>
        <Label htmlFor="currentPassword">当前密码</Label>
        <Input
          id="currentPassword"
          name="currentPassword"
          type="password"
          className="mt-1 max-w-sm"
        />
      </div>
      <div>
        <Label htmlFor="newPassword">新密码</Label>
        <Input
          id="newPassword"
          name="newPassword"
          type="password"
          className="mt-1 max-w-sm"
        />
      </div>
      <div>
        <Label htmlFor="confirmPassword">确认新密码</Label>
        <Input
          id="confirmPassword"
          name="confirmPassword"
          type="password"
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
      <Button type="submit">修改密码</Button>
    </form>
  );
}
