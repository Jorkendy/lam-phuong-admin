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
import { createProductGroup } from "@/lib/product-groups";
import type { ProductGroup } from "@/types/product-group";

interface CreateProductGroupDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onProductGroupCreated: (productGroup: ProductGroup) => void;
}

export function CreateProductGroupDialog({
  open,
  onOpenChange,
  onProductGroupCreated,
}: CreateProductGroupDialogProps) {
  const [name, setName] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [nameError, setNameError] = useState<string | null>(null);

  const validateName = (value: string): string | null => {
    const trimmed = value.trim();
    if (!trimmed) {
      return "Tên nhóm sản phẩm là bắt buộc";
    }
    if (trimmed.length < 2) {
      return "Tên nhóm sản phẩm phải có ít nhất 2 ký tự";
    }
    if (trimmed.length > 100) {
      return "Tên nhóm sản phẩm không được vượt quá 100 ký tự";
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
      const newProductGroup = await createProductGroup({ name: name.trim() });
      setName("");
      onProductGroupCreated(newProductGroup);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Không thể tạo nhóm sản phẩm"
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
          <DialogTitle>Thêm nhóm sản phẩm mới</DialogTitle>
          <DialogDescription>
            Nhập tên nhóm sản phẩm để tạo mới. Slug sẽ được tạo tự động.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="name">Tên nhóm sản phẩm</Label>
              <Input
                id="name"
                placeholder="Ví dụ: Thuốc kháng sinh"
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
                  Tạo nhóm sản phẩm
                </>
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

