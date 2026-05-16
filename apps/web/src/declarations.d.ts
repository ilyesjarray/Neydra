// Ambient module declarations for packages without bundled types in the monorepo.
// IMPORTANT: Do NOT declare modules that ship their own types (e.g. next, framer-motion,
// zustand, lucide-react) — doing so shadows their real type definitions.

// Supabase SSR helper (no bundled types)
declare module '@supabase/ssr';

// PDF generation
declare module 'jspdf';
declare module 'jspdf-autotable';

// Screenshot utility
declare module 'html2canvas';
