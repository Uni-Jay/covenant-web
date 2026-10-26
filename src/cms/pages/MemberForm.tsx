import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { cms, errText, forgetMembers, Member, MEMBER_STATUS, MONTHS } from '../lib';
import { Avatar, Btn, Field, inp, Modal } from '../ui';

const EMPTY: Partial<Member> = {
  title: '', first_name: '', last_name: '', gender: '', phone: '', email: '', address: '', occupation: '', status: 'member',
  birth_day: null, birth_month: null, birth_year: null, ann_day: null, ann_month: null, marital_status: '', spouse_name: '',
  join_date: '', baptism_date: '', notes: '',
};
const TITLES = ['', 'Mr', 'Mrs', 'Miss', 'Bro.', 'Sis.', 'Deacon', 'Deaconess', 'Elder', 'Pastor', 'Pastor (Mrs)', 'Evangelist', 'Prophet', 'Prophetess', 'Apostle', 'Dr', 'Engr.', 'Chief', 'Prof.'];

/** Add or edit a member. onSaved gets the member id. */
export default function MemberForm({ open, member, onClose, onSaved }: { open: boolean; member?: Member | null; onClose: () => void; onSaved: (id: number) => void }) {
  const [m, setM] = useState<Partial<Member>>(EMPTY);
  const [photo, setPhoto] = useState<File | null>(null);
  const [busy, setBusy] = useState(false);
  const [dup, setDup] = useState<{ text: string; id: number } | null>(null);
  useEffect(() => { if (open) { setM(member ? { ...member } : { ...EMPTY }); setPhoto(null); setDup(null); } }, [open, member]);
  const set = (k: keyof Member, v: any) => setM((x) => ({ ...x, [k]: v }));

  const save = async (force = false) => {
    if (!m.first_name?.trim()) { toast.error('Type the first name.'); return; }
    const f = new FormData();
    Object.entries(m).forEach(([k, v]) => { if (v !== null && v !== undefined && typeof v !== 'object') f.append(k, String(v)); });
    if (photo) f.append('photo', photo);
    if (force) f.append('force', '1');
    setBusy(true);
    try {
      const r = member ? await cms.form('put', `/members/${member.id}`, f) : await cms.form('post', '/members', f);
      forgetMembers();
      toast.success(member ? 'Saved.' : `${m.first_name} is now in the register.`);
      onSaved(member ? member.id : r.id);
    } catch (e: any) {
      if (e?.response?.status === 409) setDup({ text: e.response.data.message, id: e.response.data.duplicateId });
      else toast.error(errText(e));
    } finally { setBusy(false); }
  };

  const num = (v: string) => (v === '' ? null : Number(v));
  const days = Array.from({ length: 31 }, (_, i) => i + 1);
  return (
    <Modal open={open} onClose={onClose} wide title={member ? 'Edit details' : 'Add a person'}
      footer={<><Btn kind="ghost" onClick={onClose}>Cancel</Btn><Btn onClick={() => save()} disabled={busy}>{busy ? 'Saving…' : 'Save'}</Btn></>}>
      {dup && (
        <div className="mb-4 rounded-xl border border-secondary-200 bg-secondary-50 p-3 text-sm text-secondary-900">
          {dup.text} Is it the same person?
          <div className="mt-2 flex gap-2"><a href={`/cms/members/${dup.id}`} className="font-semibold underline">Open them</a><button className="font-semibold underline" onClick={() => save(true)}>No, add anyway</button></div>
        </div>
      )}
      <div className="mb-4 flex items-center gap-4">
        {photo ? <img src={URL.createObjectURL(photo)} alt="" className="h-16 w-16 rounded-full object-cover" /> : <Avatar m={{ ...m, id: member?.id }} size={64} />}
        <label className="cursor-pointer rounded-lg border border-gray-300 px-3 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-50">
          {m.photo_url || photo ? 'Change photo' : 'Add photo'}
          <input type="file" accept="image/*" className="hidden" onChange={(e) => setPhoto(e.target.files?.[0] || null)} />
        </label>
      </div>
      <div className="grid gap-3 sm:grid-cols-[140px_1fr_1fr]">
        <Field label="Title"><select className={inp} value={m.title || ''} onChange={(e) => set('title', e.target.value)}>{TITLES.concat(m.title && !TITLES.includes(m.title) ? [m.title] : []).map((t) => <option key={t} value={t}>{t || '—'}</option>)}</select></Field>
        <Field label="First name *"><input className={inp} value={m.first_name || ''} onChange={(e) => set('first_name', e.target.value)} autoFocus /></Field>
        <Field label="Surname"><input className={inp} value={m.last_name || ''} onChange={(e) => set('last_name', e.target.value)} /></Field>
      </div>
      <div className="mt-3 grid gap-3 sm:grid-cols-3">
        <Field label="Phone"><input className={inp} type="tel" value={m.phone || ''} onChange={(e) => set('phone', e.target.value)} placeholder="0803 000 0000" /></Field>
        <Field label="Email"><input className={inp} type="email" value={m.email || ''} onChange={(e) => set('email', e.target.value)} /></Field>
        <Field label="Gender"><select className={inp} value={m.gender || ''} onChange={(e) => set('gender', e.target.value)}><option value="">—</option><option value="male">Male</option><option value="female">Female</option></select></Field>
      </div>
      <div className="mt-3 grid gap-3 sm:grid-cols-[1fr_1fr_110px]">
        <Field label="Birthday: day"><select className={inp} value={m.birth_day ?? ''} onChange={(e) => set('birth_day', num(e.target.value))}><option value="">—</option>{days.map((d) => <option key={d}>{d}</option>)}</select></Field>
        <Field label="Month"><select className={inp} value={m.birth_month ?? ''} onChange={(e) => set('birth_month', num(e.target.value))}><option value="">—</option>{MONTHS.map((mo, i) => <option key={mo} value={i + 1}>{mo}</option>)}</select></Field>
        <Field label="Year (optional)"><input className={inp} inputMode="numeric" value={m.birth_year ?? ''} onChange={(e) => set('birth_year', num(e.target.value.replace(/\D/g, '').slice(0, 4)))} /></Field>
      </div>
      <div className="mt-3 grid gap-3 sm:grid-cols-3">
        <Field label="Marital status"><select className={inp} value={m.marital_status || ''} onChange={(e) => set('marital_status', e.target.value)}><option value="">—</option><option value="single">Single</option><option value="married">Married</option><option value="widowed">Widowed</option><option value="divorced">Divorced</option></select></Field>
        <Field label="Spouse’s name"><input className={inp} value={m.spouse_name || ''} onChange={(e) => set('spouse_name', e.target.value)} /></Field>
        <div className="grid grid-cols-2 gap-2">
          <Field label="Wedding: day"><select className={inp} value={m.ann_day ?? ''} onChange={(e) => set('ann_day', num(e.target.value))}><option value="">—</option>{days.map((d) => <option key={d}>{d}</option>)}</select></Field>
          <Field label="Month"><select className={inp} value={m.ann_month ?? ''} onChange={(e) => set('ann_month', num(e.target.value))}><option value="">—</option>{MONTHS.map((mo, i) => <option key={mo} value={i + 1}>{mo.slice(0, 3)}</option>)}</select></Field>
        </div>
      </div>
      <div className="mt-3 grid gap-3 sm:grid-cols-2">
        <Field label="Home address"><input className={inp} value={m.address || ''} onChange={(e) => set('address', e.target.value)} /></Field>
        <Field label="Occupation"><input className={inp} value={m.occupation || ''} onChange={(e) => set('occupation', e.target.value)} /></Field>
      </div>
      <div className="mt-3 grid gap-3 sm:grid-cols-3">
        <Field label="Status"><select className={inp} value={m.status || 'member'} onChange={(e) => set('status', e.target.value)}>{MEMBER_STATUS.map(([k, l]) => <option key={k} value={k}>{l}</option>)}</select></Field>
        <Field label="Joined the church"><input className={inp} type="date" value={m.join_date || ''} onChange={(e) => set('join_date', e.target.value)} /></Field>
        <Field label="Baptised"><input className={inp} type="date" value={m.baptism_date || ''} onChange={(e) => set('baptism_date', e.target.value)} /></Field>
      </div>
      <Field label="Notes (only staff see these)" className="mt-3"><textarea className={`${inp} min-h-[80px]`} value={m.notes || ''} onChange={(e) => set('notes', e.target.value)} /></Field>
      <label className="mt-3 flex items-center gap-2 text-sm text-gray-700">
        <input type="checkbox" checked={!!m.consent_screen} onChange={(e) => set('consent_screen', e.target.checked ? 1 : 0)} className="h-4 w-4" />
        Happy for their birthday to be celebrated on the church screen and live stream
      </label>
    </Modal>
  );
}
