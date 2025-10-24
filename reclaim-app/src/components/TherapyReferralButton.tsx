import { useState } from 'react';
import { createClient } from '@/lib/supabase';
import { Heart, ExternalLink, Phone } from 'lucide-react';

interface TherapyReferralProps {
  source: 'safety_plan' | 'manipulation_detected' | 'dashboard' | 'crisis' | 'ai_chat';
  variant?: 'primary' | 'secondary' | 'emergency';
  buttonText: string;
  description?: string;
  className?: string;
}

const PLATFORM_CONFIG = {
  betterhelp: {
    name: 'BetterHelp',
    baseUrl: 'https://www.betterhelp.com/rpc/track/referral/',
    commission: 60,
    specialties: ['trauma', 'abuse recovery', 'PTSD']
  },
  talkspace: {
    name: 'Talkspace',
    baseUrl: 'https://www.talkspace.com/online-therapy/referral/',
    commission: 75,
    specialties: ['trauma specialists', 'narcissistic abuse']
  },
  psychology_today: {
    name: 'Psychology Today',
    baseUrl: 'https://www.psychologytoday.com/us/therapists/referral/',
    commission: 40,
    specialties: ['general therapy', 'local therapists']
  }
};

export default function TherapyReferralButton({ 
  source, 
  variant = 'primary', 
  buttonText, 
  description,
  className = ''
}: TherapyReferralProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const handleReferral = async () => {
    setIsLoading(true);
    
    try {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        // Redirect to signup first
        window.location.href = '/auth/signup?redirect=therapy_referral';
        return;
      }

      // Get optimal platform for this user and source
      const { data: platformData } = await supabase
        .rpc('get_optimal_therapy_platform', {
          p_user_id: user.id,
          p_source: source
        });

      const platform = platformData || getDefaultPlatform(source);
      const referralUrl = generateReferralUrl(platform, user.id, source);

      // Track the referral
      const { data: referral, error } = await supabase
        .from('therapy_referrals')
        .insert({
          user_id: user.id,
          platform,
          referral_source: source,
          referral_url: referralUrl,
          user_agent: navigator.userAgent
        })
        .select()
        .single();

      if (error) throw error;

      // Show success message briefly
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 2000);

      // Open referral URL
      window.open(referralUrl, '_blank', 'noopener,noreferrer');
      
    } catch (error) {
      console.error('Referral tracking failed:', error);
      // Still redirect to therapy platform even if tracking fails
      const fallbackUrl = generateReferralUrl(getDefaultPlatform(source), 'anonymous', source);
      window.open(fallbackUrl, '_blank', 'noopener,noreferrer');
    } finally {
      setIsLoading(false);
    }
  };

  const getDefaultPlatform = (source: string): string => {
    switch (source) {
      case 'crisis':
        return 'betterhelp'; // Best crisis support
      case 'manipulation_detected':
        return 'talkspace'; // Trauma specialists
      case 'safety_plan':
        return 'betterhelp'; // Trauma-informed
      default:
        return 'psychology_today'; // General therapy
    }
  };

  const generateReferralUrl = (platform: string, userId: string, source: string): string => {
    const config = PLATFORM_CONFIG[platform as keyof typeof PLATFORM_CONFIG];
    if (!config) return 'https://www.psychologytoday.com/us/therapists';

    const referralCode = `reclaim_${userId}_${source}_${Date.now()}`;
    const params = new URLSearchParams({
      ref: referralCode,
      source: 'reclaim_app',
      specialty: source === 'crisis' ? 'crisis' : 'trauma',
      utm_source: 'reclaim',
      utm_medium: 'referral',
      utm_campaign: source
    });

    return `${config.baseUrl}?${params.toString()}`;
  };

  const getButtonStyles = () => {
    const baseStyles = 'px-6 py-3 rounded-lg font-medium transition-all duration-200 flex items-center gap-2 justify-center';
    
    switch (variant) {
      case 'emergency':
        return `${baseStyles} bg-red-600 hover:bg-red-700 text-white border-2 border-red-600 shadow-lg hover:shadow-xl`;
      case 'primary':
        return `${baseStyles} bg-blue-600 hover:bg-blue-700 text-white border-2 border-blue-600 shadow-md hover:shadow-lg`;
      case 'secondary':
        return `${baseStyles} bg-green-600 hover:bg-green-700 text-white border-2 border-green-600 shadow-md hover:shadow-lg`;
      default:
        return `${baseStyles} bg-gray-600 hover:bg-gray-700 text-white border-2 border-gray-600`;
    }
  };

  const getIcon = () => {
    switch (variant) {
      case 'emergency':
        return <Phone className="h-5 w-5" />;
      case 'primary':
      case 'secondary':
        return <Heart className="h-5 w-5" />;
      default:
        return <ExternalLink className="h-5 w-5" />;
    }
  };

  const getContainerStyles = () => {
    switch (variant) {
      case 'emergency':
        return 'p-4 bg-gradient-to-r from-red-50 to-pink-50 rounded-lg border-2 border-red-200';
      case 'primary':
        return 'p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg border border-blue-200';
      case 'secondary':
        return 'p-4 bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg border border-green-200';
      default:
        return 'p-4 bg-gray-50 rounded-lg border border-gray-200';
    }
  };

  if (showSuccess) {
    return (
      <div className={`${getContainerStyles()} ${className}`}>
        <div className="text-center">
          <div className="text-green-600 text-2xl mb-2">✓</div>
          <p className="text-green-800 font-medium">Connecting you to professional support...</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`${getContainerStyles()} ${className}`}>
      {description && (
        <div className="mb-4">
          <p className="text-gray-700 text-sm leading-relaxed">{description}</p>
        </div>
      )}
      
      <button
        onClick={handleReferral}
        disabled={isLoading}
        className={`${getButtonStyles()} ${isLoading ? 'opacity-50 cursor-not-allowed' : 'hover:scale-105'} w-full`}
      >
        {getIcon()}
        {isLoading ? 'Connecting...' : buttonText}
      </button>

      {variant === 'emergency' && (
        <div className="mt-3 text-center">
          <p className="text-xs text-gray-600">
            Crisis Hotline: <a href="tel:988" className="text-red-600 font-medium">988</a> | 
            Text: <a href="sms:741741" className="text-red-600 font-medium">HOME to 741741</a>
          </p>
        </div>
      )}

      <div className="mt-2 text-xs text-gray-500 text-center">
        Secure referral • Trauma-informed specialists • Confidential
      </div>
    </div>
  );
}