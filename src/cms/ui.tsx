import { ReactNode, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { FaTimes, FaSearch } from 'react-icons/fa';
import { errText, getMembersCached, initials, Member, nameOf } from './lib';
import { getAssetUrl } from '../utils/api';

// ---------------------------------------------------------------- data loading
export function useLoad<T>(fn: () => Promise<T>, deps: any[] = []) {
  const [data, setData] = useState<T | null>(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const seq = useRef(0);
  const reload = useCallback(() => {
    const n = ++seq.current;
    setLoading(true);
    return fn()
      .then((d) => { if (n === seq.current) { setData(d); setError(''); } })
      .catch((e) => { if (n === seq.current) setError(errText(e)); })
      .finally(() => { if (n === seq.current) setLoading(false); });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);
  useEffect(() => { reload(); }, [reload]);
  return { data, error, loading, reload, setData };
}

// ---------------------------------------------------------------- styles
export const inp = 'w-full rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-[15px] text-gray-900 placeholder:text-gray-400 focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-200 disabled:bg-gray-50';

type BtnKind = 'primary' | 'gold' | 'ghost' | 'danger' | 'soft';
const BTN: Record<BtnKind, string> = {
  primary: 'bg-primary-700 text-white hover:bg-primary-800 shadow-sm',
  gold: 'bg-secondary-500 text-white hover:bg-secondary-600 shadow-sm',
  ghost: 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50',
  soft: 'bg-primary-50 text-primary-800 hover:bg-primary-100',
  danger: 'bg-white text-red-600 border border-red-200 hover:bg-red-50',
};
export function Btn({ kind = 'primary', small, className = '', ...p }: React.ButtonHTMLAttributes<HTMLButtonElement> & { kind?: BtnKind; small?: boolean }) {
  return (
    <button
      type="button"
      {...p}
      className={`inline-flex items-center justify-center gap-2 rounded-lg font-semibold transition disabled:cursor-not-allowed disabled:opacity-50 ${small ? 'px-3 py-1.5 text-sm' : 'px-4 py-2.5 text-[15px]'} ${BTN[kind]} ${className}`}
    />
  );
}

// ---------------------------------------------------------------- layout pieces
export function PageHead({ title, sub, actions }: { title: string; sub?: ReactNode; actions?: ReactNode }) {
  return (
    <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
      <div>
        <h1 className="font-heading text-2xl font-extrabold tracking-tight text-gray-900 md:text-[28px]">{title}</h1>
        {sub && <p className="mt-1 text-[15px] text-gray-600">{sub}</p>}
      </div>
      {actions && <div className="flex flex-wrap gap-2">{actions}</div>}
    </div>
  );
}
export function Card({ children, className = '', title, actions }: { children: ReactNode; className?: string; title?: ReactNode; actions?: ReactNode }) {
  return (
    <section className={`min-w-0 rounded-2xl border border-gray-200 bg-white p-4 shadow-sm md:p-5 ${className}`}>
      {(title || actions) && (
        <div className="mb-3 flex items-center justify-between gap-3">
          {title && <h2 className="text-base font-bold text-gray-900">{title}</h2>}
          {actions}
        </div>
      )}
      {children}
    </section>
  );
}
export function Stat({ label, value, sub, to, tone = 'primary' }: { label: string; value: ReactNode; sub?: ReactNode; to?: string; tone?: 'primary' | 'gold' | 'accent' | 'green' }) {
  const bar = { primary: 'bg-primary-600', gold: 'bg-secondary-500', accent: 'bg-accent-600', green: 'bg-emerald-600' }[tone];
  const body = (
    <div className="relative h-full overflow-hidden rounded-2xl border border-gray-200 bg-white p-4 shadow-sm transition hover:shadow-md">
      <span className={`absolute inset-y-0 left-0 w-1 ${bar}`} />
      <p className="text-[13px] font-semibold uppercase tracking-wide text-gray-500">{label}</p>
      <p className="mt-1 font-heading text-2xl font-extrabold text-gray-900 md:text-3xl">{value}</p>
      {sub && <p className="mt-1 text-sm text-gray-600">{sub}</p>}
    </div>
  );
  return to ? <Link to={to} className="block h-full">{body}</Link> : body;
}
export function Badge({ children, tone = 'gray' }: { children: ReactNode; tone?: 'gray' | 'blue' | 'green' | 'gold' | 'red' | 'purple' }) {
  const c = { gray: 'bg-gray-100 text-gray-700', blue: 'bg-primary-50 text-primary-700', green: 'bg-emerald-50 text-emerald-700', gold: 'bg-secondary-50 text-secondary-700', red: 'bg-red-50 text-red-700', purple: 'bg-accent-50 text-accent-700' }[tone];
  return <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ${c}`}>{children}</span>;
}
export function Avatar({ m, size = 40 }: { m: Partial<Member>; size?: number }) {
  const [bad, setBad] = useState(false);
  const src = m.photo_url ? getAssetUrl(m.photo_url) : '';
  const style = { width: size, height: size, fontSize: size * 0.38 };
  if (src && !bad) return <img src={src} alt="" onError={() => setBad(true)} style={style} className="shrink-0 rounded-full bg-gray-100 object-cover" loading="lazy" />;
  const hue = ((m.id || 0) * 47) % 360;
  return (
    <span style={{ ...style, background: `hsl(${hue} 45% 92%)`, color: `hsl(${hue} 45% 30%)` }} className="inline-flex shrink-0 items-center justify-center rounded-full font-bold">
      {initials(m)}
    </span>
  );
}
export function Empty({ title, text, action }: { title: string; text?: ReactNode; action?: ReactNode }) {
  return (
    <div className="rounded-2xl border border-dashed border-gray-300 bg-white px-6 py-10 text-center">
      <p className="font-semibold text-gray-800">{title}</p>
      {text && <p className="mx-auto mt-1 max-w-md text-sm text-gray-600">{text}</p>}
      {action && <div className="mt-4 flex justify-center">{action}</div>}
    </div>
  );
}
export function Loading({ text = 'Loading…' }: { text?: string }) {
  return (
    <div className="flex items-center justify-center gap-3 py-16 text-gray-500">
      <span className="h-5 w-5 animate-spin rounded-full border-2 border-gray-300 border-t-primary-600" /> {text}
    </div>
  );
}
export function ErrorBox({ text, retry }: { text: string; retry?: () => void }) {
  return (
    <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-red-800">
      {text} {retry && <button className="ml-2 font-semibold underline" onClick={retry}>Try again</button>}
    </div>
  );
}

// ---------------------------------------------------------------- forms
export function Field({ label, children, hint, className = '' }: { label: string; children: ReactNode; hint?: ReactNode; className?: string }) {
  return (
    <label className={`block ${className}`}>
      <span className="mb-1 block text-sm font-semibold text-gray-700">{label}</span>
      {children}
      {hint && <span className="mt-1 block text-xs text-gray-500">{hint}</span>}
    </label>
  );
}
export function Modal({ open, title, onClose, children, footer, wide }: { open: boolean; title: string; onClose: () => void; children: ReactNode; footer?: ReactNode; wide?: boolean }) {
  useEffect(() => {
    if (!open) return;
    const k = (e: KeyboardEvent) => e.key === 'Escape' && onClose();
    document.addEventListener('keydown', k);
    const prev = document.body.style.overflow; document.body.style.overflow = 'hidden';
    return () => { document.removeEventListener('keydown', k); document.body.style.overflow = prev; };
  }, [open, onClose]);
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-gray-900/50 sm:items-center sm:p-4" onMouseDown={(e) => e.target === e.currentTarget && onClose()}>
      <div role="dialog" aria-modal="true" aria-label={title} className={`flex max-h-[94vh] w-full flex-col rounded-t-2xl bg-white shadow-2xl sm:rounded-2xl ${wide ? 'sm:max-w-3xl' : 'sm:max-w-lg'}`}>
        <div className="flex items-center justify-between border-b border-gray-100 px-5 py-4">
          <h2 className="text-lg font-bold text-gray-900">{title}</h2>
          <button onClick={onClose} aria-label="Close" className="rounded-lg p-2 text-gray-500 hover:bg-gray-100"><FaTimes /></button>
        </div>
        <div className="overflow-y-auto px-5 py-4">{children}</div>
        {footer && <div className="flex flex-wrap justify-end gap-2 border-t border-gray-100 px-5 py-3">{footer}</div>}
      </div>
    </div>
  );
}
export function Tabs<T extends string>({ value, onChange, items }: { value: T; onChange: (v: T) => void; items: [T, ReactNode][] }) {
  return (
    <div className="mb-4 flex gap-1 overflow-x-auto rounded-xl bg-gray-100 p-1">
      {items.map(([k, l]) => (
        <button key={k} type="button" onClick={() => onChange(k)}
          className={`whitespace-nowrap rounded-lg px-3.5 py-2 text-sm font-semibold transition ${value === k ? 'bg-white text-primary-800 shadow-sm' : 'text-gray-600 hover:text-gray-900'}`}>{l}</button>
      ))}
    </div>
  );
}
export function Search({ value, onChange, placeholder }: { value: string; onChange: (v: string) => void; placeholder: string }) {
  return (
    <div className="relative">
      <FaSearch className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
      <input className={`${inp} pl-9`} value={value} onChange={(e) => onChange(e.target.value)} placeholder={placeholder} type="search" />
    </div>
  );
}

/** Find a member by typing part of the name or phone number */
export function MemberPicker({ value, onChange, placeholder = 'Type a name or phone number', allowName }: {
  value: number | null; onChange: (id: number | null, m?: Member, typed?: string) => void; placeholder?: string; allowName?: boolean;
}) {
  const [list, setList] = useState<Member[]>([]);
  const [q, setQ] = useState('');
  const [open, setOpen] = useState(false);
  useEffect(() => { getMembersCached().then(setList).catch(() => {}); }, []);
  const chosen = value ? list.find((m) => m.id === value) : null;
  const hits = useMemo(() => {
    const t = q.trim().toLowerCase(); if (!t) return [];
    const digits = t.replace(/\D/g, '');
    return list.filter((m) => nameOf(m).toLowerCase().includes(t) || (digits.length >= 4 && m.phone.replace(/\D/g, '').includes(digits))).slice(0, 8);
  }, [q, list]);
  if (chosen) {
    return (
      <div className="flex items-center gap-3 rounded-lg border border-primary-200 bg-primary-50 px-3 py-2">
        <Avatar m={chosen} size={32} />
        <span className="flex-1 font-semibold text-gray-900">{nameOf(chosen)}</span>
        <button type="button" className="text-sm font-semibold text-primary-700" onClick={() => { onChange(null); setQ(''); }}>Change</button>
      </div>
    );
  }
  return (
    <div className="relative">
      <input className={inp} value={q} placeholder={placeholder} onFocus={() => setOpen(true)} onBlur={() => setTimeout(() => setOpen(false), 150)}
        onChange={(e) => { setQ(e.target.value); setOpen(true); if (allowName) onChange(null, undefined, e.target.value); }} />
      {open && hits.length > 0 && (
        <div className="absolute z-20 mt-1 max-h-72 w-full overflow-y-auto rounded-xl border border-gray-200 bg-white shadow-lg">
          {hits.map((m) => (
            <button type="button" key={m.id} onMouseDown={(e) => e.preventDefault()} onClick={() => { onChange(m.id, m); setQ(''); setOpen(false); }}
              className="flex w-full items-center gap-3 px-3 py-2 text-left hover:bg-primary-50">
              <Avatar m={m} size={30} /><span className="flex-1"><span className="block font-semibold text-gray-900">{nameOf(m)}</span><span className="text-xs text-gray-500">{m.phone}</span></span>
            </button>
          ))}
        </div>
      )}
      {allowName && q && !hits.length && <p className="mt-1 text-xs text-gray-500">Not in the register: it will be saved under the name “{q}”.</p>}
    </div>
  );
}

export function Confirm({ open, title, text, ok = 'Delete', onOk, onClose }: { open: boolean; title: string; text: ReactNode; ok?: string; onOk: () => void; onClose: () => void }) {
  return (
    <Modal open={open} title={title} onClose={onClose} footer={<><Btn kind="ghost" onClick={onClose}>Cancel</Btn><Btn kind="danger" onClick={() => { onOk(); onClose(); }}>{ok}</Btn></>}>
      <p className="text-gray-700">{text}</p>
    </Modal>
  );
}

/** Simple bar chart (no chart library needed) */
export function Bars({ items, money: isMoney, height = 160, fmt }: { items: { label: string; value: number; value2?: number }[]; money?: boolean; height?: number; fmt?: (n: number) => string }) {
  const max = Math.max(1, ...items.map((i) => Math.max(i.value, i.value2 || 0)));
  const show = fmt || ((n: number) => (isMoney ? '₦' + (n >= 1e6 ? (n / 1e6).toFixed(1) + 'm' : n >= 1e3 ? Math.round(n / 1e3) + 'k' : n) : String(n)));
  return (
    <div className="flex items-end gap-2 overflow-x-auto pb-1" style={{ height: height + 40 }}>
      {items.map((i, k) => (
        <div key={k} className="flex min-w-[38px] flex-1 flex-col items-center justify-end gap-1">
          <div className="flex w-full items-end justify-center gap-1" style={{ height }}>
            <div title={`${i.label}: ${show(i.value)}`} className="w-full max-w-[28px] rounded-t-md bg-primary-600" style={{ height: `${(i.value / max) * 100}%`, minHeight: i.value ? 3 : 0 }} />
            {i.value2 !== undefined && <div title={`${i.label}: ${show(i.value2)}`} className="w-full max-w-[28px] rounded-t-md bg-secondary-400" style={{ height: `${(i.value2 / max) * 100}%`, minHeight: i.value2 ? 3 : 0 }} />}
          </div>
          <span className="text-[11px] font-semibold text-gray-700">{show(i.value)}</span>
          <span className="whitespace-nowrap text-[11px] text-gray-500">{i.label}</span>
        </div>
      ))}
    </div>
  );
}
