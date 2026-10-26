import { useState } from 'react';
import { toast } from 'react-toastify';
import { cms, errText, label } from '../lib';
import { Badge, Btn, Card, ErrorBox, Field, inp, Loading, PageHead, useLoad } from '../ui';
import { useWho } from '../CmsLayout';

const ROLE_HELP: Record<string, string> = {
  super_admin: 'Everything, including staff access',
  pastor: 'Everything, including finance and staff access',
  secretary: 'People, attendance, first timers, messages (no finance)',
  elder: 'People, attendance, first timers, messages (no finance)',
  deacon: 'People, attendance, first timers, messages (no finance)',
  department_head: 'People, attendance, first timers, messages (no finance)',
  finance: 'Giving, pledges, expenses and reports only',
  media: 'The website admin (sermons, events, gallery)',
  media_head: 'The website admin (sermons, events, gallery)',
  choir: 'Member portal only',
  member: 'Member portal only (their own details, giving and attendance)',
};

export function StaffPage() {
  const who = useWho();
  const d = useLoad<{ roles: string[]; items: any[] }>(() => cms.get('/staff'), []);
  const [email, setEmail] = useState('');
  const [role, setRole] = useState('secretary');
  const save = async (em = email, r = role) => {
    try { await cms.put('/staff/role', { email: em, role: r }); toast.success(`${em} is now ${label(r)}.`); setEmail(''); d.reload(); } catch (e) { toast.error(errText(e)); }
  };
  return (
    <>
      <PageHead title="Staff & access" sub="Who can open the church office, and what each person can see." />
      <Card title="Give someone access">
        <p className="mb-3 text-[15px] text-gray-600">They first create an account (at hocfam.org/my → “Create an account”). Then type their email here and choose what they do.</p>
        <div className="grid gap-3 sm:grid-cols-[1fr_220px_auto] sm:items-end">
          <Field label="Their email"><input className={inp} type="email" value={email} onChange={(e) => setEmail(e.target.value)} /></Field>
          <Field label="Role"><select className={inp} value={role} onChange={(e) => setRole(e.target.value)}>{(d.data?.roles || Object.keys(ROLE_HELP)).filter((r) => r !== 'super_admin' || who.user.role === 'super_admin').map((r) => <option key={r} value={r}>{label(r)}</option>)}</select></Field>
          <Btn onClick={() => save()} disabled={!email}>Save</Btn>
        </div>
        <p className="mt-2 text-sm text-gray-500">{label(role)}: {ROLE_HELP[role]}</p>
      </Card>
      <Card title="People with access" className="mt-4">
        {d.loading && !d.data ? <Loading /> : d.error ? <ErrorBox text={d.error} /> : (
          <ul className="divide-y divide-gray-100">
            {d.data!.items.map((u) => (
              <li key={u.id} className="flex flex-wrap items-center gap-3 py-2.5">
                <div className="min-w-0 flex-1"><p className="font-semibold">{[u.first_name, u.last_name === '-' ? '' : u.last_name].join(' ').trim() || u.email}</p><p className="text-sm text-gray-600">{u.email}</p></div>
                {!u.is_approved && <Badge tone="red">switched off</Badge>}
                <Badge tone="blue">{label(u.role)}</Badge>
                {u.id !== who.user.id && <button className="text-sm font-semibold text-gray-500 hover:text-red-600" onClick={() => save(u.email, 'member')}>Remove access</button>}
              </li>
            ))}
          </ul>
        )}
      </Card>
    </>
  );
}

export function ActivityPage() {
  const d = useLoad<{ items: any[] }>(() => cms.get('/audit'), []);
  const what: Record<string, string> = {
    'member.add': 'added a person', 'member.edit': 'changed the details of', 'member.delete': 'removed', 'giving.add': 'recorded giving:', 'giving.edit': 'changed giving', 'giving.delete': 'deleted giving',
    'expense.add': 'recorded an expense:', 'expense.edit': 'changed an expense', 'expense.delete': 'deleted an expense:', 'staff.role': 'changed access:', 'first_timer.convert': 'made a member:',
  };
  return (
    <>
      <PageHead title="Activity log" sub="Every change to people, money and access, with who made it. It can’t be edited." />
      {d.loading && !d.data ? <Loading /> : d.error ? <ErrorBox text={d.error} /> : (
        <Card>
          {!d.data!.items.length ? <p className="text-gray-600">Nothing yet.</p> : (
            <ul className="divide-y divide-gray-100">{d.data!.items.map((a) => (
              <li key={a.id} className="flex flex-col py-2.5 text-[15px] sm:flex-row sm:gap-4">
                <span className="w-44 shrink-0 text-sm text-gray-500">{new Date(a.at).toLocaleString('en-NG', { dateStyle: 'medium', timeStyle: 'short' })}</span>
                <span><b>{a.user_name || 'Someone'}</b> {what[a.action] || a.action} {a.detail}</span>
              </li>
            ))}</ul>
          )}
        </Card>
      )}
    </>
  );
}
