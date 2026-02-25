import { Search, Filter, Download, ChevronDown, MoreVertical } from "lucide-react";

export function OrgManagement() {
  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-3xl font-bold mb-2">Organization Management</h1>
          <p className="text-gray-600">Configure your global workforce, access levels, and infrastructure.</p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-medium transition-colors">
          <span className="text-xl leading-none">+</span>
          Add User
        </button>
      </div>

      {/* Stats */}
      <div className="flex items-center gap-6">
        <div className="relative">
          <svg width="120" height="120" viewBox="0 0 120 120">
            <circle cx="60" cy="60" r="50" fill="none" stroke="#f3f4f6" strokeWidth="12" />
            <circle
              cx="60"
              cy="60"
              r="50"
              fill="none"
              stroke="#10b981"
              strokeWidth="12"
              strokeDasharray="188.4 125.6"
              strokeLinecap="round"
              transform="rotate(-90 60 60)"
            />
            <circle
              cx="60"
              cy="60"
              r="50"
              fill="none"
              stroke="#6366f1"
              strokeWidth="12"
              strokeDasharray="94.2 219.8"
              strokeLinecap="round"
              transform="rotate(36 60 60)"
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <div className="text-2xl font-bold">42</div>
            <div className="text-xs text-gray-600">TOTAL USERS</div>
          </div>
        </div>

        <div className="flex gap-8">
          <div>
            <div className="text-sm text-gray-600 mb-1">ENGINEERING</div>
            <div className="text-2xl font-bold mb-1">18</div>
            <div className="h-1 w-24 bg-gray-200 rounded-full overflow-hidden">
              <div className="h-full bg-indigo-600 rounded-full" style={{ width: "90%" }}></div>
            </div>
          </div>
          <div>
            <div className="text-sm text-gray-600 mb-1">MARKETING</div>
            <div className="text-2xl font-bold mb-1">12</div>
            <div className="h-1 w-24 bg-gray-200 rounded-full overflow-hidden">
              <div className="h-full bg-emerald-600 rounded-full" style={{ width: "60%" }}></div>
            </div>
          </div>
          <div>
            <div className="text-sm text-gray-600 mb-1">SALES</div>
            <div className="text-2xl font-bold mb-1">8</div>
            <div className="h-1 w-24 bg-gray-200 rounded-full overflow-hidden">
              <div className="h-full bg-orange-600 rounded-full" style={{ width: "40%" }}></div>
            </div>
          </div>
          <div>
            <div className="text-sm text-gray-600 mb-1">PRODUCT</div>
            <div className="text-2xl font-bold mb-1">4</div>
            <div className="h-1 w-24 bg-gray-200 rounded-full overflow-hidden">
              <div className="h-full bg-purple-600 rounded-full" style={{ width: "20%" }}></div>
            </div>
          </div>
        </div>

        <div className="ml-auto bg-white rounded-xl p-6 border border-gray-200">
          <div className="flex items-center gap-2 mb-2">
            <div className="size-8 rounded-lg bg-indigo-100 flex items-center justify-center">
              <svg className="size-5 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
            </div>
            <h3 className="font-bold">Security Score</h3>
          </div>
          <div className="text-3xl font-bold text-green-600">92/100</div>
          <div className="text-xs text-gray-600">Excellent permission hygiene</div>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200">
        <div className="flex gap-8">
          <button className="pb-3 border-b-2 border-indigo-600 text-indigo-600 font-medium">
            Users
          </button>
          <button className="pb-3 text-gray-600 hover:text-gray-900">
            Roles & Permissions
          </button>
          <button className="pb-3 text-gray-600 hover:text-gray-900">
            Departments
          </button>
          <button className="pb-3 text-gray-600 hover:text-gray-900">
            Billing
          </button>
        </div>
      </div>

      {/* Search & Filters */}
      <div className="flex items-center gap-3">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search name, email, or department..."
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>
        <button className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">
          <Filter className="size-4" />
          Filters
        </button>
        <button className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">
          <Download className="size-4" />
          Export
        </button>
      </div>

      {/* Users Table */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase">Name</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase">Role</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase">Department</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase">Status</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            <UserRow
              name="Sarah Connor"
              email="sarah.c@optimaai.io"
              avatar="SC"
              avatarColor="bg-pink-200"
              role="Manager"
              department="MARKETING"
              departmentColor="bg-emerald-100 text-emerald-700"
              status="Active"
              statusColor="text-green-600"
            />
            <UserRow
              name="David Miller"
              email="d.miller@optimaai.io"
              avatar="DM"
              avatarColor="bg-teal-200"
              role="Contributor"
              department="ENGINEERING"
              departmentColor="bg-indigo-100 text-indigo-700"
              status="Active"
              statusColor="text-green-600"
            />
            <UserRow
              name="Lena Parks"
              email="lena.p@optimaai.io"
              avatar="LP"
              avatarColor="bg-lime-200"
              role="Contributor"
              department="PRODUCT"
              departmentColor="bg-purple-100 text-purple-700"
              status="Invited"
              statusColor="text-orange-600"
            />
            <UserRow
              name="Marcus Thorne"
              email="m.thorne@optimaai.io"
              avatar="MT"
              avatarColor="bg-gray-800"
              role="Admin"
              roleColor="text-indigo-600 font-medium"
              department="OPERATIONS"
              departmentColor="bg-gray-100 text-gray-700"
              status="Active"
              statusColor="text-green-600"
            />
          </tbody>
        </table>

        <div className="px-6 py-4 border-t border-gray-200 flex items-center justify-between">
          <div className="text-sm text-gray-600">Showing 4 of 42 members</div>
          <div className="flex gap-2">
            <button className="px-3 py-1 border border-gray-300 rounded hover:bg-gray-50">
              Previous
            </button>
            <button className="px-3 py-1 border border-gray-300 rounded hover:bg-gray-50">
              Next
            </button>
          </div>
        </div>
      </div>

      {/* Bottom Info */}
      <div className="bg-indigo-50 rounded-xl p-4 border border-indigo-200">
        <div className="flex items-start gap-3">
          <div className="size-8 rounded-lg bg-indigo-100 flex items-center justify-center flex-shrink-0">
            <svg className="size-5 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
          </div>
          <div>
            <div className="font-medium mb-1">Enterprise Plan</div>
            <div className="text-sm text-gray-700">85% of seats used (42/50)</div>
            <div className="mt-2 h-2 w-48 bg-indigo-200 rounded-full overflow-hidden">
              <div className="h-full bg-indigo-600 rounded-full" style={{ width: "85%" }}></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function UserRow({
  name,
  email,
  avatar,
  avatarColor,
  role,
  roleColor,
  department,
  departmentColor,
  status,
  statusColor,
}: {
  name: string;
  email: string;
  avatar: string;
  avatarColor: string;
  role: string;
  roleColor?: string;
  department: string;
  departmentColor: string;
  status: string;
  statusColor: string;
}) {
  return (
    <tr className="hover:bg-gray-50">
      <td className="px-6 py-4">
        <div className="flex items-center gap-3">
          <div className={`size-10 rounded-full ${avatarColor} flex items-center justify-center text-sm font-medium`}>
            {avatar}
          </div>
          <div>
            <div className="font-medium">{name}</div>
            <div className="text-sm text-gray-600">{email}</div>
          </div>
        </div>
      </td>
      <td className="px-6 py-4">
        <span className={roleColor || ""}>{role}</span>
      </td>
      <td className="px-6 py-4">
        <span className={`inline-flex px-2 py-1 text-xs font-medium rounded ${departmentColor}`}>
          {department}
        </span>
      </td>
      <td className="px-6 py-4">
        <div className="flex items-center gap-2">
          <div className={`size-2 rounded-full ${status === "Active" ? "bg-green-500" : "bg-orange-500"}`}></div>
          <span className={`text-sm font-medium ${statusColor}`}>{status}</span>
        </div>
      </td>
      <td className="px-6 py-4">
        <button className="p-1 hover:bg-gray-100 rounded">
          <MoreVertical className="size-5 text-gray-400" />
        </button>
      </td>
    </tr>
  );
}