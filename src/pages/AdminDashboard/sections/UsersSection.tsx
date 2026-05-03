import React, { useMemo, useState } from 'react';
import { useAdminDashboard } from '../../../services/admin.service';
import type { AdminUser, UserRole, UserStatus } from '../../../types/admin';
import { AdminIcons } from '../adminIcons';
import SellerTopbar from '../../SellerDashboard/SellerTopbar';

const AVATAR_COLORS = ['#9b84ec', '#f59e0b', '#10b981', '#3b82f6', '#f43f5e', '#8b5cf6'];
const avatarColor = (id: string) => AVATAR_COLORS[id.charCodeAt(id.length - 1) % AVATAR_COLORS.length];

const roleBadge: Record<UserRole, string> = {
  buyer:  'bg-[#eff6ff] text-[#1d4ed8]',
  seller: 'bg-[rgba(173,147,230,0.12)] text-[#7c3aed]',
};

const statusBadge: Record<UserStatus, string> = {
  active:    'bg-[#f0fdf4] text-[#166534]',
  suspended: 'bg-[#fef2f2] text-[#ef4343]',
};

type RoleFilter   = 'all' | UserRole;
type StatusFilter = 'all' | UserStatus;

const UsersSection = React.memo(function UsersSection() {
  const { data } = useAdminDashboard();
  const [search,       setSearch]       = useState('');
  const [roleFilter,   setRoleFilter]   = useState<RoleFilter>('all');
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('all');

  const filtered = useMemo<AdminUser[]>(() => {
    if (!data) return [];
    const q = search.toLowerCase();
    return data.users.filter((u) => {
      const matchSearch = u.name.toLowerCase().includes(q) || u.email.toLowerCase().includes(q);
      const matchRole   = roleFilter   === 'all' || u.role   === roleFilter;
      const matchStatus = statusFilter === 'all' || u.status === statusFilter;
      return matchSearch && matchRole && matchStatus;
    });
  }, [data, search, roleFilter, statusFilter]);

  if (!data) return null;

  return (
    <div>
      <SellerTopbar title="User Management" sub="Manage buyer and seller accounts" />

      <div className="bg-white border border-[rgba(230,230,230,0.5)] rounded-xl shadow-[0_1px_2px_0_rgba(0,0,0,0.05)] mb-6">
        <div className="flex items-center justify-between px-5 py-[18px] border-b border-[rgba(230,230,230,0.5)] gap-3 flex-wrap">
          <div>
            <h2 className="text-[16px] font-bold text-[#121212] m-0">
              All users <span className="text-[#737373] font-normal text-[14px]">({filtered.length})</span>
            </h2>
          </div>
          <div className="flex items-center gap-2 flex-wrap">
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[#737373]">{AdminIcons.search}</span>
              <input
                type="text"
                placeholder="Search users…"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full h-9 pl-9 pr-4 border border-[#e6e6e6] rounded-full bg-white text-[14px] text-[#121212] outline-none placeholder:text-[#b3b3b3] focus:border-[#ad93e6] focus:ring-1 focus:ring-[rgba(173,147,230,0.20)]"
              />
            </div>
            <select
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value as RoleFilter)}
              className="appearance-none h-9 pl-3.5 pr-9 rounded-full border border-[#e6e6e6] bg-white text-[#121212] text-[13px] font-medium cursor-pointer focus:outline-none focus:border-[#ad93e6]"
            >
              <option value="all">All roles</option>
              <option value="buyer">Buyer</option>
              <option value="seller">Seller</option>
            </select>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as StatusFilter)}
              className="appearance-none h-9 pl-3.5 pr-9 rounded-full border border-[#e6e6e6] bg-white text-[#121212] text-[13px] font-medium cursor-pointer focus:outline-none focus:border-[#ad93e6]"
            >
              <option value="all">All statuses</option>
              <option value="active">Active</option>
              <option value="suspended">Suspended</option>
            </select>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-[13px]">
            <thead>
              <tr>
                {['User', 'Role', 'Orders', 'Status', 'Joined', 'Actions'].map((h) => (
                  <th key={h} className="text-left text-[11px] font-bold text-[#737373] uppercase tracking-[0.6px] px-4 py-[10px] border-b border-[#e6e6e6] bg-[rgba(244,243,247,0.4)]">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map((u) => (
                <tr key={u.id} className="hover:bg-[rgba(173,147,230,0.05)] border-b border-[rgba(230,230,230,0.5)] last:border-b-0">
                  <td className="px-4 py-[14px] text-[#121212] align-middle text-[13px]">
                    <div className="flex items-center gap-3">
                      <div
                        className="w-8 h-8 rounded-full grid place-items-center text-white text-[11px] font-bold flex-shrink-0"
                        style={{ backgroundColor: avatarColor(u.id) }}
                      >
                        {u.name.slice(0, 2).toUpperCase()}
                      </div>
                      <div className="min-w-0">
                        <p className="font-semibold text-[#121212] m-0 truncate">{u.name}</p>
                        <p className="text-[11px] text-[#737373] m-0 truncate">{u.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-[14px] align-middle text-[13px]">
                    <span className={`inline-flex items-center gap-1 px-[10px] py-0.5 rounded-full text-[11px] font-semibold ${roleBadge[u.role]}`}>
                      {u.role.charAt(0).toUpperCase() + u.role.slice(1)}
                    </span>
                  </td>
                  <td className="px-4 py-[14px] text-[#121212] align-middle text-[13px]">{u.orders}</td>
                  <td className="px-4 py-[14px] align-middle text-[13px]">
                    <span className={`inline-flex items-center gap-1 px-[10px] py-0.5 rounded-full text-[11px] font-semibold ${statusBadge[u.status]}`}>
                      {u.status.charAt(0).toUpperCase() + u.status.slice(1)}
                    </span>
                  </td>
                  <td className="px-4 py-[14px] text-[#737373] align-middle text-[13px]">{u.joinedAt}</td>
                  <td className="px-4 py-[14px] align-middle text-[13px]">
                    {u.status === 'active' ? (
                      <button className="h-7 px-3 rounded-lg border border-[#ef4343] text-[#ef4343] text-[12px] font-medium hover:bg-[#fef2f2] transition-colors">
                        Suspend
                      </button>
                    ) : (
                      <button className="h-7 px-3 rounded-lg border border-[#166534] text-[#166534] text-[12px] font-medium hover:bg-[#f0fdf4] transition-colors">
                        Activate
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
});

export default UsersSection;
