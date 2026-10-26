import { useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import { FaCheck, FaCopy, FaEnvelope, FaWhatsapp } from 'react-icons/fa';
import { cms, errText, Group, MONTHS, waLink } from '../lib';
import { Btn, Card, ErrorBox, Field, inp, Loading, PageHead, Tabs, useLoad } from '../ui';

type Person = { id: number | string; title: string; first_name: string; last_name: string; phone: string; email: string };
type Aud = { kind: string; group_ids: number[]; gender: string; birth_month: string };
const fill = (t: string, p: Person) => t.replace(/\{first\}/gi, p.first_name || '').replace(/\{name\}/gi, [p.title, p.first_name, p.last_name].filter(Boolean).join(' ')).replace(/\{title\}/gi, p.title || '');

export default function Messages() {
  const [sp] = useSearchParams();
  const groups = useLoad<{ items: Group[] }>(() => cms.get('/groups'), []);
  const hist = useLoad<{ items: any[]; emailToday: number; emailLimit: number; emailReady: boolean }>(() => cms.get('/messages'), []);
  const [aud, setAud] = useState<Aud>({ kind: sp.get('group') ? 'groups' : 'all', group_ids: sp.get('group') ? [Number(sp.get('group'))] : [], gender: '', birth_month: '' });
  const [people, setPeople] = useState<{ items: Person[]; withEmail: number; withPhone: number } | null>(null);
  const [channel, setChannel] = useState<'whatsapp' | 'email'>('whatsapp');
  const [subject, setSubject] = useState('');
  const [body, setBody] = useState('Hello {name},\n\n');
  const [sent, setSent] = useState<Record<string, boolean>>({});
  const [busy, setBusy] = useState(false);

  const audience = useMemo(() => ({
    status: aud.kind === 'workers' ? ['worker'] : aud.kind === 'all' ? ['member', 'worker', 'visitor'] : undefined,
    group_ids: aud.kind === 'groups' ? aud.group_ids : undefined,
    gender: aud.gender || undefined,
    birth_month: aud.kind === 'birthmonth' ? Number(aud.birth_month) || undefined : undefined,
    first_timers: aud.kind === 'firsttimers' || undefined,
    member_ids: aud.kind === 'firsttimers' ? [0] : undefined,
  }), [aud]);
  const audLabel = aud.kind === 'groups' ? (groups.data?.items || []).filter((g) => aud.group_ids.includes(g.id)).map((g) => g.name).join(', ') || 'Groups'
    : aud.kind === 'workers' ? 'All workers' : aud.kind === 'birthmonth' ? `Birthdays in ${MONTHS[Number(aud.birth_month) - 1] || ''}` : aud.kind === 'firsttimers' ? 'Recent first timers' : 'Everyone';

  useEffect(() => {
    if (aud.kind === 'groups' && !aud.group_ids.length) { setPeople({ items: [], withEmail: 0, withPhone: 0 }); return; }
    cms.post('/messages/audience', { audience }).then(setPeople).catch((e) => toast.error(errText(e)));
    setSent({});
  }, [audience]);

  const sendEmail = async () => {
    if (!subject.trim() || body.trim().length < 5) { toast.error('Type the subject and the message.'); return; }
    setBusy(true);
    try {
      const r = await cms.post('/messages/email', { subject, body, audience, audienceLabel: audLabel });
      toast.success(`Sent to ${r.delivered} of ${r.recipients} people.`); hist.reload();
    } catch (e) { toast.error(errText(e)); } finally { setBusy(false); }
  };
  const withPhone = (people?.items || []).filter((p) => waLink(p.phone, 'x'));
  const doneCount = Object.keys(sent).length;
  const finishWa = async () => {
    try { await cms.post('/messages/whatsapp-log', { body, audienceLabel: audLabel, recipients: withPhone.length, sent: doneCount }); toast.success('Saved in the message history.'); hist.reload(); } catch (e) { /* not important */ }
  };
  const copyNumbers = () => { navigator.clipboard?.writeText(withPhone.map((p) => p.phone).join('\n')); toast.success(`${withPhone.length} phone numbers copied.`); };

  return (
    <>
      <PageHead title="Messages" sub="Reach the whole church, a department, the workers or this month’s celebrants." />
      <div className="grid gap-4 lg:grid-cols-[1fr_1.4fr]">
        <Card title="1. Who">
          <div className="space-y-3">
            <select className={inp} value={aud.kind} onChange={(e) => setAud({ ...aud, kind: e.target.value })}>
              <option value="all">Everyone in the register</option><option value="workers">All workers</option><option value="groups">A department or group</option>
              <option value="birthmonth">People with birthdays in a month</option><option value="firsttimers">Recent first timers (last 3 months)</option>
            </select>
            {aud.kind === 'groups' && (
              <div className="max-h-56 space-y-1 overflow-y-auto rounded-lg border border-gray-200 p-2">
                {(groups.data?.items || []).map((g) => (
                  <label key={g.id} className="flex items-center gap-2 rounded px-2 py-1 hover:bg-gray-50">
                    <input type="checkbox" className="h-4 w-4" checked={aud.group_ids.includes(g.id)} onChange={(e) => setAud({ ...aud, group_ids: e.target.checked ? [...aud.group_ids, g.id] : aud.group_ids.filter((x) => x !== g.id) })} />
                    {g.name} <span className="text-sm text-gray-500">({g.size})</span>
                  </label>
                ))}
                {!groups.data?.items.length && <p className="p-2 text-sm text-gray-500">No groups yet.</p>}
              </div>
            )}
            {aud.kind === 'birthmonth' && <select className={inp} value={aud.birth_month} onChange={(e) => setAud({ ...aud, birth_month: e.target.value })}><option value="">Choose the month</option>{MONTHS.map((m, i) => <option key={m} value={i + 1}>{m}</option>)}</select>}
            {aud.kind !== 'firsttimers' && <select className={inp} value={aud.gender} onChange={(e) => setAud({ ...aud, gender: e.target.value })}><option value="">Men and women</option><option value="male">Men only</option><option value="female">Women only</option></select>}
            {people && <p className="rounded-lg bg-primary-50 p-3 text-[15px] text-primary-900"><b>{people.items.length}</b> people: {people.withPhone} with a phone number, {people.withEmail} with an email address.</p>}
          </div>
        </Card>
        <Card title="2. The message">
          <Tabs value={channel} onChange={setChannel} items={[['whatsapp', <span key="w" className="flex items-center gap-1.5"><FaWhatsapp /> WhatsApp</span>], ['email', <span key="e" className="flex items-center gap-1.5"><FaEnvelope /> Email</span>]]} />
          {channel === 'email' && <Field label="Subject" className="mb-3"><input className={inp} value={subject} onChange={(e) => setSubject(e.target.value)} placeholder="e.g. Special thanksgiving service this Sunday" /></Field>}
          <textarea className={`${inp} min-h-[160px]`} value={body} onChange={(e) => setBody(e.target.value)} />
          <p className="mt-1 text-xs text-gray-500">{'{name}'} becomes “Deacon Samuel Adebayo”, {'{first}'} becomes “Samuel”. Each person gets their own message.</p>
          {channel === 'email' ? (
            <div className="mt-3">
              {hist.data && !hist.data.emailReady && <p className="mb-2 rounded-lg bg-secondary-50 p-3 text-sm text-secondary-900">Email isn’t switched on yet: the website server needs its free Brevo key.</p>}
              <div className="flex flex-wrap items-center gap-3">
                <Btn onClick={sendEmail} disabled={busy || !people?.withEmail}><FaEnvelope /> {busy ? 'Sending…' : `Send to ${people?.withEmail || 0} people`}</Btn>
                {hist.data && <span className="text-sm text-gray-500">{hist.data.emailToday} of {hist.data.emailLimit} free emails used today</span>}
              </div>
            </div>
          ) : (
            <div className="mt-3">
              <p className="mb-2 text-sm text-gray-600">WhatsApp doesn’t allow sending to many people at once for free. Tap each name: WhatsApp opens with the message ready, press Send, come back for the next. ({doneCount} of {withPhone.length} done)</p>
              <div className="mb-2 flex flex-wrap gap-2"><Btn kind="ghost" small onClick={copyNumbers}><FaCopy /> Copy all numbers (for a broadcast list)</Btn>{doneCount > 0 && <Btn kind="soft" small onClick={finishWa}>I’m done</Btn>}</div>
              <ul className="grid max-h-80 gap-1.5 overflow-y-auto sm:grid-cols-2">
                {withPhone.map((p) => (
                  <li key={p.id}>
                    <a href={waLink(p.phone, fill(body, p))} target="_blank" rel="noreferrer" onClick={() => setSent({ ...sent, [p.id]: true })}
                      className={`flex items-center gap-2 rounded-lg border px-3 py-2 text-[15px] ${sent[p.id] ? 'border-emerald-200 bg-emerald-50 text-emerald-800' : 'border-gray-200 hover:bg-gray-50'}`}>
                      {sent[p.id] ? <FaCheck /> : <FaWhatsapp className="text-emerald-600" />}<span className="truncate">{[p.title, p.first_name, p.last_name].filter(Boolean).join(' ')}</span>
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </Card>
      </div>
      <Card title="Sent before" className="mt-4">
        {hist.loading && !hist.data ? <Loading /> : hist.error ? <ErrorBox text={hist.error} /> : !hist.data!.items.length ? <p className="text-gray-600">Nothing sent yet.</p> : (
          <ul className="divide-y divide-gray-100">{hist.data!.items.map((m) => (
            <li key={m.id} className="py-2.5 text-[15px]">
              <p><b>{m.channel === 'email' ? m.subject : 'WhatsApp message'}</b> <span className="text-sm text-gray-500">to {m.audience || 'people'} · {m.delivered} of {m.recipients} · {new Date(m.at).toLocaleString('en-NG', { dateStyle: 'medium', timeStyle: 'short' })}</span></p>
              <p className="truncate text-sm text-gray-600">{String(m.body || '').replace(/\s+/g, ' ')}</p>
            </li>
          ))}</ul>
        )}
      </Card>
    </>
  );
}
