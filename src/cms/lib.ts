import api from '../utils/api';

// ---------------------------------------------------------------- types (match /api/cms on the server)
export type Who = {
  user: { id: number; email: string; name: string; role: string; photo: string };
  memberId: number | null;
  can: { people: boolean; money: boolean; admin: boolean };
};
export type Member = {
  id: number; title: string; first_name: string; last_name: string; gender: '' | 'male' | 'female';
  phone: string; email: string; address: string | null;
  birth_day: number | null; birth_month: number | null; birth_year: number | null;
  ann_day: number | null; ann_month: number | null;
  marital_status: string; spouse_name: string; family_id: number | null; family_role: string;
  photo_url: string; status: 'member' | 'worker' | 'visitor' | 'inactive'; occupation: string;
  join_date: string | null; baptism_date: string | null; department_text: string; consent_screen: number;
  source: string; notes: string | null; user_id: number | null; studio_id: string | null;
  family_name?: string | null; groups_text?: string | null; last_seen?: string | null;
};
export type Group = { id: number; name: string; type: string; leader_id: number | null; leader_name?: string; meets: string; description: string; size?: number };
export type Service = {
  id: number; date: string; type: string; title: string; men: number; women: number; children: number; online: number;
  checkin_code: string; checkin_open: number; notes: string | null; present?: number; first_timers?: number;
};
export type FirstTimer = {
  id: number; name: string; phone: string; email: string; address: string; gender: string; visit_date: string; service_id: number | null;
  invited_by: string; how_heard: string; wants: string; prayer: string; status: string; assigned_to: number | null; assigned_name?: string;
  member_id: number | null; source: string; followups?: number; last_followup?: string | null;
};
export type Giving = {
  id: number; date: string; member_id: number | null; member_name?: string | null; name: string; type: string; amount: number;
  method: string; reference: string; service_id: number | null; pledge_id: number | null; pledge_purpose?: string | null; notes: string;
};

// ---------------------------------------------------------------- API
const C = '/cms';
export const cms = {
  get: <T = any>(path: string, params?: any) => api.get<T>(C + path, { params }).then((r) => r.data),
  post: <T = any>(path: string, body?: any) => api.post<T>(C + path, body).then((r) => r.data),
  put: <T = any>(path: string, body?: any) => api.put<T>(C + path, body).then((r) => r.data),
  del: <T = any>(path: string) => api.delete<T>(C + path).then((r) => r.data),
  form: <T = any>(method: 'post' | 'put', path: string, data: FormData) =>
    api.request<T>({ method, url: C + path, data, headers: { 'Content-Type': 'multipart/form-data' } }).then((r) => r.data),
  download: async (path: string, filename: string) => {
    const r = await api.get(C + path, { responseType: 'blob' });
    const url = URL.createObjectURL(r.data as Blob);
    const a = document.createElement('a'); a.href = url; a.download = filename; a.click();
    setTimeout(() => URL.revokeObjectURL(url), 2000);
  },
};
export const errText = (e: any, fallback = 'Something went wrong. Please try again.') =>
  e?.response?.data?.message || (e?.message === 'Network Error' ? 'Couldn’t reach the server. Check the internet (the free server can take a minute to wake up).' : fallback);

// ---------------------------------------------------------------- formatting
export const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
export const MON = MONTHS.map((m) => m.slice(0, 3));
export const naira = (n: number | string | null | undefined) =>
  '₦' + Number(n || 0).toLocaleString('en-NG', { minimumFractionDigits: 0, maximumFractionDigits: 2 });
export const nameOf = (m: Partial<Member> | null | undefined) => (m ? [m.title, m.first_name, m.last_name].filter(Boolean).join(' ') : '');
export const initials = (m: Partial<Member>) => ((m.first_name || '?')[0] + (m.last_name || '')[0] || '').toUpperCase();
export const todayISO = () => {
  const d = new Date(); const p = (n: number) => String(n).padStart(2, '0');
  return `${d.getFullYear()}-${p(d.getMonth() + 1)}-${p(d.getDate())}`;
};
export const dayOf = (s?: string | null) => (s ? new Date(String(s).slice(0, 10) + 'T12:00:00') : null);
export const niceDate = (s?: string | null, withDay = false) => {
  const d = dayOf(s); if (!d || isNaN(d.getTime())) return '';
  return d.toLocaleDateString('en-NG', { weekday: withDay ? 'short' : undefined, day: 'numeric', month: 'short', year: 'numeric' });
};
export const ago = (s?: string | null) => {
  const d = dayOf(s); if (!d) return 'never';
  const days = Math.round((Date.now() - d.getTime()) / 864e5);
  if (days <= 0) return 'today'; if (days === 1) return 'yesterday';
  if (days < 14) return `${days} days ago`; if (days < 60) return `${Math.round(days / 7)} weeks ago`;
  return `${Math.round(days / 30)} months ago`;
};
export const bday = (m: Partial<Member>) => (m.birth_day && m.birth_month ? `${m.birth_day} ${MONTHS[m.birth_month - 1]}` : '');
export const label = (s?: string) => (s || '').replace(/_/g, ' ').replace(/^\w/, (c) => c.toUpperCase());

/** Nigerian phone → WhatsApp number (234…) */
export const waNumber = (p?: string) => {
  let d = String(p || '').replace(/\D/g, '');
  if (/^0\d{10}$/.test(d)) d = '234' + d.slice(1);
  if (/^[789]\d{9}$/.test(d)) d = '234' + d;
  return d.length >= 12 ? d : '';
};
export const waLink = (p: string | undefined, text: string) => {
  const n = waNumber(p); return n ? `https://wa.me/${n}?text=${encodeURIComponent(text)}` : '';
};

export const SERVICE_TYPES: [string, string][] = [
  ['sunday_service', 'Sunday Service'], ['sunday_school', 'Sunday School'], ['prayer', 'Prayer Hour'], ['bible_study', 'Bible Study'],
  ['vigil', 'Vigil'], ['youth', 'Youth Service'], ['special', 'Special Programme'], ['other', 'Other'],
];
export const serviceName = (s: Pick<Service, 'type' | 'title'>) => s.title || (SERVICE_TYPES.find((t) => t[0] === s.type)?.[1] ?? 'Service');
export const GIVING_TYPES: [string, string][] = [
  ['tithe', 'Tithe'], ['offering', 'Offering'], ['thanksgiving', 'Thanksgiving'], ['seed', 'Seed'], ['first_fruit', 'First fruit'],
  ['building', 'Building fund'], ['missions', 'Missions'], ['welfare', 'Welfare'], ['pledge', 'Pledge payment'], ['special', 'Special'], ['other', 'Other'],
];
export const givingName = (t: string) => GIVING_TYPES.find((x) => x[0] === t)?.[1] ?? label(t);
export const METHODS: [string, string][] = [['cash', 'Cash'], ['transfer', 'Bank transfer'], ['pos', 'POS'], ['online', 'Online'], ['cheque', 'Cheque'], ['other', 'Other']];
export const EXPENSE_CATEGORIES = ['Diesel & fuel', 'Electricity', 'Rent', 'Salaries & allowances', 'Welfare', 'Missions', 'Building & repairs', 'Equipment', 'Hospitality', 'Transport', 'Printing', 'Internet & data', 'Programmes', 'Other'];
export const FT_STATUS: [string, string][] = [['new', 'New'], ['contacted', 'Contacted'], ['returned', 'Came back'], ['member', 'Now a member'], ['not_interested', 'Not interested']];
export const MEMBER_STATUS: [string, string][] = [['member', 'Member'], ['worker', 'Worker'], ['visitor', 'Visitor'], ['inactive', 'Inactive']];

export const CHURCH = 'Household Of Covenant And Faith Apostolic Ministry';
export const CHURCH_SHORT = 'Hocfam';

// the member list is used by many pickers: load it once, refresh after changes
let membersCache: Promise<Member[]> | null = null;
export const getMembersCached = (fresh = false) => {
  if (!membersCache || fresh) membersCache = cms.get<{ items: Member[] }>('/members').then((d) => d.items).catch((e) => { membersCache = null; throw e; });
  return membersCache;
};
export const forgetMembers = () => { membersCache = null; };
