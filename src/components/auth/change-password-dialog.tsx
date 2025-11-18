"use client";

import { useState, useMemo } from "react";
import { Lock, CheckCircle2, Eye, EyeOff } from "lucide-react";
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
import { Progress } from "@/components/ui/progress";
import { changePassword } from "@/lib/change-password";
import {
  calculatePasswordStrength,
  getStrengthColor,
  getStrengthText,
  getStrengthTextColor,
} from "@/lib/password-strength";

interface ChangePasswordDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function ChangePasswordDialog({
  open,
  onOpenChange,
}: ChangePasswordDialogProps) {
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showOldPassword, setShowOldPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [fieldErrors, setFieldErrors] = useState<{
    oldPassword?: string;
    newPassword?: string;
    confirmPassword?: string;
  }>({});

  // Calculate password strength in real-time
  const passwordStrength = useMemo(() => {
    return calculatePasswordStrength(newPassword);
  }, [newPassword]);

  const validateForm = (): boolean => {
    const errors: typeof fieldErrors = {};

    if (!oldPassword.trim()) {
      errors.oldPassword = "Mật khẩu cũ là bắt buộc";
    }

    if (!newPassword.trim()) {
      errors.newPassword = "Mật khẩu mới là bắt buộc";
    } else if (newPassword.length < 6) {
      errors.newPassword = "Mật khẩu mới phải có ít nhất 6 ký tự";
    }

    if (!confirmPassword.trim()) {
      errors.confirmPassword = "Xác nhận mật khẩu là bắt buộc";
    } else if (confirmPassword !== newPassword) {
      errors.confirmPassword = "Mật khẩu xác nhận không khớp";
    }

    if (oldPassword && newPassword && oldPassword === newPassword) {
      errors.newPassword = "Mật khẩu mới phải khác mật khẩu cũ";
    }

    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setFieldErrors({});

    if (!validateForm()) {
      return;
    }

    setIsLoading(true);

    try {
      await changePassword({
        old_password: oldPassword,
        new_password: newPassword,
      });
      setSuccess(true);
      setOldPassword("");
      setNewPassword("");
      setConfirmPassword("");
      
      // Close dialog after showing success message for 2 seconds
      setTimeout(() => {
        setSuccess(false);
        onOpenChange(false);
      }, 2000);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Không thể đổi mật khẩu"
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleOpenChange = (newOpen: boolean) => {
    if (!newOpen && !isLoading && !success) {
      setOldPassword("");
      setNewPassword("");
      setConfirmPassword("");
      setError(null);
      setFieldErrors({});
      setSuccess(false);
    }
    onOpenChange(newOpen);
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>
            {success ? "Đổi mật khẩu thành công" : "Đổi mật khẩu"}
          </DialogTitle>
          <DialogDescription>
            {success
              ? "Mật khẩu của bạn đã được thay đổi thành công"
              : "Nhập mật khẩu cũ và mật khẩu mới để thay đổi"}
          </DialogDescription>
        </DialogHeader>
        {success ? (
          <div className="grid gap-4 py-4">
            <div className="rounded-md bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 p-4">
              <div className="flex items-start gap-3">
                <div className="rounded-full bg-green-100 dark:bg-green-900/40 p-1.5 mt-0.5">
                  <CheckCircle2 className="h-5 w-5 text-green-600 dark:text-green-400" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-green-900 dark:text-green-100">
                    Mật khẩu đã được thay đổi thành công!
                  </p>
                  <p className="text-sm text-green-700 dark:text-green-300 mt-1">
                    Vui lòng sử dụng mật khẩu mới cho lần đăng nhập tiếp theo.
                  </p>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit}>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="oldPassword">Mật khẩu cũ</Label>
                <div className="relative">
                  <Input
                    id="oldPassword"
                    type={showOldPassword ? "text" : "password"}
                    placeholder="Nhập mật khẩu cũ"
                    value={oldPassword}
                    onChange={(e) => {
                      setOldPassword(e.target.value);
                      if (fieldErrors.oldPassword) {
                        setFieldErrors((prev) => ({ ...prev, oldPassword: undefined }));
                      }
                    }}
                    disabled={isLoading}
                    className={fieldErrors.oldPassword ? "border-destructive pr-10" : "pr-10"}
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                    onClick={() => setShowOldPassword(!showOldPassword)}
                    disabled={isLoading}
                  >
                    {showOldPassword ? (
                      <EyeOff className="h-4 w-4 text-muted-foreground" />
                    ) : (
                      <Eye className="h-4 w-4 text-muted-foreground" />
                    )}
                  </Button>
                </div>
                {fieldErrors.oldPassword && (
                  <p className="text-sm text-destructive">{fieldErrors.oldPassword}</p>
                )}
              </div>

              <div className="grid gap-2">
                <Label htmlFor="newPassword">Mật khẩu mới</Label>
                <div className="relative">
                  <Input
                    id="newPassword"
                    type={showNewPassword ? "text" : "password"}
                    placeholder="Nhập mật khẩu mới (tối thiểu 6 ký tự)"
                    value={newPassword}
                    onChange={(e) => {
                      setNewPassword(e.target.value);
                      if (fieldErrors.newPassword) {
                        setFieldErrors((prev) => ({ ...prev, newPassword: undefined }));
                      }
                    }}
                    disabled={isLoading}
                    className={fieldErrors.newPassword ? "border-destructive pr-10" : "pr-10"}
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                    onClick={() => setShowNewPassword(!showNewPassword)}
                    disabled={isLoading}
                  >
                    {showNewPassword ? (
                      <EyeOff className="h-4 w-4 text-muted-foreground" />
                    ) : (
                      <Eye className="h-4 w-4 text-muted-foreground" />
                    )}
                  </Button>
                </div>
                {newPassword && (
                  <div className="space-y-2">
                    <div className="flex items-center justify-between gap-2">
                      <Progress
                        value={passwordStrength.score}
                        className="h-2 flex-1"
                        indicatorClassName={getStrengthColor(passwordStrength.strength)}
                      />
                      <span
                        className={`text-xs font-medium ${getStrengthTextColor(
                          passwordStrength.strength
                        )}`}
                      >
                        {getStrengthText(passwordStrength.strength)}
                      </span>
                    </div>
                    {passwordStrength.feedback.length > 0 && (
                      <div className="space-y-1">
                        {passwordStrength.feedback.map((item, index) => (
                          <p
                            key={index}
                            className="text-xs text-muted-foreground flex items-center gap-1"
                          >
                            <span className="text-destructive">•</span>
                            {item}
                          </p>
                        ))}
                      </div>
                    )}
                  </div>
                )}
                {fieldErrors.newPassword && (
                  <p className="text-sm text-destructive">{fieldErrors.newPassword}</p>
                )}
              </div>

              <div className="grid gap-2">
                <Label htmlFor="confirmPassword">Xác nhận mật khẩu mới</Label>
                <div className="relative">
                  <Input
                    id="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    placeholder="Nhập lại mật khẩu mới"
                    value={confirmPassword}
                    onChange={(e) => {
                      setConfirmPassword(e.target.value);
                      if (fieldErrors.confirmPassword) {
                        setFieldErrors((prev) => ({ ...prev, confirmPassword: undefined }));
                      }
                    }}
                    disabled={isLoading}
                    className={fieldErrors.confirmPassword ? "border-destructive pr-10" : "pr-10"}
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    disabled={isLoading}
                  >
                    {showConfirmPassword ? (
                      <EyeOff className="h-4 w-4 text-muted-foreground" />
                    ) : (
                      <Eye className="h-4 w-4 text-muted-foreground" />
                    )}
                  </Button>
                </div>
                {fieldErrors.confirmPassword && (
                  <p className="text-sm text-destructive">{fieldErrors.confirmPassword}</p>
                )}
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
                  "Đang xử lý..."
                ) : (
                  <>
                    <Lock className="mr-2 h-4 w-4" />
                    Đổi mật khẩu
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

