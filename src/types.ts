export type ToolId =
  | 'image-to-pdf'
  | 'camera-scanner'
  | 'merge-pdf'
  | 'split-pdf'
  | 'organize-rotate'
  | 'pdf-to-image'
  | 'compress-pdf'
  | 'protect-pdf'
  | 'unlock-pdf'
  | 'watermark-pdf'
  | 'text-to-pdf'
  | 'sign-annotate'
  | 'pdf-ocr'
  | 'gemini-ai-chat'
  | 'create-resume'
  | 'create-podcast'
  | 'create-flyer'
  | 'whatsapp-greeting'
  | 'bg-remover'
  | 'android-package';

export type ToolCategory = 'all' | 'ai' | 'create' | 'organize' | 'convert' | 'security' | 'edit' | 'android';

export interface PdfTool {
  id: ToolId;
  name: string;
  description: string;
  iconName: string;
  category: Exclude<ToolCategory, 'all'>;
  badge?: string;
  popular?: boolean;
}

export interface ProcessedHistoryItem {
  id: string;
  title: string;
  toolId: ToolId;
  timestamp: number;
  sizeBytes: number;
  dataUrl?: string;
  fileName: string;
}

export interface ScannedPageItem {
  id: string;
  originalUrl: string;
  filteredUrl: string;
  filter: 'original' | 'magic' | 'bw' | 'grayscale';
  source: 'camera' | 'gallery' | 'drive';
}

export interface ScannedDocMemory {
  id: string;
  docTitle: string;
  pages: ScannedPageItem[];
  pdfDataUrl?: string;
  pdfFileName?: string;
  sizeBytes?: number;
  timestamp: number;
  ownerEmail?: string;
}

export interface UserAccount {
  email: string;
  name: string;
  avatarUrl?: string;
  provider: 'google' | 'email';
  createdAt: number;
  lastLoginAt: number;
  history: ProcessedHistoryItem[];
  savedScans?: ScannedDocMemory[];
  isPro?: boolean;
  subscriptionPlan?: string;
  subscriptionMethod?: string;
}

export interface AndroidPackageConfig {
  packageName: string;
  appName: string;
  versionName: string;
  versionCode: number;
  targetSdk: number;
  minSdk: number;
  playStoreStatus: 'Ready for Submission' | 'In Progress' | 'AAB Generated';
  features: string[];
}
