import { LockKeyhole, ShieldCheck } from 'lucide-react'

import { Header, PageFrame } from '../components/BankingShell'



export function SettingsPage() { return <PageFrame><Header eyebrow="YOUR DEMO" title="Settings" note="A little context about this prototype experience."/><div className="panel settings-panel"><div className="settings-row"><div className="settings-icon"><ShieldCheck size={18}/></div><div><b>Hackathon prototype</b><p>Flow Sync uses fictional financial data to demonstrate a financial decision-support experience.</p></div><span className="setting-tag">ACTIVE</span></div><div className="settings-row"><div className="settings-icon"><LockKeyhole size={18}/></div><div><b>Local-only demo</b><p>No real bank connections, external services, or money transfers are enabled.</p></div><span className="setting-tag">OFFLINE READY</span></div></div></PageFrame> }