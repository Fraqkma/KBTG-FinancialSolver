import type React from 'react'

import { useState } from 'react'

import { NavLink, useNavigate } from 'react-router-dom'

import { Activity, ArrowDownLeft, ArrowRight, Bell, ChevronRight, CircleHelp, CreditCard, Goal as GoalIcon, Home, LayoutDashboard, LockKeyhole, Menu, ShieldCheck, Sparkles, Wallet } from 'lucide-react'

import { money, shortDate } from '../utils/format'

import type { Transaction } from '../types'



const links = [
  { to: '/', label: 'Overview', icon: LayoutDashboard, end: true },
  { to: '/accounts', label: 'My accounts', icon: CreditCard },
  { to: '/transactions', label: 'Activity', icon: Activity },
  { to: '/goals', label: 'Goals', icon: GoalIcon },
  { to: '/finance', label: 'Money overview', icon: Wallet },
]

export function Shell({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useState(false)
  const navigate = useNavigate()
  return <div className="app-shell">
    <aside className={`sidebar ${open ? 'sidebar-open' : ''}`}>
      <a className="brand" href="/" aria-label="Flow Sync home"><span className="brand-mark"><span /></span><span>flow<span className="brand-light">sync</span></span></a>
      <div className="prototype-chip"><span /> HACKATHON PROTOTYPE</div>
      <div className="nav-label">YOUR MONEY</div>
      <nav className="main-nav">{links.map(({ to, label, icon: Icon, end }) => <NavLink key={to} to={to} end={end} onClick={() => setOpen(false)}><Icon size={18} strokeWidth={1.8} />{label}</NavLink>)}</nav>
      <div className="nav-label planning-label">PLAN AHEAD</div>
      <NavLink className="flow-link" to="/flow-sync" onClick={() => setOpen(false)}><span className="flow-icon"><Sparkles size={18} /></span><span><b>Flow Sync</b><small>Your monthly plan</small></span><ChevronRight size={16} /></NavLink>
      <div className="sidebar-bottom"><div className="help-card"><CircleHelp size={18} /><span>Here to help<small>Explore your demo</small></span><ArrowRight size={15} /></div><div className="profile"><div className="avatar">AM</div><span><b>Alex Morgan</b><small>Everyday member</small></span><button aria-label="Open settings" onClick={() => navigate('/settings')}><Menu size={17} /></button></div></div>
    </aside>
    {open && <button className="scrim" aria-label="Close navigation" onClick={() => setOpen(false)} />}
    <main className="main-area"><header className="topbar"><button className="mobile-menu" onClick={() => setOpen(true)} aria-label="Open navigation"><Menu size={21} /></button><div className="breadcrumb">Personal banking <span>/</span> <b>September 2026</b></div><div className="top-actions"><span className="secure-label"><LockKeyhole size={13} /> Demo environment</span><button className="icon-button" aria-label="Notifications"><Bell size={18} /><i /></button><div className="avatar top-avatar">AM</div></div></header>{children}<footer className="prototype-footer"><ShieldCheck size={14} /> Hackathon Prototype · All balances and activity are simulated. No real money moves.</footer></main>
  </div>
}

export function PageFrame({ children }: { children: React.ReactNode }) { return <div className="page-wrap">{children}</div> }

export function Header({ eyebrow, title, note, action }: { eyebrow: string; title: string; note?: string; action?: React.ReactNode }) { return <div className="page-heading"><div><div className="eyebrow">{eyebrow}</div><h1>{title}</h1>{note && <p>{note}</p>}</div>{action}</div> }

export function StatCard({ label, value, note, icon: Icon, color = 'red' }: { label: string; value: string; note: string; icon: typeof Wallet; color?: string }) { return <div className="stat-card"><div className={`stat-icon ${color}`}><Icon size={18} /></div><div className="stat-label">{label}</div><strong>{value}</strong><small>{note}</small></div> }

export function TransactionRows({ items }: { items: Transaction[] }) { return <div className="transaction-list">{items.map(item => <div className="transaction-row" key={item.id}><div className={`merchant-icon ${item.transaction_type === 'income' ? 'income-icon' : ''}`}>{item.transaction_type === 'income' ? <ArrowDownLeft size={17} /> : item.category === 'Home' ? <Home size={17} /> : <CreditCard size={17} />}</div><div className="merchant-info"><b>{item.description}</b><small>{item.category}{item.recurring ? ' · Recurring' : ''}</small></div><time>{shortDate(item.timestamp)}</time><strong className={item.amount > 0 ? 'positive' : ''}>{item.amount > 0 ? '+' : '−'}{money(Math.abs(item.amount)).replace('฿', '')} <small>THB</small></strong></div>)}</div> }
