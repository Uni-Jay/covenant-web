import { useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import { FaArrowLeft, FaPlus, FaTrash, FaWhatsapp } from 'react-icons/fa';
import { cms, errText, forgetMembers, Group, label, Member, nameOf, waLink } from '../lib';
import { Avatar, Btn, Card, Confirm, Empty, ErrorBox, Field, inp, Loading, MemberPicker, Modal, PageHead, useLoad } from '../ui';

const TYPES: [string, string][] = [['department', 'Department'], ['ministry', 'Ministry'], ['cell', 'House fellowship / cell'], ['other', 'Other']];

export default function Groups() {
  const list = useLoad<{ items: Group[] }>(() => cms.get('/groups'), []);
  const [edit, setEdit] = useState<Group | null | 'new'>(null);
  const items = list.data?.items || [];
  return (
    <>
      <PageHead title="Departments & groups" sub="Choir, ushers, media, children’s church, house fellowships… Members of each group, their leader and when they meet."
        actions={<Btn onClick={() => setEdit('new')}><FaPlus /> New group</Btn>} />
      {list.loading && !list.data ? <Loading /> : list.error ? <ErrorBox text={list.error} retry={list.reload} /> : !items.length ? (
        <Empty title="No groups yet" text="Departments typed in the Church Studio birthday form appear here by themselves. You can also add them here." action={<Btn onClick={() => setEdit('new')}><FaPlus /> New group</Btn>} />
      ) : (
        TYPES.map(([t, l]) => {
          const g = items.filter((x) => x.type === t); if (!g.length) return null;
          return (
            <div key={t} className="mb-5">
              <p className="mb-2 text-xs font-bold uppercase tracking-[0.14em] text-gray-500">{l}s</p>
              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {g.map((x) => (
                  <Link key={x.id} to={`/cms/groups/${x.id}`} className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm transition hover:shadow-md">
                    <p className="font-bold text-gray-900">{x.name}</p>
                    <p className="text-sm text-gray-600">{x.size} {x.size === 1 ? 'person' : 'people'}{x.leader_name ? ` · led by ${x.leader_name}` : ''}</p>
                    {x.meets && <p className="mt-1 text-sm text-gray-500">Meets {x.meets}</p>}
                  </Link>
                ))}
              </div>
            </div>
          );
        })
      )}
      {edit && <GroupForm g={edit === 'new' ? null : edit} onClose={() => setEdit(null)} onSaved={() => { setEdit(null); list.reload(); }} />}
    </>
  );
}

function GroupForm({ g, onClose, onSaved }: { g: Group | null; onClose: () => void; onSaved: (id: number) => void }) {
  const [x, setX] = useState<Partial<Group>>(g || { name: '', type: 'department', leader_id: null, meets: '', description: '' });
  const [busy, setBusy] = useState(false);
  const save = async () => {
    setBusy(true);
    try { const r = g ? await cms.put(`/groups/${g.id}`, x) : await cms.post('/groups', x); toast.success('Saved.'); onSaved(g ? g.id : r.id); }
    catch (e) { toast.error(errText(e)); } finally { setBusy(false); }
  };
  return (
    <Modal open title={g ? 'Edit group' : 'New group'} onClose={onClose} footer={<><Btn kind="ghost" onClick={onClose}>Cancel</Btn><Btn onClick={save} disabled={busy}>Save</Btn></>}>
      <div className="space-y-3">
        <Field label="Name"><input className={inp} value={x.name} onChange={(e) => setX({ ...x, name: e.target.value })} placeholder="e.g. Choir, Ushering, Media" autoFocus /></Field>
        <Field label="Kind"><select className={inp} value={x.type} onChange={(e) => setX({ ...x, type: e.target.value })}>{TYPES.map(([k, l]) => <option key={k} value={k}>{l}</option>)}</select></Field>
        <Field label="Leader"><MemberPicker value={x.leader_id ?? null} onChange={(id) => setX({ ...x, leader_id: id })} /></Field>
        <Field label="When they meet"><input className={inp} value={x.meets} onChange={(e) => setX({ ...x, meets: e.target.value })} placeholder="e.g. Saturdays, 4 pm" /></Field>
        <Field label="About (optional)"><textarea className={`${inp} min-h-[70px]`} value={x.description || ''} onChange={(e) => setX({ ...x, description: e.target.value })} /></Field>
      </div>
    </Modal>
  );
}

export function GroupDetail() {
  const { id } = useParams();
  const nav = useNavigate();
  const d = useLoad<{ group: Group; members: (Member & { role: string })[] }>(() => cms.get(`/groups/${id}`), [id]);
  const [edit, setEdit] = useState(false);
  const [del, setDel] = useState(false);
  if (d.loading && !d.data) return <Loading />;
  if (d.error) return <ErrorBox text={d.error} retry={d.reload} />;
  const { group: g, members } = d.data!;
  const add = async (mid: number | null) => {
    if (!mid) return;
    try { await cms.post(`/groups/${g.id}/members`, { member_ids: [mid] }); forgetMembers(); d.reload(); } catch (e) { toast.error(errText(e)); }
  };
  const setRole = async (mid: number, role: string) => { try { await cms.put(`/groups/${g.id}/members/${mid}`, { role }); } catch (e) { toast.error(errText(e)); } };
  const remove = async (mid: number) => { try { await cms.del(`/groups/${g.id}/members/${mid}`); forgetMembers(); d.reload(); } catch (e) { toast.error(errText(e)); } };
  const phones = members.map((m) => m.phone).filter(Boolean);

  return (
    <>
      <Link to="/cms/groups" className="mb-3 inline-flex items-center gap-2 text-sm font-semibold text-primary-700"><FaArrowLeft /> Departments & groups</Link>
      <PageHead title={g.name} sub={[label(g.type), g.meets && `meets ${g.meets}`, `${members.length} people`].filter(Boolean).join(' · ')}
        actions={<><Btn kind="ghost" onClick={() => setEdit(true)}>Edit</Btn><Link to={`/cms/messages?group=${g.id}`}><Btn kind="soft">Message this group</Btn></Link></>} />
      {g.description && <p className="mb-4 max-w-2xl text-gray-700">{g.description}</p>}
      <Card title="Members" actions={<span className="text-sm text-gray-500">{phones.length} with phone numbers</span>}>
        <div className="mb-3 max-w-md"><MemberPicker value={null} placeholder="Add someone: type a name" onChange={(mid) => add(mid)} /></div>
        {members.length ? (
          <ul className="divide-y divide-gray-100">
            {members.map((m) => {
              const wa = waLink(m.phone, `Hello ${m.first_name}, `);
              return (
                <li key={m.id} className="flex items-center gap-3 py-2">
                  <Link to={`/cms/members/${m.id}`} className="flex min-w-0 flex-1 items-center gap-3"><Avatar m={m} size={34} /><span className="truncate font-medium">{nameOf(m)}{g.leader_id === m.id && <span className="ml-2 text-xs font-bold text-secondary-600">LEADER</span>}</span></Link>
                  <input className={`${inp} hidden !w-40 py-1.5 text-sm sm:block`} defaultValue={m.role} placeholder="Role, e.g. Secretary" onBlur={(e) => e.target.value !== m.role && setRole(m.id, e.target.value)} />
                  {wa && <a href={wa} target="_blank" rel="noreferrer" className="p-2 text-gray-500 hover:text-emerald-700" title="WhatsApp"><FaWhatsapp /></a>}
                  <button className="p-2 text-gray-400 hover:text-red-600" onClick={() => remove(m.id)} title="Take out of the group"><FaTrash /></button>
                </li>
              );
            })}
          </ul>
        ) : <p className="text-gray-600">No one in this group yet.</p>}
      </Card>
      <button className="mt-4 text-sm font-semibold text-red-600" onClick={() => setDel(true)}>Delete this group</button>
      {edit && <GroupForm g={g} onClose={() => setEdit(false)} onSaved={() => { setEdit(false); d.reload(); }} />}
      <Confirm open={del} title="Delete this group?" text="The people stay in the register." onClose={() => setDel(false)}
        onOk={async () => { try { await cms.del(`/groups/${g.id}`); nav('/cms/groups'); } catch (e) { toast.error(errText(e)); } }} />
    </>
  );
}
