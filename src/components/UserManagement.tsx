"use client";
import React, { useState, useEffect } from 'react';
import { Users, UserPlus, Shield, Trash2, Edit2, Key, Check, X, ShieldAlert, CheckCircle2, AlertCircle } from 'lucide-react';
import { UserRole } from '../types';

interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  password?: string;
}

interface UserManagementProps {
  currentUserRole: UserRole;
  userEmail: string;
}

export default function UserManagement({ currentUserRole, userEmail }: UserManagementProps) {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Form states
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);

  const [formName, setFormName] = useState('');
  const [formEmail, setFormEmail] = useState('');
  const [formRole, setFormRole] = useState<UserRole>('viewer');
  const [formPassword, setFormPassword] = useState('');

  // Custom confirmation modal state
  const [confirmState, setConfirmState] = useState<{
    isOpen: boolean;
    title: string;
    message: string;
    onConfirm: () => void;
  } | null>(null);

  // Fetch users
  const fetchUsers = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await fetch(`/api/users`);
      if (!res.ok) {
        const errData = await res.json();
        setError(errData.error || 'Failed to fetch users list.');
      } else {
        const data = await res.json();
        setUsers(data);
      }
    } catch (err) {
      setError('Could not load user list.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (currentUserRole === 'super_admin') {
      fetchUsers();
    } else {
      setLoading(false);
    }
  }, [currentUserRole, userEmail]);

  // Handle email validation
  const validateEmail = (emailStr: string) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailStr.trim());
  };

  // Create User
  const handleCreateUser = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    const emailTrimmed = formEmail.trim();
    if (!formName.trim()) return setError('User full name is required.');
    if (!emailTrimmed || !validateEmail(emailTrimmed)) return setError('Please enter a valid email address.');
    if (!formPassword || formPassword.length < 6) return setError('Password must be at least 6 characters long.');

    try {
      const res = await fetch('/api/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          newUser: {
            name: formName.trim(),
            email: emailTrimmed,
            role: formRole,
            password: formPassword
          }
        })
      });

      const data = await res.json();
      if (!res.ok) {
        setError(data.error || 'Failed to create user account.');
      } else {
        setSuccess(`User account for ${formName} has been successfully registered.`);
        setUsers(data.users);
        // Reset form
        setFormName('');
        setFormEmail('');
        setFormRole('viewer');
        setFormPassword('');
        setShowAddForm(false);
      }
    } catch (err) {
      setError('Network request failed.');
    }
  };

  // Update User
  const handleUpdateUser = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingUser) return;
    setError('');
    setSuccess('');

    if (!formName.trim()) return setError('User full name is required.');

    try {
      const res = await fetch(`/api/users/${editingUser.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          updatedUser: {
            name: formName.trim(),
            role: formRole,
            password: formPassword ? formPassword : undefined
          }
        })
      });

      const data = await res.json();
      if (!res.ok) {
        setError(data.error || 'Failed to update user account.');
      } else {
        setSuccess(`User account details for ${formName} have been updated.`);
        setUsers(data.users);
        setEditingUser(null);
        setFormName('');
        setFormEmail('');
        setFormRole('viewer');
        setFormPassword('');
      }
    } catch (err) {
      setError('Network request failed.');
    }
  };

  // Delete User
  const handleDeleteUser = async (userId: string, userName: string) => {
    setConfirmState({
      isOpen: true,
      title: 'Delete User Account',
      message: `Are you sure you want to delete the user account for ${userName}?`,
      onConfirm: async () => {
        setError('');
        setSuccess('');

        try {
          const res = await fetch(`/api/users/${userId}`, {
            method: 'DELETE'
          });

          const data = await res.json();
          if (!res.ok) {
            setError(data.error || 'Failed to delete user account.');
          } else {
            setSuccess(`User account for ${userName} has been successfully deleted.`);
            setUsers(data.users);
          }
        } catch (err) {
          setError('Network request failed.');
        }
      }
    });
  };

  // Start Edit Mode
  const startEdit = (user: User) => {
    setEditingUser(user);
    setFormName(user.name);
    setFormEmail(user.email);
    setFormRole(user.role);
    setFormPassword('');
    setShowAddForm(false);
  };

  // Cancel Edit
  const cancelEdit = () => {
    setEditingUser(null);
    setFormName('');
    setFormEmail('');
    setFormRole('viewer');
    setFormPassword('');
  };

  // Access Control Guard
  if (currentUserRole !== 'super_admin') {
    return (
      <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm max-w-2xl mx-auto text-center my-10 animate-fadeIn">
        <div className="p-4 bg-rose-50 rounded-full inline-block text-rose-500 mb-4 border border-rose-100">
          <ShieldAlert className="h-10 w-10" />
        </div>
        <h3 className="font-display font-bold text-lg text-slate-950 uppercase tracking-tight">Access Denied</h3>
        <p className="text-xs text-slate-500 max-w-md mx-auto mt-2 leading-relaxed">
          This page is restricted to Super Admin accounts.
        </p>
        <div className="mt-6 bg-slate-50 border border-slate-200 rounded-xl p-4 max-w-sm mx-auto">
          <div className="text-[10px] text-slate-500 font-mono uppercase font-bold mb-1">Your Account Details</div>
          <div className="text-xs font-mono text-slate-700 font-medium">Email: {userEmail || 'Guest'}</div>
          <div className="text-xs font-mono text-slate-700 font-medium mt-0.5">Role: {currentUserRole.toUpperCase()}</div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* CMS Header Tab */}
      <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="font-display text-lg font-bold text-slate-900 uppercase tracking-tight flex items-center">
            <Users className="h-5 w-5 text-teal-600 mr-2 shrink-0" />
            User Management
          </h2>
          <p className="text-xs text-slate-500 font-light mt-1">
            Manage accounts and permissions for your team.
          </p>
        </div>
        {!showAddForm && !editingUser && (
          <button
            onClick={() => {
              setShowAddForm(true);
              setError('');
              setSuccess('');
            }}
            className="bg-teal-600 hover:bg-teal-500 text-white font-bold py-2 px-4 rounded-xl text-xs uppercase tracking-wider shadow-sm transition duration-150 flex items-center space-x-1.5 cursor-pointer shrink-0"
          >
            <UserPlus className="h-4 w-4" />
            <span>Add New User</span>
          </button>
        )}
      </div>

      {/* SUCCESS / ERROR MESSAGES */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-xl px-4 py-3 text-xs text-red-800 flex items-start space-x-2 animate-fadeIn">
          <AlertCircle className="h-4 w-4 text-red-600 shrink-0 mt-0.5" />
          <span>{error}</span>
        </div>
      )}

      {success && (
        <div className="bg-teal-50 border border-teal-200 rounded-xl px-4 py-3 text-xs text-teal-800 flex items-start space-x-2 animate-fadeIn">
          <CheckCircle2 className="h-4 w-4 text-teal-600 shrink-0 mt-0.5" />
          <span>{success}</span>
        </div>
      )}

      {/* ADD NEW USER FORM */}
      {showAddForm && (
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm animate-fadeIn">
          <div className="flex justify-between items-center mb-5 border-b border-slate-100 pb-3">
            <h3 className="font-display font-bold text-xs text-slate-900 uppercase tracking-wider flex items-center">
              <UserPlus className="h-4 w-4 text-teal-600 mr-1.5" />
              Create New User Account
            </h3>
            <button
              onClick={() => setShowAddForm(false)}
              className="p-1 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          <form onSubmit={handleCreateUser} className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1 font-mono">Full Name</label>
              <input
                type="text"
                required
                placeholder="e.g. Vikram Seth"
                value={formName}
                onChange={(e) => setFormName(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3.5 py-2 text-xs text-slate-800 focus:outline-none focus:ring-1 focus:ring-teal-500"
              />
            </div>

            <div>
              <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1 font-mono">Email Address</label>
              <input
                type="email"
                required
                placeholder="e.g. member@example.com"
                value={formEmail}
                onChange={(e) => setFormEmail(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3.5 py-2 text-xs text-slate-800 focus:outline-none focus:ring-1 focus:ring-teal-500"
              />
            </div>

            <div>
              <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1 font-mono">Role / Permission Level</label>
              <select
                value={formRole}
                onChange={(e) => setFormRole(e.target.value as UserRole)}
                className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-xs text-slate-800 focus:outline-none focus:ring-1 focus:ring-teal-500 font-mono cursor-pointer"
              >
                <option value="viewer">Viewer (Can only view)</option>
                <option value="content_manager">Content Manager (Can edit content)</option>
                <option value="admin">Admin (Can manage content and forms)</option>
                <option value="super_admin">Super Admin (Full access to all settings)</option>
              </select>
            </div>

            <div>
              <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1 font-mono">Password</label>
              <input
                type="password"
                required
                placeholder="At least 6 characters"
                value={formPassword}
                onChange={(e) => setFormPassword(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3.5 py-2 text-xs text-slate-800 focus:outline-none focus:ring-1 focus:ring-teal-500"
              />
            </div>

            <div className="md:col-span-2 pt-2 border-t border-slate-100 flex justify-end space-x-3">
              <button
                type="button"
                onClick={() => setShowAddForm(false)}
                className="px-4 py-2 border border-slate-200 hover:bg-slate-50 text-slate-600 rounded-xl text-xs font-bold uppercase tracking-wider transition"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="bg-teal-600 hover:bg-teal-500 text-white font-bold py-2 px-5 rounded-xl text-xs uppercase tracking-wider shadow-sm transition"
              >
                Create Account
              </button>
            </div>
          </form>
        </div>
      )}

      {/* EDIT USER FORM */}
      {editingUser && (
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm animate-fadeIn">
          <div className="flex justify-between items-center mb-5 border-b border-slate-100 pb-3">
            <h3 className="font-display font-bold text-xs text-slate-900 uppercase tracking-wider flex items-center">
              <Edit2 className="h-4 w-4 text-teal-600 mr-1.5" />
              Edit User Account: <span className="text-teal-600 ml-1 font-mono">{editingUser.email}</span>
            </h3>
            <button
              onClick={cancelEdit}
              className="p-1 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          <form onSubmit={handleUpdateUser} className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1 font-mono">Full Name</label>
              <input
                type="text"
                required
                value={formName}
                onChange={(e) => setFormName(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3.5 py-2 text-xs text-slate-800 focus:outline-none focus:ring-1 focus:ring-teal-500"
              />
            </div>

            <div>
              <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1 font-mono">Role / Permission Level</label>
              <select
                value={formRole}
                onChange={(e) => setFormRole(e.target.value as UserRole)}
                className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-xs text-slate-800 focus:outline-none focus:ring-1 focus:ring-teal-500 font-mono cursor-pointer"
              >
                <option value="viewer">Viewer (Can only view)</option>
                <option value="content_manager">Content Manager (Can edit content)</option>
                <option value="admin">Admin (Can manage content and forms)</option>
                <option value="super_admin">Super Admin (Full access to all settings)</option>
              </select>
            </div>

            <div className="md:col-span-2">
              <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1 font-mono">
                Password (Leave empty to keep current)
              </label>
              <input
                type="password"
                placeholder="Enter new password to change it"
                value={formPassword}
                onChange={(e) => setFormPassword(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3.5 py-2 text-xs text-slate-800 focus:outline-none focus:ring-1 focus:ring-teal-500"
              />
            </div>

            <div className="md:col-span-2 pt-2 border-t border-slate-100 flex justify-end space-x-3">
              <button
                type="button"
                onClick={cancelEdit}
                className="px-4 py-2 border border-slate-200 hover:bg-slate-50 text-slate-600 rounded-xl text-xs font-bold uppercase tracking-wider transition"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="bg-teal-600 hover:bg-teal-500 text-white font-bold py-2 px-5 rounded-xl text-xs uppercase tracking-wider shadow-sm transition"
              >
                Save Changes
              </button>
            </div>
          </form>
        </div>
      )}

      {/* USERS LIST TABLE */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden">
        {loading ? (
          <div className="p-12 text-center">
            <div className="h-8 w-8 border-4 border-teal-500 border-t-transparent rounded-full animate-spin mx-auto mb-3"></div>
            <p className="text-xs text-slate-500 font-mono">Loading users...</p>
          </div>
        ) : users.length === 0 ? (
          <div className="p-12 text-center text-slate-400 text-xs">
            No registered users found.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-slate-200 text-xs text-slate-700">
              <thead className="bg-slate-50">
                <tr>
                  <th className="px-6 py-4 text-left text-[10px] font-bold text-slate-500 uppercase tracking-wider font-mono">Full Name</th>
                  <th className="px-6 py-4 text-left text-[10px] font-bold text-slate-500 uppercase tracking-wider font-mono">Email</th>
                  <th className="px-6 py-4 text-left text-[10px] font-bold text-slate-500 uppercase tracking-wider font-mono">Role</th>
                  <th className="px-6 py-4 text-right text-[10px] font-bold text-slate-500 uppercase tracking-wider font-mono">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-slate-100">
                {users.map((user) => {
                  const isSelf = user.email.toLowerCase().trim() === userEmail.toLowerCase().trim();
                  return (
                    <tr key={user.id} className="hover:bg-slate-50/50 transition">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center space-x-2">
                          <span className="font-semibold text-slate-900">{user.name}</span>
                          {isSelf && (
                            <span className="bg-teal-50 text-teal-700 border border-teal-100 text-[9px] px-1.5 py-0.5 rounded font-mono font-semibold uppercase">
                              Self
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap font-mono text-slate-600">
                        {user.email}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex items-center px-2 py-1 rounded text-[10px] font-mono font-bold uppercase border ${
                          user.role === 'super_admin' ? 'bg-rose-50 text-rose-700 border-rose-100' :
                          user.role === 'admin' ? 'bg-amber-50 text-amber-700 border-amber-100' :
                          user.role === 'content_manager' ? 'bg-blue-50 text-blue-700 border-blue-100' :
                          'bg-slate-100 text-slate-600 border-slate-200'
                        }`}>
                          <Shield className="h-3 w-3 mr-1" />
                          {user.role.replace('_', ' ')}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right">
                        <div className="flex justify-end items-center space-x-2">
                          <button
                            onClick={() => startEdit(user)}
                            className="p-1.5 rounded-lg border border-slate-200 hover:bg-slate-50 text-slate-500 hover:text-teal-600 transition cursor-pointer"
                            title="Edit User Role"
                          >
                            <Edit2 className="h-3.5 w-3.5" />
                          </button>
                          <button
                            onClick={() => handleDeleteUser(user.id, user.name)}
                            disabled={isSelf}
                            className={`p-1.5 rounded-lg border transition cursor-pointer ${
                              isSelf ? 'opacity-30 cursor-not-allowed border-slate-100 text-slate-300' : 'border-slate-200 hover:bg-rose-50 text-slate-500 hover:text-rose-600'
                            }`}
                            title={isSelf ? 'Cannot delete self' : 'Delete User'}
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {confirmState && (
        <div className="fixed inset-0 bg-slate-950/60 backdrop-blur-sm flex items-center justify-center z-[150] p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-100 transform scale-100 transition duration-200">
            <div className="flex items-start space-x-3">
              <div className="p-2 bg-red-50 rounded-xl shrink-0">
                <AlertCircle className="h-6 w-6 text-red-600" />
              </div>
              <div className="text-left">
                <h3 className="text-base font-bold text-slate-900 mb-1">{confirmState.title}</h3>
                <p className="text-xs text-slate-500 leading-relaxed mb-6">{confirmState.message}</p>
              </div>
            </div>
            <div className="flex justify-end space-x-2">
              <button
                onClick={() => setConfirmState(null)}
                className="px-4 py-2 text-xs font-semibold text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-xl transition"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  confirmState.onConfirm();
                  setConfirmState(null);
                }}
                className="px-4 py-2 text-xs font-semibold text-white bg-red-600 hover:bg-red-700 rounded-xl transition"
              >
                Confirm Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
