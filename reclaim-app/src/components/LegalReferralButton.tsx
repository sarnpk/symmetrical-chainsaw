import { useState } from 'react';
import { createClient } from '@/lib/supabase';
import { Scale, ExternalLink, Shield } from 'lucide-react';

interface LegalReferralProps {
  source: 'safety_plan' | 'evidence_export' | 'custody_documentation' | 'divorce_planning' | 'manipulation_detected' | 'dashboard';
  variant?: 'primary' | 'secondary' | 'emergency';
  buttonText: string;
  description?: string;
  legalSpecialty?: 'divorce' | 'custody' | 'domestic_violence' | 'family_law';
  className?: string;
}

const LEGAL_PLATFORM_CONFIG = {
  avvo: {
    name: 'Avvo',
    baseUrl: 'https://www.avvo.com/find-a-lawyer/referral/',
    commission: 200,
    specialties: ['family_law', 'divorce', 'custody', 'domestic_violence']
  },
  lawyers_com: {
    name: 'Lawyers.com',
    baseUrl: 'https://www.lawyers.com/find-a-lawyer/referral/',
    commission: 250,
    specialties: ['family_law', 'divorce', 'custody']
  },
  findlaw: {
    name: 'FindLaw',
    baseUrl: 'https://lawyers.findlaw.com/referral/',
    commission: 300,
    specialties: ['family_law', 'divorce', 'custody', 'child_support']
  },
  martindale_hubbell: {
    name: 'Martindale-Hubbell',
    baseUrl: 'https://www.martindale.com/find-a-lawyer/referral/',
    commission: 400,
    specialties: ['family_law', 'divorce', 'custody']
  }
};

export default function LegalReferralButton({ 
  source, 
  variant = 'primary', 
  buttonText, 
  description,
  legalSpecialty = 'family_law',
  className = ''
}: LegalReferralProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const handleReferral = async () => {
    setIsLoading(true);
    
    try {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        // Redirect to signup first
        window.location.href = '/auth/signup?redirect=legal_referral';
        return;
      }

      // Get optimal legal platform for this user and source
      const { data: platformData } = await supabase
        .rpc('get_optimal_legal_platform', {
          p_user_id: user.id,
          p_source: source,
          p_legal_specialty: legalSpecialty
        });

      const platform = platformData || getDefaultPlatform(source);
      const referralUrl = generateLegalReferralUrl(platform, user.id, source, legalSpecialty);

      // Track the legal referral
      const { data: referral, error } = await supabase
        .from('therapy_referrals')
        .insert({
          user_id: user.id,
          platform,
          referral_source: source,
          referral_url: referralUrl,
          referral_type: 'legal',
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
      console.error('Legal referral tracking failed:', error);
      // Still redirect to legal platform even if tracking fails
      const fallbackUrl = generateLegalReferralUrl(getDefaultPlatform(source), 'anonymous', source, legalSpecialty);
      window.open(fallbackUrl, '_blank', 'noopener,noreferrer');
    } finally {
      setIsLoading(false);
    }
  };

  const getDefaultPlatform = (source: string): string => {
    switch (source) {
      case 'evidence_export':
        return 'martindale_hubbell'; // Premium for evidence-based cases
      case 'custody_documentation':
        return 'findlaw'; // Strong custody focus
      case 'divorce_planning':
        return 'lawyers_com'; // Comprehensive divorce services
      case 'safety_plan':
        return 'avvo'; // Good for domestic violence cases
      default:
        return 'avvo'; // General family law
    }
  };

  const generateLegalReferralUrl = (platform: string, userId: string, source: string, specialty: string): string => {
    const config = LEGAL_PLATFORM_CONFIG[platform as keyof typeof LEGAL_PLATFORM_CONFIG];
    if (!config) return 'https://www.avvo.com/find-a-lawyer';

    const referralCode = `reclaim_legal_${userId}_${source}_${Date.now()}`;
    const params = new URLSearchParams({
      ref: referralCode,
      source: 'reclaim_app',
      specialty: specialty,
      practice_area: 'family_law',
      utm_source: 'reclaim',
      utm_medium: 'legal_referral',
      utm_campaign: source,
      evidence_available: 'true' // Key selling point
    });

    return `${config.baseUrl}?${params.toString()}`;
  };

  const getButtonStyles = () => {
    const baseStyles = 'px-6 py-3 rounded-lg font-medium transition-all duration-200 flex items-center gap-2 justify-center';
    
    switch (variant) {
      case 'emergency':
        return `${baseStyles} bg-red-600 hover:bg-red-700 text-white border-2 border-red-600 shadow-lg hover:shadow-xl`;
      case 'primary':
        return `${baseStyles} bg-indigo-600 hover:bg-indigo-700 text-white border-2 border-indigo-600 shadow-md hover:shadow-lg`;
      case 'secondary':
        return `${baseStyles} bg-amber-600 hover:bg-amber-700 text-white border-2 border-amber-600 shadow-md hover:shadow-lg`;
      default:
        return `${baseStyles} bg-gray-600 hover:bg-gray-700 text-white border-2 border-gray-600`;
    }
  };

  const getIcon = () => {
    switch (variant) {
      case 'emergency':
        return <Shield className="h-5 w-5" />;
      case 'primary':
      case 'secondary':
        return <Scale className="h-5 w-5" />;
      default:
        return <ExternalLink className="h-5 w-5" />;
    }
  };

  const getContainerStyles = () => {
    switch (variant) {
      case 'emergency':
        return 'p-4 bg-gradient-to-r from-red-50 to-pink-50 rounded-lg border-2 border-red-200';
      case 'primary':
        return 'p-4 bg-gradient-to-r from-indigo-50 to-blue-50 rounded-lg border border-indigo-200';
      case 'secondary':
        return 'p-4 bg-gradient-to-r from-amber-50 to-yellow-50 rounded-lg border border-amber-200';
      default:
        return 'p-4 bg-gray-50 rounded-lg border border-gray-200';
    }
  };

  if (showSuccess) {
    return (
      <div className={`${getContainerStyles()} ${className}`}>
        <div className="text-center">
          <div className="text-green-600 text-2xl mb-2">âš–ï¸</div>
          <p className="text-green-800 font-medium">Connecting you to legal experts...</p>
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

      <div className="mt-2 text-xs text-gray-500 text-center">
        Court-ready evidence â€¢ Family law specialists â€¢ Confidential consultation
      </div>
    </div>
  );
}