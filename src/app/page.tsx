import { SiteSettings } from "@/types";
import { createClientPublic } from '@/lib/supabase';
import { 
  mapCategory, mapProduct, mapCertification, mapFacility, 
  mapJobOpening, mapSiteSettings, mapGalleryItem, 
  mapTimelineEvent, mapLeadershipMember 
} from '@/lib/adapters';
import ClientPortal from './ClientPortal';

// Enforce Incremental Static Regeneration (ISR) with 60-second revalidation as requested
export const revalidate = 60;

export default async function Home() {
  let categories = [];
  let products = [];
  let certifications = [];
  let facilities = [];
  let jobs = [];
  let settings = mapSiteSettings(null); // Load default fallback site settings initially
  let galleryItems = [];
  let timelineData = [];
  let leadershipData = [];

  try {
    const supabase = createClientPublic();
    
    // Load each resource with safe resolve/reject handlers to ensure partial failures do not crash the site
    const [
      categoriesRes,
      productsRes,
      certificationsRes,
      facilitiesRes,
      jobsRes,
      settingsRes,
      galleryRes,
      timelineRes,
      leadershipRes
    ] = await Promise.all([
      supabase.from('categories').select('*').then(r => r, () => ({ data: null })),
      supabase.from('products').select('*').order('name').then(r => r, () => ({ data: null })),
      supabase.from('certifications').select('*').order('year', { ascending: false }).then(r => r, () => ({ data: null })),
      supabase.from('facilities').select('*').then(r => r, () => ({ data: null })),
      supabase.from('job_openings').select('*').order('posted_at', { ascending: false }).then(r => r, () => ({ data: null })),
      supabase.from('site_settings').select('*').maybeSingle().then(r => r, () => ({ data: null })),
      supabase.from('gallery_items').select('*').order('order_index').then(r => r, () => ({ data: null })),
      supabase.from('timeline_events').select('*').order('order_index').then(r => r, () => ({ data: null })),
      supabase.from('leadership_members').select('*').order('order_index').then(r => r, () => ({ data: null }))
    ]);

    // Adapt database rows with safe defaults to frontend camelCase TypeScript interfaces
    categories = (categoriesRes?.data || []).map(mapCategory);
    products = (productsRes?.data || []).map(mapProduct);
    certifications = (certificationsRes?.data || []).map(mapCertification);
    facilities = (facilitiesRes?.data || []).map(mapFacility);
    jobs = (jobsRes?.data || []).map(mapJobOpening);
    settings = mapSiteSettings(settingsRes?.data);
    galleryItems = (galleryRes?.data || []).map(mapGalleryItem);
    timelineData = (timelineRes?.data || []).map(mapTimelineEvent);
    leadershipData = (leadershipRes?.data || []).map(mapLeadershipMember);
  } catch (error) {
    console.error('Supabase connection failed:', error);
  }

  return (
    <ClientPortal
      initialCategories={categories}
      initialProducts={products}
      initialCertifications={certifications}
      initialFacilities={facilities}
      initialJobs={jobs}
      initialSettings={settings}
      initialGalleryItems={galleryItems}
      initialTimelineData={timelineData}
      initialLeadershipData={leadershipData}
    />
  );
}
