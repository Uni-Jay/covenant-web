import { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate, useSearchParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import { FaCheckCircle, FaEdit, FaPrint, FaSignOutAlt, FaChurch, FaQrcode } from 'react-icons/fa';
import { bday, cms, errText, givingName, label, Member, MONTHS, naira, nameOf, niceDate, serviceName, Who } from './lib';
import { Avatar, Badge, Btn, Card, ErrorBox, Field, inp, Loading, Modal, useLoad } from './ui';
import { StatementSheet } from './pages/Statement';

function Shell({ children, onSignOut }: { children: React.ReactNode; onSignOut?: () => void }) {
  return (
    <div className="min-h-screen bg-[#f5f7fb]">
      <header className="bg-gradient-to-r from-primary-900 to-primary-700 text-white print:hidden">
        <div className="mx-auto flex max-w-4xl items-center gap-3 px-4 py-4">
          <Link to="/" className="flex items-center gap-3"><img src="/image/New_Logo.png" alt="" className="h-10 w-10" /><span className="leading-tight"><b className="block font-heading">Member portal</b><span className="text-xs text-primary-200">Household Of Covenant And Faith</span></span></Link>
          {onSignOut && <button onClick={onSignOut} className="ml-auto flex items-center gap-2 rounded-lg bg-white/10 px-3 py-2 text-sm hover:bg-white/20"><FaSignOutAlt /> Sign out</button>}
        </div>
      </header>
      <main className="mx-auto max-w-4xl px-4 py-6">{children}</main>
    </div>
  );
}
const signedIn = () => !!localStorage.getItem('token');
const days = Array.from({ length: 31 }, (_, i) => i + 1);

// ---------------------------------------------------------------- sign up
export function MyRegister() {
  const [x, setX] = useState({ first_name: '', last_name: '', email: '', phone: '', birth_day: '', birth_month: '', password: '' });
  const [busy, setBusy] = useState(false);
  const nav = useNavigate();
  const loc = useLocation() as any;
  const set = (k: string, v: string) => setX({ ...x, [k]: v });
  const submit = async (e: React.FormEvent) => {
    e.preventDefault(); setBusy(true);
    try {
      const r = await cms.post('/portal/register', x);
      localStorage.setItem('token', r.token);
      toast.success(r.linked ? 'Welcome! We found you in the church register.' : 'Welcome! Your account is ready.');
      nav(loc.state?.back || '/my', { replace: true });
    } catch (er) { toast.error(errText(er)); } finally { setBusy(false); }
  };
  return (
    <Shell>
      <div className="mx-auto max-w-lg rounded-2xl bg-white p-6 shadow-sm md:p-8">
        <h1 className="font-heading text-2xl font-extrabold">Create your account</h1>
        <p className="mb-5 mt-1 text-gray-600">See your details, your giving statement and your attendance, and check in at services with your phone.</p>
        <form onSubmit={submit} className="space-y-3">
          <div className="grid gap-3 sm:grid-cols-2">
            <Field label="First name"><input className={inp} value={x.first_name} onChange={(e) => set('first_name', e.target.value)} required /></Field>
            <Field label="Surname"><input className={inp} value={x.last_name} onChange={(e) => set('last_name', e.target.value)} /></Field>
          </div>
          <Field label="Phone number" hint="Use the number the church has for you, so we can find you in the register."><input className={inp} type="tel" value={x.phone} onChange={(e) => set('phone', e.target.value)} required /></Field>
          <div className="grid grid-cols-2 gap-3">
            <Field label="Birthday: day"><select className={inp} value={x.birth_day} onChange={(e) => set('birth_day', e.target.value)}><option value="">—</option>{days.map((d) => <option key={d}>{d}</option>)}</select></Field>
            <Field label="Month"><select className={inp} value={x.birth_month} onChange={(e) => set('birth_month', e.target.value)}><option value="">—</option>{MONTHS.map((m, i) => <option key={m} value={i + 1}>{m}</option>)}</select></Field>
          </div>
          <Field label="Email"><input className={inp} type="email" autoComplete="email" value={x.email} onChange={(e) => set('email', e.target.value)} required /></Field>
          <Field label="Password" hint="At least 8 characters."><input className={inp} type="password" autoComplete="new-password" minLength={8} value={x.password} onChange={(e) => set('password', e.target.value)} required /></Field>
          <Btn type="submit" disabled={busy} className="w-full">{busy ? 'Creating…' : 'Create my account'}</Btn>
        </form>
        <p className="mt-4 text-center text-sm">Already have an account? <Link to="/my/login" state={loc.state} className="font-semibold text-primary-700">Sign in</Link></p>
      </div>
    </Shell>
  );
}

// ---------------------------------------------------------------- the portal
type Me = {
  member: Member | null;
  family: { id: number; name: string; members: Member[] } | null;
  groups: { id: number; name: string; role: string }[];
  attended90: number;
  openService: { id: number; date: string; title: string; type: string; checkedIn: boolean } | null;
};
export function MyPortal() {
  const nav = useNavigate();
  useEffect(() => { if (!signedIn()) nav('/my/login', { replace: true }); }, []);
  const who = useLoad<Who>(() => cms.get('/whoami'), []);
  const me = useLoad<Me>(() => cms.get('/me'), []);
  const [pw, setPw] = useState(new URLSearchParams(location.search).has('password'));
  const signOut = () => { localStorage.removeItem('token'); nav('/my/login'); };
  useEffect(() => { if ((who.error || me.error) && /sign in|token|401/i.test(who.error + me.error)) signOut(); }, [who.error, me.error]);
  if (!signedIn()) return null;
  if ((who.loading && !who.data) || (me.loading && !me.data)) return <Shell><Loading /></Shell>;
  if (who.error || me.error) return <Shell onSignOut={signOut}><ErrorBox text={who.error || me.error} retry={() => { who.reload(); me.reload(); }} /></Shell>;
  const w = who.data!, d = me.data!;
  return (
    <Shell onSignOut={signOut}>
      {(w.can.people || w.can.money) && (
        <Link to="/cms" className="mb-4 flex items-center gap-3 rounded-2xl bg-primary-50 p-4 text-primary-900 hover:bg-primary-100"><FaChurch className="text-xl" /><span className="flex-1"><b>Open the church office</b><span className="block text-sm">Members, attendance{w.can.money ? ', giving' : ''} and more</span></span>→</Link>
      )}
      {!d.member ? <LinkMe name={w.user.name} onDone={me.reload} /> : <Mine d={d} reload={me.reload} />}
      <div className="mt-6 text-center"><button className="text-sm font-semibold text-primary-700 hover:underline" onClick={() => setPw(true)}>Change my password</button></div>
      {pw && <ChangePassword onClose={() => setPw(false)} />}
    </Shell>
  );
}

function ChangePassword({ onClose }: { onClose: () => void }) {
  const [cur, setCur] = useState('');
  const [next, setNext] = useState('');
  const [again, setAgain] = useState('');
  const [busy, setBusy] = useState(false);
  const save = async () => {
    if (next.length < 8) { toast.error('The new password needs at least 8 characters.'); return; }
    if (next !== again) { toast.error('The two new passwords are not the same.'); return; }
    setBusy(true);
    try { await cms.post('/me/password', { current: cur, next }); toast.success('Password changed. Use the new one next time you sign in.'); onClose(); }
    catch (e) { toast.error(errText(e)); } finally { setBusy(false); }
  };
  return (
    <Modal open title="Change my password" onClose={onClose} footer={<><Btn kind="ghost" onClick={onClose}>Cancel</Btn><Btn onClick={save} disabled={busy}>Change password</Btn></>}>
      <div className="space-y-3">
        <Field label="Current password"><input className={inp} type="password" autoComplete="current-password" value={cur} onChange={(e) => setCur(e.target.value)} /></Field>
        <Field label="New password" hint="At least 8 characters. Something only you know."><input className={inp} type="password" autoComplete="new-password" value={next} onChange={(e) => setNext(e.target.value)} /></Field>
        <Field label="New password again"><input className={inp} type="password" autoComplete="new-password" value={again} onChange={(e) => setAgain(e.target.value)} /></Field>
      </div>
    </Modal>
  );
}

function LinkMe({ name, onDone }: { name: string; onDone: () => void }) {
  const [x, setX] = useState({ phone: '', birth_day: '', birth_month: '' });
  const [busy, setBusy] = useState(false);
  const go = async () => {
    setBusy(true);
    try { await cms.post('/me/link', x); toast.success('Found you!'); onDone(); } catch (e) { toast.error(errText(e)); } finally { setBusy(false); }
  };
  return (
    <Card>
      <h1 className="font-heading text-2xl font-extrabold">Welcome{name ? ', ' + name.split(' ')[0] : ''}!</h1>
      <p className="mb-4 mt-1 text-gray-600">Let’s find you in the church register. Type the phone number and birthday the church has for you.</p>
      <div className="grid gap-3 sm:grid-cols-[1.4fr_1fr_1fr]">
        <Field label="Phone number"><input className={inp} type="tel" value={x.phone} onChange={(e) => setX({ ...x, phone: e.target.value })} /></Field>
        <Field label="Birthday: day"><select className={inp} value={x.birth_day} onChange={(e) => setX({ ...x, birth_day: e.target.value })}><option value="">—</option>{days.map((d) => <option key={d}>{d}</option>)}</select></Field>
        <Field label="Month"><select className={inp} value={x.birth_month} onChange={(e) => setX({ ...x, birth_month: e.target.value })}><option value="">—</option>{MONTHS.map((m, i) => <option key={m} value={i + 1}>{m}</option>)}</select></Field>
      </div>
      <Btn className="mt-4" onClick={go} disabled={busy}>Find me</Btn>
      <p className="mt-4 text-sm text-gray-500">Not registered with the church yet? Speak to an usher or the church office after service, and they’ll add you.</p>
    </Card>
  );
}

function Mine({ d, reload }: { d: Me; reload: () => void }) {
  const m = d.member!;
  const [edit, setEdit] = useState(false);
  const [code, setCode] = useState('');
  const [year, setYear] = useState(new Date().getFullYear());
  const [statement, setStatement] = useState(false);
  const giving = useLoad<any>(() => cms.get('/me/giving', { year }), [year]);
  const att = useLoad<{ items: { date: string; title: string; type: string }[] }>(() => cms.get('/me/attendance'), []);
  const checkin = async () => {
    try { await cms.post('/me/checkin', { code, family: true }); toast.success('You’re checked in. God bless you!'); setCode(''); reload(); att.reload(); } catch (e) { toast.error(errText(e)); }
  };
  if (statement && giving.data) return (
    <>
      <div className="mb-4 flex justify-between print:hidden"><button className="font-semibold text-primary-700" onClick={() => setStatement(false)}>← Back</button><Btn onClick={() => window.print()}><FaPrint /> Print or save as PDF</Btn></div>
      <StatementSheet st={giving.data} />
    </>
  );
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-4 rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
        <Avatar m={m} size={72} />
        <div className="flex-1"><h1 className="font-heading text-2xl font-extrabold">{nameOf(m)}</h1><p className="text-gray-600">{[label(m.status), ...d.groups.map((g) => g.name)].join(' · ')}</p></div>
        <Btn kind="ghost" small onClick={() => setEdit(true)}><FaEdit /> Edit</Btn>
      </div>

      {d.openService && (
        <div className={`rounded-2xl p-4 ${d.openService.checkedIn ? 'bg-emerald-50 text-emerald-900' : 'bg-secondary-50 text-secondary-900'}`}>
          {d.openService.checkedIn ? <p className="flex items-center gap-2 font-semibold"><FaCheckCircle /> You’re checked in for {serviceName(d.openService)}.</p> : (
            <>
              <p className="mb-2 font-semibold"><FaQrcode className="mr-2 inline" />Check in for {serviceName(d.openService)}: scan the QR code in church, or type the code on the screen.</p>
              <div className="flex gap-2"><input className={`${inp} max-w-[180px] font-mono uppercase tracking-widest`} value={code} onChange={(e) => setCode(e.target.value.toUpperCase())} placeholder="CODE" maxLength={8} /><Btn onClick={checkin} disabled={code.length < 4}>Check in</Btn></div>
            </>
          )}
        </div>
      )}

      <div className="grid gap-4 md:grid-cols-2">
        <Card title="My details">
          <dl className="space-y-1.5 text-[15px]">
            {[['Phone', m.phone], ['Email', m.email], ['Address', m.address], ['Birthday', bday(m)], ['Wedding anniversary', m.ann_day && m.ann_month ? `${m.ann_day} ${MONTHS[m.ann_month - 1]}` : ''], ['Occupation', m.occupation]]
              .filter(([, v]) => v).map(([k, v]) => <div key={k as string} className="flex gap-3"><dt className="w-32 shrink-0 text-gray-500">{k}</dt><dd className="min-w-0 break-words">{v}</dd></div>)}
          </dl>
          <p className="mt-3 text-xs text-gray-500">Name or birthday wrong? Tell the church office.</p>
        </Card>
        <Card title="My family">
          {d.family ? (<><p className="mb-2 font-semibold">{d.family.name}</p><ul className="space-y-2">{d.family.members.map((f) => <li key={f.id} className="flex items-center gap-3"><Avatar m={f} size={32} />{nameOf(f)} <span className="text-sm text-gray-500">{label(f.family_role)}</span></li>)}</ul></>)
            : <p className="text-gray-600">The church office can link your family, so you can check everyone in at once.</p>}
        </Card>
        <Card title="My giving" actions={<select className={`${inp} !w-24 py-1.5`} value={year} onChange={(e) => setYear(Number(e.target.value))}>{[0, 1, 2, 3].map((k) => { const y = new Date().getFullYear() - k; return <option key={y}>{y}</option>; })}</select>}>
          {giving.loading && !giving.data ? <Loading /> : giving.data && (
            <>
              <p className="font-heading text-3xl font-extrabold">{naira(giving.data.total)}</p>
              <p className="mb-3 text-sm text-gray-600">recorded in {year}</p>
              <ul className="mb-3 divide-y divide-gray-100">{giving.data.items.slice(0, 6).map((g: any) => <li key={g.id} className="flex justify-between py-1.5 text-sm"><span>{givingName(g.type)} · {niceDate(g.date)}</span><b>{naira(g.amount)}</b></li>)}</ul>
              {giving.data.pledges?.map((p: any) => <p key={p.id} className="mb-2 text-sm">Pledge for {p.purpose}: <b>{naira(p.paid)}</b> of {naira(p.amount)}</p>)}
              <Btn kind="soft" small onClick={() => setStatement(true)}><FaPrint /> My giving statement</Btn>
            </>
          )}
        </Card>
        <Card title="My attendance" actions={<Badge tone="blue">{d.attended90} in 3 months</Badge>}>
          {att.data?.items.length ? <ul className="divide-y divide-gray-100">{att.data.items.slice(0, 8).map((a, i) => <li key={i} className="flex justify-between py-1.5 text-sm"><span>{serviceName(a)}</span><span className="text-gray-600">{niceDate(a.date, true)}</span></li>)}</ul>
            : <p className="text-gray-600">Check in at services and they show here.</p>}
        </Card>
      </div>
      {edit && <EditMe m={m} onClose={() => setEdit(false)} onSaved={() => { setEdit(false); reload(); }} />}
    </div>
  );
}

function EditMe({ m, onClose, onSaved }: { m: Member; onClose: () => void; onSaved: () => void }) {
  const [x, setX] = useState<any>({ ...m });
  const [photo, setPhoto] = useState<File | null>(null);
  const save = async () => {
    const f = new FormData();
    ['phone', 'email', 'address', 'occupation', 'gender', 'marital_status', 'spouse_name', 'ann_day', 'ann_month'].forEach((k) => f.append(k, x[k] == null ? '' : String(x[k])));
    if (photo) f.append('photo', photo);
    try { await cms.form('put', '/me', f); toast.success('Saved.'); onSaved(); } catch (e) { toast.error(errText(e)); }
  };
  return (
    <Modal open title="My details" onClose={onClose} footer={<><Btn kind="ghost" onClick={onClose}>Cancel</Btn><Btn onClick={save}>Save</Btn></>}>
      <div className="space-y-3">
        <div className="flex items-center gap-4">{photo ? <img src={URL.createObjectURL(photo)} alt="" className="h-16 w-16 rounded-full object-cover" /> : <Avatar m={m} size={64} />}
          <label className="cursor-pointer rounded-lg border border-gray-300 px-3 py-2 text-sm font-semibold">Change photo<input type="file" accept="image/*" className="hidden" onChange={(e) => setPhoto(e.target.files?.[0] || null)} /></label></div>
        <div className="grid gap-3 sm:grid-cols-2">
          <Field label="Phone"><input className={inp} value={x.phone || ''} onChange={(e) => setX({ ...x, phone: e.target.value })} /></Field>
          <Field label="Email"><input className={inp} value={x.email || ''} onChange={(e) => setX({ ...x, email: e.target.value })} /></Field>
        </div>
        <Field label="Home address"><input className={inp} value={x.address || ''} onChange={(e) => setX({ ...x, address: e.target.value })} /></Field>
        <Field label="Occupation"><input className={inp} value={x.occupation || ''} onChange={(e) => setX({ ...x, occupation: e.target.value })} /></Field>
        <div className="grid gap-3 sm:grid-cols-2">
          <Field label="Marital status"><select className={inp} value={x.marital_status || ''} onChange={(e) => setX({ ...x, marital_status: e.target.value })}><option value="">—</option><option value="single">Single</option><option value="married">Married</option><option value="widowed">Widowed</option></select></Field>
          <Field label="Spouse’s name"><input className={inp} value={x.spouse_name || ''} onChange={(e) => setX({ ...x, spouse_name: e.target.value })} /></Field>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <Field label="Wedding anniversary: day"><select className={inp} value={x.ann_day ?? ''} onChange={(e) => setX({ ...x, ann_day: e.target.value })}><option value="">—</option>{days.map((d) => <option key={d}>{d}</option>)}</select></Field>
          <Field label="Month"><select className={inp} value={x.ann_month ?? ''} onChange={(e) => setX({ ...x, ann_month: e.target.value })}><option value="">—</option>{MONTHS.map((mo, i) => <option key={mo} value={i + 1}>{mo}</option>)}</select></Field>
        </div>
      </div>
    </Modal>
  );
}

// ---------------------------------------------------------------- QR check-in
export function MyCheckin() {
  const [sp] = useSearchParams();
  const code = (sp.get('code') || '').toUpperCase();
  const nav = useNavigate();
  const [state, setState] = useState<{ ok?: boolean; text: string } | null>(null);
  useEffect(() => {
    if (!signedIn()) { nav('/my/login', { replace: true, state: { back: `/my/checkin?code=${code}` } }); return; }
    cms.post('/me/checkin', { code, family: true })
      .then((r) => setState({ ok: true, text: `You’re checked in for ${serviceName(r.service)}. Welcome to church!` }))
      .catch((e) => setState({ ok: false, text: errText(e) }));
  }, []);
  return (
    <Shell>
      <div className="mx-auto max-w-md rounded-2xl bg-white p-8 text-center shadow-sm">
        {!state ? <Loading text="Checking you in…" /> : state.ok ? (
          <><FaCheckCircle className="mx-auto mb-4 text-6xl text-emerald-500" /><h1 className="mb-2 font-heading text-2xl font-extrabold">God bless you!</h1><p className="text-gray-700">{state.text}</p><p className="mt-1 text-sm text-gray-500">Your family is checked in too.</p></>
        ) : (
          <><h1 className="mb-2 font-heading text-xl font-bold">Couldn’t check you in</h1><p className="text-gray-700">{state.text}</p></>
        )}
        <Link to="/my" className="mt-6 inline-block font-semibold text-primary-700">Open my portal</Link>
      </div>
    </Shell>
  );
}

// ---------------------------------------------------------------- public welcome card for first timers
export function Welcome() {
  const [x, setX] = useState({ name: '', phone: '', email: '', address: '', gender: '', invited_by: '', how_heard: '', wants: '', prayer: '' });
  const [wants, setWants] = useState<string[]>([]);
  const [done, setDone] = useState(false);
  const [busy, setBusy] = useState(false);
  const WANTS = ['Become a member', 'Join a department', 'Talk to a pastor', 'Join a house fellowship', 'Get baptised'];
  const submit = async (e: React.FormEvent) => {
    e.preventDefault(); setBusy(true);
    try { await cms.post('/public/first-timer', { ...x, wants: wants.join(', ') }); setDone(true); } catch (er) { toast.error(errText(er)); } finally { setBusy(false); }
  };
  return (
    <Shell>
      <div className="mx-auto max-w-lg rounded-2xl bg-white p-6 shadow-sm md:p-8">
        {done ? (
          <div className="py-6 text-center">
            <FaCheckCircle className="mx-auto mb-4 text-6xl text-emerald-500" />
            <h1 className="mb-2 font-heading text-2xl font-extrabold">Thank you, {x.name.replace(/^((bro|sis|mr|mrs|miss|ms|dr|pastor|deacon|deaconess|elder|evang|engr|chief|prof)\.?\s+)+/i, '').split(' ')[0]}!</h1>
            <p className="text-gray-700">We are so glad you worshipped with us today. Someone from the church will reach out to you this week. God bless you!</p>
            <Link to="/" className="mt-6 inline-block font-semibold text-primary-700">Visit our website</Link>
          </div>
        ) : (
          <>
            <h1 className="font-heading text-2xl font-extrabold">Welcome to Hocfam! 👋</h1>
            <p className="mb-5 mt-1 text-gray-600">We’re glad you’re here. Please tell us a little about yourself so we can stay in touch.</p>
            <form onSubmit={submit} className="space-y-3">
              <Field label="Your name"><input className={inp} value={x.name} onChange={(e) => setX({ ...x, name: e.target.value })} required /></Field>
              <div className="grid gap-3 sm:grid-cols-2">
                <Field label="Phone number"><input className={inp} type="tel" value={x.phone} onChange={(e) => setX({ ...x, phone: e.target.value })} required /></Field>
                <Field label="I am"><select className={inp} value={x.gender} onChange={(e) => setX({ ...x, gender: e.target.value })}><option value="">—</option><option value="male">A man</option><option value="female">A woman</option></select></Field>
              </div>
              <Field label="Where you live (area)"><input className={inp} value={x.address} onChange={(e) => setX({ ...x, address: e.target.value })} placeholder="e.g. Ikorodu, Agric, Ebute" /></Field>
              <div className="grid gap-3 sm:grid-cols-2">
                <Field label="Who invited you? (optional)"><input className={inp} value={x.invited_by} onChange={(e) => setX({ ...x, invited_by: e.target.value })} /></Field>
                <Field label="How did you hear about us?"><select className={inp} value={x.how_heard} onChange={(e) => setX({ ...x, how_heard: e.target.value })}><option value="">—</option>{['A friend or family', 'Passing by', 'Facebook', 'YouTube', 'Instagram', 'A flyer', 'Other'].map((h) => <option key={h}>{h}</option>)}</select></Field>
              </div>
              <div><span className="mb-1 block text-sm font-semibold text-gray-700">I would like to</span>
                <div className="flex flex-wrap gap-2">{WANTS.map((w) => <button type="button" key={w} onClick={() => setWants(wants.includes(w) ? wants.filter((y) => y !== w) : [...wants, w])} className={`rounded-full border px-3 py-1.5 text-sm ${wants.includes(w) ? 'border-primary-600 bg-primary-600 text-white' : 'border-gray-300 text-gray-700'}`}>{w}</button>)}</div></div>
              <Field label="Prayer request (optional)"><textarea className={`${inp} min-h-[80px]`} value={x.prayer} onChange={(e) => setX({ ...x, prayer: e.target.value })} /></Field>
              <Btn type="submit" disabled={busy} className="w-full">{busy ? 'Sending…' : 'Send'}</Btn>
            </form>
          </>
        )}
      </div>
    </Shell>
  );
}
