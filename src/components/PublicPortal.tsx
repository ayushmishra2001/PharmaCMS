"use client";
/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { motion } from 'motion/react';
import {
  Search, Filter, BookOpen, Briefcase, Award, Building, Mail, MapPin, Phone,
  FileText, ArrowRight, CheckCircle2, ChevronRight, Activity, Calendar, Download, Send, Globe, Lock, Linkedin, Twitter,
  ShieldCheck, FlaskConical, Thermometer, Database, Menu, X, Play, Image as ImageIcon
} from 'lucide-react';
import { Product, Category, Certification, Facility, JobOpening, SiteSettings, Inquiry, JobApplication, GalleryItem, TimelineEvent, LeadershipMember } from '../types';
import { getImgSrc, getImgAlt, getImgTitle } from '../lib/imageUtils';

interface PublicPortalProps {
  categories: Category[];
  products: Product[];
  certifications: Certification[];
  facilities: Facility[];
  jobs: JobOpening[];
  settings: SiteSettings;
  galleryItems: GalleryItem[];
  timelineData: TimelineEvent[];
  leadershipData: LeadershipMember[];
  onSubmitInquiry: (inq: Omit<Inquiry, 'id' | 'status' | 'createdAt'>) => Promise<boolean>;
  onSubmitApplication: (app: Omit<JobApplication, 'id' | 'status' | 'createdAt'>) => Promise<boolean>;
  activeTab: 'home' | 'about' | 'catalog' | 'facilities' | 'certifications' | 'gallery' | 'careers' | 'contact';
  setActiveTab: (tab: 'home' | 'about' | 'catalog' | 'facilities' | 'certifications' | 'gallery' | 'careers' | 'contact') => void;
}

function ProductImageManualSlider({ images, dark = false }: { images: string[]; dark?: boolean }) {
  const [idx, setIdx] = useState(0);
  
  if (!images || images.length === 0) {
    return (
      <div className={`w-full h-full flex items-center justify-center text-[10px] font-mono italic ${dark ? 'bg-slate-950 text-slate-500' : 'bg-slate-50 text-slate-400'}`}>
        No images uploaded
      </div>
    );
  }

  const handlePrev = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIdx(prev => (prev === 0 ? images.length - 1 : prev - 1));
  };

  const handleNext = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIdx(prev => (prev === images.length - 1 ? 0 : prev + 1));
  };

  return (
    <div className={`relative w-full h-full flex items-center justify-center select-none group/slider transition-colors duration-300 ${dark ? 'bg-slate-950' : 'bg-slate-50/50'}`}>
      <img
        src={getImgSrc(images[idx], 'medium')}
        alt={getImgAlt(images[idx], "Product monograph slide")}
        title={getImgTitle(images[idx], "Product monograph visual representation")}
        className="max-h-[90%] max-w-[90%] object-contain mix-blend-multiply"
        referrerPolicy="no-referrer"
      />
      {images.length > 1 && (
        <>
          <button
            onClick={handlePrev}
            className="absolute left-2 top-1/2 -translate-y-1/2 w-6 h-6 bg-slate-900/80 hover:bg-blue-slate-500 hover:text-white text-white rounded-full flex items-center justify-center text-[11px] opacity-0 group-hover/slider:opacity-100 transition duration-150 z-10 cursor-pointer shadow-md"
            type="button"
            title="Previous image"
          >
            &larr;
          </button>
          <button
            onClick={handleNext}
            className="absolute right-2 top-1/2 -translate-y-1/2 w-6 h-6 bg-slate-900/80 hover:bg-blue-slate-500 hover:text-white text-white rounded-full flex items-center justify-center text-[11px] opacity-0 group-hover/slider:opacity-100 transition duration-150 z-10 cursor-pointer shadow-md"
            type="button"
            title="Next image"
          >
            &rarr;
          </button>
          <div className="absolute bottom-2 left-0 right-0 flex justify-center space-x-1.5 z-10">
            {images.map((_, i) => (
              <button
                key={i}
                type="button"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  setIdx(i);
                }}
                className={`w-1.5 h-1.5 rounded-full transition-all duration-200 ${
                  i === idx ? 'bg-blue-slate-500 w-3' : 'bg-slate-300'
                }`}
              />
            ))}
          </div>
        </>
      )}
      <span className="absolute top-2 right-2 bg-slate-900/70 backdrop-blur-sm text-white text-[9px] font-mono px-2 py-0.5 rounded-full z-10">
        {idx + 1}/{images.length}
      </span>
    </div>
  );
}

// Rich Static Data representing Company Infrastructure has been moved to CMS / SiteSettings

export default function PublicPortal({
  categories,
  products,
  certifications,
  facilities,
  jobs,
  settings,
  galleryItems,
  timelineData,
  leadershipData,
  onSubmitInquiry,
  onSubmitApplication,
  activeTab,
  setActiveTab,
}: PublicPortalProps) {

  const availableTabs = [
    { id: 'home', label: 'Corporate Home', visible: settings?.showHome !== false },
    { id: 'about', label: 'About Us', visible: settings?.showAbout !== false },
    { id: 'catalog', label: 'Formulations Catalog', visible: settings?.showCatalog !== false },
    { id: 'facilities', label: 'Manufacturing Facilities', visible: settings?.showFacilities !== false },
    { id: 'certifications', label: 'Quality & Regulatory', visible: settings?.showCertifications !== false },
    { id: 'careers', label: 'Careers & Dossiers', visible: settings?.showCareers !== false },
    { id: 'contact', label: 'Global Partnerships', visible: settings?.showContact !== false },
  ].filter(tab => tab.visible);

  React.useEffect(() => {
    if (availableTabs.length > 0 && !availableTabs.some(t => t.id === activeTab)) {
      setActiveTab(availableTabs[0].id as any);
    }
  }, [settings, activeTab, availableTabs]);

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [spotlightClass, setSpotlightClass] = useState<'cardio' | 'anti_infective' | 'neuro'>('cardio');
  const [dossierNotice, setDossierNotice] = useState<string | null>(null);
  const [activeSlideIdx, setActiveSlideIdx] = useState(0);
  
  // Interactive About & Gallery Page states
  const [activeTimelineYear, setActiveTimelineYear] = useState<number>(2004);
  const [selectedGalleryCategory, setSelectedGalleryCategory] = useState<string>('all');
  const [lightboxImg, setLightboxImg] = useState<string | null>(null);
  const [galleryCarouselIdx, setGalleryCarouselIdx] = useState(0);

  React.useEffect(() => {
    if (settings?.showGallery !== false) {
      const interval = setInterval(() => {
        setGalleryCarouselIdx((prev) => (prev + 1) % galleryItems.length);
      }, 5000); // 5 seconds interval for smooth auto sliding
      return () => clearInterval(interval);
    }
  }, [settings?.showGallery]);

  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setLightboxImg(null);
      }
    };
    if (lightboxImg) {
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [lightboxImg]);

  const [eyeSafeReadability, setEyeSafeReadability] = useState(true);

  React.useEffect(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('eyeSafeReadability');
      if (saved !== null) {
        setEyeSafeReadability(saved === 'true');
      } else {
        setEyeSafeReadability(settings?.enableHeroOverlay !== false);
      }
    }
  }, [settings?.enableHeroOverlay]);

  const prevEnableHeroOverlayRef = React.useRef(settings?.enableHeroOverlay);
  React.useEffect(() => {
    if (settings && prevEnableHeroOverlayRef.current !== settings.enableHeroOverlay) {
      setEyeSafeReadability(settings.enableHeroOverlay !== false);
      localStorage.setItem('eyeSafeReadability', String(settings.enableHeroOverlay !== false));
      prevEnableHeroOverlayRef.current = settings.enableHeroOverlay;
    }
  }, [settings?.enableHeroOverlay]);

  React.useEffect(() => {
    if (!settings?.enableHeroSlider || !settings?.heroSlides || settings.heroSlides.length <= 1) {
      return;
    }
    const intervalTime = settings.heroSliderInterval || 5000;
    const interval = setInterval(() => {
      setActiveSlideIdx(prev => (prev + 1) % settings.heroSlides!.length);
    }, intervalTime);
    return () => clearInterval(interval);
  }, [settings?.enableHeroSlider, settings?.heroSlides, settings?.heroSliderInterval]);

  // Form states
  const [contactForm, setContactForm] = useState({ name: '', email: '', phone: '', subject: '', message: '' });
  const [distributorForm, setDistributorForm] = useState({ name: '', email: '', phone: '', companyName: '', message: '' });
  const [productInquiryForm, setProductInquiryForm] = useState({ name: '', email: '', phone: '', message: '' });
  const [careerForm, setCareerForm] = useState({ jobId: '', jobTitle: '', name: '', email: '', phone: '', coverLetter: '', resumeName: '' });

  // Status flags
  const [contactSuccess, setContactSuccess] = useState(false);
  const [distributorSuccess, setDistributorSuccess] = useState(false);
  const [productSuccess, setProductSuccess] = useState(false);
  const [careerSuccess, setCareerSuccess] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  // Filtered lists
  const publishedProducts = React.useMemo(() => {
    return products.filter((p) => p.status === 'published');
  }, [products]);

  const filteredProducts = React.useMemo(() => {
    const query = searchQuery.toLowerCase();
    return publishedProducts.filter((product) => {
      const matchesSearch =
        product.brandName.toLowerCase().includes(query) ||
        product.genericName.toLowerCase().includes(query) ||
        product.indications.toLowerCase().includes(query);
      const matchesCategory = selectedCategory === 'all' || product.categoryId === selectedCategory;
      return matchesSearch && matchesCategory;
    });
  }, [publishedProducts, searchQuery, selectedCategory]);

  const featuredProducts = React.useMemo(() => {
    return publishedProducts.filter((p, index) => index < 6 || p.isFeatured);
  }, [publishedProducts]);

  const productCountsByCategory = React.useMemo(() => {
    const counts: Record<string, number> = {};
    for (const p of publishedProducts) {
      if (p.categoryId) {
        counts[p.categoryId] = (counts[p.categoryId] || 0) + 1;
      }
    }
    return counts;
  }, [publishedProducts]);

  const openJobs = React.useMemo(() => {
    return jobs.filter((j) => j.status === 'open');
  }, [jobs]);

  const [windowWidth, setWindowWidth] = useState(1200);
  React.useEffect(() => {
    if (typeof window !== 'undefined') {
      setWindowWidth(window.innerWidth);
      const handleResize = () => setWindowWidth(window.innerWidth);
      window.addEventListener('resize', handleResize);
      return () => window.removeEventListener('resize', handleResize);
    }
  }, []);

  const isMobile = windowWidth < 768;
  const maxSlideIdx = isMobile ? featuredProducts.length - 1 : Math.max(0, featuredProducts.length - 3);

  const [featuredSlideIdx, setFeaturedSlideIdx] = useState(0);

  React.useEffect(() => {
    if (featuredSlideIdx > maxSlideIdx) {
      setFeaturedSlideIdx(Math.max(0, maxSlideIdx));
    }
  }, [maxSlideIdx, featuredSlideIdx]);

  React.useEffect(() => {
    if (featuredProducts.length <= 1) return;
    const interval = setInterval(() => {
      setFeaturedSlideIdx(prev => (prev >= maxSlideIdx ? 0 : prev + 1));
    }, 5500); // 5.5 second delay in auto-rotation
    return () => clearInterval(interval);
  }, [featuredProducts.length, maxSlideIdx]);

  // Handlers
  const handleContactSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!contactForm.name || !contactForm.email || !contactForm.message) return;
    setSubmitting(true);
    const success = await onSubmitInquiry({
      type: 'general',
      name: contactForm.name,
      email: contactForm.email,
      phone: contactForm.phone,
      subject: contactForm.subject,
      message: contactForm.message,
    });
    setSubmitting(false);
    if (success) {
      setContactSuccess(true);
      setContactForm({ name: '', email: '', phone: '', subject: '', message: '' });
      setTimeout(() => setContactSuccess(false), 5000);
    }
  };

  const handleDistributorSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!distributorForm.name || !distributorForm.email || !distributorForm.companyName || !distributorForm.message) return;
    setSubmitting(true);
    const success = await onSubmitInquiry({
      type: 'distributor',
      name: distributorForm.name,
      email: distributorForm.email,
      phone: distributorForm.phone,
      companyName: distributorForm.companyName,
      message: distributorForm.message,
    });
    setSubmitting(false);
    if (success) {
      setDistributorSuccess(true);
      setDistributorForm({ name: '', email: '', phone: '', companyName: '', message: '' });
      setTimeout(() => setDistributorSuccess(false), 5000);
    }
  };

  const handleProductInquirySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedProduct) return;
    if (!productInquiryForm.name || !productInquiryForm.email || !productInquiryForm.message) return;
    setSubmitting(true);
    const success = await onSubmitInquiry({
      type: 'product',
      name: productInquiryForm.name,
      email: productInquiryForm.email,
      phone: productInquiryForm.phone,
      productId: selectedProduct.id,
      productBrandName: selectedProduct.brandName,
      message: productInquiryForm.message,
    });
    setSubmitting(false);
    if (success) {
      setProductSuccess(true);
      setProductInquiryForm({ name: '', email: '', phone: '', message: '' });
      setTimeout(() => setProductSuccess(false), 5000);
    }
  };

  const handleCareerSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!careerForm.name || !careerForm.email || !careerForm.jobId) return;
    setSubmitting(true);
    const success = await onSubmitApplication({
      jobId: careerForm.jobId,
      jobTitle: careerForm.jobTitle,
      name: careerForm.name,
      email: careerForm.email,
      phone: careerForm.phone,
      coverLetter: careerForm.coverLetter,
      resumeName: careerForm.resumeName || 'Applicant_CV_Attached.pdf',
    });
    setSubmitting(false);
    if (success) {
      setCareerSuccess(true);
      setCareerForm({ jobId: '', jobTitle: '', name: '', email: '', phone: '', coverLetter: '', resumeName: '' });
      setTimeout(() => setCareerSuccess(false), 5000);
    }
  };

  return (
    <div className="flex flex-col min-h-screen">
      {/* Main Content Stage */}
      <main className="flex-grow">
        {/* TAB 1: CORPORATE HOME */}
        {activeTab === 'home' && (
          <div className="fade-in-up">
            {/* Elegant Hero Slider section */}
            {settings.showHomeHero !== false && (
              <div className="relative bg-gradient-to-r from-slate-900 via-light-cyan-100 to-light-blue-100 text-white overflow-hidden py-20 lg:py-28 px-4 sm:px-8 lg:px-16 border-b border-slate-800 shadow-xl">
                {/* Background Slider Carousel */}
                {settings?.enableHeroSlider && settings?.heroSlides && settings.heroSlides.length > 0 ? (
                  <div className="absolute inset-0 z-0 select-none overflow-hidden">
                    {settings.heroSlides.map((slide, idx) => (
                      <img
                        key={idx}
                        src={getImgSrc(slide, 'large')}
                        alt={getImgAlt(slide, `Corporate highlight background slide ${idx + 1}`)}
                        title={getImgTitle(slide, 'Enterprise Monograph Slider')}
                        className={`absolute inset-0 w-full h-full object-cover transition-all duration-1000 ease-in-out transform ${
                          idx === activeSlideIdx ? 'opacity-30 scale-100' : 'opacity-0 scale-105 pointer-events-none'
                        }`}
                        referrerPolicy="no-referrer"
                      />
                    ))}
                    {/* Configurable Rich Dark Lens Overlays for Pristine Clinical Legibility */}
                    {eyeSafeReadability ? (
                      <>
                        {settings?.heroOverlayStrength === 'light' ? (
                          <>
                            <div className="absolute inset-0 bg-slate-900/70 mix-blend-multiply z-[1]"></div>
                            <div className="absolute inset-0 bg-gradient-to-t from-slate-950/50 to-transparent z-[1]"></div>
                          </>
                        ) : settings?.heroOverlayStrength === 'medium' ? (
                          <>
                            <div className="absolute inset-0 bg-slate-950/85 mix-blend-multiply z-[1]"></div>
                            <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 to-transparent z-[1]"></div>
                          </>
                        ) : settings?.heroOverlayStrength === 'heavy' ? (
                          <>
                            <div className="absolute inset-0 bg-slate-950/98 z-[1]"></div>
                            <div className="absolute inset-0 bg-gradient-to-t from-slate-950 to-slate-950/40 z-[1]"></div>
                          </>
                        ) : (
                          <>
                            {/* Eye-Safe Clinical Readability: Backed with deep, multi-layered slate lenses and linear dark overlays (Standard Dark Lens) */}
                            <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-900/90 to-light-cyan-100/85 mix-blend-multiply z-[1]"></div>
                            <div className="absolute inset-0 bg-gradient-to-t from-slate-950/95 via-slate-950/20 to-transparent z-[1]"></div>
                          </>
                        )}
                      </>
                    ) : (
                      /* Minimal fallback overlay to prevent completely white or unreadable slides if disabled */
                      <div className="absolute inset-0 bg-slate-950/15 z-[1]"></div>
                    )}
                  </div>
                ) : (
                  <>
                    {/* Scientific Blueprint Grid Overlay and ambient glow (Standard Gradient Fallback) */}
                    <div className="absolute inset-0 opacity-[0.06] bg-[linear-gradient(to_right,#0d9488_1px,transparent_1px),linear-gradient(to_bottom,#0d9488_1px,transparent_1px)] bg-[size:3rem_3rem]"></div>
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950/40 via-transparent to-transparent"></div>
                    <div className="absolute -right-20 -top-20 h-96 w-96 rounded-full bg-teal-500/10 blur-3xl"></div>
                    <div className="absolute -left-20 bottom-10 h-80 w-80 rounded-full bg-emerald-500/5 blur-3xl"></div>
                  </>
                )}



                <div className="relative z-10 max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
                  
                  {/* Left Column: High-Impact Clinical Copy */}
                  <div className={`${settings.showHomeLabPreview !== false ? 'lg:col-span-7' : 'lg:col-span-12 max-w-4xl mx-auto'} space-y-6 text-left`}>
                    <div className="inline-flex items-center space-x-2 bg-teal-400/10 text-teal-300 px-3.5 py-1.5 rounded-full text-xs font-mono border border-teal-500/20 shadow-inner">
                      <ShieldCheck className="h-4 w-4 text-teal-400 animate-pulse" />
                      <span className="font-semibold tracking-wider uppercase">
                        {settings.complianceBadgeText || 'WHO-GMP & USFDA ALIGNED COMPLIANCE'}
                      </span>
                    </div>

                    <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white leading-[1.12]">
                      {settings.heroTitle ? (
                        settings.heroTitle
                      ) : (
                        <>
                          Advancing <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-400 to-emerald-400 font-black">Therapeutic Science</span> with Clinical Precision
                        </>
                      )}
                    </h1>

                    <p className="max-w-2xl text-sm sm:text-base text-slate-300 leading-relaxed font-sans font-light">
                      {settings.heroDescription || (
                        <>
                          {settings.companyName || 'Pharmaceutical Enterprise'} is a premier global partner in molecular synthesis and chemical formulations. Inside our Grade A cleanrooms, we synthesize life-saving cardiovascular, neuro-active, and anti-infective formulations under strict USP/BP standards for international medical procurement.
                        </>
                      )}
                    </p>

                    {/* Standard Clinical Trust Matrix */}
                    <div className="pt-2 grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs font-mono text-slate-300">
                      <div className="flex items-center space-x-2 bg-slate-950/40 border border-slate-800/60 p-3 rounded-xl transition duration-150 hover:bg-slate-950/70">
                        <CheckCircle2 className="h-4 w-4 text-teal-400 shrink-0" />
                        <span className="font-medium">{settings.heroTrustPoint1 || 'Zone IV Stability Compliant'}</span>
                      </div>
                      <div className="flex items-center space-x-2 bg-slate-950/40 border border-slate-800/60 p-3 rounded-xl transition duration-150 hover:bg-slate-950/70">
                        <CheckCircle2 className="h-4 w-4 text-teal-400 shrink-0" />
                        <span className="font-medium">{settings.heroTrustPoint2 || 'eCTD Format dossiers ready'}</span>
                      </div>
                      <div className="flex items-center space-x-2 bg-slate-950/40 border border-slate-800/60 p-3 rounded-xl transition duration-150 hover:bg-slate-950/70">
                        <CheckCircle2 className="h-4 w-4 text-teal-400 shrink-0" />
                        <span className="font-medium">{settings.heroTrustPoint3 || 'HPLC Chromatogram Verified'}</span>
                      </div>
                      <div className="flex items-center space-x-2 bg-slate-950/40 border border-slate-800/60 p-3 rounded-xl transition duration-150 hover:bg-slate-950/70">
                        <CheckCircle2 className="h-4 w-4 text-teal-400 shrink-0" />
                        <span className="font-medium">{settings.heroTrustPoint4 || 'Pyrogen-Free Cleanrooms'}</span>
                      </div>
                    </div>

                    <div className="pt-6 flex flex-wrap gap-4">
                      {settings.showCatalog !== false && (
                        <button
                          id="hero-view-catalog"
                          onClick={() => {
                            setActiveTab('catalog');
                            window.scrollTo({ top: 0, behavior: 'smooth' });
                          }}
                          className="bg-white hover:bg-light-cyan text-slate-950 font-bold px-8 py-4 rounded-xl text-xs tracking-widest uppercase shadow-xl shadow-black/25 hover:shadow-[0_0_30px_rgba(224,251,252,0.25)] hover:-translate-y-0.5 transition-all duration-300 flex items-center group cursor-pointer"
                        >
                          <span>Explore Formulations Monograph</span>
                          <ArrowRight className="h-4 w-4 ml-3 transform group-hover:translate-x-1.5 transition-transform text-slate-900" />
                        </button>
                      )}
                      {settings.showCertifications !== false && (
                        <button
                          id="hero-view-regulatory"
                          onClick={() => {
                            setActiveTab('certifications');
                            window.scrollTo({ top: 0, behavior: 'smooth' });
                          }}
                          className="bg-white/5 hover:bg-white/10 text-slate-200 hover:text-white px-8 py-4 rounded-xl text-xs font-bold tracking-widest uppercase border border-white/15 hover:border-white/30 transition-all duration-300 cursor-pointer hover:-translate-y-0.5"
                        >
                          Review Regulatory Portfolios
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Right Column: Beautiful Interactive Chemical Synthesis Widget */}
                  {settings.showHomeLabPreview !== false && (
                    <div className="lg:col-span-5">
                      <div className="bg-slate-950/80 backdrop-blur-md border border-slate-800 rounded-2xl p-6 shadow-2xl relative overflow-hidden">
                        {/* Interactive Tabs */}
                        <div className="flex justify-between border-b border-slate-800 pb-3 mb-4">
                          <span className="text-[10px] font-mono font-bold tracking-wider text-teal-400 flex items-center uppercase">
                            <FlaskConical className="h-3.5 w-3.5 mr-1.5 animate-pulse text-teal-400" /> {settings.labTitle || 'MOLECULAR LAB SPECIMEN'}
                          </span>
                          <div className="flex space-x-1 bg-slate-900 p-1 rounded-lg border border-slate-800">
                            <button
                              onClick={() => setSpotlightClass('cardio')}
                              className={`px-2.5 py-1 rounded text-[9px] font-mono font-bold transition duration-150 cursor-pointer uppercase ${
                                spotlightClass === 'cardio' ? 'bg-teal-500 text-slate-950 font-extrabold' : 'text-slate-400 hover:text-white'
                              }`}
                            >
                              Cardio
                            </button>
                            <button
                              onClick={() => setSpotlightClass('anti_infective')}
                              className={`px-2.5 py-1 rounded text-[9px] font-mono font-bold transition duration-150 cursor-pointer uppercase ${
                                spotlightClass === 'anti_infective' ? 'bg-teal-500 text-slate-950 font-extrabold' : 'text-slate-400 hover:text-white'
                              }`}
                            >
                              Antibiotic
                            </button>
                            <button
                              onClick={() => setSpotlightClass('neuro')}
                              className={`px-2.5 py-1 rounded text-[9px] font-mono font-bold transition duration-150 cursor-pointer uppercase ${
                                spotlightClass === 'neuro' ? 'bg-teal-500 text-slate-950 font-extrabold' : 'text-slate-400 hover:text-white'
                              }`}
                            >
                              Neuro
                            </button>
                          </div>
                        </div>

                        {/* Display Data based on tab */}
                        {spotlightClass === 'cardio' && (
                          <div className="space-y-4 animate-fadeIn">
                            <div className="flex justify-between items-start">
                              <div>
                                <span className="text-[9px] font-mono font-bold text-teal-400 uppercase tracking-wide">Interactive Specimen</span>
                                <h3 className="text-md font-bold text-white tracking-wide">{settings.labCardioTitle || 'CardioVance XR Duo'}</h3>
                              </div>
                              <span className="bg-emerald-500/15 text-emerald-300 border border-emerald-500/20 px-2 py-0.5 rounded font-mono text-[9px]">{settings.labCardioStatus || 'API Approved'}</span>
                            </div>

                            {/* Dynamic molecular schematic (SVG) */}
                            <div className="h-24 bg-slate-900 rounded-xl flex items-center justify-center border border-slate-800 relative">
                              <div className="absolute top-2 left-3 text-[8px] font-mono text-slate-500">{settings.labCardioStructure || 'Amlodipine Besylate Ring Structure'}</div>
                              <svg className="w-40 h-16 text-teal-400" viewBox="0 0 200 80">
                                <line x1="20" y1="40" x2="50" y2="20" stroke="currentColor" strokeWidth="2" strokeDasharray="3,3" />
                                <line x1="50" y1="20" x2="80" y2="40" stroke="currentColor" strokeWidth="2" />
                                <line x1="80" y1="40" x2="110" y2="20" stroke="currentColor" strokeWidth="2" />
                                <line x1="110" y1="20" x2="140" y2="40" stroke="currentColor" strokeWidth="2" strokeDasharray="3,3" />
                                <line x1="140" y1="40" x2="170" y2="25" stroke="currentColor" strokeWidth="2" />
                                
                                <circle cx="20" cy="40" r="4" fill="#2dd4bf" />
                                <circle cx="50" cy="20" r="5" fill="#34d399" />
                                <circle cx="80" cy="40" r="4" fill="#2dd4bf" />
                                <circle cx="110" cy="20" r="5" fill="#fbbf24" />
                                <circle cx="140" cy="40" r="4" fill="#2dd4bf" />
                                <circle cx="170" cy="25" r="3.5" fill="#60a5fa" />
                              </svg>
                            </div>

                            {/* Molecular metrics */}
                            <div className="grid grid-cols-2 gap-3 text-xs font-mono">
                              <div className="p-2.5 bg-slate-900/60 rounded-xl border border-slate-800">
                                <div className="text-slate-500 text-[8px] uppercase tracking-wider">ACTIVE INGREDIENT</div>
                                <div className="text-slate-200 mt-0.5 truncate font-semibold">{settings.labCardioActive || 'Amlodipine Besylate'}</div>
                              </div>
                              <div className="p-2.5 bg-slate-900/60 rounded-xl border border-slate-800">
                                <div className="text-slate-500 text-[8px] uppercase tracking-wider">EMPIRICAL FORMULA</div>
                                <div className="text-slate-200 mt-0.5 font-semibold">{settings.labCardioFormula || 'C20H25ClN2O5'}</div>
                              </div>
                              <div className="p-2.5 bg-slate-900/60 rounded-xl border border-slate-800">
                                <div className="text-slate-500 text-[8px] uppercase tracking-wider">DISINTEGRATION RATE</div>
                                <div className="text-teal-400 mt-0.5 font-bold">{settings.labCardioDisintegration || '4.2 min (Limit < 15m)'}</div>
                              </div>
                              <div className="p-2.5 bg-slate-900/60 rounded-xl border border-slate-800">
                                <div className="text-slate-500 text-[8px] uppercase tracking-wider">CHROMATOGRAPHY VALUE</div>
                                <div className="text-teal-400 mt-0.5 font-bold">{settings.labCardioChroma || '99.91% Purified'}</div>
                              </div>
                            </div>
                          </div>
                        )}

                        {spotlightClass === 'anti_infective' && (
                          <div className="space-y-4 animate-fadeIn">
                            <div className="flex justify-between items-start">
                              <div>
                                <span className="text-[9px] font-mono font-bold text-teal-400 uppercase tracking-wide">Interactive Specimen</span>
                                <h3 className="text-md font-bold text-white tracking-wide">{settings.labAntibioticTitle || 'ZithroMax Duo'}</h3>
                              </div>
                              <span className="bg-emerald-500/15 text-emerald-300 border border-emerald-500/20 px-2 py-0.5 rounded font-mono text-[9px]">{settings.labAntibioticStatus || 'API Approved'}</span>
                            </div>

                            {/* Dynamic molecular schematic (SVG) */}
                            <div className="h-24 bg-slate-900 rounded-xl flex items-center justify-center border border-slate-800 relative">
                              <div className="absolute top-2 left-3 text-[8px] font-mono text-slate-500">{settings.labAntibioticStructure || 'Azithromycin Aromatic Macrocyclic Loop'}</div>
                              <svg className="w-40 h-16 text-emerald-400" viewBox="0 0 200 80">
                                <path d="M 50,40 L 70,20 L 100,20 L 120,40 L 100,60 L 70,60 Z" fill="none" stroke="currentColor" strokeWidth="2" />
                                <path d="M 120,40 L 140,25 L 160,40 L 150,60 Z" fill="none" stroke="currentColor" strokeWidth="1.5" strokeDasharray="2,2" />
                                
                                <circle cx="50" cy="40" r="4.5" fill="#34d399" />
                                <circle cx="70" cy="20" r="4" fill="#2dd4bf" />
                                <circle cx="100" cy="20" r="4" fill="#2dd4bf" />
                                <circle cx="120" cy="40" r="5" fill="#fbbf24" />
                                <circle cx="100" cy="60" r="4" fill="#2dd4bf" />
                                <circle cx="70" cy="60" r="4" fill="#2dd4bf" />
                                <circle cx="140" cy="25" r="3.5" fill="#60a5fa" />
                                <circle cx="160" cy="40" r="3.5" fill="#34d399" />
                              </svg>
                            </div>

                            {/* Molecular metrics */}
                            <div className="grid grid-cols-2 gap-3 text-xs font-mono">
                              <div className="p-2.5 bg-slate-900/60 rounded-xl border border-slate-800">
                                <div className="text-slate-500 text-[8px] uppercase tracking-wider">ACTIVE INGREDIENT</div>
                                <div className="text-slate-200 mt-0.5 truncate font-semibold">{settings.labAntibioticActive || 'Azithromycin Dihydrate'}</div>
                              </div>
                              <div className="p-2.5 bg-slate-900/60 rounded-xl border border-slate-800">
                                <div className="text-slate-500 text-[8px] uppercase tracking-wider">EMPIRICAL FORMULA</div>
                                <div className="text-slate-200 mt-0.5 font-semibold">{settings.labAntibioticFormula || 'C38H72N2O12 • 2H2O'}</div>
                              </div>
                              <div className="p-2.5 bg-slate-900/60 rounded-xl border border-slate-800">
                                <div className="text-slate-500 text-[8px] uppercase tracking-wider">DISINTEGRATION RATE</div>
                                <div className="text-teal-400 mt-0.5 font-bold">{settings.labAntibioticDisintegration || '7.1 min (Limit < 15m)'}</div>
                              </div>
                              <div className="p-2.5 bg-slate-900/60 rounded-xl border border-slate-800">
                                <div className="text-slate-500 text-[8px] uppercase tracking-wider">CHROMATOGRAPHY VALUE</div>
                                <div className="text-teal-400 mt-0.5 font-bold">{settings.labAntibioticChroma || '99.85% EP Certified'}</div>
                              </div>
                            </div>
                          </div>
                        )}

                        {spotlightClass === 'neuro' && (
                          <div className="space-y-4 animate-fadeIn">
                            <div className="flex justify-between items-start">
                              <div>
                                <span className="text-[9px] font-mono font-bold text-teal-400 uppercase tracking-wide">Interactive Specimen</span>
                                <h3 className="text-md font-bold text-white tracking-wide">{settings.labNeuroTitle || 'SeroQuell Depot'}</h3>
                              </div>
                              <span className="bg-emerald-500/15 text-emerald-300 border border-emerald-500/20 px-2 py-0.5 rounded font-mono text-[9px]">{settings.labNeuroStatus || 'API Approved'}</span>
                            </div>

                            {/* Dynamic molecular schematic (SVG) */}
                            <div className="h-24 bg-slate-900 rounded-xl flex items-center justify-center border border-slate-800 relative">
                              <div className="absolute top-2 left-3 text-[8px] font-mono text-slate-500">{settings.labNeuroStructure || 'Quetiapine Dibenzothiazepine Core'}</div>
                              <svg className="w-40 h-16 text-amber-400" viewBox="0 0 200 80">
                                <polygon points="30,40 50,25 70,40 60,60 40,60" fill="none" stroke="currentColor" strokeWidth="2" />
                                <polygon points="70,40 90,25 110,40 100,60 80,60" fill="none" stroke="currentColor" strokeWidth="1.5" />
                                <line x1="110" y1="40" x2="140" y2="40" stroke="currentColor" strokeWidth="2" />
                                <line x1="140" y1="40" x2="160" y2="20" stroke="currentColor" strokeWidth="1.5" strokeDasharray="2,2" />
                                
                                <circle cx="30" cy="40" r="4" fill="#2dd4bf" />
                                <circle cx="50" cy="25" r="4" fill="#34d399" />
                                <circle cx="70" cy="40" r="4.5" fill="#fbbf24" />
                                <circle cx="90" cy="25" r="4" fill="#34d399" />
                                <circle cx="110" cy="40" r="4.5" fill="#fbbf24" />
                                <circle cx="140" cy="40" r="4.5" fill="#60a5fa" />
                                <circle cx="160" cy="20" r="3.5" fill="#f87171" />
                              </svg>
                            </div>

                            {/* Molecular metrics */}
                            <div className="grid grid-cols-2 gap-3 text-xs font-mono">
                              <div className="p-2.5 bg-slate-900/60 rounded-xl border border-slate-800">
                                <div className="text-slate-500 text-[8px] uppercase tracking-wider">ACTIVE INGREDIENT</div>
                                <div className="text-slate-200 mt-0.5 truncate font-semibold">{settings.labNeuroActive || 'Quetiapine Fumarate'}</div>
                              </div>
                              <div className="p-2.5 bg-slate-900/60 rounded-xl border border-slate-800">
                                <div className="text-slate-500 text-[8px] uppercase tracking-wider">EMPIRICAL FORMULA</div>
                                <div className="text-slate-200 mt-0.5 font-semibold">{settings.labNeuroFormula || '(C21H25N3O2S)2'}</div>
                              </div>
                              <div className="p-2.5 bg-slate-900/60 rounded-xl border border-slate-800">
                                <div className="text-slate-500 text-[8px] uppercase tracking-wider">DISINTEGRATION RATE</div>
                                <div className="text-teal-400 mt-0.5 font-bold">{settings.labNeuroDisintegration || '5.8 min (Limit < 15m)'}</div>
                              </div>
                              <div className="p-2.5 bg-slate-900/60 rounded-xl border border-slate-800">
                                <div className="text-slate-500 text-[8px] uppercase tracking-wider">CHROMATOGRAPHY VALUE</div>
                                <div className="text-teal-400 mt-0.5 font-bold">{settings.labNeuroChroma || '99.88% BP/USP Certified'}</div>
                              </div>
                            </div>
                          </div>
                        )}

                        {/* Floating mini lab telemetry */}
                        <div className="pt-4 border-t border-slate-800/80 flex justify-between items-center text-[10px] font-mono text-slate-400">
                          <div className="flex items-center">
                            <span className="inline-block h-2 w-2 rounded-full bg-teal-400 mr-2 animate-pulse"></span>
                            <span>{settings.labSterilityText || 'HEPA STERILITY: CLASS 100'}</span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Thermometer className="h-3.5 w-3.5 text-slate-500" />
                            <span>{settings.labTemperature || '18.2'} °C</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                </div>

                {/* Manual Navigation Controls for Slider Carousel */}
                {settings?.enableHeroSlider && settings?.heroSlides && settings.heroSlides.length > 1 && (
                  <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 z-20 flex space-x-2">
                    {settings.heroSlides.map((_, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => setActiveSlideIdx(idx)}
                        className={`h-1.5 rounded-full transition-all duration-300 ${
                          idx === activeSlideIdx ? 'w-6 bg-teal-400' : 'w-1.5 bg-white/45 hover:bg-white/70'
                        }`}
                        title={`Go to slide ${idx + 1}`}
                      />
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Quick Metrics (Clinical Performance Panel) */}
            {settings.showHomeMetrics !== false && (
              <div className="bg-white border-b border-slate-200 py-10">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                  <div className="text-center mb-6">
                    <span className="text-[10px] font-mono font-bold tracking-wider text-slate-400 uppercase">OPERATIONAL CAPACITY METRICS</span>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
                    
                    <div className="p-5 bg-slate-50/50 rounded-xl border border-slate-200 relative group overflow-hidden">
                      <div className="absolute right-3 top-3 p-1.5 bg-teal-100/50 rounded-lg text-teal-600">
                        <Award className="h-5 w-5" />
                      </div>
                      <div className="font-display text-2xl font-black text-teal-600">{settings.metric1Value || 'WHO-GMP'}</div>
                      <div className="text-[11px] text-slate-500 mt-1 uppercase tracking-wider font-semibold">{settings.metric1Label || 'Manufacturing Standard'}</div>
                      {/* Micro capacity status indicator */}
                      <div className="mt-4 pt-3 border-t border-slate-200/60 text-[10px] font-mono text-slate-400 flex justify-between">
                        <span>Validation Logs:</span>
                        <span className="text-teal-600 font-bold">100% Passed</span>
                      </div>
                    </div>

                    <div className="p-5 bg-slate-50/50 rounded-xl border border-slate-200 relative group overflow-hidden">
                      <div className="absolute right-3 top-3 p-1.5 bg-slate-200/60 rounded-lg text-slate-700">
                        <Activity className="h-5 w-5" />
                      </div>
                      <div className="font-display text-2xl font-black text-slate-900">{settings.metric2Value || '15M+'}</div>
                      <div className="text-[11px] text-slate-500 mt-1 uppercase tracking-wider font-semibold">{settings.metric2Label || 'Daily Tablet Output'}</div>
                      {/* Micro capacity status indicator */}
                      <div className="mt-4 pt-3 border-t border-slate-200/60 text-[10px] font-mono text-slate-400 flex justify-between">
                        <span>Active lines:</span>
                        <span className="text-slate-800 font-bold">24/7 Monitored</span>
                      </div>
                    </div>

                    <div className="p-5 bg-slate-50/50 rounded-xl border border-slate-200 relative group overflow-hidden">
                      <div className="absolute right-3 top-3 p-1.5 bg-slate-200/60 rounded-lg text-slate-700">
                        <FlaskConical className="h-5 w-5" />
                      </div>
                      <div className="font-display text-2xl font-black text-slate-900">{settings.metric3Value || '50+'}</div>
                      <div className="text-[11px] text-slate-500 mt-1 uppercase tracking-wider font-semibold">{settings.metric3Label || 'Global Formulations'}</div>
                      {/* Micro capacity status indicator */}
                      <div className="mt-4 pt-3 border-t border-slate-200/60 text-[10px] font-mono text-slate-400 flex justify-between">
                        <span>Active APIs:</span>
                        <span className="text-slate-800 font-bold">EP/USP Grade</span>
                      </div>
                    </div>

                    <div className="p-5 bg-slate-50/50 rounded-xl border border-slate-200 relative group overflow-hidden">
                      <div className="absolute right-3 top-3 p-1.5 bg-teal-100/50 rounded-lg text-teal-600">
                        <ShieldCheck className="h-5 w-5" />
                      </div>
                      <div className="font-display text-2xl font-black text-teal-600">{settings.metric4Value || 'Zone I-IV'}</div>
                      <div className="text-[11px] text-slate-500 mt-1 uppercase tracking-wider font-semibold">{settings.metric4Label || 'Stability Compliant'}</div>
                      {/* Micro capacity status indicator */}
                      <div className="mt-4 pt-3 border-t border-slate-200/60 text-[10px] font-mono text-slate-400 flex justify-between">
                        <span>Relative Humidity:</span>
                        <span className="text-teal-600 font-bold">20% RH Aligned</span>
                      </div>
                    </div>

                  </div>
                </div>
              </div>
            )}

            {/* Featured Formulations section */}
            {settings.showHomeFeatured !== false && (
              <div className="py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-12">
                  <span className="text-[11px] font-mono font-bold tracking-wider text-teal-600 bg-teal-50 px-3 py-1 rounded-full border border-teal-100">
                    {settings.featuredBadgeText || 'ATC THERAPEUTIC CLASSIFICATION'}
                  </span>
                  <h2 className="font-display text-3xl font-extrabold tracking-tight text-slate-900 mt-4">
                    {settings.featuredTitle || 'Featured Pharmaceutical Monographs'}
                  </h2>
                  <p className="mt-2 text-xs sm:text-sm text-slate-500 max-w-2xl mx-auto">
                    {settings.featuredDesc || 'Therapeutic compositions manufactured inside our sterile containment blocks. High-bioavailability drug release logs verified via analytical laboratory assays.'}
                  </p>
                </div>

                {/* Product Card Slider/Carousel */}
                <div className="relative group px-1 md:px-12">
                  {featuredProducts.length === 0 ? (
                    <p className="text-center text-slate-500 italic">No featured products registered.</p>
                  ) : (
                    <>
                      {/* Viewport container: hiding horizontal overflow */}
                      <div className="overflow-hidden w-full py-4">
                        <motion.div
                          className="flex gap-6"
                          animate={{
                            x: isMobile 
                              ? `calc(-${featuredSlideIdx * 100}% - ${featuredSlideIdx * 24}px)` 
                              : `calc(-${featuredSlideIdx * 33.33333}% - ${featuredSlideIdx * 8}px)`
                          }}
                          transition={{ type: 'spring', stiffness: 180, damping: 25 }}
                        >
                          {featuredProducts.map((product) => (
                            <div
                              key={product.id}
                              className="w-full md:w-[calc(33.33333%-16px)] shrink-0 bg-white rounded-3xl shadow-sm hover:shadow-xl border border-slate-100 hover:border-slate-200 transition-all duration-300 transform hover:-translate-y-1.5 flex flex-col group overflow-hidden"
                            >
                              {/* Top Badge Overlay Container */}
                              <div className="px-6 pt-5 pb-3 flex justify-between items-center gap-2 bg-slate-50/50 border-b border-slate-100/50 min-w-0">
                                <span 
                                  className="text-[10px] font-mono font-bold uppercase tracking-wider text-slate-600 bg-slate-200/60 px-3 py-1 rounded-full truncate max-w-[130px] sm:max-w-[180px]"
                                  title={categories.find((c) => c.id === product.categoryId)?.name || 'Formulation'}
                                >
                                  {categories.find((c) => c.id === product.categoryId)?.name || 'Formulation'}
                                </span>
                                <span className="text-[9px] text-slate-450 font-mono font-semibold tracking-wider flex items-center bg-emerald-500/5 px-2.5 py-1 rounded-full border border-emerald-500/10 shrink-0 whitespace-nowrap">
                                  <span className="inline-block h-1.5 w-1.5 rounded-full bg-emerald-500 mr-1.5 animate-pulse"></span>
                                  WHO-GMP Certified
                                </span>
                              </div>

                              {/* Custom Product Image manual slider inside the card */}
                              <div className="p-4">
                                <div className="h-48 sm:h-52 rounded-2xl overflow-hidden relative bg-gradient-to-b from-slate-50 to-slate-100/40 border border-slate-100 flex items-center justify-center p-1 group-hover:bg-white transition-all duration-300">
                                  {product.images && product.images.length > 0 ? (
                                    <ProductImageManualSlider images={product.images} dark={false} />
                                  ) : (
                                    <div className="text-[10px] font-mono text-slate-400 italic">No custom images registered</div>
                                  )}
                                </div>
                              </div>

                              {/* Card Content body */}
                              <div className="px-6 pb-6 pt-2 flex-grow flex flex-col justify-between">
                                <div>
                                  <h3 className="font-display text-lg font-bold text-slate-900 leading-snug group-hover:text-blue-slate-600 transition-colors">
                                    {product.brandName}
                                  </h3>
                                  
                                  {/* Sub-label inside a clean pharmaceutical strip */}
                                  <div className="mt-2 mb-3 bg-slate-50 border border-slate-100 rounded-lg px-3 py-1.5 flex items-center justify-between gap-1 text-xs">
                                    <span className="font-mono text-blue-slate-600 font-semibold truncate italic">{product.genericName}</span>
                                    <span className="font-bold text-slate-800 shrink-0 bg-white shadow-sm border border-slate-200/50 px-2 py-0.5 rounded text-[10px]">{product.strength}</span>
                                  </div>

                                  <p className="text-xs text-slate-500 leading-relaxed line-clamp-2 mt-2 font-light">
                                    {product.indications}
                                  </p>
                                </div>

                                {/* Technical specifications bento micro-panel */}
                                <div className="mt-4 pt-4 border-t border-slate-100 space-y-2">
                                  <div className="grid grid-cols-2 gap-2 text-[10px] font-mono text-slate-500">
                                    <div className="bg-slate-50/80 p-2.5 rounded-xl border border-slate-100/50 flex flex-col justify-between">
                                      <span className="text-[8px] text-slate-400 block uppercase font-bold tracking-wider">Packaging</span>
                                      <span className="text-slate-800 font-semibold block mt-0.5 truncate" title={product.packaging}>{product.packaging}</span>
                                    </div>
                                    <div className="bg-slate-50/80 p-2.5 rounded-xl border border-slate-100/50 flex flex-col justify-between">
                                      <span className="text-[8px] text-slate-400 block uppercase font-bold tracking-wider">Product Code</span>
                                      <span className="text-slate-800 font-semibold block mt-0.5 truncate uppercase">#{(product.id || 'N/A').slice(0, 8)}</span>
                                    </div>
                                  </div>
                                  <div className="bg-light-cyan/30 border border-light-cyan/50 p-2.5 rounded-xl text-[10px] font-mono text-blue-slate-700 leading-relaxed">
                                    <strong className="text-slate-500 uppercase text-[8px] block tracking-wider mb-0.5">Active Composition</strong>
                                    <span className="text-slate-800 font-medium line-clamp-1" title={product.composition}>{product.composition}</span>
                                  </div>
                                </div>

                                {/* Elegant full-width Button */}
                                {settings.showCatalog !== false && (
                                  <div className="mt-5">
                                    <button
                                      onClick={() => {
                                        setSelectedProduct(product);
                                        setActiveTab('catalog');
                                        window.scrollTo({ top: 0, behavior: 'smooth' });
                                      }}
                                      className="w-full bg-slate-900 hover:bg-slate-850 text-white text-center py-3 rounded-xl transition-all duration-200 text-xs font-semibold uppercase tracking-wider flex items-center justify-center gap-2 group-hover:shadow-md cursor-pointer"
                                    >
                                      <span>Review Full Spec Sheet</span>
                                      <ArrowRight className="h-4 w-4 transform group-hover:translate-x-1 transition-transform" />
                                    </button>
                                  </div>
                                )}
                              </div>
                            </div>
                          ))}
                        </motion.div>
                      </div>

                      {/* Manual sliding buttons left/right */}
                      {maxSlideIdx > 0 && (
                        <>
                          <button
                            onClick={() => setFeaturedSlideIdx(prev => (prev === 0 ? maxSlideIdx : prev - 1))}
                            className="absolute -left-2 md:-left-4 top-1/2 -translate-y-1/2 bg-white hover:bg-slate-50 text-slate-800 border border-slate-200 w-10 h-10 rounded-full flex items-center justify-center shadow-lg hover:border-teal-400 hover:text-teal-600 transition duration-150 z-10 cursor-pointer"
                            title="Previous product"
                          >
                            &larr;
                          </button>
                          <button
                            onClick={() => setFeaturedSlideIdx(prev => (prev >= maxSlideIdx ? 0 : prev + 1))}
                            className="absolute -right-2 md:-right-4 top-1/2 -translate-y-1/2 bg-white hover:bg-slate-50 text-slate-800 border border-slate-200 w-10 h-10 rounded-full flex items-center justify-center shadow-lg hover:border-teal-400 hover:text-teal-600 transition duration-150 z-10 cursor-pointer"
                            title="Next product"
                          >
                            &rarr;
                          </button>
                        </>
                      )}

                      {/* Carousel Index Dots */}
                      {maxSlideIdx > 0 && (
                        <div className="flex justify-center space-x-2 mt-8 z-10">
                          {Array.from({ length: maxSlideIdx + 1 }).map((_, idx) => (
                            <button
                              key={idx}
                              onClick={() => setFeaturedSlideIdx(idx)}
                              className={`h-2 rounded-full transition-all duration-300 ${
                                idx === featuredSlideIdx ? 'w-6 bg-teal-500' : 'w-2 bg-slate-300 hover:bg-slate-400'
                              }`}
                              title={`Go to featured product slide ${idx + 1}`}
                            />
                          ))}
                        </div>
                      )}
                    </>
                  )}
                </div>

                {settings.showCatalog !== false && (
                  <div className="text-center mt-12">
                    <button
                      onClick={() => setActiveTab('catalog')}
                      className="inline-flex items-center text-xs font-bold text-teal-600 hover:text-teal-700 uppercase tracking-wider group cursor-pointer"
                    >
                      <span>Explore Global Formulations Directory</span>
                      <ArrowRight className="h-4 w-4 ml-1.5 transform group-hover:translate-x-1 transition-transform" />
                    </button>
                  </div>
                )}
              </div>
            )}

            {/* Integrated Media Gallery Carousel */}
            {settings.showGallery !== false && (
              <div className="py-16 bg-slate-50 border-t border-b border-slate-200">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                  {/* Header */}
                  <div className="text-center mb-10">
                    <span className="text-[11px] font-mono font-bold tracking-wider text-teal-600 bg-teal-50 px-3 py-1 rounded-full border border-teal-100 uppercase">
                      Media Showcase
                    </span>
                    <h2 className="font-display text-3xl font-extrabold tracking-tight text-slate-900 mt-4 font-mono uppercase">
                      {settings?.facilitiesTitle || 'Operations & Sterile Facilities'}
                    </h2>
                    <p className="mt-2 text-xs sm:text-sm text-slate-500 max-w-2xl mx-auto">
                      Explore dynamic video walkthroughs and high-resolution still captures of our WHO-GMP sterile production suites, chromatography research blocks, and corporate events.
                    </p>
                  </div>

                  {/* 16:9 Aspect Ratio Carousel Wrapper */}
                  {galleryItems.length === 0 ? (
                    <div className="relative aspect-[16/9] w-full max-h-[600px] flex flex-col items-center justify-center rounded-2xl border border-slate-800 shadow-2xl bg-slate-950 p-6 text-center">
                      <ImageIcon className="h-10 w-10 text-slate-500 mb-3 animate-pulse" />
                      <h3 className="text-sm font-mono font-bold text-teal-400 uppercase tracking-widest">{settings?.mediaShowcaseTitle || 'Media Showcase'}</h3>
                      <p className="text-xs text-slate-400 mt-2 max-w-md">No media items are loaded in the database. Please visit the CMS Admin Panel to add and reorder photos or video walkthroughs.</p>
                    </div>
                  ) : (
                    <div className="relative aspect-[16/9] w-full max-h-[600px] overflow-hidden rounded-2xl border border-slate-800 shadow-2xl bg-slate-950 group">
                      
                      {/* Slides Container - Smooth horizontal hardware-accelerated sliding */}
                      <div 
                        className="w-full h-full flex transition-transform duration-700 ease-out select-none"
                        style={{ transform: `translateX(-${galleryCarouselIdx * 100}%)` }}
                      >
                        {galleryItems.map((item, idx) => {
                          return (
                            <div
                              key={item.id}
                              className="w-full h-full flex-shrink-0 relative"
                            >
                              <img
                                src={item.imageUrl}
                                alt={item.title}
                                className="w-full h-full object-cover"
                                referrerPolicy="no-referrer"
                              />
                              
                              {/* Dark Gradient Overlay over the bottom */}
                              <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent pointer-events-none" />
                              
                              {/* Video Play Icon Indicator */}
                              {item.type === 'videos' && (
                                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                                  <div className="h-16 w-16 sm:h-20 sm:w-20 rounded-full bg-teal-500/90 text-slate-950 flex items-center justify-center shadow-2xl backdrop-blur-sm transform group-hover:scale-110 transition duration-300">
                                    <Play className="h-6 w-6 sm:h-8 sm:w-8 fill-current ml-1" />
                                  </div>
                                </div>
                              )}

                              {/* Captions Text over Dark Gradient at the Bottom */}
                              <div className="absolute inset-x-0 bottom-0 p-6 sm:p-10 md:p-16 text-left flex flex-col justify-end z-10">
                                <div className="flex items-center space-x-2 mb-2">
                                  <span className="text-[10px] sm:text-xs text-teal-400 font-mono font-bold uppercase tracking-widest bg-teal-950/60 px-2.5 py-1 rounded border border-teal-800/40 backdrop-blur-sm">
                                    {item.category}
                                  </span>
                                  <span className="text-[10px] sm:text-xs text-slate-300 font-mono uppercase tracking-widest bg-slate-900/60 px-2.5 py-1 rounded border border-slate-800/40 backdrop-blur-sm">
                                    {item.type === 'videos' ? 'Video walk-through' : 'Production Still'}
                                  </span>
                                </div>
                                <h3 className="text-sm sm:text-xl md:text-2xl font-display font-bold text-white tracking-wider uppercase font-mono">
                                  {item.title}
                                </h3>
                                <p className="text-[10px] sm:text-xs text-slate-300 mt-1.5 sm:mt-2.5 font-light max-w-3xl leading-relaxed">
                                  {item.description}
                                </p>
                                
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    e.preventDefault();
                                    setLightboxImg(item.imageUrl);
                                  }}
                                  className="mt-4 inline-flex items-center self-start text-[10px] sm:text-xs font-bold text-teal-400 hover:text-teal-300 uppercase tracking-widest group/btn cursor-pointer bg-slate-900/50 backdrop-blur-sm hover:bg-slate-900 px-4 py-2 rounded-lg border border-slate-800/60 transition"
                                >
                                  <span>Preview Asset in Fullscreen</span>
                                  <ArrowRight className="h-3.5 w-3.5 ml-1.5 transform group-hover/btn:translate-x-1 transition-transform" />
                                </button>
                              </div>
                            </div>
                          );
                        })}
                      </div>

                      {/* Manual Override controls */}
                      <button
                        onClick={() => setGalleryCarouselIdx(prev => (prev === 0 ? galleryItems.length - 1 : prev - 1))}
                        className="absolute left-4 top-1/2 -translate-y-1/2 bg-slate-900/50 hover:bg-slate-900 text-white w-10 h-10 sm:w-12 sm:h-12 rounded-full flex items-center justify-center backdrop-blur-sm border border-slate-800/50 opacity-0 group-hover:opacity-100 transition duration-300 z-20 cursor-pointer"
                        title="Previous media file"
                      >
                        &larr;
                      </button>
                      <button
                        onClick={() => setGalleryCarouselIdx(prev => (prev === galleryItems.length - 1 ? 0 : prev + 1))}
                        className="absolute right-4 top-1/2 -translate-y-1/2 bg-slate-900/50 hover:bg-slate-900 text-white w-10 h-10 sm:w-12 sm:h-12 rounded-full flex items-center justify-center backdrop-blur-sm border border-slate-800/50 opacity-0 group-hover:opacity-100 transition duration-300 z-20 cursor-pointer"
                        title="Next media file"
                      >
                        &rarr;
                      </button>

                      {/* Indicators Indicators bar */}
                      <div className="absolute bottom-4 right-6 flex space-x-2 z-20">
                        {galleryItems.map((_, idx) => (
                          <button
                            key={idx}
                            onClick={() => setGalleryCarouselIdx(idx)}
                            className={`h-1.5 rounded-full transition-all duration-300 ${
                              idx === galleryCarouselIdx ? 'w-6 bg-teal-400' : 'w-1.5 bg-white/40 hover:bg-white/80'
                            }`}
                            title={`Go to media slide ${idx + 1}`}
                          />
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Regulatory Section Callout */}
            {(settings.showHomeRegulatory !== false || settings.showHomeDistributor !== false) && (
              <div className="bg-slate-950 text-white py-20 border-t border-slate-900 relative">
                {/* Visual Chemistry Nodes Overlay */}
                <div className="absolute right-0 bottom-0 opacity-10 pointer-events-none">
                  <svg className="w-96 h-96 text-teal-500" viewBox="0 0 100 100" fill="none">
                    <circle cx="20" cy="20" r="2" fill="currentColor" />
                    <circle cx="50" cy="50" r="3" fill="currentColor" />
                    <circle cx="80" cy="30" r="2" fill="currentColor" />
                    <line x1="20" y1="20" x2="50" y2="50" stroke="currentColor" strokeWidth="0.5" />
                    <line x1="50" y1="50" x2="80" y2="30" stroke="currentColor" strokeWidth="0.5" />
                  </svg>
                </div>

                <div className={`max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 ${
                  (settings.showHomeRegulatory !== false && settings.showHomeDistributor !== false)
                    ? 'grid grid-cols-1 lg:grid-cols-12 gap-12 items-center'
                    : 'flex justify-center'
                }`}>
                  {settings.showHomeRegulatory !== false && (
                    <div className={settings.showHomeDistributor === false ? 'max-w-3xl w-full' : 'lg:col-span-6'}>
                      <div className="inline-flex items-center space-x-1.5 bg-amber-500/10 text-amber-400 px-3 py-1 rounded-full text-xs font-mono mb-4 border border-amber-500/20">
                        <Award className="h-3.5 w-3.5 text-amber-400 animate-pulse" />
                        <span>{settings.regulatoryBadgeText || 'STABILITY TESTED CLIMATIC ZONE IV'}</span>
                      </div>
                      <h2 className="font-display text-3xl sm:text-4xl font-extrabold tracking-tight">
                        {settings.regulatoryTitle || 'World-Class Regulatory Dossier Delivery'}
                      </h2>
                      <p className="mt-4 text-xs sm:text-sm text-slate-300 leading-relaxed font-light">
                        {settings.regulatoryDesc || 'Every batch fabricated in our formulation plants is supported by exhaustive dossier frameworks, conforming with global Common Technical Document (CTD) formats. This guarantees seamless regulatory filings in EU, LATAM, Middle East, and Asia.'}
                      </p>
                      
                      <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="flex items-start space-x-3">
                          <CheckCircle2 className="h-5 w-5 text-teal-400 shrink-0 mt-0.5" />
                          <div>
                            <h4 className="text-xs font-bold font-mono">{settings.regulatoryFeature1Title || 'CTD/eCTD Formatting'}</h4>
                            <p className="text-[11px] text-slate-400 mt-0.5">{settings.regulatoryFeature1Desc || 'Ready for filing and clinical registration'}</p>
                          </div>
                        </div>
                        <div className="flex items-start space-x-3">
                          <CheckCircle2 className="h-5 w-5 text-teal-400 shrink-0 mt-0.5" />
                          <div>
                            <h4 className="text-xs font-bold font-mono">{settings.regulatoryFeature2Title || 'COA Stability Logs'}</h4>
                            <p className="text-[11px] text-slate-400 mt-0.5">{settings.regulatoryFeature2Desc || 'Zone IV standard long-term documentation'}</p>
                          </div>
                        </div>
                        <div className="flex items-start space-x-3">
                          <CheckCircle2 className="h-5 w-5 text-teal-400 shrink-0 mt-0.5" />
                          <div>
                            <h4 className="text-xs font-bold font-mono">{settings.regulatoryFeature3Title || 'Impurity Profiling'}</h4>
                            <p className="text-[11px] text-slate-400 mt-0.5">{settings.regulatoryFeature3Desc || 'High-accuracy chromatography verified'}</p>
                          </div>
                        </div>
                        <div className="flex items-start space-x-3">
                          <CheckCircle2 className="h-5 w-5 text-teal-400 shrink-0 mt-0.5" />
                          <div>
                            <h4 className="text-xs font-bold font-mono">{settings.regulatoryFeature4Title || 'Clean-Room Validation'}</h4>
                            <p className="text-[11px] text-slate-400 mt-0.5">{settings.regulatoryFeature4Desc || 'Grade A/B laminar HVAC logs included'}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                  
                  {settings.showHomeDistributor !== false && (
                    <div className={`lg:col-span-6 bg-slate-900 border border-slate-800 rounded-2xl p-6 sm:p-8 shadow-2xl relative ${
                      settings.showHomeRegulatory === false ? 'max-w-2xl w-full' : ''
                    }`}>
                      <h3 className="font-display text-lg font-bold text-white mb-4 flex items-center tracking-wide">
                        <Mail className="h-5 w-5 text-teal-400 mr-2" /> {settings.distributorTitle || 'Global Distributor Application'}
                      </h3>
                      <p className="text-xs text-slate-400 font-light mb-6">
                        {settings.distributorDesc || 'Submit your regional therapeutic requirements to request active COA batch dossiers, stability files, and wholesale quotation schedules.'}
                      </p>
                      
                      {distributorSuccess ? (
                        <div className="bg-teal-950/40 border border-teal-800 rounded-lg p-6 text-center">
                          <CheckCircle2 className="h-10 w-10 text-teal-400 mx-auto mb-3 animate-bounce" />
                          <h4 className="text-xs font-bold text-teal-200 font-mono">Application Transmitted Successfully</h4>
                          <p className="text-[11px] text-teal-300 mt-2 leading-relaxed">
                            Your export request has been logged inside our regulatory system. A geographic compliance officer will respond with COA datasheets in 48 hours.
                          </p>
                        </div>
                      ) : (
                        <form onSubmit={handleDistributorSubmit} className="space-y-4">
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1 font-mono">Your Name</label>
                              <input
                                type="text"
                                required
                                value={distributorForm.name}
                                onChange={(e) => setDistributorForm({ ...distributorForm, name: e.target.value })}
                                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:ring-1 focus:ring-teal-500"
                              />
                            </div>
                            <div>
                              <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1 font-mono">Business Email</label>
                              <input
                                type="email"
                                required
                                value={distributorForm.email}
                                onChange={(e) => setDistributorForm({ ...distributorForm, email: e.target.value })}
                                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:ring-1 focus:ring-teal-500"
                              />
                            </div>
                          </div>
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1 font-mono">Contact Phone</label>
                              <input
                                type="text"
                                value={distributorForm.phone}
                                onChange={(e) => setDistributorForm({ ...distributorForm, phone: e.target.value })}
                                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:ring-1 focus:ring-teal-500"
                              />
                            </div>
                            <div>
                              <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1 font-mono">Company Name</label>
                              <input
                                type="text"
                                required
                                value={distributorForm.companyName}
                                onChange={(e) => setDistributorForm({ ...distributorForm, companyName: e.target.value })}
                                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:ring-1 focus:ring-teal-500"
                              />
                            </div>
                          </div>
                          <div>
                            <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1 font-mono">Distribution Region & Product Scope</label>
                            <textarea
                              rows={3}
                              required
                              placeholder="E.g., Seeking exclusive procurement of CardioVance Duo in GCC / MENA region..."
                              value={distributorForm.message}
                              onChange={(e) => setDistributorForm({ ...distributorForm, message: e.target.value })}
                              className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:ring-1 focus:ring-teal-500 placeholder-slate-600"
                            />
                          </div>
                          <button
                            type="submit"
                            disabled={submitting}
                            className="w-full bg-teal-600 hover:bg-teal-500 text-white py-2.5 rounded-lg text-xs font-bold tracking-wider uppercase shadow-lg shadow-teal-950/40 transition duration-150 cursor-pointer"
                          >
                            {submitting ? 'Transmitting Secure Request...' : 'Submit Partnership Application'}
                          </button>
                        </form>
                      )}
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        )}

        {/* TAB: ABOUT US (Timeline, Vision, Mission, Leadership, Infrastructure) */}
        {activeTab === 'about' && (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 fade-in-up">
            {/* Header / Intro */}
            <div className="text-center max-w-3xl mx-auto mb-16">
              <span className="text-teal-600 font-bold text-xs uppercase tracking-widest font-mono">Corporate Identity</span>
              <h1 className="font-display text-3xl sm:text-4xl font-extrabold text-slate-900 mt-2 tracking-tight">
                {settings?.aboutTitle || 'Pioneering Global Healthcare Solutions'}
              </h1>
              <p className="text-sm text-slate-500 mt-4 leading-relaxed font-light">
                {settings?.aboutSubtitle || 'Pioneering formulations and high-bioavailability research for global markets.'}
              </p>
            </div>

            {/* Vision & Mission Sub-sections */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
              <div className="bg-slate-900 text-white rounded-2xl p-8 sm:p-10 border border-slate-800 shadow-xl relative overflow-hidden group">
                <div className="absolute right-0 bottom-0 opacity-5 pointer-events-none transform translate-y-10 translate-x-10">
                  <Globe className="h-48 w-48 text-teal-400" />
                </div>
                <div className="h-12 w-12 rounded-xl bg-teal-500/10 border border-teal-500/30 flex items-center justify-center text-teal-400 mb-6 group-hover:scale-105 transition-transform">
                  <Globe className="h-6 w-6" />
                </div>
                <h3 className="font-display text-xl font-bold mb-3">{settings?.aboutVisionTitle || 'Our Corporate Vision'}</h3>
                <p className="text-xs text-slate-300 leading-relaxed font-light">
                  {settings?.aboutVisionText || 'To be a premier global force in medicine by innovating life-enhancing therapeutics, ensuring that every tablet, capsule, and sterile injectable delivers the highest standards of safety, efficacy, and affordability to patients in every corner of the world.'}
                </p>
                <div className="mt-6 flex items-center space-x-2 text-[10px] font-mono text-teal-400 uppercase tracking-widest font-semibold">
                  <span>Therapeutic Accessibility</span>
                  <span className="h-1 w-1 rounded-full bg-teal-500"></span>
                  <span>Scientific Integrity</span>
                </div>
              </div>

              <div className="bg-white rounded-2xl p-8 sm:p-10 border border-slate-100 shadow-xl relative overflow-hidden group">
                <div className="absolute right-0 bottom-0 opacity-5 pointer-events-none transform translate-y-10 translate-x-10">
                  <Award className="h-48 w-48 text-teal-600" />
                </div>
                <div className="h-12 w-12 rounded-xl bg-teal-50 flex items-center justify-center text-teal-600 mb-6 group-hover:scale-105 transition-transform">
                  <Award className="h-6 w-6" />
                </div>
                <h3 className="font-display text-xl font-bold mb-3 text-slate-900">{settings?.aboutMissionTitle || 'Our Commitments & Mission'}</h3>
                <p className="text-xs text-slate-500 leading-relaxed font-light">
                  {settings?.aboutMissionText || 'To manufacture premium WHO-GMP compliant formulations by utilizing cutting-edge automated synthesis, implementing rigorous HPLC and disintegration assays, and providing a reliable, transparent supply chain that meets the strictest international dossier delivery expectations.'}
                </p>
                <div className="mt-6 flex items-center space-x-2 text-[10px] font-mono text-teal-600 uppercase tracking-widest font-semibold">
                  <span>Zero-Defect Culture</span>
                  <span className="h-1 w-1 rounded-full bg-teal-600"></span>
                  <span>Dossier Perfection</span>
                </div>
              </div>
            </div>

            {/* Timeline Sub-section (Interactive Milestones) */}
            <div id="timeline-section" className="mb-20 bg-slate-50 rounded-2xl p-8 border border-slate-200">
              <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 pb-5 border-b border-slate-200">
                <div>
                  <span className="text-[10px] font-mono font-bold uppercase text-teal-600 tracking-wider">Corporate History</span>
                  <h2 className="font-display text-2xl font-bold text-slate-900 mt-1">Our Journey & Milestones</h2>
                </div>
                <p className="text-xs text-slate-500 max-w-sm mt-2 md:mt-0 leading-relaxed font-light">
                  Click on any historical era below to inspect the milestone achievements, regulatory certificates, and expansion logs.
                </p>
              </div>

              {/* Interactive Timeline Tabs */}
              <div className="flex overflow-x-auto pb-4 gap-2 mb-8 scrollbar-thin">
                {timelineData.map((milestone) => (
                  <button
                    key={milestone.year}
                    onClick={() => setActiveTimelineYear(milestone.year)}
                    className={`px-4 py-2.5 rounded-xl font-mono text-xs font-bold whitespace-nowrap transition duration-150 border flex-shrink-0 cursor-pointer ${
                      activeTimelineYear === milestone.year
                        ? 'bg-teal-600 text-white border-teal-600 shadow-md shadow-teal-600/10'
                        : 'bg-white text-slate-600 border-slate-200 hover:border-slate-300 hover:bg-slate-50'
                    }`}
                  >
                    🚀 {milestone.year} - {milestone.title}
                  </button>
                ))}
              </div>

              {/* Selected Timeline Milestone Details */}
              {timelineData.map((milestone) => {
                if (milestone.year !== activeTimelineYear) return null;
                return (
                  <div key={milestone.year} className="bg-white rounded-xl p-6 border border-slate-100 shadow-md grid grid-cols-1 md:grid-cols-3 gap-6 animate-fade-in">
                    <div className="md:col-span-1 bg-slate-950 rounded-lg overflow-hidden relative min-h-[160px] flex items-center justify-center border border-slate-200">
                      <img
                        src={milestone.imageUrl}
                        alt={milestone.title}
                        className="w-full h-full object-cover opacity-85"
                        referrerPolicy="no-referrer"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent flex flex-col justify-end p-4">
                        <span className="text-white text-3xl font-mono font-extrabold tracking-tight">{milestone.year}</span>
                        <span className="text-teal-400 font-mono text-[9px] uppercase tracking-wider font-bold">Chronicle Record</span>
                      </div>
                    </div>
                    <div className="md:col-span-2 flex flex-col justify-between">
                      <div>
                        <h4 className="text-lg font-bold text-slate-900">{milestone.title}</h4>
                        <p className="text-xs text-slate-600 mt-2 leading-relaxed font-light">{milestone.details}</p>
                        
                        <div className="grid grid-cols-2 gap-4 mt-4 bg-slate-50 p-3 rounded-lg border border-slate-100">
                          <div>
                            <span className="text-[9px] text-slate-400 font-mono uppercase block">Regulatory Status</span>
                            <span className="text-xs font-bold text-slate-700 flex items-center mt-0.5">
                              <CheckCircle2 className="h-3.5 w-3.5 text-teal-500 mr-1 shrink-0 animate-pulse" />
                              {milestone.regulatory}
                            </span>
                          </div>
                          <div>
                            <span className="text-[9px] text-slate-400 font-mono uppercase block">Global Reach</span>
                            <span className="text-xs font-bold text-slate-700 flex items-center mt-0.5">
                              <Globe className="h-3.5 w-3.5 text-teal-500 mr-1 shrink-0" />
                              {milestone.reach}
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="mt-4 flex items-center justify-between text-[10px] font-mono text-slate-400 pt-3 border-t border-slate-100">
                        <span>Milestone Index: {milestone.id} of 5</span>
                        <span>Scope Focus: {milestone.scope}</span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Leadership Sub-section */}
            <div id="leadership-section" className="mb-20">
              <div className="text-center max-w-2xl mx-auto mb-12">
                <span className="text-teal-600 font-bold text-xs uppercase tracking-widest font-mono">Our Board & Scientists</span>
                <h2 className="font-display text-2xl sm:text-3xl font-bold text-slate-900 mt-1">Exemplary Leadership</h2>
                <p className="text-xs text-slate-500 mt-2 font-light">
                  Bridging commercial compliance and pharmaceutical discovery through decades of experience in clinical chemistry and worldwide markets.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {leadershipData.map((leader) => (
                  <div key={leader.id} className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm hover:shadow-md transition-shadow group">
                    <div className="aspect-square bg-slate-100 overflow-hidden relative">
                      <img
                        src={leader.imageUrl}
                        alt={leader.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition duration-200"
                        referrerPolicy="no-referrer"
                      />
                      <div className="absolute top-2 right-2 bg-slate-950/80 backdrop-blur-md px-2 py-1 rounded text-[8px] font-mono font-bold text-teal-400 uppercase tracking-wider">
                        {leader.experience}
                      </div>
                    </div>
                    <div className="p-4">
                      <h4 className="text-sm font-bold text-slate-900">{leader.name}</h4>
                      <p className="text-[11px] font-mono text-teal-600 font-semibold mt-0.5">{leader.role}</p>
                      <p className="text-[10px] text-slate-400 font-medium italic mt-1">{leader.credentials}</p>
                      <p className="text-xs text-slate-500 mt-2 font-light leading-relaxed border-t border-slate-100 pt-2">
                        {leader.bio}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Infrastructure Sub-section */}
            <div id="infrastructure-section" className="bg-slate-950 text-white rounded-2xl p-8 sm:p-10 border border-slate-800 relative overflow-hidden shadow-2xl">
              <div className="absolute top-0 right-0 h-48 w-48 bg-teal-500/10 rounded-full blur-3xl pointer-events-none"></div>
              <div className="relative z-10">
                <div className="max-w-2xl mb-10">
                  <span className="text-teal-400 font-bold text-xs uppercase tracking-widest font-mono">
                    {settings?.infraSectionBadge || 'Precision Machinery'}
                  </span>
                  <h2 className="font-display text-2xl sm:text-3xl font-bold mt-1 text-white">
                    {settings?.infraSectionTitle || 'Advanced Plant & Infrastructure'}
                  </h2>
                  <p className="text-xs text-slate-400 mt-2 leading-relaxed font-light">
                    {settings?.infraSectionDesc || 'Our formulation complexes are engineered to maintain stringent dynamic environmental barriers, utilizing HEPA air recirculators, terminal differential loggers, and analytical chromatography instruments.'}
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {(settings?.infraData || []).map((infra) => (
                    <div key={infra.id} className="bg-slate-900/60 border border-slate-800/80 rounded-xl p-5 hover:bg-slate-900 hover:border-slate-700/80 transition-all">
                      <div className="h-10 w-10 bg-teal-500/10 rounded-lg flex items-center justify-center text-teal-400 mb-4">
                        {infra.id === 1 ? <FlaskConical className="h-5 w-5" /> : infra.id === 2 ? <Activity className="h-5 w-5" /> : <Database className="h-5 w-5" />}
                      </div>
                      <h4 className="text-sm font-bold text-white uppercase tracking-wider font-mono">{infra.name}</h4>
                      <p className="text-xs text-slate-400 mt-2 font-light leading-relaxed">{infra.details}</p>
                      <div className="mt-4 flex items-center justify-between text-[9px] font-mono text-slate-500">
                        <span>Metric: {infra.calibration}</span>
                        <span className="text-teal-400 font-bold uppercase">{infra.level}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: FORMULATIONS CATALOG */}
        {activeTab === 'catalog' && (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 fade-in-up">
            <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 pb-5 border-b border-slate-200">
              <div>
                <h1 className="font-display text-2xl font-bold text-slate-900">Formulations Monograph & Catalog</h1>
                <p className="text-xs text-slate-500 mt-1">WHO-GMP certified dosages, stability-tested compositions, and full indications logs.</p>
              </div>

              {/* High-quality search bar */}
              <div className="mt-4 md:mt-0 flex space-x-3 w-full md:w-auto">
                <div className="relative flex-grow md:flex-grow-0 md:w-80">
                  <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                  <input
                    type="text"
                    placeholder="Search by name, active API, or indications..."
                    value={searchQuery}
                    onChange={(e) => {
                      setSearchQuery(e.target.value);
                      if (selectedProduct) setSelectedProduct(null);
                    }}
                    className="w-full pl-9 pr-4 py-2 bg-white border border-slate-300 rounded-lg text-xs focus:outline-none focus:ring-1 focus:ring-teal-500 focus:border-teal-500"
                  />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
              {/* Left Sidebar: Categories */}
              <div className="space-y-4">
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 font-mono flex items-center">
                  <Filter className="h-3.5 w-3.5 text-teal-600 mr-1.5" /> Filter by Class
                </h3>
                <div className="bg-white rounded-lg border border-slate-200 overflow-hidden">
                  <button
                    onClick={() => {
                      setSelectedCategory('all');
                      setSelectedProduct(null);
                    }}
                    className={`w-full text-left px-4 py-3 text-xs font-semibold tracking-wide transition duration-150 border-b border-slate-100 flex items-center justify-between ${
                      selectedCategory === 'all' ? 'bg-teal-50 text-teal-700' : 'text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    <span>All Therapeutic Formulations</span>
                    <span className="bg-slate-100 text-slate-500 font-mono text-[9px] px-2 py-0.5 rounded-full">
                      {publishedProducts.length}
                    </span>
                  </button>
                  {categories.map((cat) => {
                    const count = productCountsByCategory[cat.id] || 0;
                    return (
                      <button
                        key={cat.id}
                        onClick={() => {
                          setSelectedCategory(cat.id);
                          setSelectedProduct(null);
                        }}
                        className={`w-full text-left px-4 py-3 text-xs font-semibold tracking-wide transition duration-150 border-b border-slate-100 flex items-center justify-between ${
                          selectedCategory === cat.id ? 'bg-teal-50 text-teal-700' : 'text-slate-600 hover:bg-slate-50'
                        }`}
                      >
                        <div className="pr-2">
                          <div className="font-bold">{cat.name}</div>
                          <div className="text-[10px] text-slate-400 font-light mt-0.5 truncate max-w-[200px]">{cat.description}</div>
                        </div>
                        <span className="bg-slate-100 text-slate-500 font-mono text-[9px] px-2 py-0.5 rounded-full">
                          {count}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Right Content: Product Grid or Single Product detail */}
              <div className="lg:col-span-3 space-y-6">
                {selectedProduct ? (
                  /* Single Product Dossier Sheet View */
                  <div className="bg-white rounded-3xl border border-slate-100 shadow-xl overflow-hidden transition-all duration-300">
                    {/* Header Banner */}
                    <div className="bg-slate-900 text-white p-8 sm:p-10 relative overflow-hidden">
                      {/* Decorative background grid pattern */}
                      <div className="absolute inset-0 opacity-10 bg-[linear-gradient(to_right,#808080_1px,transparent_1px),linear-gradient(to_bottom,#808080_1px,transparent_1px)] bg-[size:14px_24px]"></div>
                      
                      <div className="relative z-10 flex flex-col md:flex-row md:items-center md:justify-between gap-6">
                        <div className="space-y-4">
                          <button
                            onClick={() => {
                              setSelectedProduct(null);
                              window.scrollTo({ top: 0, behavior: 'smooth' });
                            }}
                            className="text-xs text-slate-300 hover:text-white font-mono flex items-center transition duration-150 cursor-pointer bg-white/5 hover:bg-white/10 px-4 py-2 rounded-full border border-white/10"
                          >
                            <span className="mr-2">&larr;</span> Back to Catalog Directory
                          </button>
                          <div>
                            <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-3 py-1 rounded-full inline-flex items-center">
                              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 mr-2 animate-pulse"></span>
                              Active Clinical Monograph
                            </span>
                            <h2 className="text-3xl sm:text-4xl font-display font-bold leading-tight tracking-tight mt-3 text-white">
                              {selectedProduct.brandName}
                            </h2>
                          </div>
                          <div className="text-sm font-mono text-slate-300 flex flex-wrap items-center gap-2">
                            <span className="italic font-medium text-light-cyan">{selectedProduct.genericName}</span>
                            <span className="text-slate-600">•</span>
                            <span className="text-xs bg-white/10 px-2.5 py-0.5 rounded text-white font-semibold">{selectedProduct.strength}</span>
                          </div>
                        </div>

                        <div className="shrink-0 bg-white/5 border border-white/10 p-5 rounded-2xl md:max-w-xs space-y-1.5 backdrop-blur-sm">
                          <span className="text-[8px] text-slate-400 uppercase tracking-widest font-mono font-bold block">Therapeutic Monograph Registry</span>
                          <span className="text-xs text-slate-200 block font-semibold">{categories.find((c) => c.id === selectedProduct.categoryId)?.name}</span>
                          <span className="text-[9px] text-slate-400 font-mono block pt-1 border-t border-white/5">ID Ref: #{selectedProduct.id.slice(0, 12).toUpperCase()}</span>
                        </div>
                      </div>
                    </div>

                    <div className="p-6 sm:p-10 space-y-12 bg-white">
                      {/* Top section: Grid of Product Visual Slider & Clinical Specifications */}
                      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
                        {/* Left Column: Visual Slider & Quick Specs */}
                        <div className="lg:col-span-5 space-y-8">
                          <div>
                            <h3 className="text-[10px] font-mono font-bold uppercase tracking-wider text-slate-400 mb-3 flex items-center">
                              <span className="inline-block w-1.5 h-1.5 rounded-full bg-slate-400 mr-2"></span>
                              Asset Visual Presentation
                            </h3>
                            <div className="h-64 sm:h-72 bg-gradient-to-b from-slate-50 to-slate-100/40 rounded-2xl overflow-hidden relative border border-slate-100 flex items-center justify-center p-2 shadow-inner">
                              <ProductImageManualSlider images={selectedProduct.images || []} dark={false} />
                            </div>
                          </div>

                          {/* Technical Specifications Block */}
                          <div className="bg-slate-50/70 border border-slate-100 rounded-2xl p-6 space-y-5">
                            <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-slate-700 border-b border-slate-200/55 pb-3 flex items-center gap-2">
                              <span>Physical Spec Monograph</span>
                            </h3>
                            
                            <div className="space-y-4 text-xs">
                              <div>
                                <span className="text-[9px] text-slate-400 block uppercase font-mono font-bold tracking-wider mb-1">Active Substance (Composition)</span>
                                <span className="text-slate-800 font-semibold block font-mono bg-white px-3.5 py-2.5 rounded-xl border border-slate-200/55 shadow-sm leading-relaxed">{selectedProduct.composition}</span>
                              </div>
                              
                              <div className="grid grid-cols-2 gap-4">
                                <div>
                                  <span className="text-[9px] text-slate-400 block uppercase font-mono font-bold tracking-wider mb-1">Dose Strength</span>
                                  <span className="text-slate-900 font-bold block bg-white px-3.5 py-2.5 rounded-xl border border-slate-200/55 shadow-sm text-center font-mono">{selectedProduct.strength}</span>
                                </div>
                                <div>
                                  <span className="text-[9px] text-slate-400 block uppercase font-mono font-bold tracking-wider mb-1">Packaging Format</span>
                                  <span className="text-slate-900 font-bold block bg-white px-3.5 py-2.5 rounded-xl border border-slate-200/55 shadow-sm text-center font-mono">{selectedProduct.packaging}</span>
                                </div>
                              </div>

                              <div className="pt-4 border-t border-slate-200/55 flex justify-between items-center text-[10px] font-mono text-slate-500">
                                <span>Regulatory Monograph:</span>
                                <span className="font-bold text-slate-800">GMP-COMPLIANT</span>
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Right Column: Detailed Monograph Copy */}
                        <div className="lg:col-span-7 space-y-8">
                          <div className="space-y-3">
                            <h4 className="text-[10px] font-mono font-bold uppercase tracking-wider text-slate-400 flex items-center">
                              <span className="h-1.5 w-1.5 rounded-full bg-slate-400 mr-2"></span>
                              Clinical Indications & Therapeutic Utility
                            </h4>
                            <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm leading-relaxed text-slate-700 space-y-2">
                              <p className="text-sm font-light">{selectedProduct.indications}</p>
                            </div>
                          </div>
                          
                          <div className="space-y-3">
                            <h4 className="text-[10px] font-mono font-bold uppercase tracking-wider text-slate-400 flex items-center">
                              <span className="h-1.5 w-1.5 rounded-full bg-slate-400 mr-2"></span>
                              Dosage Protocols & Administration Instructions
                            </h4>
                            <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm leading-relaxed text-slate-700 space-y-2">
                              <p className="text-sm font-light">{selectedProduct.dosage}</p>
                            </div>
                          </div>

                          {/* Split row for Safety and Warnings */}
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-2">
                            <div className="bg-rose-50/20 border border-rose-100/50 p-6 rounded-2xl space-y-2">
                              <h4 className="text-[10px] font-bold text-rose-800 uppercase tracking-wider font-mono flex items-center">
                                <span className="inline-block h-2 w-2 rounded-full bg-rose-500 mr-2"></span>
                                Contraindications
                              </h4>
                              <p className="text-xs text-slate-700 leading-relaxed font-light">{selectedProduct.contraindications}</p>
                            </div>

                            <div className="bg-slate-50/50 border border-slate-100 p-6 rounded-2xl space-y-2">
                              <h4 className="text-[10px] font-bold text-slate-700 uppercase tracking-wider font-mono flex items-center">
                                <span className="inline-block h-2 w-2 rounded-full bg-slate-400 mr-2"></span>
                                Adverse Reactions
                              </h4>
                              <p className="text-xs text-slate-700 leading-relaxed font-light">{selectedProduct.sideEffects}</p>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Bottom Section: Technical Monograph & Batch Quotation Inquiry Form */}
                      <div className="border-t border-slate-100 pt-10">
                        <div className="bg-slate-50 border border-slate-100 rounded-3xl p-6 sm:p-8 md:p-10">
                          <div className="max-w-3xl mx-auto">
                            <div className="text-center md:text-left md:flex md:items-center md:justify-between border-b border-slate-200/60 pb-6 mb-8">
                              <div>
                                <h4 className="text-lg font-bold text-slate-900 flex items-center justify-center md:justify-start gap-2">
                                  <Send className="h-5 w-5 text-slate-800" /> 
                                  <span>Dossier & Technical Procurement Request</span>
                                </h4>
                                <p className="text-xs text-slate-500 mt-1">Submit this secure monograph inquiry to receive the official stability studies, batch logs, or sample procurement packages.</p>
                              </div>
                              <span className="inline-block mt-3 md:mt-0 px-3 py-1 bg-white border border-slate-200 text-slate-700 font-mono text-[9px] font-bold uppercase rounded-full shadow-sm shrink-0">
                                REGULATORY COMPLIANCE DIRECT ROUTE
                              </span>
                            </div>

                            {productSuccess ? (
                              <div className="bg-white border border-emerald-100 rounded-2xl p-8 text-center animate-fade-in shadow-sm">
                                <CheckCircle2 className="h-12 w-12 text-emerald-600 mx-auto mb-3.5" />
                                <h5 className="text-sm font-bold text-slate-900">Inquiry Logged inside {settings.companyName || 'Pharmaceutical Enterprise'} CMS</h5>
                                <p className="text-xs text-slate-600 mt-1.5 leading-relaxed">Our export compliance head will email you the full technical monograph files and dossier packages.</p>
                              </div>
                            ) : (
                              <form onSubmit={handleProductInquirySubmit} className="space-y-6">
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                  <div>
                                    <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-2 font-mono">Your Full Name / Title</label>
                                    <input
                                      type="text"
                                      required
                                      placeholder="e.g. Dr. Arthur Pendelton"
                                      value={productInquiryForm.name}
                                      onChange={(e) => setProductInquiryForm({ ...productInquiryForm, name: e.target.value })}
                                      className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 text-xs focus:outline-none focus:ring-2 focus:ring-slate-800 focus:border-transparent transition duration-150"
                                    />
                                  </div>
                                  <div>
                                    <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-2 font-mono">Corporate / Inst. Email</label>
                                    <input
                                      type="email"
                                      required
                                      placeholder="e.g. name@organization.org"
                                      value={productInquiryForm.email}
                                      onChange={(e) => setProductInquiryForm({ ...productInquiryForm, email: e.target.value })}
                                      className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 text-xs focus:outline-none focus:ring-2 focus:ring-slate-800 focus:border-transparent transition duration-150"
                                    />
                                  </div>
                                  <div>
                                    <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-2 font-mono">Telephone Number</label>
                                    <input
                                      type="text"
                                      placeholder="e.g. +1 (555) 019-2834"
                                      value={productInquiryForm.phone}
                                      onChange={(e) => setProductInquiryForm({ ...productInquiryForm, phone: e.target.value })}
                                      className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 text-xs focus:outline-none focus:ring-2 focus:ring-slate-800 focus:border-transparent transition duration-150"
                                    />
                                  </div>
                                </div>

                                <div>
                                  <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-2 font-mono">Dossier / Batch Requirements & Intended Region</label>
                                  <textarea
                                    rows={4}
                                    required
                                    placeholder="Please state intended import market, stability study requests, requested annual volume, and any special certificate parameters required..."
                                    value={productInquiryForm.message}
                                    onChange={(e) => setProductInquiryForm({ ...productInquiryForm, message: e.target.value })}
                                    className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 text-xs focus:outline-none focus:ring-2 focus:ring-slate-800 focus:border-transparent placeholder-slate-400 transition duration-150"
                                  />
                                </div>

                                <div className="flex justify-end pt-2">
                                  <button
                                    type="submit"
                                    disabled={submitting}
                                    className="w-full sm:w-auto bg-slate-900 hover:bg-slate-800 text-white font-bold uppercase tracking-wider text-[11px] px-8 py-4 rounded-xl shadow-sm hover:shadow-md transition-all duration-150 cursor-pointer"
                                  >
                                    {submitting ? 'Transmitting Secure Request...' : 'Send Secure Inquiry Monograph'}
                                  </button>
                                </div>
                              </form>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ) : (
                  /* Catalog Grid View */
                  <div>
                    {filteredProducts.length === 0 ? (
                      <div className="bg-white border border-slate-200 rounded-xl p-12 text-center text-slate-500">
                        <BookOpen className="h-10 w-10 text-slate-300 mx-auto mb-3 animate-pulse" />
                        <h4 className="text-xs font-bold">No Formulations Located</h4>
                        <p className="text-xs text-slate-400 mt-1">Adjust your text search or category filter class above.</p>
                      </div>
                    ) : (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {filteredProducts.map((product) => (
                          <div
                            key={product.id}
                            className="bg-white border border-slate-100 hover:border-slate-200 hover:shadow-xl transition-all duration-300 flex flex-col h-full transform hover:-translate-y-1.5 overflow-hidden rounded-3xl group"
                          >
                            {/* Top Badge Overlay Container */}
                            <div className="px-6 pt-5 pb-3 flex justify-between items-center gap-2 bg-slate-50/50 border-b border-slate-100/50 min-w-0">
                              <span 
                                className="text-[10px] font-mono font-bold uppercase tracking-wider text-slate-600 bg-slate-200/60 px-3 py-1 rounded-full truncate max-w-[130px] sm:max-w-[180px]"
                                title={categories.find((c) => c.id === product.categoryId)?.name || 'Class Formulation'}
                              >
                                {categories.find((c) => c.id === product.categoryId)?.name || 'Class Formulation'}
                              </span>
                              <span className="text-[9px] text-slate-450 font-mono font-semibold tracking-wider flex items-center bg-emerald-500/5 px-2.5 py-1 rounded-full border border-emerald-500/10 shrink-0 whitespace-nowrap">
                                <span className="inline-block h-1.5 w-1.5 rounded-full bg-emerald-500 mr-1.5 animate-pulse"></span>
                                WHO-GMP Certified
                              </span>
                            </div>

                            {/* Product Image Slider Header */}
                            <div className="p-4">
                              <div className="h-48 bg-gradient-to-b from-slate-50 to-slate-100/40 border border-slate-100 rounded-2xl flex items-center justify-center relative p-1 group-hover:bg-white transition-all duration-300">
                                {product.images && product.images.length > 0 ? (
                                  <ProductImageManualSlider images={product.images} dark={false} />
                                ) : (
                                  <div className="text-[10px] font-mono text-slate-500 italic">No custom images registered</div>
                                )}
                              </div>
                            </div>

                            {/* Card Content body */}
                            <div className="px-6 pb-6 pt-2 flex-grow flex flex-col justify-between">
                              <div>
                                <h3 className="font-display text-lg font-bold text-slate-900 leading-snug group-hover:text-blue-slate-600 transition-colors">
                                  {product.brandName}
                                </h3>
                                
                                {/* Sub-label inside a clean pharmaceutical strip */}
                                <div className="mt-2 mb-3 bg-slate-50 border border-slate-100 rounded-lg px-3 py-1.5 flex items-center justify-between gap-1 text-xs">
                                  <span className="font-mono text-blue-slate-600 font-semibold truncate italic">{product.genericName}</span>
                                  <span className="font-bold text-slate-800 shrink-0 bg-white shadow-sm border border-slate-200/50 px-2 py-0.5 rounded text-[10px]">{product.strength}</span>
                                </div>

                                <p className="text-xs text-slate-500 leading-relaxed line-clamp-3 font-light pt-1">
                                  {product.indications}
                                </p>
                              </div>

                              {/* Technical specifications bento micro-panel */}
                              <div className="mt-4 pt-4 border-t border-slate-100 space-y-2">
                                <div className="grid grid-cols-2 gap-2 text-[10px] font-mono text-slate-500">
                                  <div className="bg-slate-50/80 p-2.5 rounded-xl border border-slate-100/50 flex flex-col justify-between">
                                    <span className="text-[8px] text-slate-400 block uppercase font-bold tracking-wider">Packaging</span>
                                    <span className="text-slate-800 font-semibold block mt-0.5 truncate" title={product.packaging}>{product.packaging}</span>
                                  </div>
                                  <div className="bg-slate-50/80 p-2.5 rounded-xl border border-slate-100/50 flex flex-col justify-between">
                                    <span className="text-[8px] text-slate-400 block uppercase font-bold tracking-wider">Product Code</span>
                                    <span className="text-slate-800 font-semibold block mt-0.5 truncate uppercase">#{(product.id || 'N/A').slice(0, 8)}</span>
                                  </div>
                                </div>
                                <div className="bg-light-cyan/30 border border-light-cyan/50 p-2.5 rounded-xl text-[10px] font-mono text-blue-slate-700 leading-relaxed">
                                  <strong className="text-slate-500 uppercase text-[8px] block tracking-wider mb-0.5">Active Composition</strong>
                                  <span className="text-slate-800 font-medium line-clamp-1" title={product.composition}>{product.composition}</span>
                                </div>
                              </div>

                              {/* Solid premium dark button */}
                              <div className="mt-5">
                                <button
                                  onClick={() => {
                                    setSelectedProduct(product);
                                    window.scrollTo({ top: 0, behavior: 'smooth' });
                                  }}
                                  className="w-full bg-slate-900 hover:bg-slate-850 text-white text-center py-3 rounded-xl transition-all duration-200 text-xs font-semibold uppercase tracking-wider flex items-center justify-center gap-2 group-hover:shadow-md cursor-pointer"
                                >
                                  <span>Review Full Spec Sheet</span>
                                  <ArrowRight className="h-4 w-4 transform group-hover:translate-x-1 transition-transform" />
                                </button>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: MANUFACTURING FACILITIES */}
        {activeTab === 'facilities' && (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 fade-in-up">
            <div className="text-center max-w-2xl mx-auto mb-12">
              <h1 className="font-display text-2xl font-bold text-slate-900">Advanced Manufacturing & Science Facilities</h1>
              <p className="text-xs text-slate-500 mt-2">
                Our WHO-GMP compliant, high-containment manufacturing modules feature Grade A/B aseptic areas, automated blistering equipment, and stability chambers.
              </p>
            </div>

            <div className="space-y-12">
              {facilities.map((fac, idx) => (
                <div
                  key={fac.id}
                  className={`bg-white border border-slate-200 rounded-xl overflow-hidden flex flex-col lg:flex-row shadow-custom-sm ${
                    idx % 2 === 1 ? 'lg:flex-row-reverse' : ''
                  }`}
                >
                  <div className="lg:w-2/5 bg-slate-900 text-white p-8 sm:p-10 flex flex-col justify-between">
                    <div>
                      <div className="inline-flex items-center space-x-1.5 bg-teal-500/10 text-teal-400 px-3 py-1 rounded-full text-[10px] font-mono mb-4 border border-teal-500/20">
                        <Building className="h-3.5 w-3.5" />
                        <span>{fac.type}</span>
                      </div>
                      <h3 className="font-display text-xl font-bold">{fac.name}</h3>
                      <div className="text-xs text-slate-400 mt-1 flex items-center">
                        <MapPin className="h-3.5 w-3.5 text-teal-500 mr-1 shrink-0" /> {fac.location}
                      </div>
                      <p className="text-xs text-slate-300 mt-6 leading-relaxed font-light">{fac.description}</p>
                    </div>

                    <div className="mt-8 pt-6 border-t border-slate-800 font-mono">
                      <div className="text-[10px] text-slate-500 uppercase tracking-wider font-bold">Validated Output Capacity:</div>
                      <div className="text-sm font-semibold text-teal-400 mt-1">{fac.capacity}</div>
                    </div>
                  </div>

                  <div className="lg:w-3/5 p-8 flex flex-col justify-center space-y-6">
                    <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-slate-400">Facility Engineering Features</h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs text-slate-600">
                      <div className="p-4 bg-slate-50 rounded border border-slate-100 flex items-start space-x-3">
                        <CheckCircle2 className="h-4 w-4 text-teal-600 mt-0.5 shrink-0" />
                        <div>
                          <h5 className="font-bold text-slate-900">Pressure Differential Logs</h5>
                          <p className="text-[11px] text-slate-500 mt-0.5">Strict multi-stage positive pressure blocks to avoid clean-room cross-contaminations.</p>
                        </div>
                      </div>
                      <div className="p-4 bg-slate-50 rounded border border-slate-100 flex items-start space-x-3">
                        <CheckCircle2 className="h-4 w-4 text-teal-600 mt-0.5 shrink-0" />
                        <div>
                          <h5 className="font-bold text-slate-900">Integrated HEPA Systems</h5>
                          <p className="text-[11px] text-slate-500 mt-0.5">Continuous recirculation delivering Class 100 sterile environments.</p>
                        </div>
                      </div>
                      <div className="p-4 bg-slate-50 rounded border border-slate-100 flex items-start space-x-3">
                        <CheckCircle2 className="h-4 w-4 text-teal-600 mt-0.5 shrink-0" />
                        <div>
                          <h5 className="font-bold text-slate-900">Fully Automated Lines</h5>
                          <p className="text-[11px] text-slate-500 mt-0.5">Minimal human intervention filling schedules to maximize sterility assurance.</p>
                        </div>
                      </div>
                      <div className="p-4 bg-slate-50 rounded border border-slate-100 flex items-start space-x-3">
                        <CheckCircle2 className="h-4 w-4 text-teal-600 mt-0.5 shrink-0" />
                        <div>
                          <h5 className="font-bold text-slate-900">HPLC Validation Control</h5>
                          <p className="text-[11px] text-slate-500 mt-0.5">In-line and final release validation using high-accuracy analytical software.</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 4: QUALITY & REGULATORY CERTIFICATIONS */}
        {activeTab === 'certifications' && (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 fade-in-up">
            <div className="text-center max-w-2xl mx-auto mb-12">
              <h1 className="font-display text-2xl font-bold text-slate-900">Regulatory Compliance & Certifications</h1>
              <p className="text-xs text-slate-500 mt-2">
                {settings.companyName || 'Pharmaceutical Enterprise'} operations are verified by international licensing agencies. We hold active registrations for exports worldwide.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {certifications.map((cert) => (
                <div key={cert.id} className="bg-white border border-slate-200 rounded-xl p-6 shadow-custom-sm flex flex-col justify-between h-full hover:border-teal-500 transition-colors">
                  <div>
                    <div className="flex justify-between items-start">
                      <span className="text-[9px] font-bold font-mono tracking-wider bg-teal-50 text-teal-700 px-2 py-1 rounded">
                        {cert.type}
                      </span>
                      <span className="text-[10px] text-teal-600 font-mono font-bold">CY {cert.year}</span>
                    </div>
                    <h3 className="font-display text-md font-bold text-slate-900 mt-4">{cert.name}</h3>
                    <div className="text-[10px] text-slate-400 font-mono mt-1">Issuer: {cert.issuer}</div>
                    <p className="text-xs text-slate-600 mt-3 font-light leading-relaxed">{cert.description}</p>
                  </div>
                  
                  <div className="border-t border-slate-100 pt-4 mt-5 flex items-center justify-between">
                    <span className="text-[10px] text-slate-400 font-mono flex items-center">
                      <CheckCircle2 className="h-3.5 w-3.5 text-teal-500 mr-1" /> Dossier Complete
                    </span>
                    <button
                      onClick={() => setDossierNotice(`Technical files for ${cert.name} have been prepared. Registered distributors can download this dossier package inside the Employee Portal.`)}
                      className="text-[10px] font-bold font-mono uppercase text-teal-600 hover:text-teal-700 flex items-center cursor-pointer"
                    >
                      <Download className="h-3 w-3 mr-1" /> PDF Dossier
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* QA Methodology block */}
            <div className="bg-slate-900 text-white rounded-xl p-8 sm:p-10 mt-12 grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-1 border-r border-slate-800 pr-0 lg:pr-8">
                <h3 className="font-display text-lg font-bold">Standard GMP Quality Testing Routine</h3>
                <p className="text-xs text-slate-400 mt-2 font-light">
                  Our quality control lab performs rigorous assessment parameters before releasing any raw pharmaceutical materials or final formulations.
                </p>
                <div className="text-xs text-teal-400 font-mono mt-6 flex items-center">
                  <Activity className="h-4 w-4 mr-1.5 animate-pulse" /> 100% TESTING COMPLIANCE LOGS
                </div>
              </div>

              <div className="lg:col-span-2 grid grid-cols-1 sm:grid-cols-3 gap-6 text-xs">
                <div className="space-y-2">
                  <span className="text-slate-500 font-mono text-[10px] uppercase font-bold">Phase 1: Input Testing</span>
                  <h4 className="font-bold text-white">Raw Material Assay</h4>
                  <p className="text-slate-400 text-[11px] font-light">High performance liquid chromatography validation of incoming active ingredients (APIs).</p>
                </div>
                <div className="space-y-2 border-l border-slate-800 pl-0 sm:pl-6">
                  <span className="text-slate-500 font-mono text-[10px] uppercase font-bold">Phase 2: In-Process Control</span>
                  <h4 className="font-bold text-white">Disintegration & Hardness</h4>
                  <p className="text-slate-400 text-[11px] font-light">In-line dissolution logging of tablets and vials every 30 minutes inside manufacturing bays.</p>
                </div>
                <div className="space-y-2 border-l border-slate-800 pl-0 sm:pl-6">
                  <span className="text-slate-500 font-mono text-[10px] uppercase font-bold">Phase 3: Final Release</span>
                  <h4 className="font-bold text-white">Stability & Sterility Scan</h4>
                  <p className="text-slate-400 text-[11px] font-light">Validation of microbial absence, endotoxin logs, and terminal shelf life tracking inside stability chambers.</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 5: CAREERS & DOSSIERS */}
        {activeTab === 'careers' && (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 fade-in-up">
            <div className="text-center max-w-2xl mx-auto mb-12">
              <h1 className="font-display text-2xl font-bold text-slate-900">Pharmaceutical Careers & Compliance Research</h1>
              <p className="text-xs text-slate-500 mt-2">
                Join our international regulatory, QC, and formulation teams. Work in our WHO-GMP validated SEZ units to deliver clinical safety.
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Left Column: Job postings */}
              <div className="lg:col-span-2 space-y-4">
                <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-slate-400 mb-2">Available Opportunities</h3>
                {openJobs.map((job) => (
                  <div key={job.id} className="bg-white border border-slate-200 rounded-xl p-6 shadow-custom-sm flex flex-col justify-between hover:border-teal-500 transition-all duration-150">
                    <div>
                      <div className="flex justify-between items-start">
                        <span className="text-[9px] font-mono font-bold tracking-wider uppercase text-teal-600 bg-teal-50 px-2 py-0.5 rounded">
                          {job.employmentType}
                        </span>
                        <span className="text-slate-400 text-[10px] font-mono flex items-center">
                          <Calendar className="h-3 w-3 text-slate-400 mr-1" /> Posted {new Date(job.postedAt).toLocaleDateString()}
                        </span>
                      </div>
                      <h4 className="font-display text-md font-bold text-slate-900 mt-3">{job.title}</h4>
                      <div className="text-xs text-slate-400 font-mono mt-0.5 flex items-center">
                        <Building className="h-3.5 w-3.5 text-teal-500 mr-1 shrink-0" /> {job.department}
                      </div>
                      <p className="text-xs text-slate-600 mt-3 font-light leading-relaxed">{job.description}</p>
                    </div>

                    <div className="border-t border-slate-100 pt-4 mt-5 flex items-center justify-between">
                      <span className="text-xs text-slate-500 font-mono">{job.location}</span>
                      <button
                        onClick={() => {
                          setCareerForm({
                            ...careerForm,
                            jobId: job.id,
                            jobTitle: job.title,
                          });
                          document.getElementById('career-form-anchor')?.scrollIntoView({ behavior: 'smooth' });
                        }}
                        className="bg-slate-900 hover:bg-slate-800 text-white px-3.5 py-1.5 rounded text-[11px] font-bold uppercase tracking-wider transition-colors"
                      >
                        Select & Apply
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {/* Right Column: Application Form */}
              <div id="career-form-anchor" className="space-y-4">
                <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-slate-400 mb-2">Candidate Application</h3>
                <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-custom-md sticky top-36">
                  {careerSuccess ? (
                    <div className="bg-teal-100/60 border border-teal-200 rounded p-6 text-center">
                      <CheckCircle2 className="h-10 w-10 text-teal-600 mx-auto mb-3" />
                      <h4 className="text-xs font-bold text-teal-800">Application Submitted</h4>
                      <p className="text-[11px] text-teal-700 mt-2 leading-relaxed">
                        Your application dossier has been stored successfully inside the {settings.companyName || 'Pharmaceutical Enterprise'} CMS. Our regulatory head will review your references shortly.
                      </p>
                    </div>
                  ) : (
                    <form onSubmit={handleCareerSubmit} className="space-y-4">
                      <div>
                        <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Select Role</label>
                        <select
                          required
                          value={careerForm.jobId}
                          onChange={(e) => {
                            const job = jobs.find((j) => j.id === e.target.value);
                            setCareerForm({
                              ...careerForm,
                              jobId: e.target.value,
                              jobTitle: job ? job.title : '',
                            });
                          }}
                          className="w-full bg-slate-50 border border-slate-300 rounded px-2.5 py-1.5 text-xs focus:outline-none focus:ring-1 focus:ring-teal-500"
                        >
                          <option value="">-- Choose Role --</option>
                          {openJobs.map((job) => (
                            <option key={job.id} value={job.id}>{job.title}</option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Full Name</label>
                        <input
                          type="text"
                          required
                          placeholder="Dr. / Mr. / Ms. Name"
                          value={careerForm.name}
                          onChange={(e) => setCareerForm({ ...careerForm, name: e.target.value })}
                          className="w-full bg-white border border-slate-300 rounded px-2.5 py-1.5 text-xs focus:outline-none focus:ring-1 focus:ring-teal-500"
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Email</label>
                          <input
                            type="email"
                            required
                            placeholder="name@example.com"
                            value={careerForm.email}
                            onChange={(e) => setCareerForm({ ...careerForm, email: e.target.value })}
                            className="w-full bg-white border border-slate-300 rounded px-2.5 py-1.5 text-xs focus:outline-none focus:ring-1 focus:ring-teal-500"
                          />
                        </div>
                        <div>
                          <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Phone</label>
                          <input
                            type="text"
                            placeholder="Mobile No"
                            value={careerForm.phone}
                            onChange={(e) => setCareerForm({ ...careerForm, phone: e.target.value })}
                            className="w-full bg-white border border-slate-300 rounded px-2.5 py-1.5 text-xs focus:outline-none focus:ring-1 focus:ring-teal-500"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Simulated CV Attachment</label>
                        <input
                          type="text"
                          placeholder="E.g., Dr_Sharma_Regulatory_Dossier_CV.pdf"
                          required
                          value={careerForm.resumeName}
                          onChange={(e) => setCareerForm({ ...careerForm, resumeName: e.target.value })}
                          className="w-full bg-white border border-slate-300 rounded px-2.5 py-1.5 text-xs focus:outline-none focus:ring-1 focus:ring-teal-500"
                        />
                        <span className="text-[9px] text-slate-400 font-mono mt-1 block">Drag-and-drop or specify simulated file name above</span>
                      </div>

                      <div>
                        <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Cover Note & References</label>
                        <textarea
                          rows={3}
                          placeholder="Summarize your experience with WHO-GMP clean rooms, chromatography assays or regulatory CTD submissions..."
                          value={careerForm.coverLetter}
                          onChange={(e) => setCareerForm({ ...careerForm, coverLetter: e.target.value })}
                          className="w-full bg-white border border-slate-300 rounded px-2.5 py-1.5 text-xs focus:outline-none focus:ring-1 focus:ring-teal-500"
                        />
                      </div>

                      <button
                        type="submit"
                        disabled={submitting}
                        className="w-full bg-teal-600 hover:bg-teal-500 text-white py-2.5 rounded text-xs font-bold uppercase tracking-wider transition-colors shadow-md"
                      >
                        {submitting ? 'Transmitting CV...' : 'Submit Application Dossier'}
                      </button>
                    </form>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 6: GLOBAL PARTNERSHIPS */}
        {activeTab === 'contact' && (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 fade-in-up">
            <div className="text-center max-w-2xl mx-auto mb-12">
              <h1 className="font-display text-2xl font-bold text-slate-900">{settings.companyName || 'Pharmaceutical Enterprise'} Global Headquarters</h1>
              <p className="text-xs text-slate-500 mt-2">Connect directly with our regulatory offices, manufacturing planners, or regional sales managers.</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Left Column: Coordinates */}
              <div className="space-y-6">
                <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-custom-sm space-y-4">
                  <h3 className="font-display font-bold text-slate-900">Corporate Details</h3>
                  <div className="flex items-start space-x-3 text-xs text-slate-600">
                    <MapPin className="h-5 w-5 text-teal-600 shrink-0 mt-0.5" />
                    <div>
                      <strong className="text-slate-800">Global Head Offices:</strong>
                      <p className="mt-1 font-light leading-relaxed">{settings.address}</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3 text-xs text-slate-600">
                    <Mail className="h-5 w-5 text-teal-600 shrink-0 mt-0.5" />
                    <div>
                      <strong className="text-slate-800">Dossiers & Inquiries:</strong>
                      <p className="mt-1 font-mono">{settings.contactEmail}</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3 text-xs text-slate-600">
                    <Phone className="h-5 w-5 text-teal-600 shrink-0 mt-0.5" />
                    <div>
                      <strong className="text-slate-800">Switchboard:</strong>
                      <p className="mt-1 font-mono">{settings.contactPhone}</p>
                    </div>
                  </div>
                </div>

                <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-custom-sm space-y-2 text-xs">
                  <h4 className="font-display font-bold text-slate-900 mb-2">Corporate Licenses</h4>
                  <div className="flex justify-between border-b border-slate-100 py-1.5 font-mono">
                    <span className="text-slate-400">Reg No:</span>
                    <span className="text-slate-800 font-semibold">{settings.registrationNumber.split(': ')[1] || settings.registrationNumber}</span>
                  </div>
                  <div className="flex justify-between border-b border-slate-100 py-1.5 font-mono">
                    <span className="text-slate-400">Drug License:</span>
                    <span className="text-slate-800 font-semibold">{settings.drugLicenseNumber}</span>
                  </div>
                  <div className="flex justify-between py-1.5 font-mono">
                    <span className="text-slate-400">GSTIN:</span>
                    <span className="text-slate-800 font-semibold">{settings.gstNumber}</span>
                  </div>
                </div>
              </div>

              {/* Right Columns: Map & General message form */}
              <div className="lg:col-span-2 space-y-6">
                <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-custom-md">
                  <h3 className="font-display text-lg font-bold text-slate-900 mb-6">Transmit Secure Message to Headquarters</h3>
                  
                  {contactSuccess ? (
                    <div className="bg-teal-100/60 border border-teal-200 rounded p-6 text-center">
                      <CheckCircle2 className="h-10 w-10 text-teal-600 mx-auto mb-3" />
                      <h4 className="text-xs font-bold text-teal-800">Message Dispatched</h4>
                      <p className="text-[11px] text-teal-700 mt-2">
                        Your general inquiry has been transmitted securely. The relevant regulatory officer or plant planner will respond via secure email.
                      </p>
                    </div>
                  ) : (
                    <form onSubmit={handleContactSubmit} className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Your Name</label>
                          <input
                            type="text"
                            required
                            value={contactForm.name}
                            onChange={(e) => setContactForm({ ...contactForm, name: e.target.value })}
                            className="w-full bg-white border border-slate-300 rounded px-3 py-2 text-xs focus:outline-none focus:ring-1 focus:ring-teal-500"
                          />
                        </div>
                        <div>
                          <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Corporate Email</label>
                          <input
                            type="email"
                            required
                            value={contactForm.email}
                            onChange={(e) => setContactForm({ ...contactForm, email: e.target.value })}
                            className="w-full bg-white border border-slate-300 rounded px-3 py-2 text-xs focus:outline-none focus:ring-1 focus:ring-teal-500"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Phone</label>
                          <input
                            type="text"
                            value={contactForm.phone}
                            onChange={(e) => setContactForm({ ...contactForm, phone: e.target.value })}
                            className="w-full bg-white border border-slate-300 rounded px-3 py-2 text-xs focus:outline-none focus:ring-1 focus:ring-teal-500"
                          />
                        </div>
                        <div>
                          <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Subject</label>
                          <input
                            type="text"
                            required
                            value={contactForm.subject}
                            onChange={(e) => setContactForm({ ...contactForm, subject: e.target.value })}
                            className="w-full bg-white border border-slate-300 rounded px-3 py-2 text-xs focus:outline-none focus:ring-1 focus:ring-teal-500"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Message</label>
                        <textarea
                          rows={4}
                          required
                          value={contactForm.message}
                          onChange={(e) => setContactForm({ ...contactForm, message: e.target.value })}
                          className="w-full bg-white border border-slate-300 rounded px-3 py-2 text-xs focus:outline-none focus:ring-1 focus:ring-teal-500"
                        />
                      </div>

                      <button
                        type="submit"
                        disabled={submitting}
                        className="bg-teal-600 hover:bg-teal-500 text-white px-6 py-2.5 rounded text-xs font-bold uppercase tracking-wider transition-colors shadow-md flex items-center"
                      >
                        <Send className="h-4 w-4 mr-1.5" />
                        <span>{submitting ? 'Transmitting...' : 'Dispatch Message'}</span>
                      </button>
                    </form>
                  )}
                </div>

                <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-custom-sm overflow-hidden h-72">
                  <iframe
                    title="SEZ Formulation Plant Map"
                    src={settings.mapEmbedUrl}
                    className="w-full h-full border-0 rounded-lg"
                    allowFullScreen
                    loading="lazy"
                  ></iframe>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Corporate Footnote */}
      <footer className="bg-slate-900 text-white border-t border-slate-800 py-8 text-center text-xs text-slate-400">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-4">
          <p className="font-semibold tracking-wide uppercase">
            © {new Date().getFullYear()} {settings.companyName}. All Rights Reserved.
          </p>
          <p className="font-light text-[11px] text-slate-500 max-w-xl mx-auto leading-relaxed">
            Standard drug licenses: {settings.drugLicenseNumber}. Manufactured formulations undergo double bio-equivalence logging inside high-containment sterile environments. For export queries, consult regulatory desks.
          </p>
          {settings.socialLinks && (Object.values(settings.socialLinks).some(link => !!link)) && (
            <div className="flex justify-center space-x-3 pt-2">
              {settings.socialLinks.linkedin && (
                <a
                  href={settings.socialLinks.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-1.5 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors"
                >
                  <Linkedin className="h-3.5 w-3.5" />
                </a>
              )}
              {settings.socialLinks.twitter && (
                <a
                  href={settings.socialLinks.twitter}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-1.5 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors"
                >
                  <Twitter className="h-3.5 w-3.5" />
                </a>
              )}
              {settings.socialLinks.website && (
                <a
                  href={settings.socialLinks.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-1.5 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors"
                >
                  <Globe className="h-3.5 w-3.5" />
                </a>
              )}
            </div>
          )}
          <div className="pt-2 border-t border-slate-800/60 max-w-xs mx-auto">
            <a
              href="#/admin"
              className="inline-flex items-center space-x-1.5 text-[10px] font-mono uppercase tracking-wider text-slate-600 hover:text-teal-400 transition-colors"
            >
              <Lock className="h-3 w-3" />
              <span>Corporate Employee Portal</span>
            </a>
          </div>
        </div>
      </footer>

      {/* Non-blocking Clinical Floating Toast */}
      {dossierNotice && (
        <div className="fixed bottom-6 right-6 z-50 max-w-sm bg-slate-900 border border-slate-800 rounded-xl p-4 shadow-2xl flex items-start space-x-3 animate-fadeIn">
          <ShieldCheck className="h-5 w-5 text-teal-400 shrink-0 mt-0.5" />
          <div className="flex-grow">
            <h5 className="text-xs font-bold text-white font-sans">Clinical Dossier Access Authorization</h5>
            <p className="text-[10px] text-slate-400 mt-1 leading-relaxed font-sans">{dossierNotice}</p>
            <button 
              onClick={() => setDossierNotice(null)}
              className="mt-2 text-[10px] font-mono font-bold text-teal-400 hover:text-teal-300 bg-slate-950 px-2 py-1 rounded border border-slate-800"
            >
              Dismiss Notification
            </button>
          </div>
        </div>
      )}

      {/* Dynamic Full-Screen Image Lightbox */}
      {lightboxImg && (
        <div 
          className="fixed inset-0 z-50 bg-slate-950/95 backdrop-blur-md flex items-center justify-center p-4 transition-all duration-200"
          onClick={() => setLightboxImg(null)}
        >
          <div className="absolute top-4 right-4 z-50 flex items-center space-x-3">
            <span className="text-[10px] text-slate-400 font-mono tracking-widest uppercase bg-slate-900/65 px-3 py-1.5 rounded-lg border border-slate-800/80">
              Press [ESC] to close
            </span>
            <button
              onClick={() => setLightboxImg(null)}
              className="p-2.5 rounded-full bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-white transition-colors border border-slate-800/80 cursor-pointer"
              title="Close image viewer"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
          
          <div 
            className="relative max-w-5xl w-full max-h-[85vh] flex flex-col items-center justify-center"
            onClick={(e) => e.stopPropagation()}
          >
            <img
              src={lightboxImg}
              alt="High resolution production asset preview"
              className="max-h-[75vh] max-w-full object-contain rounded-lg shadow-2xl border border-slate-800/40"
              referrerPolicy="no-referrer"
            />
            
            {/* Find title & desc for selected gallery item if matched */}
            {(() => {
              const item = galleryItems.find(g => g.imageUrl === lightboxImg);
              if (!item) return null;
              return (
                <div className="mt-4 text-center max-w-2xl bg-slate-900/90 border border-slate-800 rounded-xl p-4 shadow-xl backdrop-blur-sm">
                  <span className="text-[9px] text-teal-400 font-mono uppercase tracking-widest font-bold bg-teal-950/40 px-2.5 py-1 rounded border border-teal-900/30 inline-block mb-2">
                    {item.category} &bull; {item.type}
                  </span>
                  <h4 className="text-sm font-bold text-white font-mono uppercase tracking-wider">{item.title}</h4>
                  <p className="text-xs text-slate-400 mt-1.5 font-light leading-relaxed">{item.description}</p>
                </div>
              );
            })()}
          </div>
        </div>
      )}
    </div>
  );
}
