import { useEffect, useState } from 'react';
import { FaPlus, FaEdit, FaTrash } from 'react-icons/fa';
import { toast } from 'react-toastify';
import { contentAPI } from '../../utils/api';
import { BibleStudyResource, BibleStudySeries, BibleStudyWeekly } from '../../types';

const emptyWeekly: BibleStudyWeekly = {
  title: '',
  scripture: '',
  time: '',
  location: '',
};

const emptySeries: Omit<BibleStudySeries, 'id'> = {
  title: '',
  description: '',
  duration: '',
  level: 'Beginner',
  sortOrder: 0,
  isActive: true,
};

const emptyResource: Omit<BibleStudyResource, 'id'> = {
  title: '',
  type: 'PDF',
  size: '',
  url: '',
  sortOrder: 0,
  isActive: true,
};

const AdminBibleStudy = () => {
  const [loading, setLoading] = useState(true);
  const [weeklyStudy, setWeeklyStudy] = useState<BibleStudyWeekly>(emptyWeekly);
  const [studies, setStudies] = useState<BibleStudySeries[]>([]);
  const [resources, setResources] = useState<BibleStudyResource[]>([]);
  const [showSeriesModal, setShowSeriesModal] = useState(false);
  const [showResourceModal, setShowResourceModal] = useState(false);
  const [currentSeries, setCurrentSeries] = useState<Partial<BibleStudySeries>>({});
  const [currentResource, setCurrentResource] = useState<Partial<BibleStudyResource>>({});
  const [resourceFile, setResourceFile] = useState<File | null>(null);

  useEffect(() => {
    fetchBibleStudyContent();
  }, []);

  const fetchBibleStudyContent = async () => {
    try {
      const response = await contentAPI.getAdminBibleStudy();
      setWeeklyStudy(response.data.weeklyStudy || emptyWeekly);
      setStudies(response.data.studies || []);
      setResources(response.data.resources || []);
    } catch (error) {
      toast.error('Failed to load Bible Study content');
    } finally {
      setLoading(false);
    }
  };

  const handleSaveWeekly = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await contentAPI.updateWeeklyBibleStudy(weeklyStudy);
      toast.success('Weekly Bible Study updated successfully');
      fetchBibleStudyContent();
    } catch (error) {
      toast.error('Failed to update weekly Bible Study');
    }
  };

  const handleSeriesSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      if (currentSeries.id) {
        await contentAPI.updateBibleStudySeries(currentSeries.id, currentSeries);
        toast.success('Series updated successfully');
      } else {
        await contentAPI.createBibleStudySeries(currentSeries);
        toast.success('Series created successfully');
      }

      setShowSeriesModal(false);
      setCurrentSeries({});
      fetchBibleStudyContent();
    } catch (error) {
      toast.error('Failed to save study series');
    }
  };

  const handleDeleteSeries = async (id: number) => {
    if (!confirm('Are you sure you want to delete this study series?')) {
      return;
    }

    try {
      await contentAPI.deleteBibleStudySeries(id);
      toast.success('Series deleted successfully');
      fetchBibleStudyContent();
    } catch (error) {
      toast.error('Failed to delete study series');
    }
  };

  const handleResourceSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const formData = new FormData();
      formData.append('title', currentResource.title || '');
      formData.append('type', currentResource.type || 'PDF');
      formData.append('size', currentResource.size || '');
      formData.append('url', currentResource.url || '');
      formData.append('sortOrder', String(currentResource.sortOrder ?? 0));
      formData.append('isActive', String(currentResource.isActive ?? true));

      if (resourceFile) {
        formData.append('resourceFile', resourceFile);
      }

      if (!currentResource.id && !resourceFile && !currentResource.url) {
        toast.error('Provide a URL or upload a file for the resource');
        return;
      }

      if (currentResource.id) {
        await contentAPI.updateBibleStudyResource(currentResource.id, formData);
        toast.success('Resource updated successfully');
      } else {
        await contentAPI.createBibleStudyResource(formData);
        toast.success('Resource created successfully');
      }

      setShowResourceModal(false);
      setCurrentResource({});
      setResourceFile(null);
      fetchBibleStudyContent();
    } catch (error) {
      toast.error('Failed to save study resource');
    }
  };

  const handleDeleteResource = async (id: number) => {
    if (!confirm('Are you sure you want to delete this study resource?')) {
      return;
    }

    try {
      await contentAPI.deleteBibleStudyResource(id);
      toast.success('Resource deleted successfully');
      fetchBibleStudyContent();
    } catch (error) {
      toast.error('Failed to delete study resource');
    }
  };

  if (loading) {
    return <div className="text-center py-8">Loading Bible Study content...</div>;
  }

  return (
    <div className="space-y-8">
      <div className="bg-white rounded-xl shadow-md p-6">
        <h1 className="text-3xl font-bold mb-6">Manage Bible Study</h1>
        <h2 className="text-xl font-semibold mb-4">Weekly Bible Study</h2>

        <form onSubmit={handleSaveWeekly} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">This Week Topic *</label>
            <input
              type="text"
              value={weeklyStudy.title || ''}
              onChange={(e) => setWeeklyStudy({ ...weeklyStudy, title: e.target.value })}
              required
              className="input-field"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Scripture *</label>
            <input
              type="text"
              value={weeklyStudy.scripture || ''}
              onChange={(e) => setWeeklyStudy({ ...weeklyStudy, scripture: e.target.value })}
              required
              className="input-field"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">Time *</label>
              <input
                type="text"
                value={weeklyStudy.time || ''}
                onChange={(e) => setWeeklyStudy({ ...weeklyStudy, time: e.target.value })}
                required
                className="input-field"
                placeholder="Wednesday, 6:00 PM"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Location *</label>
              <input
                type="text"
                value={weeklyStudy.location || ''}
                onChange={(e) => setWeeklyStudy({ ...weeklyStudy, location: e.target.value })}
                required
                className="input-field"
              />
            </div>
          </div>

          <button type="submit" className="btn-primary">
            Save Weekly Content
          </button>
        </form>
      </div>

      <div className="bg-white rounded-xl shadow-md overflow-hidden">
        <div className="flex justify-between items-center p-6 border-b">
          <h2 className="text-2xl font-bold">Current Study Series</h2>
          <button
            onClick={() => {
              setCurrentSeries(emptySeries);
              setShowSeriesModal(true);
            }}
            className="btn-primary flex items-center space-x-2"
          >
            <FaPlus />
            <span>Add Series</span>
          </button>
        </div>

        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left">Title</th>
              <th className="px-6 py-3 text-left">Duration</th>
              <th className="px-6 py-3 text-left">Level</th>
              <th className="px-6 py-3 text-left">Order</th>
              <th className="px-6 py-3 text-left">Status</th>
              <th className="px-6 py-3 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {studies.map((study) => (
              <tr key={study.id} className="border-t">
                <td className="px-6 py-4">{study.title}</td>
                <td className="px-6 py-4">{study.duration || '-'}</td>
                <td className="px-6 py-4">{study.level || '-'}</td>
                <td className="px-6 py-4">{study.sortOrder ?? 0}</td>
                <td className="px-6 py-4">
                  <span className={`px-2 py-1 rounded text-xs ${study.isActive ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'}`}>
                    {study.isActive ? 'Active' : 'Inactive'}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <div className="flex space-x-2">
                    <button
                      onClick={() => {
                        setCurrentSeries(study);
                        setShowSeriesModal(true);
                      }}
                      className="text-primary-600 hover:text-primary-800"
                    >
                      <FaEdit />
                    </button>
                    <button
                      onClick={() => handleDeleteSeries(study.id)}
                      className="text-red-600 hover:text-red-800"
                    >
                      <FaTrash />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {!studies.length && (
              <tr>
                <td className="px-6 py-8 text-center text-gray-500" colSpan={6}>
                  No study series yet. Add your first series.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <div className="bg-white rounded-xl shadow-md overflow-hidden">
        <div className="flex justify-between items-center p-6 border-b">
          <h2 className="text-2xl font-bold">Study Resources</h2>
          <button
            onClick={() => {
              setCurrentResource(emptyResource);
              setResourceFile(null);
              setShowResourceModal(true);
            }}
            className="btn-primary flex items-center space-x-2"
          >
            <FaPlus />
            <span>Add Resource</span>
          </button>
        </div>

        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left">Title</th>
              <th className="px-6 py-3 text-left">Type</th>
              <th className="px-6 py-3 text-left">Size</th>
              <th className="px-6 py-3 text-left">Order</th>
              <th className="px-6 py-3 text-left">Status</th>
              <th className="px-6 py-3 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {resources.map((resource) => (
              <tr key={resource.id} className="border-t">
                <td className="px-6 py-4">{resource.title}</td>
                <td className="px-6 py-4">{resource.type || '-'}</td>
                <td className="px-6 py-4">{resource.size || '-'}</td>
                <td className="px-6 py-4">{resource.sortOrder ?? 0}</td>
                <td className="px-6 py-4">
                  <span className={`px-2 py-1 rounded text-xs ${resource.isActive ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'}`}>
                    {resource.isActive ? 'Active' : 'Inactive'}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <div className="flex space-x-2">
                    <button
                      onClick={() => {
                        setCurrentResource(resource);
                        setResourceFile(null);
                        setShowResourceModal(true);
                      }}
                      className="text-primary-600 hover:text-primary-800"
                    >
                      <FaEdit />
                    </button>
                    <button
                      onClick={() => handleDeleteResource(resource.id)}
                      className="text-red-600 hover:text-red-800"
                    >
                      <FaTrash />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {!resources.length && (
              <tr>
                <td className="px-6 py-8 text-center text-gray-500" colSpan={6}>
                  No resources yet. Add your first study resource.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {showSeriesModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6">
            <h3 className="text-2xl font-bold mb-6">
              {currentSeries.id ? 'Edit Study Series' : 'Add Study Series'}
            </h3>

            <form onSubmit={handleSeriesSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Title *</label>
                <input
                  type="text"
                  value={currentSeries.title || ''}
                  onChange={(e) => setCurrentSeries({ ...currentSeries, title: e.target.value })}
                  required
                  className="input-field"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Description</label>
                <textarea
                  value={currentSeries.description || ''}
                  onChange={(e) => setCurrentSeries({ ...currentSeries, description: e.target.value })}
                  rows={4}
                  className="input-field"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Duration</label>
                  <input
                    type="text"
                    value={currentSeries.duration || ''}
                    onChange={(e) => setCurrentSeries({ ...currentSeries, duration: e.target.value })}
                    className="input-field"
                    placeholder="8 weeks"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Level</label>
                  <select
                    value={currentSeries.level || 'Beginner'}
                    onChange={(e) => setCurrentSeries({ ...currentSeries, level: e.target.value })}
                    className="input-field"
                  >
                    <option value="Beginner">Beginner</option>
                    <option value="Intermediate">Intermediate</option>
                    <option value="Advanced">Advanced</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Sort Order</label>
                  <input
                    type="number"
                    value={currentSeries.sortOrder ?? 0}
                    onChange={(e) => setCurrentSeries({ ...currentSeries, sortOrder: Number(e.target.value) })}
                    className="input-field"
                  />
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <input
                  id="series-active"
                  type="checkbox"
                  checked={currentSeries.isActive ?? true}
                  onChange={(e) => setCurrentSeries({ ...currentSeries, isActive: e.target.checked })}
                />
                <label htmlFor="series-active" className="text-sm font-medium">
                  Active (show on website)
                </label>
              </div>

              <div className="flex space-x-4 pt-4">
                <button type="submit" className="btn-primary flex-1">
                  {currentSeries.id ? 'Update' : 'Create'} Series
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowSeriesModal(false);
                    setCurrentSeries({});
                  }}
                  className="btn-outline flex-1"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {showResourceModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6">
            <h3 className="text-2xl font-bold mb-6">
              {currentResource.id ? 'Edit Study Resource' : 'Add Study Resource'}
            </h3>

            <form onSubmit={handleResourceSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Title *</label>
                <input
                  type="text"
                  value={currentResource.title || ''}
                  onChange={(e) => setCurrentResource({ ...currentResource, title: e.target.value })}
                  required
                  className="input-field"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Type</label>
                  <input
                    type="text"
                    value={currentResource.type || ''}
                    onChange={(e) => setCurrentResource({ ...currentResource, type: e.target.value })}
                    className="input-field"
                    placeholder="PDF"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Size (optional)</label>
                  <input
                    type="text"
                    value={currentResource.size || ''}
                    onChange={(e) => setCurrentResource({ ...currentResource, size: e.target.value })}
                    className="input-field"
                    placeholder="2.5 MB"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Resource URL</label>
                <input
                  type="text"
                  value={currentResource.url || ''}
                  onChange={(e) => setCurrentResource({ ...currentResource, url: e.target.value })}
                  className="input-field"
                  placeholder="https://... or /uploads/..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Upload File (optional)</label>
                <input
                  type="file"
                  accept=".pdf,.doc,.docx,.ppt,.pptx,.xls,.xlsx,.txt,.csv,.zip,image/*"
                  onChange={(e) => setResourceFile(e.target.files?.[0] || null)}
                  className="input-field"
                />
                <p className="text-xs text-gray-500 mt-1">Upload overrides URL if both are provided.</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Sort Order</label>
                  <input
                    type="number"
                    value={currentResource.sortOrder ?? 0}
                    onChange={(e) => setCurrentResource({ ...currentResource, sortOrder: Number(e.target.value) })}
                    className="input-field"
                  />
                </div>

                <div className="flex items-center space-x-2 mt-8">
                  <input
                    id="resource-active"
                    type="checkbox"
                    checked={currentResource.isActive ?? true}
                    onChange={(e) => setCurrentResource({ ...currentResource, isActive: e.target.checked })}
                  />
                  <label htmlFor="resource-active" className="text-sm font-medium">
                    Active (show on website)
                  </label>
                </div>
              </div>

              <div className="flex space-x-4 pt-4">
                <button type="submit" className="btn-primary flex-1">
                  {currentResource.id ? 'Update' : 'Create'} Resource
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowResourceModal(false);
                    setCurrentResource({});
                    setResourceFile(null);
                  }}
                  className="btn-outline flex-1"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminBibleStudy;