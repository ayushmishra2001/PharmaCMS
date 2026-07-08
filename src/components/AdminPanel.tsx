"use client";
/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import {
  TrendingUp, Layers, Pill, Award, Briefcase, Inbox, Settings, Plus, Edit, Trash2,
  Save, Eye, Sparkles, CheckCircle, Clock, XCircle, X, AlertCircle, FileText, ChevronRight,
  ShieldAlert, RefreshCcw, User, UserCheck, HelpCircle, ArrowUpRight, MessageSquare,
  Factory, Tag, Activity, Upload, Image, Users, BookOpen, Play, Calendar, Globe,
  FlaskConical, Database
} from 'lucide-react';
import {
  Product, Category, Certification, Facility, JobOpening, JobApplication, Inquiry,
  ActivityLog, SiteSettings, UserRole, GalleryItem, TimelineEvent, LeadershipMember
} from '../types';
import UserManagement from './UserManagement';
import { ImageEditorModal } from './ImageEditorModal';
import { getImgSrc, getImgAlt, getImgTitle } from '../lib/imageUtils';

interface AdminPanelProps {
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
  currentUserRole: UserRole;
  userEmail: string;
  onSaveProduct: (prod: Product) => Promise<boolean>;
  onReorderProducts?: (reordered: Product[]) => Promise<boolean>;
  onDeleteProduct: (id: string) => Promise<boolean>;
  onSaveSettings: (sett: SiteSettings) => Promise<boolean>;
  onUpdateInquiry: (id: string, status: 'unread' | 'read' | 'closed', notes: string) => Promise<boolean>;
  onSaveJob: (job: JobOpening) => Promise<boolean>;
  onUpdateApplicationStatus: (id: string, status: 'new' | 'reviewed' | 'shortlisted' | 'rejected') => Promise<boolean>;
  onDeleteJob: (id: string) => Promise<boolean>;
  onSaveCategory: (category: Category) => Promise<boolean>;
  onDeleteCategory: (id: string) => Promise<boolean>;
  onSaveCertification: (certification: Certification) => Promise<boolean>;
  onDeleteCertification: (id: string) => Promise<boolean>;
  onSaveFacility: (facility: Facility) => Promise<boolean>;
  onDeleteFacility: (id: string) => Promise<boolean>;
  onSaveGalleryItem: (galleryItem: GalleryItem) => Promise<boolean>;
  onDeleteGalleryItem: (id: string) => Promise<boolean>;
  onReorderGallery: (reordered: GalleryItem[]) => Promise<boolean>;
  onSaveTimelineEvent: (timelineEvent: TimelineEvent) => Promise<boolean>;
  onDeleteTimelineEvent: (id: string) => Promise<boolean>;
  onReorderTimeline: (reordered: TimelineEvent[]) => Promise<boolean>;
  onSaveLeadershipMember: (leadershipMember: LeadershipMember) => Promise<boolean>;
  onDeleteLeadershipMember: (id: string) => Promise<boolean>;
  onReorderLeadership: (reordered: LeadershipMember[]) => Promise<boolean>;
  onResetDatabase?: () => Promise<boolean>;
  onSimulateInquiry?: () => Promise<boolean>;
  onSimulateApplication?: () => Promise<boolean>;
  onSimulateAuditLog?: () => Promise<boolean>;
}

export function ProductImagePreviewSlider({ images, onImageClick }: { images: string[]; onImageClick?: (img: string) => void }) {
  const [currentIdx, setCurrentIdx] = useState(0);

  const handlePrev = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setCurrentIdx(prev => (prev === 0 ? images.length - 1 : prev - 1));
  };

  const handleNext = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setCurrentIdx(prev => (prev === images.length - 1 ? 0 : prev + 1));
  };

  return (
    <div className="relative w-full h-full group bg-slate-950 flex items-center justify-center">
      <img
        src={getImgSrc(images[currentIdx], 'medium')}
        alt={getImgAlt(images[currentIdx], `Product slide ${currentIdx + 1}`)}
        title={getImgTitle(images[currentIdx], `Click to view full size`)}
        onClick={() => onImageClick?.(images[currentIdx])}
        className={`max-h-full max-w-full object-contain ${onImageClick ? 'cursor-zoom-in hover:opacity-90 transition-opacity' : ''}`}
      />
      {images.length > 1 && (
        <>
          <button
            onClick={handlePrev}
            className="absolute left-1 top-1/2 -translate-y-1/2 bg-black/60 hover:bg-black/80 text-white w-6 h-6 rounded-full flex items-center justify-center text-xs transition-colors z-10"
            type="button"
            title="Previous image"
          >
            &larr;
          </button>
          <button
            onClick={handleNext}
            className="absolute right-1 top-1/2 -translate-y-1/2 bg-black/60 hover:bg-black/80 text-white w-6 h-6 rounded-full flex items-center justify-center text-xs transition-colors z-10"
            type="button"
            title="Next image"
          >
            &rarr;
          </button>
          <div className="absolute bottom-1 left-0 right-0 flex justify-center space-x-1.5 z-10">
            {images.map((_, idx) => (
              <button
                key={idx}
                type="button"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  setCurrentIdx(idx);
                }}
                className={`w-1.5 h-1.5 rounded-full transition-all ${
                  idx === currentIdx ? 'bg-white scale-125' : 'bg-white/40'
                }`}
              />
            ))}
          </div>
        </>
      )}
      <span className="absolute top-1 right-1 bg-black/75 text-white text-[9px] font-mono px-1.5 py-0.5 rounded">
        {currentIdx + 1} / {images.length}
      </span>
    </div>
  );
}

export default function AdminPanel({
  categories,
  products,
  certifications,
  facilities,
  jobs,
  applications,
  inquiries,
  logs,
  settings,
  galleryItems,
  timelineData,
  leadershipData,
  currentUserRole,
  userEmail,
  onSaveProduct,
  onReorderProducts,
  onDeleteProduct,
  onSaveSettings,
  onUpdateInquiry,
  onSaveJob,
  onUpdateApplicationStatus,
  onDeleteJob,
  onSaveCategory,
  onDeleteCategory,
  onSaveCertification,
  onDeleteCertification,
  onSaveFacility,
  onDeleteFacility,
  onSaveGalleryItem,
  onDeleteGalleryItem,
  onReorderGallery,
  onSaveTimelineEvent,
  onDeleteTimelineEvent,
  onReorderTimeline,
  onSaveLeadershipMember,
  onDeleteLeadershipMember,
  onReorderLeadership,
  onResetDatabase,
  onSimulateInquiry,
  onSimulateApplication,
  onSimulateAuditLog,
}: AdminPanelProps) {
  // Login Guard (Ensures a valid user session is active for security)
  const [isAuthenticated, setIsAuthenticated] = useState(!!userEmail);
  const [loginEmail, setLoginEmail] = useState('admin@example.com');
  const [loginPassword, setLoginPassword] = useState('');
  const [loginError, setLoginError] = useState('');

  // Active navigation section
  const [activeSection, setActiveSection] = useState<'dashboard' | 'products' | 'categories' | 'certifications' | 'facilities' | 'jobs' | 'applications' | 'inquiries' | 'settings' | 'visibility' | 'users' | 'gallery' | 'about'>('dashboard');

  // Generic dual-tab active state for entities: 'view' or 'edit'
  const [productsTab, setProductsTab] = useState<'view' | 'edit'>('view');
  const [categoriesTab, setCategoriesTab] = useState<'view' | 'edit'>('view');
  const [certsTab, setCertsTab] = useState<'view' | 'edit'>('view');
  const [facilitiesTab, setFacilitiesTab] = useState<'view' | 'edit'>('view');
  const [jobsTab, setJobsTab] = useState<'view' | 'edit'>('view');

  // Edit / Form states
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [editingCert, setEditingCert] = useState<Certification | null>(null);
  const [editingFacility, setEditingFacility] = useState<Facility | null>(null);
  const [editingJob, setEditingJob] = useState<JobOpening | null>(null);
  
  // Gallery states
  const [galleryTab, setGalleryTab] = useState<'view' | 'edit'>('view');
  const [editingGalleryItem, setEditingGalleryItem] = useState<GalleryItem | null>(null);

  // About US CMS states
  const [aboutSubTab, setAboutSubTab] = useState<'timeline' | 'leadership' | 'editorial' | 'infrastructure'>('timeline');
  const [aboutEditMode, setAboutEditMode] = useState<boolean>(false);
  const [editingTimelineEvent, setEditingTimelineEvent] = useState<TimelineEvent | null>(null);
  const [editingLeadershipMember, setEditingLeadershipMember] = useState<LeadershipMember | null>(null);

  // CRM details viewer states
  const [selectedInquiry, setSelectedInquiry] = useState<Inquiry | null>(null);
  const [inquiryNotes, setInquiryNotes] = useState('');
  const [inquiryStatus, setInquiryStatus] = useState<'unread' | 'read' | 'closed'>('unread');

  // Site Settings form
  const [settingsForm, setSettingsForm] = useState<SiteSettings>({ ...settings });
  const [logoDragActive, setLogoDragActive] = useState(false);
  const [logoUploadError, setLogoUploadError] = useState('');
  const [slidesDragActive, setSlidesDragActive] = useState(false);
  const [slidesUploadError, setSlidesUploadError] = useState('');
  const [newSlideUrl, setNewSlideUrl] = useState('');
  const [fullScreenImageUrl, setFullScreenImageUrl] = useState<string | null>(null);

  // Custom confirmation modal state
  const [confirmState, setConfirmState] = useState<{
    isOpen: boolean;
    title: string;
    message: string;
    onConfirm: () => void;
  } | null>(null);

  React.useEffect(() => {
    if (settings) {
      setSettingsForm({ ...settings });
    }
  }, [settings]);

  const updateInfraItem = (index: number, field: string, value: string) => {
    const currentInfraData = [...(settingsForm.infraData || [])];
    while (currentInfraData.length <= index) {
      currentInfraData.push({ id: currentInfraData.length + 1, name: '', details: '', calibration: '', level: '' });
    }
    currentInfraData[index] = { ...currentInfraData[index], [field]: value };
    
    setSettingsForm({
      ...settingsForm,
      infraData: currentInfraData,
      socialLinks: {
        ...(settingsForm.socialLinks || {}),
        infraData: currentInfraData,
      }
    });
  };

  const updateInfraHeader = (field: string, value: string) => {
    setSettingsForm({
      ...settingsForm,
      [field]: value,
      socialLinks: {
        ...(settingsForm.socialLinks || {}),
        [field]: value,
      }
    });
  };

  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setFullScreenImageUrl(null);
      }
    };
    if (fullScreenImageUrl) {
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [fullScreenImageUrl]);

  // Search/Filters in Admin
  const [productSearch, setProductSearch] = useState('');
  const [productCatFilter, setProductCatFilter] = useState('all');

  // Operation indicators
  const [submitting, setSubmitting] = useState(false);
  const [operationSuccess, setOperationSuccess] = useState('');
  const [simulatingAction, setSimulatingAction] = useState<string | null>(null);

  // Image editing queue state for on-the-fly resizing, cropping and filters
  const [imageEditorQueue, setImageEditorQueue] = useState<File[]>([]);
  const [imageEditorTarget, setImageEditorTarget] = useState<'product' | 'logo' | 'slide' | 'gallery' | 'timeline' | 'leadership'>('product');

  // Permission Guard Helper
  const isReadOnly = currentUserRole === 'viewer';
  const hasSettingsAccess = currentUserRole === 'super_admin' || currentUserRole === 'admin';

  // --- ACTIONS ---

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (loginEmail && loginPassword) {
      setIsAuthenticated(true);
      setLoginError('');
    } else {
      setLoginError('Please enter valid credentials.');
    }
  };



  const handleProductSaveSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isReadOnly) return;
    if (!editingProduct) return;

    setSubmitting(true);
    const success = await onSaveProduct(editingProduct);
    setSubmitting(false);

    if (success) {
      setOperationSuccess('Product formulation monograph stored securely.');
      setProductsTab('view');
      setEditingProduct(null);
      setTimeout(() => setOperationSuccess(''), 4000);
    }
  };

  const handleProductDelete = async (id: string) => {
    if (isReadOnly) return;
    setConfirmState({
      isOpen: true,
      title: 'Confirm Product Disposal',
      message: 'Confirm disposal of this pharmaceutical product reference from the monograph records?',
      onConfirm: async () => {
        const success = await onDeleteProduct(id);
        if (success) {
          setOperationSuccess('Product disposed from live records.');
          setTimeout(() => setOperationSuccess(''), 4000);
        }
      }
    });
  };

  const handleLogoFile = (file: File) => {
    setLogoUploadError('');
    if (!file.type.startsWith('image/')) {
      setLogoUploadError('Please upload an image file (PNG, JPG, SVG, WebP).');
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      setLogoUploadError('File is too large. Maximum size allowed is 5MB.');
      return;
    }

    setImageEditorTarget('logo');
    setImageEditorQueue([file]);
  };

  const [galleryUploadError, setGalleryUploadError] = useState('');
  const handleGalleryFile = (file: File) => {
    setGalleryUploadError('');
    if (!file.type.startsWith('image/')) {
      setGalleryUploadError('Please upload an image file (PNG, JPG, SVG, WebP).');
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      setGalleryUploadError('File is too large. Maximum size allowed is 5MB.');
      return;
    }
    setImageEditorTarget('gallery');
    setImageEditorQueue([file]);
  };

  const [timelineUploadError, setTimelineUploadError] = useState('');
  const handleTimelineFile = (file: File) => {
    setTimelineUploadError('');
    if (!file.type.startsWith('image/')) {
      setTimelineUploadError('Please upload an image file (PNG, JPG, SVG, WebP).');
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      setTimelineUploadError('File is too large. Maximum size allowed is 5MB.');
      return;
    }
    setImageEditorTarget('timeline');
    setImageEditorQueue([file]);
  };

  const [leadershipUploadError, setLeadershipUploadError] = useState('');
  const handleLeadershipFile = (file: File) => {
    setLeadershipUploadError('');
    if (!file.type.startsWith('image/')) {
      setLeadershipUploadError('Please upload an image file (PNG, JPG, SVG, WebP).');
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      setLeadershipUploadError('File is too large. Maximum size allowed is 5MB.');
      return;
    }
    setImageEditorTarget('leadership');
    setImageEditorQueue([file]);
  };

  const handleImageEditorSave = (processedJson: string) => {
    if (imageEditorTarget === 'product') {
      setEditingProduct(prev => {
        if (!prev) return null;
        return {
          ...prev,
          images: [...(prev.images || []), processedJson]
        };
      });
    } else if (imageEditorTarget === 'logo') {
      setSettingsForm(prev => ({
        ...prev,
        logoUrl: processedJson
      }));
    } else if (imageEditorTarget === 'slide') {
      setSettingsForm(prev => ({
        ...prev,
        heroSlides: [...(prev.heroSlides || []), processedJson]
      }));
    } else if (imageEditorTarget === 'gallery') {
      setEditingGalleryItem(prev => {
        if (!prev) return null;
        return {
          ...prev,
          imageUrl: processedJson
        };
      });
    } else if (imageEditorTarget === 'timeline') {
      setEditingTimelineEvent(prev => {
        if (!prev) return null;
        return {
          ...prev,
          imageUrl: processedJson
        };
      });
    } else if (imageEditorTarget === 'leadership') {
      setEditingLeadershipMember(prev => {
        if (!prev) return null;
        return {
          ...prev,
          imageUrl: processedJson
        };
      });
    }

    // Process next item or clear queue
    setImageEditorQueue(prev => prev.slice(1));
  };

  const handleLogoDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setLogoDragActive(true);
    } else if (e.type === "dragleave") {
      setLogoDragActive(false);
    }
  };

  const handleLogoDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setLogoDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleLogoFile(e.dataTransfer.files[0]);
    }
  };

  const handleLogoFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleLogoFile(e.target.files[0]);
    }
  };

  const handleSlidesFiles = (files: FileList) => {
    setSlidesUploadError('');
    const validFiles = Array.from(files).filter(file => {
      if (!file.type.startsWith('image/')) {
        setSlidesUploadError('All uploaded files must be images (PNG, JPG, SVG, WebP).');
        return false;
      }
      if (file.size > 5 * 1024 * 1024) {
        setSlidesUploadError('Some files are too large. Maximum size per file is 5MB.');
        return false;
      }
      return true;
    });

    if (validFiles.length === 0) return;

    setImageEditorTarget('slide');
    setImageEditorQueue(prev => [...prev, ...validFiles]);
  };

  const handleSlidesDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setSlidesDragActive(true);
    } else if (e.type === "dragleave") {
      setSlidesDragActive(false);
    }
  };

  const handleSlidesDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setSlidesDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleSlidesFiles(e.dataTransfer.files);
    }
  };

  const handleSlidesFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      handleSlidesFiles(e.target.files);
    }
  };

  const handleAddSlideUrl = () => {
    if (!newSlideUrl.trim()) return;
    if (!newSlideUrl.startsWith('http://') && !newSlideUrl.startsWith('https://') && !newSlideUrl.startsWith('data:image')) {
      setSlidesUploadError('Please enter a valid image URL starting with http:// or https://');
      return;
    }
    setSettingsForm(prev => ({
      ...prev,
      heroSlides: [...(prev.heroSlides || []), newSlideUrl.trim()]
    }));
    setNewSlideUrl('');
    setSlidesUploadError('');
  };

  const handleRemoveSlide = (index: number) => {
    setSettingsForm(prev => {
      const updated = [...(prev.heroSlides || [])];
      updated.splice(index, 1);
      return {
        ...prev,
        heroSlides: updated
      };
    });
  };

  const handleMoveSlide = (index: number, direction: 'up' | 'down') => {
    setSettingsForm(prev => {
      const updated = [...(prev.heroSlides || [])];
      const targetIndex = direction === 'up' ? index - 1 : index + 1;
      if (targetIndex >= 0 && targetIndex < updated.length) {
        const temp = updated[index];
        updated[index] = updated[targetIndex];
        updated[targetIndex] = temp;
      }
      return {
        ...prev,
        heroSlides: updated
      };
    });
  };

  const handleLoadDefaultSlides = () => {
    setSettingsForm(prev => ({
      ...prev,
      heroSlides: [
        "https://images.unsplash.com/photo-1576086213369-97a306d36557?q=80&w=1600&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?q=80&w=1600&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1532187863486-abf9d39d66e8?q=80&w=1600&auto=format&fit=crop"
      ]
    }));
  };

  const handleSettingsSaveSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isReadOnly) return;
    if (!hasSettingsAccess) {
      alert('Access Denied: Settings configurations require Super Admin or Admin role permissions.');
      return;
    }

    setSubmitting(true);
    const success = await onSaveSettings(settingsForm);
    setSubmitting(false);

    if (success) {
      setOperationSuccess('Global site coordinates updated.');
      setTimeout(() => setOperationSuccess(''), 4000);
    }
  };

  const handleInquiryUpdateSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isReadOnly) return;
    if (!selectedInquiry) return;

    setSubmitting(true);
    const success = await onUpdateInquiry(selectedInquiry.id, inquiryStatus, inquiryNotes);
    setSubmitting(false);

    if (success) {
      setOperationSuccess('Inquiry file updated.');
      setSelectedInquiry(null);
      setTimeout(() => setOperationSuccess(''), 4000);
    }
  };

  const triggerResetDatabase = async () => {
    if (!onResetDatabase) return;
    setConfirmState({
      isOpen: true,
      title: 'Reset Database to Default',
      message: 'Wipe all recent modifications and reset categories, monographs, certs, facilities, and CRM logs to original default pre-seeded state?',
      onConfirm: async () => {
        setSimulatingAction('reset');
        const success = await onResetDatabase();
        setSimulatingAction(null);
        if (success) {
          setOperationSuccess('Database restored to pristine pre-seeded compliance records.');
          setTimeout(() => setOperationSuccess(''), 5000);
        }
      }
    });
  };

  const triggerSimulateInquiry = async () => {
    if (!onSimulateInquiry) return;
    setSimulatingAction('inquiry');
    const success = await onSimulateInquiry();
    setSimulatingAction(null);
    if (success) {
      setOperationSuccess('Simulated a new high-quality pharmaceutical supply lead query!');
      setTimeout(() => setOperationSuccess(''), 5000);
    }
  };

  const triggerSimulateApplication = async () => {
    if (!onSimulateApplication) return;
    setSimulatingAction('application');
    const success = await onSimulateApplication();
    setSimulatingAction(null);
    if (success) {
      setOperationSuccess('Simulated a new professional dossier job application candidate.');
      setTimeout(() => setOperationSuccess(''), 5000);
    }
  };

  const triggerSimulateAuditLog = async () => {
    if (!onSimulateAuditLog) return;
    setSimulatingAction('audit');
    const success = await onSimulateAuditLog();
    setSimulatingAction(null);
    if (success) {
      setOperationSuccess('Appended a new random regulatory compliance verification to live logs.');
      setTimeout(() => setOperationSuccess(''), 5000);
    }
  };

  const handleJobSaveSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isReadOnly) return;
    if (!editingJob) return;

    setSubmitting(true);
    const success = await onSaveJob(editingJob);
    setSubmitting(false);

    if (success) {
      setOperationSuccess('Job vacancy records stored.');
      setJobsTab('view');
      setEditingJob(null);
      setTimeout(() => setOperationSuccess(''), 4000);
    }
  };

  const handleJobDelete = async (id: string) => {
    if (isReadOnly) return;
    setConfirmState({
      isOpen: true,
      title: 'Delete Job Vacancy',
      message: 'Are you sure you want to permanently delete this job opening?',
      onConfirm: async () => {
        setSubmitting(true);
        const success = await onDeleteJob(id);
        setSubmitting(false);
        if (success) {
          setOperationSuccess('Job opening deleted successfully.');
          setTimeout(() => setOperationSuccess(''), 4000);
        }
      }
    });
  };

  const handleCategorySaveSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isReadOnly) return;
    if (!editingCategory) return;
    setSubmitting(true);
    const success = await onSaveCategory(editingCategory);
    setSubmitting(false);
    if (success) {
      setOperationSuccess('Therapeutic class category stored successfully.');
      setCategoriesTab('view');
      setEditingCategory(null);
      setTimeout(() => setOperationSuccess(''), 4000);
    }
  };

  const handleCategoryDelete = async (id: string) => {
    if (isReadOnly) return;
    setConfirmState({
      isOpen: true,
      title: 'Delete Category',
      message: 'Are you sure you want to delete this category? All products under it will lose their category association.',
      onConfirm: async () => {
        setSubmitting(true);
        const success = await onDeleteCategory(id);
        setSubmitting(false);
        if (success) {
          setOperationSuccess('Category deleted successfully.');
          setTimeout(() => setOperationSuccess(''), 4000);
        }
      }
    });
  };

  const handleCertSaveSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isReadOnly) return;
    if (!editingCert) return;
    setSubmitting(true);
    const success = await onSaveCertification(editingCert);
    setSubmitting(false);
    if (success) {
      setOperationSuccess('Accredited certificate saved successfully.');
      setCertsTab('view');
      setEditingCert(null);
      setTimeout(() => setOperationSuccess(''), 4000);
    }
  };

  const handleCertDelete = async (id: string) => {
    if (isReadOnly) return;
    setConfirmState({
      isOpen: true,
      title: 'Delete Certification',
      message: 'Are you sure you want to delete this certification?',
      onConfirm: async () => {
        setSubmitting(true);
        const success = await onDeleteCertification(id);
        setSubmitting(false);
        if (success) {
          setOperationSuccess('Certification deleted successfully.');
          setTimeout(() => setOperationSuccess(''), 4000);
        }
      }
    });
  };

  const handleFacilitySaveSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isReadOnly) return;
    if (!editingFacility) return;
    setSubmitting(true);
    const success = await onSaveFacility(editingFacility);
    setSubmitting(false);
    if (success) {
      setOperationSuccess('Facility site record stored successfully.');
      setFacilitiesTab('view');
      setEditingFacility(null);
      setTimeout(() => setOperationSuccess(''), 4000);
    }
  };

  const handleFacilityDelete = async (id: string) => {
    if (isReadOnly) return;
    setConfirmState({
      isOpen: true,
      title: 'Delete Facility Site',
      message: 'Are you sure you want to delete this manufacturing facility?',
      onConfirm: async () => {
        setSubmitting(true);
        const success = await onDeleteFacility(id);
        setSubmitting(false);
        if (success) {
          setOperationSuccess('Facility site deleted successfully.');
          setTimeout(() => setOperationSuccess(''), 4000);
        }
      }
    });
  };

  const triggerNewCategory = () => {
    setEditingCategory({
      id: '',
      name: '',
      slug: '',
      description: '',
      icon: 'Pills',
    });
    setCategoriesTab('edit');
  };

  const triggerEditCategory = (cat: Category) => {
    setEditingCategory({ ...cat });
    setCategoriesTab('edit');
  };

  const triggerNewCert = () => {
    setEditingCert({
      id: '',
      name: '',
      type: 'GMP',
      issuer: '',
      description: '',
      year: new Date().getFullYear(),
    });
    setCertsTab('edit');
  };

  const triggerEditCert = (cert: Certification) => {
    setEditingCert({ ...cert });
    setCertsTab('edit');
  };

  const triggerNewFacility = () => {
    setEditingFacility({
      id: '',
      name: '',
      location: '',
      type: 'Formulation Suite',
      capacity: '',
      description: 'WHO-GMP Compliant',
      imageUrl: '',
    });
    setFacilitiesTab('edit');
  };

  const triggerEditFacility = (fac: Facility) => {
    setEditingFacility({ ...fac });
    setFacilitiesTab('edit');
  };

  const handleAppStatusChange = async (id: string, status: any) => {
    if (isReadOnly) return;
    const success = await onUpdateApplicationStatus(id, status);
    if (success) {
      setOperationSuccess(`Candidate application status changed to ${status}.`);
      setTimeout(() => setOperationSuccess(''), 4000);
    }
  };

  // Pre-seed product form helper
  const triggerNewProduct = () => {
    setEditingProduct({
      id: '',
      name: '',
      brandName: '',
      genericName: '',
      categoryId: categories[0]?.id || '',
      composition: '',
      strength: '',
      indications: '',
      contraindications: '',
      sideEffects: '',
      dosage: '',
      packaging: '',
      status: 'draft',
      isFeatured: false,
      seoTitle: '',
      seoDesc: '',
      images: [],
    });
    setProductsTab('edit');
  };

  const triggerEditProduct = (prod: Product) => {
    setEditingProduct({
      ...prod,
      images: prod.images || [],
    });
    setProductsTab('edit');
  };

  // Product Reordering Logic
  const [draggedProductIdx, setDraggedProductIdx] = useState<number | null>(null);

  const handleProductDrop = async (targetIdx: number) => {
    if (draggedProductIdx === null || draggedProductIdx === targetIdx) return;
    if (isReadOnly) return;

    const draggedProduct = filteredProducts[draggedProductIdx];
    const targetProduct = filteredProducts[targetIdx];

    const actualDraggedIdx = products.findIndex(p => p.id === draggedProduct.id);
    const actualTargetIdx = products.findIndex(p => p.id === targetProduct.id);

    if (actualDraggedIdx !== -1 && actualTargetIdx !== -1) {
      const updatedProducts = [...products];
      const [removed] = updatedProducts.splice(actualDraggedIdx, 1);
      updatedProducts.splice(actualTargetIdx, 0, removed);

      if (onReorderProducts) {
        await onReorderProducts(updatedProducts);
      }
    }
    setDraggedProductIdx(null);
  };

  const handleMoveProduct = async (idx: number, direction: 'up' | 'down') => {
    if (isReadOnly) return;
    const targetIdx = direction === 'up' ? idx - 1 : idx + 1;
    if (targetIdx < 0 || targetIdx >= filteredProducts.length) return;

    const currentProduct = filteredProducts[idx];
    const targetProduct = filteredProducts[targetIdx];

    const actualCurrentIdx = products.findIndex(p => p.id === currentProduct.id);
    const actualTargetIdx = products.findIndex(p => p.id === targetProduct.id);

    if (actualCurrentIdx !== -1 && actualTargetIdx !== -1) {
      const updatedProducts = [...products];
      const temp = updatedProducts[actualCurrentIdx];
      updatedProducts[actualCurrentIdx] = updatedProducts[actualTargetIdx];
      updatedProducts[actualTargetIdx] = temp;

      if (onReorderProducts) {
        await onReorderProducts(updatedProducts);
      }
    }
  };

  const [draggedProductImgIdx, setDraggedProductImgIdx] = useState<number | null>(null);
  const [draggedHeroSlideIdx, setDraggedHeroSlideIdx] = useState<number | null>(null);

  const handleProductImgDrop = (targetIdx: number) => {
    if (draggedProductImgIdx === null || draggedProductImgIdx === targetIdx || !editingProduct) return;
    const imgs = [...(editingProduct.images || [])];
    const [removed] = imgs.splice(draggedProductImgIdx, 1);
    imgs.splice(targetIdx, 0, removed);
    setEditingProduct({
      ...editingProduct,
      images: imgs,
    });
    setDraggedProductImgIdx(null);
  };

  const handleHeroSlideDrop = (targetIdx: number) => {
    if (draggedHeroSlideIdx === null || draggedHeroSlideIdx === targetIdx) return;
    const slides = [...(settingsForm.heroSlides || [])];
    const [removed] = slides.splice(draggedHeroSlideIdx, 1);
    slides.splice(targetIdx, 0, removed);
    setSettingsForm(prev => ({
      ...prev,
      heroSlides: slides,
    }));
    setDraggedHeroSlideIdx(null);
  };

  const handleProductImagesFiles = (files: FileList) => {
    if (!editingProduct) return;
    const validFiles = Array.from(files).filter(file => {
      if (!file.type.startsWith('image/')) {
        alert('All uploaded files must be images (PNG, JPG, SVG, WebP).');
        return false;
      }
      if (file.size > 5 * 1024 * 1024) {
        alert('Some files are too large. Maximum size per file is 5MB.');
        return false;
      }
      return true;
    });

    if (validFiles.length === 0) return;

    setImageEditorTarget('product');
    setImageEditorQueue(prev => [...prev, ...validFiles]);
  };

  const handleRemoveProductImage = (idx: number) => {
    setEditingProduct(prev => {
      if (!prev) return null;
      const updated = [...(prev.images || [])];
      updated.splice(idx, 1);
      return {
        ...prev,
        images: updated
      };
    });
  };

  const triggerNewJob = () => {
    setEditingJob({
      id: '',
      title: '',
      department: 'Formulation Development',
      location: 'Corporate Campus',
      employmentType: 'Full-time',
      description: '',
      status: 'open',
      postedAt: new Date().toISOString(),
    });
    setJobsTab('edit');
  };

  const triggerEditJob = (job: JobOpening) => {
    setEditingJob({ ...job });
    setJobsTab('edit');
  };

  // Filtered list calculators
  const filteredProducts = products.filter((p) => {
    const matchesSearch =
      p.brandName.toLowerCase().includes(productSearch.toLowerCase()) ||
      p.genericName.toLowerCase().includes(productSearch.toLowerCase());
    const matchesCategory = productCatFilter === 'all' || p.categoryId === productCatFilter;
    return matchesSearch && matchesCategory;
  });

  // Security and Login Screen
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center p-6">
        <div className="max-w-md w-full bg-slate-900 border border-slate-800 rounded-2xl p-8 shadow-custom-lg">
          <div className="text-center mb-8">
            <div className="p-3 bg-teal-500/10 rounded-xl inline-block border border-teal-500/20 mb-4">
              <Pill className="h-8 w-8 text-teal-400" />
            </div>
            <h2 className="font-display text-2xl font-bold text-white tracking-tight uppercase">{settings.companyName || 'Pharmaceutical Enterprise'}</h2>
            <p className="text-xs text-slate-400 mt-1 font-mono">ENTERPRISE CMS SECURITY PORTAL</p>
          </div>

          {loginError && (
            <div className="bg-red-950/40 border border-red-800 rounded px-4 py-3 text-xs text-red-200 mb-6 flex items-start space-x-2">
              <AlertCircle className="h-4 w-4 text-red-400 shrink-0 mt-0.5" />
              <span>{loginError}</span>
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1 font-mono">Corporate Identity Email</label>
              <input
                type="email"
                required
                value={loginEmail}
                onChange={(e) => setLoginEmail(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-4 py-2.5 text-xs text-white focus:outline-none focus:ring-1 focus:ring-teal-500 font-mono"
              />
            </div>
            <div>
              <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1 font-mono">Security Password</label>
              <input
                type="password"
                required
                value={loginPassword}
                onChange={(e) => setLoginPassword(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-4 py-2.5 text-xs text-white focus:outline-none focus:ring-1 focus:ring-teal-500 font-mono"
              />
            </div>

            <button
              type="submit"
              className="w-full bg-teal-600 hover:bg-teal-500 text-white font-bold py-3 px-4 rounded-lg text-xs uppercase tracking-wider shadow-md transition duration-150"
            >
              Authorize Secure Entry
            </button>
          </form>
        </div>
      </div>
    );
  }

  // Active Admin Screen Layout
  return (
    <div className="min-h-screen bg-[#eef2f6] flex flex-col lg:flex-row">
      
      {/* 1. Left Sidebar CMS Controls */}
      <aside className="w-full lg:w-64 bg-white text-slate-850 border-r border-slate-200/80 shrink-0">
        {/* User Identity Segment */}
        <div className="p-6 border-b border-slate-150 bg-slate-50">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-slate-100 rounded-lg">
              <User className="h-5 w-5 text-teal-600" />
            </div>
            <div>
              <div className="text-xs font-bold text-slate-800 truncate max-w-[150px]">{userEmail}</div>
              <div className="text-[9px] font-mono font-bold uppercase tracking-wider text-amber-600 mt-0.5">
                {currentUserRole.replace('_', ' ')}
              </div>
            </div>
          </div>
        </div>

        {/* Navigation Categories */}
        <nav className="p-4 space-y-1">
          {[
            { id: 'dashboard', label: 'Dashboard Home', icon: TrendingUp },
            { id: 'products', label: 'Manage Products', icon: Pill },
            { id: 'categories', label: 'Product Groups (Categories)', icon: Tag },
            { id: 'certifications', label: 'Quality Certifications', icon: Award },
            { id: 'facilities', label: 'Factory Sites', icon: Factory },
            { id: 'gallery', label: 'Manage Gallery', icon: Image },
            { id: 'about', label: 'Manage About Us', icon: BookOpen },
            { id: 'inquiries', label: 'Customer Messages', icon: Inbox, badge: inquiries.filter(i => i.status === 'unread').length },
            { id: 'applications', label: 'Job Applications', icon: UserCheck, badge: applications.filter(a => a.status === 'new').length },
            { id: 'jobs', label: 'Job Openings', icon: Briefcase },
            { id: 'settings', label: 'Website Settings', icon: Settings },
            { id: 'visibility', label: 'Section Visibility', icon: Eye },
            { id: 'users', label: 'User Permissions', icon: Users },
          ].map((item) => {
            const Icon = item.icon;
            const isActive = activeSection === item.id;
            return (
              <button
                key={item.id}
                id={`admin-nav-${item.id}`}
                onClick={() => {
                  setActiveSection(item.id as any);
                  setSelectedInquiry(null);
                }}
                className={`w-full flex items-center justify-between px-4 py-3 rounded-lg text-xs font-semibold tracking-wide uppercase transition duration-150 ${
                  isActive
                    ? 'bg-teal-500 text-white shadow-sm'
                    : 'text-slate-500 hover:text-slate-800 hover:bg-slate-100'
                }`}
              >
                <div className="flex items-center space-x-3">
                  <Icon className={`h-4 w-4 ${isActive ? 'text-white' : 'text-slate-500'}`} />
                  <span>{item.label}</span>
                </div>
                {item.badge ? (
                  <span className={`font-mono text-[9px] font-extrabold px-1.5 py-0.5 rounded-full ${
                    isActive ? 'bg-white text-teal-600' : 'bg-teal-50 text-teal-600'
                  }`}>
                    {item.badge}
                  </span>
                ) : null}
              </button>
            );
          })}
        </nav>
      </aside>

      {/* 2. Main Administration Stage */}
      <main className="flex-grow p-6 lg:p-8 overflow-y-auto">
        
        {/* Operation Notifications */}
        {operationSuccess && (
          <div className="bg-teal-100 border-l-4 border-teal-500 p-4 text-teal-800 text-xs rounded shadow-custom-sm mb-6 flex items-start space-x-2 animate-bounce">
            <CheckCircle className="h-4 w-4 text-teal-600 shrink-0 mt-0.5" />
            <span>{operationSuccess}</span>
          </div>
        )}

        {isReadOnly && (
          <div className="bg-amber-100 border-l-4 border-amber-500 p-4 text-amber-800 text-xs rounded shadow-custom-sm mb-6 flex items-start space-x-2">
            <ShieldAlert className="h-4 w-4 text-amber-600 shrink-0 mt-0.5" />
            <div>
              <strong>Viewer Read-Only Profile:</strong>
              <p className="mt-0.5 text-[11px] text-amber-700">All data operations and saves are disabled for this session profile.</p>
            </div>
          </div>
        )}

        {/* SECTION 1: DASHBOARD */}
        {activeSection === 'dashboard' && (
          <div className="space-y-8 fade-in-up">
            <div>
              <h1 className="font-display text-2xl font-bold text-slate-900">{settings.companyName || 'Pharmaceutical Enterprise'} Control Tower</h1>
              <p className="text-xs text-slate-500 mt-1">Real-time WHO-GMP compliance levels, distributor pipelines, and monograph diagnostics.</p>
            </div>

            {/* KPI Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-custom-sm">
                <div className="flex justify-between items-start">
                  <div>
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider font-mono">Formulation Monographs</span>
                    <h3 className="font-display text-2xl font-bold text-slate-900 mt-1">{products.length}</h3>
                  </div>
                  <div className="p-3 bg-teal-50 rounded-lg"><Pill className="h-5 w-5 text-teal-600" /></div>
                </div>
                <div className="text-[10px] font-mono text-slate-500 mt-4 flex items-center">
                  <span className="text-teal-600 font-bold mr-1">{products.filter(p => p.status === 'published').length} Active</span>
                  <span>• {products.filter(p => p.status === 'draft').length} Drafts</span>
                </div>
              </div>

              <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-custom-sm">
                <div className="flex justify-between items-start">
                  <div>
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider font-mono">Unread Messages</span>
                    <h3 className="font-display text-2xl font-bold text-slate-900 mt-1">
                      {inquiries.filter((i) => i.status === 'unread').length}
                    </h3>
                  </div>
                  <div className="p-3 bg-amber-50 rounded-lg"><Inbox className="h-5 w-5 text-amber-500" /></div>
                </div>
                <div className="text-[10px] font-mono text-slate-500 mt-4 flex items-center">
                  <span className="text-amber-500 font-bold mr-1">
                    {inquiries.filter((i) => i.type === 'distributor').length} Partner Queries
                  </span>
                </div>
              </div>

              <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-custom-sm">
                <div className="flex justify-between items-start">
                  <div>
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider font-mono">Job Candidates</span>
                    <h3 className="font-display text-2xl font-bold text-slate-900 mt-1">{applications.length}</h3>
                  </div>
                  <div className="p-3 bg-indigo-50 rounded-lg"><UserCheck className="h-5 w-5 text-indigo-500" /></div>
                </div>
                <div className="text-[10px] font-mono text-slate-500 mt-4 flex items-center">
                  <span className="text-indigo-600 font-bold mr-1">
                    {applications.filter((a) => a.status === 'new').length} New Applications
                  </span>
                </div>
              </div>

              <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-custom-sm">
                <div className="flex justify-between items-start">
                  <div>
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider font-mono">Quality Certificates</span>
                    <h3 className="font-display text-2xl font-bold text-teal-600 mt-1">{certifications.length}</h3>
                  </div>
                  <div className="p-3 bg-emerald-50 rounded-lg"><Award className="h-5 w-5 text-emerald-600" /></div>
                </div>
                <div className="text-[10px] font-mono text-slate-500 mt-4 flex items-center">
                  <span className="text-emerald-600 font-bold mr-1">ISO, GMP, USFDA</span>
                </div>
              </div>
            </div>

            {/* Inquiries List & Logs Splits */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              
              {/* Left Side: Recent CRM Alerts */}
              <div className="lg:col-span-2 bg-white rounded-xl border border-slate-200 p-6 shadow-custom-sm">
                <div className="flex justify-between items-center mb-6">
                  <h3 className="font-display text-md font-bold text-slate-900">Recent Critical CRM Inquiries</h3>
                  <button onClick={() => setActiveSection('inquiries')} className="text-xs text-teal-600 hover:underline">Manage All &rarr;</button>
                </div>
                <div className="space-y-4">
                  {inquiries.slice(0, 3).map((inq) => (
                    <div
                      key={inq.id}
                      onClick={() => {
                        setSelectedInquiry(inq);
                        setInquiryStatus(inq.status);
                        setInquiryNotes(inq.notes || '');
                        setActiveSection('inquiries');
                      }}
                      className="border border-slate-150 hover:border-teal-500 rounded-lg p-4 transition-all duration-150 cursor-pointer bg-slate-50/50"
                    >
                      <div className="flex justify-between items-start">
                        <div>
                          <span className={`text-[9px] font-mono font-bold uppercase px-2 py-0.5 rounded ${
                            inq.type === 'distributor' ? 'bg-amber-100 text-amber-800' : 'bg-slate-100 text-slate-800'
                          }`}>
                            {inq.type}
                          </span>
                          <h4 className="font-display font-bold text-xs text-slate-900 mt-2">{inq.subject || 'Product Query'}</h4>
                        </div>
                        <span className={`text-[9px] font-mono px-2 py-0.5 rounded-full ${
                          inq.status === 'unread' ? 'bg-red-50 text-red-600 font-bold' : 'bg-slate-200 text-slate-700'
                        }`}>
                          {inq.status}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-500 mt-2 line-clamp-1">{inq.message}</p>
                      <div className="text-[10px] text-slate-400 font-mono mt-3 flex justify-between items-center">
                        <span>From: {inq.name} ({inq.companyName || 'General'})</span>
                        <span>{new Date(inq.createdAt).toLocaleDateString()}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Right Side: Compliance Activity Audit Log */}
              <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-custom-sm">
                <div className="flex justify-between items-center mb-6">
                  <h3 className="font-display text-md font-bold text-slate-900">Regulatory Audit Logs</h3>
                  <span className="text-[9px] font-mono bg-teal-50 text-teal-700 px-2 py-0.5 rounded">IMMUTABLE BATCH FEED</span>
                </div>
                <div className="space-y-4 max-h-[350px] overflow-y-auto pr-1">
                  {logs.map((log) => (
                    <div key={log.id} className="border-l-2 border-teal-500 pl-3 py-1 space-y-1">
                      <p className="text-xs font-semibold text-slate-800 leading-tight">{log.action}</p>
                      <div className="text-[10px] text-slate-400 font-mono flex justify-between">
                        <span>{log.userEmail.split('@')[0]}</span>
                        <span>{new Date(log.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

            </div>
          </div>
        )}

        {/* SECTION 2: PRODUCTS MONOGRAPH CMS */}
        {activeSection === 'products' && (
          <div className="space-y-6 fade-in-up">
            <div className="flex justify-between items-center pb-4 border-b border-slate-200">
              <div>
                <h1 className="font-display text-2xl font-bold text-slate-900">Products & Formulations CMS</h1>
                <p className="text-xs text-slate-500 mt-1">Review existing clinical monographs or spawn new active formulation dossiers.</p>
              </div>
              
              <div className="flex space-x-3">
                <button
                  onClick={() => setProductsTab('view')}
                  className={`px-3 py-1.5 rounded text-xs font-semibold tracking-wide uppercase transition-all ${
                    productsTab === 'view' ? 'bg-slate-900 text-white' : 'bg-white border text-slate-600'
                  }`}
                >
                  View Listings ({filteredProducts.length})
                </button>
                <button
                  onClick={triggerNewProduct}
                  className={`px-3 py-1.5 rounded text-xs font-semibold tracking-wide uppercase transition-all flex items-center space-x-1 ${
                    productsTab === 'edit' ? 'bg-teal-600 text-white' : 'bg-teal-50 text-teal-700 border border-teal-200'
                  }`}
                >
                  <Plus className="h-4 w-4" />
                  <span>{editingProduct?.id ? 'Edit Form' : 'Add Product'}</span>
                </button>
              </div>
            </div>

            {/* DUAL-TAB SCREEN 1: VIEW PRODUCTS LIST */}
            {productsTab === 'view' && (
              <div className="space-y-4">
                {/* Product Search & Filter Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 bg-white p-4 rounded-xl border border-slate-200">
                  <div>
                    <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1 font-mono">Keyword Search</label>
                    <input
                      type="text"
                      placeholder="Search active ingredient..."
                      value={productSearch}
                      onChange={(e) => setProductSearch(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-300 rounded px-3 py-1.5 text-xs focus:outline-none focus:ring-1 focus:ring-teal-500"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1 font-mono">Therapeutic Class Filter</label>
                    <select
                      value={productCatFilter}
                      onChange={(e) => setProductCatFilter(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-300 rounded px-3 py-1.5 text-xs focus:outline-none focus:ring-1 focus:ring-teal-500"
                    >
                      <option value="all">All Categories</option>
                      {categories.map((cat) => (
                        <option key={cat.id} value={cat.id}>{cat.name}</option>
                      ))}
                    </select>
                  </div>
                  <div className="flex items-end justify-end">
                    <span className="text-[11px] font-mono text-slate-400">Showing {filteredProducts.length} of {products.length} records</span>
                  </div>
                </div>

                {/* Table of Monographs */}
                <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-custom-sm">
                  <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                      <thead>
                        <tr className="bg-slate-900 text-slate-200 text-[10px] font-mono uppercase tracking-wider border-b border-slate-800">
                          <th className="p-4 w-28 text-center">Display Order</th>
                          <th className="p-4">Product Name (Brand & Generic)</th>
                          <th className="p-4">Product Group (Category)</th>
                          <th className="p-4">Strength & Packaging</th>
                          <th className="p-4">Visibility Status</th>
                          <th className="p-4 text-right">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-150 text-xs">
                        {filteredProducts.map((p, idx) => (
                          <tr
                            key={p.id}
                            draggable={!isReadOnly}
                            onDragStart={() => setDraggedProductIdx(idx)}
                            onDragOver={(e) => e.preventDefault()}
                            onDrop={() => handleProductDrop(idx)}
                            className="hover:bg-slate-50 transition-colors cursor-move"
                            title="Drag this row up or down to reorder"
                          >
                            <td className="p-4 text-center">
                              <div className="flex items-center justify-center space-x-2">
                                <span className="text-xs font-bold text-slate-400 font-mono">#{idx + 1}</span>
                                <div className="flex flex-col">
                                  <button
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      handleMoveProduct(idx, 'up');
                                    }}
                                    disabled={isReadOnly || idx === 0}
                                    className="p-0.5 hover:text-teal-600 disabled:opacity-30 disabled:hover:text-slate-400 text-slate-400"
                                    title="Move up"
                                  >
                                    ▲
                                  </button>
                                  <button
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      handleMoveProduct(idx, 'down');
                                    }}
                                    disabled={isReadOnly || idx === filteredProducts.length - 1}
                                    className="p-0.5 hover:text-teal-600 disabled:opacity-30 disabled:hover:text-slate-400 text-slate-400"
                                    title="Move down"
                                  >
                                    ▼
                                  </button>
                                </div>
                              </div>
                            </td>
                            <td className="p-4">
                              <div className="font-bold text-slate-900">{p.brandName}</div>
                              <div className="text-[10px] font-mono text-slate-500 italic mt-0.5">{p.genericName}</div>
                            </td>
                            <td className="p-4 text-slate-600">
                              {categories.find((c) => c.id === p.categoryId)?.name || 'Formulation'}
                            </td>
                            <td className="p-4 text-slate-600">
                              <div>{p.strength}</div>
                              <div className="text-[10px] text-slate-400 font-light mt-0.5">{p.packaging}</div>
                            </td>
                            <td className="p-4">
                              <span className={`px-2 py-0.5 rounded-full text-[10px] font-mono ${
                                p.status === 'published' ? 'bg-teal-50 text-teal-700 font-bold' : 'bg-amber-50 text-amber-700'
                              }`}>
                                {p.status === 'published' ? 'Published' : p.status}
                              </span>
                            </td>
                            <td className="p-4 text-right space-x-2">
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  triggerEditProduct(p);
                                }}
                                className="p-1.5 hover:bg-slate-200 text-slate-600 rounded hover:text-slate-900"
                                title="Edit monograph content"
                              >
                                <Edit className="h-3.5 w-3.5" />
                              </button>
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleProductDelete(p.id);
                                }}
                                disabled={isReadOnly}
                                className="p-1.5 hover:bg-red-100 text-slate-400 rounded hover:text-red-600 disabled:opacity-40"
                                title="Dispose record"
                              >
                                <Trash2 className="h-3.5 w-3.5" />
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}

            {/* DUAL-TAB SCREEN 2: EDIT/ADD PRODUCT WITH GEMINI COPILOT */}
            {productsTab === 'edit' && editingProduct && (
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 bg-white rounded-xl border border-slate-200 p-6 shadow-custom-md">
                
                {/* Left Forms section */}
                <form onSubmit={handleProductSaveSubmit} className="lg:col-span-2 space-y-4">
                  <h3 className="font-display font-bold text-slate-900 border-b border-slate-100 pb-2">
                    {editingProduct.id ? 'Edit Product Details' : 'Add New Product'}
                  </h3>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1 font-mono">Product Group</label>
                      <select
                        required
                        value={editingProduct.categoryId}
                        onChange={(e) => setEditingProduct({ ...editingProduct, categoryId: e.target.value })}
                        className="w-full bg-slate-50 border border-slate-300 rounded px-2.5 py-1.5 text-xs focus:outline-none focus:ring-1 focus:ring-teal-500"
                      >
                        {categories.map((cat) => (
                          <option key={cat.id} value={cat.id}>{cat.name}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1 font-mono">Visibility Status</label>
                      <select
                        value={editingProduct.status}
                        onChange={(e) => setEditingProduct({ ...editingProduct, status: e.target.value as any })}
                        className="w-full bg-slate-50 border border-slate-300 rounded px-2.5 py-1.5 text-xs focus:outline-none focus:ring-1 focus:ring-teal-500"
                      >
                        <option value="draft">Draft (Hidden from Public)</option>
                        <option value="published">Published (Visible on Public Pages)</option>
                        <option value="archived">Archived</option>
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1 font-mono">Active Chemical Name (Generic)</label>
                      <input
                        type="text"
                        required
                        placeholder="E.g., Amlodipine Besylate"
                        value={editingProduct.genericName}
                        onChange={(e) => setEditingProduct({ ...editingProduct, genericName: e.target.value })}
                        className="w-full bg-slate-50 border border-slate-300 rounded px-2.5 py-1.5 text-xs focus:outline-none focus:ring-1 focus:ring-teal-500 font-semibold"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1 font-mono">Product Brand Name</label>
                      <input
                        type="text"
                        required
                        placeholder="E.g., PRODUCT-5"
                        value={editingProduct.brandName}
                        onChange={(e) => setEditingProduct({ ...editingProduct, brandName: e.target.value })}
                        className="w-full bg-slate-50 border border-slate-300 rounded px-2.5 py-1.5 text-xs focus:outline-none focus:ring-1 focus:ring-teal-500"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1 font-mono">Strength</label>
                      <input
                        type="text"
                        required
                        placeholder="E.g., 5 mg"
                        value={editingProduct.strength}
                        onChange={(e) => setEditingProduct({ ...editingProduct, strength: e.target.value })}
                        className="w-full bg-slate-50 border border-slate-300 rounded px-2.5 py-1.5 text-xs focus:outline-none focus:ring-1 focus:ring-teal-500"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1 font-mono">Package Details</label>
                      <input
                        type="text"
                        placeholder="E.g., 10 x 10 ALU-ALU blister cartons"
                        value={editingProduct.packaging}
                        onChange={(e) => setEditingProduct({ ...editingProduct, packaging: e.target.value })}
                        className="w-full bg-slate-50 border border-slate-300 rounded px-2.5 py-1.5 text-xs focus:outline-none focus:ring-1 focus:ring-teal-500"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1 font-mono">Product Ingredients</label>
                    <input
                      type="text"
                      placeholder="E.g., Each film-coated tablet contains Amlodipine Besylate equivalent to..."
                      value={editingProduct.composition}
                      onChange={(e) => setEditingProduct({ ...editingProduct, composition: e.target.value })}
                      className="w-full bg-slate-50 border border-slate-300 rounded px-2.5 py-1.5 text-xs focus:outline-none focus:ring-1 focus:ring-teal-500 font-mono"
                    />
                  </div>

                  {/* 4 Multi-line fields */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1 font-mono">Usage Instructions (Indications)</label>
                      <textarea
                        rows={3}
                        value={editingProduct.indications}
                        onChange={(e) => setEditingProduct({ ...editingProduct, indications: e.target.value })}
                        className="w-full bg-slate-50 border border-slate-300 rounded px-2.5 py-1.5 text-xs focus:outline-none focus:ring-1 focus:ring-teal-500"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1 font-mono">Warnings & Risks</label>
                      <textarea
                        rows={3}
                        value={editingProduct.contraindications}
                        onChange={(e) => setEditingProduct({ ...editingProduct, contraindications: e.target.value })}
                        className="w-full bg-slate-50 border border-slate-300 rounded px-2.5 py-1.5 text-xs focus:outline-none focus:ring-1 focus:ring-teal-500"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1 font-mono">Standard Dose</label>
                      <textarea
                        rows={3}
                        value={editingProduct.dosage}
                        onChange={(e) => setEditingProduct({ ...editingProduct, dosage: e.target.value })}
                        className="w-full bg-slate-50 border border-slate-300 rounded px-2.5 py-1.5 text-xs focus:outline-none focus:ring-1 focus:ring-teal-500"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1 font-mono">Common Side Effects</label>
                      <textarea
                        rows={3}
                        value={editingProduct.sideEffects}
                        onChange={(e) => setEditingProduct({ ...editingProduct, sideEffects: e.target.value })}
                        className="w-full bg-slate-50 border border-slate-300 rounded px-2.5 py-1.5 text-xs focus:outline-none focus:ring-1 focus:ring-teal-500"
                      />
                    </div>
                  </div>

                  {/* Multi-Image Upload Section */}
                  <div className="bg-slate-50 p-4 rounded-lg border border-slate-200 space-y-4">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider font-mono block">Product Images (Image Slider / Carousel)</span>
                    
                    {/* Drag-and-drop / selector area */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-[10px] text-slate-500 mb-1">Upload Multiple Images</label>
                        <div
                          onDragOver={(e) => { e.preventDefault(); e.stopPropagation(); }}
                          onDrop={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
                              handleProductImagesFiles(e.dataTransfer.files);
                            }
                          }}
                          className="border border-dashed border-slate-300 rounded-lg p-4 bg-white hover:border-teal-500 transition-colors flex flex-col items-center justify-center cursor-pointer relative"
                        >
                          <input
                            type="file"
                            multiple
                            accept="image/*"
                            onChange={(e) => {
                              if (e.target.files) {
                                handleProductImagesFiles(e.target.files);
                              }
                            }}
                            className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
                          />
                          <p className="text-xs text-slate-500 font-medium text-center">Click to upload images</p>
                          <p className="text-[10px] text-slate-400 text-center mt-1">PNG, JPG, WebP up to 5MB each</p>
                        </div>
                      </div>

                      {/* Manual Carousel Slider Preview */}
                      <div>
                        <label className="block text-[10px] text-slate-500 mb-1">Image Carousel Preview (Manual-Only Sliding)</label>
                        <div className="relative h-28 bg-slate-950 rounded-lg overflow-hidden border border-slate-200">
                          {editingProduct.images && editingProduct.images.length > 0 ? (
                            <ProductImagePreviewSlider images={editingProduct.images} onImageClick={(img) => setFullScreenImageUrl(img)} />
                          ) : (
                            <div className="h-full flex items-center justify-center text-slate-400 text-xs italic bg-slate-100">
                              No images to preview
                            </div>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Image thumbnails grid for reordering/management */}
                    {editingProduct.images && editingProduct.images.length > 0 ? (
                      <div className="space-y-2">
                        <label className="block text-[10px] text-slate-500 font-mono">Manage Uploaded Images ({editingProduct.images.length}) <span className="text-teal-600 font-bold font-sans animate-pulse ml-2">[Drag Thumbnails to Reorder]</span></label>
                        <div className="grid grid-cols-3 sm:grid-cols-5 gap-3">
                          {editingProduct.images.map((img, idx) => (
                            <div
                              key={idx}
                              draggable={!isReadOnly}
                              onDragStart={() => setDraggedProductImgIdx(idx)}
                              onDragOver={(e) => e.preventDefault()}
                              onDrop={() => handleProductImgDrop(idx)}
                              className="relative group aspect-square rounded-lg border border-slate-200 overflow-hidden bg-white cursor-move hover:border-teal-500 hover:shadow-md transition-all duration-150"
                              title="Drag to reorder"
                            >
                              <img
                                src={getImgSrc(img, 'thumbnail')}
                                alt={getImgAlt(img, `Product thumbnail ${idx + 1}`)}
                                title={getImgTitle(img, 'Drag to reorder / Click to preview full-size')}
                                onClick={() => setFullScreenImageUrl(img)}
                                className="w-full h-full object-cover cursor-zoom-in hover:opacity-90 transition-opacity"
                              />
                              <button
                                type="button"
                                onClick={() => handleRemoveProductImage(idx)}
                                className="absolute top-1 right-1 bg-red-600 hover:bg-red-700 text-white p-1 rounded-full text-xs shadow opacity-0 group-hover:opacity-100 transition-opacity z-10"
                                title="Delete image"
                              >
                                &times;
                              </button>
                              <span className="absolute bottom-1 left-1 bg-black/60 text-white px-1.5 py-0.5 rounded text-[9px] font-mono select-none">
                                #{idx + 1}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    ) : (
                      <p className="text-[11px] text-slate-400 italic">No custom images uploaded. The system will fall back to dynamic placeholders.</p>
                    )}
                  </div>

                  {/* SEO Coordinates */}
                  <div className="bg-slate-50 p-4 rounded-lg border border-slate-200 space-y-3">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider font-mono block">Search Engine Settings (SEO)</span>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-[9px] text-slate-500 mb-0.5">Page Title</label>
                        <input
                          type="text"
                          value={editingProduct.seoTitle}
                          onChange={(e) => setEditingProduct({ ...editingProduct, seoTitle: e.target.value })}
                          className="w-full bg-white border border-slate-300 rounded px-2.5 py-1 text-xs"
                        />
                      </div>
                      <div>
                        <label className="block text-[9px] text-slate-500 mb-0.5">Search Summary</label>
                        <input
                          type="text"
                          value={editingProduct.seoDesc}
                          onChange={(e) => setEditingProduct({ ...editingProduct, seoDesc: e.target.value })}
                          className="w-full bg-white border border-slate-300 rounded px-2.5 py-1 text-xs"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-between pt-4 border-t border-slate-100">
                    <button
                      type="button"
                      onClick={() => setProductsTab('view')}
                      className="bg-slate-200 hover:bg-slate-300 text-slate-700 text-xs font-semibold px-4 py-2 rounded"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={isReadOnly || submitting}
                      className="bg-teal-600 hover:bg-teal-500 text-white text-xs font-bold px-6 py-2 rounded shadow disabled:opacity-50"
                    >
                      {submitting ? 'Storing Batch...' : 'Store Monograph Dossier'}
                    </button>
                  </div>
                </form>
              </div>
            )}
          </div>
        )}

        {/* SECTION 3: CRM INQUIRIES & LEADS */}
        {activeSection === 'inquiries' && (
          <div className="space-y-6 fade-in-up">
            <div>
              <h1 className="font-display text-2xl font-bold text-slate-900">CRM Leads & Global Queries</h1>
              <p className="text-xs text-slate-500 mt-1">Review incoming distributor requests, product monographs queries, or corporate partnership transmissions.</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Left Column: List of inquiries */}
              <div className="lg:col-span-2 space-y-4">
                <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-custom-sm">
                  <div className="p-4 bg-slate-900 text-white font-mono text-[10px] uppercase tracking-wider font-bold">Inquiry Pipeline Queue</div>
                  <div className="divide-y divide-slate-150">
                    {inquiries.map((inq) => (
                      <div
                        key={inq.id}
                        onClick={() => {
                          setSelectedInquiry(inq);
                          setInquiryStatus(inq.status);
                          setInquiryNotes(inq.notes || '');
                        }}
                        className={`p-4 transition duration-150 cursor-pointer flex items-center justify-between ${
                          selectedInquiry?.id === inq.id ? 'bg-teal-50/70 border-l-4 border-teal-500' : 'hover:bg-slate-50/50'
                        }`}
                      >
                        <div className="space-y-1">
                          <div className="flex items-center space-x-2">
                            <span className={`text-[9px] font-mono font-bold uppercase px-2 py-0.5 rounded ${
                              inq.type === 'distributor' ? 'bg-amber-100 text-amber-800' : 'bg-slate-100 text-slate-800'
                            }`}>
                              {inq.type}
                            </span>
                            <span className="text-xs font-bold text-slate-950 truncate max-w-[150px]">{inq.subject || 'Product Query'}</span>
                          </div>
                          <div className="text-[11px] text-slate-400">From: {inq.name} ({inq.companyName || 'General'})</div>
                        </div>

                        <div className="flex items-center space-x-4">
                          <span className={`text-[9px] font-mono px-2 py-0.5 rounded-full ${
                            inq.status === 'unread' ? 'bg-red-50 text-red-600 font-bold' : 'bg-slate-200 text-slate-700'
                          }`}>
                            {inq.status}
                          </span>
                          <ChevronRight className="h-4 w-4 text-slate-400" />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Right Column: Active Details Form & Action Panel */}
              <div>
                {selectedInquiry ? (
                  <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-custom-md space-y-4">
                    <h3 className="font-display font-bold text-slate-900 border-b border-slate-150 pb-2 flex items-center">
                      <Inbox className="h-5 w-5 text-teal-600 mr-2" /> Inquiry Monograph Info
                    </h3>

                    <div className="space-y-2 text-xs">
                      <div>
                        <span className="text-slate-400">Sender name:</span>
                        <div className="font-semibold text-slate-900">{selectedInquiry.name}</div>
                      </div>
                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <span className="text-slate-400">Corporate Email:</span>
                          <div className="font-mono text-slate-900 break-all">{selectedInquiry.email}</div>
                        </div>
                        <div>
                          <span className="text-slate-400">Phone:</span>
                          <div className="font-mono text-slate-900">{selectedInquiry.phone || 'None'}</div>
                        </div>
                      </div>
                      <div>
                        <span className="text-slate-400">Organization:</span>
                        <div className="font-semibold text-slate-900">{selectedInquiry.companyName || 'General Individual'}</div>
                      </div>
                      {selectedInquiry.productBrandName && (
                        <div className="p-2 bg-teal-50 rounded border border-teal-100 font-mono text-[10px] text-teal-800">
                          <strong>Target Product:</strong> {selectedInquiry.productBrandName}
                        </div>
                      )}
                      <div className="pt-2 border-t border-slate-100">
                        <span className="text-slate-400">Message content:</span>
                        <p className="mt-1 p-3 bg-slate-50 rounded border text-slate-700 font-light italic leading-relaxed whitespace-pre-wrap">
                          "{selectedInquiry.message}"
                        </p>
                      </div>
                    </div>

                    <form onSubmit={handleInquiryUpdateSubmit} className="space-y-4 pt-4 border-t border-slate-150">
                      <div>
                        <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1 font-mono">Inquiry Status</label>
                        <select
                          value={inquiryStatus}
                          onChange={(e) => setInquiryStatus(e.target.value as any)}
                          className="w-full bg-slate-50 border border-slate-300 rounded px-2 py-1 text-xs focus:outline-none"
                        >
                          <option value="unread">Unread / New</option>
                          <option value="read">Reviewed / Pending Response</option>
                          <option value="closed">Completed / Closed File</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1 font-mono">Internal Staff Notes</label>
                        <textarea
                          rows={3}
                          value={inquiryNotes}
                          onChange={(e) => setInquiryNotes(e.target.value)}
                          placeholder="Write internal team directives or actions here..."
                          className="w-full bg-slate-50 border border-slate-300 rounded px-2.5 py-1.5 text-xs focus:outline-none focus:ring-1 focus:ring-teal-500"
                        />
                      </div>

                      <div className="flex justify-end space-x-2">
                        <button
                          type="button"
                          onClick={() => setSelectedInquiry(null)}
                          className="bg-slate-200 hover:bg-slate-300 text-slate-700 text-[11px] font-semibold px-3 py-1.5 rounded"
                        >
                          Cancel
                        </button>
                        <button
                          type="submit"
                          disabled={isReadOnly || submitting}
                          className="bg-teal-600 hover:bg-teal-500 text-white text-[11px] font-bold px-4 py-1.5 rounded disabled:opacity-50"
                        >
                          {submitting ? 'Saving...' : 'Update Records'}
                        </button>
                      </div>
                    </form>
                  </div>
                ) : (
                  <div className="bg-white border border-slate-200 rounded-xl p-8 text-center text-slate-400 flex flex-col items-center justify-center h-64 shadow-custom-sm">
                    <MessageSquare className="h-10 w-10 text-slate-300 mb-3 animate-bounce" />
                    <h4 className="text-xs font-bold">Select Inquiry File</h4>
                    <p className="text-[11px] text-slate-500 mt-1">Select an inquiry from the pipeline on the left to review dossier documents, write notes, or close the file.</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* SECTION 4: CANDIDATES & APPLICATIONS */}
        {activeSection === 'applications' && (
          <div className="space-y-6 fade-in-up">
            <div>
              <h1 className="font-display text-2xl font-bold text-slate-900">Candidates & Dossiers Portal</h1>
              <p className="text-xs text-slate-500 mt-1">Review applicant CVs, professional licensing references, and manage interview schedules.</p>
            </div>

            <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-custom-sm">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-slate-900 text-slate-200 text-[10px] font-mono uppercase tracking-wider border-b border-slate-800">
                      <th className="p-4">Candidate Information</th>
                      <th className="p-4">Applied Role / Job ID</th>
                      <th className="p-4">Simulated Attachment</th>
                      <th className="p-4">Status Badges</th>
                      <th className="p-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-150 text-xs">
                    {applications.map((app) => (
                      <tr key={app.id} className="hover:bg-slate-50/50 transition-colors">
                        <td className="p-4">
                          <div className="font-bold text-slate-900">{app.name}</div>
                          <div className="text-[10px] font-mono text-slate-500 mt-0.5">{app.email} | {app.phone}</div>
                          <div className="text-[11px] text-slate-500 italic mt-2 p-2 bg-slate-50 rounded border border-slate-100">
                            "{app.coverLetter || 'No cover note submitted.'}"
                          </div>
                        </td>
                        <td className="p-4 text-slate-700">
                          <div className="font-semibold">{app.jobTitle}</div>
                          <div className="text-[10px] font-mono text-slate-400 mt-0.5">Job ID: {app.jobId}</div>
                        </td>
                        <td className="p-4 text-slate-600 font-mono text-[11px] flex items-center mt-3">
                          <FileText className="h-4 w-4 text-rose-500 mr-1.5 shrink-0" />
                          <span className="underline cursor-pointer hover:text-slate-900">{app.resumeName}</span>
                        </td>
                        <td className="p-4">
                          <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-mono uppercase font-bold ${
                            app.status === 'new'
                              ? 'bg-blue-50 text-blue-700'
                              : app.status === 'shortlisted'
                              ? 'bg-emerald-50 text-emerald-700'
                              : app.status === 'reviewed'
                              ? 'bg-indigo-50 text-indigo-700'
                              : 'bg-rose-50 text-rose-700'
                          }`}>
                            {app.status}
                          </span>
                        </td>
                        <td className="p-4 text-right space-y-2">
                          <div className="flex flex-col space-y-1 items-end">
                            <button
                              onClick={() => handleAppStatusChange(app.id, 'shortlisted')}
                              disabled={isReadOnly}
                              className="text-[10px] font-mono bg-teal-50 text-teal-700 border border-teal-200 rounded px-2.5 py-1 font-bold hover:bg-teal-100 disabled:opacity-40"
                            >
                              Shortlist
                            </button>
                            <button
                              onClick={() => handleAppStatusChange(app.id, 'reviewed')}
                              disabled={isReadOnly}
                              className="text-[10px] font-mono bg-slate-100 text-slate-700 border border-slate-200 rounded px-2.5 py-1 hover:bg-slate-200 disabled:opacity-40"
                            >
                              Mark Reviewed
                            </button>
                            <button
                              onClick={() => handleAppStatusChange(app.id, 'rejected')}
                              disabled={isReadOnly}
                              className="text-[10px] font-mono bg-red-50 text-red-700 border border-red-100 rounded px-2.5 py-1 hover:bg-red-100 disabled:opacity-40"
                            >
                              Reject
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* SECTION 5: JOB OPENINGS CMS */}
        {activeSection === 'jobs' && (
          <div className="space-y-6 fade-in-up">
            <div className="flex justify-between items-center pb-4 border-b border-slate-200">
              <div>
                <h1 className="font-display text-2xl font-bold text-slate-900">Careers & Opportunities CMS</h1>
                <p className="text-xs text-slate-500 mt-1">Formulate job opening postings, edit clinical job descriptions, and close listings.</p>
              </div>

              <div className="flex space-x-3">
                <button
                  onClick={() => setJobsTab('view')}
                  className={`px-3 py-1.5 rounded text-xs font-semibold tracking-wide uppercase transition-all ${
                    jobsTab === 'view' ? 'bg-slate-900 text-white' : 'bg-white border text-slate-600'
                  }`}
                >
                  View Listings ({jobs.length})
                </button>
                <button
                  onClick={triggerNewJob}
                  className={`px-3 py-1.5 rounded text-xs font-semibold tracking-wide uppercase transition-all flex items-center space-x-1 ${
                    jobsTab === 'edit' ? 'bg-teal-600 text-white' : 'bg-teal-50 text-teal-700 border border-teal-200'
                  }`}
                >
                  <Plus className="h-4 w-4" />
                  <span>{editingJob?.id ? 'Edit Form' : 'Post Job'}</span>
                </button>
              </div>
            </div>

            {/* DUAL-TAB SCREEN 1: LISTING */}
            {jobsTab === 'view' && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {jobs.map((job) => (
                  <div key={job.id} className="bg-white border border-slate-200 rounded-xl p-5 shadow-custom-sm flex flex-col justify-between h-full">
                    <div>
                      <div className="flex justify-between items-start">
                        <span className="text-[9px] font-mono font-bold uppercase tracking-wider text-teal-600 bg-teal-50 px-2 py-0.5 rounded">
                          {job.employmentType}
                        </span>
                        <span className={`text-[9px] font-mono uppercase font-bold px-2 py-0.5 rounded-full ${
                          job.status === 'open' ? 'bg-emerald-50 text-emerald-600' : 'bg-slate-200 text-slate-600'
                        }`}>
                          {job.status}
                        </span>
                      </div>
                      <h3 className="font-display text-md font-bold text-slate-900 mt-3">{job.title}</h3>
                      <div className="text-[10px] font-mono text-slate-400 mt-0.5">{job.department}</div>
                      <p className="text-xs text-slate-600 mt-3 line-clamp-3 leading-relaxed font-light">{job.description}</p>
                    </div>

                    <div className="border-t border-slate-100 pt-4 mt-5 flex items-center justify-between">
                      <span className="text-xs text-slate-500 font-mono">{job.location}</span>
                      <button
                        onClick={() => triggerEditJob(job)}
                        className="text-teal-600 hover:text-teal-700 text-xs font-bold uppercase tracking-wider flex items-center hover:underline"
                      >
                        <Edit className="h-3.5 w-3.5 mr-1" /> Edit Post
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* DUAL-TAB SCREEN 2: POST/EDIT FORM */}
            {jobsTab === 'edit' && editingJob && (
              <form onSubmit={handleJobSaveSubmit} className="bg-white rounded-xl border border-slate-200 p-6 shadow-custom-md max-w-2xl space-y-4">
                <h3 className="font-display text-lg font-bold text-slate-900 border-b border-slate-100 pb-2">
                  {editingJob.id ? 'Modify Active Job Posting' : 'Register New Corporate Opportunity'}
                </h3>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1 font-mono">Job Title</label>
                    <input
                      type="text"
                      required
                      placeholder="E.g., Senior QA Specialist"
                      value={editingJob.title}
                      onChange={(e) => setEditingJob({ ...editingJob, title: e.target.value })}
                      className="w-full bg-slate-50 border border-slate-300 rounded px-2.5 py-1.5 text-xs focus:outline-none focus:ring-1 focus:ring-teal-500"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1 font-mono">Department</label>
                    <input
                      type="text"
                      required
                      placeholder="E.g., Quality Control & Assurances"
                      value={editingJob.department}
                      onChange={(e) => setEditingJob({ ...editingJob, department: e.target.value })}
                      className="w-full bg-slate-50 border border-slate-300 rounded px-2.5 py-1.5 text-xs focus:outline-none focus:ring-1 focus:ring-teal-500"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1 font-mono">Work Location</label>
                    <input
                      type="text"
                      required
                      placeholder="E.g., Formulation Plant Alpha"
                      value={editingJob.location}
                      onChange={(e) => setEditingJob({ ...editingJob, location: e.target.value })}
                      className="w-full bg-slate-50 border border-slate-300 rounded px-2.5 py-1.5 text-xs focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1 font-mono">Employment Type</label>
                    <select
                      value={editingJob.employmentType}
                      onChange={(e) => setEditingJob({ ...editingJob, employmentType: e.target.value as any })}
                      className="w-full bg-slate-50 border border-slate-300 rounded px-2.5 py-1.5 text-xs focus:outline-none"
                    >
                      <option value="Full-time">Full-time Employee</option>
                      <option value="Contract">Contract / Consultant</option>
                      <option value="Part-time">Part-time</option>
                      <option value="Remote">Remote</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1 font-mono">Listing Status</label>
                    <select
                      value={editingJob.status}
                      onChange={(e) => setEditingJob({ ...editingJob, status: e.target.value as any })}
                      className="w-full bg-slate-50 border border-slate-300 rounded px-2.5 py-1.5 text-xs focus:outline-none"
                    >
                      <option value="open">Active / Accepting Applications</option>
                      <option value="closed">Closed / Suspended</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1 font-mono">Job Description & Professional Compliance Guidelines</label>
                  <textarea
                    rows={6}
                    required
                    placeholder="Describe duties, educational profiles, and required pharmaceutical GMP background..."
                    value={editingJob.description}
                    onChange={(e) => setEditingJob({ ...editingJob, description: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-300 rounded px-2.5 py-1.5 text-xs focus:outline-none focus:ring-1 focus:ring-teal-500"
                  />
                </div>

                <div className="flex justify-between pt-4 border-t border-slate-100">
                  <button
                    type="button"
                    onClick={() => setJobsTab('view')}
                    className="bg-slate-200 hover:bg-slate-300 text-slate-700 text-xs font-semibold px-4 py-2 rounded"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isReadOnly || submitting}
                    className="bg-teal-600 hover:bg-teal-500 text-white text-xs font-bold px-6 py-2 rounded shadow disabled:opacity-50"
                  >
                    {submitting ? 'Storing...' : 'Save Job Posting'}
                  </button>
                </div>
              </form>
            )}
          </div>
        )}

        {/* SECTION 5A: THERAPEUTIC CATEGORIES CMS */}
        {activeSection === 'categories' && (
          <div className="space-y-6 fade-in-up">
            <div className="flex justify-between items-center pb-4 border-b border-slate-200">
              <div>
                <h1 className="font-display text-2xl font-bold text-slate-900">Manage Categories</h1>
                <p className="text-xs text-slate-500 mt-1">Create, edit, and delete product categories.</p>
              </div>

              <div className="flex space-x-3">
                <button
                  onClick={() => setCategoriesTab('view')}
                  className={`px-3 py-1.5 rounded text-xs font-semibold tracking-wide uppercase transition-all ${
                    categoriesTab === 'view' ? 'bg-slate-900 text-white' : 'bg-white border text-slate-600'
                  }`}
                >
                  View Categories ({categories.length})
                </button>
                <button
                  onClick={triggerNewCategory}
                  className={`px-3 py-1.5 rounded text-xs font-semibold tracking-wide uppercase transition-all flex items-center space-x-1 ${
                    categoriesTab === 'edit' ? 'bg-teal-600 text-white' : 'bg-teal-50 text-teal-700 border border-teal-200'
                  }`}
                >
                  <Plus className="h-4 w-4" />
                  <span>{editingCategory?.id ? 'Edit Category' : 'Add Category'}</span>
                </button>
              </div>
            </div>

            {categoriesTab === 'view' && (
              <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-custom-sm">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-slate-900 text-slate-200 text-[10px] font-mono uppercase tracking-wider border-b border-slate-800">
                      <th className="p-4">Category Name</th>
                      <th className="p-4">Description</th>
                      <th className="p-4">Number of Products</th>
                      <th className="p-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-150 text-xs">
                    {categories.map((cat) => (
                      <tr key={cat.id} className="hover:bg-slate-50/50 transition-colors">
                        <td className="p-4 font-bold text-slate-900">{cat.name}</td>
                        <td className="p-4 text-slate-600">{cat.description}</td>
                        <td className="p-4 font-mono text-slate-500">{products.filter(p => p.categoryId === cat.id).length} products</td>
                        <td className="p-4 text-right space-x-2">
                          <button
                            onClick={() => triggerEditCategory(cat)}
                            className="p-1.5 hover:bg-slate-200 text-slate-600 rounded hover:text-slate-900"
                            title="Edit"
                          >
                            <Edit className="h-3.5 w-3.5" />
                          </button>
                          <button
                            onClick={() => handleCategoryDelete(cat.id)}
                            disabled={isReadOnly}
                            className="p-1.5 hover:bg-red-100 text-slate-400 rounded hover:text-red-600 disabled:opacity-40"
                            title="Delete"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {categoriesTab === 'edit' && editingCategory && (
              <form onSubmit={handleCategorySaveSubmit} className="bg-white rounded-xl border border-slate-200 p-6 shadow-custom-md max-w-xl space-y-4">
                <h3 className="font-display text-lg font-bold text-slate-900 border-b border-slate-100 pb-2">
                  {editingCategory.id ? 'Edit Category' : 'Add New Category'}
                </h3>
                <div>
                  <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1 font-mono">Category Name</label>
                  <input
                    type="text"
                    required
                    placeholder="E.g., Cardiovascular Agents"
                    value={editingCategory.name}
                    onChange={(e) => setEditingCategory({ ...editingCategory, name: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-300 rounded px-2.5 py-1.5 text-xs focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1 font-mono">Description</label>
                  <textarea
                    rows={4}
                    required
                    placeholder="E.g., Medicines for blood pressure regulation and heart support."
                    value={editingCategory.description}
                    onChange={(e) => setEditingCategory({ ...editingCategory, description: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-300 rounded px-2.5 py-1.5 text-xs focus:outline-none"
                  />
                </div>
                <div className="flex justify-between pt-4 border-t border-slate-100">
                  <button
                    type="button"
                    onClick={() => setCategoriesTab('view')}
                    className="bg-slate-200 hover:bg-slate-300 text-slate-700 text-xs font-semibold px-4 py-2 rounded"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isReadOnly || submitting}
                    className="bg-teal-600 hover:bg-teal-500 text-white text-xs font-bold px-6 py-2 rounded shadow disabled:opacity-50"
                  >
                    {submitting ? 'Saving...' : 'Save Category'}
                  </button>
                </div>
              </form>
            )}
          </div>
        )}

        {/* SECTION 5B: QUALITY CERTIFICATIONS CMS */}
        {activeSection === 'certifications' && (
          <div className="space-y-6 fade-in-up">
            <div className="flex justify-between items-center pb-4 border-b border-slate-200">
              <div>
                <h1 className="font-display text-2xl font-bold text-slate-900">Manage Certifications</h1>
                <p className="text-xs text-slate-500 mt-1">Create, edit, and delete quality certificates.</p>
              </div>

              <div className="flex space-x-3">
                <button
                  onClick={() => setCertsTab('view')}
                  className={`px-3 py-1.5 rounded text-xs font-semibold tracking-wide uppercase transition-all ${
                    certsTab === 'view' ? 'bg-slate-900 text-white' : 'bg-white border text-slate-600'
                  }`}
                >
                  View Certificates ({certifications.length})
                </button>
                <button
                  onClick={triggerNewCert}
                  className={`px-3 py-1.5 rounded text-xs font-semibold tracking-wide uppercase transition-all flex items-center space-x-1 ${
                    certsTab === 'edit' ? 'bg-teal-600 text-white' : 'bg-teal-50 text-teal-700 border border-teal-200'
                  }`}
                >
                  <Plus className="h-4 w-4" />
                  <span>{editingCert?.id ? 'Edit Certificate' : 'Add Certificate'}</span>
                </button>
              </div>
            </div>

            {certsTab === 'view' && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {certifications.map((cert) => (
                  <div key={cert.id} className="bg-white border border-slate-200 rounded-xl p-5 shadow-custom-sm flex flex-col justify-between h-full">
                    <div>
                      <div className="flex justify-between items-start">
                        <span className="text-[9px] font-mono font-bold uppercase tracking-wider text-teal-600 bg-teal-50 px-2 py-0.5 rounded">
                          Year: {cert.year}
                        </span>
                        <div className="space-x-2">
                          <button
                            onClick={() => triggerEditCert(cert)}
                            className="text-xs text-slate-600 hover:text-slate-900 inline-flex items-center font-semibold"
                          >
                            <Edit className="h-3.5 w-3.5 mr-1" /> Edit
                          </button>
                          <button
                            onClick={() => handleCertDelete(cert.id)}
                            disabled={isReadOnly}
                            className="text-xs text-slate-400 hover:text-red-600 inline-flex items-center disabled:opacity-40 ml-2"
                          >
                            <Trash2 className="h-3.5 w-3.5 mr-1" /> Delete
                          </button>
                        </div>
                      </div>
                      <h3 className="font-display text-md font-bold text-slate-900 mt-3">{cert.name}</h3>
                      <div className="text-[10px] font-mono text-slate-400 mt-0.5 font-semibold">Issued By: {cert.issuer}</div>
                      <p className="text-xs text-slate-600 mt-3 leading-relaxed font-light">{cert.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {certsTab === 'edit' && editingCert && (
              <form onSubmit={handleCertSaveSubmit} className="bg-white rounded-xl border border-slate-200 p-6 shadow-custom-md max-w-xl space-y-4">
                <h3 className="font-display text-lg font-bold text-slate-900 border-b border-slate-100 pb-2">
                  {editingCert.id ? 'Edit Certificate' : 'Add New Certificate'}
                </h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1 font-mono">Certificate Name</label>
                    <input
                      type="text"
                      required
                      placeholder="E.g., EU-GMP Formulation Suite Certification"
                      value={editingCert.name}
                      onChange={(e) => setEditingCert({ ...editingCert, name: e.target.value })}
                      className="w-full bg-slate-50 border border-slate-300 rounded px-2.5 py-1.5 text-xs focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1 font-mono">Issued By</label>
                    <input
                      type="text"
                      required
                      placeholder="E.g., European Medicines Agency"
                      value={editingCert.issuer}
                      onChange={(e) => setEditingCert({ ...editingCert, issuer: e.target.value })}
                      className="w-full bg-slate-50 border border-slate-300 rounded px-2.5 py-1.5 text-xs focus:outline-none"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1 font-mono">Certificate Type</label>
                    <select
                      value={editingCert.type}
                      onChange={(e) => setEditingCert({ ...editingCert, type: e.target.value as any })}
                      className="w-full bg-slate-50 border border-slate-300 rounded px-2.5 py-1.5 text-xs focus:outline-none"
                    >
                      <option value="GMP">GMP</option>
                      <option value="WHO-GMP">WHO-GMP</option>
                      <option value="ISO">ISO</option>
                      <option value="FDA">FDA</option>
                      <option value="FSSAI">FSSAI</option>
                      <option value="CE">CE</option>
                      <option value="MSME">MSME</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1 font-mono">Year Certified</label>
                    <input
                      type="number"
                      required
                      placeholder="E.g., 2026"
                      value={editingCert.year}
                      onChange={(e) => setEditingCert({ ...editingCert, year: parseInt(e.target.value) || new Date().getFullYear() })}
                      className="w-full bg-slate-50 border border-slate-300 rounded px-2.5 py-1.5 text-xs focus:outline-none"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1 font-mono">Scope of Certificate</label>
                  <textarea
                    rows={4}
                    required
                    placeholder="Describe the scope and details of this certificate..."
                    value={editingCert.description}
                    onChange={(e) => setEditingCert({ ...editingCert, description: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-300 rounded px-2.5 py-1.5 text-xs focus:outline-none"
                  />
                </div>
                <div className="flex justify-between pt-4 border-t border-slate-100">
                  <button
                    type="button"
                    onClick={() => setCertsTab('view')}
                    className="bg-slate-200 hover:bg-slate-300 text-slate-700 text-xs font-semibold px-4 py-2 rounded"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isReadOnly || submitting}
                    className="bg-teal-600 hover:bg-teal-500 text-white text-xs font-bold px-6 py-2 rounded shadow disabled:opacity-50"
                  >
                    {submitting ? 'Saving...' : 'Save Certificate'}
                  </button>
                </div>
              </form>
            )}
          </div>
        )}

        {/* SECTION 5C: MANUFACTURING FACILITIES CMS */}
        {activeSection === 'facilities' && (
          <div className="space-y-6 fade-in-up">
            <div className="flex justify-between items-center pb-4 border-b border-slate-200">
              <div>
                <h1 className="font-display text-2xl font-bold text-slate-900">Manage Facilities</h1>
                <p className="text-xs text-slate-500 mt-1">Create, edit, and delete manufacturing facilities.</p>
              </div>

              <div className="flex space-x-3">
                <button
                  onClick={() => setFacilitiesTab('view')}
                  className={`px-3 py-1.5 rounded text-xs font-semibold tracking-wide uppercase transition-all ${
                    facilitiesTab === 'view' ? 'bg-slate-900 text-white' : 'bg-white border text-slate-600'
                  }`}
                >
                  View Facilities ({facilities.length})
                </button>
                <button
                  onClick={triggerNewFacility}
                  className={`px-3 py-1.5 rounded text-xs font-semibold tracking-wide uppercase transition-all flex items-center space-x-1 ${
                    facilitiesTab === 'edit' ? 'bg-teal-600 text-white' : 'bg-teal-50 text-teal-700 border border-teal-200'
                  }`}
                >
                  <Plus className="h-4 w-4" />
                  <span>{editingFacility?.id ? 'Edit Facility' : 'Add Facility'}</span>
                </button>
              </div>
            </div>

            {facilitiesTab === 'view' && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {facilities.map((fac) => (
                  <div key={fac.id} className="bg-white border border-slate-200 rounded-xl p-5 shadow-custom-sm flex flex-col justify-between h-full">
                    <div>
                      <div className="flex justify-between items-start">
                        <span className="text-[9px] font-mono font-bold uppercase tracking-wider text-teal-600 bg-teal-50 px-2 py-0.5 rounded">
                          {fac.type}
                        </span>
                        <div className="space-x-2">
                          <button
                            onClick={() => triggerEditFacility(fac)}
                            className="text-xs text-slate-600 hover:text-slate-900 inline-flex items-center font-semibold"
                          >
                            <Edit className="h-3.5 w-3.5 mr-1" /> Edit
                          </button>
                          <button
                            onClick={() => handleFacilityDelete(fac.id)}
                            disabled={isReadOnly}
                            className="text-xs text-slate-400 hover:text-red-600 inline-flex items-center disabled:opacity-40 ml-2"
                          >
                            <Trash2 className="h-3.5 w-3.5 mr-1" /> Delete
                          </button>
                        </div>
                      </div>
                      <h3 className="font-display text-md font-bold text-slate-900 mt-3">{fac.name}</h3>
                      <div className="text-[10px] font-mono text-slate-400 mt-0.5">{fac.location}</div>
                      <p className="text-xs text-slate-600 mt-3 font-light leading-relaxed">
                        <strong>Daily Capacity:</strong> {fac.capacity || 'Unspecified Output Capacity'}
                      </p>
                      <p className="text-xs text-slate-500 mt-1 font-sans font-light">{fac.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {facilitiesTab === 'edit' && editingFacility && (
              <form onSubmit={handleFacilitySaveSubmit} className="bg-white rounded-xl border border-slate-200 p-6 shadow-custom-md max-w-xl space-y-4">
                <h3 className="font-display text-lg font-bold text-slate-900 border-b border-slate-100 pb-2">
                  {editingFacility.id ? 'Edit Facility' : 'Add New Facility'}
                </h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1 font-mono">Facility Name</label>
                    <input
                      type="text"
                      required
                      placeholder="E.g., Sterile Suite IV"
                      value={editingFacility.name}
                      onChange={(e) => setEditingFacility({ ...editingFacility, name: e.target.value })}
                      className="w-full bg-slate-50 border border-slate-300 rounded px-2.5 py-1.5 text-xs focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1 font-mono">Facility Location</label>
                    <input
                      type="text"
                      required
                      placeholder="E.g., Industrial Sector Alpha, Block C"
                      value={editingFacility.location}
                      onChange={(e) => setEditingFacility({ ...editingFacility, location: e.target.value })}
                      className="w-full bg-slate-50 border border-slate-300 rounded px-2.5 py-1.5 text-xs focus:outline-none"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1 font-mono">Facility Type</label>
                    <input
                      type="text"
                      required
                      placeholder="E.g., Production Suite"
                      value={editingFacility.type}
                      onChange={(e) => setEditingFacility({ ...editingFacility, type: e.target.value })}
                      className="w-full bg-slate-50 border border-slate-300 rounded px-2.5 py-1.5 text-xs focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1 font-mono">Daily Product Capacity</label>
                    <input
                      type="text"
                      required
                      placeholder="E.g., 5.5 Million Vials per Day"
                      value={editingFacility.capacity}
                      onChange={(e) => setEditingFacility({ ...editingFacility, capacity: e.target.value })}
                      className="w-full bg-slate-50 border border-slate-300 rounded px-2.5 py-1.5 text-xs focus:outline-none"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1 font-mono">Description / Notes</label>
                    <input
                      type="text"
                      required
                      placeholder="E.g., Certified facility with cleanroom features."
                      value={editingFacility.description}
                      onChange={(e) => setEditingFacility({ ...editingFacility, description: e.target.value })}
                      className="w-full bg-slate-50 border border-slate-300 rounded px-2.5 py-1.5 text-xs focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1 font-mono">Image URL (Optional)</label>
                    <input
                      type="text"
                      placeholder="E.g., /assets/images/cleanroom_4.jpg"
                      value={editingFacility.imageUrl || ''}
                      onChange={(e) => setEditingFacility({ ...editingFacility, imageUrl: e.target.value })}
                      className="w-full bg-slate-50 border border-slate-300 rounded px-2.5 py-1.5 text-xs focus:outline-none font-mono"
                    />
                  </div>
                </div>
                <div className="flex justify-between pt-4 border-t border-slate-100">
                  <button
                    type="button"
                    onClick={() => setFacilitiesTab('view')}
                    className="bg-slate-200 hover:bg-slate-300 text-slate-700 text-xs font-semibold px-4 py-2 rounded"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isReadOnly || submitting}
                    className="bg-teal-600 hover:bg-teal-500 text-white text-xs font-bold px-6 py-2 rounded shadow disabled:opacity-50"
                  >
                    {submitting ? 'Saving...' : 'Save Facility'}
                  </button>
                </div>
              </form>
            )}
          </div>
        )}

        {/* SECTION 6: GLOBAL SETTINGS */}
        {activeSection === 'settings' && (
          <div className="space-y-6 fade-in-up">
            <div>
              <h1 className="font-display text-2xl font-bold text-slate-900">Global Site Coordinates</h1>
              <p className="text-xs text-slate-500 mt-1">Modify global corporate registries (CIN, drug license codes), headquarters addresses, and contact email logs.</p>
            </div>

            <form onSubmit={handleSettingsSaveSubmit} className="bg-white rounded-xl border border-slate-200 p-6 shadow-custom-md max-w-3xl space-y-4">
              <h3 className="font-display text-lg font-bold text-slate-900 border-b border-slate-100 pb-2">Global Corporate settings</h3>

              {!hasSettingsAccess && (
                <div className="bg-amber-50 text-amber-800 text-[11px] p-3 rounded border border-amber-200">
                  <strong>Notice:</strong> Your current role has read-only viewer permissions for settings. To execute changes, login as a Super Admin.
                </div>
              )}

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1 font-mono">Company Legal Name</label>
                  <input
                    type="text"
                    required
                    disabled={!hasSettingsAccess}
                    value={settingsForm.companyName}
                    onChange={(e) => setSettingsForm({ ...settingsForm, companyName: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-300 rounded px-2.5 py-1.5 text-xs focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1 font-mono">Brand Tagline</label>
                  <input
                    type="text"
                    required
                    disabled={!hasSettingsAccess}
                    value={settingsForm.tagline}
                    onChange={(e) => setSettingsForm({ ...settingsForm, tagline: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-300 rounded px-2.5 py-1.5 text-xs focus:outline-none"
                  />
                </div>
              </div>

              <div className="mt-4 pt-4 border-t border-slate-100/50">
                <h4 className="text-xs font-bold text-slate-700 uppercase font-mono tracking-widest mb-3">SEO & Metadata</h4>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1 font-mono">SEO Title</label>
                    <input
                      type="text"
                      disabled={!hasSettingsAccess}
                      value={settingsForm.seoTitle || ''}
                      onChange={(e) => setSettingsForm({ ...settingsForm, seoTitle: e.target.value })}
                      className="w-full bg-slate-50 border border-slate-300 rounded px-2.5 py-1.5 text-xs focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1 font-mono">SEO Description</label>
                    <input
                      type="text"
                      disabled={!hasSettingsAccess}
                      value={settingsForm.seoDesc || ''}
                      onChange={(e) => setSettingsForm({ ...settingsForm, seoDesc: e.target.value })}
                      className="w-full bg-slate-50 border border-slate-300 rounded px-2.5 py-1.5 text-xs focus:outline-none"
                    />
                  </div>
                </div>
              </div>

              <div className="mt-4 pt-4 border-t border-slate-100/50">
                <h4 className="text-xs font-bold text-slate-700 uppercase font-mono tracking-widest mb-3">Section Titles</h4>
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1 font-mono">About Subtitle</label>
                    <input
                      type="text"
                      disabled={!hasSettingsAccess}
                      value={settingsForm.aboutSubtitle || ''}
                      onChange={(e) => setSettingsForm({ ...settingsForm, aboutSubtitle: e.target.value })}
                      className="w-full bg-slate-50 border border-slate-300 rounded px-2.5 py-1.5 text-xs focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1 font-mono">Facilities Title</label>
                    <input
                      type="text"
                      disabled={!hasSettingsAccess}
                      value={settingsForm.facilitiesTitle || ''}
                      onChange={(e) => setSettingsForm({ ...settingsForm, facilitiesTitle: e.target.value })}
                      className="w-full bg-slate-50 border border-slate-300 rounded px-2.5 py-1.5 text-xs focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1 font-mono">Media Showcase Title</label>
                    <input
                      type="text"
                      disabled={!hasSettingsAccess}
                      value={settingsForm.mediaShowcaseTitle || ''}
                      onChange={(e) => setSettingsForm({ ...settingsForm, mediaShowcaseTitle: e.target.value })}
                      className="w-full bg-slate-50 border border-slate-300 rounded px-2.5 py-1.5 text-xs focus:outline-none"
                    />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1 font-mono">Dossier Response Email</label>
                  <input
                    type="email"
                    required
                    disabled={!hasSettingsAccess}
                    value={settingsForm.contactEmail}
                    onChange={(e) => setSettingsForm({ ...settingsForm, contactEmail: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-300 rounded px-2.5 py-1.5 text-xs focus:outline-none font-mono"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1 font-mono">Switchboard Phone</label>
                  <input
                    type="text"
                    required
                    disabled={!hasSettingsAccess}
                    value={settingsForm.contactPhone}
                    onChange={(e) => setSettingsForm({ ...settingsForm, contactPhone: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-300 rounded px-2.5 py-1.5 text-xs focus:outline-none font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1 font-mono">Headquarters Physical Address</label>
                <input
                  type="text"
                  required
                  disabled={!hasSettingsAccess}
                  value={settingsForm.address}
                  onChange={(e) => setSettingsForm({ ...settingsForm, address: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-300 rounded px-2.5 py-1.5 text-xs focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1 font-mono">CIN Registration Code</label>
                  <input
                    type="text"
                    required
                    disabled={!hasSettingsAccess}
                    value={settingsForm.registrationNumber}
                    onChange={(e) => setSettingsForm({ ...settingsForm, registrationNumber: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-300 rounded px-2.5 py-1.5 text-xs focus:outline-none font-mono"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1 font-mono">Drug License Numbers</label>
                  <input
                    type="text"
                    required
                    disabled={!hasSettingsAccess}
                    value={settingsForm.drugLicenseNumber}
                    onChange={(e) => setSettingsForm({ ...settingsForm, drugLicenseNumber: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-300 rounded px-2.5 py-1.5 text-xs focus:outline-none font-mono"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1 font-mono">GST Identification Number</label>
                  <input
                    type="text"
                    required
                    disabled={!hasSettingsAccess}
                    value={settingsForm.gstNumber}
                    onChange={(e) => setSettingsForm({ ...settingsForm, gstNumber: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-300 rounded px-2.5 py-1.5 text-xs focus:outline-none font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1 font-mono">Google Maps Embed URL</label>
                  <input
                    type="text"
                    required
                    disabled={!hasSettingsAccess}
                    value={settingsForm.mapEmbedUrl}
                    onChange={(e) => setSettingsForm({ ...settingsForm, mapEmbedUrl: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-300 rounded px-2.5 py-1.5 text-xs focus:outline-none font-mono"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1 font-mono">Google Analytics (GA4) ID</label>
                  <input
                    type="text"
                    disabled={!hasSettingsAccess}
                    value={settingsForm.gaId || ''}
                    onChange={(e) => setSettingsForm({ ...settingsForm, gaId: e.target.value })}
                    placeholder="E.g., G-XXXXXX"
                    className="w-full bg-slate-50 border border-slate-300 rounded px-2.5 py-1.5 text-xs focus:outline-none font-mono"
                  />
                </div>
              </div>

              {/* Brand Logo Upload Module */}
              <div className="border-t border-slate-100 pt-4 mt-6">
                <h4 className="text-xs font-bold text-teal-600 uppercase tracking-wider mb-3 font-mono">Corporate Logo & Identity</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-slate-50 p-4 rounded-xl border border-slate-200">
                  
                  {/* Upload & Manual URL Controls */}
                  <div className="space-y-4">
                    <div>
                      <span className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1.5 font-mono">Upload Brand Logo</span>
                      
                      {/* Drag-and-Drop Area */}
                      <div
                        onDragEnter={handleLogoDrag}
                        onDragOver={handleLogoDrag}
                        onDragLeave={handleLogoDrag}
                        onDrop={handleLogoDrop}
                        className={`relative border-2 border-dashed rounded-xl p-6 text-center transition duration-150 group cursor-pointer ${
                          !hasSettingsAccess ? 'bg-slate-100 border-slate-200 cursor-not-allowed opacity-60' :
                          logoDragActive ? 'border-teal-500 bg-teal-50/50' : 'border-slate-300 hover:border-teal-500 bg-white'
                        }`}
                        onClick={() => {
                          if (hasSettingsAccess) {
                            document.getElementById('logo-file-input')?.click();
                          }
                        }}
                      >
                        <input
                          id="logo-file-input"
                          type="file"
                          accept="image/*"
                          disabled={!hasSettingsAccess}
                          onChange={handleLogoFileChange}
                          className="hidden"
                        />
                        <Upload className={`h-8 w-8 mx-auto mb-2 transition duration-150 ${
                          logoDragActive ? 'text-teal-600 animate-pulse' : 'text-slate-400 group-hover:text-teal-500'
                        }`} />
                        <p className="text-xs font-semibold text-slate-700">
                          Drag & drop your logo here, or <span className="text-teal-600 group-hover:underline">browse</span>
                        </p>
                        <p className="text-[10px] text-slate-400 mt-1">Supports PNG, JPEG, SVG, WebP (Max 5MB)</p>
                      </div>

                      {logoUploadError && (
                        <p className="text-[11px] text-red-600 mt-1.5 flex items-center">
                          <XCircle className="h-3.5 w-3.5 mr-1" />
                          {logoUploadError}
                        </p>
                      )}
                    </div>

                    <div>
                      <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1 font-mono">Or Paste Logo URL Manually</label>
                      <input
                        type="text"
                        disabled={!hasSettingsAccess}
                        value={settingsForm.logoUrl || ''}
                        onChange={(e) => setSettingsForm({ ...settingsForm, logoUrl: e.target.value })}
                        placeholder="E.g., https://example.com/logo.png"
                        className="w-full bg-white border border-slate-300 rounded px-2.5 py-1.5 text-xs focus:outline-none font-mono"
                      />
                      <p className="text-[9px] text-slate-400 mt-0.5">Leave blank to default to corporate company name text.</p>
                    </div>
                  </div>

                  {/* Logo Preview & Visual States */}
                  <div className="flex flex-col justify-between">
                    <div>
                      <span className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-2 font-mono">Contrast & Placement Preview</span>
                      
                      {settingsForm.logoUrl ? (
                        <div className="space-y-3">
                          {/* Light Navbar Preview */}
                          <div>
                            <span className="text-[9px] text-slate-400 block mb-1">Public Header Mode (Light Background)</span>
                            <div className="bg-white border border-slate-200 rounded-lg p-4 flex items-center justify-center h-16 relative group/preview shadow-sm">
                              <img
                                src={getImgSrc(settingsForm.logoUrl, 'medium')}
                                alt={getImgAlt(settingsForm.logoUrl, 'Logo Preview Light')}
                                title={getImgTitle(settingsForm.logoUrl, 'Logo Preview Light')}
                                className="h-8 max-w-[200px] object-contain"
                                referrerPolicy="no-referrer"
                              />
                            </div>
                          </div>

                          {/* Dark Mode Preview */}
                          <div>
                            <span className="text-[9px] text-slate-400 block mb-1">Admin Header Mode / Footer (Dark Slate Background)</span>
                            <div className="bg-slate-950 rounded-lg p-4 flex items-center justify-center h-16 relative shadow-inner">
                              <img
                                src={getImgSrc(settingsForm.logoUrl, 'medium')}
                                alt={getImgAlt(settingsForm.logoUrl, 'Logo Preview Dark')}
                                title={getImgTitle(settingsForm.logoUrl, 'Logo Preview Dark')}
                                className="h-8 max-w-[200px] object-contain"
                                referrerPolicy="no-referrer"
                              />
                            </div>
                          </div>
                        </div>
                      ) : (
                        <div className="border border-slate-200 rounded-xl bg-white p-6 text-center flex flex-col items-center justify-center h-36">
                          <Image className="h-8 w-8 text-slate-300 mb-2" />
                          <p className="text-xs text-slate-400 italic">No brand logo uploaded yet.</p>
                          <p className="text-[10px] text-slate-400 mt-1 font-light">The portal header will render your corporate text legal name in display typography.</p>
                        </div>
                      )}
                    </div>

                    {settingsForm.logoUrl && hasSettingsAccess && (
                      <button
                        type="button"
                        onClick={() => setSettingsForm({ ...settingsForm, logoUrl: '' })}
                        className="mt-4 inline-flex items-center justify-center px-3 py-1.5 border border-slate-200 text-xs font-semibold rounded text-red-600 hover:bg-red-50 hover:border-red-100 transition duration-150 font-mono"
                      >
                        <Trash2 className="h-3.5 w-3.5 mr-1" />
                        Discharge Logo
                      </button>
                    )}
                  </div>

                </div>
              </div>

              {/* Social Media Links Row */}
              <div className="border-t border-slate-100 pt-4 mt-6">
                <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3 font-mono">Social Coordinate Registries</h4>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1 font-mono">LinkedIn URL</label>
                    <input
                      type="text"
                      disabled={!hasSettingsAccess}
                      value={settingsForm.socialLinks?.linkedin || ''}
                      onChange={(e) => setSettingsForm({
                        ...settingsForm,
                        socialLinks: { ...(settingsForm.socialLinks || {}), linkedin: e.target.value }
                      })}
                      placeholder="https://linkedin.com/..."
                      className="w-full bg-slate-50 border border-slate-300 rounded px-2.5 py-1.5 text-xs focus:outline-none font-mono"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1 font-mono">Twitter/X URL</label>
                    <input
                      type="text"
                      disabled={!hasSettingsAccess}
                      value={settingsForm.socialLinks?.twitter || ''}
                      onChange={(e) => setSettingsForm({
                        ...settingsForm,
                        socialLinks: { ...(settingsForm.socialLinks || {}), twitter: e.target.value }
                      })}
                      placeholder="https://twitter.com/..."
                      className="w-full bg-slate-50 border border-slate-300 rounded px-2.5 py-1.5 text-xs focus:outline-none font-mono"
                    />
                  </div>
                </div>
              </div>

              {/* BRANDING & HERO CUSTOMIZATION */}
              <div className="border-t border-slate-100 pt-4 mt-6">
                <h4 className="text-xs font-bold text-teal-600 uppercase tracking-wider mb-3">Homepage Branding & Hero Canvas</h4>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1 font-mono">Compliance Badge Text</label>
                    <input
                      type="text"
                      disabled={!hasSettingsAccess}
                      value={settingsForm.complianceBadgeText || ''}
                      onChange={(e) => setSettingsForm({ ...settingsForm, complianceBadgeText: e.target.value })}
                      className="w-full bg-slate-50 border border-slate-300 rounded px-2.5 py-1.5 text-xs focus:outline-none"
                      placeholder="E.g., WHO-GMP & USFDA ALIGNED COMPLIANCE"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1 font-mono">Hero Bold Title</label>
                    <input
                      type="text"
                      disabled={!hasSettingsAccess}
                      value={settingsForm.heroTitle || ''}
                      onChange={(e) => setSettingsForm({ ...settingsForm, heroTitle: e.target.value })}
                      className="w-full bg-slate-50 border border-slate-300 rounded px-2.5 py-1.5 text-xs focus:outline-none"
                      placeholder="E.g., Precision Pharmaceutical Formulation"
                    />
                  </div>
                </div>
                <div className="mt-4">
                  <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1 font-mono">Hero Description Copy</label>
                  <textarea
                    rows={2}
                    disabled={!hasSettingsAccess}
                    value={settingsForm.heroDescription || ''}
                    onChange={(e) => setSettingsForm({ ...settingsForm, heroDescription: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-300 rounded px-2.5 py-1.5 text-xs focus:outline-none"
                    placeholder="Describe the main corporate facilities, sterile filling suites, or general pipeline mission..."
                  />
                </div>

                {/* HERO BACKGROUND CAROUSEL / SLIDER */}
                <div className="mt-4 border-t border-slate-100 pt-3 bg-slate-50/70 p-4 rounded-lg border border-slate-150">
                  <div className="flex items-center justify-between mb-3 pb-1 border-b border-slate-100">
                    <div className="flex items-center space-x-2">
                      <Image className="h-4 w-4 text-teal-600" />
                      <h5 className="text-xs font-bold text-slate-700 uppercase tracking-wider font-mono">Hero Background Image Slider & Carousel</h5>
                    </div>
                    <div className="flex items-center space-x-2">
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          disabled={!hasSettingsAccess}
                          checked={settingsForm.enableHeroSlider || false}
                          onChange={(e) => setSettingsForm({ ...settingsForm, enableHeroSlider: e.target.checked })}
                          className="sr-only peer"
                        />
                        <div className="w-9 h-5 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-teal-600"></div>
                        <span className="ml-2 text-[10px] font-bold text-slate-500 uppercase font-mono">
                          {settingsForm.enableHeroSlider ? "Enabled" : "Disabled"}
                        </span>
                      </label>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1 font-mono">Slider Rotation Interval (milliseconds)</label>
                      <input
                        type="number"
                        disabled={!hasSettingsAccess}
                        min={1000}
                        step={500}
                        value={settingsForm.heroSliderInterval || 5000}
                        onChange={(e) => setSettingsForm({ ...settingsForm, heroSliderInterval: parseInt(e.target.value) || 5000 })}
                        className="w-full bg-white border border-slate-300 rounded px-2.5 py-1.5 text-xs focus:outline-none font-mono"
                        placeholder="E.g., 5000 for 5 seconds"
                      />
                      <p className="text-[9px] text-slate-400 mt-1">Specify duration to display each background image before transitioning.</p>
                    </div>

                    <div className="flex items-end justify-start">
                      <button
                        type="button"
                        disabled={!hasSettingsAccess}
                        onClick={handleLoadDefaultSlides}
                        className="inline-flex items-center justify-center px-3 py-1.5 border border-slate-200 bg-white text-xs font-semibold rounded text-teal-600 hover:bg-teal-50 hover:border-teal-100 transition duration-150 font-mono shadow-sm"
                      >
                        <RefreshCcw className="h-3.5 w-3.5 mr-1" />
                        Load Default Pharma Slides
                      </button>
                    </div>
                  </div>

                  {/* Eye-Safe Clinical Readability Overlay Options */}
                  <div className="mt-4 pt-3 border-t border-slate-150/60 grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <div className="flex items-center justify-between mb-1.5">
                        <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider font-mono">Eye-Safe Clinical Readability Overlay</label>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input
                            type="checkbox"
                            disabled={!hasSettingsAccess}
                            checked={settingsForm.enableHeroOverlay !== false}
                            onChange={(e) => setSettingsForm({ ...settingsForm, enableHeroOverlay: e.target.checked })}
                            className="sr-only peer"
                          />
                          <div className="w-8 h-4 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-3 after:w-3 after:transition-all peer-checked:bg-teal-600"></div>
                        </label>
                      </div>
                      <p className="text-[9px] text-slate-400 leading-relaxed">Adds progressive slate-colored optical lenses and anti-glare linear gradient overlays to guarantee perfect reading contrast of clinical details over any backdrops.</p>
                    </div>

                    <div>
                      <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1 font-mono">Overlay Filtering Strength</label>
                      <select
                        disabled={!hasSettingsAccess || settingsForm.enableHeroOverlay === false}
                        value={settingsForm.heroOverlayStrength || 'dark'}
                        onChange={(e) => setSettingsForm({ ...settingsForm, heroOverlayStrength: e.target.value as any })}
                        className="w-full bg-white border border-slate-300 rounded px-2.5 py-1.5 text-xs focus:outline-none font-mono disabled:bg-slate-100 disabled:text-slate-400"
                      >
                        <option value="light">Light Slate Lens (70% opacity mix-blend-multiply)</option>
                        <option value="medium">Medium Slate Lens (85% opacity mix-blend-multiply)</option>
                        <option value="dark">Standard Dark Lens (Optimized Multi-Layered Slate Overlay)</option>
                        <option value="heavy">Heavy Polarized Lens (High-Contrast Severe Glare Mitigation)</option>
                      </select>
                      <p className="text-[9px] text-slate-400 mt-1">Select the filter intensity required for compliance with visual access standards.</p>
                    </div>
                  </div>

                  {/* Slides Manager */}
                  <div className="mt-4 border-t border-slate-150/50 pt-3">
                    <span className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-2 font-mono">Manage Active Carousel Images <span className="text-teal-600 font-bold font-sans animate-pulse ml-2">[Drag Rows to Reorder]</span></span>
                    
                    {settingsForm.heroSlides && settingsForm.heroSlides.length > 0 ? (
                      <div className="space-y-2 mb-4 max-h-60 overflow-y-auto pr-1">
                        {settingsForm.heroSlides.map((slide, idx) => (
                          <div
                            key={idx}
                            draggable={hasSettingsAccess}
                            onDragStart={() => setDraggedHeroSlideIdx(idx)}
                            onDragOver={(e) => e.preventDefault()}
                            onDrop={() => handleHeroSlideDrop(idx)}
                            className="flex items-center justify-between p-2 bg-white rounded border border-slate-200 hover:border-slate-300 shadow-sm transition cursor-move hover:bg-slate-50/80"
                            title="Drag row to reorder slide"
                          >
                            <div className="flex items-center space-x-3 overflow-hidden">
                              <span className="text-xs font-bold text-slate-400 font-mono w-4">{idx + 1}</span>
                              <div className="h-10 w-16 bg-slate-100 rounded border border-slate-200 overflow-hidden flex-shrink-0">
                                <img src={getImgSrc(slide, 'thumbnail')} alt={getImgAlt(slide, `Slide ${idx + 1}`)} className="h-full w-full object-cover" referrerPolicy="no-referrer" />
                              </div>
                              <span className="text-[10px] font-mono text-slate-500 truncate max-w-xs sm:max-w-md">
                                {slide.startsWith('{"') ? `Optimized Image [ALT: "${getImgAlt(slide)}"]` : slide.startsWith('data:') ? `Uploaded File (${Math.round(slide.length / 1024)} KB)` : slide}
                              </span>
                            </div>

                            <div className="flex items-center space-x-1.5 flex-shrink-0">
                              <button
                                type="button"
                                disabled={!hasSettingsAccess || idx === 0}
                                onClick={() => handleMoveSlide(idx, 'up')}
                                className="p-1 hover:bg-slate-100 rounded border border-transparent disabled:opacity-30 disabled:hover:bg-transparent text-slate-500 transition"
                                title="Move Slide Up"
                              >
                                <span className="text-[10px] font-bold font-mono px-0.5">▲</span>
                              </button>
                              <button
                                type="button"
                                disabled={!hasSettingsAccess || idx === (settingsForm.heroSlides?.length || 0) - 1}
                                onClick={() => handleMoveSlide(idx, 'down')}
                                className="p-1 hover:bg-slate-100 rounded border border-transparent disabled:opacity-30 disabled:hover:bg-transparent text-slate-500 transition"
                                title="Move Slide Down"
                              >
                                <span className="text-[10px] font-bold font-mono px-0.5">▼</span>
                              </button>
                              <button
                                type="button"
                                disabled={!hasSettingsAccess}
                                onClick={() => handleRemoveSlide(idx)}
                                className="p-1 hover:bg-red-50 hover:text-red-600 rounded text-slate-400 transition"
                                title="Delete Slide"
                              >
                                <Trash2 className="h-3.5 w-3.5" />
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="border border-dashed border-slate-200 rounded-lg bg-white p-6 text-center mb-4">
                        <Image className="h-8 w-8 text-slate-300 mx-auto mb-1.5" />
                        <p className="text-xs text-slate-400 italic">No slider images uploaded.</p>
                        <p className="text-[10px] text-slate-400 mt-0.5 font-light">The banner will use standard modern dark slate fallback background.</p>
                      </div>
                    )}

                    {/* Upload / Add Area */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 bg-white p-3 rounded-lg border border-slate-200">
                      <div>
                        <span className="block text-[9px] font-bold text-slate-400 uppercase font-mono mb-1.5">Upload Multiple Background Images</span>
                        <div
                          onDragEnter={handleSlidesDrag}
                          onDragOver={handleSlidesDrag}
                          onDragLeave={handleSlidesDrag}
                          onDrop={handleSlidesDrop}
                          onClick={() => {
                            if (hasSettingsAccess) {
                              document.getElementById('slide-files-input')?.click();
                            }
                          }}
                          className={`border-2 border-dashed rounded-lg p-4 text-center cursor-pointer transition group/slide ${
                            slidesDragActive
                              ? 'border-teal-500 bg-teal-50/50'
                              : 'border-slate-200 hover:border-teal-400 hover:bg-slate-50/50'
                          }`}
                        >
                          <input
                            id="slide-files-input"
                            type="file"
                            multiple
                            accept="image/*"
                            disabled={!hasSettingsAccess}
                            onChange={handleSlidesFileChange}
                            className="hidden"
                          />
                          <Upload className="h-5 w-5 mx-auto mb-1 text-slate-400 group-hover/slide:text-teal-500 transition" />
                          <p className="text-[11px] font-medium text-slate-600">
                            Drag & drop background images here, or <span className="text-teal-600">browse</span>
                          </p>
                          <p className="text-[9px] text-slate-400 mt-0.5">PNG, JPG, SVG, WebP (Max 5MB each)</p>
                        </div>

                        {slidesUploadError && (
                          <p className="text-[10px] text-red-600 mt-1 flex items-center">
                            <XCircle className="h-3 w-3 mr-1" />
                            {slidesUploadError}
                          </p>
                        )}
                      </div>

                      <div className="flex flex-col justify-between">
                        <div>
                          <span className="block text-[9px] font-bold text-slate-400 uppercase font-mono mb-1.5">Or Paste Direct Image URL Manually</span>
                          <input
                            type="text"
                            disabled={!hasSettingsAccess}
                            value={newSlideUrl}
                            onChange={(e) => setNewSlideUrl(e.target.value)}
                            placeholder="E.g., https://unsplash.com/.../photo-xxx.jpg"
                            className="w-full bg-slate-50 border border-slate-300 rounded px-2.5 py-1.5 text-xs focus:outline-none font-mono"
                          />
                          <p className="text-[9px] text-slate-400 mt-1">Provide external image links directly from CDN or stock directories.</p>
                        </div>
                        <button
                          type="button"
                          disabled={!hasSettingsAccess || !newSlideUrl.trim()}
                          onClick={handleAddSlideUrl}
                          className="mt-3 inline-flex items-center justify-center px-4 py-1.5 bg-teal-600 hover:bg-teal-700 disabled:opacity-40 disabled:hover:bg-teal-600 text-white text-xs font-semibold rounded transition shadow-sm font-mono"
                        >
                          <Plus className="h-3.5 w-3.5 mr-1" />
                          Inject Image URL
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mt-4 border-t border-slate-100 pt-3">
                  <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2 font-mono">Hero Trust Points (Trust Matrix)</label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                    <div>
                      <label className="block text-[8px] font-bold text-slate-400 uppercase font-mono mb-1">Trust Point 1</label>
                      <input
                        type="text"
                        disabled={!hasSettingsAccess}
                        value={settingsForm.heroTrustPoint1 || ''}
                        onChange={(e) => setSettingsForm({ ...settingsForm, heroTrustPoint1: e.target.value })}
                        className="w-full bg-slate-50 border border-slate-300 rounded px-2.5 py-1.5 text-xs focus:outline-none font-medium"
                        placeholder="Zone IV Stability Compliant"
                      />
                    </div>
                    <div>
                      <label className="block text-[8px] font-bold text-slate-400 uppercase font-mono mb-1">Trust Point 2</label>
                      <input
                        type="text"
                        disabled={!hasSettingsAccess}
                        value={settingsForm.heroTrustPoint2 || ''}
                        onChange={(e) => setSettingsForm({ ...settingsForm, heroTrustPoint2: e.target.value })}
                        className="w-full bg-slate-50 border border-slate-300 rounded px-2.5 py-1.5 text-xs focus:outline-none font-medium"
                        placeholder="eCTD Format dossiers ready"
                      />
                    </div>
                    <div>
                      <label className="block text-[8px] font-bold text-slate-400 uppercase font-mono mb-1">Trust Point 3</label>
                      <input
                        type="text"
                        disabled={!hasSettingsAccess}
                        value={settingsForm.heroTrustPoint3 || ''}
                        onChange={(e) => setSettingsForm({ ...settingsForm, heroTrustPoint3: e.target.value })}
                        className="w-full bg-slate-50 border border-slate-300 rounded px-2.5 py-1.5 text-xs focus:outline-none font-medium"
                        placeholder="HPLC Chromatogram Verified"
                      />
                    </div>
                    <div>
                      <label className="block text-[8px] font-bold text-slate-400 uppercase font-mono mb-1">Trust Point 4</label>
                      <input
                        type="text"
                        disabled={!hasSettingsAccess}
                        value={settingsForm.heroTrustPoint4 || ''}
                        onChange={(e) => setSettingsForm({ ...settingsForm, heroTrustPoint4: e.target.value })}
                        className="w-full bg-slate-50 border border-slate-300 rounded px-2.5 py-1.5 text-xs focus:outline-none font-medium"
                        placeholder="Pyrogen-Free Cleanrooms"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* QUICK METRICS CUSTOMIZATION */}
              <div className="border-t border-slate-100 pt-4 mt-6">
                <h4 className="text-xs font-bold text-teal-600 uppercase tracking-wider mb-3">Homepage Quick Performance Metrics</h4>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div>
                    <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1 font-mono">Metric 1 Value</label>
                    <input
                      type="text"
                      disabled={!hasSettingsAccess}
                      value={settingsForm.metric1Value || ''}
                      onChange={(e) => setSettingsForm({ ...settingsForm, metric1Value: e.target.value })}
                      className="w-full bg-slate-50 border border-slate-300 rounded px-2 py-1 text-xs focus:outline-none font-bold"
                    />
                    <input
                      type="text"
                      disabled={!hasSettingsAccess}
                      value={settingsForm.metric1Label || ''}
                      onChange={(e) => setSettingsForm({ ...settingsForm, metric1Label: e.target.value })}
                      className="w-full bg-slate-50 border border-slate-200 rounded px-2 py-1 text-[10px] focus:outline-none mt-1"
                      placeholder="Label"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1 font-mono">Metric 2 Value</label>
                    <input
                      type="text"
                      disabled={!hasSettingsAccess}
                      value={settingsForm.metric2Value || ''}
                      onChange={(e) => setSettingsForm({ ...settingsForm, metric2Value: e.target.value })}
                      className="w-full bg-slate-50 border border-slate-300 rounded px-2 py-1 text-xs focus:outline-none font-bold"
                    />
                    <input
                      type="text"
                      disabled={!hasSettingsAccess}
                      value={settingsForm.metric2Label || ''}
                      onChange={(e) => setSettingsForm({ ...settingsForm, metric2Label: e.target.value })}
                      className="w-full bg-slate-50 border border-slate-200 rounded px-2 py-1 text-[10px] focus:outline-none mt-1"
                      placeholder="Label"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1 font-mono">Metric 3 Value</label>
                    <input
                      type="text"
                      disabled={!hasSettingsAccess}
                      value={settingsForm.metric3Value || ''}
                      onChange={(e) => setSettingsForm({ ...settingsForm, metric3Value: e.target.value })}
                      className="w-full bg-slate-50 border border-slate-300 rounded px-2 py-1 text-xs focus:outline-none font-bold"
                    />
                    <input
                      type="text"
                      disabled={!hasSettingsAccess}
                      value={settingsForm.metric3Label || ''}
                      onChange={(e) => setSettingsForm({ ...settingsForm, metric3Label: e.target.value })}
                      className="w-full bg-slate-50 border border-slate-200 rounded px-2 py-1 text-[10px] focus:outline-none mt-1"
                      placeholder="Label"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1 font-mono">Metric 4 Value</label>
                    <input
                      type="text"
                      disabled={!hasSettingsAccess}
                      value={settingsForm.metric4Value || ''}
                      onChange={(e) => setSettingsForm({ ...settingsForm, metric4Value: e.target.value })}
                      className="w-full bg-slate-50 border border-slate-300 rounded px-2 py-1 text-xs focus:outline-none font-bold"
                    />
                    <input
                      type="text"
                      disabled={!hasSettingsAccess}
                      value={settingsForm.metric4Label || ''}
                      onChange={(e) => setSettingsForm({ ...settingsForm, metric4Label: e.target.value })}
                      className="w-full bg-slate-50 border border-slate-200 rounded px-2 py-1 text-[10px] focus:outline-none mt-1"
                      placeholder="Label"
                    />
                  </div>
                </div>
              </div>

              {/* FEATURED MONOGRAPHS CUSTOMIZATION */}
              <div className="border-t border-slate-100 pt-4 mt-6">
                <h4 className="text-xs font-bold text-teal-600 uppercase tracking-wider mb-3">Homepage Featured Monographs Copy</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1 font-mono">Classification Badge Text</label>
                    <input
                      type="text"
                      disabled={!hasSettingsAccess}
                      value={settingsForm.featuredBadgeText || ''}
                      onChange={(e) => setSettingsForm({ ...settingsForm, featuredBadgeText: e.target.value })}
                      className="w-full bg-slate-50 border border-slate-300 rounded px-2.5 py-1.5 text-xs focus:outline-none font-medium"
                      placeholder="E.g., ATC THERAPEUTIC CLASSIFICATION"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1 font-mono">Section Header Title</label>
                    <input
                      type="text"
                      disabled={!hasSettingsAccess}
                      value={settingsForm.featuredTitle || ''}
                      onChange={(e) => setSettingsForm({ ...settingsForm, featuredTitle: e.target.value })}
                      className="w-full bg-slate-50 border border-slate-300 rounded px-2.5 py-1.5 text-xs focus:outline-none font-medium"
                      placeholder="E.g., Featured Pharmaceutical Monographs"
                    />
                  </div>
                </div>
                <div className="mt-4">
                  <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1 font-mono">Section Description</label>
                  <textarea
                    rows={2}
                    disabled={!hasSettingsAccess}
                    value={settingsForm.featuredDesc || ''}
                    onChange={(e) => setSettingsForm({ ...settingsForm, featuredDesc: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-300 rounded px-2.5 py-1.5 text-xs focus:outline-none"
                    placeholder="Describe the featured products and therapeutic classifications here..."
                  />
                </div>
              </div>

              {/* REGULATORY SECTION CUSTOMIZATION */}
              <div className="border-t border-slate-100 pt-4 mt-6">
                <h4 className="text-xs font-bold text-teal-600 uppercase tracking-wider mb-3">Homepage Regulatory Highlight Section</h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1 font-mono">Stability Badge Text</label>
                    <input
                      type="text"
                      disabled={!hasSettingsAccess}
                      value={settingsForm.regulatoryBadgeText || ''}
                      onChange={(e) => setSettingsForm({ ...settingsForm, regulatoryBadgeText: e.target.value })}
                      className="w-full bg-slate-50 border border-slate-300 rounded px-2.5 py-1.5 text-xs focus:outline-none font-medium"
                      placeholder="E.g., STABILITY TESTED CLIMATIC ZONE IV"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1 font-mono">Section Title</label>
                    <input
                      type="text"
                      disabled={!hasSettingsAccess}
                      value={settingsForm.regulatoryTitle || ''}
                      onChange={(e) => setSettingsForm({ ...settingsForm, regulatoryTitle: e.target.value })}
                      className="w-full bg-slate-50 border border-slate-300 rounded px-2.5 py-1.5 text-xs focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1 font-mono">Section Description</label>
                    <input
                      type="text"
                      disabled={!hasSettingsAccess}
                      value={settingsForm.regulatoryDesc || ''}
                      onChange={(e) => setSettingsForm({ ...settingsForm, regulatoryDesc: e.target.value })}
                      className="w-full bg-slate-50 border border-slate-300 rounded px-2.5 py-1.5 text-xs focus:outline-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4 bg-slate-50 p-3 rounded border border-slate-150">
                  <div>
                    <label className="block text-[9px] font-mono font-bold text-slate-500 uppercase tracking-wide">Feature 1 Title & Desc</label>
                    <input
                      type="text"
                      disabled={!hasSettingsAccess}
                      value={settingsForm.regulatoryFeature1Title || ''}
                      onChange={(e) => setSettingsForm({ ...settingsForm, regulatoryFeature1Title: e.target.value })}
                      className="w-full bg-white border border-slate-300 rounded px-2 py-1 text-[11px] focus:outline-none font-semibold"
                    />
                    <input
                      type="text"
                      disabled={!hasSettingsAccess}
                      value={settingsForm.regulatoryFeature1Desc || ''}
                      onChange={(e) => setSettingsForm({ ...settingsForm, regulatoryFeature1Desc: e.target.value })}
                      className="w-full bg-white border border-slate-200 rounded px-2 py-1 text-[10px] focus:outline-none mt-1"
                      placeholder="Feature 1 description"
                    />
                  </div>

                  <div>
                    <label className="block text-[9px] font-mono font-bold text-slate-500 uppercase tracking-wide">Feature 2 Title & Desc</label>
                    <input
                      type="text"
                      disabled={!hasSettingsAccess}
                      value={settingsForm.regulatoryFeature2Title || ''}
                      onChange={(e) => setSettingsForm({ ...settingsForm, regulatoryFeature2Title: e.target.value })}
                      className="w-full bg-white border border-slate-300 rounded px-2 py-1 text-[11px] focus:outline-none font-semibold"
                    />
                    <input
                      type="text"
                      disabled={!hasSettingsAccess}
                      value={settingsForm.regulatoryFeature2Desc || ''}
                      onChange={(e) => setSettingsForm({ ...settingsForm, regulatoryFeature2Desc: e.target.value })}
                      className="w-full bg-white border border-slate-200 rounded px-2 py-1 text-[10px] focus:outline-none mt-1"
                      placeholder="Feature 2 description"
                    />
                  </div>

                  <div className="mt-2">
                    <label className="block text-[9px] font-mono font-bold text-slate-500 uppercase tracking-wide">Feature 3 Title & Desc</label>
                    <input
                      type="text"
                      disabled={!hasSettingsAccess}
                      value={settingsForm.regulatoryFeature3Title || ''}
                      onChange={(e) => setSettingsForm({ ...settingsForm, regulatoryFeature3Title: e.target.value })}
                      className="w-full bg-white border border-slate-300 rounded px-2 py-1 text-[11px] focus:outline-none font-semibold"
                    />
                    <input
                      type="text"
                      disabled={!hasSettingsAccess}
                      value={settingsForm.regulatoryFeature3Desc || ''}
                      onChange={(e) => setSettingsForm({ ...settingsForm, regulatoryFeature3Desc: e.target.value })}
                      className="w-full bg-white border border-slate-200 rounded px-2 py-1 text-[10px] focus:outline-none mt-1"
                      placeholder="Feature 3 description"
                    />
                  </div>

                  <div className="mt-2">
                    <label className="block text-[9px] font-mono font-bold text-slate-500 uppercase tracking-wide">Feature 4 Title & Desc</label>
                    <input
                      type="text"
                      disabled={!hasSettingsAccess}
                      value={settingsForm.regulatoryFeature4Title || ''}
                      onChange={(e) => setSettingsForm({ ...settingsForm, regulatoryFeature4Title: e.target.value })}
                      className="w-full bg-white border border-slate-300 rounded px-2 py-1 text-[11px] focus:outline-none font-semibold"
                    />
                    <input
                      type="text"
                      disabled={!hasSettingsAccess}
                      value={settingsForm.regulatoryFeature4Desc || ''}
                      onChange={(e) => setSettingsForm({ ...settingsForm, regulatoryFeature4Desc: e.target.value })}
                      className="w-full bg-white border border-slate-200 rounded px-2 py-1 text-[10px] focus:outline-none mt-1"
                      placeholder="Feature 4 description"
                    />
                  </div>
                </div>
              </div>

              {/* MOLECULAR LAB PREVIEW CUSTOMIZATION */}
              <div className="border-t border-slate-100 pt-4 mt-6">
                <h4 className="text-xs font-bold text-teal-600 uppercase tracking-wider mb-3">Molecular Lab Preview Settings</h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                  <div>
                    <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1 font-mono">Lab Section Header</label>
                    <input
                      type="text"
                      disabled={!hasSettingsAccess}
                      value={settingsForm.labTitle || ''}
                      onChange={(e) => setSettingsForm({ ...settingsForm, labTitle: e.target.value })}
                      className="w-full bg-slate-50 border border-slate-300 rounded px-2.5 py-1.5 text-xs focus:outline-none"
                      placeholder="E.g., MOLECULAR LAB PREVIEW"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1 font-mono">Sterility Telemetry Status</label>
                    <input
                      type="text"
                      disabled={!hasSettingsAccess}
                      value={settingsForm.labSterilityText || ''}
                      onChange={(e) => setSettingsForm({ ...settingsForm, labSterilityText: e.target.value })}
                      className="w-full bg-slate-50 border border-slate-300 rounded px-2.5 py-1.5 text-xs focus:outline-none"
                      placeholder="E.g., HEPA STERILITY: CLASS 100"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1 font-mono">Target Room Temp (°C)</label>
                    <input
                      type="text"
                      disabled={!hasSettingsAccess}
                      value={settingsForm.labTemperature || ''}
                      onChange={(e) => setSettingsForm({ ...settingsForm, labTemperature: e.target.value })}
                      className="w-full bg-slate-50 border border-slate-300 rounded px-2.5 py-1.5 text-xs focus:outline-none"
                      placeholder="E.g., 18.2"
                    />
                  </div>
                </div>

                <div className="space-y-4">
                  <h5 className="text-[11px] font-bold text-slate-500 uppercase tracking-wider border-b border-slate-100 pb-1 font-mono">Interactive Specimen Tabs Details</h5>

                  {/* Cardio Specimen */}
                  <div className="bg-slate-50/50 p-3 rounded border border-slate-150">
                    <span className="text-[10px] font-mono font-bold text-teal-700 uppercase">1. Cardiovascular Specimen</span>
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-3 mt-2">
                      <div>
                        <label className="block text-[9px] font-bold text-slate-400 uppercase tracking-wider mb-1 font-mono">Title</label>
                        <input
                          type="text"
                          disabled={!hasSettingsAccess}
                          value={settingsForm.labCardioTitle || ''}
                          onChange={(e) => setSettingsForm({ ...settingsForm, labCardioTitle: e.target.value })}
                          className="w-full bg-white border border-slate-300 rounded px-2.5 py-1.5 text-xs focus:outline-none"
                          placeholder="CardioVance XR Duo"
                        />
                      </div>
                      <div>
                        <label className="block text-[9px] font-bold text-slate-400 uppercase tracking-wider mb-1 font-mono">Active Ingredient</label>
                        <input
                          type="text"
                          disabled={!hasSettingsAccess}
                          value={settingsForm.labCardioActive || ''}
                          onChange={(e) => setSettingsForm({ ...settingsForm, labCardioActive: e.target.value })}
                          className="w-full bg-white border border-slate-300 rounded px-2.5 py-1.5 text-xs focus:outline-none"
                          placeholder="Amlodipine Besylate"
                        />
                      </div>
                      <div>
                        <label className="block text-[9px] font-bold text-slate-400 uppercase tracking-wider mb-1 font-mono">Empirical Formula</label>
                        <input
                          type="text"
                          disabled={!hasSettingsAccess}
                          value={settingsForm.labCardioFormula || ''}
                          onChange={(e) => setSettingsForm({ ...settingsForm, labCardioFormula: e.target.value })}
                          className="w-full bg-white border border-slate-300 rounded px-2.5 py-1.5 text-xs focus:outline-none"
                          placeholder="C20H25ClN2O5"
                        />
                      </div>
                      <div>
                        <label className="block text-[9px] font-bold text-slate-400 uppercase tracking-wider mb-1 font-mono">Status Label</label>
                        <input
                          type="text"
                          disabled={!hasSettingsAccess}
                          value={settingsForm.labCardioStatus || ''}
                          onChange={(e) => setSettingsForm({ ...settingsForm, labCardioStatus: e.target.value })}
                          className="w-full bg-white border border-slate-300 rounded px-2.5 py-1.5 text-xs focus:outline-none"
                          placeholder="API Approved"
                        />
                      </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mt-2">
                      <div>
                        <label className="block text-[9px] font-bold text-slate-400 uppercase tracking-wider mb-1 font-mono">Disintegration Rate</label>
                        <input
                          type="text"
                          disabled={!hasSettingsAccess}
                          value={settingsForm.labCardioDisintegration || ''}
                          onChange={(e) => setSettingsForm({ ...settingsForm, labCardioDisintegration: e.target.value })}
                          className="w-full bg-white border border-slate-300 rounded px-2.5 py-1.5 text-xs focus:outline-none"
                          placeholder="4.2 min (Limit < 15m)"
                        />
                      </div>
                      <div>
                        <label className="block text-[9px] font-bold text-slate-400 uppercase tracking-wider mb-1 font-mono">Chromatography Value</label>
                        <input
                          type="text"
                          disabled={!hasSettingsAccess}
                          value={settingsForm.labCardioChroma || ''}
                          onChange={(e) => setSettingsForm({ ...settingsForm, labCardioChroma: e.target.value })}
                          className="w-full bg-white border border-slate-300 rounded px-2.5 py-1.5 text-xs focus:outline-none"
                          placeholder="99.91% Purified"
                        />
                      </div>
                      <div>
                        <label className="block text-[9px] font-bold text-slate-400 uppercase tracking-wider mb-1 font-mono">Structure Subtitle</label>
                        <input
                          type="text"
                          disabled={!hasSettingsAccess}
                          value={settingsForm.labCardioStructure || ''}
                          onChange={(e) => setSettingsForm({ ...settingsForm, labCardioStructure: e.target.value })}
                          className="w-full bg-white border border-slate-300 rounded px-2.5 py-1.5 text-xs focus:outline-none"
                          placeholder="Amlodipine Besylate Ring Structure"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Antibiotic Specimen */}
                  <div className="bg-slate-50/50 p-3 rounded border border-slate-150">
                    <span className="text-[10px] font-mono font-bold text-teal-700 uppercase">2. Antibiotic Specimen</span>
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-3 mt-2">
                      <div>
                        <label className="block text-[9px] font-bold text-slate-400 uppercase tracking-wider mb-1 font-mono">Title</label>
                        <input
                          type="text"
                          disabled={!hasSettingsAccess}
                          value={settingsForm.labAntibioticTitle || ''}
                          onChange={(e) => setSettingsForm({ ...settingsForm, labAntibioticTitle: e.target.value })}
                          className="w-full bg-white border border-slate-300 rounded px-2.5 py-1.5 text-xs focus:outline-none"
                          placeholder="ZithroMax Duo"
                        />
                      </div>
                      <div>
                        <label className="block text-[9px] font-bold text-slate-400 uppercase tracking-wider mb-1 font-mono">Active Ingredient</label>
                        <input
                          type="text"
                          disabled={!hasSettingsAccess}
                          value={settingsForm.labAntibioticActive || ''}
                          onChange={(e) => setSettingsForm({ ...settingsForm, labAntibioticActive: e.target.value })}
                          className="w-full bg-white border border-slate-300 rounded px-2.5 py-1.5 text-xs focus:outline-none"
                          placeholder="Azithromycin Dihydrate"
                        />
                      </div>
                      <div>
                        <label className="block text-[9px] font-bold text-slate-400 uppercase tracking-wider mb-1 font-mono">Empirical Formula</label>
                        <input
                          type="text"
                          disabled={!hasSettingsAccess}
                          value={settingsForm.labAntibioticFormula || ''}
                          onChange={(e) => setSettingsForm({ ...settingsForm, labAntibioticFormula: e.target.value })}
                          className="w-full bg-white border border-slate-300 rounded px-2.5 py-1.5 text-xs focus:outline-none"
                          placeholder="C38H72N2O12 • 2H2O"
                        />
                      </div>
                      <div>
                        <label className="block text-[9px] font-bold text-slate-400 uppercase tracking-wider mb-1 font-mono">Status Label</label>
                        <input
                          type="text"
                          disabled={!hasSettingsAccess}
                          value={settingsForm.labAntibioticStatus || ''}
                          onChange={(e) => setSettingsForm({ ...settingsForm, labAntibioticStatus: e.target.value })}
                          className="w-full bg-white border border-slate-300 rounded px-2.5 py-1.5 text-xs focus:outline-none"
                          placeholder="API Approved"
                        />
                      </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mt-2">
                      <div>
                        <label className="block text-[9px] font-bold text-slate-400 uppercase tracking-wider mb-1 font-mono">Disintegration Rate</label>
                        <input
                          type="text"
                          disabled={!hasSettingsAccess}
                          value={settingsForm.labAntibioticDisintegration || ''}
                          onChange={(e) => setSettingsForm({ ...settingsForm, labAntibioticDisintegration: e.target.value })}
                          className="w-full bg-white border border-slate-300 rounded px-2.5 py-1.5 text-xs focus:outline-none"
                          placeholder="7.1 min (Limit < 15m)"
                        />
                      </div>
                      <div>
                        <label className="block text-[9px] font-bold text-slate-400 uppercase tracking-wider mb-1 font-mono">Chromatography Value</label>
                        <input
                          type="text"
                          disabled={!hasSettingsAccess}
                          value={settingsForm.labAntibioticChroma || ''}
                          onChange={(e) => setSettingsForm({ ...settingsForm, labAntibioticChroma: e.target.value })}
                          className="w-full bg-white border border-slate-300 rounded px-2.5 py-1.5 text-xs focus:outline-none"
                          placeholder="99.85% EP Certified"
                        />
                      </div>
                      <div>
                        <label className="block text-[9px] font-bold text-slate-400 uppercase tracking-wider mb-1 font-mono">Structure Subtitle</label>
                        <input
                          type="text"
                          disabled={!hasSettingsAccess}
                          value={settingsForm.labAntibioticStructure || ''}
                          onChange={(e) => setSettingsForm({ ...settingsForm, labAntibioticStructure: e.target.value })}
                          className="w-full bg-white border border-slate-300 rounded px-2.5 py-1.5 text-xs focus:outline-none"
                          placeholder="Azithromycin Aromatic Macrocyclic Loop"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Neuro Specimen */}
                  <div className="bg-slate-50/50 p-3 rounded border border-slate-150">
                    <span className="text-[10px] font-mono font-bold text-teal-700 uppercase">3. Neurological Specimen</span>
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-3 mt-2">
                      <div>
                        <label className="block text-[9px] font-bold text-slate-400 uppercase tracking-wider mb-1 font-mono">Title</label>
                        <input
                          type="text"
                          disabled={!hasSettingsAccess}
                          value={settingsForm.labNeuroTitle || ''}
                          onChange={(e) => setSettingsForm({ ...settingsForm, labNeuroTitle: e.target.value })}
                          className="w-full bg-white border border-slate-300 rounded px-2.5 py-1.5 text-xs focus:outline-none"
                          placeholder="SeroQuell Depot"
                        />
                      </div>
                      <div>
                        <label className="block text-[9px] font-bold text-slate-400 uppercase tracking-wider mb-1 font-mono">Active Ingredient</label>
                        <input
                          type="text"
                          disabled={!hasSettingsAccess}
                          value={settingsForm.labNeuroActive || ''}
                          onChange={(e) => setSettingsForm({ ...settingsForm, labNeuroActive: e.target.value })}
                          className="w-full bg-white border border-slate-300 rounded px-2.5 py-1.5 text-xs focus:outline-none"
                          placeholder="Quetiapine Fumarate"
                        />
                      </div>
                      <div>
                        <label className="block text-[9px] font-bold text-slate-400 uppercase tracking-wider mb-1 font-mono">Empirical Formula</label>
                        <input
                          type="text"
                          disabled={!hasSettingsAccess}
                          value={settingsForm.labNeuroFormula || ''}
                          onChange={(e) => setSettingsForm({ ...settingsForm, labNeuroFormula: e.target.value })}
                          className="w-full bg-white border border-slate-300 rounded px-2.5 py-1.5 text-xs focus:outline-none"
                          placeholder="(C21H25N3O2S)2"
                        />
                      </div>
                      <div>
                        <label className="block text-[9px] font-bold text-slate-400 uppercase tracking-wider mb-1 font-mono">Status Label</label>
                        <input
                          type="text"
                          disabled={!hasSettingsAccess}
                          value={settingsForm.labNeuroStatus || ''}
                          onChange={(e) => setSettingsForm({ ...settingsForm, labNeuroStatus: e.target.value })}
                          className="w-full bg-white border border-slate-300 rounded px-2.5 py-1.5 text-xs focus:outline-none"
                          placeholder="API Approved"
                        />
                      </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mt-2">
                      <div>
                        <label className="block text-[9px] font-bold text-slate-400 uppercase tracking-wider mb-1 font-mono">Disintegration Rate</label>
                        <input
                          type="text"
                          disabled={!hasSettingsAccess}
                          value={settingsForm.labNeuroDisintegration || ''}
                          onChange={(e) => setSettingsForm({ ...settingsForm, labNeuroDisintegration: e.target.value })}
                          className="w-full bg-white border border-slate-300 rounded px-2.5 py-1.5 text-xs focus:outline-none"
                          placeholder="5.8 min (Limit < 15m)"
                        />
                      </div>
                      <div>
                        <label className="block text-[9px] font-bold text-slate-400 uppercase tracking-wider mb-1 font-mono">Chromatography Value</label>
                        <input
                          type="text"
                          disabled={!hasSettingsAccess}
                          value={settingsForm.labNeuroChroma || ''}
                          onChange={(e) => setSettingsForm({ ...settingsForm, labNeuroChroma: e.target.value })}
                          className="w-full bg-white border border-slate-300 rounded px-2.5 py-1.5 text-xs focus:outline-none"
                          placeholder="99.88% BP/USP Certified"
                        />
                      </div>
                      <div>
                        <label className="block text-[9px] font-bold text-slate-400 uppercase tracking-wider mb-1 font-mono">Structure Subtitle</label>
                        <input
                          type="text"
                          disabled={!hasSettingsAccess}
                          value={settingsForm.labNeuroStructure || ''}
                          onChange={(e) => setSettingsForm({ ...settingsForm, labNeuroStructure: e.target.value })}
                          className="w-full bg-white border border-slate-300 rounded px-2.5 py-1.5 text-xs focus:outline-none"
                          placeholder="Quetiapine Dibenzothiazepine Core"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* GLOBAL DISTRIBUTOR APPLICATION CUSTOMIZATION */}
              <div className="border-t border-slate-100 pt-4 mt-6 font-sans">
                <h4 className="text-xs font-bold text-teal-600 uppercase tracking-wider mb-3">Global Distributor Application Block</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1 font-mono">Form Block Title</label>
                    <input
                      type="text"
                      disabled={!hasSettingsAccess}
                      value={settingsForm.distributorTitle || ''}
                      onChange={(e) => setSettingsForm({ ...settingsForm, distributorTitle: e.target.value })}
                      className="w-full bg-slate-50 border border-slate-300 rounded px-2.5 py-1.5 text-xs focus:outline-none font-medium"
                      placeholder="E.g., Global Distributor Application"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1 font-mono">Form Subtitle/Instruction</label>
                    <input
                      type="text"
                      disabled={!hasSettingsAccess}
                      value={settingsForm.distributorDesc || ''}
                      onChange={(e) => setSettingsForm({ ...settingsForm, distributorDesc: e.target.value })}
                      className="w-full bg-slate-50 border border-slate-300 rounded px-2.5 py-1.5 text-xs focus:outline-none font-medium"
                      placeholder="E.g., Submit your regional therapeutic requirements..."
                    />
                  </div>
                </div>
              </div>

              {hasSettingsAccess && (
                <div className="flex justify-end pt-4 border-t border-slate-100">
                  <button
                    type="submit"
                    disabled={isReadOnly || submitting}
                    className="bg-teal-600 hover:bg-teal-500 text-white text-xs font-bold px-6 py-2 rounded shadow disabled:opacity-50"
                  >
                    {submitting ? 'Updating...' : 'Save Configuration Changes'}
                  </button>
                </div>
              )}
            </form>
          </div>
        )}

        {activeSection === 'visibility' && (
          <div className="fade-in-up bg-white rounded-xl shadow-sm border border-slate-200 p-6 max-w-4xl">
            <div className="border-b border-slate-100 pb-4 mb-6">
              <h1 className="font-display text-2xl font-bold text-slate-900">Section Visibility</h1>
              <p className="text-xs text-slate-500 mt-1 font-mono">
                Control the activation and deactivate status of public portal sections. Toggle sections to hide or show them instantly on the live website.
              </p>
            </div>

            {operationSuccess && (
              <div className="mb-6 p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-lg text-xs flex items-center space-x-2 animate-pulse font-mono">
                <CheckCircle className="h-4 w-4 text-emerald-600 animate-bounce" />
                <span>{operationSuccess}</span>
              </div>
            )}

            <form onSubmit={handleSettingsSaveSubmit} className="space-y-6">
              <div className="space-y-4">
                {[
                  {
                    key: 'showHome' as const,
                    title: 'Corporate Home',
                    desc: 'The corporate landing page containing compliance badges, slider controls, and general business highlights.',
                    subsections: [
                      {
                        key: 'showHomeHero' as const,
                        title: 'Hero Banner & Slider',
                        desc: 'The main promotional banner with key highlights, primary title, description, and directional navigation buttons.'
                      },
                      {
                        key: 'showHomeMetrics' as const,
                        title: 'Key Corporate Metrics',
                        desc: 'The corporate performance numbers showing tablet output, stability standards, and compliance levels.'
                      },
                      {
                        key: 'showHomeFeatured' as const,
                        title: 'Featured Formulations',
                        desc: 'Section showing the top 3 high-bioavailability formulation cards.'
                      },
                      {
                        key: 'showHomeRegulatory' as const,
                        title: 'Regulatory Dossiers Callout',
                        desc: 'Dossier delivery information panel with WHO-GMP, ISO compliance details and key features.'
                      },
                      {
                        key: 'showHomeDistributor' as const,
                        title: 'Global Distributor Application',
                        desc: 'The interactive partnership registration and export request application form.'
                      },
                      {
                        key: 'showHomeLabPreview' as const,
                        title: 'Molecular Lab Preview',
                        desc: 'The interactive chemical synthesis and molecular lab specimen simulator.'
                      }
                    ]
                  },
                  {
                    key: 'showAbout' as const,
                    title: 'About Us Timeline & Leadership',
                    desc: 'The corporate About Us page featuring Mission, Vision, interactive historical timeline, Leadership directory, and Infrastructure details.',
                  },
                  {
                    key: 'showCatalog' as const,
                    title: 'Formulations Catalog',
                    desc: 'The searchable formulations browser displaying categories, dosage guides, composition details, and chemical monographs.',
                  },
                  {
                    key: 'showFacilities' as const,
                    title: 'Manufacturing Facilities',
                    desc: 'Highlights of sterile oral formulations suites, aseptic liquid lines, and analytical quality control research laboratories.',
                  },
                  {
                    key: 'showCertifications' as const,
                    title: 'Quality & Regulatory',
                    desc: 'Showcase of WHO-GMP, ISO 9001:2015, and USFDA compliance certificates supporting international dossier delivery pipelines.',
                  },
                  {
                    key: 'showGallery' as const,
                    title: 'Media Gallery',
                    desc: 'Visual assets portal displaying sterile factory machinery, corporate summits, video walkthroughs, and CSR healthcare drives.',
                  },
                  {
                    key: 'showCareers' as const,
                    title: 'Careers & Dossiers',
                    desc: 'Displays current active vacancies in Regulatory Affairs, QC Chromatography, and Aseptic production alongside CV upload pathways.',
                  },
                  {
                    key: 'showContact' as const,
                    title: 'Global Partnerships',
                    desc: 'The contact interface offering distributor partnership application forms, map pins, registration coordinates, and site coordinates.',
                  },
                ].map((section) => {
                  const isEnabled = settingsForm[section.key] !== false;
                  return (
                    <React.Fragment key={section.key}>
                      <div
                        className="flex items-center justify-between p-4 rounded-xl border border-slate-100 hover:border-slate-200 hover:bg-slate-50/50 transition duration-150"
                      >
                        <div className="max-w-xl">
                          <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center space-x-2 font-mono">
                            <span>{section.title}</span>
                            {isEnabled ? (
                              <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[9px] font-bold bg-teal-50 text-teal-700 border border-teal-200 uppercase">
                                Active
                              </span>
                            ) : (
                              <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[9px] font-bold bg-slate-100 text-slate-600 border border-slate-200 uppercase">
                                Deactivated
                              </span>
                            )}
                          </h3>
                          <p className="text-xs text-slate-500 mt-1 font-light">{section.desc}</p>
                        </div>

                        <button
                          type="button"
                          disabled={!hasSettingsAccess || isReadOnly}
                          onClick={() => {
                            setSettingsForm({
                              ...settingsForm,
                              [section.key]: !isEnabled,
                            });
                          }}
                          className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                            isEnabled ? 'bg-teal-600' : 'bg-slate-200'
                          } ${(!hasSettingsAccess || isReadOnly) ? 'opacity-50 cursor-not-allowed' : ''}`}
                        >
                          <span
                            aria-hidden="true"
                            className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                              isEnabled ? 'translate-x-5' : 'translate-x-0'
                            }`}
                          />
                        </button>
                      </div>

                      {/* Subsections support */}
                      {section.subsections && (
                        <div className="ml-8 pl-4 border-l-2 border-slate-100 space-y-3 mt-2 mb-4">
                          <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider font-mono">
                            Corporate Home Subsections
                          </div>
                          {section.subsections.map((sub) => {
                            const isSubEnabled = settingsForm[sub.key] !== false;
                            const isParentDisabled = !isEnabled;
                            const isToggleDisabled = !hasSettingsAccess || isReadOnly || isParentDisabled;

                            return (
                              <div
                                key={sub.key}
                                className={`flex items-center justify-between p-3 rounded-lg border border-slate-50 hover:bg-slate-50/30 transition duration-150 ${
                                  isParentDisabled ? 'opacity-60 bg-slate-50/10' : ''
                                }`}
                              >
                                <div className="max-w-lg">
                                  <h4 className="text-[11px] font-bold text-slate-700 uppercase tracking-wider flex items-center space-x-2 font-mono">
                                    <span>{sub.title}</span>
                                    {isParentDisabled ? (
                                      <span className="inline-flex items-center px-1.5 py-0.5 rounded-full text-[8px] font-bold bg-red-50 text-red-700 border border-red-100 uppercase">
                                        Parent Disabled
                                      </span>
                                    ) : isSubEnabled ? (
                                      <span className="inline-flex items-center px-1.5 py-0.5 rounded-full text-[8px] font-bold bg-teal-50/50 text-teal-700 border border-teal-100 uppercase">
                                        Active
                                      </span>
                                    ) : (
                                      <span className="inline-flex items-center px-1.5 py-0.5 rounded-full text-[8px] font-bold bg-slate-100 text-slate-500 border border-slate-100 uppercase">
                                        Deactivated
                                      </span>
                                    )}
                                  </h4>
                                  <p className="text-[11px] text-slate-400 mt-0.5 font-light">{sub.desc}</p>
                                </div>

                                <button
                                  type="button"
                                  disabled={isToggleDisabled}
                                  onClick={() => {
                                    setSettingsForm({
                                      ...settingsForm,
                                      [sub.key]: !isSubEnabled,
                                    });
                                  }}
                                  className={`relative inline-flex h-5 w-9 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                                    isSubEnabled && !isParentDisabled ? 'bg-teal-500' : 'bg-slate-200'
                                  } ${isToggleDisabled ? 'opacity-50 cursor-not-allowed' : ''}`}
                                >
                                  <span
                                    aria-hidden="true"
                                    className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                                      isSubEnabled && !isParentDisabled ? 'translate-x-4' : 'translate-x-0'
                                    }`}
                                  />
                                </button>
                              </div>
                            );
                          })}
                        </div>
                      )}
                    </React.Fragment>
                  );
                })}
              </div>

              {hasSettingsAccess && (
                <div className="flex justify-end pt-4 border-t border-slate-100">
                  <button
                    type="submit"
                    disabled={isReadOnly || submitting}
                    className="bg-teal-600 hover:bg-teal-500 text-white text-xs font-bold px-6 py-2.5 rounded-lg shadow disabled:opacity-50 transition duration-150 font-mono uppercase tracking-wider"
                  >
                    {submitting ? 'Saving...' : 'Save Section Visibility'}
                  </button>
                </div>
              )}
            </form>
          </div>
        )}

        {activeSection === 'gallery' && (
          <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between pb-4 border-b border-slate-100 gap-4">
              <div>
                <h2 className="text-base font-bold text-slate-800 uppercase tracking-wider font-mono">
                  Corporate Media Gallery
                </h2>
                <p className="text-xs text-slate-500 mt-1">
                  Manage high-resolution photo and video assets displayed in the Homepage Dynamic Carousel.
                </p>
              </div>

              {/* Action Buttons */}
              <div className="flex space-x-2">
                <button
                  onClick={() => {
                    setGalleryTab('view');
                    setEditingGalleryItem(null);
                  }}
                  className={`px-4 py-2 rounded-lg text-xs font-bold transition duration-150 ${
                    galleryTab === 'view'
                      ? 'bg-slate-900 text-white'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  Gallery List
                </button>
                <button
                  onClick={() => {
                    setGalleryTab('edit');
                    setEditingGalleryItem({
                      id: 'gal_' + Date.now(),
                      title: '',
                      category: 'factory',
                      type: 'images',
                      description: '',
                      imageUrl: '',
                    });
                  }}
                  disabled={isReadOnly}
                  className={`px-4 py-2 rounded-lg text-xs font-bold transition duration-150 flex items-center space-x-1.5 ${
                    galleryTab === 'edit' && !editingGalleryItem?.id.startsWith('gal_')
                      ? 'bg-teal-600 text-white'
                      : 'bg-teal-50 hover:bg-teal-100 text-teal-700 disabled:opacity-50'
                  }`}
                >
                  <Plus className="h-3.5 w-3.5" />
                  <span>Add Asset</span>
                </button>
              </div>
            </div>

            {/* Banner/Notice */}
            <div className="bg-teal-50 border border-teal-100/50 p-3 rounded-xl flex items-start space-x-2.5">
              <Sparkles className="h-4 w-4 text-teal-600 mt-0.5 shrink-0" />
              <div className="text-xs text-teal-800 leading-relaxed">
                <strong>Dynamic Home Carousel:</strong> Drag-and-drop items to reorder them! The sequence here matches the order in which items slide inside the home page carousel section.
              </div>
            </div>

            {/* TAB 1: VIEW/REORDER GALLERY LIST */}
            {galleryTab === 'view' && (
              <div className="space-y-4">
                {galleryItems.length === 0 ? (
                  <div className="text-center py-12 border-2 border-dashed border-slate-100 rounded-2xl bg-slate-50/50">
                    <Image className="h-8 w-8 text-slate-300 mx-auto mb-2" />
                    <p className="text-xs text-slate-500">No media assets in the gallery. Add some to display them on the home page.</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 gap-3">
                    {galleryItems.map((item, index) => {
                      const handleMoveUp = async (e: React.MouseEvent) => {
                        e.stopPropagation();
                        if (index === 0) return;
                        const copy = [...galleryItems];
                        const [removed] = copy.splice(index, 1);
                        copy.splice(index - 1, 0, removed);
                        await onReorderGallery(copy);
                      };

                      const handleMoveDown = async (e: React.MouseEvent) => {
                        e.stopPropagation();
                        if (index === galleryItems.length - 1) return;
                        const copy = [...galleryItems];
                        const [removed] = copy.splice(index, 1);
                        copy.splice(index + 1, 0, removed);
                        await onReorderGallery(copy);
                      };

                      const handleDragStart = (e: React.DragEvent) => {
                        e.dataTransfer.setData('text/plain', index.toString());
                        e.dataTransfer.effectAllowed = 'move';
                      };

                      const handleDrop = async (e: React.DragEvent) => {
                        e.preventDefault();
                        const fromIndex = parseInt(e.dataTransfer.getData('text/plain'), 10);
                        if (isNaN(fromIndex) || fromIndex === index) return;
                        const copy = [...galleryItems];
                        const [removed] = copy.splice(fromIndex, 1);
                        copy.splice(index, 0, removed);
                        await onReorderGallery(copy);
                      };

                      return (
                        <div
                          key={item.id}
                          draggable={!isReadOnly}
                          onDragStart={handleDragStart}
                          onDragOver={(e) => e.preventDefault()}
                          onDrop={handleDrop}
                          className="flex items-center justify-between p-3.5 bg-slate-50 hover:bg-slate-100/80 rounded-xl border border-slate-200/50 hover:border-slate-300 transition duration-150 cursor-grab active:cursor-grabbing group"
                        >
                          {/* Left: Reorder handler & Preview */}
                          <div className="flex items-center space-x-3.5 min-w-0">
                            {/* Drag Grip Indicator */}
                            <div className="flex flex-col space-y-0.5 text-slate-400 group-hover:text-slate-600">
                              <span className="text-[10px] leading-none">☰</span>
                              <span className="text-[10px] leading-none">☰</span>
                            </div>

                            {/* Image Preview */}
                            <img
                              src={getImgSrc(item.imageUrl)}
                              alt={item.title}
                              className="h-12 w-20 object-cover rounded-md bg-slate-200 border border-slate-300 shrink-0"
                            />

                            {/* Metadata */}
                            <div className="min-w-0">
                              <div className="flex items-center space-x-2">
                                <h4 className="text-xs font-bold text-slate-800 truncate">
                                  {item.title || "Untitled"}
                                </h4>
                                <span className={`text-[9px] uppercase tracking-wider font-mono font-bold px-1.5 py-0.5 rounded ${
                                  item.type === 'videos'
                                    ? 'bg-amber-100 text-amber-800'
                                    : 'bg-indigo-100 text-indigo-800'
                                }`}>
                                  {item.type === 'videos' ? 'Video Overlay' : 'Photo'}
                                </span>
                                <span className="text-[9px] uppercase tracking-wider font-mono bg-slate-200 text-slate-700 px-1.5 py-0.5 rounded">
                                  {item.category}
                                </span>
                              </div>
                              <p className="text-[11px] text-slate-500 truncate mt-1">
                                {item.description || "No description provided."}
                              </p>
                            </div>
                          </div>

                          {/* Right: Actions */}
                          <div 
                            className="flex items-center space-x-1.5 shrink-0" 
                            onMouseDown={(e) => e.stopPropagation()}
                          >
                            {/* Arrow Up */}
                            <button
                              onClick={handleMoveUp}
                              disabled={index === 0 || isReadOnly}
                              title="Move Up"
                              className="p-1.5 rounded-lg bg-white border border-slate-200 hover:bg-slate-50 text-slate-600 disabled:opacity-40 transition duration-150"
                            >
                              ▲
                            </button>
                            {/* Arrow Down */}
                            <button
                              onClick={handleMoveDown}
                              disabled={index === galleryItems.length - 1 || isReadOnly}
                              title="Move Down"
                              className="p-1.5 rounded-lg bg-white border border-slate-200 hover:bg-slate-50 text-slate-600 disabled:opacity-40 transition duration-150"
                            >
                              ▼
                            </button>
                            {/* Edit */}
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                e.preventDefault();
                                setEditingGalleryItem(item);
                                setGalleryTab('edit');
                              }}
                              disabled={isReadOnly}
                              title="Edit"
                              className="p-1.5 rounded-lg bg-white border border-slate-200 hover:border-slate-300 text-slate-600 hover:text-slate-800 transition duration-150"
                            >
                              <Edit className="h-3.5 w-3.5" />
                            </button>
                            {/* Delete */}
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                e.preventDefault();
                                setConfirmState({
                                  isOpen: true,
                                  title: 'Delete Gallery Item',
                                  message: `Are you sure you want to remove "${item.title}"?`,
                                  onConfirm: async () => {
                                    await onDeleteGalleryItem(item.id);
                                  }
                                });
                              }}
                              disabled={isReadOnly}
                              title="Delete"
                              className="p-1.5 rounded-lg bg-red-50 hover:bg-red-100 text-red-600 disabled:opacity-50 transition duration-150"
                            >
                              <Trash2 className="h-3.5 w-3.5" />
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            )}

            {/* TAB 2: ADD/EDIT GALLERY FORM */}
            {galleryTab === 'edit' && editingGalleryItem && (
              <form
                onSubmit={async (e) => {
                  e.preventDefault();
                  if (isReadOnly) return;
                  if (!editingGalleryItem.title || !editingGalleryItem.imageUrl) {
                    alert('Title and Media URL are required fields.');
                    return;
                  }
                  const success = await onSaveGalleryItem(editingGalleryItem);
                  if (success) {
                    setEditingGalleryItem(null);
                    setGalleryTab('view');
                  }
                }}
                className="space-y-4 pt-2"
              >
                <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider font-mono">
                  {editingGalleryItem.id.startsWith('gal_') ? 'Add New Gallery Asset' : 'Edit Gallery Asset'}
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Asset Title */}
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-600 uppercase tracking-wide">
                      Asset Title <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Sterile Injectables Wing"
                      value={editingGalleryItem.title}
                      onChange={(e) => setEditingGalleryItem({ ...editingGalleryItem, title: e.target.value })}
                      className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-teal-500 font-medium"
                    />
                  </div>

                  {/* Media Type */}
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-600 uppercase tracking-wide">
                      Media Overlay Mode
                    </label>
                    <select
                      value={editingGalleryItem.type}
                      onChange={(e) => setEditingGalleryItem({ ...editingGalleryItem, type: e.target.value as any })}
                      className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-teal-500 font-medium bg-white"
                    >
                      <option value="images">Static Image (No Overlay)</option>
                      <option value="videos">Overlay Play Button (Simulated Video Playback)</option>
                    </select>
                  </div>

                  {/* Category */}
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-600 uppercase tracking-wide">
                      Grouping Category
                    </label>
                    <select
                      value={editingGalleryItem.category}
                      onChange={(e) => setEditingGalleryItem({ ...editingGalleryItem, category: e.target.value as any })}
                      className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-teal-500 font-medium bg-white"
                    >
                      <option value="factory">Manufacturing Facility</option>
                      <option value="events">Corporate summits & Events</option>
                      <option value="csr">Corporate Social Responsibility (CSR)</option>
                    </select>
                  </div>

                  {/* Image/Media Asset and Uploader */}
                  <div className="space-y-2 md:col-span-2">
                    <label className="text-xs font-bold text-slate-600 uppercase tracking-wide block">
                      Asset Media Image <span className="text-red-500">*</span>
                    </label>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      {/* Drag & Drop uploader area */}
                      <div className="md:col-span-2">
                        <div
                          onDragOver={(e) => { e.preventDefault(); e.stopPropagation(); }}
                          onDrop={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            if (e.dataTransfer.files && e.dataTransfer.files[0]) {
                              handleGalleryFile(e.dataTransfer.files[0]);
                            }
                          }}
                          className="border border-dashed border-slate-300 rounded-xl p-4 bg-white hover:border-teal-500 transition-colors flex flex-col items-center justify-center cursor-pointer relative h-28"
                        >
                          <input
                            type="file"
                            accept="image/*"
                            onChange={(e) => {
                              if (e.target.files && e.target.files[0]) {
                                handleGalleryFile(e.target.files[0]);
                              }
                            }}
                            className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
                          />
                          <Upload className="h-5 w-5 text-slate-400 mb-1" />
                          <p className="text-[11px] text-slate-600 font-semibold text-center">Drag & drop your asset image, or <span className="text-teal-600 hover:underline">browse</span></p>
                          <p className="text-[9px] text-slate-400 text-center mt-0.5">PNG, JPG, WebP up to 5MB</p>
                        </div>
                        {galleryUploadError && (
                          <p className="text-[10px] text-red-600 mt-1 flex items-center">
                            <XCircle className="h-3.5 w-3.5 mr-1" /> {galleryUploadError}
                          </p>
                        )}
                      </div>

                      {/* Current Preview or text URL input fallback */}
                      <div className="flex flex-col justify-between space-y-2">
                        <div className="relative h-16 w-full rounded-lg overflow-hidden border border-slate-200 bg-slate-950 flex items-center justify-center">
                          {editingGalleryItem.imageUrl ? (
                            <img
                              src={getImgSrc(editingGalleryItem.imageUrl)}
                              alt="Asset Preview"
                              className="h-full w-full object-cover"
                              referrerPolicy="no-referrer"
                            />
                          ) : (
                            <span className="text-[10px] text-slate-500 italic">No asset selected</span>
                          )}
                        </div>
                        <input
                          type="text"
                          placeholder="Or paste direct image URL..."
                          value={editingGalleryItem.imageUrl}
                          onChange={(e) => setEditingGalleryItem({ ...editingGalleryItem, imageUrl: e.target.value })}
                          className="w-full text-[10px] px-2 py-1.5 rounded-lg border border-slate-200 focus:outline-none focus:border-teal-500 font-mono"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Description */}
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-600 uppercase tracking-wide">
                    Overlay Caption Description
                  </label>
                  <textarea
                    rows={3}
                    placeholder="Provide a rich brief descriptive sentence of what is showcased..."
                    value={editingGalleryItem.description}
                    onChange={(e) => setEditingGalleryItem({ ...editingGalleryItem, description: e.target.value })}
                    className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-teal-500 font-medium"
                  />
                </div>

                {/* Live Preview Card */}
                {editingGalleryItem.imageUrl && (
                  <div className="border border-slate-100 rounded-2xl p-4 bg-slate-50/50 space-y-2">
                    <h4 className="text-[10px] font-bold text-slate-500 uppercase tracking-wider font-mono">Live Widget Preview:</h4>
                    <div className="relative aspect-[16/9] w-full max-w-lg rounded-xl overflow-hidden shadow-sm border border-slate-200 bg-slate-900 mx-auto">
                      <img
                        src={getImgSrc(editingGalleryItem.imageUrl)}
                        alt="Preview"
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent flex flex-col justify-end p-4 text-left">
                        <div className="flex items-center space-x-1.5">
                          <span className="text-[9px] font-mono font-bold bg-teal-500 text-white px-1.5 py-0.5 rounded tracking-widest uppercase">
                            {editingGalleryItem.category}
                          </span>
                          {editingGalleryItem.type === 'videos' && (
                            <span className="text-[9px] font-mono font-bold bg-amber-500 text-white px-1.5 py-0.5 rounded tracking-widest uppercase flex items-center space-x-0.5">
                              <Play className="h-2 w-2 fill-white text-white" />
                              <span>VIDEO</span>
                            </span>
                          )}
                        </div>
                        <h4 className="text-sm font-bold text-white mt-1">{editingGalleryItem.title || 'Untitled Asset'}</h4>
                        <p className="text-[10px] text-slate-300 mt-1 line-clamp-2">{editingGalleryItem.description || 'Caption text description here...'}</p>
                      </div>
                    </div>
                  </div>
                )}

                {/* Action controls */}
                <div className="flex justify-end space-x-2 pt-2 border-t border-slate-100">
                  <button
                    type="button"
                    onClick={() => {
                      setGalleryTab('view');
                      setEditingGalleryItem(null);
                    }}
                    className="px-4 py-2.5 border border-slate-200 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-50 transition duration-150"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-2.5 bg-teal-600 hover:bg-teal-500 text-white text-xs font-bold rounded-xl shadow transition duration-150 font-mono uppercase tracking-wider"
                  >
                    Save Asset
                  </button>
                </div>
              </form>
            )}
          </div>
        )}

        {activeSection === 'about' && (
          <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between pb-4 border-b border-slate-100 gap-4">
              <div>
                <h2 className="text-base font-bold text-slate-800 uppercase tracking-wider font-mono">
                  Manage About Us Content
                </h2>
                <p className="text-xs text-slate-500 mt-1">
                  Administrate corporate chronological milestones and professional board of directors.
                </p>
              </div>

              {/* Sub tab selectors */}
              <div className="flex bg-slate-100 p-1 rounded-xl">
                <button
                  onClick={() => {
                    setAboutSubTab('timeline');
                    setAboutEditMode(false);
                    setEditingTimelineEvent(null);
                    setEditingLeadershipMember(null);
                  }}
                  className={`px-4 py-1.5 rounded-lg text-xs font-bold transition duration-150 ${
                    aboutSubTab === 'timeline'
                      ? 'bg-white text-slate-800 shadow-sm'
                      : 'text-slate-500 hover:text-slate-800'
                  }`}
                >
                  Milestone Timeline
                </button>
                <button
                  onClick={() => {
                    setAboutSubTab('leadership');
                    setAboutEditMode(false);
                    setEditingTimelineEvent(null);
                    setEditingLeadershipMember(null);
                  }}
                  className={`px-4 py-1.5 rounded-lg text-xs font-bold transition duration-150 ${
                    aboutSubTab === 'leadership'
                      ? 'bg-white text-slate-800 shadow-sm'
                      : 'text-slate-500 hover:text-slate-800'
                  }`}
                >
                  Board & Leadership
                </button>
                <button
                  onClick={() => {
                    setAboutSubTab('editorial');
                    setAboutEditMode(false);
                    setEditingTimelineEvent(null);
                    setEditingLeadershipMember(null);
                  }}
                  className={`px-4 py-1.5 rounded-lg text-xs font-bold transition duration-150 ${
                    aboutSubTab === 'editorial'
                      ? 'bg-white text-slate-800 shadow-sm'
                      : 'text-slate-500 hover:text-slate-800'
                  }`}
                >
                  About Us Editorial Text
                </button>
                <button
                  onClick={() => {
                    setAboutSubTab('infrastructure');
                    setAboutEditMode(false);
                    setEditingTimelineEvent(null);
                    setEditingLeadershipMember(null);
                  }}
                  className={`px-4 py-1.5 rounded-lg text-xs font-bold transition duration-150 ${
                    aboutSubTab === 'infrastructure'
                      ? 'bg-white text-slate-800 shadow-sm'
                      : 'text-slate-500 hover:text-slate-800'
                  }`}
                >
                  Plant & Infrastructure
                </button>
              </div>
            </div>

            {/* SUBSECTION 1: TIMELINE PANEL */}
            {aboutSubTab === 'timeline' && (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider font-mono">
                    Historical Corporate Milestones
                  </h3>
                  {!aboutEditMode && (
                    <button
                      onClick={() => {
                        setEditingTimelineEvent({
                          id: 'time_' + Date.now(),
                          year: new Date().getFullYear(),
                          title: '',
                          details: '',
                          regulatory: 'GMP COMPLIANT',
                          reach: 'Global Markets',
                          scope: 'Formulation Suite',
                          imageUrl: '',
                        });
                        setAboutEditMode(true);
                      }}
                      disabled={isReadOnly}
                      className="px-3.5 py-1.5 bg-teal-50 hover:bg-teal-100 text-teal-700 text-xs font-bold rounded-lg disabled:opacity-50 flex items-center space-x-1 transition duration-150"
                    >
                      <Plus className="h-3.5 w-3.5" />
                      <span>Add Milestone</span>
                    </button>
                  )}
                </div>

                {!aboutEditMode ? (
                  /* Timeline Grid List */
                  timelineData.length === 0 ? (
                    <div className="text-center py-12 border-2 border-dashed border-slate-100 rounded-2xl bg-slate-50/50">
                      <Calendar className="h-8 w-8 text-slate-300 mx-auto mb-2" />
                      <p className="text-xs text-slate-500">No milestones loaded in the database. Add some to build the timeline view.</p>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {timelineData.map((event, index) => {
                        const handleMoveUp = async (e: React.MouseEvent) => {
                          e.stopPropagation();
                          if (index === 0) return;
                          const copy = [...timelineData];
                          const [removed] = copy.splice(index, 1);
                          copy.splice(index - 1, 0, removed);
                          await onReorderTimeline(copy);
                        };

                        const handleMoveDown = async (e: React.MouseEvent) => {
                          e.stopPropagation();
                          if (index === timelineData.length - 1) return;
                          const copy = [...timelineData];
                          const [removed] = copy.splice(index, 1);
                          copy.splice(index + 1, 0, removed);
                          await onReorderTimeline(copy);
                        };

                        const handleDragStart = (e: React.DragEvent) => {
                          e.dataTransfer.setData('text/plain', index.toString());
                          e.dataTransfer.effectAllowed = 'move';
                        };

                        const handleDrop = async (e: React.DragEvent) => {
                          e.preventDefault();
                          const fromIndex = parseInt(e.dataTransfer.getData('text/plain'), 10);
                          if (isNaN(fromIndex) || fromIndex === index) return;
                          const copy = [...timelineData];
                          const [removed] = copy.splice(fromIndex, 1);
                          copy.splice(index, 0, removed);
                          await onReorderTimeline(copy);
                        };

                        return (
                          <div
                            key={event.id}
                            draggable={!isReadOnly}
                            onDragStart={handleDragStart}
                            onDragOver={(e) => e.preventDefault()}
                            onDrop={handleDrop}
                            className="flex items-center justify-between p-3.5 bg-slate-50 hover:bg-slate-100/80 rounded-xl border border-slate-200/50 hover:border-slate-300 transition duration-150 cursor-grab active:cursor-grabbing group"
                          >
                            <div className="flex items-center space-x-3.5 min-w-0">
                              {/* Grip */}
                              <div className="flex flex-col space-y-0.5 text-slate-400 group-hover:text-slate-600">
                                <span className="text-[10px] leading-none">☰</span>
                                <span className="text-[10px] leading-none">☰</span>
                              </div>

                              {/* Milestone Icon Indicator or Thumbnail */}
                              {event.imageUrl ? (
                                <img
                                  src={getImgSrc(event.imageUrl)}
                                  alt={event.title}
                                  className="h-10 w-16 object-cover rounded bg-slate-200 border border-slate-300"
                                />
                              ) : (
                                <div className="h-10 w-10 flex items-center justify-center bg-teal-100 text-teal-700 text-xs font-bold rounded-lg shrink-0 font-mono">
                                  {event.year}
                                </div>
                              )}

                              <div className="min-w-0">
                                <div className="flex items-center space-x-2">
                                  <span className="text-xs font-extrabold text-teal-700 font-mono">
                                    [{event.year}]
                                  </span>
                                  <h4 className="text-xs font-bold text-slate-800 truncate">
                                    {event.title}
                                  </h4>
                                  <span className="text-[9px] uppercase tracking-wider font-mono bg-slate-200 text-slate-700 px-1.5 py-0.5 rounded">
                                    {event.regulatory}
                                  </span>
                                </div>
                                <p className="text-[11px] text-slate-500 truncate mt-1">
                                  {event.details}
                                </p>
                              </div>
                            </div>

                            {/* Right Panel Actions */}
                            <div 
                              className="flex items-center space-x-1.5 shrink-0" 
                              onMouseDown={(e) => e.stopPropagation()}
                            >
                              <button
                                onClick={handleMoveUp}
                                disabled={index === 0 || isReadOnly}
                                className="p-1.5 rounded-lg bg-white border border-slate-200 hover:bg-slate-50 text-slate-600 disabled:opacity-40 transition duration-150"
                              >
                                ▲
                              </button>
                              <button
                                onClick={handleMoveDown}
                                disabled={index === timelineData.length - 1 || isReadOnly}
                                className="p-1.5 rounded-lg bg-white border border-slate-200 hover:bg-slate-50 text-slate-600 disabled:opacity-40 transition duration-150"
                              >
                                ▼
                              </button>
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  e.preventDefault();
                                  setEditingTimelineEvent(event);
                                  setAboutEditMode(true);
                                }}
                                disabled={isReadOnly}
                                className="p-1.5 rounded-lg bg-white border border-slate-200 hover:border-slate-300 text-slate-600 hover:text-slate-800 transition duration-150"
                              >
                                <Edit className="h-3.5 w-3.5" />
                              </button>
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  e.preventDefault();
                                  setConfirmState({
                                    isOpen: true,
                                    title: 'Delete Milestone Year',
                                    message: `Are you sure you want to delete milestone year "${event.year}"?`,
                                    onConfirm: async () => {
                                      await onDeleteTimelineEvent(event.id);
                                    }
                                  });
                                }}
                                disabled={isReadOnly}
                                className="p-1.5 rounded-lg bg-red-50 hover:bg-red-100 text-red-600 disabled:opacity-50 transition duration-150"
                              >
                                <Trash2 className="h-3.5 w-3.5" />
                              </button>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )
                ) : (
                  /* Timeline Edit Form */
                  editingTimelineEvent && (
                    <form
                      onSubmit={async (e) => {
                        e.preventDefault();
                        if (isReadOnly) return;
                        if (!editingTimelineEvent.title || !editingTimelineEvent.year) {
                          alert('Milestone year and Title are required.');
                          return;
                        }
                        const success = await onSaveTimelineEvent(editingTimelineEvent);
                        if (success) {
                          setAboutEditMode(false);
                          setEditingTimelineEvent(null);
                        }
                      }}
                      className="space-y-4 border border-slate-150 rounded-2xl p-5 bg-slate-50/40"
                    >
                      <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider font-mono">
                        {editingTimelineEvent.id.startsWith('time_') ? 'Add Milestone Milestone' : 'Edit Milestone Details'}
                      </h4>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-1">
                          <label className="text-xs font-bold text-slate-600 uppercase tracking-wide">
                            Milestone Year <span className="text-red-500">*</span>
                          </label>
                          <input
                            type="number"
                            required
                            min={1950}
                            max={2100}
                            value={editingTimelineEvent.year}
                            onChange={(e) => setEditingTimelineEvent({ ...editingTimelineEvent, year: parseInt(e.target.value, 10) })}
                            className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-teal-500 font-medium"
                          />
                        </div>

                        <div className="space-y-1">
                          <label className="text-xs font-bold text-slate-600 uppercase tracking-wide">
                            Milestone Title <span className="text-red-500">*</span>
                          </label>
                          <input
                            type="text"
                            required
                            placeholder="e.g. WHO-GMP Accreditation"
                            value={editingTimelineEvent.title}
                            onChange={(e) => setEditingTimelineEvent({ ...editingTimelineEvent, title: e.target.value })}
                            className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-teal-500 font-medium"
                          />
                        </div>

                        <div className="space-y-1">
                          <label className="text-xs font-bold text-slate-600 uppercase tracking-wide">
                            Regulatory Status Tag
                          </label>
                          <input
                            type="text"
                            placeholder="e.g. WHO-GMP CERTIFIED"
                            value={editingTimelineEvent.regulatory}
                            onChange={(e) => setEditingTimelineEvent({ ...editingTimelineEvent, regulatory: e.target.value })}
                            className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-teal-500 font-medium"
                          />
                        </div>

                        <div className="space-y-1">
                          <label className="text-xs font-bold text-slate-600 uppercase tracking-wide">
                            Global Reach Indicator
                          </label>
                          <input
                            type="text"
                            placeholder="e.g. 45+ Global Partners"
                            value={editingTimelineEvent.reach}
                            onChange={(e) => setEditingTimelineEvent({ ...editingTimelineEvent, reach: e.target.value })}
                            className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-teal-500 font-medium"
                          />
                        </div>

                        <div className="space-y-1">
                          <label className="text-xs font-bold text-slate-600 uppercase tracking-wide">
                            Dossier Scope
                          </label>
                          <input
                            type="text"
                            placeholder="e.g. Advanced SEZ Block"
                            value={editingTimelineEvent.scope}
                            onChange={(e) => setEditingTimelineEvent({ ...editingTimelineEvent, scope: e.target.value })}
                            className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-teal-500 font-medium"
                          />
                        </div>

                        {/* Showcase Image Uploader & Editor */}
                        <div className="space-y-2 md:col-span-2">
                          <label className="text-xs font-bold text-slate-600 uppercase tracking-wide block">
                            Showcase Image
                          </label>
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            {/* Drag & Drop uploader area */}
                            <div className="md:col-span-2">
                              <div
                                onDragOver={(e) => { e.preventDefault(); e.stopPropagation(); }}
                                onDrop={(e) => {
                                  e.preventDefault();
                                  e.stopPropagation();
                                  if (e.dataTransfer.files && e.dataTransfer.files[0]) {
                                    handleTimelineFile(e.dataTransfer.files[0]);
                                  }
                                }}
                                className="border border-dashed border-slate-300 rounded-xl p-4 bg-white hover:border-teal-500 transition-colors flex flex-col items-center justify-center cursor-pointer relative h-28"
                              >
                                <input
                                  type="file"
                                  accept="image/*"
                                  onChange={(e) => {
                                    if (e.target.files && e.target.files[0]) {
                                      handleTimelineFile(e.target.files[0]);
                                    }
                                  }}
                                  className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
                                />
                                <Upload className="h-5 w-5 text-slate-400 mb-1" />
                                <p className="text-[11px] text-slate-600 font-semibold text-center">Drag & drop milestone image, or <span className="text-teal-600 hover:underline">browse</span></p>
                                <p className="text-[9px] text-slate-400 text-center mt-0.5">PNG, JPG, WebP up to 5MB</p>
                              </div>
                              {timelineUploadError && (
                                <p className="text-[10px] text-red-600 mt-1 flex items-center">
                                  <XCircle className="h-3.5 w-3.5 mr-1" /> {timelineUploadError}
                                </p>
                              )}
                            </div>

                            {/* Current Preview or text URL input fallback */}
                            <div className="flex flex-col justify-between space-y-2">
                              <div className="relative h-16 w-full rounded-lg overflow-hidden border border-slate-200 bg-slate-950 flex items-center justify-center">
                                {editingTimelineEvent.imageUrl ? (
                                  <img
                                    src={editingTimelineEvent.imageUrl}
                                    alt="Milestone Preview"
                                    className="h-full w-full object-cover"
                                    referrerPolicy="no-referrer"
                                  />
                                ) : (
                                  <span className="text-[10px] text-slate-500 italic">No image selected</span>
                                )}
                              </div>
                              <input
                                type="text"
                                placeholder="Or paste direct image URL..."
                                value={editingTimelineEvent.imageUrl}
                                onChange={(e) => setEditingTimelineEvent({ ...editingTimelineEvent, imageUrl: e.target.value })}
                                className="w-full text-[10px] px-2 py-1.5 rounded-lg border border-slate-200 focus:outline-none focus:border-teal-500 font-mono"
                              />
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="space-y-1">
                        <label className="text-xs font-bold text-slate-600 uppercase tracking-wide">
                          Milestone Details
                        </label>
                        <textarea
                          rows={3}
                          required
                          placeholder="Provide a historical report about the achievements made in this period..."
                          value={editingTimelineEvent.details}
                          onChange={(e) => setEditingTimelineEvent({ ...editingTimelineEvent, details: e.target.value })}
                          className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-teal-500 font-medium"
                        />
                      </div>

                      <div className="flex justify-end space-x-2 pt-2">
                        <button
                          type="button"
                          onClick={() => {
                            setAboutEditMode(false);
                            setEditingTimelineEvent(null);
                          }}
                          className="px-4 py-2 border border-slate-200 rounded-lg text-xs font-bold text-slate-600 hover:bg-slate-50 transition duration-150"
                        >
                          Cancel
                        </button>
                        <button
                          type="submit"
                          className="px-6 py-2 bg-teal-600 hover:bg-teal-500 text-white text-xs font-bold rounded-lg shadow transition duration-150 font-mono uppercase tracking-wider"
                        >
                          Save Milestone
                        </button>
                      </div>
                    </form>
                  )
                )}
              </div>
            )}

            {/* SUBSECTION 2: LEADERSHIP PANEL */}
            {aboutSubTab === 'leadership' && (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider font-mono">
                    Board of Directors & Scientific Leaders
                  </h3>
                  {!aboutEditMode && (
                    <button
                      onClick={() => {
                        setEditingLeadershipMember({
                          id: 'lead_' + Date.now(),
                          name: '',
                          role: '',
                          credentials: '',
                          experience: '',
                          bio: '',
                          imageUrl: '',
                        });
                        setAboutEditMode(true);
                      }}
                      disabled={isReadOnly}
                      className="px-3.5 py-1.5 bg-teal-50 hover:bg-teal-100 text-teal-700 text-xs font-bold rounded-lg disabled:opacity-50 flex items-center space-x-1 transition duration-150"
                    >
                      <Plus className="h-3.5 w-3.5" />
                      <span>Add Director</span>
                    </button>
                  )}
                </div>

                {!aboutEditMode ? (
                  /* Leadership Cards List */
                  leadershipData.length === 0 ? (
                    <div className="text-center py-12 border-2 border-dashed border-slate-100 rounded-2xl bg-slate-50/50">
                      <Users className="h-8 w-8 text-slate-300 mx-auto mb-2" />
                      <p className="text-xs text-slate-500">No board or scientific leadership members added. Click Add Director above.</p>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {leadershipData.map((member, index) => {
                        const handleMoveUp = async (e: React.MouseEvent) => {
                          e.stopPropagation();
                          if (index === 0) return;
                          const copy = [...leadershipData];
                          const [removed] = copy.splice(index, 1);
                          copy.splice(index - 1, 0, removed);
                          await onReorderLeadership(copy);
                        };

                        const handleMoveDown = async (e: React.MouseEvent) => {
                          e.stopPropagation();
                          if (index === leadershipData.length - 1) return;
                          const copy = [...leadershipData];
                          const [removed] = copy.splice(index, 1);
                          copy.splice(index + 1, 0, removed);
                          await onReorderLeadership(copy);
                        };

                        const handleDragStart = (e: React.DragEvent) => {
                          e.dataTransfer.setData('text/plain', index.toString());
                          e.dataTransfer.effectAllowed = 'move';
                        };

                        const handleDrop = async (e: React.DragEvent) => {
                          e.preventDefault();
                          const fromIndex = parseInt(e.dataTransfer.getData('text/plain'), 10);
                          if (isNaN(fromIndex) || fromIndex === index) return;
                          const copy = [...leadershipData];
                          const [removed] = copy.splice(fromIndex, 1);
                          copy.splice(index, 0, removed);
                          await onReorderLeadership(copy);
                        };

                        return (
                          <div
                            key={member.id}
                            draggable={!isReadOnly}
                            onDragStart={handleDragStart}
                            onDragOver={(e) => e.preventDefault()}
                            onDrop={handleDrop}
                            className="flex items-center justify-between p-3.5 bg-slate-50 hover:bg-slate-100/80 rounded-xl border border-slate-200/50 hover:border-slate-300 transition duration-150 cursor-grab active:cursor-grabbing group"
                          >
                            <div className="flex items-center space-x-3.5 min-w-0">
                              {/* Grip */}
                              <div className="flex flex-col space-y-0.5 text-slate-400 group-hover:text-slate-600">
                                <span className="text-[10px] leading-none">☰</span>
                                <span className="text-[10px] leading-none">☰</span>
                              </div>

                              {/* Member Headshot */}
                              <img
                                src={getImgSrc(member.imageUrl)}
                                alt={member.name}
                                className="h-10 w-10 object-cover rounded-full bg-slate-200 border border-slate-300 shrink-0"
                              />

                              <div className="min-w-0">
                                <div className="flex items-center space-x-2">
                                  <h4 className="text-xs font-bold text-slate-800 truncate">
                                    {member.name}
                                  </h4>
                                  <span className="text-[9px] uppercase tracking-wider font-mono bg-teal-50 text-teal-700 px-1.5 py-0.5 rounded border border-teal-100">
                                    {member.role}
                                  </span>
                                  <span className="text-[9px] uppercase tracking-wider font-mono text-slate-400">
                                    {member.experience}
                                  </span>
                                </div>
                                <p className="text-[11px] text-slate-500 truncate mt-1">
                                  {member.credentials} — {member.bio}
                                </p>
                              </div>
                            </div>

                            {/* Actions */}
                            <div 
                              className="flex items-center space-x-1.5 shrink-0" 
                              onMouseDown={(e) => e.stopPropagation()}
                            >
                              <button
                                onClick={handleMoveUp}
                                disabled={index === 0 || isReadOnly}
                                className="p-1.5 rounded-lg bg-white border border-slate-200 hover:bg-slate-50 text-slate-600 disabled:opacity-40 transition duration-150"
                              >
                                ▲
                              </button>
                              <button
                                onClick={handleMoveDown}
                                disabled={index === leadershipData.length - 1 || isReadOnly}
                                className="p-1.5 rounded-lg bg-white border border-slate-200 hover:bg-slate-50 text-slate-600 disabled:opacity-40 transition duration-150"
                              >
                                ▼
                              </button>
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  e.preventDefault();
                                  setEditingLeadershipMember(member);
                                  setAboutEditMode(true);
                                }}
                                disabled={isReadOnly}
                                className="p-1.5 rounded-lg bg-white border border-slate-200 hover:border-slate-300 text-slate-600 hover:text-slate-800 transition duration-150"
                              >
                                <Edit className="h-3.5 w-3.5" />
                              </button>
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  e.preventDefault();
                                  setConfirmState({
                                    isOpen: true,
                                    title: 'Delete Leadership Member',
                                    message: `Are you sure you want to remove "${member.name}"?`,
                                    onConfirm: async () => {
                                      await onDeleteLeadershipMember(member.id);
                                    }
                                  });
                                }}
                                disabled={isReadOnly}
                                className="p-1.5 rounded-lg bg-red-50 hover:bg-red-100 text-red-600 disabled:opacity-50 transition duration-150"
                              >
                                <Trash2 className="h-3.5 w-3.5" />
                              </button>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )
                ) : (
                  /* Leadership Edit Form */
                  editingLeadershipMember && (
                    <form
                      onSubmit={async (e) => {
                        e.preventDefault();
                        if (isReadOnly) return;
                        if (!editingLeadershipMember.name || !editingLeadershipMember.role) {
                          alert('Name and Role are required.');
                          return;
                        }
                        const success = await onSaveLeadershipMember(editingLeadershipMember);
                        if (success) {
                          setAboutEditMode(false);
                          setEditingLeadershipMember(null);
                        }
                      }}
                      className="space-y-4 border border-slate-150 rounded-2xl p-5 bg-slate-50/40"
                    >
                      <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider font-mono">
                        {editingLeadershipMember.id.startsWith('lead_') ? 'Add Leadership Director' : 'Edit Leadership Director'}
                      </h4>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-1">
                          <label className="text-xs font-bold text-slate-600 uppercase tracking-wide">
                            Full Name <span className="text-red-500">*</span>
                          </label>
                          <input
                            type="text"
                            required
                            placeholder="e.g. Dr. Aris Thorne"
                            value={editingLeadershipMember.name}
                            onChange={(e) => setEditingLeadershipMember({ ...editingLeadershipMember, name: e.target.value })}
                            className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-teal-500 font-medium"
                          />
                        </div>

                        <div className="space-y-1">
                          <label className="text-xs font-bold text-slate-600 uppercase tracking-wide">
                            Corporate / Board Role <span className="text-red-500">*</span>
                          </label>
                          <input
                            type="text"
                            required
                            placeholder="e.g. Chief Scientific Officer"
                            value={editingLeadershipMember.role}
                            onChange={(e) => setEditingLeadershipMember({ ...editingLeadershipMember, role: e.target.value })}
                            className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-teal-500 font-medium"
                          />
                        </div>

                        <div className="space-y-1">
                          <label className="text-xs font-bold text-slate-600 uppercase tracking-wide">
                            Professional Credentials
                          </label>
                          <input
                            type="text"
                            placeholder="e.g. PhD in Industrial Pharmacy, FRSM"
                            value={editingLeadershipMember.credentials}
                            onChange={(e) => setEditingLeadershipMember({ ...editingLeadershipMember, credentials: e.target.value })}
                            className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-teal-500 font-medium"
                          />
                        </div>

                        <div className="space-y-1">
                          <label className="text-xs font-bold text-slate-600 uppercase tracking-wide">
                            Experience Tenure tag
                          </label>
                          <input
                            type="text"
                            placeholder="e.g. 25+ Yrs Exp"
                            value={editingLeadershipMember.experience}
                            onChange={(e) => setEditingLeadershipMember({ ...editingLeadershipMember, experience: e.target.value })}
                            className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-teal-500 font-medium"
                          />
                        </div>

                        {/* Headshot Image Uploader & Editor */}
                        <div className="space-y-2 md:col-span-2">
                          <label className="text-xs font-bold text-slate-600 uppercase tracking-wide block">
                            Headshot Image
                          </label>
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            {/* Drag & Drop uploader area */}
                            <div className="md:col-span-2">
                              <div
                                onDragOver={(e) => { e.preventDefault(); e.stopPropagation(); }}
                                onDrop={(e) => {
                                  e.preventDefault();
                                  e.stopPropagation();
                                  if (e.dataTransfer.files && e.dataTransfer.files[0]) {
                                    handleLeadershipFile(e.dataTransfer.files[0]);
                                  }
                                }}
                                className="border border-dashed border-slate-300 rounded-xl p-4 bg-white hover:border-teal-500 transition-colors flex flex-col items-center justify-center cursor-pointer relative h-28"
                              >
                                <input
                                  type="file"
                                  accept="image/*"
                                  onChange={(e) => {
                                    if (e.target.files && e.target.files[0]) {
                                      handleLeadershipFile(e.target.files[0]);
                                    }
                                  }}
                                  className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
                                />
                                <Upload className="h-5 w-5 text-slate-400 mb-1" />
                                <p className="text-[11px] text-slate-600 font-semibold text-center">Drag & drop headshot image, or <span className="text-teal-600 hover:underline">browse</span></p>
                                <p className="text-[9px] text-slate-400 text-center mt-0.5">PNG, JPG, WebP up to 5MB</p>
                              </div>
                              {leadershipUploadError && (
                                <p className="text-[10px] text-red-600 mt-1 flex items-center">
                                  <XCircle className="h-3.5 w-3.5 mr-1" /> {leadershipUploadError}
                                </p>
                              )}
                            </div>

                            {/* Current Preview or text URL input fallback */}
                            <div className="flex flex-col justify-between space-y-2">
                              <div className="relative h-16 w-full rounded-lg overflow-hidden border border-slate-200 bg-slate-950 flex items-center justify-center">
                                {editingLeadershipMember.imageUrl ? (
                                  <img
                                    src={editingLeadershipMember.imageUrl}
                                    alt="Headshot Preview"
                                    className="h-full w-full object-cover"
                                    referrerPolicy="no-referrer"
                                  />
                                ) : (
                                  <span className="text-[10px] text-slate-500 italic">No image selected</span>
                                )}
                              </div>
                              <input
                                type="text"
                                placeholder="Or paste direct image URL..."
                                value={editingLeadershipMember.imageUrl}
                                onChange={(e) => setEditingLeadershipMember({ ...editingLeadershipMember, imageUrl: e.target.value })}
                                className="w-full text-[10px] px-2 py-1.5 rounded-lg border border-slate-200 focus:outline-none focus:border-teal-500 font-mono"
                              />
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="space-y-1">
                        <label className="text-xs font-bold text-slate-600 uppercase tracking-wide">
                          Executive/Scientific Bio
                        </label>
                        <textarea
                          rows={3}
                          placeholder="Write a brief professional overview of their background..."
                          value={editingLeadershipMember.bio}
                          onChange={(e) => setEditingLeadershipMember({ ...editingLeadershipMember, bio: e.target.value })}
                          className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-teal-500 font-medium"
                        />
                      </div>

                      <div className="flex justify-end space-x-2 pt-2">
                        <button
                          type="button"
                          onClick={() => {
                            setAboutEditMode(false);
                            setEditingLeadershipMember(null);
                          }}
                          className="px-4 py-2 border border-slate-200 rounded-lg text-xs font-bold text-slate-600 hover:bg-slate-50 transition duration-150"
                        >
                          Cancel
                        </button>
                        <button
                          type="submit"
                          className="px-6 py-2 bg-teal-600 hover:bg-teal-500 text-white text-xs font-bold rounded-lg shadow transition duration-150 font-mono uppercase tracking-wider"
                        >
                          Save Director
                        </button>
                      </div>
                    </form>
                  )
                )}
              </div>
            )}

            {/* SUBSECTION 3: EDITORIAL PANEL */}
            {aboutSubTab === 'editorial' && (
              <form
                onSubmit={async (e) => {
                  e.preventDefault();
                  if (isReadOnly) return;
                  setSubmitting(true);
                  const success = await onSaveSettings(settingsForm);
                  setSubmitting(false);
                  if (success) {
                    setOperationSuccess('About Us editorial text updated successfully!');
                    setTimeout(() => setOperationSuccess(''), 4000);
                  }
                }}
                className="space-y-6"
              >
                <div>
                  <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider font-mono mb-1">
                    About Us Header & Introduction
                  </h3>
                  <p className="text-[11px] text-slate-500 mb-4">
                    Control the main page headings, introductory paragraph, corporate vision statement, and corporate mission commitments.
                  </p>
                </div>

                {operationSuccess && (
                  <div className="p-3 bg-teal-50 border border-teal-100 rounded-xl text-teal-800 text-xs font-medium flex items-center">
                    <CheckCircle className="h-4 w-4 text-teal-600 mr-2 shrink-0 animate-bounce" />
                    {operationSuccess}
                  </div>
                )}

                <div className="grid grid-cols-1 gap-5 border border-slate-100 rounded-2xl p-5 bg-slate-50/30">
                  {/* Title & Subtitle */}
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-600 uppercase tracking-wide">
                      Main Editorial Title
                    </label>
                    <input
                      type="text"
                      value={settingsForm.aboutTitle || ''}
                      onChange={(e) => setSettingsForm({ ...settingsForm, aboutTitle: e.target.value })}
                      className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-teal-500 font-medium"
                      placeholder="e.g. Pioneering Global Healthcare Solutions"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-600 uppercase tracking-wide">
                      Introductory Paragraph / Subtitle
                    </label>
                    <textarea
                      rows={3}
                      value={settingsForm.aboutSubtitle || ''}
                      onChange={(e) => setSettingsForm({ ...settingsForm, aboutSubtitle: e.target.value })}
                      className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-teal-500 font-medium"
                      placeholder="Introductory narrative of company identity..."
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Vision Card Editor */}
                  <div className="border border-slate-100 rounded-2xl p-5 bg-slate-900 text-white space-y-4">
                    <div className="flex items-center space-x-2 border-b border-slate-800 pb-3">
                      <Globe className="h-5 w-5 text-teal-400" />
                      <h4 className="text-xs font-bold uppercase tracking-wider font-mono text-slate-300">Corporate Vision Statement</h4>
                    </div>

                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wide">
                        Vision Section Title
                      </label>
                      <input
                        type="text"
                        value={settingsForm.aboutVisionTitle || ''}
                        onChange={(e) => setSettingsForm({ ...settingsForm, aboutVisionTitle: e.target.value })}
                        className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-slate-800 bg-slate-950 focus:outline-none focus:border-teal-400 font-medium text-white"
                        placeholder="e.g. Our Corporate Vision"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wide">
                        Vision Text Body
                      </label>
                      <textarea
                        rows={4}
                        value={settingsForm.aboutVisionText || ''}
                        onChange={(e) => setSettingsForm({ ...settingsForm, aboutVisionText: e.target.value })}
                        className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-slate-800 bg-slate-950 focus:outline-none focus:border-teal-400 font-medium text-white"
                        placeholder="Detailed Vision statement body..."
                      />
                    </div>
                  </div>

                  {/* Mission Card Editor */}
                  <div className="border border-slate-100 rounded-2xl p-5 bg-white space-y-4 shadow-sm">
                    <div className="flex items-center space-x-2 border-b border-slate-100 pb-3">
                      <Award className="h-5 w-5 text-teal-600" />
                      <h4 className="text-xs font-bold uppercase tracking-wider font-mono text-slate-500">Our Commitments & Mission</h4>
                    </div>

                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-slate-600 uppercase tracking-wide">
                        Mission Section Title
                      </label>
                      <input
                        type="text"
                        value={settingsForm.aboutMissionTitle || ''}
                        onChange={(e) => setSettingsForm({ ...settingsForm, aboutMissionTitle: e.target.value })}
                        className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-teal-500 font-medium"
                        placeholder="e.g. Our Commitments & Mission"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-slate-600 uppercase tracking-wide">
                        Mission Text Body
                      </label>
                      <textarea
                        rows={4}
                        value={settingsForm.aboutMissionText || ''}
                        onChange={(e) => setSettingsForm({ ...settingsForm, aboutMissionText: e.target.value })}
                        className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-teal-500 font-medium"
                        placeholder="Detailed Mission statement body..."
                      />
                    </div>
                  </div>
                </div>

                <div className="flex justify-end pt-4">
                  <button
                    type="submit"
                    disabled={isReadOnly || submitting}
                    className="px-6 py-2.5 bg-teal-600 hover:bg-teal-500 disabled:opacity-50 text-white text-xs font-bold rounded-lg shadow transition duration-150 font-mono uppercase tracking-wider flex items-center space-x-1.5"
                  >
                    {submitting ? 'Saving Editorial...' : 'Save Editorial Narrative'}
                  </button>
                </div>
              </form>
            )}

            {aboutSubTab === 'infrastructure' && (
              <form
                onSubmit={async (e) => {
                  e.preventDefault();
                  if (isReadOnly) return;
                  setSubmitting(true);
                  const currentInfraData = settingsForm.infraData || [
                    {
                      id: 1,
                      name: 'Grade A/B Laminar Flow',
                      details: 'HEPA-filtered laminar airflow canopies operating at positive terminal differential pressures to secure aseptic sterile compounding.',
                      calibration: 'HEPA ISO-5 compliant',
                      level: 'Class 100 Sterile',
                    },
                    {
                      id: 2,
                      name: 'Automated Chromatography',
                      details: 'Advanced automated high-performance liquid chromatography (HPLC) systems executing real-time chemical compounding analysis.',
                      calibration: 'Daily validation logs',
                      level: 'Ultra Pure Assay',
                    },
                    {
                      id: 3,
                      name: 'Laser-Guided Serialization',
                      details: 'Robotic blisters packaging lines complete with laser camera scanning for precise barcode tracking and international supply compliance.',
                      calibration: '2D Matrix Serialization',
                      level: 'Zero-Defect Output',
                    },
                  ];
                  const finalSettingsForm = {
                    ...settingsForm,
                    infraSectionBadge: settingsForm.infraSectionBadge || 'Precision Machinery',
                    infraSectionTitle: settingsForm.infraSectionTitle || 'Advanced Plant & Infrastructure',
                    infraSectionDesc: settingsForm.infraSectionDesc || 'Our formulation complexes are engineered to maintain stringent dynamic environmental barriers, utilizing HEPA air recirculators, terminal differential loggers, and analytical chromatography instruments.',
                    infraData: currentInfraData,
                    socialLinks: {
                      ...(settingsForm.socialLinks || {}),
                      infraSectionBadge: settingsForm.infraSectionBadge || 'Precision Machinery',
                      infraSectionTitle: settingsForm.infraSectionTitle || 'Advanced Plant & Infrastructure',
                      infraSectionDesc: settingsForm.infraSectionDesc || 'Our formulation complexes are engineered to maintain stringent dynamic environmental barriers, utilizing HEPA air recirculators, terminal differential loggers, and analytical chromatography instruments.',
                      infraData: currentInfraData,
                    }
                  };
                  const success = await onSaveSettings(finalSettingsForm);
                  setSubmitting(false);
                  if (success) {
                    setOperationSuccess('Plant & Infrastructure CMS settings updated successfully!');
                    setTimeout(() => setOperationSuccess(''), 4000);
                  }
                }}
                className="space-y-6"
              >
                <div>
                  <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider font-mono mb-1">
                    Advanced Plant & Infrastructure CMS
                  </h3>
                  <p className="text-[11px] text-slate-500 mb-4">
                    Customize the sub-section details, machinery descriptions, calibration metrics, and quality levels for the About Us page.
                  </p>
                </div>

                {operationSuccess && (
                  <div className="p-3 bg-teal-50 border border-teal-100 rounded-xl text-teal-800 text-xs font-medium flex items-center">
                    <CheckCircle className="h-4 w-4 text-teal-600 mr-2 shrink-0 animate-bounce" />
                    {operationSuccess}
                  </div>
                )}

                {/* Section Header Settings */}
                <div className="grid grid-cols-1 gap-5 border border-slate-100 rounded-2xl p-5 bg-slate-50/30">
                  <h4 className="text-xs font-bold uppercase tracking-wider font-mono text-slate-600 border-b border-slate-100 pb-2">
                    Section Header Texts
                  </h4>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wide">
                        Section Badge Text
                      </label>
                      <input
                        type="text"
                        value={settingsForm.infraSectionBadge || 'Precision Machinery'}
                        onChange={(e) => updateInfraHeader('infraSectionBadge', e.target.value)}
                        className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-teal-500 font-medium"
                        placeholder="e.g. Precision Machinery"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wide">
                        Section Heading Title
                      </label>
                      <input
                        type="text"
                        value={settingsForm.infraSectionTitle || 'Advanced Plant & Infrastructure'}
                        onChange={(e) => updateInfraHeader('infraSectionTitle', e.target.value)}
                        className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-teal-500 font-medium"
                        placeholder="e.g. Advanced Plant & Infrastructure"
                      />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wide">
                      Section Narrative Description
                    </label>
                    <textarea
                      rows={3}
                      value={settingsForm.infraSectionDesc || 'Our formulation complexes are engineered to maintain stringent dynamic environmental barriers, utilizing HEPA air recirculators, terminal differential loggers, and analytical chromatography instruments.'}
                      onChange={(e) => updateInfraHeader('infraSectionDesc', e.target.value)}
                      className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-teal-500 font-medium"
                      placeholder="Narrative explaining physical facility infrastructure..."
                    />
                  </div>
                </div>

                {/* 3 Machinery Cards Settings */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {[0, 1, 2].map((idx) => {
                    const defaults = [
                      {
                        id: 1,
                        name: 'Grade A/B Laminar Flow',
                        details: 'HEPA-filtered laminar airflow canopies operating at positive terminal differential pressures to secure aseptic sterile compounding.',
                        calibration: 'HEPA ISO-5 compliant',
                        level: 'Class 100 Sterile',
                      },
                      {
                        id: 2,
                        name: 'Automated Chromatography',
                        details: 'Advanced automated high-performance liquid chromatography (HPLC) systems executing real-time chemical compounding analysis.',
                        calibration: 'Daily validation logs',
                        level: 'Ultra Pure Assay',
                      },
                      {
                        id: 3,
                        name: 'Laser-Guided Serialization',
                        details: 'Robotic blisters packaging lines complete with laser camera scanning for precise barcode tracking and international supply compliance.',
                        calibration: '2D Matrix Serialization',
                        level: 'Zero-Defect Output',
                      },
                    ];
                    const item = (settingsForm.infraData || [])[idx] || defaults[idx];
                    return (
                      <div key={idx} className="border border-slate-150 rounded-2xl p-5 bg-white space-y-4 shadow-sm">
                        <div className="flex items-center space-x-2 border-b border-slate-100 pb-3">
                          <span className="h-6 w-6 rounded-full bg-teal-500/10 text-teal-600 flex items-center justify-center font-mono text-xs font-bold">
                            {idx + 1}
                          </span>
                          <h4 className="text-xs font-bold uppercase tracking-wider font-mono text-slate-700">
                            Infrastructure Asset {idx + 1}
                          </h4>
                        </div>

                        <div className="space-y-1">
                          <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wide">
                            Machinery / Process Name
                          </label>
                          <input
                            type="text"
                            value={item.name}
                            onChange={(e) => updateInfraItem(idx, 'name', e.target.value)}
                            className="w-full text-xs px-3 py-2 rounded-xl border border-slate-200 focus:outline-none focus:border-teal-500 font-medium"
                            placeholder="e.g. Ultra Pure Formulation"
                          />
                        </div>

                        <div className="space-y-1">
                          <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wide">
                            Process Technical Details
                          </label>
                          <textarea
                            rows={3}
                            value={item.details}
                            onChange={(e) => updateInfraItem(idx, 'details', e.target.value)}
                            className="w-full text-xs px-3 py-2 rounded-xl border border-slate-200 focus:outline-none focus:border-teal-500 font-medium"
                            placeholder="Describe physical operations, sterile sweeps..."
                          />
                        </div>

                        <div className="space-y-1">
                          <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wide">
                            Calibration / Metric
                          </label>
                          <input
                            type="text"
                            value={item.calibration}
                            onChange={(e) => updateInfraItem(idx, 'calibration', e.target.value)}
                            className="w-full text-xs px-3 py-2 rounded-xl border border-slate-200 focus:outline-none focus:border-teal-500 font-medium"
                            placeholder="e.g. ISO-5 Certified"
                          />
                        </div>

                        <div className="space-y-1">
                          <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wide">
                            Performance / Security Level
                          </label>
                          <input
                            type="text"
                            value={item.level}
                            onChange={(e) => updateInfraItem(idx, 'level', e.target.value)}
                            className="w-full text-xs px-3 py-2 rounded-xl border border-slate-200 focus:outline-none focus:border-teal-500 font-medium"
                            placeholder="e.g. Zero-Defect Output"
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Save button bar */}
                <div className="flex justify-end pt-4 border-t border-slate-100">
                  <button
                    type="submit"
                    disabled={isReadOnly || submitting}
                    className="px-6 py-2.5 bg-teal-600 hover:bg-teal-500 disabled:opacity-50 text-white text-xs font-bold rounded-lg shadow transition duration-150 font-mono uppercase tracking-wider flex items-center space-x-1.5"
                  >
                    {submitting ? 'Saving Infrastructure...' : 'Save Infrastructure Settings'}
                  </button>
                </div>
              </form>
            )}
          </div>
        )}

        {activeSection === 'users' && (
          <UserManagement currentUserRole={currentUserRole} userEmail={userEmail} />
        )}

        {imageEditorQueue.length > 0 && (
          <ImageEditorModal
            isOpen={true}
            onClose={() => setImageEditorQueue(prev => prev.slice(1))}
            imageFile={imageEditorQueue[0]}
            onSave={handleImageEditorSave}
          />
        )}

        {fullScreenImageUrl && (
          <div 
            className="fixed inset-0 bg-slate-950/95 backdrop-blur-md flex flex-col items-center justify-center z-[110] p-4 animate-fade-in"
            onClick={() => setFullScreenImageUrl(null)}
          >
            {/* Close Button / Top Bar */}
            <div className="absolute top-4 left-0 right-0 px-6 flex justify-between items-center z-[120]">
              <div className="text-left font-mono">
                <span className="text-teal-400 font-bold text-xs uppercase tracking-wider block">Original Quality Spec</span>
                <span className="text-[10px] text-slate-400 uppercase">
                  {getImgTitle(fullScreenImageUrl) || "Product Image Asset"}
                </span>
              </div>
              <button
                onClick={() => setFullScreenImageUrl(null)}
                className="text-slate-400 hover:text-white transition duration-150 p-2 rounded-full bg-white/5 hover:bg-white/10"
                title="Close original size preview"
              >
                <X className="h-6 w-6" />
              </button>
            </div>

            {/* Main Centered Image Container */}
            <div 
              className="relative max-h-[80vh] max-w-full flex items-center justify-center p-2"
              onClick={(e) => e.stopPropagation()}
            >
              <img
                src={getImgSrc(fullScreenImageUrl, 'original')}
                alt={getImgAlt(fullScreenImageUrl, "Original pharmaceutical spec")}
                className="max-h-[80vh] max-w-full object-contain rounded-lg shadow-2xl border border-slate-800"
                referrerPolicy="no-referrer"
              />
            </div>

            {/* Bottom Info Bar */}
            <div className="mt-4 text-center font-mono text-[10px] text-slate-500 max-w-md">
              <p>Alt text: <span className="text-slate-300 italic">"{getImgAlt(fullScreenImageUrl) || 'No custom alt text set'}"</span></p>
              <p className="mt-1 text-slate-600">Click anywhere outside to exit</p>
            </div>
          </div>
        )}

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

      </main>
    </div>
  );
}
