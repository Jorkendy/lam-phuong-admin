"use client";

import { useState } from "react";
import { Plus, CheckCircle2, Mail } from "lucide-react";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { createUser } from "@/lib/users";
import type { User } from "@/types/auth";
import { useMemo, useEffect } from "react";

interface CreateUserDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onUserCreated: (user: User) => void;
  currentUserRole?: string;
}

const DEFAULT_PASSWORD = "123456";
const ALL_ROLE_OPTIONS = [
  { value: "Super Admin", label: "Super Admin" },
  { value: "Admin", label: "Admin" },
  { value: "User", label: "User" },
];

export function CreateUserDialog({
  open,
  onOpenChange,
  onUserCreated,
  currentUserRole,
}: CreateUserDialogProps) {
  // Filter role options: Only Super Admin can invite Super Admin
  const roleOptions = useMemo(() => {
    if (currentUserRole === "Super Admin") {
      return ALL_ROLE_OPTIONS;
    }
    // Admin and other roles cannot invite Super Admin
    return ALL_ROLE_OPTIONS.filter((option) => option.value !== "Super Admin");
  }, [currentUserRole]);
  
  const [email, setEmail] = useState("");
  // Initialize role with first available option
  const [role, setRole] = useState<string>("User");

  // Reset role to valid option when dialog opens or roleOptions change
  useEffect(() => {
    if (open) {
      // If current role is not in available options, reset to first available
      const isValidRole = roleOptions.some((option) => option.value === role);
      if (!isValidRole && roleOptions.length > 0) {
        // Defer state update to avoid synchronous setState
        const timer = setTimeout(() => {
          setRole(roleOptions[0].value);
        }, 0);
        return () => clearTimeout(timer);
      }
    }
  }, [open, roleOptions, role]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [emailError, setEmailError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [createdEmail, setCreatedEmail] = useState<string>("");

  const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  const validateEmail = (value: string): string | null => {
    const trimmed = value.trim();
    if (!trimmed) {
      return "Email là bắt buộc";
    }
    if (!EMAIL_REGEX.test(trimmed)) {
      return "Email không hợp lệ";
    }
    return null;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setEmailError(null);

    const validationError = validateEmail(email);
    if (validationError) {
      setEmailError(validationError);
      return;
    }

    if (!role) {
      setError("Vai trò là bắt buộc");
      return;
    }

    setIsLoading(true);

    try {
      const newUser = await createUser({
        email: email.trim(),
        role,
        password: DEFAULT_PASSWORD,
      });
      setCreatedEmail(email.trim());
      setSuccess(true);
      setError(null);
      setEmailError(null);
      setIsLoading(false);
      
      // Call onUserCreated after a brief delay to ensure success message is visible
      setTimeout(() => {
        onUserCreated(newUser);
      }, 100);
      
      // Close dialog after showing success message for 5 seconds
      setTimeout(() => {
        setEmail("");
        // Reset to first available role option
        setRole(roleOptions[0]?.value || "User");
        setSuccess(false);
        setCreatedEmail("");
        onOpenChange(false);
      }, 5000);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Không thể mời người dùng"
      );
      setIsLoading(false);
    }
  };

  const handleOpenChange = (newOpen: boolean) => {
    // Prevent closing dialog when showing success message
    if (!newOpen && success) {
      return;
    }
    
    if (!newOpen && !isLoading && !success) {
      setEmail("");
      // Reset to first available role option
      setRole(roleOptions[0]?.value || "User");
      setError(null);
      setEmailError(null);
      setSuccess(false);
      setCreatedEmail("");
    }
    onOpenChange(newOpen);
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>
            {success ? "Mời người dùng thành công" : "Mời người dùng mới"}
          </DialogTitle>
          <DialogDescription>
            {success
              ? "Người dùng đã được mời thành công"
              : "Nhập thông tin để mời người dùng mới. Mật khẩu mặc định là 123456."}
          </DialogDescription>
        </DialogHeader>
        {success ? (
          <div className="grid gap-4 py-4">
            <div className="rounded-md bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 p-4">
              <div className="flex items-start gap-3">
                <div className="rounded-full bg-green-100 dark:bg-green-900/40 p-1.5 mt-0.5">
                  <CheckCircle2 className="h-5 w-5 text-green-600 dark:text-green-400" />
                </div>
                <div className="flex-1 space-y-2">
                  <p className="text-sm font-medium text-green-900 dark:text-green-100">
                    Người dùng đã được mời thành công!
                  </p>
                  <div className="rounded-md bg-white dark:bg-green-950/50 p-3 space-y-2">
                    <div className="flex items-center gap-2 text-sm text-green-800 dark:text-green-200">
                      <Mail className="h-4 w-4" />
                      <span className="font-medium">Email:</span>
                      <span className="font-mono">{createdEmail}</span>
                    </div>
                    <div className="flex items-start gap-2 mt-2 pt-2 border-t border-green-200 dark:border-green-800">
                      <Mail className="h-4 w-4 mt-0.5 text-green-600 dark:text-green-400" />
                      <p className="text-sm font-medium text-green-800 dark:text-green-200">
                        Vui lòng yêu cầu người dùng kiểm tra email để xác thực tài khoản.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button
                type="button"
                onClick={() => {
                  setEmail("");
                  // Reset to first available role option
                  setRole(roleOptions[0]?.value || "User");
                  setSuccess(false);
                  setCreatedEmail("");
                  onOpenChange(false);
                }}
                className="w-full"
              >
                Đóng
              </Button>
            </DialogFooter>
          </div>
        ) : (
          <form onSubmit={handleSubmit}>
            <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="user@example.com"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  if (emailError) setEmailError(null);
                }}
                disabled={isLoading}
                className={emailError ? "border-destructive" : ""}
              />
              {emailError && (
                <p className="text-sm text-destructive">{emailError}</p>
              )}
            </div>
            <div className="grid gap-2">
              <Label htmlFor="role">Vai trò</Label>
              <Select value={role} onValueChange={setRole} disabled={isLoading}>
                <SelectTrigger id="role">
                  <SelectValue placeholder="Chọn vai trò" />
                </SelectTrigger>
                <SelectContent>
                  {roleOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="rounded-md bg-muted p-3 text-sm text-muted-foreground">
              <p className="font-medium mb-1">Mật khẩu mặc định:</p>
              <p className="font-mono">123456</p>
            </div>
            {error && (
              <div className="rounded-md bg-destructive/10 p-3 text-sm text-destructive">
                {error}
              </div>
            )}
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
                "Đang gửi lời mời..."
              ) : (
                <>
                  <Plus className="mr-2 h-4 w-4" />
                  Mời người dùng
                </>
              )}
            </Button>
          </DialogFooter>
        </form>
        )}
      </DialogContent>
    </Dialog>
  );
}

