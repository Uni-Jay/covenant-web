import { useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import { FaArrowLeft, FaEdit, FaPhone, FaPrint, FaTrash, FaWhatsapp, FaEnvelope, FaBirthdayCake, FaRing } from 'react-icons/fa';
import { bday, cms, errText, forgetMembers, givingName, label, Member, MONTHS, naira, nameOf, niceDate, serviceName, waLink } from '../lib';
import { Avatar, Badge, Btn, Card, Confirm, ErrorBox, Field, inp, Loading, Modal, useLoad } from '../ui';
import { useWho } from '../CmsLayout';
import MemberForm from './MemberForm';
import { useCard } from '../CardModal';

type Profile = {
  member: Member;
  family: { id: number; name: string; address: string; members: Member[] } | null;
  groups: { id: number; name: string; type: string; role: string }[];
  attendance: { id: number; date: string; title: string; type: string; method: string }[];
  attendance90: { services: number; came: number };
  giving: { year: number; total: number; items: { id: number; date: string; type: string; amount: number; method: string }[] } | null;
  account: { id: number; email: string } | null;
};

export default function MemberProfile() {
  const { id } = useParams();
  const who = useWho();
  const nav = useNavigate();
  const p = useLoad<Profile>(() => cms.get(`/members/${id}`), [id]);
  const [edit, setEdit] = useState(false);
  const [del, setDel] = useState(false);
  const [acct, setAcct] = useState(false);
  const [email, setEmail] = useState('');
  const { openCard, cardNode } = useCard();

  if (p.loading && !p.data) return <Loading />;
  if (p.error) return <ErrorBox text={p.error} retry={p.reload} />;
  const { member: m, family, groups, attendance, attendance90, giving, account } = p.data!;
  const wa = waLink(m.phone, `Hello ${m.title ? m.title + ' ' : ''}${m.first_name}, `);
  const pct = attendance90.services ? Math.round((attendance90.came / attendance90.services) * 100) : 0;

  const remove = async () => {
    try { await cms.del(`/members/${m.id}`); forgetMembers(); toast.success('Removed from the register.'); nav('/cms/members'); } catch (e) { toast.error(errText(e)); }
  };
  const linkAccount = async () => {
    try { await cms.post(`/members/${m.id}/account`, { email }); toast.success(email ? 'Account linked.' : 'Account unlinked.'); setAcct(false); p.reload(); } catch (e) { toast.error(errText(e)); }
  };
  const row = (k: string, v: any) => (v ? <div className="flex gap-3 py-1.5"><dt className="w-36 shrink-0 text-sm text-gray-500">{k}</dt><dd className="text-[15px] text-gray-900">{v}</dd></div> : null);

  return (
    <>
      <Link to="/cms/members" className="mb-3 inline-flex items-center gap-2 text-sm font-semibold text-primary-700"><FaArrowLeft /> Members</Link>
      <div className="mb-5 flex flex-col gap-4 rounded-2xl border border-gray-200 bg-white p-5 shadow-sm sm:flex-row sm:items-center">
        <Avatar m={m} size={84} />
        <div className="flex-1">
          <h1 className="font-heading text-2xl font-extrabold">{nameOf(m)}</h1>
          <p className="mt-1 flex flex-wrap gap-2">
            <Badge tone={m.status === 'worker' ? 'purple' : m.status === 'inactive' ? 'gray' : 'blue'}>{label(m.status)}</Badge>
            {groups.map((g) => <Badge key={g.id} tone="gold">{g.name}{g.role ? ` · ${g.role}` : ''}</Badge>)}
            {m.source === 'studio' && <Badge>From Church Studio</Badge>}
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          {m.phone && <a href={`tel:${m.phone}`}><Btn kind="ghost" small><FaPhone /> Call</Btn></a>}
          {wa && <a href={wa} target="_blank" rel="noreferrer"><Btn kind="ghost" small><FaWhatsapp /> WhatsApp</Btn></a>}
          {m.email && <a href={`mailto:${m.email}`}><Btn kind="ghost" small><FaEnvelope /> Email</Btn></a>}
          {m.birth_day && m.birth_month && <Btn kind="gold" small onClick={() => openCard(m, 'bday')}><FaBirthdayCake /> Birthday card</Btn>}
          {m.ann_day && m.ann_month && <Btn kind="ghost" small onClick={() => openCard(m, 'anniv')}><FaRing /> Anniversary card</Btn>}
          <Btn small onClick={() => setEdit(true)}><FaEdit /> Edit</Btn>
        </div>
      </div>

      <div className="grid gap-4 lg:grid-cols-[1.3fr_1fr]">
        <div className="space-y-4">
          <Card title="Details">
            <dl className="divide-y divide-gray-50">
              {row('Phone', m.phone)}{row('Email', m.email)}{row('Address', m.address)}
              {row('Birthday', bday(m) + (m.birth_year ? `, ${m.birth_year}` : ''))}
              {row('Gender', label(m.gender))}{row('Marital status', label(m.marital_status) + (m.spouse_name ? ` (spouse: ${m.spouse_name})` : ''))}
              {row('Wedding anniversary', m.ann_day && m.ann_month ? `${m.ann_day} ${MONTHS[m.ann_month - 1]}` : '')}
              {row('Occupation', m.occupation)}{row('Joined', niceDate(m.join_date))}{row('Baptised', niceDate(m.baptism_date))}
              {row('Department (form)', m.department_text)}{row('On the church screen', m.consent_screen ? 'Yes, birthday can be celebrated' : '')}
            </dl>
            {m.notes && <p className="mt-3 whitespace-pre-line rounded-lg bg-secondary-50 p-3 text-sm text-gray-800">{m.notes}</p>}
          </Card>
          <Card title="Attendance" actions={<span className="text-sm text-gray-600">Last 3 months: <b>{attendance90.came}</b> of {attendance90.services} services ({pct}%)</span>}>
            {attendance.length ? (
              <ul className="divide-y divide-gray-100">
                {attendance.map((a) => <li key={a.id} className="flex justify-between py-2 text-[15px]"><span>{serviceName(a)}</span><span className="text-gray-600">{niceDate(a.date, true)}</span></li>)}
              </ul>
            ) : <p className="text-gray-600">No attendance marked yet.</p>}
          </Card>
        </div>
        <div className="space-y-4">
          <Card title="Family" actions={<Link to="/cms/families" className="text-sm font-semibold text-primary-700">{family ? 'Edit' : 'Add to a family'}</Link>}>
            {family ? (
              <>
                <p className="mb-2 font-semibold">{family.name}</p>
                <ul className="space-y-2">{family.members.map((f) => (
                  <li key={f.id}><Link to={`/cms/members/${f.id}`} className="flex items-center gap-3 hover:underline"><Avatar m={f} size={32} /><span className="flex-1">{nameOf(f)}</span><span className="text-sm text-gray-500">{label(f.family_role)}</span></Link></li>
                ))}</ul>
              </>
            ) : <p className="text-gray-600">Not in a family yet.</p>}
          </Card>
          {giving && (
            <Card title={`Giving in ${giving.year}`} actions={<Link to={`/cms/members/${m.id}/statement`} className="inline-flex items-center gap-1.5 text-sm font-semibold text-primary-700"><FaPrint /> Statement</Link>}>
              <p className="mb-2 font-heading text-2xl font-extrabold">{naira(giving.total)}</p>
              <ul className="divide-y divide-gray-100">{giving.items.map((g) => <li key={g.id} className="flex justify-between py-1.5 text-sm"><span>{givingName(g.type)} · {niceDate(g.date)}</span><b>{naira(g.amount)}</b></li>)}</ul>
            </Card>
          )}
          <Card title="Member portal account">
            {account ? <p className="text-[15px]">Signed up as <b>{account.email}</b>. They can see their details, giving and attendance at <b>hocfam.org/my</b>.</p>
              : <p className="text-[15px] text-gray-600">No account yet. They can create one at <b>hocfam.org/my</b>: it links to this record by itself when the phone number and birthday match.</p>}
            {who.can.admin && <button className="mt-2 text-sm font-semibold text-primary-700" onClick={() => { setEmail(account?.email || ''); setAcct(true); }}>{account ? 'Change the linked account' : 'Link an account by email'}</button>}
          </Card>
          {who.can.admin && <button onClick={() => setDel(true)} className="inline-flex items-center gap-2 text-sm font-semibold text-red-600"><FaTrash /> Remove from the register</button>}
        </div>
      </div>

      {cardNode}
      <MemberForm open={edit} member={m} onClose={() => setEdit(false)} onSaved={() => { setEdit(false); p.reload(); }} />
      <Confirm open={del} title="Remove this person?" text={`${nameOf(m)} will be taken out of the register, groups and attendance. Their giving records stay (under their name). To keep their history, set the status to Inactive instead.`} ok="Remove" onOk={remove} onClose={() => setDel(false)} />
      <Modal open={acct} title="Link a website account" onClose={() => setAcct(false)} footer={<><Btn kind="ghost" onClick={() => setAcct(false)}>Cancel</Btn><Btn onClick={linkAccount}>{email ? 'Link' : 'Unlink'}</Btn></>}>
        <Field label="Email of their website or app account" hint="Leave empty to unlink."><input className={inp} type="email" value={email} onChange={(e) => setEmail(e.target.value)} /></Field>
      </Modal>
    </>
  );
}
