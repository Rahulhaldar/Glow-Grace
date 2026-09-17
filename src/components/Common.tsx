import React from 'react';
import { MessageCircle, Loader2, AlertCircle, Sparkles, CheckCircle2, Upload, Link, FileImage, X } from 'lucide-react';

// Elegant Primary, Secondary and Accent Button
interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'accent' | 'outline' | 'text';
  size?: 'sm' | 'md' | 'lg';
  children: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  size = 'md',
  children,
  className = '',
  ...props
}) => {
  const baseStyle = "inline-flex items-center justify-center font-medium transition-all duration-300 rounded-full tracking-wide focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 cursor-pointer";
  
  const variants = {
    primary: "bg-[#B85C72] text-[#FFFFFF] hover:bg-[#A34E62] focus:ring-[#B85C72]",
    secondary: "bg-[#24191B] text-[#FFF9F7] hover:bg-black focus:ring-[#24191B]",
    accent: "bg-[#D4A373] text-[#24191B] hover:bg-[#C59262] focus:ring-[#D4A373]",
    outline: "border border-[#B85C72] text-[#B85C72] bg-transparent hover:bg-[#FFF9F7]/30 focus:ring-[#B85C72]",
    text: "text-[#B85C72] bg-transparent hover:underline px-0 py-0 focus:ring-0"
  };

  const sizes = {
    sm: "text-xs px-5 py-2",
    md: "text-sm px-7 py-3",
    lg: "text-base px-9 py-4"
  };

  return (
    <button
      className={`${baseStyle} ${variants[variant]} ${sizes[size]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};

// WhatsApp Button floating
export const WhatsAppButton: React.FC<{ number: string; message?: string }> = ({ 
  number, 
  message = "Hi Glow & Grace, I would like to book an appointment." 
}) => {
  const cleanNum = (number || '').replace(/[^0-9+]/g, '');
  const encodedMsg = encodeURIComponent(message);
  const whatsappUrl = `https://wa.me/${cleanNum}?text=${encodedMsg}`;

  return (
    <a
      href={whatsappUrl}
      target="_blank"
      rel="noopener noreferrer"
      id="floating-whatsapp"
      className="hidden sm:flex fixed bottom-6 right-6 z-50 items-center justify-center bg-[#25D366] text-white p-4 rounded-full shadow-lg hover:scale-105 transition-transform duration-300"
      aria-label="Chat on WhatsApp"
    >
      <MessageCircle className="w-6 h-6 fill-current" />
      <span className="max-w-0 overflow-hidden group-hover:max-w-xs transition-all duration-300 ease-out whitespace-nowrap text-sm font-medium"></span>
    </a>
  );
};

// Toast message component
interface ToastProps {
  message: string;
  type?: 'success' | 'error' | 'info';
  onClose: () => void;
  action?: {
    label: string;
    onClick: () => void;
  };
}

export const Toast: React.FC<ToastProps> = ({ message, type = 'success', onClose, action }) => {
  React.useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, action ? 6000 : 4000);
    return () => clearTimeout(timer);
  }, [onClose, action]);

  const bgColors = {
    success: 'bg-[#24191B] border-[#D4A373]',
    error: 'bg-red-950 border-red-500',
    info: 'bg-[#24191B] border-[#B85C72]'
  };

  const icons = {
    success: <CheckCircle2 className="w-5 h-5 text-[#D4A373] shrink-0" />,
    error: <AlertCircle className="w-5 h-5 text-red-400 shrink-0" />,
    info: <Sparkles className="w-5 h-5 text-[#B85C72] shrink-0" />
  };

  return (
    <div className={`fixed top-6 right-6 z-50 flex items-center gap-3 px-5 py-4 rounded-xl shadow-2xl border ${bgColors[type]} text-white max-w-md animate-fade-in`}>
      {icons[type]}
      <p className="text-sm font-medium leading-tight flex-1">{message}</p>
      {action && (
        <button
          onClick={() => {
            action.onClick();
            onClose();
          }}
          className="px-2.5 py-1 bg-[#B85C72] hover:bg-[#A34E62] text-white text-xs font-bold rounded-lg transition-colors cursor-pointer shrink-0"
        >
          {action.label}
        </button>
      )}
      <button onClick={onClose} className="text-white/50 hover:text-white text-xs ml-auto pl-2 cursor-pointer">&times;</button>
    </div>
  );
};

// Loading State Spinner
export const LoadingState: React.FC<{ message?: string }> = ({ message = "Chasing elegance..." }) => {
  return (
    <div className="flex flex-col items-center justify-center p-12 text-center min-h-[300px]">
      <Loader2 className="w-10 h-10 animate-spin text-[#B85C72] mb-4" />
      <p className="text-[#24191B]/60 font-serif italic text-base">{message}</p>
    </div>
  );
};

// Empty State illustration block
export const EmptyState: React.FC<{ title: string; message: string; actionText?: string; onAction?: () => void }> = ({
  title,
  message,
  actionText,
  onAction
}) => {
  return (
    <div className="flex flex-col items-center justify-center p-12 text-center min-h-[300px] border border-dashed border-[#F5DDE1] rounded-2xl bg-white max-w-md mx-auto">
      <Sparkles className="w-12 h-12 text-[#D4A373] mb-4 opacity-70" />
      <h3 className="text-lg font-serif text-[#24191B] mb-2">{title}</h3>
      <p className="text-[#24191B]/60 text-sm mb-6 leading-relaxed">{message}</p>
      {actionText && onAction && (
        <Button variant="outline" size="sm" onClick={onAction}>
          {actionText}
        </Button>
      )}
    </div>
  );
};

// Error State Block
export const ErrorState: React.FC<{ message?: string; onRetry?: () => void }> = ({
  message = "Something beautifully unexpected occurred.",
  onRetry
}) => {
  return (
    <div className="flex flex-col items-center justify-center p-12 text-center min-h-[300px]">
      <AlertCircle className="w-12 h-12 text-[#B85C72] mb-4" />
      <h3 className="text-lg font-serif text-[#24191B] mb-2">Beautiful Glitch</h3>
      <p className="text-[#24191B]/60 text-sm mb-6">{message}</p>
      {onRetry && (
        <Button variant="outline" size="sm" onClick={onRetry}>
          Try Again
        </Button>
      )}
    </div>
  );
};

// Status Badge
export const StatusBadge: React.FC<{ status: 'Pending' | 'Confirmed' | 'Completed' | 'Cancelled' }> = ({ status }) => {
  const styles = {
    Pending: {
      badge: 'bg-amber-50 text-amber-800 border-amber-200',
      dot: 'bg-amber-500'
    },
    Confirmed: {
      badge: 'bg-emerald-50 text-emerald-800 border-emerald-200',
      dot: 'bg-emerald-500'
    },
    Completed: {
      badge: 'bg-purple-50 text-purple-800 border-purple-200',
      dot: 'bg-purple-500'
    },
    Cancelled: {
      badge: 'bg-rose-50 text-rose-800 border-rose-200',
      dot: 'bg-rose-500'
    }
  };

  const current = styles[status] || styles.Pending;

  return (
    <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border ${current.badge} shadow-sm select-none`}>
      <span className={`w-1.5 h-1.5 rounded-full ${current.dot} shrink-0`} />
      {status}
    </span>
  );
};

// Interactive Dual-mode (Local File or Remote URL) Image Uploader with ImgBB integration
interface ImageUploaderProps {
  value: string;
  onChange: (value: string) => void;
  label?: string;
  placeholder?: string;
}

export const ImageUploader: React.FC<ImageUploaderProps> = ({
  value,
  onChange,
  label = "Upload Image",
  placeholder = "https://images.unsplash.com/..."
}) => {
  const [activeTab, setActiveTab] = React.useState<'local' | 'url'>('local');
  const [isUploading, setIsUploading] = React.useState(false);
  const [uploadError, setUploadError] = React.useState<string | null>(null);
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    setUploadError(null);

    try {
      const apiKey = (import.meta as any).env?.VITE_IMGBB_API_KEY || 'aa84d46cbcd6fe518b023f14655abb69';
      const formData = new FormData();
      formData.append('image', file);

      const response = await fetch(`https://api.imgbb.com/1/upload?key=${apiKey}`, {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`Upload failed (Status ${response.status})`);
      }

      const result = await response.json();
      if (result && result.success && result.data && result.data.url) {
        onChange(result.data.url);
      } else {
        throw new Error(result?.error?.message || 'Could not parse response from ImgBB.');
      }
    } catch (err) {
      console.error('ImgBB Upload Error:', err);
      setUploadError(err instanceof Error ? err.message : 'Error uploading image to ImgBB.');
    } finally {
      setIsUploading(false);
    }
  };

  const clearImage = () => {
    onChange('');
    setUploadError(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="space-y-2">
      <div className="flex justify-between items-center">
        <label className="block text-xs font-bold text-[#24191B]/60">{label}</label>
        <div className="flex bg-stone-100 rounded-lg p-0.5 border border-stone-200">
          <button
            type="button"
            onClick={() => { setActiveTab('local'); setUploadError(null); }}
            className={`px-2.5 py-1 text-[10px] font-bold rounded-md transition-all cursor-pointer flex items-center gap-1 ${activeTab === 'local' ? 'bg-white text-[#B85C72] shadow-sm' : 'text-stone-500 hover:text-stone-700'}`}
          >
            <Upload className="w-3 h-3" /> Local File
          </button>
          <button
            type="button"
            onClick={() => { setActiveTab('url'); setUploadError(null); }}
            className={`px-2.5 py-1 text-[10px] font-bold rounded-md transition-all cursor-pointer flex items-center gap-1 ${activeTab === 'url' ? 'bg-white text-[#B85C72] shadow-sm' : 'text-stone-500 hover:text-stone-700'}`}
          >
            <Link className="w-3 h-3" /> Image Link
          </button>
        </div>
      </div>

      {activeTab === 'local' ? (
        <div className="space-y-3">
          {isUploading ? (
            <div className="border border-dashed border-[#F5DDE1] rounded-2xl p-6 flex flex-col items-center justify-center bg-[#FFF9F7]/10 space-y-2.5">
              <Loader2 className="w-6 h-6 text-[#B85C72] animate-spin" />
              <span className="text-xs font-bold text-[#24191B] animate-pulse">Uploading file to ImgBB...</span>
              <span className="text-[9px] text-stone-400">Your hosted image URL will be saved inside the database.</span>
            </div>
          ) : value ? (
            <div className="relative border border-[#F5DDE1] rounded-2xl p-2 bg-[#FFF9F7]/30 flex items-center gap-3 animate-fade-in">
              <img src={value} alt="Preview" className="w-16 h-16 rounded-xl object-cover border border-stone-200 shrink-0" referrerPolicy="no-referrer" />
              <div className="flex-1 min-w-0">
                <span className="text-[10px] text-emerald-600 font-bold flex items-center gap-1">
                  <FileImage className="w-3 h-3" /> ImgBB Upload Success
                </span>
                <p className="text-[9px] text-stone-400 mt-0.5 truncate">{value}</p>
              </div>
              <button
                type="button"
                onClick={clearImage}
                className="p-1.5 bg-rose-50 text-[#B85C72] hover:bg-rose-100 rounded-xl cursor-pointer transition-colors"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          ) : (
            <div 
              onClick={() => fileInputRef.current?.click()}
              className="border-2 border-dashed border-[#F5DDE1] hover:border-[#B85C72] rounded-2xl p-6 flex flex-col items-center justify-center text-center bg-[#FFF9F7]/10 hover:bg-[#FFF9F7]/40 transition-all cursor-pointer group"
            >
              <Upload className="w-6 h-6 text-[#B85C72] mb-2 group-hover:scale-110 transition-transform" />
              <span className="text-xs font-bold text-[#24191B] block">Drag & Drop or Click to Upload</span>
              <span className="text-[9px] text-stone-400 mt-1 block">Powered by ImgBB API v1. Max 32MB files.</span>
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileChange}
                accept="image/*"
                className="hidden"
              />
            </div>
          )}

          {uploadError && (
            <div className="p-3 bg-rose-50 border border-rose-100 rounded-xl text-[10px] text-rose-600 font-semibold flex items-start gap-2 animate-fade-in">
              <AlertCircle className="w-3.5 h-3.5 shrink-0 mt-0.5" />
              <span>{uploadError}</span>
            </div>
          )}
        </div>
      ) : (
        <div className="space-y-3">
          <input
            type="text"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            className="w-full bg-[#FFF9F7] border border-[#F5DDE1] rounded-xl py-2.5 px-3 text-sm text-[#24191B] outline-none placeholder-stone-400"
            placeholder={placeholder}
          />
          {value && (
            <div className="border border-stone-200 rounded-2xl p-2 bg-stone-50/50 flex items-center gap-3 animate-fade-in">
              <img src={value} alt="Preview" className="w-12 h-12 rounded-xl object-cover shrink-0 border border-stone-200" referrerPolicy="no-referrer" />
              <div className="flex-1 min-w-0">
                <span className="text-[10px] text-stone-500 font-bold block">Remote Image URL</span>
                <p className="text-[9px] text-stone-400 truncate">{value}</p>
              </div>
              <button
                type="button"
                onClick={clearImage}
                className="p-1.5 bg-stone-100 text-stone-500 hover:text-stone-700 hover:bg-stone-200 rounded-xl cursor-pointer"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

