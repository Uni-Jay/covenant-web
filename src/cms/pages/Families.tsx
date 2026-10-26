import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import { FaPlus, FaTrash } from 'react-icons/fa';
import { cms, errText, forgetMembers, label, Member, nameOf } from '../lib';
import { Avatar, Btn, Confirm, Empty, ErrorBox, Field, inp, Loading, MemberPicker, Modal, PageHead, Search, useLoad } from '../ui';

type Fam = { id: number; name: string; address: string; notes: string; size: number; members: Member[] };
type Row = { id: number; role: string };
const ROLES = [['head', 'Head'], ['spouse', 'Spouse'], ['child', 'Child'], ['relative', 'Relative']];

export default function Families() {
  const list = useLoad<{ items: Fam[] }>(() => cms.get('/families'), []);
  const [q, setQ] = useState('');
  const [edit, setEdit] = useState<Fam | null | 'new'>(null);
  const [del, setDel] = useState<Fam | null>(null);
  const shown = useMemo(() => {
    const t = q.trim().toLowerCase();
    return (list.data?.items || []).filter((f) => !t || f.name.toLowerCase().includes(t) || f.members.some((m) => nameOf(m).toLowerCase().includes(t)));
  }, [list.data, q]);

  return (
    <>
      <PageHead title="Families" sub="Group husbands, wives and children so you can mark a whole family present at once and see who belongs together."
        actions={<Btn onClick={() => setEdit('new')}><FaPlus /> New family</Btn>} />
      <div className="mb-4 max-w-md"><Search value={q} onChange={setQ} placeholder="Search families or names" /></div>
      {list.loading && !list.data ? <Loading /> : list.error ? <ErrorBox text={list.error} retry={list.reload} /> : !shown.length ? (
        <Empty title={q ? 'No family matches' : 'No families yet'} text={q ? undefined : 'Create a family and add its members from the register.'} action={!q && <Btn onClick={() => setEdit('new')}><FaPlus /> New family</Btn>} />
      ) : (
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {shown.map((f) => (
            <div key={f.id} className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm">
              <div className="mb-3 flex items-start justify-between gap-2">
                <div><p className="font-bold">{f.name}</p>{f.address && <p className="text-sm text-gray-600">{f.address}</p>}</div>
                <button className="text-sm font-semibold text-primary-700" onClick={() => setEdit(f)}>Edit</button>
              </div>
              <ul className="space-y-2">{f.members.map((m) => (
                <li key={m.id}><Link to={`/cms/members/${m.id}`} className="flex items-center gap-2.5 hover:underline"><Avatar m={m} size={30} /><span className="flex-1 truncate text-[15px]">{nameOf(m)}</span><span className="text-xs text-gray-500">{label(m.family_role)}</span></Link></li>
              ))}</ul>
              {!f.members.length && <p className="text-sm text-gray-500">No one in this family yet.</p>}
            </div>
          ))}
        </div>
      )}
      {edit && <FamilyForm fam={edit === 'new' ? null : edit} onClose={() => setEdit(null)} onSaved={() => { setEdit(null); forgetMembers(); list.reload(); }} onDelete={(f) => { setEdit(null); setDel(f); }} />}
      <Confirm open={!!del} title="Delete this family?" text="The people stay in the register; only the family grouping is removed." onClose={() => setDel(null)}
        onOk={async () => { try { await cms.del(`/families/${del!.id}`); forgetMembers(); list.reload(); } catch (e) { toast.error(errText(e)); } }} />
    </>
  );
}

function FamilyForm({ fam, onClose, onSaved, onDelete }: { fam: Fam | null; onClose: () => void; onSaved: () => void; onDelete: (f: Fam) => void }) {
  const [name, setName] = useState(fam?.name || '');
  const [address, setAddress] = useState(fam?.address || '');
  const [rows, setRows] = useState<Row[]>(fam ? fam.members.map((m) => ({ id: m.id, role: m.family_role || '' })) : []);
  const [names, setNames] = useState<Record<number, Member>>(Object.fromEntries((fam?.members || []).map((m) => [m.id, m])));
  const [busy, setBusy] = useState(false);
  const save = async () => {
    if (!name.trim()) { toast.error('Type the family name, e.g. The Adebayo Family.'); return; }
    setBusy(true);
    try {
      const body = { name, address, notes: fam?.notes || '', members: rows };
      if (fam) await cms.put(`/families/${fam.id}`, body); else await cms.post('/families', body);
      toast.success('Family saved.'); onSaved();
    } catch (e) { toast.error(errText(e)); } finally { setBusy(false); }
  };
  return (
    <Modal open title={fam ? 'Edit family' : 'New family'} onClose={onClose}
      footer={<>{fam && <Btn kind="danger" className="mr-auto" onClick={() => onDelete(fam)}><FaTrash /> Delete</Btn>}<Btn kind="ghost" onClick={onClose}>Cancel</Btn><Btn onClick={save} disabled={busy}>Save</Btn></>}>
      <Field label="Family name"><input className={inp} value={name} onChange={(e) => setName(e.target.value)} placeholder="The Adebayo Family" autoFocus /></Field>
      <Field label="Home address" className="mt-3"><input className={inp} value={address} onChange={(e) => setAddress(e.target.value)} /></Field>
      <p className="mb-2 mt-4 text-sm font-semibold text-gray-700">Who is in the family</p>
      <ul className="mb-3 space-y-2">
        {rows.map((r, i) => (
          <li key={r.id} className="flex items-center gap-2">
            <Avatar m={names[r.id] || { id: r.id }} size={30} /><span className="flex-1 truncate">{nameOf(names[r.id]) || `#${r.id}`}</span>
            <select className={`${inp} !w-32`} value={r.role} onChange={(e) => setRows(rows.map((x, j) => (j === i ? { ...x, role: e.target.value } : x)))}>
              <option value="">—</option>{ROLES.map(([k, l]) => <option key={k} value={k}>{l}</option>)}
            </select>
            <button className="p-2 text-red-500" onClick={() => setRows(rows.filter((_, j) => j !== i))} aria-label="Remove"><FaTrash /></button>
          </li>
        ))}
      </ul>
      <MemberPicker value={null} placeholder="Add someone: type a name" onChange={(id, m) => {
        if (!id || !m || rows.some((r) => r.id === id)) return;
        setNames({ ...names, [id]: m });
        setRows([...rows, { id, role: rows.length === 0 ? 'head' : m.gender === 'female' && !rows.some((r) => r.role === 'spouse') ? 'spouse' : 'child' }]);
      }} />
    </Modal>
  );
}
