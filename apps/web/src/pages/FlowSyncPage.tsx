import { useState, type Dispatch, type SetStateAction } from 'react'

import { ArrowRight, BadgeCheck, Goal as GoalIcon, Landmark, LockKeyhole, ShieldCheck, Sparkles } from 'lucide-react'

import { api } from '../services/api'

import { money } from '../utils/format'

import { Header, PageFrame } from '../components/BankingShell'

import type { Data } from '../types'



export function FlowSyncPage({ data, setData }: { data: Data; setData: Dispatch<SetStateAction<Data | null>> }) {
  const [confirming, setConfirming] = useState(false)
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')
  async function accept() { setConfirming(true); setError(''); try { const result = await api.confirm(data.plan.id); setData(current => current ? { ...current, plan: result.plan } : current); setMessage(result.message) } catch { setError('We couldn’t save that review. Your balances are unchanged; please try again.') } finally { setConfirming(false) } }
  return <PageFrame><Header eyebrow="FLOW SYNC · YOUR MONTHLY PLAN" title="Make payday feel more intentional" note="A clear picture of what’s coming in, what’s committed, and what’s yours to shape." action={<div className="plan-status"><i className={data.plan.status === 'accepted' ? 'done' : ''}/>{data.plan.status === 'accepted' ? 'Reviewed' : 'Ready to review'}</div>}/>
    <div className="flow-intro"><div className="flow-intro-icon"><Sparkles size={21}/></div><div><b>Your pay just arrived. Here’s a thoughtful place to start.</b><p>We use your monthly income, essential commitments, reserve target and active goal. You stay in control of every decision.</p></div><span className="flow-intro-badge">DEMO PLAN</span></div>
    <div className="stepper"><div className="step complete"><i><BadgeCheck size={14}/></i><span>Payday</span></div><div className="step-line complete-line"/><div className="step complete"><i>2</i><span>Your picture</span></div><div className="step-line complete-line"/><div className="step current"><i>3</i><span>Your plan</span></div><div className="step-line"/><div className="step"><i>4</i><span>Your call</span></div></div>
    <div className="flow-content-grid"><div className="panel plan-panel"><div className="section-heading"><div><div className="eyebrow">SEPTEMBER 2026</div><h2>A plan with room to breathe</h2><p>Essentials first. Then a little progress, at your pace.</p></div><span className="plan-sparkle"><Sparkles size={18}/></span></div><div className="plan-total"><span>AVAILABLE TO PLAN</span><strong>{money(data.plan.available_income)}</strong><small>From your {money(data.state.monthly_income)} monthly pay</small></div><div className="allocation-list">{data.plan.allocations.map((item,index)=><div className="allocation-row" key={item.category}><div className={`allocation-symbol alloc-${index}`}>{index===0?<Landmark size={17}/>:index===1?<ShieldCheck size={17}/>:<GoalIcon size={17}/>}</div><div className="allocation-copy"><div><b>{item.category}</b><strong>{money(item.amount)}</strong></div><p>{item.reason}</p></div></div>)}</div><div className="unallocated"><span>Left flexible for you</span><strong>{money(data.plan.unallocated)}</strong></div><div className="plan-explanation"><Sparkles size={16}/><p>{data.plan.explanation}</p></div>{message && <div className="success-message"><BadgeCheck size={16}/>{message}</div>}{error && <div className="error-message">{error}</div>}<div className="plan-actions"><button className="secondary-button" onClick={()=>setMessage('Your plan is ready to review. Adjustments are a future step in this demo.')}>Adjust this plan</button><button className="primary-button" onClick={accept} disabled={confirming || data.plan.status==='accepted'}>{confirming?'Saving…':data.plan.status==='accepted'?'Plan reviewed':'Accept this plan'} <ArrowRight size={16}/></button></div><div className="no-transfer-note"><LockKeyhole size={13}/> This only records your choice in the prototype. Nothing is transferred.</div></div>
      <aside className="flow-side"><div className="panel state-panel"><div className="section-heading"><div><div className="eyebrow">YOUR FINANCIAL PICTURE</div><h2>Before the plan</h2></div></div><div className="state-row"><span>Monthly income</span><b>{money(data.state.monthly_income)}</b></div><div className="state-row"><span>Essentials to protect</span><b>− {money(data.state.essential_expenses)}</b></div><div className="state-row"><span>Already spent flexibly</span><b>− {money(data.state.discretionary_spending)}</b></div><div className="state-total"><span>Room to plan</span><b>{money(data.state.available_for_plan)}</b></div><div className="constraints-title">WHAT WE KEPT IN MIND</div>{data.state.constraints.map(item=><div className="constraint" key={item}><BadgeCheck size={15}/><span>{item}</span></div>)}</div><div className="control-card"><div className="control-icon"><LockKeyhole size={18}/></div><b>You’re always in the driver’s seat.</b><p>This is a suggestion, not an automatic action. Review it, adjust it, or leave it for later.</p></div></aside></div>
  </PageFrame>
}
