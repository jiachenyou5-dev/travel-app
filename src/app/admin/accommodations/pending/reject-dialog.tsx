"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { rejectAccommodation } from "../actions";

export function RejectDialog({
  accommodationId,
  accommodationName,
}: {
  accommodationId: string;
  accommodationName: string;
}) {
  const [open, setOpen] = useState(false);
  const [notes, setNotes] = useState("");

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger
        render={
          <Button variant="outline" size="sm" className="gap-1 text-destructive">
            拒绝
          </Button>
        }
      />
      <DialogContent>
        <DialogHeader>
          <DialogTitle>拒绝住宿提交</DialogTitle>
          <DialogDescription>
            确定要拒绝「{accommodationName}」吗？请填写拒绝原因，提交人会看到此说明。
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-2">
          <Label htmlFor="notes">拒绝原因</Label>
          <Textarea
            id="notes"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="例如：信息不完整、住宿不存在、重复提交等"
            rows={3}
          />
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)}>
            取消
          </Button>
          <form action={rejectAccommodation.bind(null, accommodationId, notes)}>
            <Button
              type="submit"
              variant="destructive"
              disabled={!notes.trim()}
              onClick={() => setOpen(false)}
            >
              确认拒绝
            </Button>
          </form>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
