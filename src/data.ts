import { Service, Package, Artist, GalleryItem, Review, Offer, Appointment, WebsiteSettings, Notification, TrashItem, TrashEntityType } from './types';

export const DEFAULT_SERVICES: Service[] = [];

export const DEFAULT_PACKAGES: Package[] = [];

export const DEFAULT_ARTISTS: Artist[] = [];

export const DEFAULT_GALLERY: GalleryItem[] = [];

export const DEFAULT_REVIEWS: Review[] = [];

export const DEFAULT_OFFERS: Offer[] = [];

export const DEFAULT_SETTINGS: WebsiteSettings = {
  whatsappNumber: '+916033271400',
  salonAddress: '12 Luxury Boulevard, Palace Row, Near Heritage Fountain, Agartala, Tripura - 799001',
  emailAddress: 'hello@glowandgrace.in',
  phoneNumber: '+91 60332 71400',
  openingHours: 'Monday – Sunday, 10:00 AM – 8:00 PM',
  instagramUrl: 'https://instagram.com/glowandgrace_salon',
  mapsUrl: 'https://maps.google.com/?q=Agartala+Tripura',
  iframeMapsUrl: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d29202.836413481232!2d91.26514757317769!3d23.837375211993427!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3753f3f01c8eb1db%3A0x6739920ef0d19f3c!2sAgartala%2C%20Tripura!5e0!3m2!1sen!2sin!4v1726145000000!5m2!1sen!2sin',
  metaTitle: 'Glow & Grace | Luxury Ladies Parlour & Bridal Studio',
  metaDescription: 'Experience expert bridal makeup, hair styling, facials, and luxury salon services at Glow & Grace.',
  ogImageUrl: 'https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=1200&auto=format&fit=crop&q=80',
  keywords: 'bridal makeup, ladies parlour, hair spa, facial, salon'
};

export const DEFAULT_APPOINTMENTS: Appointment[] = [];

export const DEFAULT_NOTIFICATIONS: Notification[] = [];

export const DEFAULT_REELS: any[] = [];
export const DEFAULT_GLOWUPS: any[] = [];
export const DEFAULT_TRASH: TrashItem[] = [];

type SyncListener = (key: string, data: any, prevData: any) => Promise<void> | void;
let syncListener: SyncListener | null = null;

type DeleteHook = (entityType: string, id: string) => Promise<void> | void;
let deleteHook: DeleteHook | null = null;

// Helper database engine that syncs with LocalStorage
export class MockDB {
  static registerSyncListener(listener: SyncListener) {
    syncListener = listener;
  }

  static registerDeleteHook(hook: DeleteHook) {
    deleteHook = hook;
  }

  static init() {
    // Check if database was already initialized once
    const isInitialized = localStorage.getItem('gg_db_initialized_v2');
    if (isInitialized) {
      // PREVENT RE-CREATION: Once initialized, empty arrays ('[]') represent
      // deleted collections and must NEVER be re-seeded or overwritten with demo data.
      return;
    }

    const defaultsMap: Record<string, any> = {
      services: DEFAULT_SERVICES,
      packages: DEFAULT_PACKAGES,
      artists: DEFAULT_ARTISTS,
      gallery: DEFAULT_GALLERY,
      reviews: DEFAULT_REVIEWS,
      offers: DEFAULT_OFFERS,
      appointments: DEFAULT_APPOINTMENTS,
      notifications: DEFAULT_NOTIFICATIONS,
      settings: DEFAULT_SETTINGS,
      reels: DEFAULT_REELS,
      glowups: DEFAULT_GLOWUPS,
      trash: DEFAULT_TRASH,
    };

    // First time setup only: populate keys that have never existed
    Object.entries(defaultsMap).forEach(([key, defaultVal]) => {
      const stored = localStorage.getItem(`gg_${key}`);
      if (stored === null || stored === 'undefined' || stored === 'null') {
        localStorage.setItem(`gg_${key}`, JSON.stringify(defaultVal));
      }
    });

    const cachedSettings = localStorage.getItem('gg_settings');
    if (!cachedSettings) {
      localStorage.setItem('gg_settings', JSON.stringify(DEFAULT_SETTINGS));
    }

    // Mark as initialized to prevent ever re-inserting default data
    localStorage.setItem('gg_db_initialized_v2', 'true');
  }

  static async clearDemoData() {
    return false;
  }

  static get<T>(key: string): T {
    const data = localStorage.getItem(`gg_${key}`);
    if (!data || data === 'undefined' || data === 'null') {
      // Check if it is the settings object to return defaults
      if (key === 'settings') return DEFAULT_SETTINGS as unknown as T;
      return [] as unknown as T;
    }
    try {
      const parsed = JSON.parse(data);
      if (key !== 'settings' && !Array.isArray(parsed)) {
        return [] as unknown as T;
      }
      return parsed;
    } catch (err) {
      console.warn(`[MockDB] Error parsing data for key ${key}:`, err);
      if (key === 'settings') return DEFAULT_SETTINGS as unknown as T;
      return [] as unknown as T;
    }
  }

  static async set(key: string, data: any) {
    // Get previous state from localStorage to find deletions
    const prevDataStr = localStorage.getItem(`gg_${key}`);
    let prevData = null;
    if (prevDataStr && prevDataStr !== 'undefined' && prevDataStr !== 'null') {
      try {
        prevData = JSON.parse(prevDataStr);
      } catch (e) {
        console.warn(`[MockDB] Error parsing previous data for key ${key}`);
      }
    }

    // Save to local state instantly for extreme responsiveness
    localStorage.setItem(`gg_${key}`, JSON.stringify(data));
    window.dispatchEvent(new Event('gg_db_update'));

    if (syncListener) {
      try {
        await syncListener(key, data, prevData);
      } catch (e) {
        console.warn('Real-time replication to Firestore was intercepted or offline:', e);
      }
    }
  }

  // Generic lists
  static getServices(): Service[] { 
    const list = this.get<Service[]>('services');
    return list.map(s => {
      const img = s.image || s.imageUrl || 'https://images.unsplash.com/photo-1481501940778-c8bb63e376c5?w=800&auto=format&fit=crop&q=80';
      return {
        ...s,
        image: img,
        imageUrl: img
      };
    });
  }
  static getPackages() { return this.get<Package[]>('packages'); }
  static getArtists() { return this.get<Artist[]>('artists'); }
  static getGallery() { return this.get<GalleryItem[]>('gallery'); }
  static getReviews() { return this.get<Review[]>('reviews'); }
  static getOffers() { return this.get<Offer[]>('offers'); }
  static getSettings() { return this.get<WebsiteSettings>('settings'); }
  static getAppointments() { return this.get<Appointment[]>('appointments'); }
  static getNotifications() { return this.get<Notification[]>('notifications'); }
  static getReels() { return this.get<any[]>('reels'); }
  static getGlowups() { return this.get<any[]>('glowups'); }
  static getTrash(): TrashItem[] { return this.get<TrashItem[]>('trash') || []; }

  // --- SOFT DELETE / TRASH MANAGEMENT ---
  static async moveToTrash(entityType: TrashEntityType, id: string, title?: string, subtitle?: string): Promise<TrashItem | null> {
    const list = this.get<any[]>(entityType);
    const itemIndex = list.findIndex(item => {
      const itemId = item.id || item.bookingId;
      return String(itemId) === String(id);
    });
    if (itemIndex === -1) return null;

    const item = list[itemIndex];
    const filtered = list.filter((_, idx) => idx !== itemIndex);

    const itemTitle = title || item.name || item.title || item.customerName || item.serviceName || id;
    const itemSubtitle = subtitle || (entityType === 'appointments' ? `${item.serviceName} • ${item.date}` : (item.category || item.role || item.type || ''));

    const trashItem: TrashItem = {
      trashId: `trash-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      originalId: String(id),
      entityType,
      title: String(itemTitle),
      subtitle: String(itemSubtitle),
      trashedAt: new Date().toISOString(),
      data: item
    };

    const currentTrash = this.getTrash();
    const updatedTrash = [trashItem, ...currentTrash];

    await this.set(entityType, filtered);
    await this.set('trash', updatedTrash);

    return trashItem;
  }

  static async bulkMoveToTrash(entityType: TrashEntityType, ids: string[]): Promise<TrashItem[]> {
    const list = this.get<any[]>(entityType);
    const idSet = new Set(ids.map(id => String(id)));
    const movedItems: TrashItem[] = [];
    const remaining: any[] = [];

    list.forEach(item => {
      const itemId = String(item.id || item.bookingId);
      if (idSet.has(itemId)) {
        const itemTitle = item.name || item.title || item.customerName || item.serviceName || itemId;
        const itemSubtitle = entityType === 'appointments' ? `${item.serviceName} • ${item.date}` : (item.category || item.role || item.type || '');
        movedItems.push({
          trashId: `trash-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
          originalId: itemId,
          entityType,
          title: String(itemTitle),
          subtitle: String(itemSubtitle),
          trashedAt: new Date().toISOString(),
          data: item
        });
      } else {
        remaining.push(item);
      }
    });

    if (movedItems.length > 0) {
      const currentTrash = this.getTrash();
      const updatedTrash = [...movedItems, ...currentTrash];
      await this.set(entityType, remaining);
      await this.set('trash', updatedTrash);
    }

    return movedItems;
  }

  static async restoreFromTrash(trashId: string): Promise<boolean> {
    const currentTrash = this.getTrash();
    const trashItem = currentTrash.find(t => t.trashId === trashId);
    if (!trashItem) return false;

    const remainingTrash = currentTrash.filter(t => t.trashId !== trashId);
    const entityList = this.get<any[]>(trashItem.entityType);

    const existingIdx = entityList.findIndex(e => String(e.id || e.bookingId) === String(trashItem.originalId));
    let updatedEntityList: any[];
    if (existingIdx !== -1) {
      updatedEntityList = entityList.map((e, idx) => idx === existingIdx ? trashItem.data : e);
    } else {
      updatedEntityList = [trashItem.data, ...entityList];
    }

    await this.set(trashItem.entityType, updatedEntityList);
    await this.set('trash', remainingTrash);
    return true;
  }

  static async bulkRestoreFromTrash(trashIds: string[]): Promise<number> {
    const currentTrash = this.getTrash();
    const trashIdSet = new Set(trashIds);
    const toRestore = currentTrash.filter(t => trashIdSet.has(t.trashId));
    const remainingTrash = currentTrash.filter(t => !trashIdSet.has(t.trashId));

    if (toRestore.length === 0) return 0;

    const grouped: Record<string, any[]> = {};
    toRestore.forEach(item => {
      if (!grouped[item.entityType]) {
        grouped[item.entityType] = this.get<any[]>(item.entityType);
      }
      const list = grouped[item.entityType];
      const existingIdx = list.findIndex(e => String(e.id || e.bookingId) === String(item.originalId));
      if (existingIdx !== -1) {
        list[existingIdx] = item.data;
      } else {
        list.unshift(item.data);
      }
    });

    for (const [entityType, list] of Object.entries(grouped)) {
      await this.set(entityType, list);
    }
    await this.set('trash', remainingTrash);

    return toRestore.length;
  }

  static async deletePermanentlyFromTrash(trashId: string): Promise<boolean> {
    const currentTrash = this.getTrash();
    const filtered = currentTrash.filter(t => t.trashId !== trashId);
    if (filtered.length !== currentTrash.length) {
      await this.set('trash', filtered);
      return true;
    }
    return false;
  }

  static async bulkDeletePermanentlyFromTrash(trashIds: string[]): Promise<number> {
    const currentTrash = this.getTrash();
    const trashIdSet = new Set(trashIds);
    const remaining = currentTrash.filter(t => !trashIdSet.has(t.trashId));
    const deletedCount = currentTrash.length - remaining.length;
    if (deletedCount > 0) {
      await this.set('trash', remaining);
    }
    return deletedCount;
  }

  static async emptyTrash(): Promise<number> {
    const currentTrash = this.getTrash();
    const count = currentTrash.length;
    await this.set('trash', []);
    return count;
  }

  static async deleteEntityPermanently(entityType: string, id: string): Promise<boolean> {
    const list = this.get<any[]>(entityType);
    const filtered = list.filter(item => {
      const itemId = String(item.id || item.bookingId);
      return itemId !== String(id);
    });

    // Execute direct Firestore deletion hook
    if (deleteHook) {
      try {
        await deleteHook(entityType, id);
      } catch (err) {
        console.warn(`Direct delete hook for ${entityType}/${id}:`, err);
      }
    }

    if (filtered.length !== list.length) {
      await this.set(entityType, filtered);
      return true;
    }
    return false;
  }

  static async bulkDeleteEntitiesPermanently(entityType: string, ids: string[]): Promise<number> {
    const list = this.get<any[]>(entityType);
    const idSet = new Set(ids.map(id => String(id)));
    const filtered = list.filter(item => {
      const itemId = String(item.id || item.bookingId);
      return !idSet.has(itemId);
    });

    // Execute direct Firestore deletion hook for all IDs
    if (deleteHook) {
      for (const id of ids) {
        try {
          await deleteHook(entityType, id);
        } catch (err) {
          console.warn(`Direct delete hook for ${entityType}/${id}:`, err);
        }
      }
    }

    const count = list.length - filtered.length;
    if (count > 0) {
      await this.set(entityType, filtered);
    }
    return count;
  }

  // Appends/Updates
  static saveAppointment(app: Omit<Appointment, 'bookingId' | 'status' | 'createdAt'>) {
    const list = this.getAppointments();
    const prefix = 'GG-2026-';
    const randNum = Math.floor(10000 + Math.random() * 90000); // Unique 5 digits
    const bookingId = `${prefix}${randNum}`;
    
    const newApp: Appointment = {
      ...app,
      id: bookingId,
      bookingId,
      status: 'Pending',
      createdAt: new Date().toISOString()
    };

    list.unshift(newApp);
    this.set('appointments', list);

    // Add a notification
    const notifications = this.getNotifications();
    const newNotif: Notification = {
      id: `n-${Date.now()}`,
      title: 'New appointment request',
      message: `${newApp.customerName} requested an appointment for ${newApp.serviceName}`,
      isRead: false,
      createdAt: new Date().toISOString(),
      bookingId
    };
    notifications.unshift(newNotif);
    this.set('notifications', notifications);

    return newApp;
  }

  static updateAppointmentStatus(bookingId: string, status: Appointment['status'], notes?: string) {
    const list = this.getAppointments();
    const idx = list.findIndex(a => a.bookingId === bookingId);
    if (idx !== -1) {
      list[idx].status = status;
      if (notes !== undefined) {
        list[idx].adminNotes = notes;
      }
      this.set('appointments', list);
    }
  }

  static saveReview(rev: Omit<Review, 'id' | 'status' | 'createdAt'>) {
    const list = this.getReviews();
    const newRev: Review = {
      ...rev,
      id: `r-${Date.now()}`,
      status: 'Pending',
      createdAt: new Date().toISOString().split('T')[0]
    };
    list.unshift(newRev);
    this.set('reviews', list);
    return newRev;
  }
}
