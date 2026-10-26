import { useEffect, useMemo, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import { FaPlus, FaPrint, FaTrash, FaCloudDownloadAlt } from 'react-icons/fa';
import {
  cms, errText, EXPENSE_CATEGORIES, Giving, givingName, GIVING_TYPES, label, METHODS, MON, naira, niceDate, Service, serviceName, todayISO,
} from '../lib';
import { Bars, Btn, Card, Confirm, Empty, ErrorBox, Field, inp, Loading, MemberPicker, Modal, PageHead, Stat, Tabs, useLoad } from '../ui';

// ---------------------------------------------------------------- date ranges
const iso = (d: Date) => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
const RANGES: [string, string, () => [string, string]][] = [
  ['month', 'This month', () => { const d = new Date(); return [iso(new Date(d.getFullYear(), d.getMonth(), 1)), todayISO()]; }],
  ['last', 'Last month', () => { const d = new Date(); return [iso(new Date(d.getFullYear(), d.getMonth() - 1, 1)), iso(new Date(d.getFullYear(), d.getMonth(), 0))]; }],
  ['quarter', 'Last 3 months', () => { const d = new Date(); return [iso(new Date(d.getFullYear(), d.getMonth() - 2, 1)), todayISO()]; }],
  ['year', 'This year', () => [`${new Date().getFullYear()}-01-01`, todayISO()]],
  ['lastyear', 'Last year', () => { const y = new Date().getFullYear() - 1; return [`${y}-01-01`, `${y}-12-31`]; }],
];
function useRange(def = 'month') {
  const [key, setKey] = useState(def);
  const [custom, setCustom] = useState<[string, string]>([todayISO(), todayISO()]);
  const range = key === 'custom' ? custom : RANGES.find((r) => r[0] === key)![2]();
  const picker = (
    <div className="flex flex-wrap items-center gap-2">
      <select className={`${inp} !w-auto py-2`} value={key} onChange={(e) => setKey(e.target.value)}>
        {RANGES.map(([k, l]) => <option key={k} value={k}>{l}</option>)}<option value="custom">Choose dates…</option>
      </select>
      {key === 'custom' && <>
        <input type="date" className={`${inp} !w-auto py-2`} value={custom[0]} onChange={(e) => setCustom([e.target.value, custom[1]])} />
        <span className="text-gray-500">to</span>
        <input type="date" className={`${inp} !w-auto py-2`} value={custom[1]} onChange={(e) => setCustom([custom[0], e.target.value])} />
      </>}
    </div>
  );
  return { from: range[0], to: range[1], picker, key };
}

// ================================================================ GIVING
export function GivingPage() {
  const [sp, setSp] = useSearchParams();
  const r = useRange();
  const list = useLoad<{ items: Giving[] }>(() => cms.get('/giving', { from: r.from, to: r.to }), [r.from, r.to]);
  const [batch, setBatch] = useState(!!sp.get('add'));
  const [edit, setEdit] = useState<Giving | null>(null);
  const [type, setType] = useState('');
  const items = (list.data?.items || []).filter((g) => !type || g.type === type);
  const total = items.reduce((a, g) => a + Number(g.amount), 0);
  const byType = useMemo(() => {
    const o: Record<string, number> = {}; (list.data?.items || []).forEach((g) => { o[g.type] = (o[g.type] || 0) + Number(g.amount); });
    return Object.entries(o).sort((a, b) => b[1] - a[1]);
  }, [list.data]);
  const importOnline = async () => {
    try { const x = await cms.post('/import/online-giving'); toast.success(x.imported ? `${x.imported} online payments brought in.` : 'No new online payments.'); list.reload(); } catch (e) { toast.error(errText(e)); }
  };
  return (
    <>
      <PageHead title="Giving" sub="Tithes, offerings, seeds and every other gift, by service or by person."
        actions={<><Btn kind="ghost" onClick={importOnline}><FaCloudDownloadAlt /> Bring in online giving</Btn><Btn kind="gold" onClick={() => setBatch(true)}><FaPlus /> Record giving</Btn></>} />
      <div className="mb-4 flex flex-wrap items-center gap-2">{r.picker}
        <select className={`${inp} !w-auto py-2`} value={type} onChange={(e) => setType(e.target.value)}><option value="">All kinds</option>{GIVING_TYPES.map(([k, l]) => <option key={k} value={k}>{l}</option>)}</select>
      </div>
      <div className="mb-4 grid grid-cols-2 gap-3 md:grid-cols-4">
        <Stat label={type ? givingName(type) : 'Total received'} value={naira(total)} sub={`${items.length} records`} tone="green" />
        {byType.slice(0, 3).map(([t, v]) => <Stat key={t} label={givingName(t)} value={naira(v)} tone="gold" />)}
      </div>
      {list.loading && !list.data ? <Loading /> : list.error ? <ErrorBox text={list.error} retry={list.reload} /> : !items.length ? (
        <Empty title="Nothing recorded in this period" text="After each service, record the offering, tithes and other gifts. Online giving from the website can be brought in with one button." action={<Btn kind="gold" onClick={() => setBatch(true)}><FaPlus /> Record giving</Btn>} />
      ) : (
        <div className="overflow-x-auto rounded-2xl border border-gray-200 bg-white shadow-sm">
          <table className="w-full text-left text-[15px]">
            <thead className="bg-gray-50 text-xs uppercase tracking-wide text-gray-500"><tr><th className="px-4 py-3">Date</th><th>From</th><th className="hidden sm:table-cell">For</th><th className="hidden md:table-cell">How</th><th className="px-4 text-right">Amount</th></tr></thead>
            <tbody className="divide-y divide-gray-100">{items.map((g) => (
              <tr key={g.id} className="cursor-pointer hover:bg-gray-50" onClick={() => setEdit(g)}>
                <td className="whitespace-nowrap px-4 py-2.5">{niceDate(g.date).replace(/ \d{4}$/, '')}</td>
                <td className="py-2.5">{g.member_id ? <Link onClick={(e) => e.stopPropagation()} to={`/cms/members/${g.member_id}`} className="font-medium text-primary-700 hover:underline">{g.member_name}</Link> : g.name || <span className="text-gray-500">General</span>}<span className="block text-sm text-gray-500 sm:hidden">{givingName(g.type)}</span></td>
                <td className="hidden sm:table-cell">{givingName(g.type)}{g.pledge_purpose ? ` (${g.pledge_purpose})` : ''}</td>
                <td className="hidden md:table-cell">{label(g.method)}{g.reference && !g.reference.startsWith('online#') ? ` · ${g.reference}` : ''}</td>
                <td className="px-4 text-right font-semibold">{naira(g.amount)}</td>
              </tr>
            ))}</tbody>
          </table>
        </div>
      )}
      {batch && <BatchGiving onClose={() => { setBatch(false); setSp({}); }} onSaved={() => { setBatch(false); setSp({}); list.reload(); }} />}
      {edit && <EditGiving g={edit} onClose={() => setEdit(null)} onSaved={() => { setEdit(null); list.reload(); }} />}
    </>
  );
}

type Row = { member_id: number | null; name: string; type: string; amount: string; method: string; reference: string; key: number };
let rk = 0;
const newRow = (type = 'offering'): Row => ({ member_id: null, name: '', type, amount: '', method: 'cash', reference: '', key: ++rk });

function BatchGiving({ onClose, onSaved }: { onClose: () => void; onSaved: () => void }) {
  const [date, setDate] = useState(todayISO());
  const [serviceId, setServiceId] = useState<string>('');
  const [rows, setRows] = useState<Row[]>([newRow('offering'), newRow('tithe')]);
  const [busy, setBusy] = useState(false);
  const svc = useLoad<{ items: Service[] }>(() => cms.get('/services', { from: date, to: date }), [date]);
  useEffect(() => { const s = svc.data?.items[0]; setServiceId(s ? String(s.id) : ''); }, [svc.data]);
  const set = (i: number, p: Partial<Row>) => setRows(rows.map((r, j) => (j === i ? { ...r, ...p } : r)));
  const amt = (s: string) => Number(String(s).replace(/[,\s₦]/g, '')) || 0;
  const total = rows.reduce((a, r) => a + amt(r.amount), 0);
  const save = async () => {
    const items = rows.filter((r) => amt(r.amount) > 0).map((r) => ({ ...r, amount: amt(r.amount), date, service_id: serviceId || null }));
    if (!items.length) { toast.error('Type at least one amount.'); return; }
    setBusy(true);
    try { const x = await cms.post('/giving', { items }); toast.success(`${x.saved} record${x.saved > 1 ? 's' : ''} saved: ${naira(total)}.`); onSaved(); } catch (e) { toast.error(errText(e)); } finally { setBusy(false); }
  };
  return (
    <Modal open wide title="Record giving" onClose={onClose} footer={<><span className="mr-auto self-center font-semibold">Total {naira(total)}</span><Btn kind="ghost" onClick={onClose}>Cancel</Btn><Btn kind="gold" onClick={save} disabled={busy}>Save all</Btn></>}>
      <div className="mb-4 grid gap-3 sm:grid-cols-2">
        <Field label="Date"><input type="date" className={inp} value={date} onChange={(e) => setDate(e.target.value)} /></Field>
        <Field label="Service (optional)"><select className={inp} value={serviceId} onChange={(e) => setServiceId(e.target.value)}><option value="">—</option>{(svc.data?.items || []).map((s) => <option key={s.id} value={s.id}>{serviceName(s)}</option>)}</select></Field>
      </div>
      <p className="mb-2 text-sm text-gray-600">One line per gift. For the general offering, leave “From” empty. For tithes, find the member so it shows on their statement.</p>
      <div className="space-y-3">
        {rows.map((r, i) => (
          <div key={r.key} className="grid gap-2 rounded-xl border border-gray-200 p-3 sm:grid-cols-[1.4fr_1fr_1fr_1fr_auto] sm:items-end">
            <Field label="From"><MemberPicker allowName value={r.member_id} onChange={(id, _m, typed) => set(i, { member_id: id, name: id ? '' : typed || '' })} placeholder="Member, or leave empty" /></Field>
            <Field label="For"><select className={inp} value={r.type} onChange={(e) => set(i, { type: e.target.value })}>{GIVING_TYPES.filter(([k]) => k !== 'pledge').map(([k, l]) => <option key={k} value={k}>{l}</option>)}</select></Field>
            <Field label="Amount (₦)"><input className={`${inp} font-semibold`} inputMode="decimal" value={r.amount} onChange={(e) => set(i, { amount: e.target.value })} placeholder="0" /></Field>
            <Field label="How"><select className={inp} value={r.method} onChange={(e) => set(i, { method: e.target.value })}>{METHODS.map(([k, l]) => <option key={k} value={k}>{l}</option>)}</select></Field>
            <button className="justify-self-end p-2 text-gray-400 hover:text-red-600" onClick={() => setRows(rows.filter((_, j) => j !== i))} aria-label="Remove line"><FaTrash /></button>
          </div>
        ))}
      </div>
      <div className="mt-3 flex flex-wrap gap-2">
        <Btn kind="soft" small onClick={() => setRows([...rows, newRow('tithe')])}><FaPlus /> Add a tithe</Btn>
        <Btn kind="soft" small onClick={() => setRows([...rows, newRow('thanksgiving')])}><FaPlus /> Add a thanksgiving</Btn>
        <Btn kind="soft" small onClick={() => setRows([...rows, newRow('offering')])}><FaPlus /> Add another line</Btn>
      </div>
    </Modal>
  );
}

function EditGiving({ g, onClose, onSaved }: { g: Giving; onClose: () => void; onSaved: () => void }) {
  const [x, setX] = useState<Giving>({ ...g });
  const [del, setDel] = useState(false);
  const save = async () => { try { await cms.put(`/giving/${g.id}`, x); toast.success('Saved.'); onSaved(); } catch (e) { toast.error(errText(e)); } };
  return (
    <Modal open title="Giving record" onClose={onClose} footer={<><Btn kind="danger" className="mr-auto" onClick={() => setDel(true)}><FaTrash /> Delete</Btn><Btn kind="ghost" onClick={onClose}>Cancel</Btn><Btn onClick={save}>Save</Btn></>}>
      <div className="space-y-3">
        <div className="grid gap-3 sm:grid-cols-2">
          <Field label="Date"><input type="date" className={inp} value={x.date} onChange={(e) => setX({ ...x, date: e.target.value })} /></Field>
          <Field label="Amount (₦)"><input className={inp} inputMode="decimal" value={x.amount} onChange={(e) => setX({ ...x, amount: e.target.value as any })} /></Field>
        </div>
        <Field label="From"><MemberPicker allowName value={x.member_id} onChange={(id, _m, typed) => setX({ ...x, member_id: id, name: id ? '' : typed ?? x.name })} /></Field>
        <div className="grid gap-3 sm:grid-cols-2">
          <Field label="For"><select className={inp} value={x.type} onChange={(e) => setX({ ...x, type: e.target.value })}>{GIVING_TYPES.map(([k, l]) => <option key={k} value={k}>{l}</option>)}</select></Field>
          <Field label="How"><select className={inp} value={x.method} onChange={(e) => setX({ ...x, method: e.target.value })}>{METHODS.map(([k, l]) => <option key={k} value={k}>{l}</option>)}</select></Field>
        </div>
        <Field label="Reference / note"><input className={inp} value={x.reference} onChange={(e) => setX({ ...x, reference: e.target.value })} /></Field>
      </div>
      <Confirm open={del} title="Delete this record?" text={`${givingName(g.type)} of ${naira(g.amount)} on ${niceDate(g.date)}. This is written in the activity log.`} onClose={() => setDel(false)}
        onOk={async () => { try { await cms.del(`/giving/${g.id}`); onSaved(); } catch (e) { toast.error(errText(e)); } }} />
    </Modal>
  );
}

// ================================================================ PLEDGES
type Pledge = { id: number; member_id: number | null; member_name: string | null; name: string; phone?: string; purpose: string; amount: number; due_date: string | null; notes: string; paid: number };
export function PledgesPage() {
  const list = useLoad<{ items: Pledge[] }>(() => cms.get('/pledges'), []);
  const [edit, setEdit] = useState<Pledge | null | 'new'>(null);
  const [pay, setPay] = useState<Pledge | null>(null);
  const items = list.data?.items || [];
  const owed = items.reduce((a, p) => a + Math.max(0, p.amount - p.paid), 0);
  return (
    <>
      <PageHead title="Pledges" sub="Promises for the building fund, harvest, projects… and how much has been paid." actions={<Btn onClick={() => setEdit('new')}><FaPlus /> New pledge</Btn>} />
      {items.length > 0 && <div className="mb-4 grid grid-cols-2 gap-3 md:grid-cols-3">
        <Stat label="Pledged" value={naira(items.reduce((a, p) => a + p.amount, 0))} />
        <Stat label="Paid so far" value={naira(items.reduce((a, p) => a + p.paid, 0))} tone="green" />
        <Stat label="Still to come" value={naira(owed)} tone="gold" />
      </div>}
      {list.loading && !list.data ? <Loading /> : list.error ? <ErrorBox text={list.error} /> : !items.length ? <Empty title="No pledges yet" action={<Btn onClick={() => setEdit('new')}><FaPlus /> New pledge</Btn>} /> : (
        <div className="grid gap-3 md:grid-cols-2">
          {items.map((p) => {
            const pct = Math.min(100, Math.round((p.paid / p.amount) * 100));
            return (
              <div key={p.id} className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm">
                <div className="flex justify-between gap-2"><b>{p.member_name || p.name || 'Someone'}</b><button className="text-sm font-semibold text-primary-700" onClick={() => setEdit(p)}>Edit</button></div>
                <p className="text-sm text-gray-600">{p.purpose}{p.due_date ? ` · by ${niceDate(p.due_date)}` : ''}</p>
                <div className="mt-3 h-2.5 overflow-hidden rounded-full bg-gray-100"><div className={`h-full ${pct >= 100 ? 'bg-emerald-500' : 'bg-secondary-500'}`} style={{ width: pct + '%' }} /></div>
                <div className="mt-2 flex items-center justify-between text-sm"><span><b>{naira(p.paid)}</b> of {naira(p.amount)} ({pct}%)</span>{pct < 100 && <Btn kind="soft" small onClick={() => setPay(p)}>Record a payment</Btn>}</div>
              </div>
            );
          })}
        </div>
      )}
      {edit && <PledgeForm p={edit === 'new' ? null : edit} onClose={() => setEdit(null)} onSaved={() => { setEdit(null); list.reload(); }} />}
      {pay && <PayPledge p={pay} onClose={() => setPay(null)} onSaved={() => { setPay(null); list.reload(); }} />}
    </>
  );
}
function PledgeForm({ p, onClose, onSaved }: { p: Pledge | null; onClose: () => void; onSaved: () => void }) {
  const [x, setX] = useState<any>(p ? { ...p } : { member_id: null, name: '', purpose: 'Building fund', amount: '', due_date: '', notes: '' });
  const [del, setDel] = useState(false);
  const save = async () => { try { if (p) await cms.put(`/pledges/${p.id}`, x); else await cms.post('/pledges', x); toast.success('Saved.'); onSaved(); } catch (e) { toast.error(errText(e)); } };
  return (
    <Modal open title={p ? 'Edit pledge' : 'New pledge'} onClose={onClose} footer={<>{p && <Btn kind="danger" className="mr-auto" onClick={() => setDel(true)}>Delete</Btn>}<Btn kind="ghost" onClick={onClose}>Cancel</Btn><Btn onClick={save}>Save</Btn></>}>
      <div className="space-y-3">
        <Field label="Who"><MemberPicker allowName value={x.member_id} onChange={(id, _m, typed) => setX({ ...x, member_id: id, name: id ? '' : typed ?? x.name })} /></Field>
        <Field label="For"><input className={inp} value={x.purpose} onChange={(e) => setX({ ...x, purpose: e.target.value })} /></Field>
        <div className="grid gap-3 sm:grid-cols-2">
          <Field label="Amount (₦)"><input className={inp} inputMode="decimal" value={x.amount} onChange={(e) => setX({ ...x, amount: e.target.value })} /></Field>
          <Field label="Pay by (optional)"><input className={inp} type="date" value={x.due_date || ''} onChange={(e) => setX({ ...x, due_date: e.target.value })} /></Field>
        </div>
      </div>
      <Confirm open={del} title="Delete this pledge?" text="Payments already recorded stay in Giving." onClose={() => setDel(false)} onOk={async () => { try { await cms.del(`/pledges/${p!.id}`); onSaved(); } catch (e) { toast.error(errText(e)); } }} />
    </Modal>
  );
}
function PayPledge({ p, onClose, onSaved }: { p: Pledge; onClose: () => void; onSaved: () => void }) {
  const [amount, setAmount] = useState(String(Math.max(0, p.amount - p.paid)));
  const [method, setMethod] = useState('transfer');
  const [date, setDate] = useState(todayISO());
  const save = async () => {
    try { await cms.post('/giving', { member_id: p.member_id, name: p.name, type: 'pledge', amount, method, date, pledge_id: p.id }); toast.success('Payment recorded.'); onSaved(); } catch (e) { toast.error(errText(e)); }
  };
  return (
    <Modal open title={`Payment: ${p.purpose}`} onClose={onClose} footer={<><Btn kind="ghost" onClick={onClose}>Cancel</Btn><Btn kind="gold" onClick={save}>Save</Btn></>}>
      <div className="grid gap-3 sm:grid-cols-3">
        <Field label="Amount (₦)"><input className={inp} inputMode="decimal" value={amount} onChange={(e) => setAmount(e.target.value)} /></Field>
        <Field label="How"><select className={inp} value={method} onChange={(e) => setMethod(e.target.value)}>{METHODS.map(([k, l]) => <option key={k} value={k}>{l}</option>)}</select></Field>
        <Field label="Date"><input className={inp} type="date" value={date} onChange={(e) => setDate(e.target.value)} /></Field>
      </div>
    </Modal>
  );
}

// ================================================================ EXPENSES
type Expense = { id: number; date: string; category: string; description: string; amount: number; paid_to: string; method: string; approved_by: string };
export function ExpensesPage() {
  const r = useRange();
  const list = useLoad<{ items: Expense[] }>(() => cms.get('/expenses', { from: r.from, to: r.to }), [r.from, r.to]);
  const [edit, setEdit] = useState<Expense | null | 'new'>(null);
  const items = list.data?.items || [];
  const total = items.reduce((a, e) => a + Number(e.amount), 0);
  return (
    <>
      <PageHead title="Expenses" sub="Money spent: diesel, salaries, repairs, welfare…" actions={<Btn onClick={() => setEdit('new')}><FaPlus /> Record an expense</Btn>} />
      <div className="mb-4 flex flex-wrap items-center gap-3">{r.picker}<span className="text-[15px]">Total: <b>{naira(total)}</b></span></div>
      {list.loading && !list.data ? <Loading /> : list.error ? <ErrorBox text={list.error} /> : !items.length ? <Empty title="No expenses in this period" action={<Btn onClick={() => setEdit('new')}><FaPlus /> Record an expense</Btn>} /> : (
        <div className="overflow-x-auto rounded-2xl border border-gray-200 bg-white shadow-sm">
          <table className="w-full text-left text-[15px]">
            <thead className="bg-gray-50 text-xs uppercase tracking-wide text-gray-500"><tr><th className="px-4 py-3">Date</th><th>What</th><th className="hidden md:table-cell">Paid to</th><th className="px-4 text-right">Amount</th></tr></thead>
            <tbody className="divide-y divide-gray-100">{items.map((e) => (
              <tr key={e.id} className="cursor-pointer hover:bg-gray-50" onClick={() => setEdit(e)}>
                <td className="whitespace-nowrap px-4 py-2.5">{niceDate(e.date).replace(/ \d{4}$/, '')}</td>
                <td><b className="font-medium">{e.category}</b>{e.description ? <span className="block text-sm text-gray-600">{e.description}</span> : null}</td>
                <td className="hidden md:table-cell">{e.paid_to}{e.approved_by ? <span className="block text-xs text-gray-500">Approved by {e.approved_by}</span> : null}</td>
                <td className="px-4 text-right font-semibold">{naira(e.amount)}</td>
              </tr>
            ))}</tbody>
          </table>
        </div>
      )}
      {edit && <ExpenseForm e={edit === 'new' ? null : edit} onClose={() => setEdit(null)} onSaved={() => { setEdit(null); list.reload(); }} />}
    </>
  );
}
function ExpenseForm({ e, onClose, onSaved }: { e: Expense | null; onClose: () => void; onSaved: () => void }) {
  const [x, setX] = useState<any>(e ? { ...e } : { date: todayISO(), category: 'Diesel & fuel', description: '', amount: '', paid_to: '', method: 'cash', approved_by: '' });
  const [del, setDel] = useState(false);
  const save = async () => { try { if (e) await cms.put(`/expenses/${e.id}`, x); else await cms.post('/expenses', x); toast.success('Saved.'); onSaved(); } catch (er) { toast.error(errText(er)); } };
  return (
    <Modal open title={e ? 'Expense' : 'Record an expense'} onClose={onClose} footer={<>{e && <Btn kind="danger" className="mr-auto" onClick={() => setDel(true)}>Delete</Btn>}<Btn kind="ghost" onClick={onClose}>Cancel</Btn><Btn onClick={save}>Save</Btn></>}>
      <div className="space-y-3">
        <div className="grid gap-3 sm:grid-cols-2">
          <Field label="Date"><input className={inp} type="date" value={x.date} onChange={(ev) => setX({ ...x, date: ev.target.value })} /></Field>
          <Field label="Amount (₦)"><input className={inp} inputMode="decimal" value={x.amount} onChange={(ev) => setX({ ...x, amount: ev.target.value })} /></Field>
        </div>
        <Field label="Kind of expense"><select className={inp} value={x.category} onChange={(ev) => setX({ ...x, category: ev.target.value })}>{EXPENSE_CATEGORIES.concat(EXPENSE_CATEGORIES.includes(x.category) ? [] : [x.category]).map((c) => <option key={c}>{c}</option>)}</select></Field>
        <Field label="Details"><input className={inp} value={x.description} onChange={(ev) => setX({ ...x, description: ev.target.value })} placeholder="e.g. 50 litres of diesel for Sunday" /></Field>
        <div className="grid gap-3 sm:grid-cols-3">
          <Field label="Paid to"><input className={inp} value={x.paid_to} onChange={(ev) => setX({ ...x, paid_to: ev.target.value })} /></Field>
          <Field label="How"><select className={inp} value={x.method} onChange={(ev) => setX({ ...x, method: ev.target.value })}>{METHODS.filter(([k]) => k !== 'online').map(([k, l]) => <option key={k} value={k}>{l}</option>)}</select></Field>
          <Field label="Approved by"><input className={inp} value={x.approved_by} onChange={(ev) => setX({ ...x, approved_by: ev.target.value })} /></Field>
        </div>
      </div>
      <Confirm open={del} title="Delete this expense?" text="This is written in the activity log." onClose={() => setDel(false)} onOk={async () => { try { await cms.del(`/expenses/${e!.id}`); onSaved(); } catch (er) { toast.error(errText(er)); } }} />
    </Modal>
  );
}

// ================================================================ REPORTS
type Fin = { from: string; to: string; income: number; expenses: number; balance: number; byType: { type: string; total: number; n: number }[]; byMethod: { method: string; total: number }[]; byCategory: { category: string; total: number; n: number }[]; months: { ym: string; income: number; expenses: number }[] };
export function ReportsPage() {
  const [tab, setTab] = useState<'money' | 'people'>('money');
  return (
    <>
      <PageHead title="Reports" sub="For the pastor, the church council and the annual general meeting." actions={<Btn kind="ghost" onClick={() => window.print()}><FaPrint /> Print</Btn>} />
      <div className="print:hidden"><Tabs value={tab} onChange={setTab} items={[['money', 'Money'], ['people', 'Attendance']]} /></div>
      {tab === 'money' ? <MoneyReport /> : <AttendanceReport />}
    </>
  );
}
function MoneyReport() {
  const r = useRange('year');
  const d = useLoad<Fin>(() => cms.get('/reports/finance', { from: r.from, to: r.to }), [r.from, r.to]);
  const ymLabel = (ym: string) => MON[Number(ym.slice(5)) - 1] + (r.key === 'year' || r.key === 'month' ? '' : ' ' + ym.slice(2, 4));
  return (
    <>
      <div className="mb-4 print:hidden">{r.picker}</div>
      <p className="mb-3 hidden text-lg font-bold print:block">Finance report: {niceDate(r.from)} to {niceDate(r.to)}</p>
      {d.loading && !d.data ? <Loading /> : d.error ? <ErrorBox text={d.error} /> : (() => {
        const x = d.data!;
        return (
          <div className="space-y-4">
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
              <Stat label="Money in" value={naira(x.income)} tone="green" />
              <Stat label="Money out" value={naira(x.expenses)} tone="accent" />
              <Stat label="Balance" value={naira(x.balance)} tone={x.balance >= 0 ? 'primary' : 'accent'} />
            </div>
            {x.months.length > 0 && <Card title="Month by month" actions={<span className="flex gap-3 text-xs text-gray-600"><span className="flex items-center gap-1"><i className="h-2.5 w-2.5 rounded-sm bg-primary-600" />In</span><span className="flex items-center gap-1"><i className="h-2.5 w-2.5 rounded-sm bg-secondary-400" />Out</span></span>}>
              <Bars money items={x.months.map((m) => ({ label: ymLabel(m.ym), value: m.income, value2: m.expenses }))} />
            </Card>}
            <div className="grid gap-4 md:grid-cols-2">
              <Card title="Money in, by kind">
                <table className="w-full text-[15px]"><tbody className="divide-y divide-gray-100">{x.byType.map((t) => <tr key={t.type}><td className="py-2">{givingName(t.type)}</td><td className="text-right text-sm text-gray-500">{t.n}×</td><td className="py-2 text-right font-semibold">{naira(t.total)}</td></tr>)}</tbody></table>
                {!x.byType.length && <p className="text-gray-600">Nothing yet.</p>}
                {x.byMethod.length > 0 && <p className="mt-3 text-sm text-gray-600">{x.byMethod.map((m) => `${label(m.method)} ${naira(m.total)}`).join(' · ')}</p>}
              </Card>
              <Card title="Money out, by kind">
                <table className="w-full text-[15px]"><tbody className="divide-y divide-gray-100">{x.byCategory.map((t) => <tr key={t.category}><td className="py-2">{t.category}</td><td className="text-right text-sm text-gray-500">{t.n}×</td><td className="py-2 text-right font-semibold">{naira(t.total)}</td></tr>)}</tbody></table>
                {!x.byCategory.length && <p className="text-gray-600">Nothing yet.</p>}
              </Card>
            </div>
          </div>
        );
      })()}
    </>
  );
}
function AttendanceReport() {
  const r = useRange('quarter');
  const d = useLoad<{ items: Service[] }>(() => cms.get('/services', { from: r.from, to: r.to }), [r.from, r.to]);
  const items = (d.data?.items || []).slice().reverse();
  const sun = items.filter((s) => s.type === 'sunday_service');
  const tot = (s: Service) => s.men + s.women + s.children || s.present || 0;
  const avg = (l: Service[], f: (s: Service) => number) => (l.length ? Math.round(l.reduce((a, s) => a + f(s), 0) / l.length) : 0);
  return (
    <>
      <div className="mb-4 print:hidden">{r.picker}</div>
      {d.loading && !d.data ? <Loading /> : d.error ? <ErrorBox text={d.error} /> : !items.length ? <Empty title="No services in this period" /> : (
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
            <Stat label="Sunday average" value={avg(sun, tot)} sub={`${sun.length} Sundays`} />
            <Stat label="Men / women / children" value={`${avg(sun, (s) => s.men)} / ${avg(sun, (s) => s.women)} / ${avg(sun, (s) => s.children)}`} sub="Sunday averages" tone="gold" />
            <Stat label="Online average" value={avg(sun, (s) => s.online)} tone="accent" />
            <Stat label="First timers" value={items.reduce((a, s) => a + (s.first_timers || 0), 0)} tone="green" />
          </div>
          <Card title="Every service">
            <Bars items={items.slice(-16).map((s) => ({ label: niceDate(s.date).replace(/ \d{4}$/, ''), value: tot(s) }))} />
            <table className="mt-4 w-full text-[15px]"><thead className="text-xs uppercase text-gray-500"><tr><th className="py-2 text-left">Service</th><th className="text-right">Men</th><th className="text-right">Women</th><th className="text-right">Children</th><th className="text-right">Total</th><th className="hidden text-right sm:table-cell">Online</th></tr></thead>
              <tbody className="divide-y divide-gray-100">{items.slice().reverse().map((s) => <tr key={s.id}><td className="py-2">{serviceName(s)} <span className="text-sm text-gray-500">{niceDate(s.date)}</span></td><td className="text-right">{s.men}</td><td className="text-right">{s.women}</td><td className="text-right">{s.children}</td><td className="text-right font-semibold">{tot(s)}</td><td className="hidden text-right sm:table-cell">{s.online}</td></tr>)}</tbody></table>
          </Card>
        </div>
      )}
    </>
  );
}
