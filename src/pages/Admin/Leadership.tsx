import { useEffect, useState } from 'react';
import { FaArrowDown, FaArrowUp, FaPlus, FaTrash } from 'react-icons/fa';
import { toast } from 'react-toastify';
import { contentAPI, getAssetUrl } from '../../utils/api';
import BrandImage from '../../components/BrandImage';

type Row = { name: string; role: string; photo?: string; file?: File | null; preview?: string };

const blankRow = (): Row => ({ name: '', role: '', photo: '', file: null });

const AdminLeadership = () => {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [pastorName, setPastorName] = useState('');
  const [pastorRole, setPastorRole] = useState('');
  const [pastorPhoto, setPastorPhoto] = useState('');
  const [pastorFile, setPastorFile] = useState<File | null>(null);
  const [pastorMessage, setPastorMessage] = useState('');
  const [leaders, setLeaders] = useState<Row[]>([]);

  useEffect(() => {
    contentAPI
      .getAbout()
      .then((r) => {
        const d = r.data || {};
        setPastorName(d.pastorName || '');
        setPastorRole(d.pastorRole || '');
        setPastorPhoto(d.pastorPhoto || '');
        setPastorMessage(d.pastorMessage || '');
        setLeaders((d.leaders || []).map((l: Row) => ({ ...l, file: null })));
      })
      .catch(() => toast.error('Could not load the leadership details'))
      .finally(() => setLoading(false));
  }, []);

  const update = (i: number, patch: Partial<Row>) =>
    setLeaders((rows) => rows.map((r, j) => (j === i ? { ...r, ...patch } : r)));

  const move = (i: number, dir: -1 | 1) =>
    setLeaders((rows) => {
      const j = i + dir;
      if (j < 0 || j >= rows.length) return rows;
      const next = [...rows];
      [next[i], next[j]] = [next[j], next[i]];
      return next;
    });

  const pickPhoto = (i: number, file?: File) => {
    if (!file) return;
    update(i, { file, preview: URL.createObjectURL(file) });
  };

  const save = async () => {
    const rows = leaders.filter((l) => l.name.trim());
    const form = new FormData();
    form.append(
      'data',
      JSON.stringify({
        pastorName,
        pastorRole,
        pastorPhoto,
        pastorMessage,
        leaders: rows.map((l) => ({ name: l.name, role: l.role, photo: l.photo || '' })),
      }),
    );
    if (pastorFile) form.append('pastor_photo', pastorFile);
    rows.forEach((l, i) => l.file && form.append(`photo_${i}`, l.file));

    setSaving(true);
    try {
      const r = await contentAPI.saveAbout(form);
      setPastorPhoto(r.data.pastorPhoto || '');
      setPastorFile(null);
      setLeaders((r.data.leaders || []).map((l: Row) => ({ ...l, file: null })));
      toast.success('Saved. The About page is updated.');
    } catch (error) {
      toast.error('Could not save. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="text-center py-8">Loading…</div>;

  return (
    <div className="max-w-4xl">
      <div className="flex flex-wrap justify-between items-center gap-3 mb-6">
        <div>
          <h1 className="text-3xl font-bold">Leadership</h1>
          <p className="text-gray-600">What visitors see on the About page. Leave a name empty to hide that person.</p>
        </div>
        <button onClick={save} disabled={saving} className="btn-primary disabled:opacity-60">
          {saving ? 'Saving…' : 'Save changes'}
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-md p-6 mb-6">
        <h2 className="text-xl font-bold mb-4">Pastor's message</h2>
        <div className="grid md:grid-cols-[120px_1fr] gap-5">
          <label className="cursor-pointer block text-center">
            <BrandImage
              src={pastorFile ? URL.createObjectURL(pastorFile) : getAssetUrl(pastorPhoto)}
              alt="Pastor's photo"
              className="w-28 h-28 rounded-full object-cover mx-auto"
            />
            <span className="text-xs text-primary-600 font-semibold mt-2 block">Change photo</span>
            <input type="file" accept="image/*" className="hidden" onChange={(e) => setPastorFile(e.target.files?.[0] || null)} />
          </label>
          <div className="space-y-3">
            <div className="grid sm:grid-cols-2 gap-3">
              <input className="input-field" placeholder="Name, e.g. Apostle …" value={pastorName} onChange={(e) => setPastorName(e.target.value)} />
              <input className="input-field" placeholder="Title, e.g. Senior Pastor" value={pastorRole} onChange={(e) => setPastorRole(e.target.value)} />
            </div>
            <textarea
              className="input-field min-h-[160px]"
              placeholder="The welcome message. Leave empty to keep the current wording. Use a blank line between paragraphs."
              value={pastorMessage}
              onChange={(e) => setPastorMessage(e.target.value)}
            />
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-md p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">Leadership team</h2>
          <button onClick={() => setLeaders((r) => [...r, blankRow()])} className="btn-secondary flex items-center gap-2">
            <FaPlus /> Add person
          </button>
        </div>
        {leaders.length === 0 && <p className="text-gray-500 py-6 text-center">No one added yet, so this section is hidden on the website.</p>}
        <div className="space-y-4">
          {leaders.map((l, i) => (
            <div key={i} className="flex flex-col sm:flex-row gap-4 items-start sm:items-center border border-gray-100 rounded-xl p-3">
              <label className="cursor-pointer shrink-0 text-center">
                <BrandImage src={l.preview || getAssetUrl(l.photo)} alt={l.name || 'Photo'} className="w-20 h-20 rounded-lg object-cover object-top" />
                <span className="text-xs text-primary-600 font-semibold">Photo</span>
                <input type="file" accept="image/*" className="hidden" onChange={(e) => pickPhoto(i, e.target.files?.[0])} />
              </label>
              <div className="grid sm:grid-cols-2 gap-3 flex-1 w-full">
                <input className="input-field" placeholder="Name" value={l.name} onChange={(e) => update(i, { name: e.target.value })} />
                <input className="input-field" placeholder="Role, e.g. Associate Pastor" value={l.role} onChange={(e) => update(i, { role: e.target.value })} />
              </div>
              <div className="flex gap-2">
                <button title="Move up" onClick={() => move(i, -1)} className="p-2 text-gray-500 hover:text-primary-600"><FaArrowUp /></button>
                <button title="Move down" onClick={() => move(i, 1)} className="p-2 text-gray-500 hover:text-primary-600"><FaArrowDown /></button>
                <button title="Remove" onClick={() => setLeaders((r) => r.filter((_, j) => j !== i))} className="p-2 text-red-500 hover:text-red-700"><FaTrash /></button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AdminLeadership;
