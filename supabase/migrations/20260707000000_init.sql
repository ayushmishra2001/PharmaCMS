-- =======================================================
-- SUPABASE MIGRATION SCRIPT (PHASE 1)
-- =======================================================
-- establishing a clean, replayable, role-based PostgreSQL schema
-- with UUID primary keys, foreign keys, constraints, and Row Level Security.



DROP TABLE IF EXISTS activity_logs CASCADE;
DROP TABLE IF EXISTS inquiries CASCADE;
DROP TABLE IF EXISTS job_applications CASCADE;
DROP TABLE IF EXISTS job_openings CASCADE;
DROP TABLE IF EXISTS facilities CASCADE;
DROP TABLE IF EXISTS certifications CASCADE;
DROP TABLE IF EXISTS products CASCADE;
DROP TABLE IF EXISTS categories CASCADE;
DROP TABLE IF EXISTS site_settings CASCADE;
DROP TABLE IF EXISTS gallery_items CASCADE;
DROP TABLE IF EXISTS timeline_events CASCADE;
DROP TABLE IF EXISTS leadership_members CASCADE;
DROP TABLE IF EXISTS user_roles CASCADE;

DROP FUNCTION IF EXISTS get_user_role() CASCADE;

-- Enable UUID generation extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ==========================================
-- 1. USER ROLES & ADMINISTRATIVE PRIVILEGES
-- ==========================================
CREATE TABLE user_roles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID UNIQUE, -- Matches auth.users id
    email VARCHAR(255) NOT NULL UNIQUE,
    role VARCHAR(50) NOT NULL CHECK (role IN ('super_admin', 'admin', 'content_manager')) DEFAULT 'content_manager',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ==========================================
-- ROLE CONTEXT UTILITY FUNCTION FOR RLS
-- ==========================================
CREATE OR REPLACE FUNCTION get_user_role()
RETURNS VARCHAR AS $$
DECLARE
    u_role VARCHAR;
BEGIN
    SELECT role INTO u_role FROM user_roles WHERE user_id = auth.uid() LIMIT 1;
    RETURN COALESCE(u_role, 'anonymous');
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ==========================================
-- 2. THERAPEUTIC CATEGORIES TABLE
-- ==========================================
CREATE TABLE categories (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    slug VARCHAR(255) NOT NULL UNIQUE,
    description TEXT,
    icon VARCHAR(100) NOT NULL DEFAULT 'Pills',
    parent_id UUID REFERENCES categories(id) ON DELETE SET NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ==========================================
-- 3. PRODUCTS MONOGRAPH (MEDICINES) TABLE
-- ==========================================
CREATE TABLE products (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    brand_name VARCHAR(255) NOT NULL,
    generic_name VARCHAR(255) NOT NULL,
    category_id UUID REFERENCES categories(id) ON DELETE SET NULL,
    composition TEXT,
    strength VARCHAR(100),
    indications TEXT,
    contraindications TEXT,
    side_effects TEXT,
    dosage TEXT,
    packaging TEXT,
    status VARCHAR(50) DEFAULT 'published' CHECK (status IN ('draft', 'published', 'archived')),
    is_featured BOOLEAN DEFAULT false,
    brochure_url TEXT,
    seo_title VARCHAR(255),
    seo_desc TEXT,
    images JSONB DEFAULT '[]'::jsonb,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ==========================================
-- 4. QUALITY CERTIFICATIONS TABLE
-- ==========================================
CREATE TABLE certifications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    type VARCHAR(50) NOT NULL CHECK (type IN ('ISO', 'GMP', 'WHO-GMP', 'FDA', 'FSSAI', 'CE', 'MSME')),
    description TEXT,
    issuer VARCHAR(255) NOT NULL,
    year INTEGER NOT NULL,
    image_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ==========================================
-- 5. MANUFACTURING FACILITIES TABLE
-- ==========================================
CREATE TABLE facilities (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    type VARCHAR(255) NOT NULL,
    capacity VARCHAR(255),
    description TEXT,
    location TEXT,
    image_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ==========================================
-- 6. ACTIVE JOB OPENINGS TABLE
-- ==========================================
CREATE TABLE job_openings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title VARCHAR(255) NOT NULL,
    department VARCHAR(255) NOT NULL,
    location VARCHAR(255) NOT NULL,
    employment_type VARCHAR(100) NOT NULL CHECK (employment_type IN ('Full-time', 'Contract', 'Part-time', 'Remote')),
    description TEXT NOT NULL,
    status VARCHAR(50) DEFAULT 'open' CHECK (status IN ('open', 'closed')),
    posted_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ==========================================
-- 7. JOB APPLICATIONS & CANDIDATE DOSSIERS TABLE
-- ==========================================
CREATE TABLE job_applications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    job_id UUID NOT NULL REFERENCES job_openings(id) ON DELETE CASCADE,
    job_title VARCHAR(255) NOT NULL,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    phone VARCHAR(100) NOT NULL,
    cover_letter TEXT,
    resume_name VARCHAR(255),
    resume_url TEXT,
    status VARCHAR(50) DEFAULT 'new' CHECK (status IN ('new', 'reviewed', 'shortlisted', 'rejected')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ==========================================
-- 8. CRM PHARMACEUTICAL INQUIRIES & LEADS TABLE
-- ==========================================
CREATE TABLE inquiries (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    type VARCHAR(50) NOT NULL CHECK (type IN ('general', 'product', 'distributor', 'newsletter')),
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    phone VARCHAR(100),
    company_name VARCHAR(255),
    subject VARCHAR(255),
    message TEXT NOT NULL,
    product_id UUID REFERENCES products(id) ON DELETE SET NULL,
    product_brand_name VARCHAR(255),
    status VARCHAR(50) DEFAULT 'unread' CHECK (status IN ('unread', 'read', 'closed')),
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ==========================================
-- 9. AUDIT COMPLIANCE & ACTIVITY LOGS
-- ==========================================
CREATE TABLE activity_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_email VARCHAR(255) NOT NULL,
    action TEXT NOT NULL,
    entity_type VARCHAR(50) NOT NULL CHECK (entity_type IN ('product', 'category', 'certification', 'job', 'inquiry', 'settings', 'application', 'gallery', 'timeline', 'leadership')),
    entity_name VARCHAR(255) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ==========================================
-- 10. GLOBAL SITE BRANDING & CUSTOMIZATION
-- ==========================================
CREATE TABLE site_settings (
    id UUID PRIMARY KEY DEFAULT '00000000-0000-0000-0000-000000000000' CHECK (id = '00000000-0000-0000-0000-000000000000'),
    company_name VARCHAR(255) NOT NULL,
    logo_url TEXT,
    tagline VARCHAR(255),
    contact_email VARCHAR(255),
    contact_phone VARCHAR(100),
    address TEXT,
    registration_number VARCHAR(255),
    drug_license_number VARCHAR(255),
    gst_number VARCHAR(255),
    map_embed_url TEXT,
    ga_id VARCHAR(100),
    social_links JSONB DEFAULT '{}'::jsonb,
    
    hero_title VARCHAR(255),
    hero_description TEXT,
    metric1_value VARCHAR(100),
    metric1_label VARCHAR(255),
    metric2_value VARCHAR(100),
    metric2_label VARCHAR(255),
    metric3_value VARCHAR(100),
    metric3_label VARCHAR(255),
    metric4_value VARCHAR(100),
    metric4_label VARCHAR(255),
    compliance_badge_text VARCHAR(255),
    regulatory_title VARCHAR(255),
    regulatory_desc TEXT,
    regulatory_feature1_title VARCHAR(255),
    regulatory_feature1_desc TEXT,
    regulatory_feature2_title VARCHAR(255),
    regulatory_feature2_desc TEXT,
    regulatory_feature3_title VARCHAR(255),
    regulatory_feature3_desc TEXT,
    regulatory_feature4_title VARCHAR(255),
    regulatory_feature4_desc TEXT,
    qa_title VARCHAR(255),
    qa_desc TEXT,
    qa_badge VARCHAR(255),
    qa_phase1_title VARCHAR(255),
    qa_phase1_desc TEXT,
    qa_phase2_title VARCHAR(255),
    qa_phase2_desc TEXT,
    qa_phase3_title VARCHAR(255),
    qa_phase3_desc TEXT,
    show_home BOOLEAN DEFAULT TRUE,
    show_catalog BOOLEAN DEFAULT TRUE,
    show_facilities BOOLEAN DEFAULT TRUE,
    show_certifications BOOLEAN DEFAULT TRUE,
    show_careers BOOLEAN DEFAULT TRUE,
    show_contact BOOLEAN DEFAULT TRUE,
    show_home_hero BOOLEAN DEFAULT TRUE,
    show_home_metrics BOOLEAN DEFAULT TRUE,
    show_home_featured BOOLEAN DEFAULT TRUE,
    show_home_regulatory BOOLEAN DEFAULT TRUE,
    show_home_distributor BOOLEAN DEFAULT TRUE,
    seo_title VARCHAR(255),
    seo_desc TEXT,
    about_subtitle TEXT,
    facilities_title VARCHAR(255),
    media_showcase_title VARCHAR(255),
    show_about BOOLEAN DEFAULT TRUE,
    show_gallery BOOLEAN DEFAULT TRUE,
    show_home_lab_preview BOOLEAN DEFAULT TRUE,
    lab_title VARCHAR(255),
    lab_sterility_text TEXT,
    lab_temperature VARCHAR(50),
    lab_cardio_title VARCHAR(255),
    lab_cardio_active VARCHAR(255),
    lab_cardio_formula VARCHAR(255),
    lab_cardio_disintegration VARCHAR(100),
    lab_cardio_chroma VARCHAR(100),
    lab_cardio_structure VARCHAR(255),
    lab_cardio_status VARCHAR(100),
    lab_antibiotic_title VARCHAR(255),
    lab_antibiotic_active VARCHAR(255),
    lab_antibiotic_formula VARCHAR(255),
    lab_antibiotic_disintegration VARCHAR(100),
    lab_antibiotic_chroma VARCHAR(100),
    lab_antibiotic_structure VARCHAR(255),
    lab_antibiotic_status VARCHAR(100),
    lab_neuro_title VARCHAR(255),
    lab_neuro_active VARCHAR(255),
    lab_neuro_formula VARCHAR(255),
    lab_neuro_disintegration VARCHAR(100),
    lab_neuro_chroma VARCHAR(100),
    lab_neuro_structure VARCHAR(255),
    lab_neuro_status VARCHAR(100),
    hero_trust_point1 VARCHAR(255),
    hero_trust_point2 VARCHAR(255),
    hero_trust_point3 VARCHAR(255),
    hero_trust_point4 VARCHAR(255),
    featured_badge_text VARCHAR(255),
    featured_title VARCHAR(255),
    featured_desc TEXT,
    regulatory_badge_text VARCHAR(255),
    distributor_title VARCHAR(255),
    distributor_desc TEXT,
    hero_slides JSONB DEFAULT '[]'::jsonb,
    enable_hero_slider BOOLEAN DEFAULT TRUE,
    hero_slider_interval INTEGER DEFAULT 5000,
    enable_hero_overlay BOOLEAN DEFAULT TRUE,
    hero_overlay_strength VARCHAR(50) DEFAULT 'medium',
    about_title VARCHAR(255),
    about_vision_title VARCHAR(255),
    about_vision_text TEXT,
    about_mission_title VARCHAR(255),
    about_mission_text TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ==========================================
-- 11. COMPANY MEDIA GALLERY TABLE
-- ==========================================
CREATE TABLE gallery_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title VARCHAR(255) NOT NULL,
    description TEXT,
    category VARCHAR(50) NOT NULL DEFAULT 'factory',
    type VARCHAR(50) NOT NULL DEFAULT 'images',
    image_url TEXT NOT NULL,
    order_index INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ==========================================
-- 12. HISTORICAL TIMELINE EVENTS TABLE
-- ==========================================
CREATE TABLE timeline_events (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    year VARCHAR(50) NOT NULL,
    title VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    details TEXT,
    regulatory VARCHAR(255),
    reach VARCHAR(255),
    scope VARCHAR(255),
    order_index INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ==========================================
-- 13. LEADERSHIP & ADVISORY MEMBERS TABLE
-- ==========================================
CREATE TABLE leadership_members (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    role VARCHAR(255) NOT NULL,
    department VARCHAR(255),
    credentials VARCHAR(255),
    experience VARCHAR(255),
    bio TEXT,
    image_url TEXT,
    order_index INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ==========================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ==========================================

-- Enable Row Level Security on all core tables
ALTER TABLE user_roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE certifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE facilities ENABLE ROW LEVEL SECURITY;
ALTER TABLE job_openings ENABLE ROW LEVEL SECURITY;
ALTER TABLE job_applications ENABLE ROW LEVEL SECURITY;
ALTER TABLE inquiries ENABLE ROW LEVEL SECURITY;
ALTER TABLE activity_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE site_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE gallery_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE timeline_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE leadership_members ENABLE ROW LEVEL SECURITY;

-- 1. USER ROLES Policies
CREATE POLICY "Allow role based read" ON user_roles
    FOR SELECT TO authenticated USING (auth.uid() = user_id OR get_user_role() IN ('super_admin', 'admin'));
CREATE POLICY "Allow super_admin edit roles" ON user_roles
    FOR ALL TO authenticated USING (get_user_role() = 'super_admin');
CREATE POLICY "Allow first user bootstrap" ON user_roles
    FOR INSERT TO authenticated WITH CHECK ( NOT EXISTS (SELECT 1 FROM user_roles) );

-- 2. CATEGORIES Policies
CREATE POLICY "Allow public read" ON categories
    FOR SELECT USING (true);
CREATE POLICY "Allow role based write" ON categories
    FOR ALL TO authenticated USING (get_user_role() IN ('super_admin', 'admin', 'content_manager'));

-- 3. PRODUCTS Policies
CREATE POLICY "Allow public read" ON products
    FOR SELECT USING (status = 'published' OR get_user_role() IN ('super_admin', 'admin', 'content_manager'));
CREATE POLICY "Allow role based write" ON products
    FOR ALL TO authenticated USING (get_user_role() IN ('super_admin', 'admin', 'content_manager'));

-- 4. CERTIFICATIONS Policies
CREATE POLICY "Allow public read" ON certifications
    FOR SELECT USING (true);
CREATE POLICY "Allow role based write" ON certifications
    FOR ALL TO authenticated USING (get_user_role() IN ('super_admin', 'admin', 'content_manager'));

-- 5. FACILITIES Policies
CREATE POLICY "Allow public read" ON facilities
    FOR SELECT USING (true);
CREATE POLICY "Allow role based write" ON facilities
    FOR ALL TO authenticated USING (get_user_role() IN ('super_admin', 'admin', 'content_manager'));

-- 6. JOB OPENINGS Policies
CREATE POLICY "Allow public read" ON job_openings
    FOR SELECT USING (status = 'open' OR get_user_role() IN ('super_admin', 'admin', 'content_manager'));
CREATE POLICY "Allow role based write" ON job_openings
    FOR ALL TO authenticated USING (get_user_role() IN ('super_admin', 'admin', 'content_manager'));

-- 7. JOB APPLICATIONS Policies
CREATE POLICY "Allow role based read" ON job_applications
    FOR SELECT TO authenticated USING (get_user_role() IN ('super_admin', 'admin', 'content_manager'));
CREATE POLICY "Allow public apply" ON job_applications
    FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow role based write" ON job_applications
    FOR ALL TO authenticated USING (get_user_role() IN ('super_admin', 'admin', 'content_manager'));

-- 8. INQUIRIES Policies
CREATE POLICY "Allow role based read" ON inquiries
    FOR SELECT TO authenticated USING (get_user_role() IN ('super_admin', 'admin', 'content_manager'));
CREATE POLICY "Allow public create" ON inquiries
    FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow role based write" ON inquiries
    FOR ALL TO authenticated USING (get_user_role() IN ('super_admin', 'admin', 'content_manager'));

-- 9. ACTIVITY LOGS Policies
CREATE POLICY "Allow role based read" ON activity_logs
    FOR SELECT TO authenticated USING (get_user_role() IN ('super_admin', 'admin', 'content_manager'));
CREATE POLICY "Allow authenticated insert" ON activity_logs
    FOR INSERT TO authenticated WITH CHECK (true);

-- 10. SITE SETTINGS Policies
CREATE POLICY "Allow public read" ON site_settings
    FOR SELECT USING (true);
CREATE POLICY "Allow super_admin write" ON site_settings
    FOR ALL TO authenticated USING (get_user_role() = 'super_admin');

-- 11. GALLERY ITEMS Policies
CREATE POLICY "Allow public read" ON gallery_items
    FOR SELECT USING (true);
CREATE POLICY "Allow role based write" ON gallery_items
    FOR ALL TO authenticated USING (get_user_role() IN ('super_admin', 'admin', 'content_manager'));

-- 12. TIMELINE EVENTS Policies
CREATE POLICY "Allow public read" ON timeline_events
    FOR SELECT USING (true);
CREATE POLICY "Allow role based write" ON timeline_events
    FOR ALL TO authenticated USING (get_user_role() IN ('super_admin', 'admin', 'content_manager'));

-- 13. LEADERSHIP MEMBERS Policies
CREATE POLICY "Allow public read" ON leadership_members
    FOR SELECT USING (true);
CREATE POLICY "Allow role based write" ON leadership_members
    FOR ALL TO authenticated USING (get_user_role() IN ('super_admin', 'admin', 'content_manager'));


-- ==========================================================
-- STORAGE BUCKETS SETUP & POLICIES
-- ==========================================================

-- Insert the standard public assets storage bucket
INSERT INTO storage.buckets (id, name, public)
VALUES ('pharma-assets', 'pharma-assets', true)
ON CONFLICT (id) DO NOTHING;

-- Grant access to assets bucket via storage policies
DROP POLICY IF EXISTS "Public Read Access" ON storage.objects;
CREATE POLICY "Public Read Access" ON storage.objects
    FOR SELECT USING (bucket_id = 'pharma-assets');

DROP POLICY IF EXISTS "Authenticated Upload Access" ON storage.objects;
CREATE POLICY "Authenticated Upload Access" ON storage.objects
    FOR INSERT TO authenticated WITH CHECK (
        bucket_id = 'pharma-assets' AND
        (SELECT get_user_role() FROM user_roles WHERE user_id = auth.uid()) IN ('super_admin', 'admin', 'content_manager')
    );

DROP POLICY IF EXISTS "Authenticated Update/Delete Access" ON storage.objects;
CREATE POLICY "Authenticated Update/Delete Access" ON storage.objects
    FOR ALL TO authenticated USING (
        bucket_id = 'pharma-assets' AND
        (SELECT get_user_role() FROM user_roles WHERE user_id = auth.uid()) IN ('super_admin', 'admin', 'content_manager')
    );


-- ==========================================================
-- SEED DATA INITIAL ADMINISTRATIVE SITE CONFIGURATION
-- ==========================================================
INSERT INTO site_settings (
    id, company_name, logo_url, tagline, contact_email, contact_phone, address,
    registration_number, drug_license_number, gst_number, map_embed_url, ga_id, social_links,
    hero_title, hero_description, metric1_value, metric1_label, metric2_value, metric2_label,
    metric3_value, metric3_label, metric4_value, metric4_label, compliance_badge_text,
    regulatory_title, regulatory_desc, regulatory_feature1_title, regulatory_feature1_desc,
    regulatory_feature2_title, regulatory_feature2_desc, regulatory_feature3_title, regulatory_feature3_desc,
    regulatory_feature4_title, regulatory_feature4_desc,
    qa_title, qa_desc, qa_badge, qa_phase1_title, qa_phase1_desc, qa_phase2_title, qa_phase2_desc, qa_phase3_title, qa_phase3_desc,
    seo_title, seo_desc, about_subtitle, facilities_title, media_showcase_title
) VALUES (
    '00000000-0000-0000-0000-000000000000', '   Pharma Private Limited', '', 'Pioneering WHO-GMP Compliant Formulations.', 'info@  Pharma.com', '+91 22 2400 9000', 'Scientific Zone Alpha, Sector-4, Navi Mumbai, India',
    'U24239MH2026PTC384920', 'DL-20B-184920 / DL-21B-184921', '27AABCA1234F1Z8', 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3771.8484918733357!2d73.011833!3d19.026833!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3be7c3df952bf65d%3A0x6a053cbfd55fc9db!2sNavi%20Mumbai!5e0!3m2!1sen!2sin!4v1783240356718', 'G- 2026', '{"linkedin": "https://linkedin.com/company/ - Pharma", "twitter": "https://twitter.com/ _pharma", "website": "https://  Pharma.com"}'::jsonb,
    'WHO-GMP & Regulatory Aligned Quality', 'Delivering precision formulation, high-purity APIs, and aseptic injectable dossiers to global markets.',
    'WHO-GMP', 'Standard Certification', '15M+', 'Daily Tablet Capacity', '25+', 'Global Export Markets', 'Zone I-IV', 'Climatic Stability Certified',
    'GLOBAL STANDARD PHARMACEUTICAL MANUFACTURING', 'Dossier & Formulation Excellence',
    'Conforming to Common Technical Document (CTD/eCTD) guidelines for rapid country entry validation.',
    'Dossier Support', 'CTD / eCTD formatting prepared for clinical submissions.',
    'Stability Logs', 'Advanced climatic chambers covering Zone I through Zone IV regulations.',
    'Impurity Profiling', 'Conducted via ultra-clean high performance liquid chromatography.',
    'Aseptic Protocols', 'Barrier isolators and Class A particle sweeps operating 24/7.',
    'Standard GMP Quality Testing Routine', 'Our quality control lab performs rigorous assessment parameters before releasing any raw pharmaceutical materials or final formulations.', '100% TESTING COMPLIANCE LOGS', 'Raw Material Assay', 'High performance liquid chromatography validation of incoming active ingredients (APIs).', 'Disintegration & Hardness', 'In-line dissolution logging of tablets and vials every 30 minutes inside manufacturing bays.', 'Stability & Sterility Scan', 'Validation of microbial absence, endotoxin logs, and terminal shelf life tracking inside stability chambers.',
    '   Pharma - WHO-GMP & Regulatory Aligned Quality',
    'Pioneering pharmaceutical formulation, high-purity APIs, and sterile injectables for global markets.',
    'For over two decades,   Formulations has committed itself to scientific integrity, rigorous regulatory compliance, and high-bioavailability formulation research, supplying certified clinical therapeutics across five continents.',
    '  Operations & Sterile Facilities',
    '  Media Showcase'
) ON CONFLICT (id) DO NOTHING;
