"use client";
/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Activity, Lock, Unlock, LogOut, UserCheck, Menu, X } from 'lucide-react';
import { UserRole, SiteSettings } from '../types';
import { getImgSrc, getImgAlt, getImgTitle } from '../lib/imageUtils';

interface NavbarProps {
  isAdminMode: boolean;
  setIsAdminMode: (val: boolean) => void;
  currentUserRole: UserRole;
  setCurrentUserRole: (role: UserRole) => void;
  userEmail: string;
  settings?: SiteSettings | null;
  activeTab?: 'home' | 'about' | 'catalog' | 'facilities' | 'certifications' | 'gallery' | 'careers' | 'contact';
  setActiveTab?: (tab: 'home' | 'about' | 'catalog' | 'facilities' | 'certifications' | 'gallery' | 'careers' | 'contact') => void;
}

export default function Navbar({
  isAdminMode,
  setIsAdminMode,
  currentUserRole,
  setCurrentUserRole,
  userEmail,
  settings,
  activeTab,
  setActiveTab,
}: NavbarProps) {
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);

  const availableTabs = [
    { id: 'home', label: 'Home', visible: settings?.showHome !== false },
    { id: 'about', label: 'About Us', visible: settings?.showAbout !== false },
    { id: 'catalog', label: 'Catalog', visible: settings?.showCatalog !== false },
    { id: 'facilities', label: 'Facilities', visible: settings?.showFacilities !== false },
    { id: 'certifications', label: 'Regulatory', visible: settings?.showCertifications !== false },
    { id: 'careers', label: 'Careers', visible: settings?.showCareers !== false },
    { id: 'contact', label: 'Contact', visible: settings?.showContact !== false },
  ].filter((tab) => tab.visible) as Array<{
    id: 'home' | 'about' | 'catalog' | 'facilities' | 'certifications' | 'gallery' | 'careers' | 'contact';
    label: string;
    visible: boolean;
  }>;

  return (
    <header className="sticky top-0 z-50 bg-slate-900 text-white shadow-md border-b border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Corporate Branding */}
          <div className="flex items-center space-x-3 cursor-pointer shrink-0" onClick={() => setIsAdminMode(false)}>
            {settings?.logoUrl ? (
              <div className="p-1 bg-white rounded-lg shadow-sm h-10 max-w-[150px] px-2 flex items-center justify-center overflow-hidden shrink-0">
                <img
                  src={getImgSrc(settings.logoUrl, 'medium')}
                  alt={getImgAlt(settings.logoUrl, settings.companyName)}
                  title={getImgTitle(settings.logoUrl, settings.companyName)}
                  className="max-h-full max-w-full object-contain"
                  referrerPolicy="no-referrer"
                />
              </div>
            ) : (
              <div className="p-2 bg-teal-600 rounded-lg shadow-sm shrink-0">
                <Activity className="h-6 w-6 text-white animate-pulse" />
              </div>
            )}
            <div className="flex flex-col justify-center min-w-0 max-w-[180px] sm:max-w-[240px] md:max-w-[320px]">
              <span className="font-display font-bold text-sm sm:text-base md:text-lg tracking-wide uppercase leading-tight block break-words">
                {settings?.companyName ? (
                  <>
                    {settings.companyName.split(' ')[0]} <span className="text-teal-400">{settings.companyName.split(' ').slice(1).join(' ') || ''}</span>
                  </>
                ) : (
                  <>
                    ABC <span className="text-teal-400">Pharmaceutical</span>
                  </>
                )}
              </span>
            </div>
          </div>

          {/* Centralized Navigation Tabs for Public Portal */}
          {!isAdminMode && (
            <div className="hidden md:flex flex-1 justify-end items-center space-x-1 lg:space-x-3 mx-4">
              {availableTabs.map((tab) => {
                const isActive = activeTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab?.(tab.id)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold tracking-wide uppercase transition-all duration-200 ${
                      isActive
                        ? 'bg-teal-500/10 text-teal-400 border border-teal-500/30'
                        : 'text-slate-300 hover:text-white hover:bg-slate-800/50 border border-transparent'
                    }`}
                  >
                    {tab.label}
                  </button>
                );
              })}
            </div>
          )}

          {/* Action Area */}
          <div className="flex items-center space-x-2 sm:space-x-4">
            {isAdminMode ? (
              <>
                {/* RBAC Quick Swapper Sandbox */}
                <div className="hidden md:flex items-center space-x-2 bg-slate-800/80 px-3 py-1.5 rounded-lg border border-slate-700/60">
                  <span className="text-xs font-mono text-slate-400 flex items-center">
                    <UserCheck className="h-3.5 w-3.5 text-teal-400 mr-1" /> RBAC Role:
                  </span>
                  <select
                    id="role-swapper"
                    value={currentUserRole}
                    onChange={(e) => setCurrentUserRole(e.target.value as UserRole)}
                    className="bg-slate-900 text-teal-300 text-xs font-medium font-mono focus:outline-none focus:ring-1 focus:ring-teal-500 rounded px-2 py-0.5 cursor-pointer"
                  >
                    <option value="super_admin">Super Admin (All Access)</option>
                    <option value="admin">Admin (Operational)</option>
                    <option value="content_manager">Content Manager</option>
                    <option value="viewer">Viewer (Read-Only)</option>
                  </select>
                </div>

                {/* Exit Admin Button */}
                <button
                  id="btn-exit-admin"
                  onClick={() => setIsAdminMode(false)}
                  className="flex items-center space-x-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white px-3 py-1.5 rounded-md text-xs font-semibold tracking-wide transition duration-150 border border-slate-700"
                >
                  <Activity className="h-3.5 w-3.5 mr-1" />
                  <span>Exit Admin Console</span>
                </button>
              </>
            ) : (
              <>


                {/* Hamburger Menu Trigger for Mobile Navigation */}
                <button
                  onClick={() => setIsMobileNavOpen(!isMobileNavOpen)}
                  className="p-2 rounded-md text-slate-400 hover:text-white hover:bg-slate-800 focus:outline-none transition duration-150 border border-slate-700/40 md:hidden"
                  aria-label="Toggle navigation menu"
                >
                  {isMobileNavOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
                </button>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Dropdown Navigation Menu */}
      {!isAdminMode && isMobileNavOpen && (
        <div className="md:hidden border-t border-slate-800 bg-slate-950 shadow-inner px-2 pt-2 pb-4 space-y-1">
          {availableTabs.map((tab) => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => {
                  setActiveTab?.(tab.id);
                  setIsMobileNavOpen(false);
                }}
                className={`flex items-center w-full px-4 py-3 rounded-lg text-xs font-bold uppercase transition-all duration-150 border-l-4 ${
                  isActive
                    ? 'bg-teal-500/10 text-teal-400 border-l-teal-500 font-extrabold'
                    : 'text-slate-400 hover:bg-slate-900 hover:text-white border-l-transparent'
                }`}
              >
                <span>{tab.label}</span>
              </button>
            );
          })}

        </div>
      )}

      {/* Role Notice on top in Admin Mode */}
      {isAdminMode && (
        <div className="bg-teal-950/40 border-t border-teal-800/60 py-1.5 px-4 text-center text-[11px] font-mono text-teal-300 flex items-center justify-center space-x-2">
          <span>Logged in as: <strong className="text-teal-200">{userEmail}</strong></span>
          <span className="text-slate-500">•</span>
          <span>Permission Level: <strong className="text-amber-400 uppercase">{currentUserRole.replace('_', ' ')}</strong></span>
          {currentUserRole === 'viewer' && (
            <>
              <span className="text-slate-500">•</span>
              <span className="text-rose-400 flex items-center">
                <Unlock className="h-3 w-3 mr-1" /> View Only (Form Saves Disabled)
              </span>
            </>
          )}
        </div>
      )}
    </header>
  );
}
