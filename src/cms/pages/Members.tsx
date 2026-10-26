import { useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { FaDownload, FaPhone, FaPlus, FaUserCheck, FaWhatsapp } from 'react-icons/fa';
import { ago, bday, cms, errText, getMembersCached, Member, MEMBER_STATUS, nameOf, waLink } from '../lib';
import { Avatar, Badge, Btn, Empty, ErrorBox, inp, Loading, PageHead, Search, useLoad } from '../ui';
import MemberForm from './MemberForm';

const statusTone = (s: string) => (s === 'worker' ? 'purple' : s === 'visitor' ? 'gold' : s === 'inactive' ? 'gray' : 'blue') as any;

export default function Members() {
  const list = useLoad<Member[]>(() => getMembersCached(true), []);
  const [q, setQ] = useState('');
  const [status, setStatus] = useState('active');
  const [sort, setSort] = useState('name');
  const [adding, setAdding] = useState(false);
  const [busy, setBusy] = useState(false);
  const nav = useNavigate();

  const shown = useMemo(() => {
    const t = q.trim().toLowerCase(), digits = t.replace(/\D/g, '');
    let r = (list.data || []).filter((m) => (status === 'all' ? true : status === 'active' ? m.status !== 'inactive' : m.status === status));
    if (t) r = r.filter((m) => nameOf(m).toLowerCase().includes(t) || (digits.length >= 3 && m.phone.replace(/\D/g, '').includes(digits)) || (m.email || '').toLowerCase().includes(t) || (m.groups_text || '').toLowerCase().includes(t));
    if (sort === 'recent') r = [...r].sort((a, b) => String(b.last_seen || '').localeCompare(String(a.last_seen || '')));
    if (sort === 'added') r = [...r].sort((a, b) => b.id - a.id);
    return r;
  }, [list.data, q, status, sort]);

  const importAccounts = async () => {
    setBusy(true);
    try { const r = await cms.post('/import/accounts'); toast.success(`${r.added} added and ${r.linked} linked from website and app accounts.`); list.reload(); }
    catch (e) { toast.error(errText(e)); } finally { setBusy(false); }
  };

  return (
    <>
      <PageHead title="Members" sub={list.data ? `${list.data.filter((m) => m.status !== 'inactive').length} people in the register` : undefined}
        actions={<>
          <Btn kind="ghost" onClick={() => cms.download('/members/export.csv', 'Church members.csv').catch((e) => toast.error(errText(e)))}><FaDownload /> Excel list</Btn>
          <Btn onClick={() => setAdding(true)}><FaPlus /> Add a person</Btn>
        </>} />

      <div className="mb-4 grid gap-2 sm:grid-cols-[1fr_170px_170px]">
        <Search value={q} onChange={setQ} placeholder="Search by name, phone, email or department" />
        <select className={inp} value={status} onChange={(e) => setStatus(e.target.value)}>
          <option value="active">Everyone (not inactive)</option>{MEMBER_STATUS.map(([k, l]) => <option key={k} value={k}>{l}s</option>)}<option value="all">Everyone</option>
        </select>
        <select className={inp} value={sort} onChange={(e) => setSort(e.target.value)}><option value="name">A to Z</option><option value="recent">Last in church</option><option value="added">Newest added</option></select>
      </div>

      {list.loading && !list.data ? <Loading /> : list.error ? <ErrorBox text={list.error} retry={list.reload} /> : !list.data!.length ? (
        <Empty title="The register is empty"
          text="Add people one by one, bring in everyone with a website or app account, or connect Church Studio: everyone in its birthday register comes in by itself (Church Studio → Settings → Website)."
          action={<div className="flex flex-wrap justify-center gap-2"><Btn onClick={() => setAdding(true)}><FaPlus /> Add a person</Btn><Btn kind="ghost" disabled={busy} onClick={importAccounts}><FaUserCheck /> Bring in website accounts</Btn></div>} />
      ) : !shown.length ? <Empty title={`No one matches “${q}”`} /> : (
        <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
          <ul className="divide-y divide-gray-100">
            {shown.slice(0, 400).map((m) => {
              const wa = waLink(m.phone, `Hello ${m.title ? m.title + ' ' : ''}${m.first_name}, `);
              return (
                <li key={m.id} className="flex items-center gap-3 px-3 py-2.5 hover:bg-gray-50 md:px-4">
                  <Link to={`/cms/members/${m.id}`} className="flex min-w-0 flex-1 items-center gap-3">
                    <Avatar m={m} />
                    <div className="min-w-0">
                      <p className="truncate font-semibold text-gray-900">{nameOf(m)} {m.status !== 'member' && <Badge tone={statusTone(m.status)}>{m.status}</Badge>}</p>
                      <p className="truncate text-sm text-gray-600">{[m.phone, m.groups_text, bday(m) && '🎂 ' + bday(m)].filter(Boolean).join(' · ')}</p>
                    </div>
                  </Link>
                  <span className="hidden w-32 text-right text-sm text-gray-500 md:block">{m.last_seen ? 'In church ' + ago(m.last_seen) : ''}</span>
                  {m.phone && <a href={`tel:${m.phone}`} className="rounded-lg p-2 text-gray-500 hover:bg-gray-100 hover:text-primary-700" title="Call"><FaPhone /></a>}
                  {wa && <a href={wa} target="_blank" rel="noreferrer" className="rounded-lg p-2 text-gray-500 hover:bg-emerald-50 hover:text-emerald-700" title="WhatsApp"><FaWhatsapp /></a>}
                </li>
              );
            })}
          </ul>
          {shown.length > 400 && <p className="border-t border-gray-100 p-3 text-center text-sm text-gray-500">Showing 400 of {shown.length}. Search to find others.</p>}
        </div>
      )}
      {list.data && list.data.length > 0 && (
        <p className="mt-4 text-sm text-gray-600">Members with a website or app account who aren’t in the register yet: <button className="font-semibold text-primary-700 underline" disabled={busy} onClick={importAccounts}>bring them in</button>.</p>
      )}
      <MemberForm open={adding} onClose={() => setAdding(false)} onSaved={(id) => { setAdding(false); nav(`/cms/members/${id}`); }} />
    </>
  );
}
