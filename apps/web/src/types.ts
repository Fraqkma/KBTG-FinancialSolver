export interface Account { id: string; name: string; kind: string; account_mask: string; balance: number; accent: string }
export interface Transaction { id: string; account_id: string; amount: number; transaction_type: string; category: string; description: string; timestamp: string; recurring: boolean }
export interface Goal { id: string; name: string; target_amount: number; current_amount: number; target_date: string; priority: string; status: string }
export interface FinancialState { period: string; monthly_income: number; essential_expenses: number; discretionary_spending: number; current_balance: number; emergency_reserve: number; reserve_target: number; available_for_plan: number; constraints: string[] }
export interface AllocationItem { category: string; amount: number; reason: string; priority: number }
export interface AllocationPlan { id: string; income_period: string; available_income: number; allocations: AllocationItem[]; unallocated: number; status: 'proposed' | 'accepted'; explanation: string; created_at: string }

export type Data = { accounts: Account[]; transactions: Transaction[]; goals: Goal[]; state: FinancialState; plan: AllocationPlan }
