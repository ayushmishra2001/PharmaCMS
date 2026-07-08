'use server';

import { createClientServer } from '@/lib/supabase';
import { revalidatePath } from 'next/cache';

function snakeCase(obj: any) {
  if (typeof obj !== 'object' || obj === null) return obj;
  const newObj: any = {};
  for (const key in obj) {
    const snakeKey = key.replace(/[A-Z]/g, letter => `_${letter.toLowerCase()}`);
    newObj[snakeKey] = obj[key];
  }
  return newObj;
}

async function logAction(action: string, entityType: string, entityName: string) {
  const supabase = await createClientServer();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user || !user.email) return;

  await supabase.from('activity_logs').insert({
    user_email: user.email,
    action,
    entity_type: entityType,
    entity_name: entityName
  });
}

/**
 * Security Wrapper to check authorization before executing mutating actions on the server-side.
 * Viewer accounts are strictly restricted from mutating data, which is enforced on both client and server layers.
 * In environments where Supabase is not configured yet (e.g., initial local previews), this permits actions to run
 * seamlessly in mock/simulation mode.
 */
async function authorizedAction<T>(fn: () => Promise<T>): Promise<T | false> {
  try {
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
    const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
    if (url && anonKey && url.startsWith("http")) {
      const supabase = await createClientServer();
      const { data: { user } } = await supabase.auth.getUser();
      if (!user || !user.email) {
        console.error('Mutating action rejected: Not authenticated.');
        return false;
      }

      const { data } = await supabase
        .from('user_roles')
        .select('role')
        .or(`user_id.eq.${user.id},email.eq.${user.email.toLowerCase().trim()}`)
        .maybeSingle();

      if (!data || data.role === 'viewer') {
        console.error('Mutating action rejected: Viewers do not have write permissions.');
        return false;
      }
    }
    return await fn();
  } catch (error) {
    console.error('Mutating action authorization failed:', error);
    return false;
  }
}

export async function saveProduct(product: any) {
  return authorizedAction(async () => {
    const supabase = await createClientServer();
    const dbProduct = snakeCase(product);
    
    let res;
    if (product.id && !product.id.startsWith('new-')) {
      res = await supabase.from('products').update(dbProduct).eq('id', product.id);
    } else {
      delete dbProduct.id; // Let Supabase generate UUID
      res = await supabase.from('products').insert(dbProduct);
    }
    
    if (!res.error) {
      await logAction(`${product.id && !product.id.startsWith('new-') ? 'Updated' : 'Created'} Product`, 'product', product.name);
      revalidatePath('/');
      revalidatePath('/admin');
      return true;
    }
    console.error(res.error);
    return false;
  });
}

export async function deleteProduct(id: string) {
  return authorizedAction(async () => {
    const supabase = await createClientServer();
    const { error } = await supabase.from('products').delete().eq('id', id);
    if (!error) {
      await logAction('Deleted Product', 'product', id);
      revalidatePath('/');
      revalidatePath('/admin');
      return true;
    }
    console.error(error);
    return false;
  });
}

export async function saveCategory(category: any) {
  return authorizedAction(async () => {
    const supabase = await createClientServer();
    const dbCategory = snakeCase(category);
    
    if (!dbCategory.slug) {
      dbCategory.slug = (dbCategory.name || '').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
    }
    
    let res;
    if (category.id && !category.id.startsWith('new-') && !category.id.startsWith('cat-')) {
      res = await supabase.from('categories').update(dbCategory).eq('id', category.id);
    } else {
      delete dbCategory.id;
      res = await supabase.from('categories').insert(dbCategory);
    }
    
    if (!res.error) {
      await logAction(`${category.id ? 'Updated' : 'Created'} Category`, 'category', category.name);
      revalidatePath('/');
      revalidatePath('/admin');
      return true;
    }
    console.error(res.error);
    return false;
  });
}

export async function deleteCategory(id: string) {
  return authorizedAction(async () => {
    const supabase = await createClientServer();
    const { error } = await supabase.from('categories').delete().eq('id', id);
    if (!error) {
      await logAction('Deleted Category', 'category', id);
      revalidatePath('/');
      revalidatePath('/admin');
      return true;
    }
    console.error(error);
    return false;
  });
}

export async function saveJob(job: any) {
  return authorizedAction(async () => {
    const supabase = await createClientServer();
    const dbJob = snakeCase(job);
    
    let res;
    if (job.id && !job.id.startsWith('new-') && !job.id.startsWith('job-')) {
      res = await supabase.from('job_openings').update(dbJob).eq('id', job.id);
    } else {
      delete dbJob.id;
      res = await supabase.from('job_openings').insert(dbJob);
    }
    
    if (!res.error) {
      await logAction(`${job.id ? 'Updated' : 'Created'} Job Opening`, 'job', job.title);
      revalidatePath('/');
      revalidatePath('/admin');
      return true;
    }
    console.error(res.error);
    return false;
  });
}

export async function deleteJob(id: string) {
  return authorizedAction(async () => {
    const supabase = await createClientServer();
    const { error } = await supabase.from('job_openings').delete().eq('id', id);
    if (!error) {
      await logAction('Deleted Job Opening', 'job', id);
      revalidatePath('/');
      revalidatePath('/admin');
      return true;
    }
    console.error(error);
    return false;
  });
}

export async function saveCertification(cert: any) {
  return authorizedAction(async () => {
    const supabase = await createClientServer();
    const dbCert = snakeCase(cert);
    
    let res;
    if (cert.id && !cert.id.startsWith('new-') && !cert.id.startsWith('cert-')) {
      res = await supabase.from('certifications').update(dbCert).eq('id', cert.id);
    } else {
      delete dbCert.id;
      res = await supabase.from('certifications').insert(dbCert);
    }
    
    if (!res.error) {
      await logAction(`${cert.id ? 'Updated' : 'Created'} Certification`, 'certification', cert.name);
      revalidatePath('/');
      revalidatePath('/admin');
      return true;
    }
    console.error(res.error);
    return false;
  });
}

export async function deleteCertification(id: string) {
  return authorizedAction(async () => {
    const supabase = await createClientServer();
    const { error } = await supabase.from('certifications').delete().eq('id', id);
    if (!error) {
      await logAction('Deleted Certification', 'certification', id);
      revalidatePath('/');
      revalidatePath('/admin');
      return true;
    }
    console.error(error);
    return false;
  });
}

export async function saveFacility(facility: any) {
  return authorizedAction(async () => {
    const supabase = await createClientServer();
    const dbFacility = snakeCase(facility);
    
    let res;
    if (facility.id && !facility.id.startsWith('new-') && !facility.id.startsWith('fac-')) {
      res = await supabase.from('facilities').update(dbFacility).eq('id', facility.id);
    } else {
      delete dbFacility.id;
      res = await supabase.from('facilities').insert(dbFacility);
    }
    
    if (!res.error) {
      await logAction(`${facility.id ? 'Updated' : 'Created'} Facility`, 'facility', facility.name);
      revalidatePath('/');
      revalidatePath('/admin');
      return true;
    }
    console.error(res.error);
    return false;
  });
}

export async function deleteFacility(id: string) {
  return authorizedAction(async () => {
    const supabase = await createClientServer();
    const { error } = await supabase.from('facilities').delete().eq('id', id);
    if (!error) {
      await logAction('Deleted Facility', 'facility', id);
      revalidatePath('/');
      revalidatePath('/admin');
      return true;
    }
    console.error(error);
    return false;
  });
}

export async function saveGalleryItem(item: any) {
  return authorizedAction(async () => {
    const supabase = await createClientServer();
    const dbItem = snakeCase(item);
    
    let res;
    if (item.id && !item.id.startsWith('new-') && !item.id.startsWith('gal-') && !item.id.startsWith('gal_')) {
      res = await supabase.from('gallery_items').update(dbItem).eq('id', item.id);
    } else {
      delete dbItem.id;
      res = await supabase.from('gallery_items').insert(dbItem);
    }
    
    if (!res.error) {
      await logAction(`${item.id ? 'Updated' : 'Created'} Gallery Item`, 'gallery', item.title);
      revalidatePath('/');
      revalidatePath('/admin');
      return true;
    }
    console.error(res.error);
    return false;
  });
}

export async function deleteGalleryItem(id: string) {
  return authorizedAction(async () => {
    const supabase = await createClientServer();
    const { error } = await supabase.from('gallery_items').delete().eq('id', id);
    if (!error) {
      await logAction('Deleted Gallery Item', 'gallery', id);
      revalidatePath('/');
      revalidatePath('/admin');
      return true;
    }
    console.error(error);
    return false;
  });
}

export async function saveTimelineEvent(event: any) {
  return authorizedAction(async () => {
    const supabase = await createClientServer();
    const dbEvent = snakeCase(event);
    
    let res;
    if (event.id && !event.id.startsWith('new-') && !event.id.startsWith('time-') && !event.id.startsWith('time_')) {
      res = await supabase.from('timeline_events').update(dbEvent).eq('id', event.id);
    } else {
      delete dbEvent.id;
      res = await supabase.from('timeline_events').insert(dbEvent);
    }
    
    if (!res.error) {
      await logAction(`${event.id ? 'Updated' : 'Created'} Timeline Event`, 'timeline', event.title);
      revalidatePath('/');
      revalidatePath('/admin');
      return true;
    }
    console.error(res.error);
    return false;
  });
}

export async function deleteTimelineEvent(id: string) {
  return authorizedAction(async () => {
    const supabase = await createClientServer();
    const { error } = await supabase.from('timeline_events').delete().eq('id', id);
    if (!error) {
      await logAction('Deleted Timeline Event', 'timeline', id);
      revalidatePath('/');
      revalidatePath('/admin');
      return true;
    }
    console.error(error);
    return false;
  });
}

export async function saveLeadershipMember(member: any) {
  return authorizedAction(async () => {
    const supabase = await createClientServer();
    const dbMember = snakeCase(member);
    
    let res;
    if (member.id && !member.id.startsWith('new-') && !member.id.startsWith('lead-') && !member.id.startsWith('lead_')) {
      res = await supabase.from('leadership_members').update(dbMember).eq('id', member.id);
    } else {
      delete dbMember.id;
      res = await supabase.from('leadership_members').insert(dbMember);
    }
    
    if (!res.error) {
      await logAction(`${member.id ? 'Updated' : 'Created'} Leadership Member`, 'leadership', member.name);
      revalidatePath('/');
      revalidatePath('/admin');
      return true;
    }
    console.error(res.error);
    return false;
  });
}

export async function deleteLeadershipMember(id: string) {
  return authorizedAction(async () => {
    const supabase = await createClientServer();
    const { error } = await supabase.from('leadership_members').delete().eq('id', id);
    if (!error) {
      await logAction('Deleted Leadership Member', 'leadership', id);
      revalidatePath('/');
      revalidatePath('/admin');
      return true;
    }
    console.error(error);
    return false;
  });
}

export async function saveSettings(settings: any) {
  return authorizedAction(async () => {
    const supabase = await createClientServer();
    const dbSettings = snakeCase(settings);
    delete dbSettings.logo_file; // Remove File object that causes postgres column error
    dbSettings.id = '00000000-0000-0000-0000-000000000000';
    
    const { error } = await supabase.from('site_settings').upsert(dbSettings);
    if (!error) {
      await logAction('Updated Site Settings', 'settings', 'SiteSettings');
      revalidatePath('/');
      revalidatePath('/admin');
      return true;
    }
    console.error(error);
    return false;
  });
}

export async function updateInquiry(id: string, status: string, notes: string) {
  return authorizedAction(async () => {
    const supabase = await createClientServer();
    const { error } = await supabase.from('inquiries').update({ status, notes }).eq('id', id);
    if (!error) {
      await logAction(`Updated Inquiry Status`, 'inquiry', id);
      revalidatePath('/admin');
      return true;
    }
    console.error(error);
    return false;
  });
}

export async function updateApplicationStatus(id: string, status: string) {
  return authorizedAction(async () => {
    const supabase = await createClientServer();
    const { error } = await supabase.from('job_applications').update({ status }).eq('id', id);
    if (!error) {
      await logAction(`Updated Application Status`, 'application', id);
      revalidatePath('/admin');
      return true;
    }
    console.error(error);
    return false;
  });
}

export async function reorderProducts(items: any[]) { return true; }

export async function reorderGallery(items: any[]) { 
  return authorizedAction(async () => {
    const supabase = await createClientServer();
    for (let i = 0; i < items.length; i++) {
      await supabase.from('gallery_items').update({ order_index: i }).eq('id', items[i].id);
    }
    revalidatePath('/');
    revalidatePath('/admin');
    return true;
  });
}

export async function reorderTimeline(items: any[]) {
  return authorizedAction(async () => {
    const supabase = await createClientServer();
    for (let i = 0; i < items.length; i++) {
      await supabase.from('timeline_events').update({ order_index: i }).eq('id', items[i].id);
    }
    revalidatePath('/');
    revalidatePath('/admin');
    return true;
  });
}

export async function reorderLeadership(items: any[]) {
  return authorizedAction(async () => {
    const supabase = await createClientServer();
    for (let i = 0; i < items.length; i++) {
      await supabase.from('leadership_members').update({ order_index: i }).eq('id', items[i].id);
    }
    revalidatePath('/');
    revalidatePath('/admin');
    return true;
  });
}
