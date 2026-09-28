import type { Account, AllocationPlan, FinancialState, Goal, Transaction } from '../types'

const base = import.meta.env.VITE_API_BASE_URL ?? '/api'

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const response = await fetch(`${base}${path}`, { ...init, headers: { 'Content-Type': 'application/json', ...init?.headers } })
  if (!response.ok) throw new Error(`Request failed (${response.status})`)
  return response.json() as Promise<T>
}

export const api = {
  accounts: () => request<Account[]>('/accounts'),
  transactions: () => request<Transaction[]>('/transactions'),
  goals: () => request<Goal[]>('/goals'),
  financialState: () => request<FinancialState>('/financial-state'),
  plan: () => request<AllocationPlan>('/flow-sync/plan'),
  confirm: (id: string) => request<{ accepted: boolean; message: string; plan: AllocationPlan }>('/flow-sync/confirm', { method: 'POST', body: JSON.stringify({ plan_id: id }) }),
}
