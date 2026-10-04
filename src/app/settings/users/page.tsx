"use client";

import React, { useState } from 'react';
import { DataTable } from '@/components/ui/DataTable';
import { ColumnDef } from '@tanstack/react-table';
import { Plus, X, User, Mail, Shield, Clock, ShieldCheck, ShieldAlert, Key, LogOut, Trash2 } from 'lucide-react';

interface UserData {
  id: string;
  name: string;
  email: string;
  role: string;
  status: 'Active' | 'Inactive' | 'Invited' | 'Suspended';
  lastActive: string;
  mfaEnabled: boolean;
  workspace: string;
  permissions: number;
}

const initialUsers: UserData[] = [
  { id: 'usr-001', name: 'Mohan Pratap', email: 'admin@datapact.io', role: 'Workspace Admin', status: 'Active', lastActive: 'Current Session', mfaEnabled: true, workspace: 'DataPact Enterprise', permissions: 124 },
  { id: 'usr-002', name: 'Alice Cooper', email: 'alice@datapact.com', role: 'Data Engineer', status: 'Active', lastActive: '2 mins ago', mfaEnabled: true, workspace: 'DataPact Enterprise', permissions: 82 },
  { id: 'usr-003', name: 'Bob Smith', email: 'bob@datapact.com', role: 'Data Scientist', status: 'Active', lastActive: '1 hr ago', mfaEnabled: false, workspace: 'DataPact Enterprise', permissions: 45 },
  { id: 'usr-004', name: 'Charlie Davis', email: 'charlie@datapact.com', role: 'Viewer', status: 'Inactive', lastActive: '2 days ago', mfaEnabled: true, workspace: 'DataPact Enterprise', permissions: 12 },
  { id: 'usr-005', name: 'Diana Prince', email: 'diana@datapact.com', role: 'Billing Admin', status: 'Invited', lastActive: 'Never', mfaEnabled: false, workspace: 'DataPact Enterprise', permissions: 28 },
];

export default function UsersSettingsPage() {
  const [users, setUsers] = useState<UserData[]>(initialUsers);
  const [selectedUser, setSelectedUser] = useState<UserData | null>(null);
  const [isAddingUser, setIsAddingUser] = useState(false);
  const [newUser, setNewUser] = useState({ name: '', email: '', role: 'Viewer' });

  const columns: ColumnDef<UserData>[] = [
    {
      accessorKey: 'name',
      header: 'User',
      cell: ({ row }) => (
        <div className="flex items-center gap-3 cursor-pointer" onClick={() => setSelectedUser(row.original)}>
          <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-blue-500 to-purple-600 text-white flex items-center justify-center font-bold text-xs shadow-sm">
            {row.original.name.split(' ').map(n => n[0]).join('')}
          </div>
          <div>
            <p className="font-semibold text-foreground hover:text-blue-500 transition-colors">{row.original.name}</p>
            <p className="text-xs text-muted-foreground">{row.original.email}</p>
          </div>
        </div>
      ),
    },
    {
      accessorKey: 'role',
      header: 'Role',
      cell: ({ row }) => {
        const role = row.getValue('role') as string;
        let colorClass = 'text-gray-500 bg-gray-500/10 border-gray-500/20';
        if (role.includes('Admin')) colorClass = 'text-purple-500 bg-purple-500/10 border-purple-500/20';
        if (role.includes('Engineer') || role.includes('Scientist')) colorClass = 'text-blue-500 bg-blue-500/10 border-blue-500/20';
        
        return <span className={`px-2.5 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider border ${colorClass}`}>{role}</span>;
      }
    },
    {
      accessorKey: 'status',
      header: 'Status',
      cell: ({ row }) => {
        const status = row.getValue('status') as string;
        let dotColor = 'bg-gray-500';
        if (status === 'Active') dotColor = 'bg-green-500';
        if (status === 'Invited') dotColor = 'bg-yellow-500';
        if (status === 'Suspended') dotColor = 'bg-red-500';
        
        return (
          <div className="flex items-center gap-2">
            <div className={`w-2 h-2 rounded-full ${dotColor} shadow-[0_0_8px_rgba(0,0,0,0.2)]`} style={{ boxShadow: status === 'Active' ? '0 0 8px rgba(34, 197, 94, 0.4)' : undefined }} />
            <span className="text-sm font-medium">{status}</span>
          </div>
        );
      }
    },
    {
      accessorKey: 'mfaEnabled',
      header: 'MFA',
      cell: ({ row }) => {
        const mfa = row.original.mfaEnabled;
        return mfa ? (
          <div className="flex items-center gap-1.5 text-green-500">
            <ShieldCheck className="w-4 h-4" />
            <span className="text-xs font-semibold">Enabled</span>
          </div>
        ) : (
          <div className="flex items-center gap-1.5 text-yellow-500">
            <ShieldAlert className="w-4 h-4" />
            <span className="text-xs font-semibold">Disabled</span>
          </div>
        );
      }
    },
    {
      accessorKey: 'workspace',
      header: 'Workspace',
      cell: ({ row }) => <span className="text-sm text-muted-foreground">{row.original.workspace}</span>
    },
    {
      accessorKey: 'permissions',
      header: 'Permissions',
      cell: ({ row }) => (
        <div className="flex items-center gap-1 text-xs text-muted-foreground">
          <Key className="w-3 h-3" />
          {row.original.permissions} policies
        </div>
      )
    },
    {
      accessorKey: 'lastActive',
      header: 'Last Login',
      cell: ({ row }) => <span className="text-sm text-muted-foreground whitespace-nowrap">{row.original.lastActive}</span>
    },
    {
      id: "actions",
      cell: ({ row }) => {
        return (
          <button 
            onClick={() => setSelectedUser(row.original)}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold bg-secondary hover:bg-muted text-foreground border border-border rounded-md transition-colors"
          >
            <User className="w-3.5 h-3.5" />
            View
          </button>
        );
      },
    },
  ];

  const handleAddUser = () => {
    if (!newUser.name || !newUser.email) return;
    const newEntry: UserData = {
      id: `usr-00${users.length + 1}`,
      name: newUser.name,
      email: newUser.email,
      role: newUser.role,
      status: 'Invited',
      lastActive: 'Never',
      mfaEnabled: false,
      workspace: 'DataPact Enterprise',
      permissions: 5,
    };
    setUsers([...users, newEntry]);
    setIsAddingUser(false);
    setNewUser({ name: '', email: '', role: 'Viewer' });
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500 w-full">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-foreground">User Management</h1>
          <p className="text-muted-foreground mt-1 text-sm">Provision access, assign roles, and audit security for all workspace members.</p>
        </div>
        
        <button 
          onClick={() => setIsAddingUser(true)}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-semibold transition-colors shadow-sm"
        >
          <Plus className="w-4 h-4" /> Invite User
        </button>
      </div>

      <div className="glass-card border-border overflow-hidden">
        <DataTable columns={columns} data={users} />
      </div>

      {/* Add User Modal */}
      {isAddingUser && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-card border border-border rounded-xl shadow-2xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in duration-200">
            <div className="p-4 border-b border-border flex items-center justify-between bg-muted/30">
              <h2 className="text-lg font-bold flex items-center gap-2">Invite New User</h2>
              <button onClick={() => setIsAddingUser(false)} className="text-muted-foreground hover:text-foreground"><X className="w-5 h-5"/></button>
            </div>
            <div className="p-6 space-y-4 text-left">
              <div>
                <label className="block text-sm font-medium text-muted-foreground mb-1">Full Name</label>
                <input 
                  type="text" 
                  value={newUser.name}
                  onChange={e => setNewUser({...newUser, name: e.target.value})}
                  className="w-full bg-background border border-border rounded-lg px-3 py-2 text-foreground focus:outline-none focus:border-blue-500"
                  placeholder="e.g. John Doe"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-muted-foreground mb-1">Email Address</label>
                <input 
                  type="email" 
                  value={newUser.email}
                  onChange={e => setNewUser({...newUser, email: e.target.value})}
                  className="w-full bg-background border border-border rounded-lg px-3 py-2 text-foreground focus:outline-none focus:border-blue-500"
                  placeholder="e.g. john@datapact.com"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-muted-foreground mb-1">Role</label>
                <select 
                  value={newUser.role}
                  onChange={e => setNewUser({...newUser, role: e.target.value})}
                  className="w-full bg-background border border-border rounded-lg px-3 py-2 text-foreground focus:outline-none focus:border-blue-500 appearance-none"
                >
                  <option>Workspace Admin</option>
                  <option>Data Engineer</option>
                  <option>Data Scientist</option>
                  <option>Billing Admin</option>
                  <option>Viewer</option>
                </select>
              </div>
            </div>
            <div className="p-4 border-t border-border bg-muted/30 flex justify-end gap-2">
              <button onClick={() => setIsAddingUser(false)} className="px-4 py-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">Cancel</button>
              <button onClick={handleAddUser} className="px-4 py-2 text-sm font-semibold bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors shadow-sm">Send Invitation</button>
            </div>
          </div>
        </div>
      )}

      {/* User Details Drawer/Modal */}
      {selectedUser && (
        <div className="fixed inset-y-0 right-0 w-[450px] bg-card border-l border-border shadow-2xl z-50 flex flex-col animate-in slide-in-from-right duration-300">
          <div className="p-6 border-b border-border flex items-center justify-between">
            <h2 className="text-xl font-bold flex items-center gap-2">User Profile</h2>
            <button onClick={() => setSelectedUser(null)} className="p-2 hover:bg-muted rounded-full text-muted-foreground"><X className="w-5 h-5"/></button>
          </div>
          
          <div className="flex-1 overflow-y-auto p-6 space-y-8">
            <div className="flex flex-col items-center text-center space-y-3">
              <div className="w-24 h-24 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-4xl font-bold text-white shadow-lg border-4 border-background">
                {selectedUser.name.split(' ').map(n => n[0]).join('')}
              </div>
              <div>
                <h3 className="text-2xl font-bold text-foreground">{selectedUser.name}</h3>
                <p className="text-muted-foreground">{selectedUser.email}</p>
              </div>
            </div>

            <div className="space-y-3">
               <h4 className="font-semibold text-sm uppercase tracking-wider text-muted-foreground">Account Details</h4>
               <div className="glass-card p-4 space-y-4">
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-muted-foreground">Role</span>
                    <span className="font-semibold">{selectedUser.role}</span>
                  </div>
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-muted-foreground">Status</span>
                    <span className={selectedUser.status === 'Active' ? 'text-green-500 font-semibold' : 'text-yellow-500 font-semibold'}>{selectedUser.status}</span>
                  </div>
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-muted-foreground">Workspace</span>
                    <span className="font-semibold">{selectedUser.workspace}</span>
                  </div>
               </div>
            </div>
            
             <div className="space-y-3">
               <h4 className="font-semibold text-sm uppercase tracking-wider text-muted-foreground">Security</h4>
               <div className="glass-card p-4 space-y-4">
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-muted-foreground flex items-center gap-1.5"><Shield className="w-4 h-4"/> 2FA Status</span>
                    <span className={selectedUser.mfaEnabled ? 'text-green-500 font-semibold' : 'text-red-500 font-semibold'}>
                      {selectedUser.mfaEnabled ? 'Enabled' : 'Disabled'}
                    </span>
                  </div>
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-muted-foreground flex items-center gap-1.5"><Clock className="w-4 h-4"/> Last Login</span>
                    <span className="font-semibold">{selectedUser.lastActive}</span>
                  </div>
               </div>
            </div>

            <div className="space-y-3 pt-4 border-t border-border">
              <button className="w-full flex items-center justify-between p-3 bg-secondary hover:bg-muted text-foreground border border-border rounded-lg text-sm font-medium transition-colors">
                Manage Role & Permissions
                <Shield className="w-4 h-4 text-muted-foreground" />
              </button>
              <button className="w-full flex items-center justify-between p-3 bg-secondary hover:bg-muted text-foreground border border-border rounded-lg text-sm font-medium transition-colors">
                View Audit Log for User
                <Clock className="w-4 h-4 text-muted-foreground" />
              </button>
              <button className="w-full flex items-center justify-between p-3 bg-red-500/10 hover:bg-red-500/20 text-red-500 border border-red-500/20 rounded-lg text-sm font-medium transition-colors">
                Suspend User
                <Trash2 className="w-4 h-4 text-red-500" />
              </button>
            </div>

          </div>
        </div>
      )}
    </div>
  );
}
