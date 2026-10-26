import { lazy, ReactNode, Suspense } from 'react';
import { Route } from 'react-router-dom';
import { Loading } from './ui';

// The church office is only downloaded by the people who open it, so the public website stays fast
const CmsLayout = lazy(() => import('./CmsLayout'));
const SignIn = lazy(() => import('./SignIn'));
const Dashboard = lazy(() => import('./pages/Dashboard'));
const Members = lazy(() => import('./pages/Members'));
const MemberProfile = lazy(() => import('./pages/MemberProfile'));
const Statement = lazy(() => import('./pages/Statement'));
const Families = lazy(() => import('./pages/Families'));
const Groups = lazy(() => import('./pages/Groups'));
const GroupDetail = lazy(() => import('./pages/Groups').then((m) => ({ default: m.GroupDetail })));
const Services = lazy(() => import('./pages/Services'));
const ServiceDetail = lazy(() => import('./pages/Services').then((m) => ({ default: m.ServiceDetail })));
const FirstTimers = lazy(() => import('./pages/FirstTimers'));
const Celebrations = lazy(() => import('./pages/Celebrations'));
const Messages = lazy(() => import('./pages/Messages'));
const GivingPage = lazy(() => import('./pages/Finance').then((m) => ({ default: m.GivingPage })));
const PledgesPage = lazy(() => import('./pages/Finance').then((m) => ({ default: m.PledgesPage })));
const ExpensesPage = lazy(() => import('./pages/Finance').then((m) => ({ default: m.ExpensesPage })));
const ReportsPage = lazy(() => import('./pages/Finance').then((m) => ({ default: m.ReportsPage })));
const StaffPage = lazy(() => import('./pages/Admin').then((m) => ({ default: m.StaffPage })));
const ActivityPage = lazy(() => import('./pages/Admin').then((m) => ({ default: m.ActivityPage })));
const MyPortal = lazy(() => import('./Portal').then((m) => ({ default: m.MyPortal })));
const MyRegister = lazy(() => import('./Portal').then((m) => ({ default: m.MyRegister })));
const MyCheckin = lazy(() => import('./Portal').then((m) => ({ default: m.MyCheckin })));
const Welcome = lazy(() => import('./Portal').then((m) => ({ default: m.Welcome })));

const S = ({ children }: { children: ReactNode }) => <Suspense fallback={<Loading />}>{children}</Suspense>;

/** Church management system: staff at /cms, members at /my, visitors at /welcome */
export const cmsRoutes = [
  <Route key="cms-login" path="/cms/login" element={<S><SignIn /></S>} />,
  <Route key="cms" path="/cms" element={<S><CmsLayout /></S>}>
    <Route index element={<S><Dashboard /></S>} />
    <Route path="members" element={<S><Members /></S>} />
    <Route path="members/:id" element={<S><MemberProfile /></S>} />
    <Route path="members/:id/statement" element={<S><Statement /></S>} />
    <Route path="families" element={<S><Families /></S>} />
    <Route path="groups" element={<S><Groups /></S>} />
    <Route path="groups/:id" element={<S><GroupDetail /></S>} />
    <Route path="services" element={<S><Services /></S>} />
    <Route path="services/:id" element={<S><ServiceDetail /></S>} />
    <Route path="first-timers" element={<S><FirstTimers /></S>} />
    <Route path="celebrations" element={<S><Celebrations /></S>} />
    <Route path="messages" element={<S><Messages /></S>} />
    <Route path="giving" element={<S><GivingPage /></S>} />
    <Route path="pledges" element={<S><PledgesPage /></S>} />
    <Route path="expenses" element={<S><ExpensesPage /></S>} />
    <Route path="reports" element={<S><ReportsPage /></S>} />
    <Route path="staff" element={<S><StaffPage /></S>} />
    <Route path="activity" element={<S><ActivityPage /></S>} />
  </Route>,
  <Route key="my" path="/my" element={<S><MyPortal /></S>} />,
  <Route key="my-login" path="/my/login" element={<S><SignIn portal /></S>} />,
  <Route key="my-register" path="/my/register" element={<S><MyRegister /></S>} />,
  <Route key="my-checkin" path="/my/checkin" element={<S><MyCheckin /></S>} />,
  <Route key="welcome" path="/welcome" element={<S><Welcome /></S>} />,
];
