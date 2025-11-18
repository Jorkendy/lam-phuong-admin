"use client";

import { useState } from "react";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { createJobType } from "@/lib/job-types";
import type { JobType } from "@/types/job-type";

interface CreateJobTypeDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onJobTypeCreated: (jobType: JobType) => void;
}

export function CreateJobTypeDialog({
  open,
  onOpenChange,
  onJobTypeCreated,
}: CreateJobTypeDialogProps) {
  const [name, setName] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [nameError, setNameError] = useState<string | null>(null);

  const validateName = (value: string): string | null => {
    const trimmed = value.trim();
    if (!trimmed) {
      return "Tên loại công việc là bắt buộc";
    }
    if (trimmed.length < 2) {
      return "Tên loại công việc phải có ít nhất 2 ký tự";
    }
    if (trimmed.length > 100) {
      return "Tên loại công việc không được vượt quá 100 ký tự";
    }
    return null;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setNameError(null);

    const validationError = validateName(name);
    if (validationError) {
      setNameError(validationError);
      return;
    }

    setIsLoading(true);

    try {
      const newJobType = await createJobType({ name: name.trim() });
      setName("");
      onJobTypeCreated(newJobType);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Không thể tạo loại công việc"
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleOpenChange = (newOpen: boolean) => {
    if (!newOpen && !isLoading) {
      setName("");
      setError(null);
      setNameError(null);
    }
    onOpenChange(newOpen);
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Thêm loại công việc mới</DialogTitle>
          <DialogDescription>
            Nhập tên loại công việc để tạo mới. Slug sẽ được tạo tự động.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="name">Tên loại công việc</Label>
              <Input
                id="name"
                placeholder="Ví dụ: Toàn thời gian"
                value={name}
                onChange={(e) => {
                  setName(e.target.value);
                  if (nameError) setNameError(null);
                }}
                disabled={isLoading}
                className={nameError ? "border-destructive" : ""}
              />
              {nameError && (
                <p className="text-sm text-destructive">{nameError}</p>
              )}
              {error && (
                <p className="text-sm text-destructive">{error}</p>
              )}
            </div>
          </div>
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => handleOpenChange(false)}
              disabled={isLoading}
            >
              Hủy
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? (
                "Đang tạo..."
              ) : (
                <>
                  <Plus className="mr-2 h-4 w-4" />
                  Tạo loại công việc
                </>
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

