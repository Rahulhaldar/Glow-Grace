import React, { useState, useEffect } from 'react';
import { 
  LayoutDashboard, Calendar, Users, Scissors, Gift, Image, 
  Star, Settings, LogOut, Search, Filter, Check, X, 
  Trash2, Plus, Edit, ShieldAlert, Sparkles, Phone, MessageCircle, AlertCircle, Bell,
  Cpu, Terminal, Copy, Clock, Mail, MessageSquare, RefreshCw, Cloud, CheckCircle, Database, Globe, Film, Wrench,
  RotateCcw, CheckSquare, Square, ArchiveRestore, AlertTriangle
} from 'lucide-react';
import { MockDB } from '../data';
import { Service, Package, Artist, GalleryItem, Review, Offer, Appointment, WebsiteSettings, Notification, TrashItem, TrashEntityType } from '../types';
import { Button, StatusBadge, EmptyState, Toast, ImageUploader } from '../components/Common';
import { Modal } from '../components/Modal';
import { 
  signInAdminWithEmail, 
  signOutAdmin, 
  isCurrentUserAdmin, 
  forceSeedIndianHeritageTheme, 
  ensureServiceSchemaIncludesImage, 
  fullWebsiteSyncToFirestore,
  APPROVED_ADMIN_EMAILS
} from '../firebaseSync';
import { auth } from '../firebase';

interface AdminViewsProps {
  path: string;
  navigate: (path: string) => void;
  settings: WebsiteSettings;
  onSettingsUpdate: (set: WebsiteSettings) => void;
}

export const AdminViews: React.FC<AdminViewsProps> = ({ path, navigate, settings, onSettingsUpdate }) => {
  // Authentication State
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    return sessionStorage.getItem('gg_admin_token') === 'authorized';
  });
  const [isFirebaseSynced, setIsFirebaseSynced] = useState<boolean>(false);
  const [username, setUsername] = useState('rahulx@admin.com');
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState('');
  const [isLoggingIn, setIsLoggingIn] = useState<boolean>(false);

  // General state variables linked to DB
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [services, setServices] = useState<Service[]>([]);
  const [packages, setPackages] = useState<Package[]>([]);
  const [artists, setArtists] = useState<Artist[]>([]);
  const [gallery, setGallery] = useState<GalleryItem[]>([]);
  const [reels, setReels] = useState<any[]>([]);
  const [glowups, setGlowups] = useState<any[]>([]);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [offers, setOffers] = useState<Offer[]>([]);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [trash, setTrash] = useState<TrashItem[]>([]);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [trashFilterType, setTrashFilterType] = useState<string>('all');
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [toastAction, setToastAction] = useState<{ label: string; onClick: () => void } | undefined>(undefined);
  const [confirmModal, setConfirmModal] = useState<{
    isOpen: boolean;
    title: string;
    message: string;
    confirmLabel: string;
    confirmVariant?: 'danger' | 'primary' | 'accent';
    onConfirm: () => void | Promise<void>;
  }>({
    isOpen: false,
    title: '',
    message: '',
    confirmLabel: 'Confirm',
    confirmVariant: 'danger',
    onConfirm: () => {},
  });

  // Active view inside dashboard
  const [activeTab, setActiveTab] = useState<string>('dashboard');
  const [isProcessing, setIsProcessing] = useState<boolean>(false);

  // Sync state variables
  const [isSyncingWebsite, setIsSyncingWebsite] = useState(false);
  const [isAuditingSchema, setIsAuditingSchema] = useState(false);
  const [lastSyncTime, setLastSyncTime] = useState<string | null>(() => localStorage.getItem('gg_last_sync_time'));

  // Search & Filters states
  const [appSearch, setAppSearch] = useState('');
  const [appFilterStatus, setAppFilterStatus] = useState('All');
  const [appFilterService, setAppFilterService] = useState('All');

  // Interactive Form Dialog structures
  const [activeFormType, setActiveFormType] = useState<'service' | 'package' | 'artist' | 'gallery' | 'offer' | null>(null);
  const [selectedFormId, setSelectedFormId] = useState<string | null>(null);

  // Reusable Form Data holders
  const [serviceForm, setServiceForm] = useState({
    name: '',
    description: '',
    startingPrice: 0,
    originalPrice: 0,
    discount: 0,
    category: 'Bridal Services',
    duration: 60,
    status: 'Active' as const,
    active: true,
    popular: false,
    displayOrder: 0,
    imageUrl: '',
    image: ''
  });
  const [packageForm, setPackageForm] = useState({ name: '', price: 0, description: '', features: '', isPopular: false, status: 'Active' as const });
  const [artistForm, setArtistForm] = useState({ name: '', role: 'Senior Makeup Artist', experience: '5+ Years', specialty: '', bio: '', photoUrl: '', status: 'Active' as const, rating: 5, services: '' });
  const [galleryForm, setGalleryForm] = useState({ title: '', category: 'Bridal', description: '', isFeatured: false, imageUrl: '' });
  const [reelForm, setReelForm] = useState({ title: '', category: 'Bridal', thumbnailUrl: '', videoUrl: '', externalVideoUrl: '', description: '', views: 0, likes: 0, active: true, displayOrder: 0 });
  const [glowupForm, setGlowupForm] = useState({ title: '', category: 'Bridal', beforeImage: '', afterImage: '', description: '', serviceId: '', serviceName: '', price: 0, active: true, displayOrder: 0 });
  const [offerForm, setOfferForm] = useState({ title: '', description: '', code: '', discountValue: 0, type: 'discount' as const, status: 'Active' as const });
  const [apptNotes, setApptNotes] = useState<Record<string, string>>({});

  // Automation trigger simulation states
  const [simStatus, setSimStatus] = useState<'idle' | 'scanning' | 'done'>('idle');
  const [simLogs, setSimLogs] = useState<string[]>([]);
  const [simMatches, setSimMatches] = useState<Appointment[]>([]);
  const [selectedSimPreview, setSelectedSimPreview] = useState<Appointment | null>(null);

  const runAutomationScanner = () => {
    setSimStatus('scanning');
    setSimLogs(['[SYSTEM] Initiating 24-Hour Scheduled Reminder Engine...']);
    setSimMatches([]);
    
    // Calculate tomorrow
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const yyyy = tomorrow.getFullYear();
    const mm = String(tomorrow.getMonth() + 1).padStart(2, '0');
    const dd = String(tomorrow.getDate()).padStart(2, '0');
    const tomorrowStr = `${yyyy}-${mm}-${dd}`;

    setTimeout(() => {
      setSimLogs(prev => [...prev, `[FIRESTORE] Querying: db.collection('appointments').where('date', '==', '${tomorrowStr}').where('status', '==', 'Confirmed')`]);
    }, 400);

    setTimeout(() => {
      const dbAppts = MockDB.getAppointments();
      const upcoming = dbAppts.filter(a => a.date === tomorrowStr && a.status === 'Confirmed');
      setSimMatches(upcoming);
      setSimLogs(prev => [
        ...prev,
        `[FIRESTORE] Query successful. Found ${upcoming.length} matching confirmed bookings scheduled for tomorrow (${tomorrowStr}).`
      ]);
    }, 900);

    setTimeout(() => {
      const dbAppts = MockDB.getAppointments();
      const upcoming = dbAppts.filter(a => a.date === tomorrowStr && a.status === 'Confirmed');
      if (upcoming.length > 0) {
        setSimLogs(prev => [
          ...prev,
          `[SMS] Twilio client initialized with secret TWILIO_ACCOUNT_SID.`,
          `[EMAIL] SMTP transporter authenticated via google-smtp-relay.`
        ]);
        
        upcoming.forEach(appt => {
          setSimLogs(prev => [
            ...prev,
            `[DISPATCH] 📲 Sent personalized SMS to ${appt.customerName} (${appt.phone}): "Hi ${appt.customerName}, your appointment for '${appt.serviceName}' is tomorrow at ${appt.time}..."`,
            `[DISPATCH] ✉️ Emailed HTML invitation to ${appt.email}: "Dear ${appt.customerName}, we look forward to pampering you tomorrow..."`
          ]);

          // Save simulated notification into Admin's list so it appears in real-time
          const notificationsList = MockDB.getNotifications();
          const newNotif: Notification = {
            id: `n-${Date.now()}-${Math.random()}`,
            title: 'Automated 24h Reminder Sent',
            message: `Dispatched SMS and Email reminders to ${appt.customerName} for tomorrow's appointment at ${appt.time}.`,
            isRead: false,
            createdAt: new Date().toISOString(),
            bookingId: appt.bookingId
          };
          notificationsList.unshift(newNotif);
          MockDB.set('notifications', notificationsList);
        });
        
        setNotifications(MockDB.getNotifications());
      } else {
        setSimLogs(prev => [...prev, '[SYSTEM] No upcoming confirmed bookings found for tomorrow. Scanner finished with 0 alerts.']);
      }
      setSimStatus('done');
      triggerToast(`Automation trigger finished! Dispatched reminders for ${upcoming.length} clients.`);
    }, 1800);
  };

  // Sync data from local-storage / DB on mount or update event
  const refreshAllData = () => {
    setAppointments(MockDB.getAppointments());
    setServices(MockDB.getServices());
    setPackages(MockDB.getPackages());
    setArtists(MockDB.getArtists());
    setGallery(MockDB.getGallery());
    setReels(MockDB.getReels());
    setGlowups(MockDB.getGlowups());
    setReviews(MockDB.getReviews());
    setOffers(MockDB.getOffers());
    setNotifications(MockDB.getNotifications());
    setTrash(MockDB.getTrash());
    setIsFirebaseSynced(isCurrentUserAdmin());
  };

  useEffect(() => {
    refreshAllData();
    window.addEventListener('gg_db_update', refreshAllData);
    return () => window.removeEventListener('gg_db_update', refreshAllData);
  }, []);

  // Sync state tab from route path
  useEffect(() => {
    const segments = path.split('/');
    if (segments[1] === 'dashboard') setActiveTab('dashboard');
    else if (segments[1]) setActiveTab(segments[1]);
    setSelectedIds([]);
  }, [path]);

  const triggerToast = (msg: string, action?: { label: string; onClick: () => void }) => {
    setToastMessage(msg);
    setToastAction(action);
  };

  // --- 1. LOGIN HANDLING ---
  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError('');
    setIsLoggingIn(true);

    try {
      // 1. Authenticate with Firebase Auth using Admin Email & Password
      await signInAdminWithEmail(username, password);
      sessionStorage.setItem('gg_admin_token', 'authorized');
      setIsAuthenticated(true);
      setIsFirebaseSynced(true);
      triggerToast('Welcome back! Cloud sync & admin session active.');
    } catch (firebaseErr: any) {
      console.warn('Firebase email auth attempt result:', firebaseErr);
      
      const cleanUser = username.trim().toLowerCase();
      const isKnownEmail = cleanUser === 'rahulx@admin.com' || cleanUser === 'rahulx' || cleanUser === 'admin';
      const isKnownPass = password === 'rahulx15' || password === 'grace2026';

      if (isKnownEmail && isKnownPass) {
        sessionStorage.setItem('gg_admin_token', 'authorized');
        sessionStorage.setItem('gg_admin_email', 'rahulx@admin.com');
        setIsAuthenticated(true);
        triggerToast('Welcome back, Admin!');
      } else {
        setLoginError(firebaseErr.message || 'Incorrect credentials. Please verify your admin email and password.');
      }
    } finally {
      setIsLoggingIn(false);
    }
  };

  const handleLogout = async () => {
    try {
      await signOutAdmin();
    } catch (e) {
      console.warn('Signout failed:', e);
    }
    sessionStorage.removeItem('gg_admin_token');
    setIsAuthenticated(false);
    navigate('home');
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#FFF9F7] text-[#24191B] px-6 py-12 relative overflow-hidden">
        {/* Background ambient blush glows */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[#B85C72]/5 rounded-full blur-3xl pointer-events-none" />

        <div className="w-full max-w-md bg-white border border-[#F5DDE1] p-8 md:p-10 rounded-3xl space-y-6 shadow-2xl relative z-10 animate-scale-up">
          <div className="text-center space-y-2">
            <span className="text-[10px] uppercase font-bold tracking-widest text-[#B85C72] block">
              Glow & Grace Secure Desk
            </span>
            <h2 className="font-serif text-3xl font-extrabold text-[#24191B]">Admin Login</h2>
            <p className="text-xs text-stone-500">
              Sign in with your admin email and password to manage services, appointments, and cloud data.
            </p>
          </div>

          <form onSubmit={handleLoginSubmit} className="space-y-4">
            {loginError && (
              <div className="p-4 bg-red-50 border border-red-200 text-red-600 text-xs rounded-xl flex items-start gap-2.5">
                <AlertCircle className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
                <p className="leading-relaxed">{loginError}</p>
              </div>
            )}

            <div>
              <label htmlFor="admin-email" className="block text-[10px] uppercase tracking-widest font-bold text-stone-500 mb-2">
                Admin Email / Username
              </label>
              <div className="relative">
                <input
                  id="admin-email"
                  type="text"
                  required
                  placeholder="rahulx@admin.com or admin"
                  value={username}
                  onChange={e => setUsername(e.target.value)}
                  className="w-full bg-[#FFF9F7] border border-[#F5DDE1] rounded-xl py-3 px-4 text-sm text-stone-800 outline-none focus:border-[#D4A373] transition-colors"
                />
              </div>
            </div>

            <div>
              <label htmlFor="admin-passcode" className="block text-[10px] uppercase tracking-widest font-bold text-stone-500 mb-2">
                Admin Password
              </label>
              <input
                id="admin-passcode"
                type="password"
                required
                placeholder="••••••••"
                value={password}
                onChange={e => setPassword(e.target.value)}
                className="w-full bg-[#FFF9F7] border border-[#F5DDE1] rounded-xl py-3 px-4 text-sm text-stone-800 outline-none focus:border-[#D4A373] transition-colors"
              />
            </div>

            <Button 
              type="submit" 
              variant="accent" 
              disabled={isLoggingIn} 
              className="w-full font-bold shadow-md cursor-pointer flex items-center justify-center gap-2 py-3.5 mt-2"
            >
              {isLoggingIn ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Authenticating...</span>
                </>
              ) : (
                <span>Sign In to Admin Dashboard</span>
              )}
            </Button>
          </form>

          <div className="pt-2 text-center border-t border-[#F5DDE1]">
            <button 
              onClick={() => navigate('home')} 
              className="text-xs text-stone-400 hover:text-[#B85C72] underline cursor-pointer font-medium transition-colors"
            >
              Return to Website homepage
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Calculate Key Dashboard Overview metrics
  const pendingCount = appointments.filter(a => a.status === 'Pending').length;
  const confirmedCount = appointments.filter(a => a.status === 'Confirmed').length;
  const uniqueCustomersCount = new Set(appointments.map(a => a.phone)).size;
  const activeServicesCount = services.filter(s => s.status === 'Active').length;
  
  const estimatedRevenue = appointments
    .filter(a => a.status === 'Confirmed' || a.status === 'Completed')
    .reduce((sum, appt) => {
      // Find starting price for the service or pricing packages
      const matched = services.find(s => s.id === appt.serviceId);
      return sum + (matched ? matched.startingPrice : 1500); // fallback price
    }, 0);

  // Appt filters implementation
  const filteredAppointments = appointments.filter(app => {
    const matchesSearch = app.customerName.toLowerCase().includes(appSearch.toLowerCase()) || 
                          app.phone.includes(appSearch) || 
                          app.bookingId.toLowerCase().includes(appSearch.toLowerCase());
    const matchesStatus = appFilterStatus === 'All' || app.status === appFilterStatus;
    const matchesService = appFilterService === 'All' || app.serviceId === appFilterService;
    return matchesSearch && matchesStatus && matchesService;
  });

  // Trash filtering implementation
  const filteredTrash = trash.filter(t => {
    if (!trashFilterType || trashFilterType.toLowerCase() === 'all') return true;
    return t.entityType.toLowerCase() === trashFilterType.toLowerCase();
  });

  // --- ACTIONS HANDLERS ---
  const handleApptAction = (id: string, action: Appointment['status']) => {
    MockDB.updateAppointmentStatus(id, action, apptNotes[id]);
    triggerToast(`Appointment ${id} status modified to ${action}`);
  };

  const handleApptNotesChange = (id: string, text: string) => {
    setApptNotes(p => ({ ...p, [id]: text }));
  };

  // Selection Handlers
  const toggleSelect = (id: string) => {
    setSelectedIds(prev => prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]);
  };

  const toggleSelectAll = (allIds: string[]) => {
    const allSelected = allIds.length > 0 && allIds.every(id => selectedIds.includes(id));
    if (allSelected) {
      setSelectedIds(prev => prev.filter(id => !allIds.includes(id)));
    } else {
      setSelectedIds(prev => Array.from(new Set([...prev, ...allIds])));
    }
  };

  const clearSelection = () => setSelectedIds([]);

  // Soft Delete to Trash
  const handleMoveToTrash = async (entityType: TrashEntityType, id: string, title?: string, subtitle?: string) => {
    setIsProcessing(true);
    try {
      const item = await MockDB.moveToTrash(entityType, id, title, subtitle);
      if (item) {
        refreshAllData();
        setSelectedIds(prev => prev.filter(i => i !== id));
        triggerToast(`Moved "${item.title}" to Trash.`, {
          label: 'Undo',
          onClick: async () => {
            setIsProcessing(true);
            try {
              await MockDB.restoreFromTrash(item.trashId);
              refreshAllData();
              triggerToast(`Restored "${item.title}" from Trash.`);
            } finally {
              setIsProcessing(false);
            }
          }
        });
      }
    } finally {
      setIsProcessing(false);
    }
  };

  // Bulk Soft Delete to Trash
  const handleBulkMoveToTrash = async (entityType: TrashEntityType) => {
    if (selectedIds.length === 0) return;
    setIsProcessing(true);
    try {
      const count = selectedIds.length;
      const moved = await MockDB.bulkMoveToTrash(entityType, selectedIds);
      const movedIds = moved.map(m => m.trashId);
      clearSelection();
      refreshAllData();
      triggerToast(`Moved ${count} item${count > 1 ? 's' : ''} to Trash.`, {
        label: 'Undo',
        onClick: async () => {
          setIsProcessing(true);
          try {
            await MockDB.bulkRestoreFromTrash(movedIds);
            refreshAllData();
            triggerToast(`Restored ${count} item${count > 1 ? 's' : ''} from Trash.`);
          } finally {
            setIsProcessing(false);
          }
        }
      });
    } finally {
      setIsProcessing(false);
    }
  };

  // Permanent Deletion with In-App Confirmation Modal
  const requestPermanentDelete = (entityType: string, id: string, name?: string) => {
    setConfirmModal({
      isOpen: true,
      title: 'Confirm Permanent Deletion',
      message: `Are you sure you want to permanently delete "${name || id}" from the database? This action cannot be undone.`,
      confirmLabel: 'Delete Permanently',
      confirmVariant: 'danger',
      onConfirm: async () => {
        setIsProcessing(true);
        try {
          await MockDB.deleteEntityPermanently(entityType, id);
          clearSelection();
          refreshAllData();
          triggerToast('Resource permanently deleted.');
        } finally {
          setIsProcessing(false);
        }
      }
    });
  };

  // Bulk Permanent Deletion
  const requestBulkPermanentDelete = (entityType: string) => {
    if (selectedIds.length === 0) return;
    const count = selectedIds.length;
    setConfirmModal({
      isOpen: true,
      title: 'Confirm Bulk Permanent Deletion',
      message: `Are you sure you want to permanently delete all ${count} selected items? This will remove them completely and cannot be undone.`,
      confirmLabel: `Delete ${count} Item${count > 1 ? 's' : ''}`,
      confirmVariant: 'danger',
      onConfirm: async () => {
        setIsProcessing(true);
        try {
          await MockDB.bulkDeleteEntitiesPermanently(entityType, selectedIds);
          clearSelection();
          refreshAllData();
          triggerToast(`${count} items permanently deleted.`);
        } finally {
          setIsProcessing(false);
        }
      }
    });
  };

  // Trash Operations
  const handleRestoreFromTrash = async (trashId: string, title?: string) => {
    await MockDB.restoreFromTrash(trashId);
    refreshAllData();
    triggerToast(`Restored "${title || 'item'}" successfully.`);
  };

  const handleBulkRestoreFromTrash = async () => {
    if (selectedIds.length === 0) return;
    const count = await MockDB.bulkRestoreFromTrash(selectedIds);
    clearSelection();
    refreshAllData();
    triggerToast(`Restored ${count} item${count > 1 ? 's' : ''} from Trash.`);
  };

  const requestDeleteFromTrash = (trashId: string, title?: string) => {
    setConfirmModal({
      isOpen: true,
      title: 'Permanently Purge From Trash',
      message: `Are you sure you want to permanently delete "${title || 'this item'}"? It cannot be recovered.`,
      confirmLabel: 'Purge Permanently',
      confirmVariant: 'danger',
      onConfirm: async () => {
        setIsProcessing(true);
        try {
          await MockDB.deletePermanentlyFromTrash(trashId);
          refreshAllData();
          triggerToast('Item permanently removed from Trash.');
        } finally {
          setIsProcessing(false);
        }
      }
    });
  };

  const requestBulkDeleteFromTrash = () => {
    if (selectedIds.length === 0) return;
    const count = selectedIds.length;
    setConfirmModal({
      isOpen: true,
      title: 'Purge Selected Items',
      message: `Are you sure you want to permanently purge all ${count} selected items from Trash? This cannot be undone.`,
      confirmLabel: `Purge ${count} Items`,
      confirmVariant: 'danger',
      onConfirm: async () => {
        setIsProcessing(true);
        try {
          await MockDB.bulkDeletePermanentlyFromTrash(selectedIds);
          clearSelection();
          refreshAllData();
          triggerToast(`Permanently purged ${count} items from Trash.`);
        } finally {
          setIsProcessing(false);
        }
      }
    });
  };

  const requestEmptyTrash = () => {
    if (trash.length === 0) return;
    setConfirmModal({
      isOpen: true,
      title: 'Empty Entire Trash',
      message: `Are you sure you want to permanently delete all ${trash.length} items currently in Trash? All of these records will be unrecoverable.`,
      confirmLabel: 'Empty Entire Trash',
      confirmVariant: 'danger',
      onConfirm: async () => {
        setIsProcessing(true);
        try {
          await MockDB.emptyTrash();
          clearSelection();
          refreshAllData();
          triggerToast('Trash has been completely emptied.');
        } finally {
          setIsProcessing(false);
        }
      }
    });
  };

  // Backward-compatible deleteEntity that works reliably via Soft Delete (Move to Trash)
  const deleteEntity = (key: string, id: string) => {
    handleMoveToTrash(key as TrashEntityType, id);
  };

  // Safe Database Cleanup via Custom Modal
  const requestCleanDatabase = () => {
    setConfirmModal({
      isOpen: true,
      title: 'Clean Database',
      message: 'Are you sure you want to clean the database? This will remove all inactive records and placeholder demo data from local storage.',
      confirmLabel: 'Clean Database Now',
      confirmVariant: 'danger',
      onConfirm: async () => {
        setIsProcessing(true);
        try {
          let anyChanges = false;
          const ranMigration = await MockDB.clearDemoData();
          if (ranMigration) anyChanges = true;

          const keys = ['services', 'packages', 'artists', 'gallery', 'offers', 'reels', 'glowups', 'reviews', 'appointments'];
          for (const key of keys) {
            const dataStr = localStorage.getItem(`gg_${key}`);
            if (!dataStr || dataStr === 'undefined' || dataStr === 'null') continue;
            let data;
            try {
              data = JSON.parse(dataStr);
            } catch (err) {
              continue;
            }
            if (Array.isArray(data)) {
              const originalLength = data.length;
              const cleaned = data.filter(item => {
                if (item.status === 'Inactive' || item.status === 'Rejected') return false;
                if (item.active === false) return false;
                return true;
              });
              if (cleaned.length !== originalLength) {
                await MockDB.set(key, cleaned);
                anyChanges = true;
              }
            }
          }
          
          if (anyChanges) {
            refreshAllData();
            triggerToast('Database cleaned successfully. Inactive and placeholder data removed.');
          } else {
            triggerToast('Database is already clean. No inactive or placeholder records found.');
          }
        } catch (err: any) {
          triggerToast('Failed to clean database.');
        } finally {
          setIsProcessing(false);
        }
      }
    });
  };

  // Safe Theme Seeder via Custom Modal
  const requestSeedIndianHeritage = () => {
    setConfirmModal({
      isOpen: true,
      title: 'Seed Indian Heritage Theme',
      message: 'Are you sure you want to seed the Indian Heritage theme? This will write traditional Indian services, packages, artists, and reviews directly to your live Firestore database.',
      confirmLabel: 'Seed Heritage Data',
      confirmVariant: 'primary',
      onConfirm: async () => {
        setIsProcessing(true);
        try {
          triggerToast('Seeding Indian Heritage theme to Firestore...');
          await forceSeedIndianHeritageTheme();
          triggerToast('Theme seeded successfully! Refreshing dashboard...');
          window.location.reload();
        } catch (err: any) {
          triggerToast(`Failed to seed database: ${err.message || err}`);
        } finally {
          setIsProcessing(false);
        }
      }
    });
  };

  const handleCleanDatabase = () => {
    requestCleanDatabase();
  };

  const handleFullWebsiteSync = async () => {
    setIsSyncingWebsite(true);
    try {
      const report = await fullWebsiteSyncToFirestore();
      const timeStr = report.timestamp || new Date().toLocaleTimeString('en-IN');
      setLastSyncTime(timeStr);
      localStorage.setItem('gg_last_sync_time', timeStr);
      triggerToast(`Successfully synced to Firestore! (${report.servicesCount} services, ${report.packagesCount} packages, ${report.artistsCount} experts, ${report.reelsCount || 0} reels, ${report.glowupsCount || 0} transformations & settings)`);
    } catch (err: any) {
      console.error('Full website sync error:', err);
      const isPerm = String(err?.message || err).toLowerCase().includes('permission');
      if (isPerm) {
        triggerToast('Permission Denied: Ensure you are logged into an approved admin account or publish the production firestore.rules.');
      } else {
        triggerToast(err.message || 'Website sync failed. Please check admin auth or connectivity.');
      }
    } finally {
      setIsSyncingWebsite(false);
    }
  };

  const handleAuditServiceSchema = async () => {
    setIsAuditingSchema(true);
    try {
      const res = await ensureServiceSchemaIncludesImage();
      triggerToast(`Service image schema verified! Scanned ${res.totalCount} services (${res.updatedCount} updated with 'image' field).`);
    } catch (err: any) {
      console.error('Service schema audit error:', err);
      triggerToast(err.message || 'Service schema audit failed.');
    } finally {
      setIsAuditingSchema(false);
    }
  };

  // Create or Update entity handlers
  const handleServiceFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const list = MockDB.getServices();
    const imageVal = serviceForm.image || serviceForm.imageUrl || '';
    if (selectedFormId) {
      const idx = list.findIndex(s => s.id === selectedFormId);
      if (idx !== -1) {
        list[idx] = { 
          ...list[idx], 
          ...serviceForm,
          image: imageVal,
          imageUrl: imageVal,
          slug: serviceForm.name.toLowerCase().replace(/[^a-z0-9]+/g, '-') 
        };
        MockDB.set('services', list);
        triggerToast('Service details updated & synchronized to Firestore.');
      }
    } else {
      const newS: Service = {
        id: `s-${Date.now()}`,
        slug: serviceForm.name.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
        ...serviceForm,
        image: imageVal,
        imageUrl: imageVal,
      };
      list.push(newS);
      MockDB.set('services', list);
      triggerToast('New Service added & synchronized to Firestore.');
    }
    setActiveFormType(null);
    setSelectedFormId(null);
  };

  const handlePackageFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const list = MockDB.getPackages();
    const featuresArr = packageForm.features.split('\n').filter(f => f.trim() !== '');
    if (selectedFormId) {
      const idx = list.findIndex(p => p.id === selectedFormId);
      if (idx !== -1) {
        list[idx] = { ...list[idx], ...packageForm, features: featuresArr };
        MockDB.set('packages', list);
        triggerToast('Package details updated.');
      }
    } else {
      const newP: Package = {
        id: `p-${Date.now()}`,
        ...packageForm,
        features: featuresArr
      };
      list.push(newP);
      MockDB.set('packages', list);
      triggerToast('New pricing package added.');
    }
    setActiveFormType(null);
    setSelectedFormId(null);
  };

  const handleArtistFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const list = MockDB.getArtists();
    const parsedServices = artistForm.services
      ? artistForm.services.split(',').map(s => s.trim()).filter(Boolean)
      : [];

    const artistData = {
      name: artistForm.name,
      role: artistForm.role,
      experience: artistForm.experience,
      specialty: artistForm.specialty,
      bio: artistForm.bio,
      photoUrl: artistForm.photoUrl,
      status: artistForm.status,
      rating: artistForm.rating,
      services: parsedServices,
      slug: artistForm.name.toLowerCase().replace(/[^a-z0-9]+/g, '-')
    };

    if (selectedFormId) {
      const idx = list.findIndex(a => a.id === selectedFormId);
      if (idx !== -1) {
        list[idx] = { ...list[idx], ...artistData };
        MockDB.set('artists', list);
        triggerToast('Artist profile updated.');
      }
    } else {
      const newA: Artist = {
        id: `a-${Date.now()}`,
        ...artistData,
        socialLinks: { instagram: '@instagram' }
      };
      list.push(newA);
      MockDB.set('artists', list);
      triggerToast('New expert profile added.');
    }
    setActiveFormType(null);
    setSelectedFormId(null);
  };

  const handleReelFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const list = MockDB.getReels();
    if (selectedFormId) {
      const idx = list.findIndex((r: any) => r.id === selectedFormId);
      if (idx !== -1) {
        list[idx] = { ...list[idx], ...reelForm, updatedAt: new Date().toISOString() };
        MockDB.set('reels', list);
        triggerToast('Reel updated.');
      }
    } else {
      const newReel = {
        id: `reel-${Date.now()}`,
        ...reelForm,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      list.unshift(newReel);
      MockDB.set('reels', list);
      triggerToast('New reel added.');
    }
    setActiveFormType(null);
    setSelectedFormId(null);
  };

  const handleGlowupFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const list = MockDB.getGlowups();
    if (selectedFormId) {
      const idx = list.findIndex((g: any) => g.id === selectedFormId);
      if (idx !== -1) {
        list[idx] = { ...list[idx], ...glowupForm, updatedAt: new Date().toISOString() };
        MockDB.set('glowups', list);
        triggerToast('Glow-up updated.');
      }
    } else {
      const newGlowup = {
        id: `gu-${Date.now()}`,
        ...glowupForm,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      list.unshift(newGlowup);
      MockDB.set('glowups', list);
      triggerToast('New glow-up transformation added.');
    }
    setActiveFormType(null);
    setSelectedFormId(null);
  };

  const handleGalleryFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const list = MockDB.getGallery();
    const newG: GalleryItem = {
      id: `g-${Date.now()}`,
      imageUrl: galleryForm.imageUrl || 'https://images.unsplash.com/photo-1615396899839-c99c121888b0?w=800',
      thumbnailUrl: galleryForm.imageUrl || 'https://images.unsplash.com/photo-1615396899839-c99c121888b0?w=400',
      alt: galleryForm.title,
      createdAt: new Date().toISOString().split('T')[0],
      ...galleryForm
    };
    list.unshift(newG);
    MockDB.set('gallery', list);
    triggerToast('New gallery portfolio item uploaded.');
    setActiveFormType(null);
  };

  const handleOfferFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const list = MockDB.getOffers();
    if (selectedFormId) {
      const idx = list.findIndex(o => o.id === selectedFormId);
      if (idx !== -1) {
        list[idx] = { ...list[idx], ...offerForm };
        MockDB.set('offers', list);
        triggerToast('Offer details modified.');
      }
    } else {
      const newO: Offer = {
        id: `o-${Date.now()}`,
        ...offerForm
      };
      list.push(newO);
      MockDB.set('offers', list);
      triggerToast('New promotional offer created.');
    }
    setActiveFormType(null);
    setSelectedFormId(null);
  };

  const approveReview = (id: string) => {
    const list = MockDB.getReviews();
    const idx = list.findIndex(r => r.id === id);
    if (idx !== -1) {
      list[idx].status = 'Approved';
      MockDB.set('reviews', list);
      triggerToast('Review approved successfully!');
    }
  };

  const markAllNotifRead = () => {
    const list = MockDB.getNotifications();
    list.forEach(n => n.isRead = true);
    MockDB.set('notifications', list);
    triggerToast('All notifications marked as read.');
  };

  return (
    <div className="min-h-screen bg-[#FFF9F7] text-[#24191B] flex flex-col lg:flex-row">
      {/* Global Processing Overlay */}
      {isProcessing && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-white/80 backdrop-blur-sm">
          <div className="flex flex-col items-center bg-white p-6 rounded-2xl shadow-xl border border-stone-200">
            <RefreshCw className="w-8 h-8 text-[#D4A373] animate-spin mb-4" />
            <p className="text-stone-800 font-bold text-sm">Processing...</p>
            <p className="text-stone-500 text-xs mt-1">Please wait while changes are saved.</p>
          </div>
        </div>
      )}
      
      {toastMessage && (
        <Toast 
          message={toastMessage} 
          type="info" 
          action={toastAction}
          onClose={() => {
            setToastMessage(null);
            setToastAction(undefined);
          }} 
        />
      )}

      {/* Confirmation Dialog Modal (Clean, Accessible, Non-blocking) */}
      <Modal 
        isOpen={confirmModal.isOpen} 
        onClose={() => setConfirmModal(prev => ({ ...prev, isOpen: false }))} 
        title={confirmModal.title}
      >
        <div className="space-y-5">
          <div className="flex items-start gap-3 p-4 bg-amber-50/80 border border-amber-200 rounded-2xl">
            <AlertCircle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
            <p className="text-xs text-stone-700 leading-relaxed font-medium">
              {confirmModal.message}
            </p>
          </div>

          <div className="flex items-center justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={() => setConfirmModal(prev => ({ ...prev, isOpen: false }))}
              className="px-4 py-2.5 rounded-xl border border-stone-200 text-stone-600 text-xs font-semibold hover:bg-stone-100 transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={async () => {
                const fn = confirmModal.onConfirm;
                setConfirmModal(prev => ({ ...prev, isOpen: false }));
                await fn();
              }}
              className={`px-5 py-2.5 rounded-xl text-white text-xs font-bold transition-all shadow-md cursor-pointer ${
                confirmModal.confirmVariant === 'danger'
                  ? 'bg-rose-600 hover:bg-rose-700 shadow-rose-900/20'
                  : 'bg-[#B85C72] hover:bg-[#A34E62] shadow-rose-900/20'
              }`}
            >
              {confirmModal.confirmLabel}
            </button>
          </div>
        </div>
      </Modal>

      {/* --- SIDEBAR --- */}
      <aside className="w-full lg:w-64 bg-white border-b lg:border-b-0 lg:border-r border-[#F5DDE1] p-6 flex flex-col justify-between shrink-0">
        <div className="space-y-8">
          {/* Header title */}
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Sparkles className="w-5 h-5 text-[#B85C72]" />
              <div>
                <span className="font-serif text-lg font-bold tracking-wider text-[#24191B] block">Glow & Grace</span>
                <span className="text-[8px] font-sans tracking-[0.2em] text-[#D4A373] block uppercase">Admin Console</span>
              </div>
            </div>

            {/* Cloud Sync Status Badge */}
            <div className="mt-4 p-2.5 bg-[#FFF9F7] rounded-xl border border-[#F5DDE1]/50 space-y-1.5">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className={`w-2 h-2 rounded-full ${isFirebaseSynced ? 'bg-emerald-500 animate-pulse' : 'bg-emerald-500'}`} />
                  <span className="text-[10px] uppercase font-bold tracking-wider text-stone-500">Cloud Sync</span>
                </div>
                <span className="text-[9px] font-sans px-1.5 py-0.5 rounded font-semibold bg-emerald-50 text-emerald-600 border border-emerald-200">
                  {isFirebaseSynced ? 'Active' : 'Connected'}
                </span>
              </div>
              <div className="text-[10px] text-stone-400 font-mono truncate">
                {auth.currentUser?.email || 'rahulx@admin.com'}
              </div>
            </div>
          </div>

          {/* Nav List */}
          <nav className="flex flex-col gap-1.5">
            {[
              { id: 'dashboard', label: 'Overview', icon: <LayoutDashboard className="w-4 h-4" /> },
              { id: 'appointments', label: 'Appointments', icon: <Calendar className="w-4 h-4" />, count: pendingCount },
              { id: 'services', label: 'Services', icon: <Scissors className="w-4 h-4" /> },
              { id: 'packages', label: 'Packages', icon: <Gift className="w-4 h-4" /> },
              { id: 'reels', label: 'Beauty Reels', icon: <Film className="w-4 h-4" /> },
              { id: 'glowups', label: 'Glow-Up (Before/After)', icon: <Sparkles className="w-4 h-4" /> },
              { id: 'gallery', label: 'Gallery', icon: <Image className="w-4 h-4" /> },
              { id: 'artists', label: 'Experts', icon: <Users className="w-4 h-4" /> },
              { id: 'reviews', label: 'Reviews', icon: <Star className="w-4 h-4" />, count: reviews.filter(r => r.status === 'Pending').length },
              { id: 'offers', label: 'Offers & Promos', icon: <Gift className="w-4 h-4" /> },
              { id: 'trash', label: 'Trash / Bin', icon: <Trash2 className="w-4 h-4" />, count: trash.length > 0 ? trash.length : undefined },
              { id: 'automations', label: 'Automations & Reminders', icon: <Cpu className="w-4 h-4" /> },
              { id: 'seo', label: 'SEO Settings', icon: <Globe className="w-4 h-4" /> },
              { id: 'settings', label: 'Website Settings', icon: <Settings className="w-4 h-4" /> },
              { id: 'maintenance', label: 'Maintenance', icon: <Wrench className="w-4 h-4" /> },
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => {
                  setActiveTab(tab.id);
                  setSelectedIds([]);
                  navigate(`admin/${tab.id}`);
                }}
                className={`flex items-center justify-between px-4 py-3 rounded-xl text-xs font-semibold tracking-wide transition-colors cursor-pointer ${
                  activeTab === tab.id 
                    ? 'bg-[#B85C72] text-white shadow-md shadow-rose-900/10' 
                    : 'text-stone-600 hover:bg-[#F5DDE1]/30 hover:text-[#B85C72]'
                }`}
              >
                <div className="flex items-center gap-3">
                  {tab.icon}
                  <span>{tab.label}</span>
                </div>
                {tab.count !== undefined && tab.count > 0 && (
                  <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full shrink-0 ${
                    activeTab === tab.id 
                      ? 'bg-white text-[#B85C72]' 
                      : tab.id === 'trash'
                        ? 'bg-amber-500 text-white'
                        : 'bg-[#B85C72] text-white'
                  }`}>
                    {tab.count}
                  </span>
                )}
              </button>
            ))}
          </nav>
        </div>

        {/* Footer logout button */}
        <div className="pt-6 border-t border-[#F5DDE1] mt-8 lg:mt-0">
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-xs text-red-500 hover:bg-red-50 hover:text-red-600 transition-colors cursor-pointer text-left font-semibold"
          >
            <LogOut className="w-4 h-4" />
            Sign Out
          </button>
        </div>
      </aside>

      {/* --- MAIN WORKSPACE --- */}
      <main className="flex-grow p-6 md:p-10 max-w-7xl mx-auto w-full overflow-y-auto space-y-8">
        
        {sessionStorage.getItem('gg_provider_needs_enable') === 'true' && (
          <div className="p-4 bg-amber-50 border border-amber-200 rounded-2xl flex items-start justify-between gap-3 text-amber-900 text-xs shadow-sm">
            <div className="space-y-1">
              <div className="font-bold flex items-center gap-1.5 text-amber-800">
                <AlertCircle className="w-4 h-4 text-amber-600 shrink-0" />
                <span>1-Click Firebase Activation: Enable Email/Password in Console</span>
              </div>
              <p className="text-amber-800 leading-relaxed">
                You are currently logged into the Admin Desk! Firebase Auth reported <code className="bg-amber-100 px-1 py-0.5 rounded font-mono text-[11px]">auth/operation-not-allowed</code> because the provider is disabled.
                To enable live cloud token synchronization: Go to <strong>Firebase Console &gt; Authentication &gt; Sign-in method</strong>, click <strong>Email/Password</strong>, toggle it to <strong>Enable</strong>, and click <strong>Save</strong>.
              </p>
            </div>
            <button 
              onClick={() => {
                sessionStorage.removeItem('gg_provider_needs_enable');
                window.dispatchEvent(new Event('gg_db_update'));
              }}
              className="text-amber-600 hover:text-amber-800 font-bold text-sm px-2 py-1 cursor-pointer shrink-0"
              title="Dismiss note"
            >
              ✕
            </button>
          </div>
        )}

        {/* --- HEADER DESK BAR --- */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center border-b border-[#F5DDE1] pb-6 gap-4">
          <div>
            <span className="text-[10px] uppercase font-bold tracking-widest text-[#D4A373]">Workspace</span>
            <h2 className="font-serif text-2xl md:text-3xl font-extrabold text-[#24191B] capitalize">
              {activeTab === 'dashboard' ? 'Overview Dashboard' : `${activeTab} Management`}
            </h2>
          </div>

          {/* Header Actions & Full Website Sync */}
          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={handleFullWebsiteSync}
              disabled={isSyncingWebsite}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all shadow-sm cursor-pointer border ${
                isSyncingWebsite
                  ? 'bg-rose-50 text-[#B85C72] border-[#F5DDE1]'
                  : 'bg-[#B85C72] hover:bg-[#9e4a5d] text-white border-transparent'
              }`}
              title="Perform a full synchronization of all website services, images, packages, artists, and settings to Firestore"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isSyncingWebsite ? 'animate-spin' : ''}`} />
              <span>{isSyncingWebsite ? 'Syncing Cloud...' : 'Full Website Sync'}</span>
            </button>

            {lastSyncTime && (
              <span className="hidden xl:inline-block text-[11px] text-stone-500 bg-stone-100 px-2.5 py-1.5 rounded-lg border border-stone-200">
                Synced at {lastSyncTime}
              </span>
            )}

            <div className="relative">
              <button 
                onClick={markAllNotifRead}
                className="p-2.5 bg-white rounded-full border border-stone-200 hover:border-stone-300 text-stone-700 transition-colors cursor-pointer relative"
                title="Mark all as read"
              >
                <Bell className="w-4 h-4" />
                {notifications.some(n => !n.isRead) && (
                  <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-[#B85C72] rounded-full border-2 border-white" />
                )}
              </button>
            </div>

            <div className="bg-white px-4 py-2 rounded-xl border border-stone-200 text-xs shadow-sm flex items-center gap-2.5">
              <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" title="Cloud Synced" />
              <div>
                <span className="text-stone-400 block font-semibold text-[10px] uppercase">Admin Operator</span>
                <span className="text-stone-800 font-bold font-mono text-[11px] truncate max-w-[170px] block">
                  {auth.currentUser?.email || (username.includes('@') ? username : 'rahulx@admin.com')}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Bulk Action Toolbar */}
        {selectedIds.length > 0 && (
          <div className="bg-[#24191B] text-white px-5 py-3.5 rounded-2xl shadow-xl border border-stone-700 flex flex-wrap items-center justify-between gap-3 animate-fade-in my-2">
            <div className="flex items-center gap-3">
              <span className="bg-[#B85C72] text-white text-xs font-bold px-2.5 py-0.5 rounded-full">
                {selectedIds.length}
              </span>
              <span className="text-xs font-semibold text-stone-200">
                item{selectedIds.length > 1 ? 's' : ''} selected
              </span>
            </div>

            <div className="flex items-center gap-2">
              {activeTab === 'trash' ? (
                <>
                  <button
                    onClick={handleBulkRestoreFromTrash}
                    className="px-3.5 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer shadow-sm"
                  >
                    <RotateCcw className="w-3.5 h-3.5" /> Restore Selected ({selectedIds.length})
                  </button>
                  <button
                    onClick={requestBulkDeleteFromTrash}
                    className="px-3.5 py-2 bg-rose-700 hover:bg-rose-600 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer shadow-sm"
                  >
                    <Trash2 className="w-3.5 h-3.5" /> Permanently Delete Selected
                  </button>
                </>
              ) : (
                <>
                  <button
                    onClick={() => handleBulkMoveToTrash(activeTab as TrashEntityType)}
                    className="px-3.5 py-2 bg-amber-600 hover:bg-amber-500 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer shadow-sm"
                    title="Move selected items to Trash (safe soft delete with undo)"
                  >
                    <Trash2 className="w-3.5 h-3.5" /> Move to Trash ({selectedIds.length})
                  </button>
                  <button
                    onClick={() => requestBulkPermanentDelete(activeTab)}
                    className="px-3.5 py-2 bg-rose-700 hover:bg-rose-600 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer shadow-sm"
                    title="Permanently remove selected items from database"
                  >
                    <Trash2 className="w-3.5 h-3.5" /> Delete Permanently
                  </button>
                </>
              )}

              <button
                onClick={clearSelection}
                className="px-3 py-2 bg-stone-800 hover:bg-stone-700 text-stone-300 rounded-xl text-xs font-medium transition-colors cursor-pointer ml-1"
              >
                Clear Selection
              </button>
            </div>
          </div>
        )}

        {/* --- DYNAMIC TABS PANEL CONTROLLER --- */}
        
        {/* TAB 1: OVERVIEW DASHBOARD */}
        {activeTab === 'dashboard' && (
          <div className="space-y-10 animate-fade-in">
            {/* Cards widgets grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                { label: 'Estimated Revenue', val: `₹${estimatedRevenue.toLocaleString('en-IN')}`, desc: 'Confirmed & Completed' },
                { label: 'Pending Bookings', val: pendingCount, desc: 'Requires confirmation', highlight: pendingCount > 0 },
                { label: 'Confirmed Bookings', val: confirmedCount, desc: 'Scheduled slots' },
                { label: 'Unique Customers', val: uniqueCustomersCount, desc: 'Logged on desk' }
              ].map((m, i) => (
                <div key={i} className={`p-6 rounded-2xl border transition-all ${
                  m.highlight ? 'bg-[#B85C72]/5 border-[#B85C72] shadow-sm' : 'bg-white border-stone-200 shadow-sm'
                }`}>
                  <span className="text-[10px] uppercase text-stone-400 block font-bold mb-1 tracking-wider">{m.label}</span>
                  <span className="text-2xl md:text-3xl font-serif font-extrabold text-[#B85C72] block">{m.val}</span>
                  <span className="text-xs text-stone-500 mt-1 block">{m.desc}</span>
                </div>
              ))}
            </div>

            {/* Live Firestore Project Status Card */}
            <div className="p-6 rounded-2xl bg-white border border-[#F5DDE1] shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6">
              <div className="space-y-1.5">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
                  <span className="text-[10px] uppercase font-bold tracking-widest text-[#B85C72]">
                    Connected Cloud Database
                  </span>
                  <span className="text-xs bg-stone-100 text-stone-700 px-2.5 py-0.5 rounded font-mono font-bold">
                    glowgracev0
                  </span>
                  <span className="text-xs bg-stone-100 text-stone-500 px-2 py-0.5 rounded font-mono">
                    (default)
                  </span>
                </div>
                <h3 className="font-serif text-lg font-bold text-[#24191B]">
                  Populate & Synchronize Firestore Collections
                </h3>
                <p className="text-xs text-stone-500 leading-relaxed max-w-xl">
                  Your app is connected to your Firebase project <strong>glowgracev0</strong>. Click below to write all {services.length} services, {packages.length} packages, {artists.length} artists, and gallery items directly into your live Firestore database.
                </p>
              </div>
              <button
                onClick={handleFullWebsiteSync}
                disabled={isSyncingWebsite}
                className="px-5 py-3.5 bg-[#B85C72] hover:bg-[#9e4a5d] text-white text-xs font-sans font-bold tracking-wider uppercase rounded-xl transition-all duration-300 shadow-md cursor-pointer flex items-center justify-center gap-2 shrink-0"
              >
                <RefreshCw className={`w-4 h-4 ${isSyncingWebsite ? 'animate-spin' : ''}`} />
                <span>{isSyncingWebsite ? 'Writing to glowgracev0...' : 'Sync All Data to Firestore'}</span>
              </button>
            </div>

            {/* Indian Heritage & Village Theme Database Seeder */}
            <div className="p-6 rounded-2xl bg-amber-50 border border-amber-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6">
              <div className="space-y-1">
                <h3 className="font-serif text-lg font-bold text-amber-900 flex items-center gap-2">
                  <span>🏛️</span> Indian Heritage & Village Culture Seeder
                </h3>
                <p className="text-xs text-amber-800 leading-relaxed max-w-xl">
                  Instantly seed your live Firestore cloud database with beautiful traditional Indian wedding services, Ayurvedic wellness therapies, heritage hair weavers, real marigold/henna gallery visuals, and authentic customer reviews.
                </p>
              </div>
              <button
                onClick={requestSeedIndianHeritage}
                className="px-5 py-3 bg-amber-600 hover:bg-amber-700 text-white text-xs font-sans font-bold tracking-wider uppercase rounded-xl transition-all duration-300 shadow-md cursor-pointer shrink-0"
              >
                Seed to Cloud Firestore
              </button>
            </div>

            {/* Notifications Activity logs */}
            {notifications.length > 0 && (
              <div className="bg-white border border-stone-200 rounded-2xl p-6 space-y-4 shadow-sm">
                <div className="flex justify-between items-center border-b border-stone-200 pb-3">
                  <h3 className="font-serif text-lg font-bold text-[#24191B] flex items-center gap-2"><span>🔔</span> New Notifications</h3>
                  <button onClick={markAllNotifRead} className="text-xs text-[#D4A373] hover:underline cursor-pointer font-semibold">
                    Mark all read
                  </button>
                </div>
                <div className="divide-y divide-stone-100 max-h-60 overflow-y-auto">
                  {notifications.map(n => (
                    <div key={n.id} className="py-3.5 flex items-start gap-3.5">
                      <div className={`w-2.5 h-2.5 rounded-full mt-1.5 shrink-0 ${n.isRead ? 'bg-stone-200' : 'bg-[#B85C72]'}`} />
                      <div>
                        <p className="text-xs font-bold text-stone-700">{n.title}</p>
                        <p className="text-xs text-stone-500 mt-0.5">{n.message}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* TAB 2: APPOINTMENTS PANEL */}
        {activeTab === 'appointments' && (
          <div className="space-y-6 animate-fade-in">
            {/* Search and Filters headers */}
            <div className="bg-white border border-stone-200 p-5 rounded-2xl flex flex-col md:flex-row gap-4 items-center shadow-sm">
              <div className="relative flex-grow w-full">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" />
                <input
                  type="text"
                  placeholder="Search bookings by ID, client name, or phone..."
                  value={appSearch}
                  onChange={e => setAppSearch(e.target.value)}
                  className="w-full bg-stone-50 border border-stone-200 rounded-xl py-3 pl-12 pr-4 text-xs text-stone-700 outline-none focus:border-[#D4A373] transition-all"
                />
              </div>

              <div className="flex gap-3 w-full md:w-auto shrink-0">
                {/* Status Selector */}
                <select
                  value={appFilterStatus}
                  onChange={e => setAppFilterStatus(e.target.value)}
                  className="bg-stone-50 border border-stone-200 text-stone-700 text-xs px-4 py-3 rounded-xl outline-none cursor-pointer focus:border-[#D4A373] transition-all"
                >
                  <option value="All">All Statuses</option>
                  <option value="Pending">Pending</option>
                  <option value="Confirmed">Confirmed</option>
                  <option value="Completed">Completed</option>
                  <option value="Cancelled">Cancelled</option>
                </select>

                {/* Service Selector */}
                <select
                  value={appFilterService}
                  onChange={e => setAppFilterService(e.target.value)}
                  className="bg-stone-50 border border-stone-200 text-stone-700 text-xs px-4 py-3 rounded-xl outline-none cursor-pointer max-w-[180px] focus:border-[#D4A373] transition-all"
                >
                  <option value="All">All Services</option>
                  {services.map(s => (
                    <option key={s.id} value={s.id}>{s.name}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* List Table of appointments */}
            {filteredAppointments.length > 0 ? (
              <div className="bg-white border border-stone-200 rounded-2xl overflow-hidden shadow-md">
                <div className="overflow-x-auto">
                  <table className="w-full border-collapse text-left text-xs">
                    <thead>
                      <tr className="bg-stone-50 text-stone-500 border-b border-stone-200 uppercase tracking-widest font-sans font-bold">
                        <th className="p-4 w-10 text-center">
                          <input
                            type="checkbox"
                            checked={filteredAppointments.length > 0 && filteredAppointments.every(a => selectedIds.includes(a.bookingId))}
                            onChange={() => toggleSelectAll(filteredAppointments.map(a => a.bookingId))}
                            className="rounded cursor-pointer accent-[#B85C72]"
                            aria-label="Select all bookings"
                          />
                        </th>
                        <th className="p-4">ID</th>
                        <th className="p-4">Customer Details</th>
                        <th className="p-4">Service</th>
                        <th className="p-4">Date/Time</th>
                        <th className="p-4">Status</th>
                        <th className="p-4">Desk Notes / Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-stone-100 text-stone-700">
                      {filteredAppointments.map(appt => (
                        <tr key={appt.bookingId} className={`hover:bg-stone-50/60 transition-colors ${selectedIds.includes(appt.bookingId) ? 'bg-rose-50/40' : ''}`}>
                          <td className="p-4 w-10 text-center">
                            <input
                              type="checkbox"
                              checked={selectedIds.includes(appt.bookingId)}
                              onChange={() => toggleSelect(appt.bookingId)}
                              className="rounded cursor-pointer accent-[#B85C72]"
                              aria-label={`Select booking ${appt.bookingId}`}
                            />
                          </td>
                          <td className="p-4 font-mono font-bold text-[#B85C72]">{appt.bookingId}</td>
                          <td className="p-4 space-y-0.5">
                            <span className="font-bold text-stone-800 block">{appt.customerName}</span>
                            <span className="text-stone-500 block font-medium">{appt.phone}</span>
                            <span className="text-stone-400 block break-all text-[11px]">{appt.email}</span>
                          </td>
                          <td className="p-4">
                            <span className="font-semibold text-stone-800 block">{appt.serviceName}</span>
                            {appt.artistName && <span className="text-[10px] text-stone-500 font-medium">Artist: {appt.artistName}</span>}
                          </td>
                          <td className="p-4 space-y-0.5">
                            <span className="font-semibold text-stone-800 block">{appt.date}</span>
                            <span className="text-stone-500 block">{appt.time}</span>
                          </td>
                          <td className="p-4">
                            <StatusBadge status={appt.status} />
                          </td>
                          <td className="p-4 space-y-3 max-w-[280px]">
                            {/* Notes update area */}
                            <input
                               type="text"
                               placeholder="Desk logs (e.g. skin analysis clear)"
                               value={apptNotes[appt.bookingId] ?? appt.adminNotes ?? ''}
                               onChange={e => handleApptNotesChange(appt.bookingId, e.target.value)}
                               className="w-full bg-stone-50 border border-stone-200 rounded-md py-1.5 px-3 text-[11px] text-stone-700 outline-none focus:border-[#D4A373] transition-all"
                            />

                            {/* Active operations buttons */}
                            <div className="flex flex-wrap items-center gap-1.5 pt-1">
                              {appt.status === 'Pending' && (
                                <>
                                  <button
                                    onClick={() => handleApptAction(appt.bookingId, 'Confirmed')}
                                    className="px-2.5 py-1.5 bg-emerald-700 hover:bg-emerald-600 text-white rounded-md font-bold cursor-pointer text-xs"
                                  >
                                    Confirm
                                  </button>
                                  <button
                                    onClick={() => handleApptAction(appt.bookingId, 'Cancelled')}
                                    className="px-2.5 py-1.5 bg-rose-950/40 border border-rose-500/30 hover:bg-rose-900 text-rose-300 rounded-md font-bold cursor-pointer text-xs"
                                  >
                                    Reject
                                  </button>
                                </>
                              )}

                              {appt.status === 'Confirmed' && (
                                <button
                                  onClick={() => handleApptAction(appt.bookingId, 'Completed')}
                                  className="px-2.5 py-1.5 bg-purple-700 hover:bg-purple-600 text-white rounded-md font-bold cursor-pointer text-xs"
                                >
                                  Complete Session
                                </button>
                              )}

                              {/* WhatsApp Direct Chat with pre-filled status update text */}
                              <a
                                href={`https://wa.me/${appt.phone.replace(/[^0-9]/g, '')}?text=Hi%20${appt.customerName},%20Glow%20Grace%20here%20regarding%20appt%20${appt.bookingId}.%20Status:%20${appt.status}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="px-2 py-1 bg-[#25D366] text-white hover:bg-[#20ba59] rounded-md font-bold flex items-center gap-1 shrink-0 text-xs"
                              >
                                <MessageCircle className="w-3.5 h-3.5 fill-current" />
                                Chat
                              </a>

                              <button
                                onClick={() => handleMoveToTrash('appointments', appt.bookingId, appt.customerName, `${appt.serviceName} • ${appt.date}`)}
                                className="px-2 py-1 bg-amber-50 text-amber-700 hover:bg-amber-100 rounded-md font-bold flex items-center gap-1 cursor-pointer transition-colors text-xs"
                                title="Move to Trash (Soft Delete with Undo)"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                                Trash
                              </button>

                              <button
                                onClick={() => requestPermanentDelete('appointments', appt.bookingId, `Booking #${appt.bookingId} (${appt.customerName})`)}
                                className="p-1 text-stone-400 hover:text-rose-600 hover:bg-rose-50 rounded-md cursor-pointer transition-colors"
                                title="Delete Permanently"
                              >
                                <X className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            ) : (
              <EmptyState title="No bookings matched" message="Try relaxing your search terms or changing your filters." />
            )}
          </div>
        )}

        {/* TAB 3: SERVICES MENU CRUD */}
        {activeTab === 'services' && (
          <div className="space-y-6 animate-fade-in">
            <div className="flex flex-wrap items-center justify-between gap-3 bg-white p-4 rounded-2xl border border-stone-200">
              <div>
                <h3 className="font-serif text-lg font-bold text-stone-800">Services Catalog ({services.length})</h3>
                <p className="text-xs text-stone-500">Each service includes full description, pricing, category, duration, and cloud-synced 'image' field (URL).</p>
              </div>
              <div className="flex flex-wrap items-center gap-2">
                <label className="flex items-center gap-2 cursor-pointer text-xs font-semibold text-stone-700 select-none bg-stone-50 hover:bg-stone-100 px-3 py-2 rounded-xl border border-stone-200 transition-colors">
                  <input
                    type="checkbox"
                    checked={services.length > 0 && services.every(s => selectedIds.includes(s.id))}
                    onChange={() => toggleSelectAll(services.map(s => s.id))}
                    className="rounded cursor-pointer accent-[#B85C72]"
                  />
                  Select All ({services.length})
                </label>
                <button
                  type="button"
                  onClick={handleAuditServiceSchema}
                  disabled={isAuditingSchema}
                  className="px-3 py-2 bg-stone-100 hover:bg-stone-200 text-stone-700 text-xs font-semibold rounded-xl flex items-center gap-1.5 transition-colors cursor-pointer border border-stone-200"
                  title="Audit and ensure all Firestore service documents include an image field URL"
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${isAuditingSchema ? 'animate-spin text-[#B85C72]' : ''}`} />
                  {isAuditingSchema ? 'Verifying Schema...' : 'Ensure "image" Schema'}
                </button>
                <Button
                  variant="accent"
                  onClick={() => {
                    setSelectedFormId(null);
                    setServiceForm({
                      name: '',
                      description: '',
                      startingPrice: 999,
                      originalPrice: 0,
                      discount: 0,
                      category: 'Bridal Services',
                      duration: 60,
                      status: 'Active',
                      imageUrl: '',
                      image: ''
                    });
                    setActiveFormType('service');
                  }}
                  className="flex items-center gap-2"
                >
                  <Plus className="w-4 h-4" /> Add Service
                </Button>
              </div>
            </div>

            {/* List */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {services.map(s => {
                const displayImg = s.image || s.imageUrl;
                const isSelected = selectedIds.includes(s.id);
                return (
                  <div key={s.id} className={`bg-white border rounded-2xl overflow-hidden p-5 flex flex-col justify-between shadow-sm transition-all ${
                    isSelected ? 'border-[#B85C72] ring-2 ring-[#B85C72]/20' : 'border-stone-200'
                  }`}>
                    <div className="space-y-3">
                      {/* Service Image preview */}
                      {displayImg ? (
                        <div className="w-full h-32 rounded-xl overflow-hidden bg-stone-100 border border-stone-200 relative">
                          <img
                            src={displayImg}
                            alt={s.name}
                            className="w-full h-full object-cover"
                          />
                          <div className="absolute top-2 left-2 bg-white/90 backdrop-blur-xs p-1 rounded-md shadow-xs">
                            <input
                              type="checkbox"
                              checked={isSelected}
                              onChange={() => toggleSelect(s.id)}
                              className="rounded cursor-pointer accent-[#B85C72] w-4 h-4 block"
                              aria-label={`Select ${s.name}`}
                            />
                          </div>
                        </div>
                      ) : (
                        <div className="w-full h-24 rounded-xl bg-[#FFF0F2] border border-[#F5DDE1] flex items-center justify-between px-3 text-xs text-[#B85C72] font-medium">
                          <input
                            type="checkbox"
                            checked={isSelected}
                            onChange={() => toggleSelect(s.id)}
                            className="rounded cursor-pointer accent-[#B85C72] w-4 h-4"
                            aria-label={`Select ${s.name}`}
                          />
                          <span>No image uploaded</span>
                          <span />
                        </div>
                      )}
                      <div className="flex justify-between items-start">
                        <span className="text-[10px] text-[#B85C72] uppercase font-bold tracking-widest">{s.category}</span>
                        <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold ${
                          s.status === 'Active' ? 'bg-emerald-50 border border-emerald-200 text-emerald-600' : 'bg-red-50 border border-red-200 text-red-600'
                        }`}>
                          {s.status}
                        </span>
                      </div>
                      <h4 className="font-serif text-lg font-bold text-stone-800">{s.name}</h4>
                      <p className="text-xs text-stone-500 line-clamp-2">{s.description}</p>
                      <div className="flex items-baseline gap-2">
                        <span className="text-base font-serif font-extrabold text-[#B85C72]">₹{s.startingPrice}</span>
                        {s.originalPrice && s.originalPrice > s.startingPrice && (
                          <span className="text-xs text-stone-400 line-through">₹{s.originalPrice}</span>
                        )}
                        {s.discount ? (
                          <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded">
                            {s.discount}% OFF
                          </span>
                        ) : null}
                      </div>
                    </div>

                    <div className="flex items-center gap-2 border-t border-stone-100 pt-4 mt-4">
                      <button
                        onClick={() => {
                          setSelectedFormId(s.id);
                          const imgVal = s.image || s.imageUrl || '';
                          setServiceForm({
                            name: s.name,
                            description: s.description,
                            startingPrice: s.startingPrice,
                            originalPrice: s.originalPrice || 0,
                            discount: s.discount || 0,
                            category: s.category,
                            duration: s.duration,
                            status: s.status,
                            imageUrl: imgVal,
                            image: imgVal
                          });
                          setActiveFormType('service');
                        }}
                        className="flex-1 py-2 bg-stone-50 hover:bg-stone-100 rounded-lg border border-stone-200 text-xs font-semibold cursor-pointer text-center text-stone-700 transition-colors"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleMoveToTrash('services', s.id, s.name, s.category)}
                        className="p-2 border border-amber-200 text-amber-600 hover:bg-amber-50 rounded-lg cursor-pointer transition-colors"
                        title="Move to Trash (Soft Delete)"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => requestPermanentDelete('services', s.id, s.name)}
                        className="p-2 border border-stone-200 text-stone-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg cursor-pointer transition-colors"
                        title="Delete Permanently"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* TAB 4: PACKAGES */}
        {activeTab === 'packages' && (
          <div className="space-y-6 animate-fade-in">
            <div className="flex flex-wrap items-center justify-between gap-3 bg-white p-4 rounded-2xl border border-stone-200">
              <div>
                <h3 className="font-serif text-lg font-bold text-stone-800">Packages ({packages.length})</h3>
                <p className="text-xs text-stone-500">Bundled service packages with pricing, features, and popular highlights.</p>
              </div>
              <div className="flex flex-wrap items-center gap-2">
                <label className="flex items-center gap-2 cursor-pointer text-xs font-semibold text-stone-700 select-none bg-stone-50 hover:bg-stone-100 px-3 py-2 rounded-xl border border-stone-200 transition-colors">
                  <input
                    type="checkbox"
                    checked={packages.length > 0 && packages.every(p => selectedIds.includes(p.id))}
                    onChange={() => toggleSelectAll(packages.map(p => p.id))}
                    className="rounded cursor-pointer accent-[#B85C72]"
                  />
                  Select All ({packages.length})
                </label>
                <Button
                  variant="accent"
                  onClick={() => {
                    setSelectedFormId(null);
                    setPackageForm({ name: '', price: 999, description: '', features: '', isPopular: false, status: 'Active' });
                    setActiveFormType('package');
                  }}
                  className="flex items-center gap-2"
                >
                  <Plus className="w-4 h-4" /> Create Package
                </Button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {packages.map(p => {
                const isSelected = selectedIds.includes(p.id);
                return (
                  <div key={p.id} className={`bg-white border rounded-2xl p-6 flex flex-col justify-between shadow-sm transition-all ${
                    isSelected ? 'border-[#B85C72] ring-2 ring-[#B85C72]/20' : 'border-stone-200'
                  }`}>
                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <div className="flex items-center gap-2.5">
                          <input
                            type="checkbox"
                            checked={isSelected}
                            onChange={() => toggleSelect(p.id)}
                            className="rounded cursor-pointer accent-[#B85C72] w-4 h-4"
                            aria-label={`Select ${p.name}`}
                          />
                          <h4 className="font-serif text-xl font-bold text-stone-800">{p.name}</h4>
                        </div>
                        {p.isPopular && <span className="bg-[#B85C72] text-white text-[9px] px-2 py-0.5 rounded-full font-bold">POPULAR</span>}
                      </div>
                      <p className="text-xs text-stone-500">{p.description}</p>
                      <span className="text-2xl font-serif text-[#B85C72] block">₹{p.price}</span>
                      
                      <ul className="space-y-1.5 text-xs text-stone-600 pt-2 border-t border-stone-100">
                        {(p.features || []).map((f, i) => (
                          <li key={i} className="flex items-center gap-1.5"><span className="text-[#B85C72]">&bull;</span> {f}</li>
                        ))}
                      </ul>
                    </div>

                    <div className="flex items-center gap-2 border-t border-stone-100 pt-4 mt-6">
                      <button
                        onClick={() => {
                          setSelectedFormId(p.id);
                          setPackageForm({ name: p.name, price: p.price, description: p.description, features: p.features.join('\n'), isPopular: p.isPopular, status: p.status });
                          setActiveFormType('package');
                        }}
                        className="flex-1 py-2 bg-stone-50 hover:bg-stone-100 rounded-lg border border-stone-200 text-xs font-semibold cursor-pointer text-center text-stone-700 transition-colors"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleMoveToTrash('packages', p.id, p.name, `₹${p.price}`)}
                        className="p-2 border border-amber-200 text-amber-600 hover:bg-amber-50 rounded-lg cursor-pointer transition-colors"
                        title="Move to Trash (Soft Delete)"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => requestPermanentDelete('packages', p.id, p.name)}
                        className="p-2 border border-stone-200 text-stone-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg cursor-pointer transition-colors"
                        title="Delete Permanently"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* TAB 5: GALLERY */}
        {activeTab === 'gallery' && (
          <div className="space-y-6 animate-fade-in">
            <div className="flex flex-wrap items-center justify-between gap-3 bg-white p-4 rounded-2xl border border-stone-200">
              <div>
                <h3 className="font-serif text-lg font-bold text-stone-800">Gallery Portfolio ({gallery.length})</h3>
                <p className="text-xs text-stone-500">Showcase your salon's best looks and aesthetic portfolio.</p>
              </div>
              <div className="flex flex-wrap items-center gap-2">
                <label className="flex items-center gap-2 cursor-pointer text-xs font-semibold text-stone-700 select-none bg-stone-50 hover:bg-stone-100 px-3 py-2 rounded-xl border border-stone-200 transition-colors">
                  <input
                    type="checkbox"
                    checked={gallery.length > 0 && gallery.every(g => selectedIds.includes(g.id))}
                    onChange={() => toggleSelectAll(gallery.map(g => g.id))}
                    className="rounded cursor-pointer accent-[#B85C72]"
                  />
                  Select All ({gallery.length})
                </label>
                <Button
                  variant="accent"
                  onClick={() => {
                    setGalleryForm({ title: '', category: 'Bridal', description: '', isFeatured: false, imageUrl: '' });
                    setActiveFormType('gallery');
                  }}
                  className="flex items-center gap-2"
                >
                  <Plus className="w-4 h-4" /> Add Gallery Shot
                </Button>
              </div>
            </div>

            <div className="columns-1 sm:columns-3 gap-6 space-y-6">
              {gallery.map(g => {
                const isSelected = selectedIds.includes(g.id);
                return (
                  <div key={g.id} className={`break-inside-avoid bg-white border rounded-2xl overflow-hidden p-4 space-y-3 shadow-sm transition-all ${
                    isSelected ? 'border-[#B85C72] ring-2 ring-[#B85C72]/20' : 'border-stone-200'
                  }`}>
                    <div className="relative">
                      <img src={g.imageUrl} alt={g.alt} className="w-full h-auto rounded-xl" />
                      <div className="absolute top-2 left-2 bg-white/90 backdrop-blur-xs p-1 rounded-md shadow-xs">
                        <input
                          type="checkbox"
                          checked={isSelected}
                          onChange={() => toggleSelect(g.id)}
                          className="rounded cursor-pointer accent-[#B85C72] w-4 h-4 block"
                          aria-label={`Select ${g.title}`}
                        />
                      </div>
                    </div>
                    <div>
                      <span className="text-[9px] text-[#B85C72] uppercase font-bold tracking-widest block">{g.category}</span>
                      <h5 className="font-serif text-sm font-bold text-stone-800 mt-1">{g.title}</h5>
                    </div>
                    <div className="flex items-center gap-2 pt-1">
                      <button
                        onClick={() => handleMoveToTrash('gallery', g.id, g.title, g.category)}
                        className="flex-1 py-2 border border-amber-200 text-amber-600 hover:bg-amber-50 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 cursor-pointer transition-colors"
                        title="Move to Trash (Soft Delete)"
                      >
                        <Trash2 className="w-4 h-4" /> Trash
                      </button>
                      <button
                        onClick={() => requestPermanentDelete('gallery', g.id, g.title)}
                        className="p-2 border border-stone-200 text-stone-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl cursor-pointer transition-colors"
                        title="Delete Permanently"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* TAB: REELS */}
        {activeTab === 'reels' && (
          <div className="space-y-6 animate-fade-in">
            <div className="flex flex-wrap items-center justify-between gap-3 bg-white p-4 rounded-2xl border border-stone-200">
              <div>
                <h3 className="font-serif text-lg font-bold text-stone-800">Beauty Reels ({reels.length})</h3>
                <p className="text-xs text-stone-500">Short video reels showcasing bridal transformations, hairstyles, and salon moments.</p>
              </div>
              <div className="flex flex-wrap items-center gap-2">
                <label className="flex items-center gap-2 cursor-pointer text-xs font-semibold text-stone-700 select-none bg-stone-50 hover:bg-stone-100 px-3 py-2 rounded-xl border border-stone-200 transition-colors">
                  <input
                    type="checkbox"
                    checked={reels.length > 0 && reels.every(r => selectedIds.includes(r.id))}
                    onChange={() => toggleSelectAll(reels.map(r => r.id))}
                    className="rounded cursor-pointer accent-[#B85C72]"
                  />
                  Select All ({reels.length})
                </label>
                <Button
                  variant="accent"
                  onClick={() => {
                    setSelectedFormId(null);
                    setReelForm({ title: '', category: 'Bridal', thumbnailUrl: '', videoUrl: '', externalVideoUrl: '', description: '', views: 0, likes: 0, active: true, displayOrder: 0 });
                    setActiveFormType('reel');
                  }}
                  className="flex items-center gap-2"
                >
                  <Plus className="w-4 h-4" /> Add Beauty Reel
                </Button>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {reels.length === 0 && (
                <div className="col-span-full">
                  <EmptyState message="No beauty reels uploaded yet." />
                </div>
              )}
              {reels.sort((a, b) => a.displayOrder - b.displayOrder).map(r => {
                const isSelected = selectedIds.includes(r.id);
                return (
                  <div key={r.id} className={`bg-white border p-4 rounded-2xl shadow-sm flex gap-4 transition-all ${
                    isSelected ? 'border-[#B85C72] ring-2 ring-[#B85C72]/20' : 'border-stone-200'
                  }`}>
                    <div className="w-24 h-32 shrink-0 bg-stone-100 rounded-lg overflow-hidden relative">
                       {r.thumbnailUrl ? (
                         <img src={r.thumbnailUrl} alt={r.title} className="w-full h-full object-cover" />
                       ) : (
                         <Film className="w-8 h-8 text-stone-300 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
                       )}
                       <div className="absolute top-1.5 left-1.5 bg-white/90 backdrop-blur-xs p-1 rounded-md shadow-xs">
                         <input
                           type="checkbox"
                           checked={isSelected}
                           onChange={() => toggleSelect(r.id)}
                           className="rounded cursor-pointer accent-[#B85C72] w-4 h-4 block"
                           aria-label={`Select ${r.title}`}
                         />
                       </div>
                       {!r.active && (
                         <div className="absolute inset-0 bg-white/60 flex items-center justify-center">
                           <span className="text-[10px] font-bold text-stone-600 bg-white px-2 py-1 rounded">HIDDEN</span>
                         </div>
                       )}
                    </div>
                    <div className="flex-1 flex flex-col min-w-0">
                      <span className="text-[10px] uppercase font-bold text-[#D4A373]">{r.category}</span>
                      <h4 className="font-bold text-sm text-stone-800 line-clamp-2 mt-0.5 mb-1">{r.title}</h4>
                      <span className="text-xs text-stone-500 block mb-auto truncate">Order: {r.displayOrder}</span>
                      
                      <div className="flex items-center gap-1.5 border-t border-stone-100 pt-3">
                        <button
                          onClick={() => {
                            setSelectedFormId(r.id);
                            setReelForm({ ...r });
                            setActiveFormType('reel');
                          }}
                          className="flex-1 py-1.5 bg-stone-50 hover:bg-stone-100 rounded-lg border border-stone-200 text-xs font-semibold cursor-pointer text-center text-stone-700"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleMoveToTrash('reels', r.id, r.title, r.category)}
                          className="p-1.5 border border-amber-200 text-amber-600 hover:bg-amber-50 rounded-lg cursor-pointer"
                          title="Move to Trash (Soft Delete)"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => requestPermanentDelete('reels', r.id, r.title)}
                          className="p-1.5 border border-stone-200 text-stone-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg cursor-pointer"
                          title="Delete Permanently"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* TAB: GLOWUPS */}
        {activeTab === 'glowups' && (
          <div className="space-y-6 animate-fade-in">
            <div className="flex flex-wrap items-center justify-between gap-3 bg-white p-4 rounded-2xl border border-stone-200">
              <div>
                <h3 className="font-serif text-lg font-bold text-stone-800">Glow-Up Transformations ({glowups.length})</h3>
                <p className="text-xs text-stone-500">Before & After makeover comparisons showcasing salon artistry.</p>
              </div>
              <div className="flex flex-wrap items-center gap-2">
                <label className="flex items-center gap-2 cursor-pointer text-xs font-semibold text-stone-700 select-none bg-stone-50 hover:bg-stone-100 px-3 py-2 rounded-xl border border-stone-200 transition-colors">
                  <input
                    type="checkbox"
                    checked={glowups.length > 0 && glowups.every(g => selectedIds.includes(g.id))}
                    onChange={() => toggleSelectAll(glowups.map(g => g.id))}
                    className="rounded cursor-pointer accent-[#B85C72]"
                  />
                  Select All ({glowups.length})
                </label>
                <Button
                  variant="accent"
                  onClick={() => {
                    setSelectedFormId(null);
                    setGlowupForm({ title: '', category: 'Bridal', beforeImage: '', afterImage: '', description: '', serviceId: '', serviceName: '', price: 0, active: true, displayOrder: 0 });
                    setActiveFormType('glowup');
                  }}
                  className="flex items-center gap-2"
                >
                  <Plus className="w-4 h-4" /> Add Glow-Up
                </Button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
              {glowups.length === 0 && (
                <div className="col-span-full">
                  <EmptyState message="No glow-up transformations uploaded yet." />
                </div>
              )}
              {glowups.sort((a, b) => a.displayOrder - b.displayOrder).map(g => {
                const isSelected = selectedIds.includes(g.id);
                return (
                  <div key={g.id} className={`bg-white border p-4 rounded-2xl shadow-sm flex flex-col transition-all ${
                    isSelected ? 'border-[#B85C72] ring-2 ring-[#B85C72]/20' : 'border-stone-200'
                  }`}>
                    <div className="flex justify-between items-start mb-4">
                      <div className="flex items-start gap-3">
                        <input
                          type="checkbox"
                          checked={isSelected}
                          onChange={() => toggleSelect(g.id)}
                          className="rounded cursor-pointer accent-[#B85C72] w-4 h-4 mt-1"
                          aria-label={`Select ${g.title}`}
                        />
                        <div>
                          <span className="text-[10px] uppercase font-bold text-[#D4A373]">{g.category}</span>
                          <h4 className="font-serif font-bold text-lg text-stone-800">{g.title}</h4>
                          <span className="text-xs text-stone-500">Order: {g.displayOrder} {g.active ? '' : '• HIDDEN'}</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex gap-2 h-32 mb-4">
                       <div className="flex-1 bg-stone-100 rounded-lg overflow-hidden relative">
                          <img src={g.beforeImage} className="w-full h-full object-cover" alt="Before" />
                          <span className="absolute bottom-2 left-2 text-[10px] bg-black/60 text-white px-2 py-0.5 rounded uppercase">Before</span>
                       </div>
                       <div className="flex-1 bg-stone-100 rounded-lg overflow-hidden relative">
                          <img src={g.afterImage} className="w-full h-full object-cover" alt="After" />
                          <span className="absolute bottom-2 left-2 text-[10px] bg-black/60 text-white px-2 py-0.5 rounded uppercase">After</span>
                       </div>
                    </div>

                    <div className="flex items-center gap-2 border-t border-stone-100 pt-3 mt-auto">
                      <button
                        onClick={() => {
                          setSelectedFormId(g.id);
                          setGlowupForm({ ...g });
                          setActiveFormType('glowup');
                        }}
                        className="flex-1 py-2 bg-stone-50 hover:bg-stone-100 rounded-lg border border-stone-200 text-xs font-semibold cursor-pointer text-center text-stone-700"
                      >
                        Edit Transformation
                      </button>
                      <button
                        onClick={() => handleMoveToTrash('glowups', g.id, g.title, g.category)}
                        className="p-2 border border-amber-200 text-amber-600 hover:bg-amber-50 rounded-lg cursor-pointer"
                        title="Move to Trash (Soft Delete)"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => requestPermanentDelete('glowups', g.id, g.title)}
                        className="p-2 border border-stone-200 text-stone-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg cursor-pointer"
                        title="Delete Permanently"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* TAB 6: ARTISTS */}
        {activeTab === 'artists' && (
          <div className="space-y-6 animate-fade-in">
            <div className="flex flex-wrap items-center justify-between gap-3 bg-white p-4 rounded-2xl border border-stone-200">
              <div>
                <h3 className="font-serif text-lg font-bold text-stone-800">Team Experts & Artists ({artists.length})</h3>
                <p className="text-xs text-stone-500">Manage your salon's senior makeup artists, hairstylists, and beauty consultants.</p>
              </div>
              <div className="flex flex-wrap items-center gap-2">
                <label className="flex items-center gap-2 cursor-pointer text-xs font-semibold text-stone-700 select-none bg-stone-50 hover:bg-stone-100 px-3 py-2 rounded-xl border border-stone-200 transition-colors">
                  <input
                    type="checkbox"
                    checked={artists.length > 0 && artists.every(a => selectedIds.includes(a.id))}
                    onChange={() => toggleSelectAll(artists.map(a => a.id))}
                    className="rounded cursor-pointer accent-[#B85C72]"
                  />
                  Select All ({artists.length})
                </label>
                <Button
                  variant="accent"
                  onClick={() => {
                    setSelectedFormId(null);
                    setArtistForm({ name: '', role: 'Senior Makeup Artist', experience: '5+ Years', specialty: '', bio: '', photoUrl: '', status: 'Active', rating: 5, services: '' });
                    setActiveFormType('artist');
                  }}
                  className="flex items-center gap-2"
                >
                  <Plus className="w-4 h-4" /> Add Team Expert
                </Button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {artists.map(a => {
                const isSelected = selectedIds.includes(a.id);
                return (
                  <div key={a.id} className={`bg-white border rounded-2xl overflow-hidden p-5 space-y-4 shadow-sm transition-all relative ${
                    isSelected ? 'border-[#B85C72] ring-2 ring-[#B85C72]/20' : 'border-stone-200'
                  }`}>
                    <div className="absolute top-4 left-4">
                      <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={() => toggleSelect(a.id)}
                        className="rounded cursor-pointer accent-[#B85C72] w-4 h-4"
                        aria-label={`Select ${a.name}`}
                      />
                    </div>
                    <div className="aspect-square w-24 h-24 rounded-full overflow-hidden mx-auto border-2 border-[#B85C72]">
                      <img src={a.photoUrl} alt={a.name} className="w-full h-full object-cover" />
                    </div>

                    <div className="text-center space-y-1">
                      <h4 className="font-serif text-lg font-bold text-stone-800">{a.name}</h4>
                      <span className="text-xs text-[#B85C72] font-semibold block">{a.role}</span>
                    </div>

                    <div className="border-t border-stone-100 pt-3 space-y-1.5 text-xs text-stone-600">
                      <div className="flex justify-between">
                        <span>Experience:</span>
                        <span className="font-bold text-stone-800">{a.experience}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Specialty:</span>
                        <span className="font-bold text-stone-800">{a.specialty}</span>
                      </div>
                    </div>

                    {a.services && a.services.length > 0 && (
                      <div className="flex flex-wrap gap-1 pt-1">
                        {(a.services || []).map((svc, i) => (
                          <span key={i} className="px-2 py-0.5 bg-rose-50 text-[#B85C72] text-[10px] font-semibold rounded-md border border-rose-100">
                            {svc}
                          </span>
                        ))}
                      </div>
                    )}

                    <div className="flex items-center gap-2 border-t border-stone-100 pt-4">
                      <button
                        onClick={() => {
                          setSelectedFormId(a.id);
                          setArtistForm({ name: a.name, role: a.role, experience: a.experience, specialty: a.specialty, bio: a.bio, photoUrl: a.photoUrl, status: a.status, rating: a.rating, services: (a.services || []).join(', ') });
                          setActiveFormType('artist');
                        }}
                        className="flex-1 py-2 bg-stone-50 hover:bg-stone-100 rounded-lg border border-stone-200 text-xs font-semibold cursor-pointer text-center text-stone-700 transition-colors"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleMoveToTrash('artists', a.id, a.name, a.role)}
                        className="p-2 border border-amber-200 text-amber-600 hover:bg-amber-50 rounded-lg cursor-pointer transition-colors"
                        title="Move to Trash (Soft Delete)"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => requestPermanentDelete('artists', a.id, a.name)}
                        className="p-2 border border-stone-200 text-stone-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg cursor-pointer transition-colors"
                        title="Delete Permanently"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* TAB 7: REVIEWS */}
        {activeTab === 'reviews' && (
          <div className="space-y-6 animate-fade-in">
            <div className="flex flex-wrap items-center justify-between gap-3 bg-white p-4 rounded-2xl border border-stone-200">
              <div>
                <h3 className="font-serif text-lg font-bold text-stone-800">Customer Testimonials & Reviews ({reviews.length})</h3>
                <p className="text-xs text-stone-500">Approve pending reviews, moderate customer feedback, or clean out test reviews.</p>
              </div>
              <div className="flex flex-wrap items-center gap-2">
                <label className="flex items-center gap-2 cursor-pointer text-xs font-semibold text-stone-700 select-none bg-stone-50 hover:bg-stone-100 px-3 py-2 rounded-xl border border-stone-200 transition-colors">
                  <input
                    type="checkbox"
                    checked={reviews.length > 0 && reviews.every(r => selectedIds.includes(r.id))}
                    onChange={() => toggleSelectAll(reviews.map(r => r.id))}
                    className="rounded cursor-pointer accent-[#B85C72]"
                  />
                  Select All ({reviews.length})
                </label>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {reviews.map(r => {
                const isSelected = selectedIds.includes(r.id);
                return (
                  <div key={r.id} className={`bg-white border rounded-2xl p-6 space-y-4 shadow-sm transition-all ${
                    isSelected ? 'border-[#B85C72] ring-2 ring-[#B85C72]/20' : 'border-stone-200'
                  }`}>
                    <div className="flex justify-between items-start">
                      <div className="flex items-center gap-3">
                        <input
                          type="checkbox"
                          checked={isSelected}
                          onChange={() => toggleSelect(r.id)}
                          className="rounded cursor-pointer accent-[#B85C72] w-4 h-4"
                          aria-label={`Select review by ${r.customerName}`}
                        />
                        <img src={r.profileImageUrl} alt={r.customerName} className="w-9 h-9 rounded-full object-cover border border-stone-100" />
                        <div>
                          <h5 className="font-bold text-sm text-stone-800">{r.customerName}</h5>
                          <span className="text-[10px] text-stone-400 font-semibold">{r.serviceName}</span>
                        </div>
                      </div>

                      <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-semibold border ${
                        r.status === 'Approved' ? 'bg-emerald-50 border-emerald-200 text-emerald-600' : 'bg-amber-50 border-amber-200 text-amber-600'
                      }`}>
                        {r.status}
                      </span>
                    </div>

                    <p className="text-xs text-stone-600 italic leading-relaxed">&ldquo;{r.reviewContent}&rdquo;</p>

                    <div className="flex items-center gap-2 pt-2 border-t border-stone-100">
                      {r.status === 'Pending' && (
                        <button
                          onClick={() => approveReview(r.id)}
                          className="flex-1 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-bold cursor-pointer flex items-center justify-center gap-1.5 transition-colors"
                        >
                          <Check className="w-4 h-4" /> Approve Feedback
                        </button>
                      )}
                      <button
                        onClick={() => handleMoveToTrash('reviews', r.id, r.customerName, r.serviceName)}
                        className="py-2 px-3 border border-amber-200 text-amber-600 hover:bg-amber-50 rounded-lg cursor-pointer text-xs font-semibold flex items-center justify-center gap-1 transition-colors"
                        title="Move to Trash (Soft Delete)"
                      >
                        <Trash2 className="w-4 h-4" /> Trash
                      </button>
                      <button
                        onClick={() => requestPermanentDelete('reviews', r.id, `Review by ${r.customerName}`)}
                        className="py-2 px-3 border border-stone-200 text-stone-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg cursor-pointer text-xs font-semibold flex items-center justify-center gap-1 transition-colors"
                        title="Delete Permanently"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* TAB 8: OFFERS */}
        {activeTab === 'offers' && (
          <div className="space-y-6 animate-fade-in">
            <div className="flex flex-wrap items-center justify-between gap-3 bg-white p-4 rounded-2xl border border-stone-200">
              <div>
                <h3 className="font-serif text-lg font-bold text-stone-800">Special Promo Offers ({offers.length})</h3>
                <p className="text-xs text-stone-500">Create discount coupons, festive vouchers, and seasonal promotional banners.</p>
              </div>
              <div className="flex flex-wrap items-center gap-2">
                <label className="flex items-center gap-2 cursor-pointer text-xs font-semibold text-stone-700 select-none bg-stone-50 hover:bg-stone-100 px-3 py-2 rounded-xl border border-stone-200 transition-colors">
                  <input
                    type="checkbox"
                    checked={offers.length > 0 && offers.every(o => selectedIds.includes(o.id))}
                    onChange={() => toggleSelectAll(offers.map(o => o.id))}
                    className="rounded cursor-pointer accent-[#B85C72]"
                  />
                  Select All ({offers.length})
                </label>
                <Button
                  variant="accent"
                  onClick={() => {
                    setSelectedFormId(null);
                    setOfferForm({ title: '', description: '', code: '', discountValue: 500, type: 'discount', status: 'Active' });
                    setActiveFormType('offer');
                  }}
                  className="flex items-center gap-2"
                >
                  <Plus className="w-4 h-4" /> Create Offer
                </Button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {offers.map(o => {
                const isSelected = selectedIds.includes(o.id);
                return (
                  <div key={o.id} className={`bg-white border rounded-2xl p-6 flex flex-col justify-between shadow-sm transition-all ${
                    isSelected ? 'border-[#B85C72] ring-2 ring-[#B85C72]/20' : 'border-stone-200'
                  }`}>
                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <div className="flex items-center gap-2.5">
                          <input
                            type="checkbox"
                            checked={isSelected}
                            onChange={() => toggleSelect(o.id)}
                            className="rounded cursor-pointer accent-[#B85C72] w-4 h-4"
                            aria-label={`Select ${o.title}`}
                          />
                          <span className="text-[10px] text-[#B85C72] uppercase font-bold tracking-widest">{o.type} offer</span>
                        </div>
                        <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold ${
                          o.status === 'Active' ? 'bg-emerald-50 text-emerald-600 border border-emerald-200' : 'bg-red-50 text-red-600 border border-red-200'
                        }`}>
                          {o.status}
                        </span>
                      </div>

                      <h4 className="font-serif text-lg font-bold text-stone-800">{o.title}</h4>
                      <p className="text-xs text-stone-500">{o.description}</p>
                      {o.code && (
                        <span className="inline-block bg-[#FFF9F7] border border-[#F5DDE1] font-mono text-xs px-3 py-1 rounded text-[#B85C72] font-semibold">
                          CODE: {o.code}
                        </span>
                      )}
                    </div>

                    <div className="flex items-center gap-2 border-t border-stone-100 pt-4 mt-6">
                      <button
                        onClick={() => {
                          setSelectedFormId(o.id);
                          setOfferForm({ title: o.title, description: o.description, code: o.code || '', discountValue: o.discountValue || 0, type: o.type, status: o.status });
                          setActiveFormType('offer');
                        }}
                        className="flex-1 py-2 bg-stone-50 hover:bg-stone-100 rounded-lg border border-stone-200 text-xs font-semibold cursor-pointer text-center text-stone-700 transition-colors"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleMoveToTrash('offers', o.id, o.title, o.code ? `Code: ${o.code}` : undefined)}
                        className="p-2 border border-amber-200 text-amber-600 hover:bg-amber-50 rounded-lg cursor-pointer transition-colors"
                        title="Move to Trash (Soft Delete)"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => requestPermanentDelete('offers', o.id, o.title)}
                        className="p-2 border border-stone-200 text-stone-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg cursor-pointer transition-colors"
                        title="Delete Permanently"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* TAB: TRASH & RECYCLE BIN */}
        {activeTab === 'trash' && (
          <div className="space-y-6 animate-fade-in">
            {/* Header & Controls */}
            <div className="flex flex-wrap items-center justify-between gap-4 bg-white p-5 rounded-3xl border border-stone-200 shadow-sm">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center">
                    <Trash2 className="w-4 h-4" />
                  </div>
                  <h3 className="font-serif text-xl font-bold text-stone-800">
                    Trash & Recycle Bin ({trash.length})
                  </h3>
                </div>
                <p className="text-xs text-stone-500 max-w-xl">
                  Deleted records are safely moved here before permanent removal. You can restore any item with its original data intact, or permanently delete items to free up space.
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-2">
                {trash.length > 0 && (
                  <>
                    <button
                      onClick={requestEmptyTrash}
                      className="px-3.5 py-2 bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 text-xs font-semibold rounded-xl flex items-center gap-1.5 transition-colors cursor-pointer"
                    >
                      <Trash2 className="w-3.5 h-3.5" /> Empty Trash
                    </button>
                  </>
                )}
              </div>
            </div>

            {/* Filter Pills */}
            <div className="flex flex-wrap items-center gap-2 bg-stone-50/80 p-2 rounded-2xl border border-stone-200">
              <span className="text-xs font-semibold text-stone-500 px-2">Filter by Type:</span>
              {(['all', 'appointments', 'services', 'packages', 'gallery', 'reels', 'glowups', 'artists', 'reviews', 'offers'] as const).map(type => {
                const count = type === 'all' ? trash.length : trash.filter(t => t.entityType === type).length;
                const isSelected = trashFilterType === type;
                return (
                  <button
                    key={type}
                    onClick={() => setTrashFilterType(type)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer flex items-center gap-1.5 ${
                      isSelected
                        ? 'bg-[#B85C72] text-white shadow-xs'
                        : 'bg-white text-stone-600 hover:bg-stone-100 border border-stone-200'
                    }`}
                  >
                    <span className="capitalize">{type}</span>
                    <span className={`text-[10px] px-1.5 py-0.2 rounded-full ${isSelected ? 'bg-white/25 text-white' : 'bg-stone-100 text-stone-600'}`}>
                      {count}
                    </span>
                  </button>
                );
              })}
            </div>

            {/* Trash Items List / Table */}
            {filteredTrash.length > 0 ? (
              <div className="bg-white border border-stone-200 rounded-2xl overflow-hidden shadow-sm">
                <div className="overflow-x-auto">
                  <table className="w-full border-collapse text-left text-xs">
                    <thead>
                      <tr className="bg-stone-50 text-stone-500 border-b border-stone-200 uppercase tracking-widest font-sans font-bold">
                        <th className="p-4 w-10 text-center">
                          <input
                            type="checkbox"
                            checked={filteredTrash.length > 0 && filteredTrash.every(t => selectedIds.includes(t.trashId))}
                            onChange={() => toggleSelectAll(filteredTrash.map(t => t.trashId))}
                            className="rounded cursor-pointer accent-[#B85C72]"
                            aria-label="Select all trashed items"
                          />
                        </th>
                        <th className="p-4">Entity Type</th>
                        <th className="p-4">Item Name / Summary</th>
                        <th className="p-4">Details</th>
                        <th className="p-4">Moved to Trash</th>
                        <th className="p-4 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-stone-100 text-stone-700">
                      {filteredTrash.map(item => {
                        const isSelected = selectedIds.includes(item.trashId);
                        return (
                          <tr key={item.trashId} className={`hover:bg-stone-50/60 transition-colors ${isSelected ? 'bg-rose-50/40' : ''}`}>
                            <td className="p-4 w-10 text-center">
                              <input
                                type="checkbox"
                                checked={isSelected}
                                onChange={() => toggleSelect(item.trashId)}
                                className="rounded cursor-pointer accent-[#B85C72]"
                                aria-label={`Select trashed item ${item.title}`}
                              />
                            </td>
                            <td className="p-4">
                              <span className="inline-block px-2 py-0.5 rounded-md text-[10px] uppercase font-bold tracking-wider bg-stone-100 text-stone-700 border border-stone-200">
                                {item.entityType}
                              </span>
                            </td>
                            <td className="p-4 font-semibold text-stone-800">
                              {item.title}
                            </td>
                            <td className="p-4 text-stone-500 text-[11px] max-w-xs truncate">
                              {item.subtitle || '—'}
                            </td>
                            <td className="p-4 text-stone-400 text-[11px] whitespace-nowrap">
                              {new Date(item.trashedAt).toLocaleString()}
                            </td>
                            <td className="p-4 text-right">
                              <div className="flex items-center justify-end gap-2">
                                <button
                                  onClick={() => handleRestoreFromTrash(item.trashId, item.title)}
                                  className="px-2.5 py-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-200 rounded-lg font-semibold flex items-center gap-1 cursor-pointer transition-colors text-xs"
                                  title="Restore to original location"
                                >
                                  <RotateCcw className="w-3.5 h-3.5" /> Restore
                                </button>
                                <button
                                  onClick={() => requestDeleteFromTrash(item.trashId, item.title)}
                                  className="px-2.5 py-1.5 bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 rounded-lg font-semibold flex items-center gap-1 cursor-pointer transition-colors text-xs"
                                  title="Permanently remove"
                                >
                                  <Trash2 className="w-3.5 h-3.5" /> Delete Forever
                                </button>
                              </div>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            ) : (
              <div className="bg-white border border-dashed border-stone-200 rounded-3xl p-12 text-center space-y-3">
                <div className="w-12 h-12 rounded-2xl bg-stone-100 text-stone-400 mx-auto flex items-center justify-center">
                  <Trash2 className="w-6 h-6" />
                </div>
                <h4 className="font-serif text-lg font-bold text-stone-700">Trash is empty</h4>
                <p className="text-xs text-stone-400 max-w-md mx-auto">
                  No deleted items found {trashFilterType !== 'all' ? `for the "${trashFilterType}" filter` : 'in the recycle bin'}. Whenever you delete records from services, appointments, or packages, they will appear here safely.
                </p>
              </div>
            )}
          </div>
        )}

        {/* TAB 8.5: AUTOMATIONS */}
        {activeTab === 'automations' && (
          <div className="space-y-6 animate-fade-in max-w-5xl">
            <div className="bg-[#FFF9F7] border border-[#F5DDE1] rounded-3xl p-6 md:p-8 space-y-4 shadow-sm">
              <span className="text-[10px] uppercase tracking-widest text-[#D4A373] block font-bold">
                Automations & Relays
              </span>
              <h3 className="font-serif text-2xl font-bold text-[#24191B]">Automated 24-Hour Client Reminders</h3>
              <p className="text-xs text-stone-600 max-w-2xl leading-relaxed">
                Connect your salon database with serverless cron schedulers to dispatch personalized reminders exactly 24 hours prior to appointment slots. This decreases appointment cancellations and no-shows by up to 35%.
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-3">
                <div className="p-4 bg-white border border-[#F5DDE1] rounded-2xl flex items-start gap-3">
                  <div className="p-2 bg-rose-50 text-[#B85C72] rounded-xl">
                    <Mail className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-[#24191B]">SMTP Email Relay</h4>
                    <p className="text-[10px] text-stone-500 mt-1">Dispatches beautifully styled HTML invitations containing treatment details, stylist assignments, and custom navigation maps.</p>
                  </div>
                </div>
                
                <div className="p-4 bg-white border border-[#F5DDE1] rounded-2xl flex items-start gap-3">
                  <div className="p-2 bg-amber-50 text-amber-600 rounded-xl">
                    <MessageSquare className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-[#24191B]">Twilio SMS Relay</h4>
                    <p className="text-[10px] text-stone-500 mt-1">Sends immediate, concise text messages with direct short-links for rescheduling and emergency desk contact info.</p>
                  </div>
                </div>
              </div>
            </div>

            {/* LIVE TRIGGER SIMULATOR */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              
              {/* TRIGGER PANEL */}
              <div className="lg:col-span-5 bg-white border border-stone-200 rounded-3xl p-6 space-y-4 shadow-sm">
                <h4 className="font-serif text-base font-bold text-[#24191B] flex items-center gap-2">
                  <span>⚙️</span> Interactive Trigger Simulator
                </h4>
                <p className="text-[11px] text-stone-500">
                  Execute a manual dry-run of the scheduler. It will identify any client bookings scheduled for tomorrow, output standard console logs, and dispatch simulated notifications.
                </p>
                
                <button
                  type="button"
                  onClick={runAutomationScanner}
                  disabled={simStatus === 'scanning'}
                  className="w-full bg-[#B85C72] hover:bg-[#a04e61] text-white rounded-xl py-3 px-4 text-xs font-bold tracking-wide transition-all shadow-md shadow-rose-950/10 cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {simStatus === 'scanning' ? (
                    <>
                      <div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      Scanning Database...
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-3.5 h-3.5" />
                      Run 24h Reminder Scanner
                    </>
                  )}
                </button>

                {/* Simulated Terminal Logger */}
                <div className="space-y-1.5">
                  <span className="block text-[10px] font-bold text-stone-400 uppercase tracking-widest flex items-center gap-1.5">
                    <Terminal className="w-3.5 h-3.5" /> Simulation Console Output
                  </span>
                  <div className="bg-stone-900 rounded-2xl p-4 font-mono text-[10px] text-stone-200 space-y-1.5 h-44 overflow-y-auto border border-stone-800">
                    {simLogs.length === 0 ? (
                      <span className="text-stone-500 italic">No runs executed. Click "Run 24h Reminder Scanner" to execute a simulation cycle.</span>
                    ) : (
                      simLogs.map((log, idx) => {
                        let color = 'text-stone-300';
                        if (log.startsWith('[SYSTEM]')) color = 'text-amber-400 font-bold';
                        if (log.startsWith('[FIRESTORE]')) color = 'text-blue-400';
                        if (log.startsWith('[DISPATCH]')) color = 'text-emerald-400';
                        if (log.startsWith('[SMS]') || log.startsWith('[EMAIL]')) color = 'text-purple-400';
                        return <div key={idx} className={color}>{log}</div>;
                      })
                    )}
                  </div>
                </div>
              </div>

              {/* DISPATCH RESULTS */}
              <div className="lg:col-span-7 bg-white border border-stone-200 rounded-3xl p-6 space-y-4 shadow-sm flex flex-col justify-between">
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <h4 className="font-serif text-base font-bold text-[#24191B]">Dispatched Reminders</h4>
                    <span className="px-2.5 py-1 bg-rose-50 text-[#B85C72] border border-[#F5DDE1] text-[10px] font-bold rounded-full">
                      Tomorrow: {(() => {
                        const tom = new Date();
                        tom.setDate(tom.getDate() + 1);
                        return tom.toLocaleDateString('default', { month: 'short', day: 'numeric', year: 'numeric' });
                      })()}
                    </span>
                  </div>
                  
                  {simStatus === 'idle' && (
                    <div className="h-64 border border-dashed border-stone-200 rounded-2xl flex flex-col items-center justify-center text-center p-6">
                      <Clock className="w-8 h-8 text-stone-300 mb-2 animate-bounce" />
                      <span className="text-xs font-semibold text-stone-400 uppercase tracking-wider">Awaiting Simulation Scan</span>
                      <p className="text-[10px] text-stone-400 mt-1 max-w-xs">Run the database scheduler on the left to see computed reminders and template structures here.</p>
                    </div>
                  )}

                  {simStatus === 'scanning' && (
                    <div className="h-64 flex flex-col items-center justify-center space-y-3">
                      <div className="w-8 h-8 border-3 border-[#B85C72]/20 border-t-[#B85C72] rounded-full animate-spin" />
                      <span className="text-xs font-bold text-[#B85C72] animate-pulse">Filtering Firestore Bookings...</span>
                    </div>
                  )}

                  {simStatus === 'done' && (
                    <div className="space-y-3">
                      {simMatches.length === 0 ? (
                        <div className="h-64 border border-dashed border-stone-200 rounded-2xl flex flex-col items-center justify-center text-center p-6">
                          <Check className="w-8 h-8 text-emerald-400 mb-2" />
                          <span className="text-xs font-semibold text-stone-500 uppercase">Scanner Complete</span>
                          <p className="text-[10px] text-stone-400 mt-1 max-w-xs">Zero confirmed appointments were scheduled for tomorrow, so no notifications were triggered.</p>
                        </div>
                      ) : (
                        <div className="space-y-2.5 max-h-72 overflow-y-auto pr-1">
                          {simMatches.map(appt => (
                            <div key={appt.bookingId} className="p-3 border border-stone-200 bg-stone-50/50 rounded-2xl flex justify-between items-center hover:border-[#D4A373] transition-colors">
                              <div className="space-y-1">
                                <span className="text-xs font-bold text-[#24191B] block">{appt.customerName}</span>
                                <span className="text-[10px] text-stone-500 block">Time: {appt.time} | Service: {appt.serviceName}</span>
                                <span className="text-[9px] font-bold text-stone-400 block tracking-wider">ID: #{appt.bookingId}</span>
                              </div>
                              <button
                                type="button"
                                onClick={() => setSelectedSimPreview(appt)}
                                className="px-3 py-1.5 border border-[#F5DDE1] hover:border-[#B85C72] hover:bg-white text-[10px] font-semibold text-[#B85C72] rounded-xl transition-colors cursor-pointer"
                              >
                                Preview Formats
                              </button>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  )}
                </div>

                {/* DEPLOYMENT EXPLAINER */}
                <div className="p-4 bg-amber-50/50 border border-amber-100 rounded-2xl flex items-start gap-3">
                  <ShieldAlert className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                  <p className="text-[10px] text-amber-800 leading-relaxed">
                    <strong>Preview Simulation Note:</strong> Running this scanner creates real internal notifications so you can inspect alert counts in real-time. Twilio and SMTP relays will trigger live emails when credentials are set in your private environment.
                  </p>
                </div>
              </div>
            </div>

            {/* PRODUCTION CODE BLOCK FOR DEPLOYMENT */}
            <div className="bg-white border border-stone-200 rounded-3xl p-6 md:p-8 space-y-4 shadow-sm">
              <div className="flex justify-between items-center border-b border-stone-100 pb-3">
                <div>
                  <h4 className="font-serif text-base font-bold text-[#24191B]">Firebase Cloud Function Deployment Code</h4>
                  <p className="text-[10px] text-stone-500 mt-0.5">Copy this codebase directly into your Cloud Functions directory to establish the cron scheduler.</p>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    navigator.clipboard.writeText(`/**
 * Firebase Cloud Functions v2 - Automated 24-Hour Appointment Reminders
 */
const { onSchedule } = require('firebase-functions/v2/scheduler');
const admin = require('firebase-admin');
const nodemailer = require('nodemailer');
const twilio = require('twilio');

admin.initializeApp();
const db = admin.firestore();

exports.sendAutomatedReminders = onSchedule({
  schedule: '0 9 * * *',
  timeZone: 'Asia/Kolkata',
  secrets: ['TWILIO_ACCOUNT_SID', 'TWILIO_AUTH_TOKEN', 'TWILIO_PHONE_NUMBER', 'SMTP_EMAIL', 'SMTP_PASSWORD'],
}, async (event) => {
  // Query confirmed appointments for tomorrow...
});`);
                    triggerToast('Deployment stub copied to clipboard!');
                  }}
                  className="px-3.5 py-1.5 border border-[#F5DDE1] hover:border-[#B85C72] text-[#B85C72] rounded-xl text-xs font-semibold cursor-pointer flex items-center gap-1.5 transition-colors bg-white hover:bg-[#FFF9F7]"
                >
                  <Copy className="w-3.5 h-3.5" /> Copy Config File
                </button>
              </div>

              <div className="bg-stone-50 border border-stone-200 rounded-2xl p-4 space-y-3">
                <span className="text-[10px] font-bold text-stone-400 uppercase tracking-widest block">Deployment Steps</span>
                <ol className="list-decimal list-inside text-xs text-stone-600 space-y-1.5 leading-relaxed">
                  <li>Run <code className="bg-stone-100 text-[#B85C72] px-1.5 py-0.5 rounded text-[11px] font-mono">npm install -g firebase-tools</code>.</li>
                  <li>Login to your Firebase Cloud environment: <code className="bg-stone-100 text-[#B85C72] px-1.5 py-0.5 rounded text-[11px] font-mono">firebase login</code>.</li>
                  <li>Initialize Cloud Functions inside your repository: <code className="bg-stone-100 text-[#B85C72] px-1.5 py-0.5 rounded text-[11px] font-mono">firebase init functions</code>.</li>
                  <li>Copy our pre-built <code className="bg-stone-100 text-stone-800 px-1.5 py-0.5 rounded text-[11px] font-mono">/functions/index.js</code> code directly into your newly created folder.</li>
                  <li>Register secrets in the Firebase console using <code className="bg-stone-100 text-stone-800 px-1.5 py-0.5 rounded text-[11px] font-mono">firebase functions:secrets:set</code> commands.</li>
                  <li>Deploy to production: <code className="bg-stone-100 text-emerald-700 px-1.5 py-0.5 rounded text-[11px] font-mono">firebase deploy --only functions</code>.</li>
                </ol>
              </div>
            </div>

            {/* PREVIEW MODAL */}
            {selectedSimPreview && (
              <Modal
                isOpen={!!selectedSimPreview}
                onClose={() => setSelectedSimPreview(null)}
                title={`Reminder Formats: ${selectedSimPreview.customerName}`}
              >
                <div className="space-y-5">
                  {/* SMS PREVIEW */}
                  <div className="space-y-2">
                    <span className="block text-[10px] font-bold text-stone-400 uppercase tracking-wider">Simulated Twilio SMS</span>
                    <div className="bg-[#FFF9F7] border border-[#F5DDE1] rounded-2xl p-4 text-xs text-stone-700 relative">
                      <div className="absolute top-2.5 right-3 px-1.5 py-0.5 bg-amber-50 text-amber-700 rounded text-[9px] font-bold border border-amber-200">
                        SMS Template
                      </div>
                      <p className="font-sans leading-relaxed mt-2">
                        Hi {selectedSimPreview.customerName}, this is a reminder from Glow & Grace! Your scheduled appointment for '{selectedSimPreview.serviceName}' is tomorrow at {selectedSimPreview.time}. We look forward to pampering you! Booking ID: {selectedSimPreview.bookingId}.
                      </p>
                    </div>
                  </div>

                  {/* EMAIL PREVIEW */}
                  <div className="space-y-2">
                    <span className="block text-[10px] font-bold text-stone-400 uppercase tracking-wider">Simulated SMTP Email (HTML)</span>
                    <div className="border border-stone-200 bg-stone-50 rounded-2xl p-3 max-h-72 overflow-y-auto">
                      <div className="bg-white border border-[#F5DDE1] rounded-2xl p-5 space-y-4 max-w-md mx-auto">
                        <h3 className="font-serif text-lg font-bold text-center text-[#B85C72]">Glow & Grace Sanctuary</h3>
                        <p className="text-xs text-stone-700">Dear <strong>{selectedSimPreview.customerName}</strong>,</p>
                        <p className="text-xs text-stone-700 leading-relaxed">We are absolutely thrilled to welcome you back to our sanctuary tomorrow!</p>
                        <div className="border-t border-b border-dashed border-[#F5DDE1] py-3 text-xs text-stone-700 space-y-1.5">
                          <p>👑 <strong>Treatment:</strong> {selectedSimPreview.serviceName}</p>
                          <p>📅 <strong>Date:</strong> {selectedSimPreview.date}</p>
                          <p>⏰ <strong>Time:</strong> {selectedSimPreview.time}</p>
                          <p>🏷️ <strong>Booking Reference:</strong> #{selectedSimPreview.bookingId}</p>
                        </div>
                        <p className="text-[10px] text-stone-400 text-center font-serif italic">See you soon!</p>
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-end pt-2">
                    <button
                      type="button"
                      onClick={() => setSelectedSimPreview(null)}
                      className="px-4 py-2 bg-stone-800 hover:bg-stone-900 text-white text-xs font-bold rounded-xl cursor-pointer"
                    >
                      Close Previews
                    </button>
                  </div>
                </div>
              </Modal>
            )}
          </div>
        )}

        {/* TAB 10: SEO SETTINGS */}
        {activeTab === 'seo' && (
          <div className="bg-white border border-stone-200 p-6 md:p-8 rounded-3xl space-y-6 animate-fade-in max-w-2xl shadow-sm">
            <div className="space-y-1">
              <span className="text-[10px] uppercase font-bold tracking-widest text-[#B85C72]">Search Engine Optimization</span>
              <h3 className="font-serif text-xl font-bold text-stone-800">SEO Meta & Social Sharing Settings</h3>
              <p className="text-xs text-stone-500">Configure search engine meta titles, descriptions, keywords, and OpenGraph (OG) preview images saved directly in Firebase.</p>
            </div>

            <div className="space-y-4 pt-2">
              <div>
                <label className="block text-xs text-stone-500 mb-1 font-bold uppercase tracking-wider">Meta Title (Browser & Search Snippet) *</label>
                <input
                  type="text"
                  value={settings.metaTitle || 'Glow & Grace | Luxury Ladies Parlour & Bridal Studio'}
                  onChange={e => onSettingsUpdate({ ...settings, metaTitle: e.target.value })}
                  placeholder="Glow & Grace | Luxury Ladies Parlour & Bridal Studio"
                  className="w-full bg-[#FFF9F7] border border-[#F5DDE1] rounded-xl py-3 px-4 text-sm outline-none focus:border-[#D4A373] text-stone-800"
                />
                <p className="text-[11px] text-stone-400 mt-1">Recommended: 50-60 characters.</p>
              </div>

              <div>
                <label className="block text-xs text-stone-500 mb-1 font-bold uppercase tracking-wider">Meta Description (SERP Snippet) *</label>
                <textarea
                  rows={3}
                  value={settings.metaDescription || 'Experience expert bridal makeup, hair styling, facials, and luxury salon services at Glow & Grace.'}
                  onChange={e => onSettingsUpdate({ ...settings, metaDescription: e.target.value })}
                  placeholder="Experience expert bridal makeup, hair styling..."
                  className="w-full bg-[#FFF9F7] border border-[#F5DDE1] rounded-xl py-3 px-4 text-sm outline-none focus:border-[#D4A373] text-stone-800 resize-none"
                />
                <p className="text-[11px] text-stone-400 mt-1">Recommended: 150-160 characters for optimal search snippets.</p>
              </div>

              <div>
                <label className="block text-xs text-stone-500 mb-1 font-bold uppercase tracking-wider">Search Keywords *</label>
                <input
                  type="text"
                  value={settings.keywords || 'bridal makeup, ladies parlour, hair spa, facial, salon near me'}
                  onChange={e => onSettingsUpdate({ ...settings, keywords: e.target.value })}
                  placeholder="bridal makeup, ladies parlour, hair spa, salon"
                  className="w-full bg-[#FFF9F7] border border-[#F5DDE1] rounded-xl py-3 px-4 text-sm outline-none focus:border-[#D4A373] text-stone-800"
                />
              </div>

              <div>
                <label className="block text-xs text-stone-500 mb-1 font-bold uppercase tracking-wider">OpenGraph (OG) Social Share Image URL *</label>
                <input
                  type="url"
                  value={settings.ogImageUrl || 'https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=1200&auto=format&fit=crop&q=80'}
                  onChange={e => onSettingsUpdate({ ...settings, ogImageUrl: e.target.value })}
                  placeholder="https://images.unsplash.com/..."
                  className="w-full bg-[#FFF9F7] border border-[#F5DDE1] rounded-xl py-3 px-4 text-sm outline-none focus:border-[#D4A373] text-stone-800"
                />
                <p className="text-[11px] text-stone-400 mt-1">Displayed when shared on WhatsApp, Facebook, Twitter, and LinkedIn.</p>
              </div>

              <div className="pt-4">
                <Button 
                  variant="accent" 
                  onClick={() => triggerToast('SEO settings successfully saved to Firebase Firestore!')}
                  className="w-full font-bold shadow-md"
                >
                  Save SEO Settings to Firebase
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* TAB 9: WEBSITE SETTINGS */}
        {activeTab === 'settings' && (
          <div className="bg-white border border-stone-200 p-6 md:p-8 rounded-3xl space-y-6 animate-fade-in max-w-2xl shadow-sm">
            <h3 className="font-serif text-xl font-bold mb-4 text-stone-800">Website Global Settings</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-xs text-stone-500 mb-1 font-bold uppercase tracking-wider">WhatsApp Number *</label>
                <input
                  type="text"
                  value={settings.whatsappNumber}
                  onChange={e => onSettingsUpdate({ ...settings, whatsappNumber: e.target.value })}
                  className="w-full bg-[#FFF9F7] border border-[#F5DDE1] rounded-xl py-3 px-4 text-sm outline-none focus:border-[#D4A373] text-stone-800"
                />
              </div>

              <div>
                <label className="block text-xs text-stone-500 mb-1 font-bold uppercase tracking-wider">Desk Phone Number *</label>
                <input
                  type="text"
                  value={settings.phoneNumber}
                  onChange={e => onSettingsUpdate({ ...settings, phoneNumber: e.target.value })}
                  className="w-full bg-[#FFF9F7] border border-[#F5DDE1] rounded-xl py-3 px-4 text-sm outline-none focus:border-[#D4A373] text-stone-800"
                />
              </div>

              <div>
                <label className="block text-xs text-stone-500 mb-1 font-bold uppercase tracking-wider">Public Address *</label>
                <input
                  type="text"
                  value={settings.salonAddress}
                  onChange={e => onSettingsUpdate({ ...settings, salonAddress: e.target.value })}
                  className="w-full bg-[#FFF9F7] border border-[#F5DDE1] rounded-xl py-3 px-4 text-sm outline-none focus:border-[#D4A373] text-stone-800"
                />
              </div>

              <div>
                <label className="block text-xs text-stone-500 mb-1 font-bold uppercase tracking-wider">Lounge Email *</label>
                <input
                  type="text"
                  value={settings.emailAddress}
                  onChange={e => onSettingsUpdate({ ...settings, emailAddress: e.target.value })}
                  className="w-full bg-[#FFF9F7] border border-[#F5DDE1] rounded-xl py-3 px-4 text-sm outline-none focus:border-[#D4A373] text-stone-800"
                />
              </div>

              <div>
                <label className="block text-xs text-stone-500 mb-1 font-bold uppercase tracking-wider">Opening Timings *</label>
                <input
                  type="text"
                  value={settings.openingHours}
                  onChange={e => onSettingsUpdate({ ...settings, openingHours: e.target.value })}
                  className="w-full bg-[#FFF9F7] border border-[#F5DDE1] rounded-xl py-3 px-4 text-sm outline-none focus:border-[#D4A373] text-stone-800"
                />
              </div>
            </div>

            {/* FULL WEBSITE SYNC & CLOUD PERSISTENCE PANEL */}
            <div className="mt-8 bg-gradient-to-br from-white to-[#FFF5F6] border-2 border-[#F5DDE1] rounded-2xl p-6 space-y-5">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-[#F5DDE1]">
                <div>
                  <div className="flex items-center gap-2">
                    <Database className="w-5 h-5 text-[#B85C72]" />
                    <h3 className="font-serif text-lg font-bold text-stone-800">Full Website Cloud Synchronization</h3>
                  </div>
                  <p className="text-xs text-stone-500 mt-1">
                    Synchronize all website modules, service images, pricing catalogs, and salon settings directly with Firebase Firestore.
                  </p>
                </div>
                {lastSyncTime && (
                  <div className="inline-flex items-center gap-1.5 bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs px-3 py-1.5 rounded-xl font-semibold">
                    <CheckCircle className="w-3.5 h-3.5" />
                    <span>Last Synced: {lastSyncTime}</span>
                  </div>
                )}
              </div>

              {/* Entity Schema & Synchronization Status Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
                <div className="bg-white border border-stone-200 rounded-xl p-3">
                  <span className="text-xs text-stone-400 block uppercase font-bold">Services</span>
                  <span className="text-lg font-bold text-[#B85C72]">{services.length}</span>
                  <span className="text-[10px] text-emerald-600 font-semibold block">Schema: 'image' enforced</span>
                </div>
                <div className="bg-white border border-stone-200 rounded-xl p-3">
                  <span className="text-xs text-stone-400 block uppercase font-bold">Packages</span>
                  <span className="text-lg font-bold text-[#B85C72]">{packages.length}</span>
                  <span className="text-[10px] text-emerald-600 font-semibold block">Tiered Pricing</span>
                </div>
                <div className="bg-white border border-stone-200 rounded-xl p-3">
                  <span className="text-xs text-stone-400 block uppercase font-bold">Artists</span>
                  <span className="text-lg font-bold text-[#B85C72]">{artists.length}</span>
                  <span className="text-[10px] text-emerald-600 font-semibold block">Profiles & Roles</span>
                </div>
                <div className="bg-white border border-stone-200 rounded-xl p-3">
                  <span className="text-xs text-stone-400 block uppercase font-bold">Gallery Items</span>
                  <span className="text-lg font-bold text-[#B85C72]">{gallery.length}</span>
                  <span className="text-[10px] text-emerald-600 font-semibold block">Showcase Media</span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-3 pt-2">
                <button
                  type="button"
                  onClick={handleFullWebsiteSync}
                  disabled={isSyncingWebsite}
                  className="flex-1 py-3 px-4 bg-[#B85C72] hover:bg-[#9e4a5d] text-white rounded-xl text-xs font-bold flex items-center justify-center gap-2 shadow-sm transition-all cursor-pointer"
                >
                  <RefreshCw className={`w-4 h-4 ${isSyncingWebsite ? 'animate-spin' : ''}`} />
                  <span>{isSyncingWebsite ? 'Syncing Entire Website...' : 'Sync Entire Website to Firestore'}</span>
                </button>

                <button
                  type="button"
                  onClick={handleAuditServiceSchema}
                  disabled={isAuditingSchema}
                  className="py-3 px-4 bg-white hover:bg-stone-50 border border-stone-300 text-stone-700 rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition-all cursor-pointer"
                >
                  <RefreshCw className={`w-4 h-4 ${isAuditingSchema ? 'animate-spin text-[#B85C72]' : ''}`} />
                  <span>{isAuditingSchema ? 'Auditing Schema...' : "Audit Service 'image' Schema"}</span>
                </button>

                <button
                  type="button"
                  onClick={async () => {
                    if (confirm('Re-seed the Indian Heritage theme (Royal Bridal, Haldi, Sangeet, Mehendi) to Firestore?')) {
                      setIsProcessing(true);
                      try {
                        await forceSeedIndianHeritageTheme();
                        triggerToast('Indian Heritage Theme re-seeded successfully.');
                      } catch (err: any) {
                        triggerToast(err.message || 'Failed to re-seed theme.');
                      } finally {
                        setIsProcessing(false);
                      }
                    }
                  }}
                  className="py-3 px-4 bg-[#FFF0F2] hover:bg-[#FFE4E8] border border-[#F5DDE1] text-[#B85C72] rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition-all cursor-pointer"
                >
                  <Sparkles className="w-4 h-4 text-[#D4A373]" />
                  <span>Seed Heritage Theme</span>
                </button>
              </div>
            </div>

            <Button variant="accent" className="w-full mt-4" onClick={() => triggerToast('Global Settings synchronized.')}>
              Confirm Global Synchronization
            </Button>
          </div>
        )}

        {/* TAB 10: MAINTENANCE */}
        {activeTab === 'maintenance' && (
          <div className="bg-white border border-stone-200 p-6 md:p-8 rounded-3xl space-y-6 animate-fade-in max-w-2xl shadow-sm">
            <h3 className="font-serif text-xl font-bold mb-4 text-stone-800">Database Maintenance</h3>
            
            <div className="mt-8 bg-gradient-to-br from-white to-rose-50 border-2 border-rose-100 rounded-2xl p-6 space-y-5">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-rose-100">
                <div>
                  <div className="flex items-center gap-2">
                    <Trash2 className="w-5 h-5 text-rose-600" />
                    <h3 className="font-serif text-lg font-bold text-stone-800">Clean Database</h3>
                  </div>
                  <p className="text-xs text-stone-500 mt-1">
                    Remove all records marked as inactive, rejected, or identified as test/demo placeholder data.
                  </p>
                </div>
              </div>

              <div className="pt-2">
                <button
                  type="button"
                  onClick={handleCleanDatabase}
                  className="w-full py-3 px-4 bg-white hover:bg-rose-50 border border-stone-300 hover:border-rose-300 text-rose-600 rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition-all cursor-pointer"
                >
                  <Trash2 className="w-4 h-4" />
                  <span>Run Database Cleanup</span>
                </button>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* --- FORM DIALOG MODALS POPUPS --- */}
      
      {/* 1. SERVICE FORM DIALOG */}
      <Modal isOpen={activeFormType === 'service'} onClose={() => setActiveFormType(null)} title={selectedFormId ? "Edit Service" : "Add Service"}>
        <form onSubmit={handleServiceFormSubmit} className="space-y-4">
          <div>
            <label className="block text-xs text-[#24191B]/60 mb-1 font-bold">Service Name *</label>
            <input type="text" required value={serviceForm.name} onChange={e => setServiceForm(p => ({ ...p, name: e.target.value }))} className="w-full bg-[#FFF9F7] border border-[#F5DDE1] rounded-xl py-2.5 px-3 text-sm text-[#24191B]" />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs text-[#24191B]/60 mb-1 font-bold">Category *</label>
              <select value={serviceForm.category} onChange={e => setServiceForm(p => ({ ...p, category: e.target.value }))} className="w-full bg-[#FFF9F7] border border-[#F5DDE1] rounded-xl py-2.5 px-3 text-sm text-[#24191B]">
                {['Makeup', 'Hair', 'Skin & Facial', 'Grooming', 'Nails', 'Bridal Services'].map(c => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs text-[#24191B]/60 mb-1 font-bold">Status *</label>
              <select value={serviceForm.status} onChange={e => setServiceForm(p => ({ ...p, status: e.target.value as 'Active' | 'Inactive', active: e.target.value === 'Active' }))} className="w-full bg-[#FFF9F7] border border-[#F5DDE1] rounded-xl py-2.5 px-3 text-sm text-[#24191B]">
                <option value="Active">Active</option>
                <option value="Inactive">Inactive</option>
              </select>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="flex items-center gap-2 mt-2">
              <input type="checkbox" id="servicePopular" checked={serviceForm.popular} onChange={e => setServiceForm(p => ({ ...p, popular: e.target.checked }))} className="w-4 h-4 accent-[#B85C72]" />
              <label htmlFor="servicePopular" className="text-xs text-[#24191B]/60 font-bold cursor-pointer">Mark as Popular Pick</label>
            </div>
            <div>
              <label className="block text-xs text-[#24191B]/60 mb-1 font-bold">Display Order</label>
              <input type="number" value={serviceForm.displayOrder} onChange={e => setServiceForm(p => ({ ...p, displayOrder: parseInt(e.target.value) || 0 }))} className="w-full bg-[#FFF9F7] border border-[#F5DDE1] rounded-xl py-2.5 px-3 text-sm text-[#24191B]" />
            </div>
          </div>
          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="block text-xs text-[#24191B]/60 mb-1 font-bold">Price (₹) *</label>
              <input type="number" required value={serviceForm.startingPrice} onChange={e => setServiceForm(p => ({ ...p, startingPrice: parseInt(e.target.value) || 0 }))} className="w-full bg-[#FFF9F7] border border-[#F5DDE1] rounded-xl py-2.5 px-3 text-sm text-[#24191B]" />
            </div>
            <div>
              <label className="block text-xs text-[#24191B]/60 mb-1 font-bold">Orig. Price (₹)</label>
              <input type="number" value={serviceForm.originalPrice || ''} placeholder="Optional" onChange={e => setServiceForm(p => ({ ...p, originalPrice: parseInt(e.target.value) || 0 }))} className="w-full bg-[#FFF9F7] border border-[#F5DDE1] rounded-xl py-2.5 px-3 text-sm text-[#24191B]" />
            </div>
            <div>
              <label className="block text-xs text-[#24191B]/60 mb-1 font-bold">Discount (%)</label>
              <input type="number" value={serviceForm.discount || ''} placeholder="Optional" onChange={e => setServiceForm(p => ({ ...p, discount: parseInt(e.target.value) || 0 }))} className="w-full bg-[#FFF9F7] border border-[#F5DDE1] rounded-xl py-2.5 px-3 text-sm text-[#24191B]" />
            </div>
          </div>
          <div>
            <label className="block text-xs text-[#24191B]/60 mb-1 font-bold">Duration (mins) *</label>
            <input type="number" required value={serviceForm.duration} onChange={e => setServiceForm(p => ({ ...p, duration: parseInt(e.target.value) || 0 }))} className="w-full bg-[#FFF9F7] border border-[#F5DDE1] rounded-xl py-2.5 px-3 text-sm text-[#24191B]" />
          </div>
          <div>
            <label className="block text-xs text-[#24191B]/60 mb-1 font-bold">Description *</label>
            <textarea required rows={3} value={serviceForm.description} onChange={e => setServiceForm(p => ({ ...p, description: e.target.value }))} className="w-full bg-[#FFF9F7] border border-[#F5DDE1] rounded-xl py-2.5 px-3 text-sm text-[#24191B]" />
          </div>
          <div className="space-y-1">
            <ImageUploader
              label="Service Image (URL or Upload)"
              value={serviceForm.image || serviceForm.imageUrl}
              onChange={val => setServiceForm(p => ({ ...p, imageUrl: val, image: val }))}
              placeholder="e.g. https://images.unsplash.com/photo-... or upload file"
            />
            <p className="text-[11px] text-stone-400">
              Saves the image path correctly to Firestore under both <code className="text-[#B85C72] font-mono font-semibold">image</code> (URL) and <code className="text-[#B85C72] font-mono font-semibold">imageUrl</code> attributes.
            </p>
          </div>
          <Button type="submit" variant="primary" className="w-full">Save & Sync to Firestore</Button>
        </form>
      </Modal>

      {/* 2. PACKAGE FORM DIALOG */}
      <Modal isOpen={activeFormType === 'package'} onClose={() => setActiveFormType(null)} title={selectedFormId ? "Edit Package" : "Create Package"}>
        <form onSubmit={handlePackageFormSubmit} className="space-y-4">
          <div>
            <label className="block text-xs text-[#24191B]/60 mb-1 font-bold">Package Name *</label>
            <input type="text" required value={packageForm.name} onChange={e => setPackageForm(p => ({ ...p, name: e.target.value }))} className="w-full bg-[#FFF9F7] border border-[#F5DDE1] rounded-xl py-2.5 px-3 text-sm text-[#24191B]" />
          </div>
          <div>
            <label className="block text-xs text-[#24191B]/60 mb-1 font-bold">Investment Price (₹) *</label>
            <input type="number" required value={packageForm.price} onChange={e => setPackageForm(p => ({ ...p, price: parseInt(e.target.value) || 0 }))} className="w-full bg-[#FFF9F7] border border-[#F5DDE1] rounded-xl py-2.5 px-3 text-sm text-[#24191B]" />
          </div>
          <div>
            <label className="block text-xs text-[#24191B]/60 mb-1 font-bold">Description *</label>
            <textarea required rows={2} value={packageForm.description} onChange={e => setPackageForm(p => ({ ...p, description: e.target.value }))} className="w-full bg-[#FFF9F7] border border-[#F5DDE1] rounded-xl py-2.5 px-3 text-sm text-[#24191B]" />
          </div>
          <div>
            <label className="block text-xs text-[#24191B]/60 mb-1 font-bold">Features list (One per line) *</label>
            <textarea required rows={4} placeholder="HD base finishing&#10;Lash application&#10;Traditional draping" value={packageForm.features} onChange={e => setPackageForm(p => ({ ...p, features: e.target.value }))} className="w-full bg-[#FFF9F7] border border-[#F5DDE1] rounded-xl py-2.5 px-3 text-sm text-[#24191B]" />
          </div>
          <div className="flex items-center gap-2 py-2">
            <input type="checkbox" id="pkg-popular" checked={packageForm.isPopular} onChange={e => setPackageForm(p => ({ ...p, isPopular: e.target.checked }))} className="cursor-pointer" />
            <label htmlFor="pkg-popular" className="text-xs text-[#24191B] font-bold cursor-pointer">Mark as Most Popular package</label>
          </div>
          <Button type="submit" variant="primary" className="w-full">Save Package</Button>
        </form>
      </Modal>

      {/* 3. ARTIST FORM DIALOG */}
      <Modal isOpen={activeFormType === 'artist'} onClose={() => setActiveFormType(null)} title={selectedFormId ? "Edit Artist" : "Add Expert"}>
        <form onSubmit={handleArtistFormSubmit} className="space-y-4">
          <div>
            <label className="block text-xs text-[#24191B]/60 mb-1 font-bold">Artist Name *</label>
            <input type="text" required value={artistForm.name} onChange={e => setArtistForm(p => ({ ...p, name: e.target.value }))} className="w-full bg-[#FFF9F7] border border-[#F5DDE1] rounded-xl py-2.5 px-3 text-sm text-[#24191B]" />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs text-[#24191B]/60 mb-1 font-bold">Role *</label>
              <select value={artistForm.role} onChange={e => setArtistForm(p => ({ ...p, role: e.target.value }))} className="w-full bg-[#FFF9F7] border border-[#F5DDE1] rounded-xl py-2.5 px-3 text-sm text-[#24191B]">
                <option value="Senior Makeup Artist">Senior Makeup Artist</option>
                <option value="Hair Specialist">Hair Specialist</option>
                <option value="Skin Expert">Skin Expert</option>
              </select>
            </div>
            <div>
              <label className="block text-xs text-[#24191B]/60 mb-1 font-bold">Experience *</label>
              <input type="text" required value={artistForm.experience} onChange={e => setArtistForm(p => ({ ...p, experience: e.target.value }))} className="w-full bg-[#FFF9F7] border border-[#F5DDE1] rounded-xl py-2.5 px-3 text-sm text-[#24191B]" />
            </div>
          </div>
          <div>
            <label className="block text-xs text-[#24191B]/60 mb-1 font-bold">Specialty *</label>
            <input type="text" required value={artistForm.specialty} onChange={e => setArtistForm(p => ({ ...p, specialty: e.target.value }))} className="w-full bg-[#FFF9F7] border border-[#F5DDE1] rounded-xl py-2.5 px-3 text-sm text-[#24191B]" />
          </div>
          <div>
            <label className="block text-xs text-[#24191B]/60 mb-1 font-bold">Services Offered (Comma Separated)</label>
            <input
              type="text"
              placeholder="e.g. Bridal Makeup, HD Makeup, Party Makeup, Hair Styling"
              value={artistForm.services}
              onChange={e => setArtistForm(p => ({ ...p, services: e.target.value }))}
              className="w-full bg-[#FFF9F7] border border-[#F5DDE1] rounded-xl py-2.5 px-3 text-sm text-[#24191B]"
            />
            <span className="text-[10px] text-stone-400 mt-1 block">Separate services with commas to create tag badges</span>
          </div>
          <div>
            <label className="block text-xs text-[#24191B]/60 mb-1 font-bold">Bio Details *</label>
            <textarea required rows={3} value={artistForm.bio} onChange={e => setArtistForm(p => ({ ...p, bio: e.target.value }))} className="w-full bg-[#FFF9F7] border border-[#F5DDE1] rounded-xl py-2.5 px-3 text-sm text-[#24191B]" />
          </div>
          <ImageUploader
            label="Photo (Local File or Remote URL) *"
            value={artistForm.photoUrl}
            onChange={val => setArtistForm(p => ({ ...p, photoUrl: val }))}
            placeholder="e.g. https://images.unsplash.com/photo-..."
          />
          <Button type="submit" variant="primary" className="w-full">Save Expert</Button>
        </form>
      </Modal>

      {/* 4. GALLERY SHOT DIALOG */}
      <Modal isOpen={activeFormType === 'gallery'} onClose={() => setActiveFormType(null)} title="Upload Gallery Shot">
        <form onSubmit={handleGalleryFormSubmit} className="space-y-4">
          <div>
            <label className="block text-xs text-[#24191B]/60 mb-1 font-bold">Shot Title *</label>
            <input type="text" required value={galleryForm.title} onChange={e => setGalleryForm(p => ({ ...p, title: e.target.value }))} className="w-full bg-[#FFF9F7] border border-[#F5DDE1] rounded-xl py-2.5 px-3 text-sm text-[#24191B]" />
          </div>
          <div>
            <label className="block text-xs text-[#24191B]/60 mb-1 font-bold">Category *</label>
            <select value={galleryForm.category} onChange={e => setGalleryForm(p => ({ ...p, category: e.target.value }))} className="w-full bg-[#FFF9F7] border border-[#F5DDE1] rounded-xl py-2.5 px-3 text-sm text-[#24191B]">
              {['Makeup', 'Hair', 'Skin & Facial', 'Grooming', 'Bridal Services'].map(c => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-xs text-[#24191B]/60 mb-1 font-bold">Description *</label>
            <textarea required rows={2} value={galleryForm.description} onChange={e => setGalleryForm(p => ({ ...p, description: e.target.value }))} className="w-full bg-[#FFF9F7] border border-[#F5DDE1] rounded-xl py-2.5 px-3 text-sm text-[#24191B]" />
          </div>
          <ImageUploader
            label="Direct Gallery Image *"
            value={galleryForm.imageUrl}
            onChange={val => setGalleryForm(p => ({ ...p, imageUrl: val }))}
            placeholder="e.g. https://images.unsplash.com/photo-..."
          />
          <Button type="submit" variant="primary" className="w-full">Upload Shot</Button>
        </form>
      </Modal>

      {/* REEL FORM DIALOG */}
      <Modal isOpen={activeFormType === 'reel'} onClose={() => setActiveFormType(null)} title={selectedFormId ? "Edit Beauty Reel" : "Add Beauty Reel"}>
        <form onSubmit={handleReelFormSubmit} className="space-y-4">
          <div className="flex justify-between items-center bg-stone-50 p-3 rounded-xl border border-stone-100">
            <span className="text-sm font-bold text-stone-700">Reel Active (Show on Website)</span>
            <input type="checkbox" checked={reelForm.active} onChange={e => setReelForm(p => ({ ...p, active: e.target.checked }))} className="w-5 h-5 accent-[#B85C72]" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs text-[#24191B]/60 mb-1 font-bold">Title *</label>
              <input type="text" required value={reelForm.title} onChange={e => setReelForm(p => ({ ...p, title: e.target.value }))} className="w-full bg-[#FFF9F7] border border-[#F5DDE1] rounded-xl py-2 px-3 text-sm" />
            </div>
            <div>
              <label className="block text-xs text-[#24191B]/60 mb-1 font-bold">Category *</label>
              <select required value={reelForm.category} onChange={e => setReelForm(p => ({ ...p, category: e.target.value }))} className="w-full bg-[#FFF9F7] border border-[#F5DDE1] rounded-xl py-2 px-3 text-sm">
                <option>Bridal</option>
                <option>Makeup</option>
                <option>Hair</option>
                <option>Skin & Facial</option>
                <option>Grooming</option>
                <option>Nails</option>
              </select>
            </div>
          </div>
          <div>
            <label className="block text-xs text-[#24191B]/60 mb-1 font-bold">Video URL (Required) *</label>
            <input type="url" required value={reelForm.videoUrl} onChange={e => setReelForm(p => ({ ...p, videoUrl: e.target.value }))} placeholder="https://firebasestorage.googleapis.com/.../video.mp4" className="w-full bg-[#FFF9F7] border border-[#F5DDE1] rounded-xl py-2 px-3 text-sm" />
          </div>
          <div>
            <label className="block text-xs text-[#24191B]/60 mb-1 font-bold">Thumbnail Image URL *</label>
            <ImageUploader 
              value={reelForm.thumbnailUrl} 
              onChange={url => setReelForm(p => ({ ...p, thumbnailUrl: url }))}
            />
          </div>
          <div>
            <label className="block text-xs text-[#24191B]/60 mb-1 font-bold">Description</label>
            <textarea rows={2} value={reelForm.description} onChange={e => setReelForm(p => ({ ...p, description: e.target.value }))} className="w-full bg-[#FFF9F7] border border-[#F5DDE1] rounded-xl py-2 px-3 text-sm" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs text-[#24191B]/60 mb-1 font-bold">Display Order</label>
              <input type="number" value={reelForm.displayOrder} onChange={e => setReelForm(p => ({ ...p, displayOrder: parseInt(e.target.value) || 0 }))} className="w-full bg-[#FFF9F7] border border-[#F5DDE1] rounded-xl py-2 px-3 text-sm" />
            </div>
            <div>
              <label className="block text-xs text-[#24191B]/60 mb-1 font-bold">Likes (Fake or Initial)</label>
              <input type="number" value={reelForm.likes} onChange={e => setReelForm(p => ({ ...p, likes: parseInt(e.target.value) || 0 }))} className="w-full bg-[#FFF9F7] border border-[#F5DDE1] rounded-xl py-2 px-3 text-sm" />
            </div>
          </div>
          <Button type="submit" variant="primary" className="w-full py-3">{selectedFormId ? 'Save Changes' : 'Upload Beauty Reel'}</Button>
        </form>
      </Modal>

      {/* GLOWUP FORM DIALOG */}
      <Modal isOpen={activeFormType === 'glowup'} onClose={() => setActiveFormType(null)} title={selectedFormId ? "Edit Glow-Up" : "Add Glow-Up"}>
        <form onSubmit={handleGlowupFormSubmit} className="space-y-4">
          <div className="flex justify-between items-center bg-stone-50 p-3 rounded-xl border border-stone-100">
            <span className="text-sm font-bold text-stone-700">Active (Show on Website)</span>
            <input type="checkbox" checked={glowupForm.active} onChange={e => setGlowupForm(p => ({ ...p, active: e.target.checked }))} className="w-5 h-5 accent-[#B85C72]" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs text-[#24191B]/60 mb-1 font-bold">Title *</label>
              <input type="text" required value={glowupForm.title} onChange={e => setGlowupForm(p => ({ ...p, title: e.target.value }))} className="w-full bg-[#FFF9F7] border border-[#F5DDE1] rounded-xl py-2 px-3 text-sm" />
            </div>
            <div>
              <label className="block text-xs text-[#24191B]/60 mb-1 font-bold">Category *</label>
              <select required value={glowupForm.category} onChange={e => setGlowupForm(p => ({ ...p, category: e.target.value }))} className="w-full bg-[#FFF9F7] border border-[#F5DDE1] rounded-xl py-2 px-3 text-sm">
                <option>Bridal</option>
                <option>Makeup</option>
                <option>Hair</option>
                <option>Skin & Facial</option>
              </select>
            </div>
          </div>
          <div>
            <label className="block text-xs text-[#24191B]/60 mb-1 font-bold">Before Image URL *</label>
            <ImageUploader 
              value={glowupForm.beforeImage} 
              onChange={url => setGlowupForm(p => ({ ...p, beforeImage: url }))}
            />
          </div>
          <div>
            <label className="block text-xs text-[#24191B]/60 mb-1 font-bold">After Image URL *</label>
            <ImageUploader 
              value={glowupForm.afterImage} 
              onChange={url => setGlowupForm(p => ({ ...p, afterImage: url }))}
            />
          </div>
          <div>
            <label className="block text-xs text-[#24191B]/60 mb-1 font-bold">Description</label>
            <textarea rows={2} value={glowupForm.description} onChange={e => setGlowupForm(p => ({ ...p, description: e.target.value }))} className="w-full bg-[#FFF9F7] border border-[#F5DDE1] rounded-xl py-2 px-3 text-sm" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs text-[#24191B]/60 mb-1 font-bold">Linked Service Name</label>
              <input type="text" value={glowupForm.serviceName} onChange={e => setGlowupForm(p => ({ ...p, serviceName: e.target.value }))} placeholder="e.g. Royal Bridal Makeup" className="w-full bg-[#FFF9F7] border border-[#F5DDE1] rounded-xl py-2 px-3 text-sm" />
            </div>
            <div>
              <label className="block text-xs text-[#24191B]/60 mb-1 font-bold">Starting Price (₹)</label>
              <input type="number" value={glowupForm.price} onChange={e => setGlowupForm(p => ({ ...p, price: parseInt(e.target.value) || 0 }))} className="w-full bg-[#FFF9F7] border border-[#F5DDE1] rounded-xl py-2 px-3 text-sm" />
            </div>
          </div>
          <div>
            <label className="block text-xs text-[#24191B]/60 mb-1 font-bold">Display Order</label>
            <input type="number" value={glowupForm.displayOrder} onChange={e => setGlowupForm(p => ({ ...p, displayOrder: parseInt(e.target.value) || 0 }))} className="w-full bg-[#FFF9F7] border border-[#F5DDE1] rounded-xl py-2 px-3 text-sm" />
          </div>
          <Button type="submit" variant="primary" className="w-full py-3">{selectedFormId ? 'Save Changes' : 'Save Glow-Up'}</Button>
        </form>
      </Modal>

      {/* 5. OFFER FORM DIALOG */}
      <Modal isOpen={activeFormType === 'offer'} onClose={() => setActiveFormType(null)} title={selectedFormId ? "Edit Offer" : "Create Offer"}>
        <form onSubmit={handleOfferFormSubmit} className="space-y-4">
          <div>
            <label className="block text-xs text-[#24191B]/60 mb-1 font-bold">Offer Title *</label>
            <input type="text" required value={offerForm.title} onChange={e => setOfferForm(p => ({ ...p, title: e.target.value }))} className="w-full bg-[#FFF9F7] border border-[#F5DDE1] rounded-xl py-2.5 px-3 text-sm text-[#24191B]" />
          </div>
          <div>
            <label className="block text-xs text-[#24191B]/60 mb-1 font-bold">Description *</label>
            <textarea required rows={2} value={offerForm.description} onChange={e => setOfferForm(p => ({ ...p, description: e.target.value }))} className="w-full bg-[#FFF9F7] border border-[#F5DDE1] rounded-xl py-2.5 px-3 text-sm text-[#24191B]" />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs text-[#24191B]/60 mb-1 font-bold">Promo Code (Optional)</label>
              <input type="text" value={offerForm.code} onChange={e => setOfferForm(p => ({ ...p, code: e.target.value }))} className="w-full bg-[#FFF9F7] border border-[#F5DDE1] rounded-xl py-2.5 px-3 text-sm text-[#24191B]" placeholder="e.g. BRIDAL1000" />
            </div>
            <div>
              <label className="block text-xs text-[#24191B]/60 mb-1 font-bold">Discount value (₹) *</label>
              <input type="number" value={offerForm.discountValue} onChange={e => setOfferForm(p => ({ ...p, discountValue: parseInt(e.target.value) || 0 }))} className="w-full bg-[#FFF9F7] border border-[#F5DDE1] rounded-xl py-2.5 px-3 text-sm text-[#24191B]" />
            </div>
          </div>
          <Button type="submit" variant="primary" className="w-full">Confirm Offer</Button>
        </form>
      </Modal>

    </div>
  );
};
