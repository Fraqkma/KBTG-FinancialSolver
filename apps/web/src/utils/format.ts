export const money = (amount: number) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'THB', maximumFractionDigits: 0 }).format(amount)
export const shortDate = (value: string) => new Intl.DateTimeFormat('en', { day: 'numeric', month: 'short' }).format(new Date(value))
