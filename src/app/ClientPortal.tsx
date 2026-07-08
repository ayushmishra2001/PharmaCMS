"use client";

import React, { useState } from 'react';
import Navbar from '@/components/Navbar';
import PublicPortal from '@/components/PublicPortal';
import { 
  Category, Product, Certification, Facility, JobOpening, 
  JobApplication, Inquiry, SiteSettings, GalleryItem, 
  TimelineEvent, LeadershipMember 
} from '@/types';

interface ClientPortalProps {
  initialCategories: Category[];
  initialProducts: Product[];
  initialCertifications: Certification[];
  initialFacilities: Facility[];
  initialJobs: JobOpening[];
  initialSettings: SiteSettings;
  initialGalleryItems: GalleryItem[];
  initialTimelineData: TimelineEvent[];
  initialLeadershipData: LeadershipMember[];
}

export default function ClientPortal({
  initialCategories,
  initialProducts,
  initialCertifications,
  initialFacilities,
  initialJobs,
  initialSettings,
  initialGalleryItems,
  initialTimelineData,
  initialLeadershipData,
}: ClientPortalProps) {
  const [activeTab, setActiveTab] = useState<'home' | 'about' | 'catalog' | 'facilities' | 'certifications' | 'gallery' | 'careers' | 'contact'>('home');

  // API handlers for submitting inquiries & applications
  const handleInquirySubmit = async (inquiry: Omit<Inquiry, 'id' | 'status' | 'createdAt'>): Promise<boolean> => {
    try {
      const res = await fetch('/api/inquiries', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ inquiry }),
      });
      const data = await res.json();
      return !!data.success;
    } catch (err) {
      console.error('Failed to dispatch public inquiry:', err);
      return false;
    }
  };

  const handleApplyJob = async (application: Omit<JobApplication, 'id' | 'status' | 'createdAt'>): Promise<boolean> => {
    try {
      const res = await fetch('/api/applications', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ application }),
      });
      const data = await res.json();
      return !!data.success;
    } catch (err) {
      console.error('Failed to dispatch job application:', err);
      return false;
    }
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar
        isAdminMode={false}
        setIsAdminMode={() => {}}
        currentUserRole="viewer"
        setCurrentUserRole={() => {}}
        userEmail=""
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        settings={initialSettings}
      />
      <main className="flex-grow">
        <PublicPortal
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          categories={initialCategories}
          products={initialProducts}
          certifications={initialCertifications}
          facilities={initialFacilities}
          jobs={initialJobs}
          settings={initialSettings}
          galleryItems={initialGalleryItems}
          timelineData={initialTimelineData}
          leadershipData={initialLeadershipData}
          onSubmitInquiry={handleInquirySubmit}
          onSubmitApplication={handleApplyJob}
        />
      </main>
    </div>
  );
}
