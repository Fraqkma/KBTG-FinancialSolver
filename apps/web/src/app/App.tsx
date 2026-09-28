import { useEffect, useState } from 'react'

import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { ArrowRight, Sparkles, X } from 'lucide-react'

import { Shell, Header, PageFrame } from '../components/BankingShell'

import { AccountsPage, Dashboard, FinancePage, GoalsPage, TransactionsPage } from '../pages/BankingPages'

import { FlowSyncPage } from '../pages/FlowSyncPage'

import { SettingsPage } from '../pages/SettingsPage'

import { api } from '../services/api'

import type { Data } from '../types'



function useDemoData() {
  const [data, setData] = useState<Data | null>(null)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(true)
  useEffect(() => {
    Promise.all([api.accounts(), api.transactions(), api.goals(), api.financialState(), api.plan()])
      .then(([accounts, transactions, goals, state, plan]) => setData({ accounts, transactions, goals, state, plan }))
      .catch(() => setError('We couldn’t load your demo data. Check that the local API is running, then try again.'))
      .finally(() => setLoading(false))
  }, [])
  return { data, error, loading, setData }
}

function AppContent() {
  const { data, error, loading, setData } = useDemoData()
  if (loading) return <div className="loading-screen"><div className="loading-mark"><Sparkles size={20}/></div><b>Getting things in order…</b><span>Loading your demo money picture</span></div>
  return <Shell>{error || !data ? <PageFrame><div className="error-panel"><div className="error-symbol"><X size={21}/></div><h1>We couldn’t prepare your view.</h1><p>{error || 'Demo data is unavailable.'}</p><button className="primary-button" onClick={()=>location.reload()}>Try again <ArrowRight size={15}/></button></div></PageFrame> : <Routes><Route path="/" element={<Dashboard data={data}/>} /><Route path="/accounts" element={<AccountsPage data={data}/>} /><Route path="/transactions" element={<TransactionsPage data={data}/>} /><Route path="/goals" element={<GoalsPage data={data}/>} /><Route path="/finance" element={<FinancePage data={data}/>} /><Route path="/flow-sync" element={<FlowSyncPage data={data} setData={setData}/>} /><Route path="/flow-sync/plan" element={<FlowSyncPage data={data} setData={setData}/>} /><Route path="/settings" element={<SettingsPage/>} /><Route path="*" element={<PageFrame><Header eyebrow="NOT FOUND" title="This page wandered off" note="Choose an option from your money menu to find your way back."/></PageFrame>} /></Routes>}</Shell>
}

export default function App() { return <BrowserRouter><AppContent/></BrowserRouter> }
