import { useEffect, useMemo, useState } from 'react';
import { NavLink, Outlet } from 'react-router-dom';

import { getStoredUser, logoutUser } from '../api/api';
import { connectSocket, disconnectSocket } from '../socket';

const navLinkClass = ({ isActive }) =>
  [
    'rounded-full px-4 py-2 text-sm font-semibold transition',
    isActive
      ? 'bg-[#102a43] text-[#f7f1e8] shadow-[0_12px_30px_rgba(16,42,67,0.18)]'
      : 'text-[#52606d] hover:bg-white hover:text-[#102a43]',
  ].join(' ');

function MainLayout() {
  const [user, setUser] = useState(() => getStoredUser());

  useEffect(() => {
    connectSocket();
    const syncUser = () => setUser(getStoredUser());

    window.addEventListener('staynest-auth-change', syncUser);
    window.addEventListener('storage', syncUser);

    return () => {
      window.removeEventListener('staynest-auth-change', syncUser);
      window.removeEventListener('storage', syncUser);
    };
  }, []);

  const navItems = useMemo(() => {
    if (!user) {
      return [
        { label: 'Home', to: '/' },
        { label: 'Properties', to: '/properties' },
        { label: 'Community', to: '/community' },
        { label: 'About', to: '/about' },
        { label: 'Help', to: '/need-help' },
      ];
    }

    const roleNavItems = {
      student: [
        { label: 'Dashboard', to: '/dashboard' },
        { label: 'Properties', to: '/properties' },
        { label: 'Community', to: '/community' },
        { label: 'Notifications', to: '/notifications' },
      ],
      renter: [
        { label: 'Dashboard', to: '/dashboard' },
        { label: 'My Properties', to: '/my-properties' },
        { label: 'Add Property', to: '/properties/new' },
        { label: 'Requests', to: '/properties/requests' },
        { label: 'Total listings', to: '/properties/summary' },
        { label: 'Active tenants', to: '/properties/tenants' },
      ],
      service_provider: [
        { label: 'Dashboard', to: '/dashboard' },
        { label: 'Add Service', to: '/services/new' },
        { label: 'My Services', to: '/my-services' },
        { label: 'Active service holders', to: '/services/holders' },
      ],
      admin: [
        { label: 'Dashboard', to: '/admin/dashboard' },
        { label: 'Total users', to: '/admin/users' },
        { label: 'Total listings', to: '/admin/listings' },
        { label: 'Total posts', to: '/admin/posts' },
        { label: 'Reports', to: '/admin/reports' },
        { label: 'Manage Students', to: '/admin/students' },
        { label: 'Manage Services', to: '/admin/services' },
        { label: 'Content Moderation', to: '/admin/moderation' },
        { label: 'Remove fake posts', to: '/admin/fake-posts' },
        { label: 'Handle complaints', to: '/admin/complaints' },
        { label: 'Manage Renters', to: '/admin/renters' },
      ],
    };

    return roleNavItems[user.role] || roleNavItems.student;
  }, [user]);

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top_left,_rgba(217,119,6,0.08),_transparent_35%),linear-gradient(180deg,_#f7f1e8_0%,_#f7f1e8_72%,_#f1ece2_100%)] text-[#102a43]">
      <header className="sticky top-0 z-50 border-b border-black/5 bg-[#f7f1e8]/90 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center gap-4 px-4 py-4 sm:px-6 lg:px-8">
          <NavLink to="/" className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#102a43] text-lg font-black text-[#f7f1e8] shadow-[0_16px_32px_rgba(16,42,67,0.2)]">
              S
            </div>
            <div>
              <p className="text-lg font-black tracking-[0.14em]">STAYNEST</p>
              <p className="text-[11px] uppercase tracking-[0.28em] text-[#829ab1]">
                rooms, people, support
              </p>
            </div>
          </NavLink>

          <nav className="flex flex-1 flex-wrap justify-center gap-2">
            {navItems.map((item) => (
              <NavLink key={item.to + item.label} to={item.to} className={navLinkClass}>
                {item.label}
              </NavLink>
            ))}
          </nav>

          <div className="ml-auto flex items-center gap-2">
            {!user ? (
              <>
                <NavLink
                  to="/login"
                  className="rounded-full border border-[#102a43]/10 bg-white px-4 py-2 text-sm font-semibold text-[#102a43] transition hover:-translate-y-0.5 hover:shadow-[0_10px_25px_rgba(16,42,67,0.12)]"
                >
                  Login
                </NavLink>
                <NavLink
                  to="/signup"
                  className="rounded-full bg-[#102a43] px-4 py-2 text-sm font-semibold text-[#f7f1e8] transition hover:-translate-y-0.5 hover:bg-[#0b1f33]"
                >
                  Signup
                </NavLink>
              </>
            ) : (
              <>
                <NavLink
                  to="/profile"
                  className="rounded-full border border-[#102a43]/10 bg-white px-4 py-2 text-sm font-semibold text-[#102a43]"
                >
                  {user.name || 'Profile'}
                </NavLink>
                <button
                  onClick={() => {
                    logoutUser();
                    disconnectSocket();
                    window.location.href = '/';
                  }}
                  className="rounded-full bg-[#b45309] px-4 py-2 text-sm font-semibold text-white transition hover:bg-[#92400e]"
                >
                  Logout
                </button>
              </>
            )}
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <Outlet />
      </main>
    </div>
  );
}

export default MainLayout;
