import { useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { FaArrowLeft, FaPrint } from 'react-icons/fa';
import { CHURCH, cms, givingName, label, naira, niceDate } from '../lib';
import { Btn, ErrorBox, inp, Loading, useLoad } from '../ui';

type St = { year: number; name: string; items: { id: number; date: string; type: string; amount: number; method: string; reference: string }[]; total: number };

/** The printable statement itself (used by staff and by members in their portal) */
export function StatementSheet({ st }: { st: St }) {
  const byType: Record<string, number> = {};
  st.items.forEach((i) => { byType[i.type] = (byType[i.type] || 0) + Number(i.amount); });
  return (
    <div className="statement mx-auto max-w-3xl rounded-2xl border border-gray-200 bg-white p-6 shadow-sm print:border-0 print:shadow-none md:p-10">
      <div className="mb-6 flex items-center gap-4 border-b-2 border-primary-700 pb-4">
        <img src="/image/New_Logo.png" alt="" className="h-16 w-16" />
        <div>
          <p className="font-heading text-lg font-extrabold uppercase leading-tight text-primary-900">{CHURCH}</p>
          <p className="text-sm text-gray-600">140 Obafemi Awolowo Way, Radio Bus Stop, Ikorodu, Lagos · info@hocfam.org</p>
        </div>
      </div>
      <h1 className="text-xl font-bold">Giving statement for {st.year}</h1>
      <p className="mb-5 text-gray-700">Prepared for <b>{st.name}</b> on {niceDate(new Date().toISOString())}</p>
      {st.items.length ? (
        <>
          <table className="w-full text-left text-[15px]">
            <thead><tr className="border-b border-gray-300 text-sm text-gray-500"><th className="py-2">Date</th><th>For</th><th className="hidden sm:table-cell">How</th><th className="text-right">Amount</th></tr></thead>
            <tbody>{st.items.map((i) => (
              <tr key={i.id} className="border-b border-gray-100"><td className="py-2">{niceDate(i.date)}</td><td>{givingName(i.type)}</td><td className="hidden sm:table-cell">{label(i.method)}</td><td className="text-right">{naira(i.amount)}</td></tr>
            ))}</tbody>
            <tfoot><tr><td colSpan={3} className="hidden py-3 text-right font-bold sm:table-cell">Total</td><td className="py-3 text-right font-heading text-lg font-extrabold sm:hidden">Total</td><td className="py-3 text-right font-heading text-lg font-extrabold">{naira(st.total)}</td></tr></tfoot>
          </table>
          <div className="mt-4 grid gap-1 rounded-xl bg-gray-50 p-4 text-sm sm:grid-cols-2">
            {Object.entries(byType).map(([t, v]) => <p key={t} className="flex justify-between gap-3"><span>{givingName(t)}</span><b>{naira(v)}</b></p>)}
          </div>
        </>
      ) : <p className="text-gray-600">No giving recorded for {st.year}.</p>}
      <p className="mt-8 text-sm text-gray-600">Thank you for your faithful giving. “Each of you should give what you have decided in your heart to give… for God loves a cheerful giver.” 2 Corinthians 9:7</p>
      <p className="mt-10 w-56 border-t border-gray-400 pt-1 text-sm text-gray-600">Church treasurer</p>
    </div>
  );
}

export default function Statement() {
  const { id } = useParams();
  const [year, setYear] = useState(new Date().getFullYear());
  const s = useLoad<St>(() => cms.get(`/members/${id}/statement`, { year }), [id, year]);
  const years = Array.from({ length: 6 }, (_, i) => new Date().getFullYear() - i);
  return (
    <>
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3 print:hidden">
        <Link to={`/cms/members/${id}`} className="inline-flex items-center gap-2 text-sm font-semibold text-primary-700"><FaArrowLeft /> Back</Link>
        <div className="flex gap-2">
          <select className={`${inp} !w-28`} value={year} onChange={(e) => setYear(Number(e.target.value))}>{years.map((y) => <option key={y}>{y}</option>)}</select>
          <Btn onClick={() => window.print()}><FaPrint /> Print or save as PDF</Btn>
        </div>
      </div>
      {s.loading && !s.data ? <Loading /> : s.error ? <ErrorBox text={s.error} /> : <StatementSheet st={s.data!} />}
    </>
  );
}
