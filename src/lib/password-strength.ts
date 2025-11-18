export type PasswordStrength = "weak" | "fair" | "good" | "strong";

export interface PasswordStrengthResult {
  strength: PasswordStrength;
  score: number; // 0-100
  feedback: string[];
}

export function calculatePasswordStrength(password: string): PasswordStrengthResult {
  if (!password) {
    return {
      strength: "weak",
      score: 0,
      feedback: [],
    };
  }

  let score = 0;
  const feedback: string[] = [];

  // Length checks
  if (password.length >= 6) {
    score += 10;
  } else {
    feedback.push("Tối thiểu 6 ký tự");
  }

  if (password.length >= 8) {
    score += 10;
  } else if (password.length >= 6) {
    feedback.push("Nên có ít nhất 8 ký tự");
  }

  if (password.length >= 12) {
    score += 10;
  }

  // Character variety checks
  const hasLowercase = /[a-z]/.test(password);
  const hasUppercase = /[A-Z]/.test(password);
  const hasNumbers = /[0-9]/.test(password);
  const hasSpecial = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password);

  if (hasLowercase) {
    score += 10;
  } else {
    feedback.push("Thêm chữ thường");
  }

  if (hasUppercase) {
    score += 10;
  } else {
    feedback.push("Thêm chữ hoa");
  }

  if (hasNumbers) {
    score += 15;
  } else {
    feedback.push("Thêm số");
  }

  if (hasSpecial) {
    score += 15;
  } else {
    feedback.push("Thêm ký tự đặc biệt");
  }

  // Bonus for variety
  const varietyCount = [hasLowercase, hasUppercase, hasNumbers, hasSpecial].filter(Boolean).length;
  if (varietyCount >= 3) {
    score += 10;
  }

  // Penalty for common patterns
  const commonPatterns = [
    /123456/,
    /password/i,
    /qwerty/i,
    /abc123/i,
    /admin/i,
  ];

  if (commonPatterns.some((pattern) => pattern.test(password))) {
    score = Math.max(0, score - 20);
    feedback.push("Tránh mật khẩu phổ biến");
  }

  // Penalty for repetition
  if (/(.)\1{2,}/.test(password)) {
    score = Math.max(0, score - 10);
    feedback.push("Tránh lặp lại ký tự");
  }

  // Penalty for sequential characters
  if (/123|abc|ABC|qwe|QWE/i.test(password)) {
    score = Math.max(0, score - 10);
    feedback.push("Tránh chuỗi ký tự liên tiếp");
  }

  // Determine strength level
  let strength: PasswordStrength;
  if (score < 30) {
    strength = "weak";
  } else if (score < 50) {
    strength = "fair";
  } else if (score < 70) {
    strength = "good";
  } else {
    strength = "strong";
  }

  // Cap score at 100
  score = Math.min(100, score);

  return {
    strength,
    score,
    feedback: feedback.slice(0, 3), // Limit to 3 feedback items
  };
}

export function getStrengthColor(strength: PasswordStrength): string {
  switch (strength) {
    case "weak":
      return "bg-red-500";
    case "fair":
      return "bg-orange-500";
    case "good":
      return "bg-yellow-500";
    case "strong":
      return "bg-green-500";
    default:
      return "bg-gray-500";
  }
}

export function getStrengthText(strength: PasswordStrength): string {
  switch (strength) {
    case "weak":
      return "Yếu";
    case "fair":
      return "Trung bình";
    case "good":
      return "Tốt";
    case "strong":
      return "Mạnh";
    default:
      return "";
  }
}

export function getStrengthTextColor(strength: PasswordStrength): string {
  switch (strength) {
    case "weak":
      return "text-red-600 dark:text-red-400";
    case "fair":
      return "text-orange-600 dark:text-orange-400";
    case "good":
      return "text-yellow-600 dark:text-yellow-400";
    case "strong":
      return "text-green-600 dark:text-green-400";
    default:
      return "text-muted-foreground";
  }
}

