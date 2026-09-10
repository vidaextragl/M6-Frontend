export function isStrongPassword(password: string): boolean {
  const hasMinLength = password.length >= 8
  const hasUppercase = /[A-Z]/.test(password)
  const hasNumber = /[0-9]/.test(password)
  const hasSpecialChar = /[-#!@$%^&*_+=]/.test(password)
  return hasMinLength && hasUppercase && hasNumber && hasSpecialChar
}

// El backend guarda los montos en columnas decimal(18,2): hasta 16 dígitos enteros + 2
// decimales. Validar esto en el frontend evita el viaje al backend solo para recibir un error
// genérico de "revisá los datos ingresados" sin explicar por qué.
export const MAX_AMOUNT_INTEGER_DIGITS = 16

export function getAmountValidationError(amount: string): string | null {
  const numericAmount = Number(amount)

  if (!Number.isFinite(numericAmount) || numericAmount <= 0) {
    return 'Enter an amount greater than zero.'
  }

  const integerDigits = amount.split('.')[0].replace(/^0+(?=\d)/, '').length

  if (integerDigits > MAX_AMOUNT_INTEGER_DIGITS) {
    return `Amount is too large — the maximum is ${MAX_AMOUNT_INTEGER_DIGITS} digits.`
  }

  return null
}