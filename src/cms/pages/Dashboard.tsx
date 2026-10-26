import { Link, Navigate } from 'react-router-dom';
import { FaBirthdayCake, FaRing, FaUserPlus, FaClipboardCheck, FaHandHoldingHeart, FaEnvelope } from 'react-icons/fa';
import { cms, Member, naira, nameOf, niceDate, serviceName, Service, waLink } from '../lib';
import { Avatar, Bars, Btn, Card, ErrorBox, Loading, PageHead, Stat, useLoad } from '../ui';
import { useWho } from '../CmsLayout';
import { useCard } from '../CardModal';

type Dash = {
  counts: { total: number; members: number; workers: number; visitors: number; male: number; female: number; new30: number };
  families: number; groups: number;
  services: (Service & { present: number; first_timers: number })[];
  firstTimers: { month: number; waiting: number };
  money: { thisMonth: number; lastMonth: number; expensesThisMonth: number } | null;
};
type Cel = { kind: 'birthday' | 'anniversary'; inDays: number; member: Member; age: number | null };

export default function Dashboard() {
  const who = useWho();
  const d = useLoad<Dash>(() => cms.get('/dashboard'), []);
  const cel = useLoad<{ items: Cel[] }>(() => cms.get('/celebrations', { days: 7 }), []);
  const { openCard, cardNode } = useCard();
  if (!who.can.people) return <Navigate to="/cms/giving" replace />;
  if (d.loading && !d.data) return <Loading />;
  if (d.error) return <ErrorBox text={d.error} retry={d.reload} />;
  const x = d.data!;
  const svc = x.services.slice(0, 8).reverse();
  const total = (s: Service) => (s.men + s.women + s.children) || s.present || 0;
  const hour = new Date().getHours();

  return (
    <>
      <PageHead
        title={`Good ${hour < 12 ? 'morning' : hour < 17 ? 'afternoon' : 'evening'}${who.user.name ? ', ' + who.user.name.split(' ')[0] : ''}`}
        sub="Here is how the church is doing."
        actions={<>
          <Link to="/cms/services"><Btn kind="soft"><FaClipboardCheck /> Take attendance</Btn></Link>
          {who.can.money && <Link to="/cms/giving?add=1"><Btn kind="gold"><FaHandHoldingHeart /> Record giving</Btn></Link>}
        </>}
      />

      <div className="grid grid-cols-2 gap-3 md:grid-cols-4 md:gap-4">
        <Stat label="People in the register" value={x.counts.total} sub={`${x.counts.male} men · ${x.counts.female} women`} to="/cms/members" />
        <Stat label="Workers" value={x.counts.workers} sub={`${x.groups} departments & groups`} to="/cms/groups" tone="accent" />
        <Stat label="First timers this month" value={x.firstTimers.month} sub={x.firstTimers.waiting ? `${x.firstTimers.waiting} waiting for a call` : 'All followed up'} to="/cms/first-timers" tone="gold" />
        {x.money
          ? <Stat label="Giving this month" value={naira(x.money.thisMonth)} sub={`Last month ${naira(x.money.lastMonth)}`} to="/cms/reports" tone="green" />
          : <Stat label="Families" value={x.families} sub={`${x.counts.new30} people added in 30 days`} to="/cms/families" tone="green" />}
      </div>

      <div className="mt-4 grid gap-4 lg:grid-cols-[1.4fr_1fr]">
        <Card title="Attendance at recent services" actions={<Link to="/cms/services" className="text-sm font-semibold text-primary-700">See all</Link>}>
          {svc.length ? (
            <>
              <Bars items={svc.map((s) => ({ label: niceDate(s.date).replace(/ \d{4}$/, ''), value: total(s) }))} />
              <p className="mt-2 text-sm text-gray-600">Last service: <b>{serviceName(x.services[0])}</b>, {niceDate(x.services[0].date, true)}: {total(x.services[0])} in church
                {x.services[0].online ? `, ${x.services[0].online} online` : ''}{x.services[0].first_timers ? `, ${x.services[0].first_timers} first timers` : ''}.</p>
            </>
          ) : <p className="py-6 text-center text-gray-600">No services recorded yet. Press “Take attendance” on Sunday.</p>}
        </Card>

        <Card title="Celebrating this week" actions={<Link to="/cms/celebrations" className="text-sm font-semibold text-primary-700">See all</Link>}>
          {cel.data?.items.length ? (
            <ul className="divide-y divide-gray-100">
              {cel.data.items.slice(0, 7).map((c, i) => {
                const text = c.kind === 'birthday'
                  ? `Happy birthday ${c.member.title ? c.member.title + ' ' : ''}${c.member.first_name}! 🎉 The ${'Household Of Covenant And Faith'} family celebrates you today. May God’s favour follow you all through your new year. ❤️`
                  : `Happy wedding anniversary ${nameOf(c.member)}! 💍 May God keep your home in love and peace.`;
                const wa = waLink(c.member.phone, text);
                return (
                  <li key={i} className="flex items-center gap-3 py-2.5">
                    <Avatar m={c.member} size={36} />
                    <div className="min-w-0 flex-1">
                      <p className="truncate font-semibold">{nameOf(c.member)}</p>
                      <p className="flex items-center gap-1.5 text-sm text-gray-600">
                        {c.kind === 'birthday' ? <FaBirthdayCake className="text-secondary-500" /> : <FaRing className="text-accent-500" />}
                        {c.inDays === 0 ? 'Today' : c.inDays === 1 ? 'Tomorrow' : c.inDays < 0 ? `${-c.inDays} days ago` : `In ${c.inDays} days`}{c.age ? ` · ${c.age} years` : ''}
                      </p>
                    </div>
                    {c.inDays <= 0 && <button onClick={() => openCard(c.member, c.kind === 'birthday' ? 'bday' : 'anniv')} className="rounded-lg bg-secondary-50 px-2.5 py-1.5 text-sm font-semibold text-secondary-700 hover:bg-secondary-100">Card</button>}
                    {wa && c.inDays <= 0 && <a href={wa} target="_blank" rel="noreferrer" className="hidden rounded-lg bg-emerald-50 px-2.5 py-1.5 text-sm font-semibold text-emerald-700 hover:bg-emerald-100 sm:inline">WhatsApp</a>}
                  </li>
                );
              })}
            </ul>
          ) : <p className="py-6 text-center text-gray-600">No birthdays or anniversaries this week.</p>}
        </Card>
      </div>

      <div className="mt-4 grid gap-3 sm:grid-cols-3">
        <Link to="/cms/first-timers" className="flex items-center gap-3 rounded-2xl border border-gray-200 bg-white p-4 shadow-sm hover:shadow-md"><FaUserPlus className="text-2xl text-secondary-500" /><span><b className="block">Welcome first timers</b><span className="text-sm text-gray-600">Call, follow up, make members</span></span></Link>
        <Link to="/cms/services?absent=1" className="flex items-center gap-3 rounded-2xl border border-gray-200 bg-white p-4 shadow-sm hover:shadow-md"><FaClipboardCheck className="text-2xl text-primary-600" /><span><b className="block">Who has been away?</b><span className="text-sm text-gray-600">Members not seen for 4 weeks</span></span></Link>
        <Link to="/cms/messages" className="flex items-center gap-3 rounded-2xl border border-gray-200 bg-white p-4 shadow-sm hover:shadow-md"><FaEnvelope className="text-2xl text-accent-600" /><span><b className="block">Send a message</b><span className="text-sm text-gray-600">Email or WhatsApp a group</span></span></Link>
      </div>
      {cardNode}
      {x.money && (
        <p className="mt-4 text-sm text-gray-600">Expenses this month: <b>{naira(x.money.expensesThisMonth)}</b>. <Link to="/cms/reports" className="font-semibold text-primary-700">Open the finance report</Link></p>
      )}
    </>
  );
}
