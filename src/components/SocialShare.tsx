"use client";

import { FiFacebook, FiTwitter, FiInstagram, FiShare2 } from 'react-icons/fi';

interface SocialShareProps {
  url?: string;
  title?: string;
}

export default function SocialShare({ url, title }: SocialShareProps) {
  const shareUrl = url || '';
  const shareTitle = title || 'Ancestral Heartbeat - Colombian Handicrafts';

  const handleShare = (platform: string) => {
    let shareLink = '';
    
    switch (platform) {
      case 'facebook':
        shareLink = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`;
        break;
      case 'twitter':
        shareLink = `https://twitter.com/intent/tweet?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(shareTitle)}`;
        break;
      case 'whatsapp':
        shareLink = `https://wa.me/?text=${encodeURIComponent(shareTitle + ' ' + shareUrl)}`;
        break;
    }
    
    if (shareLink) {
      window.open(shareLink, '_blank', 'width=600,height=400');
    }
  };

  const handleNativeShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: shareTitle,
          url: shareUrl,
        });
      } catch {
        // User cancelled sharing
      }
    }
  };

  return (
    <div className="flex items-center gap-3">
      <span className="text-sm font-medium text-gray-600">Share:</span>
      
      <button
        onClick={() => handleShare('facebook')}
        className="p-2 bg-[#1877F2] text-white rounded-lg hover:opacity-90 transition-opacity"
        title="Share on Facebook"
      >
        <FiFacebook className="w-5 h-5" />
      </button>
      
      <button
        onClick={() => handleShare('twitter')}
        className="p-2 bg-[#1DA1F2] text-white rounded-lg hover:opacity-90 transition-opacity"
        title="Share on Twitter"
      >
        <FiTwitter className="w-5 h-5" />
      </button>
      
      <button
        onClick={() => handleShare('whatsapp')}
        className="p-2 bg-[#25D366] text-white rounded-lg hover:opacity-90 transition-opacity"
        title="Share on WhatsApp"
      >
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
        </svg>
      </button>

      {typeof navigator !== 'undefined' && 'share' in navigator && (
        <button
          onClick={handleNativeShare}
          className="p-2 bg-gray-600 text-white rounded-lg hover:opacity-90 transition-opacity"
          title="Share"
        >
          <FiShare2 className="w-5 h-5" />
        </button>
      )}
    </div>
  );
}

// Componente de iconos de redes sociales para el footer
export function SocialIcons() {
  return (
    <div className="flex items-center gap-4">
      <a
        href="https://facebook.com"
        target="_blank"
        rel="noopener noreferrer"
        className="w-10 h-10 flex items-center justify-center bg-[#1877F2] text-white rounded-full hover:opacity-90 transition-opacity"
      >
        <FiFacebook className="w-5 h-5" />
      </a>
      
      <a
        href="https://instagram.com"
        target="_blank"
        rel="noopener noreferrer"
        className="w-10 h-10 flex items-center justify-center bg-gradient-to-tr from-[#FD5949] via-[#D6249F] to-[#285AEB] text-white rounded-full hover:opacity-90 transition-opacity"
      >
        <FiInstagram className="w-5 h-5" />
      </a>
      
      <a
        href="https://twitter.com"
        target="_blank"
        rel="noopener noreferrer"
        className="w-10 h-10 flex items-center justify-center bg-[#1DA1F2] text-white rounded-full hover:opacity-90 transition-opacity"
      >
        <FiTwitter className="w-5 h-5" />
      </a>
    </div>
  );
}
