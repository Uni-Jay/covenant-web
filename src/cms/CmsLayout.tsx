import { createContext, useContext, useEffect, useState } from 'react';
import { Link, NavLink, Outlet, useLocation, useNavigate } from 'react-router-dom';
import {
  FaBars, FaBirthdayCake, FaChartBar, FaChurch, FaClipboardCheck, FaCog, FaEnvelope, FaHandHoldingHeart, FaHandshake, FaHistory,
  FaHome, FaKey, FaReceipt, FaSignOutAlt, FaTimes, FaUserFriends, FaUserPlus, FaUsers, FaLayerGroup,
} from 'react-icons/fa';
import { cms, errText, Who } from './lib';
import { Btn, Loading } from './ui';

const WhoCtx = createContext<Who | null>(null);
export const useWho = () => useContext(WhoCtx) as Who;

type Item = { to: string; label: string; icon: any; need?: 'people' | 'money' | 'admin'; end?: boolean };
const NAV: { head: string; items: Item[] }[] = [
  { head: '', items: [{ to: '/cms', label: 'Overview', icon: FaHome, end: true, need: 'people' }] },
  { head: 'People', items: [
    { to: '/cms/members', label: 'Members', icon: FaUsers, need: 'people' },
    { to: '/cms/families', label: 'Families', icon: FaUserFriends, need: 'people' },
    { to: '/cms/groups', label: 'Departments & groups', icon: FaLayerGroup, need: 'people' },
    { to: '/cms/first-timers', label: 'First timers', icon: FaUserPlus, need: 'people' },
    { to: '/cms/celebrations', label: 'Birthdays & anniversaries', icon: FaBirthdayCake, need: 'people' },
  ] },
  { head: 'Services', items: [
    { to: '/cms/services', label: 'Attendance', icon: FaClipboardCheck, need: 'people' },
    { to: '/cms/messages', label: 'Messages', icon: FaEnvelope, need: 'people' },
  ] },
  { head: 'Finance', items: [
    { to: '/cms/giving', label: 'Giving', icon: FaHandHoldingHeart, need: 'money' },
    { to: '/cms/pledges', label: 'Pledges', icon: FaHandshake, need: 'money' },
    { to: '/cms/expenses', label: 'Expenses', icon: FaReceipt, need: 'money' },
    { to: '/cms/reports', label: 'Reports', icon: FaChartBar, need: 'money' },
  ] },
  { head: 'Admin', items: [
    { to: '/cms/staff', label: 'Staff & access', icon: FaCog, need: 'admin' },
    { to: '/cms/activity', label: 'Activity log', icon: FaHistory, need: 'admin' },
  ] },
];

export default function CmsLayout() {
  const [who, setWho] = useState<Who | null>(null);
  const [err, setErr] = useState('');
  const [menu, setMenu] = useState(false);
  const nav = useNavigate();
  const loc = useLocation();

  useEffect(() => {
    if (!localStorage.getItem('token')) { nav('/cms/login', { replace: true, state: { back: loc.pathname } }); return; }
    cms.get<Who>('/whoami').then(setWho).catch((e) => {
      if (e?.response?.status === 401 || e?.response?.status === 403) { localStorage.removeItem('token'); nav('/cms/login', { replace: true }); }
      else setErr(errText(e));
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  useEffect(() => { setMenu(false); window.scrollTo(0, 0); }, [loc.pathname]);

  if (err) return <div className="mx-auto max-w-md p-8"><p className="mb-4 text-red-700">{err}</p><Btn onClick={() => location.reload()}>Try again</Btn></div>;
  if (!who) return <Loading text="Opening the church office…" />;
  if (!who.can.people && !who.can.money) {
    return (
      <div className="mx-auto max-w-md p-8 text-center">
        <FaChurch className="mx-auto mb-4 text-4xl text-primary-600" />
        <h1 className="mb-2 text-xl font-bold">This is for church staff</h1>
        <p className="mb-6 text-gray-600">Your account ({who.user.email}) is a member account. Your own details, giving and attendance are in the member portal.</p>
        <div className="flex justify-center gap-2"><Link to="/my"><Btn>Go to my portal</Btn></Link><Btn kind="ghost" onClick={() => { localStorage.removeItem('token'); nav('/cms/login'); }}>Sign out</Btn></div>
      </div>
    );
  }
  const ok = (i: Item) => !i.need || who.can[i.need];
  const signOut = () => { localStorage.removeItem('token'); nav('/cms/login'); };

  const side = (
    <nav className="flex h-full flex-col">
      <Link to="/cms" className="flex items-center gap-3 px-5 py-5">
        <img src="/image/New_Logo.png" alt="" className="h-10 w-10" />
        <span className="leading-tight"><span className="block font-heading text-[15px] font-extrabold text-white">Church Office</span><span className="text-xs text-primary-200">Hocfam · Ikorodu</span></span>
      </Link>
      <div className="flex-1 space-y-4 overflow-y-auto px-3 pb-4">
        {NAV.map((g) => {
          const items = g.items.filter(ok); if (!items.length) return null;
          return (
            <div key={g.head || 'top'}>
              {g.head && <p className="px-3 pb-1 text-[11px] font-bold uppercase tracking-[0.14em] text-primary-300">{g.head}</p>}
              {items.map((i) => (
                <NavLink key={i.to} to={i.to} end={i.end}
                  className={({ isActive }) => `flex items-center gap-3 rounded-lg px-3 py-2.5 text-[15px] font-medium transition ${isActive ? 'bg-white text-primary-900 shadow-sm' : 'text-primary-50 hover:bg-white/10'}`}>
                  <i.icon className="shrink-0 opacity-80" /> {i.label}
                </NavLink>
              ))}
            </div>
          );
        })}
      </div>
      <div className="border-t border-white/10 p-4">
        <p className="truncate text-sm font-semibold text-white">{who.user.name || who.user.email}</p>
        <p className="mb-3 truncate text-xs text-primary-200">{who.user.role.replace(/_/g, ' ')}</p>
        <div className="flex gap-2">
          <Link to="/my" className="flex-1 rounded-lg bg-white/10 px-3 py-2 text-center text-sm text-white hover:bg-white/20">My portal</Link>
          <Link to="/my?password=1" className="rounded-lg bg-white/10 px-3 py-2 text-sm text-white hover:bg-white/20" title="Change my password"><FaKey /></Link>
          <button onClick={signOut} className="rounded-lg bg-white/10 px-3 py-2 text-sm text-white hover:bg-white/20" title="Sign out"><FaSignOutAlt /></button>
        </div>
      </div>
    </nav>
  );

  return (
    <WhoCtx.Provider value={who}>
      <div className="min-h-screen bg-[#f5f7fb] text-gray-900">
        <aside className="fixed inset-y-0 left-0 z-30 hidden w-64 print:!hidden bg-gradient-to-b from-primary-900 to-primary-800 lg:block">{side}</aside>
        {menu && (
          <div className="fixed inset-0 z-40 lg:hidden" onClick={() => setMenu(false)}>
            <div className="absolute inset-0 bg-gray-900/50" />
            <aside className="absolute inset-y-0 left-0 w-72 bg-gradient-to-b from-primary-900 to-primary-800" onClick={(e) => e.stopPropagation()}>
              <button onClick={() => setMenu(false)} className="absolute right-3 top-5 p-2 text-white" aria-label="Close menu"><FaTimes /></button>
              {side}
            </aside>
          </div>
        )}
        <header className="sticky top-0 z-20 flex print:hidden items-center gap-3 border-b border-gray-200 bg-white/95 px-4 py-3 backdrop-blur lg:hidden">
          <button onClick={() => setMenu(true)} className="rounded-lg p-2 text-gray-700 hover:bg-gray-100" aria-label="Open menu"><FaBars /></button>
          <img src="/image/New_Logo.png" alt="" className="h-8 w-8" />
          <span className="font-heading font-extrabold">Church Office</span>
        </header>
        <main className="px-4 py-5 md:px-8 md:py-8 lg:ml-64 print:m-0 print:p-0">
          <div className="mx-auto max-w-6xl"><Outlet /></div>
        </main>
      </div>
    </WhoCtx.Provider>
  );
}
