import { Product, Category } from '@/types';

export const categories: Category[] = [
  {
    id: 'scripts-modules',
    name: 'Scripts & Modules',
    description: 'High-performance automation scripts and backend modules.',
    image_url: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&q=80&w=800',
  },
  {
    id: 'ui-ux-kits',
    name: 'UI/UX Kits',
    description: 'Premium design systems and user interface kits for modern apps.',
    image_url: 'https://images.unsplash.com/photo-1581291518633-83b4ebd1d83e?auto=format&fit=crop&q=80&w=800',
  },
  {
    id: '3d-assets',
    name: '3D Digital Assets',
    description: 'Professional 3D models and environment kits for games and VR.',
    image_url: 'https://images.unsplash.com/photo-1614850523296-d8c1af93d400?auto=format&fit=crop&q=80&w=800',
  },
  {
    id: 'hardware-dev',
    name: 'Developer Hardware',
    description: 'Specialized hardware for engineers and performance enthusiasts.',
    image_url: 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&q=80&w=800',
  },
];

export const products: Product[] = [
  // Scripts & Modules (Premium focus)
  { 
    id: 's-1', 
    name: 'CyberGuard Node Engine', 
    description: 'Advanced real-time security middleware for Node.js distributed systems.', 
    price: 199, 
    image_url: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc48?auto=format&fit=crop&q=80&w=800', 
    category_id: 'scripts-modules', 
    color: 'Ultraviolet', 
    is_featured_admin: true 
  },
  { 
    id: 's-2', 
    name: 'Quantum Data Streamer', 
    description: 'Ultra-low latency data synchronization module for high-frequency trading.', 
    price: 349, 
    image_url: 'https://images.unsplash.com/photo-1518433278988-c92384f888cc?auto=format&fit=crop&q=80&w=800', 
    category_id: 'scripts-modules', 
    color: 'Neon Cyan' 
  },
  { 
    id: 's-3', 
    name: 'Neural Pipeline Optimizer', 
    description: 'Automated weight pruning and optimization toolkit for PyTorch models.', 
    price: 129, 
    image_url: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?auto=format&fit=crop&q=80&w=800', 
    category_id: 'scripts-modules', 
    color: 'Deep Purple' 
  },

  // UI/UX Kits
  { 
    id: 'u-1', 
    name: 'Titan Admin Dashboard', 
    description: 'Next.js 16 based management system with over 200 pre-built components.', 
    price: 89, 
    image_url: 'https://images.unsplash.com/photo-1551288049-bbbda536ad0b?auto=format&fit=crop&q=80&w=800', 
    category_id: 'ui-ux-kits', 
    color: 'Slate', 
    is_featured_admin: true 
  },
  { 
    id: 'u-2', 
    name: 'Nexus Mobile Design System', 
    description: 'Cross-platform Figma UI kit optimized for iOS 18 and Android 15.', 
    price: 59, 
    image_url: 'https://images.unsplash.com/photo-1586717791821-3f44a563eb4c?auto=format&fit=crop&q=80&w=800', 
    category_id: 'ui-ux-kits', 
    color: 'OLED Black' 
  },

  // 3D Digital Assets
  { 
    id: '3-1', 
    name: 'Neo-Tokyo Environment Pro', 
    description: 'Modular cyberpunk city kit with PBR textures and optimized geometry.', 
    price: 149, 
    image_url: 'https://images.unsplash.com/photo-1605810230434-7631ac76ec81?auto=format&fit=crop&q=80&w=800', 
    category_id: '3d-assets', 
    color: 'Night City', 
    is_featured_admin: true 
  },
  { 
    id: '3-2', 
    name: 'Hardsurface Mech Pack', 
    description: 'Collection of 50+ high-precision mechanical parts for sci-fi vehicle design.', 
    price: 79, 
    image_url: 'https://images.unsplash.com/photo-1549692520-acc6669e2f0c?auto=format&fit=crop&q=80&w=800', 
    category_id: '3d-assets', 
    color: 'Gunmetal' 
  },

  // Developer Hardware
  { 
    id: 'h-1', 
    name: 'PixelBoard Pro Mechanical', 
    description: 'Specialized 65% code-optimized keyboard with custom hot-swappable switches.', 
    price: 249, 
    image_url: 'https://images.unsplash.com/photo-1511467687858-23d96c32e4ae?auto=format&fit=crop&q=80&w=800', 
    category_id: 'hardware-dev', 
    color: 'Graphite', 
    is_featured_admin: true 
  },
  { 
    id: 'h-2', 
    name: 'CoreLink RISC-V Test Board', 
    description: 'Advanced development kit for custom ISA extensions and chip design.', 
    price: 179, 
    image_url: 'https://images.unsplash.com/photo-1555664424-778a1e5e1b48?auto=format&fit=crop&q=80&w=800', 
    category_id: 'hardware-dev', 
    color: 'Silicon Green' 
  },
];
