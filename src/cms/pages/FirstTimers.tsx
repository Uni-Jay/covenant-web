import { useEffect, useMemo, useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import { QRCodeSVG } from 'qrcode.react';
import { FaPhone, FaPlus, FaQrcode, FaWhatsapp, FaUserCheck } from 'react-icons/fa';
import { ago, cms, errText, FirstTimer, forgetMembers, FT_STATUS, niceDate, todayISO, waLink } from '../lib';
import { Badge, Btn, Empty, ErrorBox, Field, inp, Loading, MemberPicker, Modal, PageHead, Search, Tabs, useLoad } from '../ui';

const tone = (s: string) => ({ new: 'red', contacted: 'gold', returned: 'blue', member: 'green', not_interested: 'gray' } as any)[s] || 'gray';
const stName = (s: string) => FT_STATUS.find((x) => x[0] === s)?.[1] || s;
const welcome = (f: FirstTimer) => {
  const first = f.name.replace(/^(bro\.?|sis\.?|mr\.?|mrs\.?|miss|dr\.?)\s+/i, '').split(' ')[0];
  return `Hello ${first}, thank you for worshipping with us at Household Of Covenant And Faith Apostolic Ministry, Ikorodu. 🙏 We were so glad to have you, and we would love to see you again this Sunday at 9 am. God bless you!`;
};

export default function FirstTimers() {
  const [sp, setSp] = useSearchParams();
  const list = useLoad<{ items: FirstTimer[] }>(() => cms.get('/first-timers'), []);
  const [tab, setTab] = useState<'todo' | 'all'>('todo');
  const [q, setQ] = useState('');
  const [open, setOpen] = useState<number | null>(null);
  const [adding, setAdding] = useState(!!sp.get('add'));
  const [qr, setQr] = useState(false);
  const shown = useMemo(() => {
    const t = q.trim().toLowerCase();
    return (list.data?.items || []).filter((f) => (tab === 'all' || ['new', 'contacted', 'returned'].includes(f.status)) && (!t || f.name.toLowerCase().includes(t) || f.phone.includes(t)));
  }, [list.data, tab, q]);
  const formUrl = `${location.origin}/welcome`;

  return (
    <>
      <PageHead title="First timers" sub="Everyone who visits for the first time: welcome them, follow up, and help them settle in."
        actions={<><Btn kind="ghost" onClick={() => setQr(true)}><FaQrcode /> Welcome card QR</Btn><Btn onClick={() => setAdding(true)}><FaPlus /> Add a first timer</Btn></>} />
      <Tabs value={tab} onChange={setTab} items={[['todo', 'To follow up'], ['all', 'Everyone']]} />
      <div className="mb-4 max-w-md"><Search value={q} onChange={setQ} placeholder="Search by name or phone" /></div>
      {list.loading && !list.data ? <Loading /> : list.error ? <ErrorBox text={list.error} retry={list.reload} /> : !shown.length ? (
        <Empty title={tab === 'todo' ? 'No one waiting for follow-up' : 'No first timers yet'}
          text="Visitors can fill the welcome card on their own phones: show the QR code on the church screen or print it for the ushers." action={<Btn kind="ghost" onClick={() => setQr(true)}><FaQrcode /> Show the QR code</Btn>} />
      ) : (
        <div className="grid gap-3 md:grid-cols-2">
          {shown.map((f) => {
            const wa = waLink(f.phone, welcome(f));
            return (
              <div key={f.id} className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm">
                <button className="w-full text-left" onClick={() => setOpen(f.id)}>
                  <div className="flex items-start justify-between gap-2"><b className="text-gray-900">{f.name}</b><Badge tone={tone(f.status)}>{stName(f.status)}</Badge></div>
                  <p className="text-sm text-gray-600">Visited {niceDate(f.visit_date, true)}{f.invited_by ? ` · invited by ${f.invited_by}` : f.how_heard ? ` · ${f.how_heard}` : ''}</p>
                  <p className="mt-1 text-sm text-gray-500">{f.followups ? `${f.followups} follow-up${f.followups > 1 ? 's' : ''}, last ${ago(f.last_followup)}` : 'Not contacted yet'}{f.assigned_name ? ` · with ${f.assigned_name}` : ''}</p>
                </button>
                <div className="mt-3 flex flex-wrap gap-2">
                  {f.phone && <a href={`tel:${f.phone}`}><Btn kind="ghost" small><FaPhone /> Call</Btn></a>}
                  {wa && <a href={wa} target="_blank" rel="noreferrer"><Btn kind="ghost" small><FaWhatsapp /> Welcome message</Btn></a>}
                  <Btn kind="soft" small onClick={() => setOpen(f.id)}>Follow up</Btn>
                </div>
              </div>
            );
          })}
        </div>
      )}
      {adding && <AddFirstTimer onClose={() => { setAdding(false); if (sp.get('add')) setSp({}); }} onSaved={() => { setAdding(false); setSp({}); list.reload(); }} />}
      {open && <FirstTimerPanel id={open} onClose={() => setOpen(null)} onChanged={list.reload} />}
      <Modal open={qr} title="Welcome card for visitors" onClose={() => setQr(false)}>
        <div className="flex flex-col items-center text-center">
          <QRCodeSVG value={formUrl} size={220} level="L" marginSize={4} />
          <p className="mt-3 text-[15px] text-gray-700">Visitors scan this with their phone camera and fill a short welcome card. It comes straight to this list.</p>
          <p className="mt-2 font-semibold">{formUrl.replace(/^https?:\/\//, '')}</p>
          <p className="mt-3 text-sm text-gray-500">Tip: put a screenshot of this on the church screen during the welcome of first timers, or print it for the ushers.</p>
        </div>
      </Modal>
    </>
  );
}

function AddFirstTimer({ onClose, onSaved }: { onClose: () => void; onSaved: () => void }) {
  const [x, setX] = useState<Partial<FirstTimer>>({ name: '', phone: '', email: '', address: '', gender: '', visit_date: todayISO(), invited_by: '', how_heard: '', wants: '', prayer: '' });
  const [busy, setBusy] = useState(false);
  const set = (k: keyof FirstTimer, v: any) => setX({ ...x, [k]: v });
  const save = async () => {
    if (!x.name?.trim()) { toast.error('Type the name.'); return; }
    setBusy(true);
    try { await cms.post('/first-timers', x); toast.success('Added.'); onSaved(); } catch (e) { toast.error(errText(e)); } finally { setBusy(false); }
  };
  return (
    <Modal open title="Add a first timer" onClose={onClose} footer={<><Btn kind="ghost" onClick={onClose}>Cancel</Btn><Btn onClick={save} disabled={busy}>Save</Btn></>}>
      <div className="space-y-3">
        <Field label="Name"><input className={inp} value={x.name} onChange={(e) => set('name', e.target.value)} autoFocus /></Field>
        <div className="grid gap-3 sm:grid-cols-2">
          <Field label="Phone"><input className={inp} type="tel" value={x.phone} onChange={(e) => set('phone', e.target.value)} /></Field>
          <Field label="Gender"><select className={inp} value={x.gender} onChange={(e) => set('gender', e.target.value)}><option value="">—</option><option value="male">Male</option><option value="female">Female</option></select></Field>
        </div>
        <Field label="Address / area"><input className={inp} value={x.address} onChange={(e) => set('address', e.target.value)} /></Field>
        <div className="grid gap-3 sm:grid-cols-2">
          <Field label="Date of visit"><input className={inp} type="date" value={x.visit_date} onChange={(e) => set('visit_date', e.target.value)} /></Field>
          <Field label="Invited by"><input className={inp} value={x.invited_by} onChange={(e) => set('invited_by', e.target.value)} /></Field>
        </div>
        <Field label="Prayer request (optional)"><textarea className={`${inp} min-h-[70px]`} value={x.prayer} onChange={(e) => set('prayer', e.target.value)} /></Field>
      </div>
    </Modal>
  );
}

function FirstTimerPanel({ id, onClose, onChanged }: { id: number; onClose: () => void; onChanged: () => void }) {
  const d = useLoad<{ item: FirstTimer; followups: { id: number; note: string; by_name: string; at: string }[] }>(() => cms.get(`/first-timers/${id}`), [id]);
  const [note, setNote] = useState('');
  const [status, setStatus] = useState('');
  const nav = useNavigate();
  useEffect(() => { if (d.data) setStatus(d.data.item.status); }, [d.data]);
  const f = d.data?.item;
  const addNote = async () => {
    if (!note.trim()) { toast.error('Type what happened, e.g. “Called her, she will come on Sunday”.'); return; }
    try { await cms.post(`/first-timers/${id}/followups`, { note, status: status !== f!.status ? status : undefined }); setNote(''); d.reload(); onChanged(); } catch (e) { toast.error(errText(e)); }
  };
  const save = async (patch: Partial<FirstTimer>) => { try { await cms.put(`/first-timers/${id}`, { ...f, ...patch }); d.reload(); onChanged(); } catch (e) { toast.error(errText(e)); } };
  const convert = async () => {
    try { const r = await cms.post(`/first-timers/${id}/convert`); forgetMembers(); toast.success(`${f!.name} is now in the register.`); onChanged(); nav(`/cms/members/${r.id}`); } catch (e) { toast.error(errText(e)); }
  };
  return (
    <Modal open wide title={f ? f.name : 'First timer'} onClose={onClose}>
      {!f ? <Loading /> : (
        <div className="grid gap-5 md:grid-cols-2">
          <div className="space-y-2 text-[15px]">
            <p><span className="text-gray-500">Phone:</span> {f.phone || '—'}</p>
            {f.email && <p><span className="text-gray-500">Email:</span> {f.email}</p>}
            {f.address && <p><span className="text-gray-500">Area:</span> {f.address}</p>}
            <p><span className="text-gray-500">Visited:</span> {niceDate(f.visit_date, true)}</p>
            {f.invited_by && <p><span className="text-gray-500">Invited by:</span> {f.invited_by}</p>}
            {f.how_heard && <p><span className="text-gray-500">Heard about us:</span> {f.how_heard}</p>}
            {f.wants && <p><span className="text-gray-500">Would like:</span> {f.wants}</p>}
            {f.prayer && <p className="rounded-lg bg-secondary-50 p-3"><span className="block text-xs font-bold uppercase text-secondary-700">Prayer request</span>{f.prayer}</p>}
            <Field label="Who is following up" className="pt-2"><MemberPicker value={f.assigned_to} onChange={(mid) => save({ assigned_to: mid })} placeholder="Choose a worker" /></Field>
            {f.member_id ? <Link to={`/cms/members/${f.member_id}`} className="inline-block pt-2 font-semibold text-primary-700">Open their member record →</Link>
              : <Btn kind="gold" className="mt-2" onClick={convert}><FaUserCheck /> Make a member</Btn>}
          </div>
          <div>
            <p className="mb-2 font-semibold">Follow-up</p>
            <textarea className={`${inp} min-h-[80px]`} value={note} onChange={(e) => setNote(e.target.value)} placeholder="What happened? e.g. Called, she will come on Sunday" />
            <div className="mt-2 flex gap-2">
              <select className={inp} value={status} onChange={(e) => setStatus(e.target.value)}>{FT_STATUS.map(([k, l]) => <option key={k} value={k}>{l}</option>)}</select>
              <Btn onClick={addNote}>Save</Btn>
            </div>
            <ul className="mt-4 space-y-3">
              {d.data!.followups.map((x) => (
                <li key={x.id} className="rounded-lg border border-gray-100 bg-gray-50 p-3 text-[15px]"><p>{x.note}</p><p className="mt-1 text-xs text-gray-500">{x.by_name || 'Staff'} · {new Date(x.at).toLocaleString('en-NG', { dateStyle: 'medium', timeStyle: 'short' })}</p></li>
              ))}
              {!d.data!.followups.length && <li className="text-sm text-gray-500">No follow-up yet.</li>}
            </ul>
          </div>
        </div>
      )}
    </Modal>
  );
}
