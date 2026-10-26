import { useState } from 'react';
import { Link } from 'react-router-dom';
import { FaBirthdayCake, FaRing, FaWhatsapp } from 'react-icons/fa';
import { cms, Member, MONTHS, nameOf, waLink } from '../lib';
import { Avatar, Empty, ErrorBox, Loading, PageHead, Tabs, useLoad } from '../ui';

type Cel = { kind: 'birthday' | 'anniversary'; inDays: number; member: Member; age: number | null };
const greet = (c: Cel) => c.kind === 'birthday'
  ? `Happy birthday ${c.member.title ? c.member.title + ' ' : ''}${c.member.first_name}! 🎉🎂 Your church family at Household Of Covenant And Faith celebrates you today. May this new year bring you God’s favour, good health and joy. We love you! ❤️`
  : `Happy wedding anniversary ${c.member.title ? c.member.title + ' ' : ''}${c.member.first_name}${c.member.spouse_name ? ' and ' + c.member.spouse_name : ''}! 💍 May God keep your home in love, peace and joy. Your church family celebrates with you. ❤️`;

export default function Celebrations() {
  const [days, setDays] = useState<'7' | '14' | '31'>('7');
  const d = useLoad<{ items: Cel[] }>(() => cms.get('/celebrations', { days, back: 3 }), [days]);
  const when = (k: number) => k === 0 ? 'Today' : k === 1 ? 'Tomorrow' : k === -1 ? 'Yesterday' : k < 0 ? `${-k} days ago` : (() => { const t = new Date(Date.now() + k * 864e5); return t.toLocaleDateString('en-NG', { weekday: 'long', day: 'numeric', month: 'long' }); })();
  const groups: Record<string, Cel[]> = {};
  (d.data?.items || []).forEach((c) => { (groups[when(c.inDays)] = groups[when(c.inDays)] || []).push(c); });
  return (
    <>
      <PageHead title="Birthdays & anniversaries" sub="Send a greeting with one tap. The message opens in WhatsApp, ready to send." />
      <Tabs value={days} onChange={setDays} items={[['7', 'This week'], ['14', 'Next 2 weeks'], ['31', 'Next month']]} />
      {d.loading && !d.data ? <Loading /> : d.error ? <ErrorBox text={d.error} retry={d.reload} /> : !d.data!.items.length ? (
        <Empty title="No celebrations in this period" text={`Birthdays come from the register (and from Church Studio’s birthday register). ${MONTHS[new Date().getMonth()]} might just be quiet!`} />
      ) : Object.entries(groups).map(([w, list]) => (
        <div key={w} className="mb-5">
          <p className="mb-2 text-sm font-bold uppercase tracking-wide text-gray-500">{w}</p>
          <div className="grid gap-3 md:grid-cols-2">
            {list.map((c, i) => {
              const wa = waLink(c.member.phone, greet(c));
              return (
                <div key={i} className="flex items-center gap-3 rounded-2xl border border-gray-200 bg-white p-3 shadow-sm">
                  <Avatar m={c.member} size={48} />
                  <Link to={`/cms/members/${c.member.id}`} className="min-w-0 flex-1">
                    <p className="truncate font-semibold">{nameOf(c.member)}</p>
                    <p className="flex items-center gap-1.5 text-sm text-gray-600">{c.kind === 'birthday' ? <><FaBirthdayCake className="text-secondary-500" /> Birthday{c.age ? ` · turns ${c.age}` : ''}</> : <><FaRing className="text-accent-500" /> Wedding anniversary</>}</p>
                  </Link>
                  {wa ? <a href={wa} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1.5 rounded-lg bg-emerald-600 px-3 py-2 text-sm font-semibold text-white hover:bg-emerald-700"><FaWhatsapp /> Greet</a>
                    : <span className="text-xs text-gray-400">No phone</span>}
                </div>
              );
            })}
          </div>
        </div>
      ))}
    </>
  );
}
