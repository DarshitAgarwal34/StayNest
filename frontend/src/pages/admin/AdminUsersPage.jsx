import { useEffect, useMemo, useState } from 'react';

import { fetchAdminOverview } from '../../api/api';

function AdminUsersPage() {
  const [overview, setOverview] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const response = await fetchAdminOverview();
        setOverview(response?.data || null);
      } catch {
        setOverview(null);
      } finally {
        setLoading(false);
      }
    };

    load();
  }, []);

  const rows = useMemo(() => {
    const grouped = overview?.usersByRole || {};
    return Object.entries(grouped).flatMap(([role, users]) =>
      users.map((user) => ({ ...user, role }))
    );
  }, [overview]);

  return (
    <section className="space-y-8">
      <div className="soft-panel rounded-[2.25rem] px-6 py-8 sm:px-10">
        <p className="text-xs font-bold uppercase tracking-[0.28em] text-[#b45309]">Admin</p>
        <h1 className="display-serif mt-4 text-5xl text-[#102a43] sm:text-6xl">
          Total users
        </h1>
        <p className="mt-4 max-w-2xl text-[#52606d]">
          Review the live account list broken down by role.
        </p>
      </div>

      {loading ? (
        <div className="soft-panel rounded-[1.75rem] p-10 text-center text-[#52606d]">
          Loading users...
        </div>
      ) : !rows.length ? (
        <div className="empty-state rounded-[1.75rem] p-12 text-center">
          <h2 className="display-serif text-4xl text-[#102a43]">Coming Soon</h2>
          <p className="mt-3 text-[#52606d]">No users are available yet.</p>
        </div>
      ) : (
        <div className="overflow-hidden rounded-[1.75rem] border border-[#102a43]/8 bg-white shadow-[0_16px_40px_rgba(16,42,67,0.06)]">
          <table className="w-full text-left text-sm">
            <thead className="bg-[#f7f1e8] text-[#102a43]">
              <tr>
                <th className="px-4 py-3">Name</th>
                <th className="px-4 py-3">Email</th>
                <th className="px-4 py-3">Role</th>
                <th className="px-4 py-3">Phone</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((user) => (
                <tr key={user.id} className="border-t border-[#102a43]/8">
                  <td className="px-4 py-3 font-semibold text-[#102a43]">{user.name}</td>
                  <td className="px-4 py-3 text-[#52606d]">{user.email}</td>
                  <td className="px-4 py-3 text-[#52606d]">{user.role}</td>
                  <td className="px-4 py-3 text-[#52606d]">{user.phone || 'N/A'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
}

export default AdminUsersPage;
