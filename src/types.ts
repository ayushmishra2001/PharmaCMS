/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export type UserRole = 'super_admin' | 'admin' | 'content_manager' | 'viewer';

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  tenantId: string;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  description: string;
  icon: string; // Lucide icon name
  parentId?: string;
}

export interface Product {
  id: string;
  name: string;
  brandName: string;
  genericName: string;
  categoryId: string;
  composition: string;
  strength: string;
  indications: string;
  contraindications: string;
  sideEffects: string;
  dosage: string;
  packaging: string;
  status: 'draft' | 'published' | 'archived';
  isFeatured: boolean;
  brochureUrl?: string;
  seoTitle: string;
  seoDesc: string;
  images?: string[];
}

export interface Certification {
  id: string;
  name: string;
  type: 'ISO' | 'GMP' | 'WHO-GMP' | 'FDA' | 'FSSAI' | 'CE' | 'MSME';
  description: string;
  issuer: string;
  year: number;
  imageUrl?: string;
}

export interface Facility {
  id: string;
  name: string;
  type: string; // e.g., "Solid Oral", "Sterile Injectable", "R&D Lab"
  capacity: string; // e.g., "10 Million units/day"
  description: string;
  location: string;
  imageUrl: string;
}

export interface JobOpening {
  id: string;
  title: string;
  department: string;
  location: string;
  employmentType: 'Full-time' | 'Contract' | 'Part-time' | 'Remote';
  description: string;
  status: 'open' | 'closed';
  postedAt: string;
}

export interface JobApplication {
  id: string;
  jobId: string;
  jobTitle: string;
  name: string;
  email: string;
  phone: string;
  coverLetter: string;
  resumeName: string; // simulated upload name
  status: 'new' | 'reviewed' | 'shortlisted' | 'rejected';
  createdAt: string;
}

export interface Inquiry {
  id: string;
  type: 'general' | 'product' | 'distributor' | 'newsletter';
  name: string;
  email: string;
  phone?: string;
  companyName?: string; // for distributors
  subject?: string;
  message: string;
  productId?: string; // for product-specific inquiries
  productBrandName?: string;
  status: 'unread' | 'read' | 'closed';
  notes?: string; // admin internal notes
  createdAt: string;
}

export interface ActivityLog {
  id: string;
  userEmail: string;
  action: string; // e.g., "Created Product", "Updated Site Settings", "Responded to Inquiry"
  entityType: 'product' | 'category' | 'certification' | 'job' | 'inquiry' | 'settings' | 'application';
  entityName: string;
  createdAt: string;
}

export interface SiteSettings {
  companyName: string;
  logoUrl: string;
  tagline: string;
  contactEmail: string;
  contactPhone: string;
  address: string;
  registrationNumber: string; // e.g., CIN
  drugLicenseNumber: string;
  gstNumber: string;
  mapEmbedUrl: string;
  gaId: string;
  socialLinks: {
    linkedin?: string;
    twitter?: string;
    website?: string;
    [key: string]: any;
  };
  // Expanded fields to make every part of the website customizable via CMS
  heroTitle?: string;
  heroDescription?: string;
  metric1Value?: string;
  metric1Label?: string;
  metric2Value?: string;
  metric2Label?: string;
  metric3Value?: string;
  metric3Label?: string;
  metric4Value?: string;
  metric4Label?: string;
  complianceBadgeText?: string;
  regulatoryTitle?: string;
  regulatoryDesc?: string;
  regulatoryFeature1Title?: string;
  regulatoryFeature1Desc?: string;
  regulatoryFeature2Title?: string;
  regulatoryFeature2Desc?: string;
  regulatoryFeature3Title?: string;
  regulatoryFeature3Desc?: string;
  regulatoryFeature4Title?: string;
  regulatoryFeature4Desc?: string;
  // Section visibility controls
  showHome?: boolean;
  showAbout?: boolean;
  showCatalog?: boolean;
  showFacilities?: boolean;
  showCertifications?: boolean;
  showGallery?: boolean;
  showCareers?: boolean;
  showContact?: boolean;
  // Corporate Home subsections visibility controls
  showHomeHero?: boolean;
  showHomeMetrics?: boolean;
  showHomeFeatured?: boolean;
  showHomeRegulatory?: boolean;
  showHomeDistributor?: boolean;
  showHomeLabPreview?: boolean;
  labTitle?: string;
  labSterilityText?: string;
  labTemperature?: string;

  // Lab preview specimen - Cardio tab
  labCardioTitle?: string;
  labCardioActive?: string;
  labCardioFormula?: string;
  labCardioDisintegration?: string;
  labCardioChroma?: string;
  labCardioStructure?: string;
  labCardioStatus?: string;

  // Lab preview specimen - Antibiotic tab
  labAntibioticTitle?: string;
  labAntibioticActive?: string;
  labAntibioticFormula?: string;
  labAntibioticDisintegration?: string;
  labAntibioticChroma?: string;
  labAntibioticStructure?: string;
  labAntibioticStatus?: string;

  // Lab preview specimen - Neuro tab
  labNeuroTitle?: string;
  labNeuroActive?: string;
  labNeuroFormula?: string;
  labNeuroDisintegration?: string;
  labNeuroChroma?: string;
  labNeuroStructure?: string;
  labNeuroStatus?: string;

  // New CMS customizable fields
  heroTrustPoint1?: string;
  heroTrustPoint2?: string;
  heroTrustPoint3?: string;
  heroTrustPoint4?: string;
  featuredBadgeText?: string;
  featuredTitle?: string;
  featuredDesc?: string;
  regulatoryBadgeText?: string;
  distributorTitle?: string;
  distributorDesc?: string;
  heroSlides?: string[];
  enableHeroSlider?: boolean;
  heroSliderInterval?: number;
  enableHeroOverlay?: boolean;
  heroOverlayStrength?: 'light' | 'medium' | 'dark' | 'heavy';

  // About Us customizations
  aboutTitle?: string;
  aboutSubtitle?: string;
  aboutVisionTitle?: string;
  aboutVisionText?: string;
  aboutMissionTitle?: string;
  aboutMissionText?: string;
  seoTitle?: string;
  seoDesc?: string;
  facilitiesTitle?: string;
  mediaShowcaseTitle?: string;
  infraSectionBadge?: string;
  infraSectionTitle?: string;
  infraSectionDesc?: string;
  infraData?: {
    id: number;
    name: string;
    details: string;
    calibration: string;
    level: string;
  }[];
}

export interface GalleryItem {
  id: string;
  title: string;
  category: 'factory' | 'events' | 'csr' | 'images' | 'videos';
  type: 'images' | 'videos';
  description: string;
  imageUrl: string;
}

export interface TimelineEvent {
  id: string;
  year: number;
  title: string;
  details: string;
  regulatory: string;
  reach: string;
  scope: string;
  imageUrl: string;
}

export interface LeadershipMember {
  id: string;
  name: string;
  role: string;
  credentials: string;
  experience: string;
  bio: string;
  imageUrl: string;
}

