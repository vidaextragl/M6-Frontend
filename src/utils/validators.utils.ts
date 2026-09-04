export function isStrongPassword(password: string): boolean {
  const hasMinLength = password.length >= 8
  const hasUppercase = /[A-Z]/.test(password)
  const hasNumber = /[0-9]/.test(password)
  const hasSpecialChar = /[-#!@$%^&_+=]/.test(password)
  return hasMinLength && hasUppercase && hasNumber && hasSpecialChar
}