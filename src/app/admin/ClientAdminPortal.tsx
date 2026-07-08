'use client';

import React, { useState, useEffect } from 'react';
import AdminPanel from '@/components/AdminPanel';
import Navbar from '@/components/Navbar';
import { 
  Category, Product, Certification, Facility, JobOpening, 
  JobApplication, Inquiry, ActivityLog, SiteSettings, 
  GalleryItem, TimelineEvent, LeadershipMember, UserRole 
} from '@/types';
import { 
  saveProduct, deleteProduct, saveCategory, deleteCategory,
  saveJob, deleteJob, saveCertification, deleteCertification,
  saveFacility, deleteFacility, saveGalleryItem, deleteGalleryItem,
  saveTimelineEvent, deleteTimelineEvent, saveLeadershipMember,
  deleteLeadershipMember, saveSettings, updateInquiry,
  updateApplicationStatus, reorderProducts, reorderGallery,
  reorderTimeline, reorderLeadership
} from '@/actions/admin';
import { useRouter } from 'next/navigation';

interface ClientAdminPortalProps {
  categories: Category[];
  products: Product[];
  certifications: Certification[];
  facilities: Facility[];
  jobs: JobOpening[];
  applications: JobApplication[];
  inquiries: Inquiry[];
  logs: ActivityLog[];
  settings: SiteSettings;
  galleryItems: GalleryItem[];
  timelineData: TimelineEvent[];
  leadershipData: LeadershipMember[];
  user: any;
}

export default function ClientAdminPortal({
  categories: initialCategories,
  products: initialProducts,
  certifications: initialCertifications,
  facilities: initialFacilities,
  jobs: initialJobs,
  applications: initialApplications,
  inquiries: initialInquiries,
  logs: initialLogs,
  settings: initialSettings,
  galleryItems: initialGalleryItems,
  timelineData: initialTimelineData,
  leadershipData: initialLeadershipData,
  user
}: ClientAdminPortalProps) {
  const router = useRouter();
  const userEmail = user?.email || '';
  const currentUserRole: UserRole = user?.role || 'viewer';

  const [categories, setCategories] = useState(initialCategories);
  const [products, setProducts] = useState(initialProducts);
  const [certifications, setCertifications] = useState(initialCertifications);
  const [facilities, setFacilities] = useState(initialFacilities);
  const [jobs, setJobs] = useState(initialJobs);
  const [applications, setApplications] = useState(initialApplications);
  const [inquiries, setInquiries] = useState(initialInquiries);
  const [logs, setLogs] = useState(initialLogs);
  const [settings, setSettings] = useState(initialSettings);
  const [galleryItems, setGalleryItems] = useState(initialGalleryItems);
  const [timelineData, setTimelineData] = useState(initialTimelineData);
  const [leadershipData, setLeadershipData] = useState(initialLeadershipData);
  
  useEffect(() => {
    setCategories(initialCategories);
    setProducts(initialProducts);
    setCertifications(initialCertifications);
    setFacilities(initialFacilities);
    setJobs(initialJobs);
    setApplications(initialApplications);
    setInquiries(initialInquiries);
    setLogs(initialLogs);
    setSettings(initialSettings);
    setGalleryItems(initialGalleryItems);
    setTimelineData(initialTimelineData);
    setLeadershipData(initialLeadershipData);
  }, [
    initialCategories, initialProducts, initialCertifications, 
    initialFacilities, initialJobs, initialApplications, 
    initialInquiries, initialLogs, initialSettings, 
    initialGalleryItems, initialTimelineData, initialLeadershipData
  ]);
  
  // This helps trigger a hard refresh of Server Components to ensure fresh data
  const triggerRefresh = () => {
    // We update local state in handlers anyway for immediate feedback,
    // but we should also re-fetch server data occasionally
    // We'll leave it to Next.js router.refresh() if needed
  };

  const wrapAction = async (actionFn: any, item: any, stateSetter: any, stateGetter: any, isDelete = false) => {
    try {
      const success = await actionFn(isDelete ? item : item);
      if (success) {
        if (isDelete) {
           stateSetter(stateGetter.filter((x: any) => x.id !== item));
           router.refresh();
        } else {
           // For creates and updates, rely entirely on the server refresh
           router.refresh();
        }
        return true;
      }
    } catch (e) {
      console.error(e);
    }
    return false;
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col selection:bg-teal-500 selection:text-white">
      <Navbar
        isAdminMode={true}
        setIsAdminMode={(mode) => {
          if (!mode) {
             fetch('/api/auth/logout', { method: 'POST' }).then(() => router.push('/'));
          }
        }}
        currentUserRole={currentUserRole}
        setCurrentUserRole={() => {}}
        userEmail={userEmail}
        settings={settings}
        activeTab="home"
        setActiveTab={() => {}}
      />
      <AdminPanel
        categories={categories}
        products={products}
        certifications={certifications}
        facilities={facilities}
        jobs={jobs}
        applications={applications}
        inquiries={inquiries}
        logs={logs}
        settings={settings}
        galleryItems={galleryItems}
        timelineData={timelineData}
        leadershipData={leadershipData}
        currentUserRole={currentUserRole}
        userEmail={userEmail}
        
        onSaveProduct={(p) => wrapAction(saveProduct, p, setProducts, products)}
        onReorderProducts={(items) => wrapAction(reorderProducts, items, setProducts, products)}
        onDeleteProduct={(id) => wrapAction(deleteProduct, id, setProducts, products, true)}
        
        onSaveCategory={(c) => wrapAction(saveCategory, c, setCategories, categories)}
        onDeleteCategory={(id) => wrapAction(deleteCategory, id, setCategories, categories, true)}
        
        onSaveJob={(j) => wrapAction(saveJob, j, setJobs, jobs)}
        onDeleteJob={(id) => wrapAction(deleteJob, id, setJobs, jobs, true)}
        
        onSaveCertification={(c) => wrapAction(saveCertification, c, setCertifications, certifications)}
        onDeleteCertification={(id) => wrapAction(deleteCertification, id, setCertifications, certifications, true)}
        
        onSaveFacility={(f) => wrapAction(saveFacility, f, setFacilities, facilities)}
        onDeleteFacility={(id) => wrapAction(deleteFacility, id, setFacilities, facilities, true)}
        
        onSaveGalleryItem={(g) => wrapAction(saveGalleryItem, g, setGalleryItems, galleryItems)}
        onDeleteGalleryItem={(id) => wrapAction(deleteGalleryItem, id, setGalleryItems, galleryItems, true)}
        onReorderGallery={(items) => wrapAction(reorderGallery, items, setGalleryItems, galleryItems)}
        
        onSaveTimelineEvent={(t) => wrapAction(saveTimelineEvent, t, setTimelineData, timelineData)}
        onDeleteTimelineEvent={(id) => wrapAction(deleteTimelineEvent, id, setTimelineData, timelineData, true)}
        onReorderTimeline={(items) => wrapAction(reorderTimeline, items, setTimelineData, timelineData)}
        
        onSaveLeadershipMember={(l) => wrapAction(saveLeadershipMember, l, setLeadershipData, leadershipData)}
        onDeleteLeadershipMember={(id) => wrapAction(deleteLeadershipMember, id, setLeadershipData, leadershipData, true)}
        onReorderLeadership={(items) => wrapAction(reorderLeadership, items, setLeadershipData, leadershipData)}
        
        onSaveSettings={(s) => wrapAction(saveSettings, s, setSettings, settings)}
        
        onUpdateInquiry={async (id, status, notes) => {
          const success = await updateInquiry(id, status, notes);
          if (success) router.refresh();
          return success;
        }}
        
        onUpdateApplicationStatus={async (id, status) => {
          const success = await updateApplicationStatus(id, status);
          if (success) router.refresh();
          return success;
        }}
      />
    </div>
  );
}
