'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { 
  Users, CheckCircle, XCircle, Clock, Search, Filter, 
  Trash2, Mail, Video, Image as ImageIcon, BookOpen, 
  Settings, RefreshCw, Eye, Plus, ArrowRight, Shield, 
  Send, AlertCircle, FileText, Check, X, ExternalLink,
  ChevronRight, Sparkles, Download, Bell, Edit, Save, Globe, Phone, MapPin,
  Database, HardDrive, Cpu, Activity, Lock, Key, LogOut, ShieldAlert, EyeOff
} from 'lucide-react';

interface Application {
  id: number;
  full_name: string;
  email: string;
  phone: string;
  degree_type: string;
  program_type: string;
  study_format: string;
  admission_status: 'Under Review' | 'Approved' | 'Rejected';
  payment_status: 'Pending' | 'Paid';
  document_url?: string;
  documents?: { slotId?: string; label?: string; fileName?: string; size?: string; url?: string }[];
  created_at: string;
}

interface Inquiry {
  id: number;
  name: string;
  email: string;
  subject: string;
  message: string;
  created_at: string;
  status?: string;
}

interface MediaItem {
  id: string;
  title: string;
  type: 'video' | 'image';
  src: string;
  category: string;
  size: string;
}

interface EmailLog {
  id: string;
  recipient: string;
  recipient_type: string;
  subject: string;
  type: string;
  status: string;
  preview: string;
  created_at: string;
}

interface CourseItem {
  id: number;
  title: string;
  degree_type: string;
  program_type: string;
  duration: string;
  tuition_fee: number;
  description: string;
  modules?: string;
  badge?: string;
}

interface NewsItem {
  id: number;
  title: string;
  category: string;
  date: string;
  image: string;
  excerpt: string;
  content?: string;
}

export default function AdminDashboardPage() {
  const [activeTab, setActiveTab] = useState<'overview' | 'applications' | 'inquiries' | 'media' | 'courses' | 'news' | 'settings'>('overview');
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [notification, setNotification] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  // Data States
  const [stats, setStats] = useState<any>(null);
  const [dbHealth, setDbHealth] = useState<any>(null);
  const [applications, setApplications] = useState<Application[]>([]);
  const [inquiries, setInquiries] = useState<Inquiry[]>([]);
  const [mediaList, setMediaList] = useState<MediaItem[]>([]);
  const [courses, setCourses] = useState<CourseItem[]>([]);
  const [news, setNews] = useState<NewsItem[]>([]);
  const [emailLogs, setEmailLogs] = useState<EmailLog[]>([]);
  
  // Site Settings state
  const [settings, setSettings] = useState({
    admin_email: 'info@liahacademy.com',
    site_title: 'Liah Academy - Institute of Higher Technology & Innovation',
    contact_phone: '+237 652 154 095 / +237 699 526 607',
    address: 'Backweri Town, Buea, Southwest Region, Cameroon',
    admissions_open: true,
    tiktok_url: 'https://www.tiktok.com/@liahacademy0',
    maps_url: 'https://maps.app.goo.gl/eHgx8Triv6TKKcRf6',
    facebook_url: 'https://www.facebook.com/photo/?fbid=747845957358700&set=a.467739685369330',
    instagram_url: 'https://www.instagram.com/p/DZ7omcLtYKT/'
  });

  // Filter & Search States
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'ALL' | 'Under Review' | 'Approved' | 'Rejected'>('ALL');
  const [paymentFilter, setPaymentFilter] = useState<'ALL' | 'Paid' | 'Pending'>('ALL');
  const [selectedApp, setSelectedApp] = useState<Application | null>(null);

  // Modal Dialog States
  const [showCourseModal, setShowCourseModal] = useState(false);
  const [editingCourse, setEditingCourse] = useState<CourseItem | null>(null);
  const [courseForm, setCourseForm] = useState({
    title: '',
    degree_type: 'HND',
    program_type: 'Software Engineering',
    duration: '3 Years',
    tuition_fee: 250000,
    description: '',
    modules: '',
    badge: 'Popular'
  });

  const [showNewsModal, setShowNewsModal] = useState(false);
  const [editingNews, setEditingNews] = useState<NewsItem | null>(null);
  const [newsForm, setNewsForm] = useState({
    title: '',
    category: 'Engineering & Tech',
    date: 'August 2026',
    image: '/assets/images/flyer_engineering.png',
    excerpt: '',
    content: ''
  });

  // Media Form states
  const [newMediaTitle, setNewMediaTitle] = useState('');
  const [newMediaCategory, setNewMediaCategory] = useState('Workshops');
  const [uploadFile, setUploadFile] = useState<File | null>(null);

  // Authentication & Restriction States
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const [authIdentifier, setAuthIdentifier] = useState('');
  const [authPassword, setAuthPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [authSubmitting, setAuthSubmitting] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);

  const getAuthHeaders = (explicitToken?: string) => {
    const token = explicitToken || (typeof window !== 'undefined' ? (sessionStorage.getItem('liah_admin_token') || localStorage.getItem('liah_admin_token')) : '');
    return {
      'Content-Type': 'application/json',
      ...(token ? { 'Authorization': `Bearer ${token}`, 'x-admin-token': token } : {})
    };
  };

  const checkAuth = async () => {
    try {
      const storedToken = typeof window !== 'undefined' ? (sessionStorage.getItem('liah_admin_token') || localStorage.getItem('liah_admin_token')) : '';
      const res = await fetch('/api/admin/auth/check', {
        headers: storedToken ? { 'Authorization': `Bearer ${storedToken}`, 'x-admin-token': storedToken } : {},
        credentials: 'include'
      });
      const data = await res.json();
      if (data.authenticated) {
        setIsAuthenticated(true);
        loadDashboardData(storedToken || '');
      } else {
        setIsAuthenticated(false);
        setLoading(false);
      }
    } catch {
      setIsAuthenticated(false);
      setLoading(false);
    }
  };

  const handleAdminLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!authIdentifier || !authPassword) {
      setAuthError('Please provide your administrator email/username and security key.');
      return;
    }
    setAuthSubmitting(true);
    setAuthError(null);
    try {
      const res = await fetch('/api/admin/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: authIdentifier, password: authPassword }),
        credentials: 'include'
      });
      const data = await res.json();
      if (data.success && data.token) {
        if (typeof window !== 'undefined') {
          sessionStorage.setItem('liah_admin_token', data.token);
          localStorage.setItem('liah_admin_token', data.token);
        }
        setIsAuthenticated(true);
        showNotification('Administrator authenticated. Welcome to Master Studio.');
        loadDashboardData(data.token);
      } else {
        setAuthError(data.message || 'Invalid administrative credentials. Access restricted.');
      }
    } catch {
      setAuthError('Authentication server communication error. Please try again.');
    } finally {
      setAuthSubmitting(false);
    }
  };

  const handleAdminLogout = async () => {
    try {
      await fetch('/api/admin/auth/logout', { method: 'POST', credentials: 'include' });
    } catch {}
    if (typeof window !== 'undefined') {
      sessionStorage.removeItem('liah_admin_token');
      localStorage.removeItem('liah_admin_token');
    }
    setIsAuthenticated(false);
    showNotification('Administrative session locked and signed out.');
  };

  // Fetch all admin data
  const loadDashboardData = async (explicitToken?: string) => {
    setLoading(true);
    const headers = getAuthHeaders(explicitToken);
    try {
      const [statsRes, appsRes, inqRes, mediaRes, contentRes, emailsRes] = await Promise.all([
        fetch('/api/admin/stats', { headers, credentials: 'include' }).then(r => r.json()),
        fetch('/api/admin/applications', { headers, credentials: 'include' }).then(r => r.json()),
        fetch('/api/admin/inquiries', { headers, credentials: 'include' }).then(r => r.json()),
        fetch('/api/admin/media', { headers, credentials: 'include' }).then(r => r.json()),
        fetch('/api/admin/content', { headers, credentials: 'include' }).then(r => r.json()),
        fetch('/api/admin/emails', { headers, credentials: 'include' }).then(r => r.json())
      ]);

      if (statsRes.success) {
        setStats(statsRes.stats);
        if (statsRes.db_health) setDbHealth(statsRes.db_health);
      }
      if (appsRes.success) setApplications(appsRes.data || []);
      if (inqRes.success) setInquiries(inqRes.data || []);
      if (mediaRes.success) setMediaList(mediaRes.data || []);
      if (contentRes.success) {
        setCourses(contentRes.courses || []);
        setNews(contentRes.news || []);
        if (contentRes.settings) {
          setSettings(prev => ({ ...prev, ...contentRes.settings }));
        }
      }
      if (emailsRes.success) setEmailLogs(emailsRes.data || []);
    } catch (err) {
      console.error('Error fetching admin data:', err);
      showNotification('Failed to load dashboard data. Please refresh.', 'error');
    } finally {
      setLoading(false);
    }
  };

  const triggerDatabaseBackup = async () => {
    setActionLoading(true);
    try {
      const res = await fetch('/api/admin/content', {
        method: 'POST',
        headers: getAuthHeaders(),
        credentials: 'include',
        body: JSON.stringify({ type: 'backup' })
      });
      const data = await res.json();
      if (data.success) {
        showNotification('Snapshot database backup created in data/backups/!');
        loadDashboardData();
      } else {
        showNotification(data.message || 'Backup failed', 'error');
      }
    } catch {
      showNotification('Error triggering database backup.', 'error');
    } finally {
      setActionLoading(false);
    }
  };

  useEffect(() => {
    checkAuth();
  }, []);

  useEffect(() => {
    if (!isAuthenticated) return;
    const interval = setInterval(() => {
      // Background silent polling to ensure paid statuses sync in real-time
      const headers = getAuthHeaders();
      fetch('/api/admin/stats', { headers, credentials: 'include' }).then(r => r.json()).then(res => {
        if (res.success) {
          setStats(res.stats);
          if (res.db_health) setDbHealth(res.db_health);
        }
      }).catch(() => {});
      fetch('/api/admin/applications', { headers, credentials: 'include' }).then(r => r.json()).then(res => {
        if (res.success) setApplications(res.data || []);
      }).catch(() => {});
    }, 8000);
    return () => clearInterval(interval);
  }, [isAuthenticated]);

  const showNotification = (message: string, type: 'success' | 'error' = 'success') => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 4500);
  };

  // 1. APPLICATION ACTIONS
  const updateAppStatus = async (id: number, newStatus: 'Approved' | 'Rejected' | 'Under Review') => {
    setActionLoading(true);
    try {
      const res = await fetch('/api/admin/applications', {
        method: 'PUT',
        headers: getAuthHeaders(),
        credentials: 'include',
        body: JSON.stringify({ id, admission_status: newStatus })
      });
      const data = await res.json();
      if (data.success) {
        showNotification(`Application #${id} has been marked as ${newStatus}. Email signal sent!`);
        setApplications(prev => prev.map(a => a.id === id ? { ...a, admission_status: newStatus } : a));
        if (selectedApp && selectedApp.id === id) {
          setSelectedApp({ ...selectedApp, admission_status: newStatus });
        }
        fetch('/api/admin/emails', { headers: getAuthHeaders(), credentials: 'include' }).then(r => r.json()).then(res => {
          if (res.success) setEmailLogs(res.data || []);
        });
      } else {
        showNotification(data.message || 'Update failed', 'error');
      }
    } catch {
      showNotification('Error updating application.', 'error');
    } finally {
      setActionLoading(false);
    }
  };

  const togglePaymentStatus = async (id: number, currentPayment: string) => {
    const nextPayment = currentPayment === 'Paid' ? 'Pending' : 'Paid';
    try {
      const res = await fetch('/api/admin/applications', {
        method: 'PUT',
        headers: getAuthHeaders(),
        credentials: 'include',
        body: JSON.stringify({ id, payment_status: nextPayment })
      });
      const data = await res.json();
      if (data.success) {
        showNotification(`Payment status updated to ${nextPayment}.`);
        setApplications(prev => prev.map(a => a.id === id ? { ...a, payment_status: nextPayment as any } : a));
      }
    } catch {
      showNotification('Error updating payment status.', 'error');
    }
  };

  const deleteApplication = async (id: number) => {
    if (!confirm(`Are you sure you want to delete application #${id}?`)) return;
    try {
      const res = await fetch(`/api/admin/applications?id=${id}`, { 
        method: 'DELETE',
        headers: getAuthHeaders(),
        credentials: 'include'
      });
      const data = await res.json();
      if (data.success) {
        showNotification(`Application #${id} deleted.`);
        setApplications(prev => prev.filter(a => a.id !== id));
        if (selectedApp && selectedApp.id === id) setSelectedApp(null);
      }
    } catch {
      showNotification('Error deleting application.', 'error');
    }
  };

  // Export Applicants to CSV
  const exportApplicantsCSV = () => {
    if (applications.length === 0) {
      showNotification('No applications to export.', 'error');
      return;
    }
    const headers = ['ID', 'Full Name', 'Email', 'Phone', 'Degree Level', 'Program Track', 'Study Format', 'Admission Status', 'Payment Status', 'Date'];
    const rows = applications.map(a => [
      a.id,
      `"${a.full_name.replace(/"/g, '""')}"`,
      `"${a.email}"`,
      `"${a.phone || ''}"`,
      `"${a.degree_type}"`,
      `"${a.program_type}"`,
      `"${a.study_format}"`,
      `"${a.admission_status}"`,
      `"${a.payment_status}"`,
      `"${new Date(a.created_at).toLocaleString()}"`
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `liah_academy_applicants_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showNotification('Applicants exported to CSV successfully!');
  };

  // 2. INQUIRY ACTIONS
  const deleteInquiry = async (id: number) => {
    if (!confirm(`Delete message #${id}?`)) return;
    try {
      const res = await fetch(`/api/admin/inquiries?id=${id}`, { 
        method: 'DELETE',
        headers: getAuthHeaders(),
        credentials: 'include'
      });
      const data = await res.json();
      if (data.success) {
        showNotification(`Inquiry #${id} deleted.`);
        setInquiries(prev => prev.filter(i => i.id !== id));
      }
    } catch {
      showNotification('Error deleting inquiry.', 'error');
    }
  };

  // 3. MEDIA ACTIONS
  const handleMediaUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!uploadFile) {
      showNotification('Please select a file to upload.', 'error');
      return;
    }

    const token = typeof window !== 'undefined' ? (sessionStorage.getItem('liah_admin_token') || localStorage.getItem('liah_admin_token')) : '';
    const formData = new FormData();
    formData.append('file', uploadFile);
    formData.append('title', newMediaTitle || uploadFile.name);
    formData.append('category', newMediaCategory);

    setActionLoading(true);
    try {
      const res = await fetch('/api/admin/media', {
        method: 'POST',
        headers: token ? { 'Authorization': `Bearer ${token}`, 'x-admin-token': token } : {},
        credentials: 'include',
        body: formData
      });
      const data = await res.json();
      if (data.success) {
        showNotification('Media asset uploaded successfully!');
        setMediaList(prev => [data.data, ...prev]);
        setUploadFile(null);
        setNewMediaTitle('');
      } else {
        showNotification(data.message || 'Upload failed', 'error');
      }
    } catch {
      showNotification('Error uploading file.', 'error');
    } finally {
      setActionLoading(false);
    }
  };

  const deleteMedia = async (id: string) => {
    if (!confirm('Are you sure you want to remove this media reference?')) return;
    try {
      const res = await fetch(`/api/admin/media?id=${id}`, { 
        method: 'DELETE',
        headers: getAuthHeaders(),
        credentials: 'include'
      });
      const data = await res.json();
      if (data.success) {
        showNotification('Media asset removed.');
        setMediaList(prev => prev.filter(m => m.id !== id));
      }
    } catch {
      showNotification('Error deleting media.', 'error');
    }
  };

  // 4. COURSE ACTIONS
  const openCourseModal = (course?: CourseItem) => {
    if (course) {
      setEditingCourse(course);
      setCourseForm({
        title: course.title,
        degree_type: course.degree_type,
        program_type: course.program_type,
        duration: course.duration,
        tuition_fee: course.tuition_fee,
        description: course.description,
        modules: course.modules || '',
        badge: course.badge || 'Popular'
      });
    } else {
      setEditingCourse(null);
      setCourseForm({
        title: '',
        degree_type: 'HND',
        program_type: 'Software Engineering',
        duration: '3 Years',
        tuition_fee: 250000,
        description: '',
        modules: '',
        badge: 'Popular'
      });
    }
    setShowCourseModal(true);
  };

  const handleSaveCourse = async (e: React.FormEvent) => {
    e.preventDefault();
    setActionLoading(true);
    try {
      if (editingCourse) {
        const res = await fetch('/api/admin/content', {
          method: 'PUT',
          headers: getAuthHeaders(),
          credentials: 'include',
          body: JSON.stringify({ type: 'course', id: editingCourse.id, data: courseForm })
        });
        const data = await res.json();
        if (data.success) {
          showNotification('Course track updated successfully!');
          setCourses(prev => prev.map(c => c.id === editingCourse.id ? data.data : c));
          setShowCourseModal(false);
        }
      } else {
        const res = await fetch('/api/admin/content', {
          method: 'POST',
          headers: getAuthHeaders(),
          credentials: 'include',
          body: JSON.stringify({ type: 'course', data: courseForm })
        });
        const data = await res.json();
        if (data.success) {
          showNotification('New course track added to catalog!');
          setCourses(prev => [...prev, data.data]);
          setShowCourseModal(false);
        }
      }
    } catch {
      showNotification('Error saving course track.', 'error');
    } finally {
      setActionLoading(false);
    }
  };

  const deleteCourse = async (id: number) => {
    if (!confirm('Are you sure you want to delete this course?')) return;
    try {
      const res = await fetch(`/api/admin/content?type=course&id=${id}`, { 
        method: 'DELETE',
        headers: getAuthHeaders(),
        credentials: 'include'
      });
      const data = await res.json();
      if (data.success) {
        showNotification('Course deleted.');
        setCourses(prev => prev.filter(c => c.id !== id));
      }
    } catch {
      showNotification('Error deleting course.', 'error');
    }
  };

  // 5. NEWS & FLYER ACTIONS
  const openNewsModal = (newsItem?: NewsItem) => {
    if (newsItem) {
      setEditingNews(newsItem);
      setNewsForm({
        title: newsItem.title,
        category: newsItem.category,
        date: newsItem.date,
        image: newsItem.image,
        excerpt: newsItem.excerpt,
        content: newsItem.content || ''
      });
    } else {
      setEditingNews(null);
      setNewsForm({
        title: '',
        category: 'Engineering & Tech',
        date: 'August 2026',
        image: '/assets/images/flyer_engineering.png',
        excerpt: '',
        content: ''
      });
    }
    setShowNewsModal(true);
  };

  const handleSaveNews = async (e: React.FormEvent) => {
    e.preventDefault();
    setActionLoading(true);
    try {
      if (editingNews) {
        const res = await fetch('/api/admin/content', {
          method: 'PUT',
          headers: getAuthHeaders(),
          credentials: 'include',
          body: JSON.stringify({ type: 'news', id: editingNews.id, data: newsForm })
        });
        const data = await res.json();
        if (data.success) {
          showNotification('Announcement updated successfully!');
          setNews(prev => prev.map(n => n.id === editingNews.id ? data.data : n));
          setShowNewsModal(false);
        }
      } else {
        const res = await fetch('/api/admin/content', {
          method: 'POST',
          headers: getAuthHeaders(),
          credentials: 'include',
          body: JSON.stringify({ type: 'news', data: newsForm })
        });
        const data = await res.json();
        if (data.success) {
          showNotification('New announcement published!');
          setNews(prev => [data.data, ...prev]);
          setShowNewsModal(false);
        }
      }
    } catch {
      showNotification('Error saving announcement.', 'error');
    } finally {
      setActionLoading(false);
    }
  };

  const deleteNews = async (id: number) => {
    if (!confirm('Are you sure you want to delete this announcement?')) return;
    try {
      const res = await fetch(`/api/admin/content?type=news&id=${id}`, { 
        method: 'DELETE',
        headers: getAuthHeaders(),
        credentials: 'include'
      });
      const data = await res.json();
      if (data.success) {
        showNotification('Announcement deleted.');
        setNews(prev => prev.filter(n => n.id !== id));
      }
    } catch {
      showNotification('Error deleting announcement.', 'error');
    }
  };

  // 6. SITE SETTINGS ACTIONS
  const saveAllSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    setActionLoading(true);
    try {
      const res = await fetch('/api/admin/content', {
        method: 'POST',
        headers: getAuthHeaders(),
        credentials: 'include',
        body: JSON.stringify({ type: 'settings', data: settings })
      });
      const data = await res.json();
      if (data.success) {
        showNotification('Website settings saved successfully!');
      }
    } catch {
      showNotification('Error saving website settings.', 'error');
    } finally {
      setActionLoading(false);
    }
  };

  const sendTestEmail = async () => {
    setActionLoading(true);
    try {
      const res = await fetch('/api/admin/emails', {
        method: 'POST',
        headers: getAuthHeaders(),
        credentials: 'include',
        body: JSON.stringify({
          to: settings.admin_email,
          subject: 'Admin Test Signal - Liah Academy Console',
          message: 'System test signal dispatched successfully from Admin Dashboard.'
        })
      });
      const data = await res.json();
      if (data.success) {
        showNotification(`Test email signal dispatched to ${settings.admin_email}!`);
        fetch('/api/admin/emails', { headers: getAuthHeaders(), credentials: 'include' }).then(r => r.json()).then(res => {
          if (res.success) setEmailLogs(res.data || []);
        });
      }
    } catch {
      showNotification('Error dispatching test email.', 'error');
    } finally {
      setActionLoading(false);
    }
  };

  // Filter applications
  const filteredApps = applications.filter(app => {
    const matchesSearch = 
      app.full_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      app.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      app.program_type.toLowerCase().includes(searchQuery.toLowerCase()) ||
      String(app.id).includes(searchQuery);

    const matchesStatus = statusFilter === 'ALL' ? true : app.admission_status === statusFilter;
    const matchesPayment = paymentFilter === 'ALL' ? true : app.payment_status === paymentFilter;
    return matchesSearch && matchesStatus && matchesPayment;
  });

  // 1. Loading state during auth check
  if (isAuthenticated === null) {
    return (
      <main style={{ marginTop: 'calc(var(--header-height) + 50px)', marginBottom: '80px', minHeight: '75vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ textAlign: 'center', padding: '40px' }}>
          <div style={{ display: 'inline-block', width: '48px', height: '48px', border: '4px solid #E2E8F0', borderTopColor: '#F5A623', borderRadius: '50%', animation: 'spin 1s linear infinite', marginBottom: '20px' }} />
          <h3 style={{ color: '#081F3E', fontSize: '1.25rem', fontWeight: 800, margin: '0 0 8px 0' }}>
            Verifying Master Security Protocols
          </h3>
          <p style={{ color: '#64748B', fontSize: '0.9rem', margin: 0 }}>
            Checking administrator session authorization...
          </p>
        </div>
      </main>
    );
  }

  // 2. Access Restricted Gate for normal users
  if (!isAuthenticated) {
    return (
      <main style={{ marginTop: 'calc(var(--header-height) + 30px)', marginBottom: '80px', minHeight: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
        <div style={{ maxWidth: '480px', width: '100%', margin: '0 auto' }}>
          
          {/* Main Security Card */}
          <div 
            style={{ 
              background: '#FFFFFF', 
              borderRadius: '20px', 
              boxShadow: '0 25px 60px -15px rgba(8, 31, 62, 0.25)', 
              border: '1px solid rgba(8, 31, 62, 0.08)',
              overflow: 'hidden'
            }}
          >
            {/* Header Banner */}
            <div 
              style={{ 
                background: 'linear-gradient(135deg, #081F3E 0%, #041021 100%)', 
                padding: '36px 30px 28px', 
                textAlign: 'center', 
                color: '#FFFFFF',
                position: 'relative'
              }}
            >
              <div 
                style={{ 
                  width: '64px', 
                  height: '64px', 
                  borderRadius: '16px', 
                  background: 'rgba(245, 166, 35, 0.15)', 
                  border: '1px solid rgba(245, 166, 35, 0.4)', 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center', 
                  margin: '0 auto 16px auto',
                  color: '#F5A623',
                  boxShadow: '0 0 25px rgba(245, 166, 35, 0.2)'
                }}
              >
                <Lock size={30} strokeWidth={2.2} />
              </div>

              <span 
                style={{ 
                  display: 'inline-block', 
                  background: '#FEF3C7', 
                  color: '#92400E', 
                  fontSize: '0.72rem', 
                  fontWeight: 800, 
                  padding: '4px 12px', 
                  borderRadius: '20px', 
                  textTransform: 'uppercase', 
                  letterSpacing: '0.06em', 
                  marginBottom: '10px' 
                }}
              >
                RESTRICTED PORTAL
              </span>

              <h2 style={{ fontSize: '1.45rem', fontWeight: 800, margin: '0 0 8px 0', color: '#FFFFFF' }}>
                Executive Management Center
              </h2>
              <p style={{ color: '#94A3B8', fontSize: '0.86rem', margin: 0, lineHeight: '1.5' }}>
                Authorized administrative personnel only. Public users and students cannot access this console.
              </p>
            </div>

            {/* Form Section */}
            <div style={{ padding: '32px 30px' }}>
              {authError && (
                <div 
                  style={{ 
                    background: '#FEF2F2', 
                    border: '1px solid #FCA5A5', 
                    borderRadius: '10px', 
                    padding: '12px 16px', 
                    marginBottom: '20px', 
                    display: 'flex', 
                    alignItems: 'center', 
                    gap: '10px', 
                    color: '#991B1B', 
                    fontSize: '0.86rem', 
                    fontWeight: 600 
                  }}
                >
                  <ShieldAlert size={18} style={{ flexShrink: 0 }} />
                  <span>{authError}</span>
                </div>
              )}

              <form onSubmit={handleAdminLogin}>
                <div style={{ marginBottom: '18px' }}>
                  <label style={{ display: 'block', fontSize: '0.84rem', fontWeight: 700, color: '#081F3E', marginBottom: '6px' }}>
                    Administrator Identifier / Email
                  </label>
                  <div style={{ position: 'relative' }}>
                    <input
                      type="text"
                      required
                      placeholder="info@liahacademy.com or admin"
                      value={authIdentifier}
                      onChange={(e) => setAuthIdentifier(e.target.value)}
                      style={{
                        width: '100%',
                        padding: '12px 14px',
                        border: '1px solid #CBD5E1',
                        borderRadius: '8px',
                        fontSize: '0.92rem',
                        outline: 'none',
                        color: '#081F3E',
                        boxSizing: 'border-box'
                      }}
                    />
                  </div>
                </div>

                <div style={{ marginBottom: '24px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                    <label style={{ fontSize: '0.84rem', fontWeight: 700, color: '#081F3E' }}>
                      Master Security Password
                    </label>
                  </div>
                  <div style={{ position: 'relative' }}>
                    <input
                      type={showPassword ? 'text' : 'password'}
                      required
                      placeholder="••••••••••••"
                      value={authPassword}
                      onChange={(e) => setAuthPassword(e.target.value)}
                      style={{
                        width: '100%',
                        padding: '12px 42px 12px 14px',
                        border: '1px solid #CBD5E1',
                        borderRadius: '8px',
                        fontSize: '0.92rem',
                        outline: 'none',
                        color: '#081F3E',
                        boxSizing: 'border-box'
                      }}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      style={{
                        position: 'absolute',
                        right: '12px',
                        top: '50%',
                        transform: 'translateY(-50%)',
                        background: 'none',
                        border: 'none',
                        cursor: 'pointer',
                        color: '#94A3B8',
                        padding: 0,
                        display: 'flex',
                        alignItems: 'center'
                      }}
                    >
                      {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={authSubmitting}
                  className="btn"
                  style={{
                    width: '100%',
                    padding: '14px',
                    background: '#081F3E',
                    color: '#FFFFFF',
                    borderRadius: '8px',
                    fontWeight: 800,
                    fontSize: '0.95rem',
                    border: 'none',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '8px',
                    boxShadow: '0 4px 15px rgba(8, 31, 62, 0.2)'
                  }}
                >
                  <Key size={16} color="#F5A623" />
                  {authSubmitting ? 'Verifying Security Token...' : 'Unlock Management Studio'}
                </button>
              </form>

              <div style={{ marginTop: '24px', paddingTop: '20px', borderTop: '1px solid #F1F5F9', textAlign: 'center' }}>
                <Link
                  href="/"
                  style={{
                    color: '#64748B',
                    fontSize: '0.84rem',
                    fontWeight: 600,
                    textDecoration: 'none',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '6px'
                  }}
                >
                  &larr; Return to Liah Academy Homepage
                </Link>
              </div>
            </div>
          </div>

          <p style={{ textAlign: 'center', color: '#94A3B8', fontSize: '0.78rem', marginTop: '20px' }}>
            🔒 Protected by Liah Academy Institutional Security Protocol.
          </p>
        </div>
      </main>
    );
  }

  return (
    <main style={{ marginTop: 'calc(var(--header-height) + 25px)', marginBottom: '80px', minHeight: '85vh' }}>
      <div className="container" style={{ maxWidth: '1380px' }}>
        
        {/* Top Admin Header Bar */}
        <div 
          style={{ 
            background: 'linear-gradient(135deg, #081F3E 0%, #0D2D59 100%)', 
            borderRadius: '16px', 
            padding: '28px 32px', 
            color: '#FFFFFF',
            marginBottom: '32px',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: '20px',
            boxShadow: '0 12px 36px rgba(8,31,62,0.15)'
          }}
        >
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
              <span style={{ 
                background: '#F5A623', 
                color: '#081F3E', 
                padding: '4px 10px', 
                borderRadius: '4px', 
                fontFamily: 'var(--font-mono)', 
                fontSize: '0.72rem', 
                fontWeight: 800,
                letterSpacing: '0.05em'
              }}>
                MASTER STUDIO
              </span>
              <span style={{ color: '#94A3B8', fontSize: '0.85rem' }}>
                Liah Academy Zero-Code Management Suite
              </span>
            </div>
            <h1 style={{ fontSize: '1.9rem', fontWeight: 800, margin: 0, color: '#FFFFFF' }}>
              Management &amp; Governance Center
            </h1>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <button 
              onClick={() => loadDashboardData()} 
              disabled={loading}
              className="btn btn-secondary"
              style={{ padding: '10px 18px', fontSize: '0.85rem', color: '#FFFFFF', borderColor: 'rgba(255,255,255,0.2)' }}
            >
              <RefreshCw size={15} className={loading ? 'spin' : ''} /> Refresh Data
            </button>
            <Link 
              href="/admissions" 
              className="btn btn-primary"
              style={{ padding: '10px 18px', fontSize: '0.85rem' }}
            >
              View Public Portal <ExternalLink size={14} />
            </Link>
            <button
              onClick={handleAdminLogout}
              className="btn"
              style={{ 
                padding: '10px 16px', 
                fontSize: '0.85rem', 
                background: 'rgba(239, 68, 68, 0.15)', 
                color: '#FCA5A5', 
                border: '1px solid rgba(239, 68, 68, 0.3)', 
                borderRadius: '8px', 
                fontWeight: 700, 
                cursor: 'pointer', 
                display: 'flex', 
                alignItems: 'center', 
                gap: '6px' 
              }}
            >
              <LogOut size={15} /> Lock Studio
            </button>
          </div>
        </div>

        {/* Global Toast Notification */}
        {notification && (
          <div 
            style={{
              background: notification.type === 'success' ? '#10B981' : '#EF4444',
              color: '#FFFFFF',
              padding: '14px 20px',
              borderRadius: '8px',
              marginBottom: '24px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              boxShadow: '0 6px 20px rgba(0,0,0,0.1)'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', fontWeight: 600 }}>
              {notification.type === 'success' ? <CheckCircle size={20} /> : <AlertCircle size={20} />}
              <span>{notification.message}</span>
            </div>
            <button onClick={() => setNotification(null)} style={{ background: 'none', border: 'none', color: '#FFF', cursor: 'pointer' }}>
              <X size={18} />
            </button>
          </div>
        )}

        {/* Navigation Tabs */}
        <div 
          style={{ 
            display: 'flex', 
            gap: '8px', 
            borderBottom: '1px solid rgba(15,23,42,0.1)', 
            marginBottom: '32px',
            overflowX: 'auto',
            paddingBottom: '4px'
          }}
        >
          <button
            onClick={() => setActiveTab('overview')}
            style={{
              padding: '12px 18px',
              borderRadius: '8px 8px 0 0',
              fontWeight: 700,
              fontSize: '0.9rem',
              cursor: 'pointer',
              border: 'none',
              background: activeTab === 'overview' ? '#081F3E' : 'transparent',
              color: activeTab === 'overview' ? '#F5A623' : '#64748B',
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}
          >
            <Shield size={16} /> Overview
          </button>

          <button
            onClick={() => setActiveTab('applications')}
            style={{
              padding: '12px 18px',
              borderRadius: '8px 8px 0 0',
              fontWeight: 700,
              fontSize: '0.9rem',
              cursor: 'pointer',
              border: 'none',
              background: activeTab === 'applications' ? '#081F3E' : 'transparent',
              color: activeTab === 'applications' ? '#F5A623' : '#64748B',
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}
          >
            <Users size={16} /> Applications ({applications.length})
          </button>

          <button
            onClick={() => setActiveTab('inquiries')}
            style={{
              padding: '12px 18px',
              borderRadius: '8px 8px 0 0',
              fontWeight: 700,
              fontSize: '0.9rem',
              cursor: 'pointer',
              border: 'none',
              background: activeTab === 'inquiries' ? '#081F3E' : 'transparent',
              color: activeTab === 'inquiries' ? '#F5A623' : '#64748B',
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}
          >
            <Mail size={16} /> Direct Inquiries ({inquiries.length})
          </button>

          <button
            onClick={() => setActiveTab('media')}
            style={{
              padding: '12px 18px',
              borderRadius: '8px 8px 0 0',
              fontWeight: 700,
              fontSize: '0.9rem',
              cursor: 'pointer',
              border: 'none',
              background: activeTab === 'media' ? '#081F3E' : 'transparent',
              color: activeTab === 'media' ? '#F5A623' : '#64748B',
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}
          >
            <Video size={16} /> Media &amp; Videos ({mediaList.length})
          </button>

          <button
            onClick={() => setActiveTab('courses')}
            style={{
              padding: '12px 18px',
              borderRadius: '8px 8px 0 0',
              fontWeight: 700,
              fontSize: '0.9rem',
              cursor: 'pointer',
              border: 'none',
              background: activeTab === 'courses' ? '#081F3E' : 'transparent',
              color: activeTab === 'courses' ? '#F5A623' : '#64748B',
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}
          >
            <BookOpen size={16} /> Curriculum Studio ({courses.length})
          </button>

          <button
            onClick={() => setActiveTab('news')}
            style={{
              padding: '12px 18px',
              borderRadius: '8px 8px 0 0',
              fontWeight: 700,
              fontSize: '0.9rem',
              cursor: 'pointer',
              border: 'none',
              background: activeTab === 'news' ? '#081F3E' : 'transparent',
              color: activeTab === 'news' ? '#F5A623' : '#64748B',
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}
          >
            <Sparkles size={16} /> Post &amp; News Studio ({news.length})
          </button>

          <button
            onClick={() => setActiveTab('settings')}
            style={{
              padding: '12px 18px',
              borderRadius: '8px 8px 0 0',
              fontWeight: 700,
              fontSize: '0.9rem',
              cursor: 'pointer',
              border: 'none',
              background: activeTab === 'settings' ? '#081F3E' : 'transparent',
              color: activeTab === 'settings' ? '#F5A623' : '#64748B',
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}
          >
            <Settings size={16} /> Universal Settings
          </button>
        </div>

        {/* ======================================================== */}
        {/* TAB 1: OVERVIEW & KPIS */}
        {/* ======================================================== */}
        {activeTab === 'overview' && (
          <div>
            <div 
              style={{ 
                display: 'grid', 
                gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', 
                gap: '20px', 
                marginBottom: '36px' 
              }}
            >
              <div className="premium-card" style={{ padding: '24px', background: '#FFFFFF' }}>
                <span style={{ fontSize: '0.8rem', color: '#64748B', fontWeight: 700, textTransform: 'uppercase' }}>
                  Total Applications
                </span>
                <h2 style={{ color: '#081F3E', fontSize: '2.4rem', fontWeight: 800, margin: '8px 0' }}>
                  {stats?.total_applications ?? applications.length}
                </h2>
                <span style={{ fontSize: '0.8rem', color: '#B45309', display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <Clock size={14} /> Real-time active database
                </span>
              </div>

              <div className="premium-card" style={{ padding: '24px', background: '#FFFFFF' }}>
                <span style={{ fontSize: '0.8rem', color: '#059669', fontWeight: 700, textTransform: 'uppercase' }}>
                  Paid Deposits (MoMo)
                </span>
                <h2 style={{ color: '#059669', fontSize: '2.4rem', fontWeight: 800, margin: '8px 0' }}>
                  {applications.filter(a => a.payment_status === 'Paid').length}
                </h2>
                <span style={{ fontSize: '0.8rem', color: '#059669', fontWeight: 700 }}>
                  {(applications.filter(a => a.payment_status === 'Paid').length * 50000).toLocaleString()} XAF cleared
                </span>
              </div>

              <div className="premium-card" style={{ padding: '24px', background: '#FFFFFF' }}>
                <span style={{ fontSize: '0.8rem', color: '#D97706', fontWeight: 700, textTransform: 'uppercase' }}>
                  Pending Payments
                </span>
                <h2 style={{ color: '#D97706', fontSize: '2.4rem', fontWeight: 800, margin: '8px 0' }}>
                  {applications.filter(a => a.payment_status !== 'Paid').length}
                </h2>
                <span style={{ fontSize: '0.8rem', color: '#D97706' }}>Awaiting deposit</span>
              </div>

              <div className="premium-card" style={{ padding: '24px', background: '#FFFFFF' }}>
                <span style={{ fontSize: '0.8rem', color: '#64748B', fontWeight: 700, textTransform: 'uppercase' }}>
                  Approved
                </span>
                <h2 style={{ color: '#10B981', fontSize: '2.4rem', fontWeight: 800, margin: '8px 0' }}>
                  {applications.filter(a => a.admission_status === 'Approved').length}
                </h2>
                <span style={{ fontSize: '0.8rem', color: '#10B981' }}>Offer letters sent</span>
              </div>

              <div className="premium-card" style={{ padding: '24px', background: '#FFFFFF' }}>
                <span style={{ fontSize: '0.8rem', color: '#64748B', fontWeight: 700, textTransform: 'uppercase' }}>
                  Direct Inquiries
                </span>
                <h2 style={{ color: '#081F3E', fontSize: '2.4rem', fontWeight: 800, margin: '8px 0' }}>
                  {inquiries.length}
                </h2>
                <span style={{ fontSize: '0.8rem', color: '#64748B' }}>Website messages</span>
              </div>
            </div>

            {/* Quick Actions Bar */}
            <div 
              style={{ 
                background: '#FFFFFF', 
                borderRadius: '12px', 
                padding: '20px 24px', 
                marginBottom: '32px',
                display: 'flex',
                gap: '16px',
                flexWrap: 'wrap',
                alignItems: 'center',
                boxShadow: '0 4px 15px rgba(0,0,0,0.03)',
                border: '1px solid rgba(15,23,42,0.06)'
              }}
            >
              <span style={{ fontWeight: 800, color: '#081F3E', fontSize: '0.92rem' }}>Quick Actions:</span>
              <button onClick={() => openCourseModal()} className="btn btn-primary" style={{ padding: '8px 16px', fontSize: '0.82rem' }}>
                <Plus size={14} /> Add Academic Course
              </button>
              <button onClick={() => openNewsModal()} className="btn btn-primary" style={{ padding: '8px 16px', fontSize: '0.82rem', background: '#081F3E', color: '#F5A623' }}>
                <Plus size={14} /> Publish Announcement
              </button>
              <button onClick={exportApplicantsCSV} className="btn btn-secondary" style={{ padding: '8px 16px', fontSize: '0.82rem', color: '#081F3E' }}>
                <Download size={14} /> Export Applicants (CSV)
              </button>
            </div>

            {/* Recent Activity Dual Grid */}
            <div className="grid-2" style={{ gap: '28px', alignItems: 'flex-start' }}>
              {/* Recent Applications */}
              <div className="premium-card" style={{ padding: '28px', background: '#FFFFFF' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                  <h3 style={{ color: '#081F3E', fontSize: '1.25rem', fontWeight: 800, margin: 0 }}>
                    Recent Applications
                  </h3>
                  <button 
                    onClick={() => setActiveTab('applications')} 
                    style={{ color: '#B45309', background: 'none', border: 'none', fontWeight: 700, fontSize: '0.85rem', cursor: 'pointer' }}
                  >
                    View All &rarr;
                  </button>
                </div>

                {applications.length === 0 ? (
                  <p style={{ color: '#94A3B8' }}>No applications received yet.</p>
                ) : (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                    {applications.slice(0, 5).map(app => (
                      <div 
                        key={app.id}
                        style={{ 
                          padding: '12px 16px', 
                          background: '#F8FAFC', 
                          borderRadius: '8px',
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'center'
                        }}
                      >
                        <div>
                          <div style={{ fontWeight: 800, color: '#081F3E', fontSize: '0.95rem' }}>{app.full_name}</div>
                          <div style={{ fontSize: '0.82rem', color: '#64748B' }}>{app.program_type} &bull; #{app.id}</div>
                        </div>
                        <span style={{ 
                          fontSize: '0.75rem',
                          fontWeight: 700,
                          padding: '4px 10px',
                          borderRadius: '4px',
                          background: app.admission_status === 'Approved' ? '#ECFDF5' : app.admission_status === 'Rejected' ? '#FEF2F2' : '#FEF3C7',
                          color: app.admission_status === 'Approved' ? '#059669' : app.admission_status === 'Rejected' ? '#DC2626' : '#B45309'
                        }}>
                          {app.admission_status}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Recent Inquiries */}
              <div className="premium-card" style={{ padding: '28px', background: '#FFFFFF' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                  <h3 style={{ color: '#081F3E', fontSize: '1.25rem', fontWeight: 800, margin: 0 }}>
                    Recent Direct Inquiries
                  </h3>
                  <button 
                    onClick={() => setActiveTab('inquiries')} 
                    style={{ color: '#B45309', background: 'none', border: 'none', fontWeight: 700, fontSize: '0.85rem', cursor: 'pointer' }}
                  >
                    View All &rarr;
                  </button>
                </div>

                {inquiries.length === 0 ? (
                  <p style={{ color: '#94A3B8' }}>No inquiries received yet.</p>
                ) : (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                    {inquiries.slice(0, 5).map(inq => (
                      <div 
                        key={inq.id}
                        style={{ 
                          padding: '12px 16px', 
                          background: '#F8FAFC', 
                          borderRadius: '8px'
                        }}
                      >
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                          <span style={{ fontWeight: 800, color: '#081F3E', fontSize: '0.92rem' }}>{inq.name}</span>
                          <span style={{ fontSize: '0.75rem', color: '#94A3B8' }}>{new Date(inq.created_at).toLocaleDateString()}</span>
                        </div>
                        <div style={{ fontSize: '0.85rem', color: '#B45309', fontWeight: 600 }}>{inq.subject}</div>
                        <p style={{ fontSize: '0.82rem', color: '#64748B', margin: '4px 0 0 0', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                          {inq.message}
                        </p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* ======================================================== */}
        {/* TAB 2: APPLICATIONS & ADMISSIONS MANAGEMENT */}
        {/* ======================================================== */}
        {activeTab === 'applications' && (
          <div>
            <div 
              className="premium-card" 
              style={{ 
                padding: '20px 24px', 
                background: '#FFFFFF', 
                marginBottom: '24px',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                flexWrap: 'wrap',
                gap: '16px'
              }}
            >
              {/* Search */}
              <div style={{ position: 'relative', minWidth: '280px', flexGrow: 1 }}>
                <Search size={18} style={{ position: 'absolute', left: '12px', top: '12px', color: '#94A3B8' }} />
                <input 
                  type="text" 
                  placeholder="Search by student name, email, program or ID..." 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '10px 14px 10px 38px',
                    borderRadius: '8px',
                    border: '1px solid rgba(15,23,42,0.15)',
                    fontSize: '0.9rem'
                  }}
                />
              </div>

              {/* Status & Payment Filter Pills */}
              <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', alignItems: 'center' }}>
                <div style={{ display: 'flex', gap: '4px', background: '#F1F5F9', padding: '4px', borderRadius: '8px' }}>
                  {(['ALL', 'Under Review', 'Approved', 'Rejected'] as const).map((st) => (
                    <button
                      key={st}
                      onClick={() => setStatusFilter(st)}
                      style={{
                        padding: '6px 12px',
                        borderRadius: '6px',
                        fontSize: '0.8rem',
                        fontWeight: 700,
                        cursor: 'pointer',
                        border: 'none',
                        background: statusFilter === st ? '#081F3E' : 'transparent',
                        color: statusFilter === st ? '#F5A623' : '#64748B'
                      }}
                    >
                      {st}
                    </button>
                  ))}
                </div>

                <div style={{ display: 'flex', gap: '4px', background: '#F1F5F9', padding: '4px', borderRadius: '8px' }}>
                  {(['ALL', 'Paid', 'Pending'] as const).map((pt) => (
                    <button
                      key={pt}
                      onClick={() => setPaymentFilter(pt)}
                      style={{
                        padding: '6px 12px',
                        borderRadius: '6px',
                        fontSize: '0.8rem',
                        fontWeight: 700,
                        cursor: 'pointer',
                        border: 'none',
                        background: paymentFilter === pt ? '#059669' : 'transparent',
                        color: paymentFilter === pt ? '#FFFFFF' : '#64748B'
                      }}
                    >
                      {pt === 'ALL' ? 'All Payments' : pt === 'Paid' ? '💳 Paid Only' : '⏳ Pending Only'}
                    </button>
                  ))}
                </div>

                <button
                  onClick={exportApplicantsCSV}
                  className="btn btn-secondary"
                  style={{ padding: '8px 14px', fontSize: '0.82rem', color: '#081F3E' }}
                >
                  <Download size={14} /> Export CSV
                </button>
              </div>
            </div>

            {/* Applications Table */}
            <div 
              className="premium-card" 
              style={{ 
                padding: 0, 
                background: '#FFFFFF', 
                overflow: 'hidden',
                boxShadow: '0 8px 30px rgba(0,0,0,0.04)' 
              }}
            >
              <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.9rem' }}>
                  <thead>
                    <tr style={{ background: '#F8FAFC', borderBottom: '1px solid rgba(15,23,42,0.08)', color: '#64748B', fontSize: '0.78rem', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                      <th style={{ padding: '16px 20px' }}>ID &amp; Student</th>
                      <th style={{ padding: '16px 20px' }}>Program Track</th>
                      <th style={{ padding: '16px 20px' }}>Format</th>
                      <th style={{ padding: '16px 20px' }}>Admission Status</th>
                      <th style={{ padding: '16px 20px' }}>Deposit (50k XAF)</th>
                      <th style={{ padding: '16px 20px', textAlign: 'right' }}>Actions &amp; Decision</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredApps.length === 0 ? (
                      <tr>
                        <td colSpan={6} style={{ padding: '40px', textAlign: 'center', color: '#94A3B8' }}>
                          No applications match your filter criteria.
                        </td>
                      </tr>
                    ) : (
                      filteredApps.map((app) => (
                        <tr 
                          key={app.id}
                          style={{ 
                            borderBottom: '1px solid rgba(15,23,42,0.05)',
                            transition: 'background 0.15s ease'
                          }}
                        >
                          <td style={{ padding: '16px 20px' }}>
                            <div style={{ fontWeight: 800, color: '#081F3E', fontSize: '0.95rem' }}>
                              {app.full_name}
                            </div>
                            <div style={{ fontSize: '0.8rem', color: '#64748B' }}>
                              {app.email} &bull; {app.phone || 'No phone'}
                            </div>
                            <span style={{ fontSize: '0.72rem', color: '#B45309', fontFamily: 'var(--font-mono)' }}>
                              #{app.id}
                            </span>
                          </td>

                          <td style={{ padding: '16px 20px' }}>
                            <div style={{ fontWeight: 700, color: '#081F3E' }}>{app.program_type}</div>
                            <span style={{ fontSize: '0.75rem', background: '#FEF3C7', color: '#B45309', padding: '2px 6px', borderRadius: '4px', fontWeight: 800 }}>
                              {app.degree_type}
                            </span>
                          </td>

                          <td style={{ padding: '16px 20px', textTransform: 'capitalize', color: '#64748B' }}>
                            {app.study_format}
                          </td>

                          <td style={{ padding: '16px 20px' }}>
                            <span style={{ 
                              padding: '5px 12px',
                              borderRadius: '20px',
                              fontSize: '0.8rem',
                              fontWeight: 800,
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: '6px',
                              background: app.admission_status === 'Approved' ? '#ECFDF5' : app.admission_status === 'Rejected' ? '#FEF2F2' : '#FEF3C7',
                              color: app.admission_status === 'Approved' ? '#059669' : app.admission_status === 'Rejected' ? '#DC2626' : '#B45309'
                            }}>
                              {app.admission_status === 'Approved' && <CheckCircle size={14} />}
                              {app.admission_status === 'Rejected' && <XCircle size={14} />}
                              {app.admission_status === 'Under Review' && <Clock size={14} />}
                              {app.admission_status}
                            </span>
                          </td>

                          <td style={{ padding: '16px 20px' }}>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', alignItems: 'flex-start' }}>
                              <span style={{ 
                                padding: '4px 10px',
                                borderRadius: '16px',
                                fontSize: '0.78rem',
                                fontWeight: 800,
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: '5px',
                                background: app.payment_status === 'Paid' ? '#ECFDF5' : '#FFFBEB',
                                color: app.payment_status === 'Paid' ? '#059669' : '#D97706',
                                border: app.payment_status === 'Paid' ? '1px solid #A7F3D0' : '1px solid #FDE68A'
                              }}>
                                {app.payment_status === 'Paid' ? (
                                  <>
                                    <CheckCircle size={13} color="#059669" />
                                    <span>✓ Paid (50k XAF)</span>
                                  </>
                                ) : (
                                  <>
                                    <Clock size={13} color="#D97706" />
                                    <span>⏳ Unpaid</span>
                                  </>
                                )}
                              </span>
                              
                              <button
                                onClick={() => togglePaymentStatus(app.id, app.payment_status)}
                                style={{
                                  border: 'none',
                                  background: 'transparent',
                                  color: '#64748B',
                                  fontSize: '0.72rem',
                                  fontWeight: 600,
                                  cursor: 'pointer',
                                  textDecoration: 'underline',
                                  padding: 0
                                }}
                                title="Click to manually toggle payment status"
                              >
                                {app.payment_status === 'Paid' ? 'Reset to Unpaid' : 'Mark as Paid'}
                              </button>
                            </div>
                          </td>

                          <td style={{ padding: '16px 20px', textAlign: 'right' }}>
                            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px' }}>
                              {app.admission_status !== 'Approved' && (
                                <button
                                  onClick={() => updateAppStatus(app.id, 'Approved')}
                                  disabled={actionLoading}
                                  style={{
                                    background: '#10B981',
                                    color: '#FFFFFF',
                                    border: 'none',
                                    padding: '6px 12px',
                                    borderRadius: '6px',
                                    fontWeight: 700,
                                    fontSize: '0.78rem',
                                    cursor: 'pointer',
                                    display: 'inline-flex',
                                    alignItems: 'center',
                                    gap: '4px'
                                  }}
                                  title="Approve applicant and dispatch acceptance email"
                                >
                                  <Check size={14} /> Approve
                                </button>
                              )}

                              {app.admission_status !== 'Rejected' && (
                                <button
                                  onClick={() => updateAppStatus(app.id, 'Rejected')}
                                  disabled={actionLoading}
                                  style={{
                                    background: '#EF4444',
                                    color: '#FFFFFF',
                                    border: 'none',
                                    padding: '6px 12px',
                                    borderRadius: '6px',
                                    fontWeight: 700,
                                    fontSize: '0.78rem',
                                    cursor: 'pointer',
                                    display: 'inline-flex',
                                    alignItems: 'center',
                                    gap: '4px'
                                  }}
                                  title="Reject applicant and dispatch status email"
                                >
                                  <X size={14} /> Reject
                                </button>
                              )}

                              <button
                                onClick={() => setSelectedApp(app)}
                                style={{
                                  background: '#081F3E',
                                  color: '#FFFFFF',
                                  border: 'none',
                                  padding: '6px 10px',
                                  borderRadius: '6px',
                                  fontWeight: 600,
                                  fontSize: '0.78rem',
                                  cursor: 'pointer'
                                }}
                                title="View applicant dossier"
                              >
                                <Eye size={14} />
                              </button>

                              <button
                                onClick={() => deleteApplication(app.id)}
                                style={{
                                  background: '#F1F5F9',
                                  color: '#DC2626',
                                  border: 'none',
                                  padding: '6px 10px',
                                  borderRadius: '6px',
                                  cursor: 'pointer'
                                }}
                                title="Delete record"
                              >
                                <Trash2 size={14} />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Applicant Details Modal */}
            {selectedApp && (
              <div 
                style={{
                  position: 'fixed',
                  top: 0,
                  left: 0,
                  width: '100%',
                  height: '100%',
                  background: 'rgba(8,31,62,0.7)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  zIndex: 9999,
                  backdropFilter: 'blur(4px)',
                  padding: '20px'
                }}
              >
                <div 
                  style={{
                    background: '#FFFFFF',
                    borderRadius: '16px',
                    maxWidth: '560px',
                    width: '100%',
                    padding: '32px',
                    boxShadow: '0 20px 60px rgba(0,0,0,0.3)',
                    maxHeight: '90vh',
                    overflowY: 'auto'
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                    <div>
                      <span style={{ fontSize: '0.75rem', background: '#FEF3C7', color: '#B45309', padding: '3px 8px', borderRadius: '4px', fontWeight: 800 }}>
                        APPLICATION DOSSIER #{selectedApp.id}
                      </span>
                      <h2 style={{ color: '#081F3E', margin: '6px 0 0 0', fontSize: '1.4rem' }}>
                        {selectedApp.full_name}
                      </h2>
                    </div>
                    <button 
                      onClick={() => setSelectedApp(null)} 
                      style={{ background: '#F1F5F9', border: 'none', borderRadius: '50%', width: '32px', height: '32px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                    >
                      <X size={18} />
                    </button>
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', fontSize: '0.9rem', color: '#334155' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #F1F5F9', paddingBottom: '8px' }}>
                      <span style={{ color: '#64748B' }}>Email Address:</span>
                      <strong>{selectedApp.email}</strong>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #F1F5F9', paddingBottom: '8px' }}>
                      <span style={{ color: '#64748B' }}>Phone:</span>
                      <strong>{selectedApp.phone || 'N/A'}</strong>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #F1F5F9', paddingBottom: '8px' }}>
                      <span style={{ color: '#64748B' }}>Degree Level:</span>
                      <strong>{selectedApp.degree_type}</strong>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #F1F5F9', paddingBottom: '8px' }}>
                      <span style={{ color: '#64748B' }}>Program Track:</span>
                      <strong>{selectedApp.program_type}</strong>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #F1F5F9', paddingBottom: '8px' }}>
                      <span style={{ color: '#64748B' }}>Study Format:</span>
                      <strong style={{ textTransform: 'capitalize' }}>{selectedApp.study_format}</strong>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #F1F5F9', paddingBottom: '8px' }}>
                      <span style={{ color: '#64748B' }}>Submission Date:</span>
                      <strong>{new Date(selectedApp.created_at).toLocaleString()}</strong>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #F1F5F9', paddingBottom: '8px' }}>
                      <span style={{ color: '#64748B' }}>Admission Status:</span>
                      <span style={{ fontWeight: 800, color: selectedApp.admission_status === 'Approved' ? '#059669' : selectedApp.admission_status === 'Rejected' ? '#DC2626' : '#B45309' }}>
                        {selectedApp.admission_status}
                      </span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #F1F5F9', paddingBottom: '8px' }}>
                      <span style={{ color: '#64748B' }}>Tuition Deposit (50k XAF):</span>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <span style={{ 
                          fontWeight: 800, 
                          fontSize: '0.82rem',
                          color: selectedApp.payment_status === 'Paid' ? '#059669' : '#D97706',
                          background: selectedApp.payment_status === 'Paid' ? '#ECFDF5' : '#FFFBEB',
                          padding: '3px 8px',
                          borderRadius: '4px',
                          border: selectedApp.payment_status === 'Paid' ? '1px solid #A7F3D0' : '1px solid #FDE68A'
                        }}>
                          {selectedApp.payment_status === 'Paid' ? '✓ 50,000 XAF Paid' : '⏳ Deposit Pending'}
                        </span>
                        <button
                          type="button"
                          onClick={() => {
                            togglePaymentStatus(selectedApp.id, selectedApp.payment_status);
                            setSelectedApp(prev => prev ? { ...prev, payment_status: prev.payment_status === 'Paid' ? 'Pending' : 'Paid' } : null);
                          }}
                          style={{
                            border: '1px solid #CBD5E1',
                            background: '#F8FAFC',
                            color: '#081F3E',
                            borderRadius: '4px',
                            padding: '3px 8px',
                            fontSize: '0.75rem',
                            fontWeight: 700,
                            cursor: 'pointer'
                          }}
                        >
                          {selectedApp.payment_status === 'Paid' ? 'Reset to Unpaid' : 'Mark as Paid'}
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Uploaded Documents List */}
                  <div style={{ marginTop: '20px', background: '#F8FAFC', padding: '16px', borderRadius: '8px', border: '1px solid #E2E8F0' }}>
                    <h4 style={{ margin: '0 0 10px 0', fontSize: '0.88rem', color: '#081F3E', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                      📁 Submitted Credentials &amp; Documents
                    </h4>
                    {selectedApp.documents && selectedApp.documents.length > 0 ? (
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                        {selectedApp.documents.map((doc, idx) => (
                          <div key={idx} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: '#FFFFFF', padding: '8px 12px', borderRadius: '6px', border: '1px solid #E2E8F0', fontSize: '0.84rem' }}>
                            <div>
                              <strong style={{ color: '#081F3E', display: 'block' }}>{doc.label || `Document #${idx + 1}`}</strong>
                              <span style={{ color: '#64748B', fontSize: '0.78rem' }}>{doc.fileName} {doc.size ? `(${doc.size})` : ''}</span>
                            </div>
                            <span style={{ background: '#ECFDF5', color: '#059669', fontSize: '0.75rem', fontWeight: 700, padding: '2px 8px', borderRadius: '4px' }}>
                              Attached
                            </span>
                          </div>
                        ))}
                      </div>
                    ) : selectedApp.document_url ? (
                      <div style={{ background: '#FFFFFF', padding: '8px 12px', borderRadius: '6px', border: '1px solid #E2E8F0', fontSize: '0.84rem', color: '#081F3E' }}>
                        <strong>Attached File:</strong> {selectedApp.document_url}
                      </div>
                    ) : (
                      <p style={{ margin: 0, color: '#94A3B8', fontSize: '0.82rem', fontStyle: 'italic' }}>
                        No physical files attached yet.
                      </p>
                    )}
                  </div>

                  <div style={{ marginTop: '28px', display: 'flex', gap: '10px' }}>
                    <button
                      onClick={() => updateAppStatus(selectedApp.id, 'Approved')}
                      disabled={actionLoading}
                      style={{ flex: 1, padding: '12px', background: '#10B981', color: '#FFF', border: 'none', borderRadius: '8px', fontWeight: 800, cursor: 'pointer' }}
                    >
                      ✓ Approve Applicant
                    </button>
                    <button
                      onClick={() => updateAppStatus(selectedApp.id, 'Rejected')}
                      disabled={actionLoading}
                      style={{ flex: 1, padding: '12px', background: '#EF4444', color: '#FFF', border: 'none', borderRadius: '8px', fontWeight: 800, cursor: 'pointer' }}
                    >
                      ✕ Reject Applicant
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* ======================================================== */}
        {/* TAB 3: DIRECT INQUIRIES */}
        {/* ======================================================== */}
        {activeTab === 'inquiries' && (
          <div>
            <div className="section-header" style={{ marginBottom: '24px' }}>
              <h2>Direct Inquiries from Contact Form</h2>
              <p className="sub-header">Review inquiries submitted by prospective students and corporate software partners.</p>
            </div>

            {inquiries.length === 0 ? (
              <div className="premium-card" style={{ padding: '40px', textAlign: 'center', color: '#94A3B8' }}>
                No inquiries received yet.
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                {inquiries.map((inq) => (
                  <div 
                    key={inq.id}
                    className="premium-card"
                    style={{ background: '#FFFFFF', padding: '24px 28px' }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '10px', marginBottom: '12px' }}>
                      <div>
                        <span style={{ fontSize: '0.75rem', background: '#FEF3C7', color: '#B45309', padding: '3px 8px', borderRadius: '4px', fontWeight: 800 }}>
                          INQUIRY #{inq.id}
                        </span>
                        <h3 style={{ color: '#081F3E', margin: '6px 0 2px 0', fontSize: '1.2rem' }}>
                          {inq.subject}
                        </h3>
                        <span style={{ color: '#64748B', fontSize: '0.85rem' }}>
                          From: <strong>{inq.name}</strong> (<a href={`mailto:${inq.email}`} style={{ color: '#081F3E' }}>{inq.email}</a>) &bull; {new Date(inq.created_at).toLocaleString()}
                        </span>
                      </div>
                      <div style={{ display: 'flex', gap: '8px' }}>
                        <a 
                          href={`mailto:${inq.email}?subject=Re: ${encodeURIComponent(inq.subject)}`}
                          className="btn btn-primary"
                          style={{ padding: '8px 14px', fontSize: '0.82rem' }}
                        >
                          <Mail size={14} /> Reply via Email
                        </a>
                        <button
                          onClick={() => deleteInquiry(inq.id)}
                          style={{ background: '#FEE2E2', color: '#DC2626', border: 'none', padding: '8px 12px', borderRadius: '6px', cursor: 'pointer' }}
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </div>
                    <div style={{ background: '#F8FAFC', padding: '16px', borderRadius: '8px', color: '#334155', fontSize: '0.95rem', lineHeight: '1.6' }}>
                      {inq.message}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ======================================================== */}
        {/* TAB 4: MEDIA & VIDEOS MANAGER */}
        {/* ======================================================== */}
        {activeTab === 'media' && (
          <div>
            <div className="section-header" style={{ marginBottom: '24px' }}>
              <h2>Media, Videos &amp; Image Assets</h2>
              <p className="sub-header">Manage video players, workshop recordings (E1, E2), prospectus flyers, and promotional images.</p>
            </div>

            {/* Upload Box */}
            <div className="premium-card" style={{ background: '#FFFFFF', padding: '28px', marginBottom: '36px' }}>
              <h3 style={{ color: '#081F3E', marginBottom: '16px', fontSize: '1.15rem' }}>
                <Plus size={18} style={{ display: 'inline', marginRight: '6px' }} />
                Upload New Image or Video Asset
              </h3>
              <form onSubmit={handleMediaUpload} style={{ display: 'flex', flexWrap: 'wrap', gap: '16px', alignItems: 'flex-end' }}>
                <div style={{ flex: '1 1 200px' }}>
                  <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, marginBottom: '6px', color: '#64748B' }}>
                    Asset Title
                  </label>
                  <input 
                    type="text" 
                    placeholder="e.g. Workshop Session 3" 
                    value={newMediaTitle}
                    onChange={(e) => setNewMediaTitle(e.target.value)}
                    style={{ width: '100%', padding: '10px 14px', borderRadius: '8px', border: '1px solid rgba(15,23,42,0.15)' }}
                  />
                </div>

                <div style={{ flex: '1 1 180px' }}>
                  <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, marginBottom: '6px', color: '#64748B' }}>
                    Category
                  </label>
                  <select 
                    value={newMediaCategory}
                    onChange={(e) => setNewMediaCategory(e.target.value)}
                    style={{ width: '100%', padding: '10px 14px', borderRadius: '8px', border: '1px solid rgba(15,23,42,0.15)' }}
                  >
                    <option value="Workshops">Workshops (Videos)</option>
                    <option value="Prospectus">Prospectus &amp; Flyers</option>
                    <option value="Campus Life">Campus Life</option>
                    <option value="Branding">Branding</option>
                  </select>
                </div>

                <div style={{ flex: '1 1 240px' }}>
                  <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, marginBottom: '6px', color: '#64748B' }}>
                    Choose File (MP4, PNG, JPG)
                  </label>
                  <input 
                    type="file" 
                    accept="image/*,video/mp4"
                    onChange={(e) => setUploadFile(e.target.files?.[0] || null)}
                    style={{ width: '100%', padding: '8px', borderRadius: '8px', border: '1px solid rgba(15,23,42,0.15)' }}
                  />
                </div>

                <button 
                  type="submit" 
                  disabled={actionLoading}
                  className="btn btn-primary"
                  style={{ padding: '12px 24px', height: '44px' }}
                >
                  {actionLoading ? 'Uploading...' : 'Upload Asset'}
                </button>
              </form>
            </div>

            {/* Media Gallery Grid */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '24px' }}>
              {mediaList.map((m) => (
                <div 
                  key={m.id}
                  className="premium-card"
                  style={{ padding: 0, overflow: 'hidden', background: '#FFFFFF', display: 'flex', flexDirection: 'column' }}
                >
                  <div style={{ position: 'relative', width: '100%', height: '180px', background: '#081F3E' }}>
                    {m.type === 'video' ? (
                      <video 
                        src={m.src} 
                        controls 
                        style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
                      />
                    ) : (
                      <Image 
                        src={m.src} 
                        alt={m.title} 
                        fill 
                        style={{ objectFit: 'cover' }}
                        sizes="300px" 
                      />
                    )}
                    <span style={{ 
                      position: 'absolute', 
                      top: '10px', 
                      left: '10px', 
                      background: m.type === 'video' ? '#F5A623' : '#081F3E',
                      color: m.type === 'video' ? '#081F3E' : '#FFF',
                      fontSize: '0.72rem',
                      fontWeight: 800,
                      padding: '3px 8px',
                      borderRadius: '4px',
                      textTransform: 'uppercase'
                    }}>
                      {m.type}
                    </span>
                  </div>

                  <div style={{ padding: '18px 20px', flexGrow: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                    <div>
                      <h4 style={{ color: '#081F3E', fontSize: '1rem', fontWeight: 800, marginBottom: '4px' }}>
                        {m.title}
                      </h4>
                      <p style={{ color: '#64748B', fontSize: '0.78rem', margin: '0 0 10px 0' }}>
                        Path: <code>{m.src}</code> ({m.size})
                      </p>
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid #F1F5F9', paddingTop: '10px' }}>
                      <span style={{ fontSize: '0.75rem', color: '#B45309', fontWeight: 700 }}>
                        {m.category}
                      </span>
                      <button 
                        onClick={() => deleteMedia(m.id)}
                        style={{ background: 'none', border: 'none', color: '#DC2626', cursor: 'pointer' }}
                        title="Delete asset"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ======================================================== */}
        {/* TAB 5: COURSES & CURRICULUM STUDIO */}
        {/* ======================================================== */}
        {activeTab === 'courses' && (
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', flexWrap: 'wrap', gap: '14px' }}>
              <div>
                <h2 style={{ color: '#081F3E', margin: '0 0 4px 0' }}>Academic Programs &amp; Course Tracks</h2>
                <p style={{ color: '#64748B', margin: 0, fontSize: '0.92rem' }}>
                  Manage diploma tracks, tuition fees, durations, and syllabi across the School of Engineering and School of Business.
                </p>
              </div>
              <button 
                onClick={() => openCourseModal()} 
                className="btn btn-primary"
                style={{ padding: '10px 20px' }}
              >
                <Plus size={16} /> Add New Program Track
              </button>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '24px' }}>
              {courses.map((c) => (
                <div key={c.id} className="premium-card" style={{ background: '#FFFFFF', padding: '24px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                      <span style={{ fontSize: '0.75rem', background: '#FEF3C7', color: '#B45309', padding: '3px 8px', borderRadius: '4px', fontWeight: 800 }}>
                        {c.degree_type}
                      </span>
                      <span style={{ fontWeight: 800, color: '#081F3E', fontSize: '1.05rem' }}>
                        {c.tuition_fee ? `${c.tuition_fee.toLocaleString()} XAF` : '250,000 XAF'}
                      </span>
                    </div>
                    <h3 style={{ color: '#081F3E', fontSize: '1.15rem', fontWeight: 800, marginBottom: '8px' }}>{c.title}</h3>
                    <p style={{ color: '#64748B', fontSize: '0.88rem', lineHeight: '1.6', marginBottom: '14px' }}>
                      {c.description}
                    </p>
                    {c.modules && (
                      <div style={{ background: '#F8FAFC', padding: '8px 12px', borderRadius: '6px', fontSize: '0.78rem', color: '#081F3E', marginBottom: '12px' }}>
                        <strong>Modules:</strong> {c.modules}
                      </div>
                    )}
                    <div style={{ fontSize: '0.8rem', color: '#94A3B8' }}>
                      Duration: <strong>{c.duration}</strong> &bull; Track: <strong>{c.program_type}</strong>
                    </div>
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px', borderTop: '1px solid #F1F5F9', paddingTop: '14px', marginTop: '16px' }}>
                    <button
                      onClick={() => openCourseModal(c)}
                      className="btn btn-secondary"
                      style={{ padding: '6px 12px', fontSize: '0.8rem', color: '#081F3E' }}
                    >
                      <Edit size={14} /> Edit Track
                    </button>
                    <button
                      onClick={() => deleteCourse(c.id)}
                      style={{ background: '#FEE2E2', color: '#DC2626', border: 'none', padding: '6px 10px', borderRadius: '6px', cursor: 'pointer' }}
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Course Modal Dialog */}
            {showCourseModal && (
              <div 
                style={{
                  position: 'fixed',
                  top: 0, left: 0, width: '100%', height: '100%',
                  background: 'rgba(8,31,62,0.7)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  zIndex: 9999, backdropFilter: 'blur(4px)', padding: '20px'
                }}
              >
                <div style={{ background: '#FFFFFF', borderRadius: '16px', maxWidth: '600px', width: '100%', padding: '32px', maxHeight: '90vh', overflowY: 'auto' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                    <h3 style={{ color: '#081F3E', margin: 0 }}>
                      {editingCourse ? 'Edit Academic Track' : 'Add New Academic Program'}
                    </h3>
                    <button onClick={() => setShowCourseModal(false)} style={{ background: 'none', border: 'none', cursor: 'pointer' }}>
                      <X size={20} />
                    </button>
                  </div>

                  <form onSubmit={handleSaveCourse} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                    <div>
                      <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, marginBottom: '6px', color: '#64748B' }}>
                        Program Title
                      </label>
                      <input 
                        type="text" 
                        required
                        placeholder="e.g. Software Engineering (B.Tech / HND)"
                        value={courseForm.title}
                        onChange={(e) => setCourseForm({ ...courseForm, title: e.target.value })}
                        style={{ width: '100%', padding: '10px 14px', borderRadius: '8px', border: '1px solid rgba(15,23,42,0.15)' }}
                      />
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
                      <div>
                        <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, marginBottom: '6px', color: '#64748B' }}>
                          Degree Level
                        </label>
                        <select 
                          value={courseForm.degree_type}
                          onChange={(e) => setCourseForm({ ...courseForm, degree_type: e.target.value })}
                          style={{ width: '100%', padding: '10px 14px', borderRadius: '8px', border: '1px solid rgba(15,23,42,0.15)' }}
                        >
                          <option value="HND">HND (Higher National Diploma)</option>
                          <option value="ND">ND (National Diploma)</option>
                          <option value="Certification">Professional Certification</option>
                          <option value="B.Tech">B.Tech (Bachelor of Technology)</option>
                        </select>
                      </div>

                      <div>
                        <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, marginBottom: '6px', color: '#64748B' }}>
                          Tuition Fee (XAF)
                        </label>
                        <input 
                          type="number" 
                          required
                          value={courseForm.tuition_fee}
                          onChange={(e) => setCourseForm({ ...courseForm, tuition_fee: parseInt(e.target.value) || 0 })}
                          style={{ width: '100%', padding: '10px 14px', borderRadius: '8px', border: '1px solid rgba(15,23,42,0.15)' }}
                        />
                      </div>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
                      <div>
                        <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, marginBottom: '6px', color: '#64748B' }}>
                          Duration
                        </label>
                        <input 
                          type="text" 
                          placeholder="e.g. 3 Years, 9 Months"
                          value={courseForm.duration}
                          onChange={(e) => setCourseForm({ ...courseForm, duration: e.target.value })}
                          style={{ width: '100%', padding: '10px 14px', borderRadius: '8px', border: '1px solid rgba(15,23,42,0.15)' }}
                        />
                      </div>

                      <div>
                        <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, marginBottom: '6px', color: '#64748B' }}>
                          Track Specialization
                        </label>
                        <input 
                          type="text" 
                          placeholder="e.g. Software Engineering, Accounting"
                          value={courseForm.program_type}
                          onChange={(e) => setCourseForm({ ...courseForm, program_type: e.target.value })}
                          style={{ width: '100%', padding: '10px 14px', borderRadius: '8px', border: '1px solid rgba(15,23,42,0.15)' }}
                        />
                      </div>
                    </div>

                    <div>
                      <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, marginBottom: '6px', color: '#64748B' }}>
                        Curriculum Syllabus &amp; Modules
                      </label>
                      <input 
                        type="text" 
                        placeholder="e.g. TypeScript, React, Python, PostgreSQL, Docker, Git"
                        value={courseForm.modules}
                        onChange={(e) => setCourseForm({ ...courseForm, modules: e.target.value })}
                        style={{ width: '100%', padding: '10px 14px', borderRadius: '8px', border: '1px solid rgba(15,23,42,0.15)' }}
                      />
                    </div>

                    <div>
                      <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, marginBottom: '6px', color: '#64748B' }}>
                        Description
                      </label>
                      <textarea 
                        rows={3}
                        required
                        placeholder="Course overview and career outcomes..."
                        value={courseForm.description}
                        onChange={(e) => setCourseForm({ ...courseForm, description: e.target.value })}
                        style={{ width: '100%', padding: '10px 14px', borderRadius: '8px', border: '1px solid rgba(15,23,42,0.15)' }}
                      />
                    </div>

                    <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
                      <button type="submit" disabled={actionLoading} className="btn btn-primary" style={{ flex: 1, padding: '12px' }}>
                        {editingCourse ? 'Save Changes' : 'Create Program Track'}
                      </button>
                      <button type="button" onClick={() => setShowCourseModal(false)} className="btn btn-secondary" style={{ padding: '12px 20px', color: '#081F3E' }}>
                        Cancel
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            )}
          </div>
        )}

        {/* ======================================================== */}
        {/* TAB 6: POST & NEWS STUDIO */}
        {/* ======================================================== */}
        {activeTab === 'news' && (
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', flexWrap: 'wrap', gap: '14px' }}>
              <div>
                <h2 style={{ color: '#081F3E', margin: '0 0 4px 0' }}>News, Events &amp; Flyers Studio</h2>
                <p style={{ color: '#64748B', margin: 0, fontSize: '0.92rem' }}>
                  Publish and edit prospectus announcements and flyers displayed on the Home and About pages.
                </p>
              </div>
              <button 
                onClick={() => openNewsModal()} 
                className="btn btn-primary"
                style={{ padding: '10px 20px' }}
              >
                <Plus size={16} /> Publish New Announcement
              </button>
            </div>

            <div className="grid-3" style={{ gap: '24px' }}>
              {news.map((n) => (
                <div key={n.id} className="premium-card" style={{ background: '#FFFFFF', padding: '20px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                  <div>
                    <div style={{ position: 'relative', height: '190px', borderRadius: '8px', overflow: 'hidden', marginBottom: '14px', background: '#081F3E' }}>
                      <Image src={n.image} alt={n.title} fill style={{ objectFit: 'cover' }} sizes="300px" />
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                      <span style={{ fontSize: '0.75rem', background: '#FEF3C7', color: '#B45309', padding: '3px 8px', borderRadius: '4px', fontWeight: 800 }}>
                        {n.category}
                      </span>
                      <span style={{ fontSize: '0.75rem', color: '#94A3B8' }}>{n.date}</span>
                    </div>
                    <h4 style={{ color: '#081F3E', margin: '10px 0 6px 0', fontSize: '1.05rem', fontWeight: 800 }}>{n.title}</h4>
                    <p style={{ color: '#64748B', fontSize: '0.85rem', lineHeight: '1.5' }}>{n.excerpt}</p>
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px', borderTop: '1px solid #F1F5F9', paddingTop: '14px', marginTop: '16px' }}>
                    <button
                      onClick={() => openNewsModal(n)}
                      className="btn btn-secondary"
                      style={{ padding: '6px 12px', fontSize: '0.8rem', color: '#081F3E' }}
                    >
                      <Edit size={14} /> Edit
                    </button>
                    <button
                      onClick={() => deleteNews(n.id)}
                      style={{ background: '#FEE2E2', color: '#DC2626', border: 'none', padding: '6px 10px', borderRadius: '6px', cursor: 'pointer' }}
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* News Modal Dialog */}
            {showNewsModal && (
              <div 
                style={{
                  position: 'fixed',
                  top: 0, left: 0, width: '100%', height: '100%',
                  background: 'rgba(8,31,62,0.7)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  zIndex: 9999, backdropFilter: 'blur(4px)', padding: '20px'
                }}
              >
                <div style={{ background: '#FFFFFF', borderRadius: '16px', maxWidth: '580px', width: '100%', padding: '32px', maxHeight: '90vh', overflowY: 'auto' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                    <h3 style={{ color: '#081F3E', margin: 0 }}>
                      {editingNews ? 'Edit Announcement' : 'Publish New Announcement'}
                    </h3>
                    <button onClick={() => setShowNewsModal(false)} style={{ background: 'none', border: 'none', cursor: 'pointer' }}>
                      <X size={20} />
                    </button>
                  </div>

                  <form onSubmit={handleSaveNews} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                    <div>
                      <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, marginBottom: '6px', color: '#64748B' }}>
                        Title
                      </label>
                      <input 
                        type="text" 
                        required
                        placeholder="e.g. Fall 2026 Admissions Open"
                        value={newsForm.title}
                        onChange={(e) => setNewsForm({ ...newsForm, title: e.target.value })}
                        style={{ width: '100%', padding: '10px 14px', borderRadius: '8px', border: '1px solid rgba(15,23,42,0.15)' }}
                      />
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
                      <div>
                        <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, marginBottom: '6px', color: '#64748B' }}>
                          Category
                        </label>
                        <input 
                          type="text" 
                          placeholder="e.g. Engineering & Tech"
                          value={newsForm.category}
                          onChange={(e) => setNewsForm({ ...newsForm, category: e.target.value })}
                          style={{ width: '100%', padding: '10px 14px', borderRadius: '8px', border: '1px solid rgba(15,23,42,0.15)' }}
                        />
                      </div>

                      <div>
                        <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, marginBottom: '6px', color: '#64748B' }}>
                          Publish Date
                        </label>
                        <input 
                          type="text" 
                          placeholder="e.g. August 2026"
                          value={newsForm.date}
                          onChange={(e) => setNewsForm({ ...newsForm, date: e.target.value })}
                          style={{ width: '100%', padding: '10px 14px', borderRadius: '8px', border: '1px solid rgba(15,23,42,0.15)' }}
                        />
                      </div>
                    </div>

                    <div>
                      <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, marginBottom: '6px', color: '#64748B' }}>
                        Flyer / Image URL
                      </label>
                      <input 
                        type="text" 
                        required
                        placeholder="/assets/images/flyer_engineering.png"
                        value={newsForm.image}
                        onChange={(e) => setNewsForm({ ...newsForm, image: e.target.value })}
                        style={{ width: '100%', padding: '10px 14px', borderRadius: '8px', border: '1px solid rgba(15,23,42,0.15)' }}
                      />
                    </div>

                    <div>
                      <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, marginBottom: '6px', color: '#64748B' }}>
                        Short Summary Excerpt
                      </label>
                      <textarea 
                        rows={3}
                        required
                        placeholder="Short teaser shown on homepage news feed..."
                        value={newsForm.excerpt}
                        onChange={(e) => setNewsForm({ ...newsForm, excerpt: e.target.value })}
                        style={{ width: '100%', padding: '10px 14px', borderRadius: '8px', border: '1px solid rgba(15,23,42,0.15)' }}
                      />
                    </div>

                    <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
                      <button type="submit" disabled={actionLoading} className="btn btn-primary" style={{ flex: 1, padding: '12px' }}>
                        {editingNews ? 'Save Changes' : 'Publish Announcement'}
                      </button>
                      <button type="button" onClick={() => setShowNewsModal(false)} className="btn btn-secondary" style={{ padding: '12px 20px', color: '#081F3E' }}>
                        Cancel
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            )}
          </div>
        )}

        {/* ======================================================== */}
        {/* TAB 7: UNIVERSAL SITE SETTINGS */}
        {/* ======================================================== */}
        {activeTab === 'settings' && (
          <div>
            <div className="section-header" style={{ marginBottom: '24px' }}>
              <h2>Universal Website &amp; System Configuration</h2>
              <p className="sub-header">Manage global contact channels, social networks, Google Maps verification, admissions toggle, and email signaling.</p>
            </div>

            <div className="grid-2" style={{ gap: '30px', alignItems: 'flex-start', marginBottom: '36px' }}>
              {/* Site Settings Form */}
              <div className="premium-card" style={{ background: '#FFFFFF', padding: '28px' }}>
                <h3 style={{ color: '#081F3E', marginBottom: '20px', fontSize: '1.2rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Globe size={20} color="#F5A623" />
                  Live Website Global Metadata
                </h3>
                
                <form onSubmit={saveAllSettings} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, marginBottom: '6px', color: '#64748B' }}>
                      Admin Notification Email
                    </label>
                    <input 
                      type="email"
                      required
                      value={settings.admin_email}
                      onChange={(e) => setSettings({ ...settings, admin_email: e.target.value })}
                      style={{ width: '100%', padding: '10px 14px', borderRadius: '8px', border: '1px solid rgba(15,23,42,0.15)' }}
                    />
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, marginBottom: '6px', color: '#64748B' }}>
                      Campus Telephone Lines
                    </label>
                    <input 
                      type="text"
                      value={settings.contact_phone}
                      onChange={(e) => setSettings({ ...settings, contact_phone: e.target.value })}
                      style={{ width: '100%', padding: '10px 14px', borderRadius: '8px', border: '1px solid rgba(15,23,42,0.15)' }}
                    />
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, marginBottom: '6px', color: '#64748B' }}>
                      Campus Address
                    </label>
                    <input 
                      type="text"
                      value={settings.address}
                      onChange={(e) => setSettings({ ...settings, address: e.target.value })}
                      style={{ width: '100%', padding: '10px 14px', borderRadius: '8px', border: '1px solid rgba(15,23,42,0.15)' }}
                    />
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, marginBottom: '6px', color: '#64748B' }}>
                      TikTok Channel URL
                    </label>
                    <input 
                      type="url"
                      value={settings.tiktok_url}
                      onChange={(e) => setSettings({ ...settings, tiktok_url: e.target.value })}
                      style={{ width: '100%', padding: '10px 14px', borderRadius: '8px', border: '1px solid rgba(15,23,42,0.15)' }}
                    />
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, marginBottom: '6px', color: '#64748B' }}>
                      Google Maps Verification Link
                    </label>
                    <input 
                      type="url"
                      value={settings.maps_url}
                      onChange={(e) => setSettings({ ...settings, maps_url: e.target.value })}
                      style={{ width: '100%', padding: '10px 14px', borderRadius: '8px', border: '1px solid rgba(15,23,42,0.15)' }}
                    />
                  </div>

                  <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
                    <button type="submit" disabled={actionLoading} className="btn btn-primary" style={{ padding: '12px 24px' }}>
                      <Save size={15} /> Save All Settings
                    </button>
                    <button 
                      type="button" 
                      onClick={sendTestEmail}
                      disabled={actionLoading}
                      className="btn btn-secondary" 
                      style={{ padding: '12px 20px', color: '#081F3E' }}
                    >
                      <Send size={14} /> Send Test Signal
                    </button>
                  </div>
                </form>
              </div>

              {/* Automation Rules Summary */}
              <div className="premium-card" style={{ background: '#081F3E', color: '#FFFFFF', padding: '28px' }}>
                <span style={{ background: '#F5A623', color: '#081F3E', padding: '3px 8px', borderRadius: '4px', fontSize: '0.75rem', fontWeight: 800, textTransform: 'uppercase' }}>
                  ACTIVE AUTOMATION PIPELINE
                </span>
                <h3 style={{ color: '#FFFFFF', margin: '14px 0 12px 0', fontSize: '1.2rem' }}>
                  Real-time Dual Email Signals
                </h3>
                <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '12px', fontSize: '0.88rem', color: '#CBD5E1' }}>
                  <li style={{ display: 'flex', gap: '8px' }}>
                    <CheckCircle size={16} color="#F5A623" style={{ flexShrink: 0, marginTop: '2px' }} />
                    <span><strong>Applicant on Apply:</strong> Receives application receipt, reference ID, and next steps.</span>
                  </li>
                  <li style={{ display: 'flex', gap: '8px' }}>
                    <CheckCircle size={16} color="#F5A623" style={{ flexShrink: 0, marginTop: '2px' }} />
                    <span><strong>Admin on Apply:</strong> Receives applicant dossier alert with direct link to approve.</span>
                  </li>
                  <li style={{ display: 'flex', gap: '8px' }}>
                    <CheckCircle size={16} color="#F5A623" style={{ flexShrink: 0, marginTop: '2px' }} />
                    <span><strong>On Status Update:</strong> Applicant receives formal acceptance or status change notification.</span>
                  </li>
                  <li style={{ display: 'flex', gap: '8px' }}>
                    <CheckCircle size={16} color="#F5A623" style={{ flexShrink: 0, marginTop: '2px' }} />
                    <span><strong>Direct Inquiries:</strong> Dispatches confirmation to sender and immediate alert to admin.</span>
                  </li>
                </ul>
              </div>
            </div>

            {/* Database Engine & Health Diagnostics Panel */}
            <div className="premium-card" style={{ background: '#FFFFFF', padding: '28px', marginBottom: '36px', border: '1px solid rgba(15,23,42,0.08)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px', marginBottom: '20px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <div style={{ width: '40px', height: '40px', borderRadius: '8px', background: 'rgba(8,31,62,0.06)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Database size={22} color="#081F3E" />
                  </div>
                  <div>
                    <h3 style={{ color: '#081F3E', margin: 0, fontSize: '1.25rem', fontWeight: 800 }}>
                      Database Storage Engine &amp; Health Center
                    </h3>
                    <p style={{ margin: 0, color: '#64748B', fontSize: '0.84rem' }}>
                      {dbHealth?.engine || 'High-Performance Liah JSON/SQL Storage Engine v2.1.0'} &bull; Atomic Zero-Corruption Writes
                    </p>
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', background: '#ECFDF5', color: '#059669', padding: '6px 12px', borderRadius: '20px', fontSize: '0.8rem', fontWeight: 700 }}>
                    <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#10B981' }}></span>
                    {dbHealth?.status || 'HEALTHY (100% OK)'}
                  </span>

                  <button
                    onClick={triggerDatabaseBackup}
                    disabled={actionLoading}
                    className="btn btn-secondary"
                    style={{ padding: '8px 16px', fontSize: '0.82rem', color: '#081F3E', borderColor: 'rgba(15,23,42,0.2)' }}
                    title="Create instant backup snapshot in data/backups/"
                  >
                    <HardDrive size={14} /> Create Snapshot Backup
                  </button>
                </div>
              </div>

              {/* Database Metrics Grid */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: '14px', background: '#F8FAFC', padding: '18px', borderRadius: '10px', border: '1px solid #E2E8F0' }}>
                <div>
                  <span style={{ fontSize: '0.75rem', color: '#64748B', display: 'block', textTransform: 'uppercase', fontWeight: 700 }}>Database Size</span>
                  <strong style={{ color: '#081F3E', fontSize: '1.1rem' }}>{dbHealth?.database_size_kb || '45 KB'}</strong>
                </div>
                <div>
                  <span style={{ fontSize: '0.75rem', color: '#64748B', display: 'block', textTransform: 'uppercase', fontWeight: 700 }}>Total Writes (Atomic)</span>
                  <strong style={{ color: '#081F3E', fontSize: '1.1rem' }}>{dbHealth?.total_writes || 'Active'}</strong>
                </div>
                <div>
                  <span style={{ fontSize: '0.75rem', color: '#64748B', display: 'block', textTransform: 'uppercase', fontWeight: 700 }}>Snapshot Backups</span>
                  <strong style={{ color: '#081F3E', fontSize: '1.1rem' }}>{dbHealth?.backups_count || 1} Snapshots</strong>
                </div>
                <div>
                  <span style={{ fontSize: '0.75rem', color: '#64748B', display: 'block', textTransform: 'uppercase', fontWeight: 700 }}>Students Registered</span>
                  <strong style={{ color: '#081F3E', fontSize: '1.1rem' }}>{dbHealth?.metrics?.students || applications.length}</strong>
                </div>
                <div>
                  <span style={{ fontSize: '0.75rem', color: '#64748B', display: 'block', textTransform: 'uppercase', fontWeight: 700 }}>Active Courses</span>
                  <strong style={{ color: '#081F3E', fontSize: '1.1rem' }}>{dbHealth?.metrics?.courses || courses.length}</strong>
                </div>
                <div>
                  <span style={{ fontSize: '0.75rem', color: '#64748B', display: 'block', textTransform: 'uppercase', fontWeight: 700 }}>News / Flyers</span>
                  <strong style={{ color: '#081F3E', fontSize: '1.1rem' }}>{dbHealth?.metrics?.news || news.length}</strong>
                </div>
              </div>
            </div>

            {/* Outbox Event Log Stream */}
            <div className="premium-card" style={{ background: '#FFFFFF', padding: '28px' }}>
              <h3 style={{ color: '#081F3E', marginBottom: '16px', fontSize: '1.2rem' }}>
                Live Email Outbox &amp; Transmission Log ({emailLogs.length} Records)
              </h3>

              {emailLogs.length === 0 ? (
                <p style={{ color: '#94A3B8' }}>No email signals logged yet. Submit an application or inquiry to test.</p>
              ) : (
                <div style={{ overflowX: 'auto' }}>
                  <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.88rem' }}>
                    <thead>
                      <tr style={{ background: '#F8FAFC', borderBottom: '1px solid #E2E8F0', color: '#64748B', fontSize: '0.75rem', textTransform: 'uppercase' }}>
                        <th style={{ padding: '12px 16px' }}>Timestamp</th>
                        <th style={{ padding: '12px 16px' }}>Recipient &amp; Type</th>
                        <th style={{ padding: '12px 16px' }}>Subject</th>
                        <th style={{ padding: '12px 16px' }}>Event Type</th>
                        <th style={{ padding: '12px 16px' }}>Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {emailLogs.map((log) => (
                        <tr key={log.id} style={{ borderBottom: '1px solid #F1F5F9' }}>
                          <td style={{ padding: '12px 16px', fontSize: '0.8rem', color: '#64748B' }}>
                            {new Date(log.created_at).toLocaleString()}
                          </td>
                          <td style={{ padding: '12px 16px' }}>
                            <strong>{log.recipient}</strong>
                            <span style={{ marginLeft: '6px', fontSize: '0.72rem', background: '#F1F5F9', padding: '2px 6px', borderRadius: '4px', color: '#64748B' }}>
                              {log.recipient_type}
                            </span>
                          </td>
                          <td style={{ padding: '12px 16px', color: '#081F3E', fontWeight: 600 }}>
                            {log.subject}
                          </td>
                          <td style={{ padding: '12px 16px' }}>
                            <span style={{ fontSize: '0.75rem', background: '#FEF3C7', color: '#B45309', padding: '2px 6px', borderRadius: '4px', fontWeight: 700 }}>
                              {log.type}
                            </span>
                          </td>
                          <td style={{ padding: '12px 16px' }}>
                            <span style={{ fontSize: '0.75rem', color: log.status === 'sent' ? '#059669' : '#0284C7', fontWeight: 700 }}>
                              ● {log.status.toUpperCase()}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        )}

      </div>
    </main>
  );
}
