'use client';

import React from 'react';
import { 
  Share,
  Facebook,
  Twitter,
  MessageCircle
} from 'lucide-react';

interface SocialShareProps {
  title: string;
  url: string;
  description?: string;
}

const SocialShare: React.FC<SocialShareProps> = ({ title, url, description = '' }) => {
  const shareOnFacebook = () => {
    const shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`;
    window.open(shareUrl, '_blank', 'width=600,height=400');
  };

  const shareOnTwitter = () => {
    const text = encodeURIComponent(`${title} - ${description}`);
    const shareUrl = `https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${text}`;
    window.open(shareUrl, '_blank', 'width=600,height=400');
  };

  const shareOnWhatsApp = () => {
    const text = encodeURIComponent(`${title}\n${description}\n\nCheck it out: ${url}`);
    const shareUrl = `https://wa.me/?text=${text}`;
    window.open(shareUrl, '_blank');
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(url);
    alert('Link copied to clipboard!');
  };

  return (
    <div className="flex items-center gap-3">
      <span className="text-sm text-foreground/80">Share:</span>
      <button 
        onClick={shareOnFacebook}
        className="p-2 rounded-full bg-foreground/10 hover:bg-[#1877F2] hover:text-white transition-colors"
        aria-label="Share on Facebook"
      >
        <Facebook className="w-4 h-4" />
      </button>
      <button 
        onClick={shareOnTwitter}
        className="p-2 rounded-full bg-foreground/10 hover:bg-[#1DA1F2] hover:text-white transition-colors"
        aria-label="Share on Twitter"
      >
        <Twitter className="w-4 h-4" />
      </button>
      <button 
        onClick={shareOnWhatsApp}
        className="p-2 rounded-full bg-foreground/10 hover:bg-[#25D366] hover:text-white transition-colors"
        aria-label="Share on WhatsApp"
      >
        <MessageCircle className="w-4 h-4" />
      </button>
      <button 
        onClick={copyToClipboard}
        className="p-2 rounded-full bg-foreground/10 hover:bg-foreground hover:text-background transition-colors"
        aria-label="Copy link"
      >
        <Share className="w-4 h-4" />
      </button>
    </div>
  );
};

export default SocialShare;