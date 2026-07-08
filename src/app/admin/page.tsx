export const dynamic = 'force-dynamic';
import { SiteSettings } from "@/types";
import { createClientServer } from '@/lib/supabase';
import { 
  mapCategory, mapProduct, mapCertification, mapFacility, 
  mapJobOpening, mapJobApplication, mapInquiry, mapActivityLog, 
  mapSiteSettings, mapGalleryItem, mapTimelineEvent, mapLeadershipMember 
} from '@/lib/adapters';
import ClientAdminPortal from './ClientAdminPortal';
import { redirect } from 'next/navigation';

export default async function AdminPage() {
  const supabase = await createClientServer();
  
  // Ensure authentication
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    redirect('/admin/login');
  }

  // Load user role
  const { data: roleData } = await supabase
    .from('user_roles')
    .select('role')
    .eq('user_id', user.id)
    .single();
    
  const userRole = roleData?.role || 'viewer';

  // Load everything for the admin portal in parallel with robust error handlers
  const [
    categoriesRes,
    productsRes,
    certificationsRes,
    facilitiesRes,
    jobsRes,
    appsRes,
    inquiriesRes,
    logsRes,
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
    supabase.from('job_applications').select('*').order('created_at', { ascending: false }).then(r => r, () => ({ data: null })),
    supabase.from('inquiries').select('*').order('created_at', { ascending: false }).then(r => r, () => ({ data: null })),
    supabase.from('activity_logs').select('*').order('created_at', { ascending: false }).limit(200).then(r => r, () => ({ data: null })),
    supabase.from('site_settings').select('*').maybeSingle().then(r => r, () => ({ data: null })),
    supabase.from('gallery_items').select('*').order('order_index').then(r => r, () => ({ data: null })),
    supabase.from('timeline_events').select('*').order('order_index').then(r => r, () => ({ data: null })),
    supabase.from('leadership_members').select('*').order('order_index').then(r => r, () => ({ data: null }))
  ]);

  const categories = (categoriesRes?.data || []).map(mapCategory);
  const products = (productsRes?.data || []).map(mapProduct);
  const certifications = (certificationsRes?.data || []).map(mapCertification);
  const facilities = (facilitiesRes?.data || []).map(mapFacility);
  const jobs = (jobsRes?.data || []).map(mapJobOpening);
  const applications = (appsRes?.data || []).map(mapJobApplication);
  const inquiries = (inquiriesRes?.data || []).map(mapInquiry);
  const logs = (logsRes?.data || []).map(mapActivityLog);
  const settings = mapSiteSettings(settingsRes?.data);
  const galleryItems = (galleryRes?.data || []).map(mapGalleryItem);
  const timelineData = (timelineRes?.data || []).map(mapTimelineEvent);
  const leadershipData = (leadershipRes?.data || []).map(mapLeadershipMember);
  
  const userData = {
    id: user.id,
    email: user.email,
    role: userRole,
    name: user.user_metadata?.name || user.email?.split('@')[0]
  };

  return (
    <ClientAdminPortal
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
      user={userData}
    />
  );
}
