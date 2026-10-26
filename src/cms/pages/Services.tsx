import { useEffect, useMemo, useState } from 'react';
import { Link, useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import { QRCodeSVG } from 'qrcode.react';
import { FaArrowLeft, FaCheck, FaExpand, FaPhone, FaPlus, FaWhatsapp } from 'react-icons/fa';
import { ago, cms, errText, getMembersCached, Member, nameOf, niceDate, Service, serviceName, SERVICE_TYPES, todayISO, waLink } from '../lib';
import { Avatar, Badge, Btn, Card, Confirm, Empty, ErrorBox, Field, inp, Loading, Modal, PageHead, Search, Tabs, useLoad } from '../ui';

const total = (s: Service) => s.men + s.women + s.children;
const defaultType = () => ({ 0: 'sunday_service', 2: 'prayer', 4: 'bible_study', 5: 'vigil' } as Record<number, string>)[new Date().getDay()] || 'other';

export default function Services() {
  const [sp, setSp] = useSearchParams();
  const tab = sp.get('absent') ? 'away' : 'services';
  const list = useLoad<{ items: Service[] }>(() => cms.get('/services'), []);
  const [adding, setAdding] = useState(false);
  return (
    <>
      <PageHead title="Attendance" sub="Count everyone, mark who came, and let members check themselves in with a QR code."
        actions={<Btn onClick={() => setAdding(true)}><FaPlus /> New service</Btn>} />
      <Tabs value={tab} onChange={(v) => setSp(v === 'away' ? { absent: '1' } : {})} items={[['services', 'Services'], ['away', 'Who has been away']]} />
      {tab === 'away' ? <Away /> : list.loading && !list.data ? <Loading /> : list.error ? <ErrorBox text={list.error} retry={list.reload} /> : !list.data!.items.length ? (
        <Empty title="No services yet" text="Start one on the day of the service: count the people, and mark the members who came." action={<Btn onClick={() => setAdding(true)}><FaPlus /> New service</Btn>} />
      ) : (
        <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
          <table className="w-full text-left text-[15px]">
            <thead className="bg-gray-50 text-xs uppercase tracking-wide text-gray-500"><tr><th className="px-4 py-3">Service</th><th className="px-2 text-right">In church</th><th className="hidden px-2 text-right sm:table-cell">Online</th><th className="hidden px-2 text-right md:table-cell">Marked</th><th className="hidden px-4 text-right md:table-cell">First timers</th></tr></thead>
            <tbody className="divide-y divide-gray-100">
              {list.data!.items.map((s) => (
                <tr key={s.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3"><Link to={`/cms/services/${s.id}`} className="block"><b className="text-gray-900">{serviceName(s)}</b><span className="block text-sm text-gray-600">{niceDate(s.date, true)} {s.checkin_open ? <Badge tone="green">check-in open</Badge> : null}</span></Link></td>
                  <td className="px-2 text-right font-semibold">{total(s) || '—'}</td>
                  <td className="hidden px-2 text-right sm:table-cell">{s.online || '—'}</td>
                  <td className="hidden px-2 text-right md:table-cell">{s.present || '—'}</td>
                  <td className="hidden px-4 text-right md:table-cell">{s.first_timers || '—'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      <NewService open={adding} onClose={() => setAdding(false)} />
    </>
  );
}

function NewService({ open, onClose }: { open: boolean; onClose: () => void }) {
  const nav = useNavigate();
  const [x, setX] = useState({ date: todayISO(), type: defaultType(), title: '', checkin_open: true });
  const [busy, setBusy] = useState(false);
  const save = async () => {
    setBusy(true);
    try { const r = await cms.post('/services', x); nav(`/cms/services/${r.id}`); } catch (e) { toast.error(errText(e)); } finally { setBusy(false); }
  };
  return (
    <Modal open={open} title="New service" onClose={onClose} footer={<><Btn kind="ghost" onClick={onClose}>Cancel</Btn><Btn onClick={save} disabled={busy}>Start</Btn></>}>
      <div className="space-y-3">
        <div className="grid gap-3 sm:grid-cols-2">
          <Field label="Date"><input className={inp} type="date" value={x.date} onChange={(e) => setX({ ...x, date: e.target.value })} /></Field>
          <Field label="Kind of service"><select className={inp} value={x.type} onChange={(e) => setX({ ...x, type: e.target.value })}>{SERVICE_TYPES.map(([k, l]) => <option key={k} value={k}>{l}</option>)}</select></Field>
        </div>
        <Field label="Name (optional)" hint="e.g. Thanksgiving Service, Youth Week Day 2"><input className={inp} value={x.title} onChange={(e) => setX({ ...x, title: e.target.value })} /></Field>
        <label className="flex items-center gap-2 text-[15px]"><input type="checkbox" className="h-4 w-4" checked={x.checkin_open} onChange={(e) => setX({ ...x, checkin_open: e.target.checked })} /> Let members check themselves in with the QR code</label>
      </div>
    </Modal>
  );
}

function Away() {
  const [weeks, setWeeks] = useState(4);
  const d = useLoad<{ services: number; items: (Member & { last_seen: string | null })[] }>(() => cms.get('/attendance/absent', { weeks }), [weeks]);
  return (
    <>
      <div className="mb-3 flex flex-wrap items-center gap-2 text-[15px]">Members and workers not marked present in the last
        <select className={`${inp} !w-auto py-1.5`} value={weeks} onChange={(e) => setWeeks(Number(e.target.value))}>{[2, 3, 4, 6, 8, 12].map((w) => <option key={w} value={w}>{w} weeks</option>)}</select>
      </div>
      {d.loading && !d.data ? <Loading /> : d.error ? <ErrorBox text={d.error} /> : !d.data!.services ? (
        <Empty title="Not enough attendance yet" text="This list works once you mark who came to services (open a service and tick the members present)." />
      ) : !d.data!.items.length ? <Empty title="Everyone has been in church 🎉" /> : (
        <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
          <p className="border-b border-gray-100 px-4 py-3 text-sm text-gray-600">{d.data!.items.length} people to check on. A call or a WhatsApp message goes a long way.</p>
          <ul className="divide-y divide-gray-100">{d.data!.items.map((m) => {
            const wa = waLink(m.phone, `Hello ${m.title ? m.title + ' ' : ''}${m.first_name}, we have missed you in church. We hope you and your family are well. Is there anything we can pray with you about? God bless you. ❤️`);
            return (
              <li key={m.id} className="flex items-center gap-3 px-4 py-2.5">
                <Link to={`/cms/members/${m.id}`} className="flex min-w-0 flex-1 items-center gap-3"><Avatar m={m} size={34} /><span className="min-w-0"><b className="block truncate">{nameOf(m)}</b><span className="text-sm text-gray-600">Last in church: {m.last_seen ? `${niceDate(m.last_seen)} (${ago(m.last_seen)})` : 'not marked yet'}</span></span></Link>
                {m.phone && <a href={`tel:${m.phone}`} className="p-2 text-gray-500 hover:text-primary-700"><FaPhone /></a>}
                {wa && <a href={wa} target="_blank" rel="noreferrer" className="p-2 text-gray-500 hover:text-emerald-700"><FaWhatsapp /></a>}
              </li>
            );
          })}</ul>
        </div>
      )}
    </>
  );
}

export function ServiceDetail() {
  const { id } = useParams();
  const nav = useNavigate();
  const svc = useLoad<{ items: Service[] }>(() => cms.get('/services'), [id]);
  const att = useLoad<{ items: { member_id: number; method: string }[] }>(() => cms.get(`/services/${id}/attendance`), [id]);
  const [members, setMembers] = useState<Member[]>([]);
  const [q, setQ] = useState('');
  const [onlyPresent, setOnlyPresent] = useState(false);
  const [family, setFamily] = useState(true);
  const [count, setCount] = useState({ men: '', women: '', children: '', online: '' });
  const [big, setBig] = useState(false);
  const [del, setDel] = useState(false);
  useEffect(() => { getMembersCached().then(setMembers).catch(() => {}); }, []);
  const s = svc.data?.items.find((x) => String(x.id) === id);
  useEffect(() => { if (s) setCount({ men: String(s.men || ''), women: String(s.women || ''), children: String(s.children || ''), online: String(s.online || '') }); }, [s?.id]);
  // members' self check-ins come in while the page is open
  useEffect(() => { const t = setInterval(() => att.reload(), 20000); return () => clearInterval(t); }, [att.reload]);
  const present = useMemo(() => new Set((att.data?.items || []).map((a) => a.member_id)), [att.data]);
  const shown = useMemo(() => {
    const t = q.trim().toLowerCase();
    return members.filter((m) => m.status !== 'inactive' && (!onlyPresent || present.has(m.id)) && (!t || nameOf(m).toLowerCase().includes(t) || m.phone.replace(/\D/g, '').includes(t.replace(/\D/g, '') || '§')));
  }, [members, q, onlyPresent, present]);

  if (!s) return svc.loading ? <Loading /> : <ErrorBox text="This service isn’t there any more." />;
  const url = `${location.origin}/my/checkin?code=${s.checkin_code}`;
  const update = async (body: any, msg?: string) => { try { await cms.put(`/services/${s.id}`, body); if (msg) toast.success(msg); svc.reload(); } catch (e) { toast.error(errText(e)); } };
  const toggle = async (m: Member) => {
    const on = !present.has(m.id);
    att.setData({ items: on ? [...(att.data?.items || []), { member_id: m.id, method: 'staff' }] : (att.data?.items || []).filter((a) => a.member_id !== m.id) });
    try { await cms.post(`/services/${s.id}/attendance`, { member_id: m.id, family: on && family, present: on }); if (on && family && m.family_id) att.reload(); }
    catch (e) { toast.error(errText(e)); att.reload(); }
  };
  const n = (v: string) => Math.max(0, parseInt(v || '0', 10) || 0);
  const sum = n(count.men) + n(count.women) + n(count.children);

  return (
    <>
      <Link to="/cms/services" className="mb-3 inline-flex items-center gap-2 text-sm font-semibold text-primary-700"><FaArrowLeft /> Attendance</Link>
      <PageHead title={serviceName(s)} sub={niceDate(s.date, true)} />
      <div className="grid gap-4 lg:grid-cols-[1fr_340px]">
        <div className="space-y-4">
          <Card title="Head count" actions={<span className="text-sm text-gray-600">In church: <b className="text-gray-900">{sum}</b></span>}>
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
              {(['men', 'women', 'children', 'online'] as const).map((k) => (
                <Field key={k} label={k === 'online' ? 'Online viewers' : k[0].toUpperCase() + k.slice(1)}>
                  <input className={`${inp} text-lg font-semibold`} inputMode="numeric" value={count[k]} onChange={(e) => setCount({ ...count, [k]: e.target.value.replace(/\D/g, '') })} />
                </Field>
              ))}
            </div>
            <Btn className="mt-3" onClick={() => update({ men: n(count.men), women: n(count.women), children: n(count.children), online: n(count.online) }, 'Head count saved.')}>Save head count</Btn>
          </Card>
          <Card title={`Who came (${present.size} marked)`}>
            <div className="mb-3 grid gap-2 sm:grid-cols-[1fr_auto_auto] sm:items-center">
              <Search value={q} onChange={setQ} placeholder="Type a name to find them quickly" />
              <label className="flex items-center gap-2 text-sm"><input type="checkbox" className="h-4 w-4" checked={family} onChange={(e) => setFamily(e.target.checked)} /> Mark their family too</label>
              <label className="flex items-center gap-2 text-sm"><input type="checkbox" className="h-4 w-4" checked={onlyPresent} onChange={(e) => setOnlyPresent(e.target.checked)} /> Only those marked</label>
            </div>
            {!members.length ? <p className="text-gray-600">Add people to the register first.</p> : (
              <ul className="grid gap-1.5 sm:grid-cols-2">
                {shown.slice(0, 300).map((m) => {
                  const on = present.has(m.id);
                  return (
                    <li key={m.id}>
                      <button onClick={() => toggle(m)} className={`flex w-full items-center gap-3 rounded-xl border px-3 py-2 text-left transition ${on ? 'border-emerald-300 bg-emerald-50' : 'border-gray-200 bg-white hover:bg-gray-50'}`}>
                        <Avatar m={m} size={32} /><span className="flex-1 truncate font-medium">{nameOf(m)}</span>
                        <span className={`flex h-6 w-6 items-center justify-center rounded-full ${on ? 'bg-emerald-600 text-white' : 'border-2 border-gray-300'}`}>{on && <FaCheck className="text-xs" />}</span>
                      </button>
                    </li>
                  );
                })}
              </ul>
            )}
          </Card>
        </div>
        <div className="space-y-4">
          <Card title="Members check themselves in">
            {s.checkin_open ? (
              <>
                <div className="flex justify-center rounded-xl bg-white p-2"><QRCodeSVG value={url} size={200} level="M" /></div>
                <p className="mt-2 text-center text-sm text-gray-600">Scan with the phone camera, or open <b>hocfam.org/my</b> and type the code</p>
                <p className="mt-1 text-center font-mono text-2xl font-bold tracking-[0.3em]">{s.checkin_code}</p>
                <div className="mt-3 grid grid-cols-2 gap-2">
                  <Btn kind="soft" small onClick={() => setBig(true)}><FaExpand /> Show big</Btn>
                  <Btn kind="ghost" small onClick={() => update({ checkin_open: false }, 'Check-in closed.')}>Close check-in</Btn>
                </div>
              </>
            ) : (
              <>
                <p className="mb-3 text-[15px] text-gray-600">Members with a portal account scan a QR code and they (and their family) are marked present.</p>
                <Btn onClick={() => update({ checkin_open: true })}>Open check-in</Btn>
              </>
            )}
          </Card>
          <Card title="First timers">
            <p className="mb-3 text-[15px] text-gray-600">{s.first_timers || 0} recorded at this service.</p>
            <Link to="/cms/first-timers?add=1"><Btn kind="soft" small><FaPlus /> Add a first timer</Btn></Link>
          </Card>
          <button className="text-sm font-semibold text-red-600" onClick={() => setDel(true)}>Delete this service</button>
        </div>
      </div>
      {big && (
        <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-white p-6" onClick={() => setBig(false)}>
          <img src="/image/New_Logo.png" alt="" className="mb-3 h-16 w-16" />
          <p className="mb-6 text-center font-heading text-3xl font-extrabold text-primary-900 md:text-5xl">Check in: {serviceName(s)}</p>
          <QRCodeSVG value={url} size={Math.min(window.innerWidth, window.innerHeight) * 0.55} level="M" />
          <p className="mt-6 text-xl text-gray-700 md:text-2xl">Scan with your phone camera · code <b className="font-mono tracking-[0.25em]">{s.checkin_code}</b></p>
          <p className="mt-2 text-sm text-gray-400">Tap anywhere to close</p>
        </div>
      )}
      <Confirm open={del} title="Delete this service?" text="Its head count and the list of who came will be deleted." onClose={() => setDel(false)}
        onOk={async () => { try { await cms.del(`/services/${s.id}`); nav('/cms/services'); } catch (e) { toast.error(errText(e)); } }} />
    </>
  );
}
