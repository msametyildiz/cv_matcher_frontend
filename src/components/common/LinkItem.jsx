import React from 'react';
import { ExternalLink, Globe, Linkedin, Github, Twitter, Facebook, Instagram } from 'lucide-react';

export const LinkItem = ({ link }) => {
  const getIcon = (url) => {
    if (!url) return <ExternalLink className="h-4 w-4" />;
    
    if (url.includes('linkedin.com')) return <Linkedin className="h-4 w-4" />;
    if (url.includes('github.com')) return <Github className="h-4 w-4" />;
    if (url.includes('twitter.com')) return <Twitter className="h-4 w-4" />;
    if (url.includes('facebook.com')) return <Facebook className="h-4 w-4" />;
    if (url.includes('instagram.com')) return <Instagram className="h-4 w-4" />;
    
    return <Globe className="h-4 w-4" />;
  };
  
  return (
    <a 
      href={link.url} 
      target="_blank" 
      rel="noopener noreferrer"
      className="flex items-center py-2 text-gray-700 hover:text-blue-600"
    >
      <span className="mr-2">{getIcon(link.url)}</span>
      <span>{link.label || new URL(link.url).hostname}</span>
    </a>
  );
};

export default LinkItem;
