import {
  Category, Product, Certification, Facility, JobOpening, JobApplication, Inquiry,
  ActivityLog, SiteSettings, GalleryItem, TimelineEvent, LeadershipMember
} from '../types';

export function mapCategory(row: any): Category {
  return {
    id: row.id,
    name: row.name,
    slug: row.slug,
    description: row.description || '',
    icon: row.icon || 'Pills',
    parentId: row.parent_id || undefined
  };
}

export function mapProduct(row: any): Product {
  return {
    id: row.id,
    name: row.name,
    brandName: row.brand_name,
    genericName: row.generic_name,
    categoryId: row.category_id || '',
    composition: row.composition || '',
    strength: row.strength || '',
    indications: row.indications || '',
    contraindications: row.contraindications || '',
    sideEffects: row.side_effects || '',
    dosage: row.dosage || '',
    packaging: row.packaging || '',
    status: row.status || 'published',
    isFeatured: !!row.is_featured,
    brochureUrl: row.brochure_url || undefined,
    seoTitle: row.seo_title || '',
    seoDesc: row.seo_desc || '',
    images: row.images || []
  };
}

export function mapCertification(row: any): Certification {
  return {
    id: row.id,
    name: row.name,
    type: row.type || 'GMP',
    description: row.description || '',
    issuer: row.issuer || '',
    year: Number(row.year) || 2026,
    imageUrl: row.image_url || undefined
  };
}

export function mapFacility(row: any): Facility {
  return {
    id: row.id,
    name: row.name,
    type: row.type || '',
    capacity: row.capacity || '',
    description: row.description || '',
    location: row.location || '',
    imageUrl: row.image_url || ''
  };
}

export function mapJobOpening(row: any): JobOpening {
  return {
    id: row.id,
    title: row.title,
    department: row.department,
    location: row.location,
    employmentType: row.employment_type || 'Full-time',
    description: row.description,
    status: row.status || 'open',
    postedAt: row.posted_at || row.created_at || new Date().toISOString()
  };
}

export function mapJobApplication(row: any): JobApplication {
  return {
    id: row.id,
    jobId: row.job_id,
    jobTitle: row.job_title || '',
    name: row.name,
    email: row.email,
    phone: row.phone,
    coverLetter: row.cover_letter || '',
    resumeName: row.resume_name || '',
    status: row.status || 'new',
    createdAt: row.created_at || new Date().toISOString()
  };
}

export function mapInquiry(row: any): Inquiry {
  return {
    id: row.id,
    type: row.type || 'general',
    name: row.name,
    email: row.email,
    phone: row.phone || undefined,
    companyName: row.company_name || undefined,
    subject: row.subject || undefined,
    message: row.message || '',
    productId: row.product_id || undefined,
    productBrandName: row.product_brand_name || undefined,
    status: row.status || 'unread',
    notes: row.notes || undefined,
    createdAt: row.created_at || new Date().toISOString()
  };
}

export function mapActivityLog(row: any): ActivityLog {
  return {
    id: row.id,
    userEmail: row.user_email || 'system',
    action: row.action || '',
    entityType: row.entity_type || 'product',
    entityName: row.entity_name || '',
    createdAt: row.created_at || new Date().toISOString()
  };
}

export function mapSiteSettings(row: any): SiteSettings {
  const safeRow = row || {};
  const socialLinksRaw = typeof safeRow.social_links === 'string' 
    ? JSON.parse(safeRow.social_links) 
    : (safeRow.social_links || {});

  const linkedin = socialLinksRaw.linkedin ?? 'https://linkedin.com/company/pharma';
  const twitter = socialLinksRaw.twitter ?? 'https://twitter.com/pharma';
  const website = socialLinksRaw.website ?? 'https://pharma.com';

  const infraSectionBadge = socialLinksRaw.infraSectionBadge ?? 'Precision Machinery';
  const infraSectionTitle = socialLinksRaw.infraSectionTitle ?? 'Advanced Plant & Infrastructure';
  const infraSectionDesc = socialLinksRaw.infraSectionDesc ?? 'Our formulation complexes are engineered to maintain stringent dynamic environmental barriers, utilizing HEPA air recirculators, terminal differential loggers, and analytical chromatography instruments.';
  
  const infraData = socialLinksRaw.infraData || [
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

  return {
    companyName: safeRow.company_name ?? 'Pharma Private Limited',
    logoUrl: safeRow.logo_url ?? '',
    tagline: safeRow.tagline ?? 'Pioneering WHO-GMP Compliant Formulations.',
    contactEmail: safeRow.contact_email ?? 'info@pharma.com',
    contactPhone: safeRow.contact_phone ?? '+91 22 2400 9000',
    address: safeRow.address ?? 'Scientific Zone Alpha, Sector-4, Navi Mumbai, India',
    registrationNumber: safeRow.registration_number ?? 'U24239MH2026PTC384920',
    drugLicenseNumber: safeRow.drug_license_number ?? 'DL-20B-184920 / DL-21B-184921',
    gstNumber: safeRow.gst_number ?? '27AABCA1234F1Z8',
    mapEmbedUrl: safeRow.map_embed_url ?? 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3771.8484918733357!2d73.011833!3d19.026833!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3be7c3df952bf65d%3A0x6a053cbfd55fc9db!2sNavi%20Mumbai!5e0!3m2!1sen!2sin!4v1783240356718',
    gaId: safeRow.ga_id ?? 'G-2026',
    socialLinks: {
      linkedin,
      twitter,
      website,
      infraSectionBadge,
      infraSectionTitle,
      infraSectionDesc,
      infraData,
    },
    infraSectionBadge,
    infraSectionTitle,
    infraSectionDesc,
    infraData,
    
    heroTitle: safeRow.hero_title ?? 'WHO-GMP & Regulatory Aligned Quality',
    heroDescription: safeRow.hero_description ?? 'Delivering precision formulation, high-purity APIs, and aseptic injectable dossiers to global markets.',
    metric1Value: safeRow.metric1_value ?? 'WHO-GMP',
    metric1Label: safeRow.metric1_label ?? 'Standard Certification',
    metric2Value: safeRow.metric2_value ?? '15M+',
    metric2Label: safeRow.metric2_label ?? 'Daily Tablet Capacity',
    metric3Value: safeRow.metric3_value ?? '25+',
    metric3Label: safeRow.metric3_label ?? 'Global Export Markets',
    metric4Value: safeRow.metric4_value ?? 'Zone I-IV',
    metric4Label: safeRow.metric4_label ?? 'Climatic Stability Certified',
    complianceBadgeText: safeRow.compliance_badge_text ?? 'GLOBAL STANDARD PHARMACEUTICAL MANUFACTURING',
    regulatoryTitle: safeRow.regulatory_title ?? 'Dossier & Formulation Excellence',
    regulatoryDesc: safeRow.regulatory_desc ?? 'Conforming to Common Technical Document (CTD/eCTD) guidelines for rapid country entry validation.',
    regulatoryFeature1Title: safeRow.regulatory_feature1_title ?? 'Dossier Support',
    regulatoryFeature1Desc: safeRow.regulatory_feature1_desc ?? 'CTD / eCTD formatting prepared for clinical submissions.',
    regulatoryFeature2Title: safeRow.regulatory_feature2_title ?? 'Stability Logs',
    regulatoryFeature2Desc: safeRow.regulatory_feature2_desc ?? 'Advanced climatic chambers covering Zone I through Zone IV regulations.',
    regulatoryFeature3Title: safeRow.regulatory_feature3_title ?? 'Impurity Profiling',
    regulatoryFeature3Desc: safeRow.regulatory_feature3_desc ?? 'Conducted via ultra-clean high performance liquid chromatography.',
    regulatoryFeature4Title: safeRow.regulatory_feature4_title ?? 'Aseptic Protocols',
    regulatoryFeature4Desc: safeRow.regulatory_feature4_desc ?? 'Barrier isolators and Class A particle sweeps operating 24/7.',
    
    qaTitle: safeRow.qa_title ?? 'Standard GMP Quality Testing Routine',
    qaDesc: safeRow.qa_desc ?? 'Our quality control lab performs rigorous assessment parameters before releasing any raw pharmaceutical materials or final formulations.',
    qaBadge: safeRow.qa_badge ?? '100% TESTING COMPLIANCE LOGS',
    qaPhase1Title: safeRow.qa_phase1_title ?? 'Raw Material Assay',
    qaPhase1Desc: safeRow.qa_phase1_desc ?? 'High performance liquid chromatography validation of incoming active ingredients (APIs).',
    qaPhase2Title: safeRow.qa_phase2_title ?? 'Disintegration & Hardness',
    qaPhase2Desc: safeRow.qa_phase2_desc ?? 'In-line dissolution logging of tablets and vials every 30 minutes inside manufacturing bays.',
    qaPhase3Title: safeRow.qa_phase3_title ?? 'Stability & Sterility Scan',
    qaPhase3Desc: safeRow.qa_phase3_desc ?? 'Validation of microbial absence, endotoxin logs, and terminal shelf life tracking inside stability chambers.',
    
    seoTitle: safeRow.seo_title ?? 'Pharma - WHO-GMP & Regulatory Aligned Quality',
    seoDesc: safeRow.seo_desc ?? 'Pioneering pharmaceutical formulation, high-purity APIs, and sterile injectables for global markets.',
    aboutSubtitle: safeRow.about_subtitle ?? 'For over two decades, Formulations has committed itself to scientific integrity, rigorous regulatory compliance, and high-bioavailability formulation research, supplying certified clinical therapeutics across five continents.',
    facilitiesTitle: safeRow.facilities_title ?? 'Operations & Sterile Facilities',
    mediaShowcaseTitle: safeRow.media_showcase_title ?? 'Media Showcase',
    
    showHome: safeRow.show_home !== false,
    showAbout: safeRow.show_about !== false,
    showCatalog: safeRow.show_catalog !== false,
    showFacilities: safeRow.show_facilities !== false,
    showCertifications: safeRow.show_certifications !== false,
    showGallery: safeRow.show_gallery !== false,
    showCareers: safeRow.show_careers !== false,
    showContact: safeRow.show_contact !== false,
    showHomeHero: safeRow.show_home_hero !== false,
    showHomeMetrics: safeRow.show_home_metrics !== false,
    showHomeFeatured: safeRow.show_home_featured !== false,
    showHomeRegulatory: safeRow.show_home_regulatory !== false,
    showHomeDistributor: safeRow.show_home_distributor !== false,
    showHomeLabPreview: safeRow.show_home_lab_preview !== false,

    labTitle: safeRow.lab_title ?? 'Aseptic & Quality Control Lab',
    labSterilityText: safeRow.lab_sterility_text ?? 'Class 100 Aseptic Facility with 24/7 micro-particle sweeps.',
    labTemperature: safeRow.lab_temperature ?? '21.5°C (±0.5°C)',

    labCardioTitle: safeRow.lab_cardio_title ?? 'Atorvastatin Formulation',
    labCardioActive: safeRow.lab_cardio_active ?? 'Atorvastatin Calcium',
    labCardioFormula: safeRow.lab_cardio_formula ?? 'C33H34FN2O5-Ca',
    labCardioDisintegration: safeRow.lab_cardio_disintegration ?? '11 mins 45s',
    labCardioChroma: safeRow.lab_cardio_chroma ?? '99.82% Peak Assay purity',
    labCardioStructure: safeRow.lab_cardio_structure ?? 'Hemi-calcium crystalline salt',
    labCardioStatus: safeRow.lab_cardio_status ?? 'Verified Stable',

    labAntibioticTitle: safeRow.lab_antibiotic_title ?? 'Amoxicillin Formulation',
    labAntibioticActive: safeRow.lab_antibiotic_active ?? 'Amoxicillin Trihydrate',
    labAntibioticFormula: safeRow.lab_antibiotic_formula ?? 'C16H19N3O5S-3H2O',
    labAntibioticDisintegration: safeRow.lab_antibiotic_disintegration ?? '8 mins 15s',
    labAntibioticChroma: safeRow.lab_antibiotic_chroma ?? '99.45% Assay purity',
    labAntibioticStructure: safeRow.lab_antibiotic_structure ?? 'Beta-lactam core stability',
    labAntibioticStatus: safeRow.lab_antibiotic_status ?? 'Verified Stable',

    labNeuroTitle: safeRow.lab_neuro_title ?? 'Donepezil Formulation',
    labNeuroActive: safeRow.lab_neuro_active ?? 'Donepezil Hydrochloride',
    labNeuroFormula: safeRow.lab_neuro_formula ?? 'C24H30ClNO3',
    labNeuroDisintegration: safeRow.lab_neuro_disintegration ?? '14 mins 20s',
    labNeuroChroma: safeRow.lab_neuro_chroma ?? '99.90% Assay purity',
    labNeuroStructure: safeRow.lab_neuro_structure ?? 'Piperidine derivative crystalline form',
    labNeuroStatus: safeRow.lab_neuro_status ?? 'Verified Stable',

    heroTrustPoint1: safeRow.hero_trust_point1 ?? 'WHO-GMP & USFDA Aligned Protocols',
    heroTrustPoint2: safeRow.hero_trust_point2 ?? 'Fully Documented CTD/eCTD Dossiers',
    heroTrustPoint3: safeRow.hero_trust_point3 ?? 'Global Regulatory Affiliation',
    heroTrustPoint4: safeRow.hero_trust_point4 ?? 'Zero-Defect Quality Assurance',

    featuredBadgeText: safeRow.featured_badge_text ?? 'FEATURED CLINICAL CATALOGUE',
    featuredTitle: safeRow.featured_title ?? 'High-Bioavailability Products',
    featuredDesc: safeRow.featured_desc ?? 'Explore our leading cardiovascular, antibiotic, and neuropsychiatry therapeutic formulations.',

    regulatoryBadgeText: safeRow.regulatory_badge_text ?? 'COMPLIANCE & REGULATORY STANDARDS',

    distributorTitle: safeRow.distributor_title ?? 'Global Distribution Network',
    distributorDesc: safeRow.distributor_desc ?? 'Join our trusted worldwide supply chain as a registered clinical distribution partner.',

    heroSlides: typeof safeRow.hero_slides === 'string' 
      ? JSON.parse(safeRow.hero_slides) 
      : (safeRow.hero_slides || []),
    
    enableHeroSlider: safeRow.enable_hero_slider !== false,
    heroSliderInterval: safeRow.hero_slider_interval ?? 5000,
    enableHeroOverlay: safeRow.enable_hero_overlay !== false,
    heroOverlayStrength: safeRow.hero_overlay_strength ?? 'medium',

    aboutTitle: safeRow.about_title ?? 'About Our Enterprise',
    aboutVisionTitle: safeRow.about_vision_title ?? 'Our Vision',
    aboutVisionText: safeRow.about_vision_text ?? 'To be a premier global pharmaceutical developer of high-bioavailability, affordable essential clinical treatments.',
    aboutMissionTitle: safeRow.about_mission_title ?? 'Our Mission',
    aboutMissionText: safeRow.about_mission_text ?? 'Sustaining clinical therapeutic integrity, rigorous stability protocols, and transparent supply documentation.'
  };
}

export function mapGalleryItem(row: any): GalleryItem {
  return {
    id: row.id,
    title: row.title || '',
    category: row.category || 'images',
    type: row.type || 'images',
    description: row.description || '',
    imageUrl: row.image_url || ''
  };
}

export function mapTimelineEvent(row: any): TimelineEvent {
  return {
    id: row.id,
    year: Number(row.year) || 2026,
    title: row.title || '',
    details: row.description || '',
    regulatory: row.regulatory || '',
    reach: row.reach || '',
    scope: row.scope || '',
    imageUrl: row.image_url || ''
  };
}

export function mapLeadershipMember(row: any): LeadershipMember {
  return {
    id: row.id,
    name: row.name || '',
    role: row.role || '',
    credentials: row.credentials || '',
    experience: row.experience || '',
    bio: row.bio || '',
    imageUrl: row.image_url || ''
  };
}
