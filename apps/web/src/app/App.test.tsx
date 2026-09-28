import { afterEach, expect, test, vi } from 'vitest'
import { cleanup, render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import App from './App'

afterEach(() => { cleanup(); vi.restoreAllMocks() })

const fixtures = {
  accounts: [{id:'daily',name:'Everyday account',kind:'Spending',account_mask:'•• 4821',balance:24780,accent:'coral'}],
  transactions: [{id:'t1',account_id:'daily',amount:32000,transaction_type:'income',category:'Salary',description:'Northstar Studio · Monthly pay',timestamp:'2026-09-25T09:10:00Z',recurring:false}],
  goals: [{id:'g1',name:'A laptop for side projects',target_amount:30000,current_amount:9200,target_date:'2027-03-01',priority:'High',status:'active'}],
  financialState: {period:'September 2026',monthly_income:32000,essential_expenses:12600,discretionary_spending:6400,current_balance:52480,emergency_reserve:18500,reserve_target:60000,available_for_plan:13000,constraints:['Set aside rent and recurring bills first']},
  plan: {id:'plan-1',income_period:'September 2026',available_income:13000,allocations:[{category:'Emergency reserve',amount:8000,reason:'Your reserve is below its selected target.',priority:1},{category:'Laptop goal',amount:5000,reason:'Moves your active goal forward with the amount left.',priority:2}],unallocated:0,status:'proposed',explanation:'Essential commitments are already protected.',created_at:'2026-09-25T00:00:00Z'},
}

function mockApi() { vi.stubGlobal('fetch', vi.fn(async (input: RequestInfo | URL) => {
  const path = String(input)
  const response = path.endsWith('/flow-sync/confirm') ? { accepted: true, message: 'Plan accepted in this demo. No money was moved.', plan: { ...fixtures.plan, status: 'accepted' } } : path.endsWith('/accounts') ? fixtures.accounts : path.endsWith('/transactions') ? fixtures.transactions : path.endsWith('/goals') ? fixtures.goals : path.endsWith('/financial-state') ? fixtures.financialState : fixtures.plan
  return { ok: true, json: async () => response }
})) }

test('home shows the prototype, payday and Flow Sync entry', async () => {
  mockApi(); render(<App/>)
  expect(await screen.findByText('Good morning, Alex')).toBeInTheDocument()
  expect(screen.getByText(/HACKATHON PROTOTYPE/i, { selector: '.prototype-chip' })).toBeInTheDocument()
  expect(screen.getByText(/A little payday/)).toBeInTheDocument()
})

test('user opens the plan and can accept its simulated recommendation', async () => {
  mockApi(); const user = userEvent.setup(); render(<App/>)
  await user.click(await screen.findByRole('link', { name: /Your monthly plan/i }))
  expect(await screen.findByText('Make payday feel more intentional')).toBeInTheDocument()
  expect(screen.getByText(/your financial picture/i)).toBeInTheDocument()
  await user.click(screen.getByRole('button', { name: /Accept this plan/i }))
  await waitFor(() => expect(screen.getByText(/No money was moved/i)).toBeInTheDocument())
})

test('shows safe error state when the API is unavailable', async () => {
  vi.stubGlobal('fetch', vi.fn(async () => { throw new Error('offline') }))
  render(<App/>)
  expect(await screen.findByText('We couldn’t prepare your view.')).toBeInTheDocument()
})
