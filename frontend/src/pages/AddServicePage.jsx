import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { createService } from '../api/api';

function AddServicePage() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    title: '',
    description: '',
    price: '',
    location: '',
  });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((current) => ({ ...current, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setSaving(true);
    setError('');

    try {
      await createService({
        ...form,
        price: Number(form.price),
      });
      navigate('/my-services');
    } catch (apiError) {
      setError(apiError.response?.data?.message || 'Unable to create service right now.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <section className="space-y-8">
      <div className="soft-panel rounded-[2.25rem] px-6 py-8 sm:px-10">
        <p className="text-xs font-bold uppercase tracking-[0.28em] text-[#b45309]">Service Provider</p>
        <h1 className="display-serif mt-4 text-5xl text-[#102a43] sm:text-6xl">
          Add a service listing.
        </h1>
        <p className="mt-4 max-w-2xl text-[#52606d]">
          Create a real service entry with price, location, and description.
        </p>
      </div>

      <form
        className="grid gap-5 rounded-[2rem] border border-[#102a43]/8 bg-white p-6 shadow-[0_16px_40px_rgba(16,42,67,0.06)]"
        onSubmit={handleSubmit}
      >
        <div className="grid gap-4 md:grid-cols-2">
          <input
            name="title"
            value={form.title}
            onChange={handleChange}
            placeholder="Service title"
            className="w-full rounded-[1.25rem] border border-[#102a43]/10 px-4 py-3"
            required
          />
          <input
            name="location"
            value={form.location}
            onChange={handleChange}
            placeholder="Location"
            className="w-full rounded-[1.25rem] border border-[#102a43]/10 px-4 py-3"
            required
          />
          <input
            name="price"
            type="number"
            value={form.price}
            onChange={handleChange}
            placeholder="Price"
            className="w-full rounded-[1.25rem] border border-[#102a43]/10 px-4 py-3"
            required
          />
        </div>

        <textarea
          name="description"
          value={form.description}
          onChange={handleChange}
          placeholder="Service description"
          rows="5"
          className="w-full rounded-[1.25rem] border border-[#102a43]/10 px-4 py-3"
        />

        {error ? <p className="rounded-[1.25rem] bg-rose-50 px-4 py-3 text-sm text-rose-700">{error}</p> : null}

        <button
          type="submit"
          disabled={saving}
          className="rounded-full bg-[#102a43] px-5 py-3 text-sm font-semibold text-[#f7f1e8]"
        >
          {saving ? 'Publishing...' : 'Publish Service'}
        </button>
      </form>
    </section>
  );
}

export default AddServicePage;
