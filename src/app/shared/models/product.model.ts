/**
 * Product Lab API models. Aligns with .NET ApiResponse<T> and documented endpoints.
 */

/** API wrapper: success + data or error fields */
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
  errorCode?: string;
  errors?: string[];
}

/** Extraction job (web scraping) */
export interface ProductExtractionJob {
  extraction_id: string;
  status: 'processing' | 'complete' | 'failed';
  progress_percent: number;
  /** Present when complete */
  extracted_fields?: Record<string, unknown>;
  /** Present when complete (markdown, title, etc.) */
  document?: {
    title?: string;
    markdown?: string;
    full_markdown?: string;
    [k: string]: unknown;
  };
  confidence_score?: number;
  error_message?: string;
}

export interface StartExtractionResponse {
  extraction_id: string;
  status: 'processing' | 'complete' | 'failed';
  progress_percent: number;
}

/** Paginated list */
export interface PaginatedData<T> {
  items: T[];
  totalCount: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

/** Product list item (GET /api/products, search) */
export interface ProductListItem {
  id: string;
  title: string;
  subtitle: string;
  iconGradient: string;
  iconName: string;
  badge: 'draft' | 'active' | 'processing' | 'archived';
  scorePercent: number;
  knowledgeLabel: string;
  knowledgeStatus: string;
  knowledgePercent: number;
  editedAt: string;
  workspaceId: string;
  websiteUrl?: string;
  competitorWebsiteUrls?: string;
}

/** Value row (product detail + create/update) */
export interface ProductValueRow {
  id?: string;
  feature: string;
  benefit: string;
  painPoint: string;
  score: string;
}

/** Full product (GET /api/products/{id}) */
export interface Product {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  iconGradient: string;
  iconName: string;
  status: 'draft' | 'active' | 'processing' | 'archived';
  category: string;
  businessModel: string;
  targetSizes: string[];
  coreUsp: string;
  strategicDescription: string;
  targetIndustries: string[];
  competitors: string;
  valueRows: ProductValueRow[];
  scorePercent: number;
  knowledgeLabel: string;
  knowledgeStatus: string;
  knowledgePercent: number;
  workspaceId: string;
  templateId: string | null;
  createdAt: string;
  updatedAt: string;
  websiteUrl?: string;
  competitorWebsiteUrls?: string;
}

/** Create product request (POST /api/products) */
export interface CreateProductRequest {
  productName: string;
  category: string;
  businessModel: string;
  targetSizes: string[];
  coreUsp: string;
  strategicDescription: string;
  targetIndustries: string[];
  competitors: string;
  valueRows: Omit<ProductValueRow, 'id'>[];
  status: 'draft' | 'active';
  templateId?: string | null;
  websiteUrl?: string;
  competitorWebsiteUrls?: string;
}

/** Update product request (PUT /api/products/{id}) */
export interface UpdateProductRequest {
  productName: string;
  subtitle?: string;
  description?: string;
  iconGradient?: string;
  iconName?: string;
  category: string;
  businessModel: string;
  targetSizes: string[];
  coreUsp: string;
  strategicDescription: string;
  targetIndustries: string[];
  competitors: string;
  valueRows: ProductValueRow[];
  status: 'draft' | 'active' | 'processing' | 'archived';
  websiteUrl?: string;
  competitorWebsiteUrls?: string;
}

/** Value matrix (GET/POST/PUT value-matrix) */
export interface ValueMatrix {
  productId: string;
  features: string;
  benefits: string;
  differentiators: string;
  painPoints?: string;
  competitorComparison?: string;
}

/** Document (metadata only; file in Qdrant) */
export interface ProductDocument {
  id: string;
  productId: string;
  name: string;
  fileUrl: string;
  fileType: string;
  fileSize: number;
  documentType: string;
  createdAt: string;
  updatedAt: string | null;
}

/** Create document request */
export interface CreateDocumentRequest {
  name: string;
  fileUrl: string;
  fileType: string;
  fileSize: number;
  documentType: string;
}

export interface UploadDocumentResponse {
  documentId?: string;
  document_id?: string;
  storagePath?: string;
  storage_path?: string;
  fileName?: string;
  file_name?: string;
  /** Some APIs return file URL / path instead of storagePath */
  fileUrl?: string;
  file_url?: string;
  /** Alternate path keys some BFF/DTOs use */
  path?: string;
  filePath?: string;
  file_path?: string;
}

/** Template list item */
export interface ProductTemplate {
  id: string;
  workspaceId: string;
  name: string;
  description: string;
  category: string;
  templateData: string;
  isDefault: boolean;
  createdAt: string;
  updatedAt: string | null;
}

/** Create template request */
export interface CreateTemplateRequest {
  name: string;
  description: string;
  category: string;
  templateData: string;
  isDefault?: boolean;
}

/** Product statistics */
export interface ProductStats {
  totalProducts: number;
  activeProducts: number;
  draftProducts: number;
  archivedProducts: number;
  totalDocuments: number;
  productsWithValueMatrix: number;
  lastCreatedAt: string;
  lastUpdatedAt: string;
}

/**
 * Wire shape for `POST /api/products/{id}/embed` (BFF). The browser does not call FastAPI embed URLs directly.
 * `collection_id` is the Qdrant collection id (from login → localStorage `QdrantCollectionId`; may differ from workspace id).
 * Field mapping vs informal Python samples: document_id → id, file_name → name, source_type → type (pdf | docx | text | url).
 * Each document needs at least one of: content, url, storage_path (from BFF document upload).
 */
export interface EmbedDocumentInput {
  /** Stable id per document (preferred over legacy documentId) */
  id?: string;
  name?: string;
  /** e.g. pdf, docx, text, url */
  type?: string;
  content?: string;
  url?: string;
  storage_path?: string;
  /** Legacy camelCase — still supported by serializer mapping */
  documentId?: string;
  fileName?: string;
  storagePath?: string;
}

export interface EmbedProductRequest {
  /** Optional; `ProductService.embedProduct` sets from URL `{productId}` when omitted */
  product_id?: string;
  /** Optional; filled from login `qdrantCollectionId` or workspace id when omitted */
  collection_id?: string;
  documents: EmbedDocumentInput[];
  /** Extra product context merged server-side (FastAPI `product_fields`) */
  product_fields?: Record<string, unknown>;
  embed_product_metadata?: boolean;
  idempotent?: boolean;
}

export interface EmbedProductResponse {
  status: 'completed' | 'partial' | 'failed' | string;
  total_chunks?: number;
  errors?: Array<{ documentId?: string; message?: string } | string>;
}

/** Analysis endpoint payloads (kept flexible — backend may evolve) */
export interface AnalyzeKnowledgeResponse {
  knowledge_percent?: number;
  gaps?: string[];
  recommended_actions?: string[];
  estimated_quality?: string;
  coverage?: Record<string, unknown>;
  [k: string]: unknown;
}

export interface AnalyzeStrategicResponse {
  positioning?: Record<string, unknown>;
  strengths?: string[];
  weaknesses?: string[];
  opportunities?: string[];
  threats?: string[];
  messaging_recommendations?: unknown[];
  overall_confidence?: number;
  [k: string]: unknown;
}

/**
 * BFF returns camelCase JSON (ASP.NET defaults). Aligns with FastAPI radar analyze payload
 * after `MarketRadarResponse` / client deserialization fixes (ourProduct vs our_product).
 */
export interface MarketRadarResponse {
  dimensions?: unknown[];
  competitors?: unknown;
  insights?: unknown;
  /** Scores / profile for “our” product when API nests them */
  ourProduct?: Record<string, unknown>;
  /** If any layer still emits snake_case */
  our_product?: Record<string, unknown>;
  scores?: unknown[];
  [k: string]: unknown;
}

export interface GenerateValueMatrixResponse {
  rows?: Array<Record<string, unknown>>;
  summary?: string;
  top_value_drivers?: string[];
  [k: string]: unknown;
}

export interface ScoreResponse {
  overall_score?: number;
  grade?: string;
  breakdown?: unknown[];
  readiness?: string;
  [k: string]: unknown;
}

/** Optional POST body for analyze-knowledge / analyze-strategic / generate-value-matrix */
export interface AnalyzeFormDataBody {
  form_data?: Record<string, unknown>;
}

/** Optional POST body for market-radar */
export interface MarketRadarRequestBody {
  product_url?: string;
  competitors?: string;
}

export interface AuditLiveRequest {
  form_data: Record<string, unknown>;
}

export interface AuditLiveResponse {
  overall_score?: number;
  completeness_percent?: number;
  field_scores?: Record<string, unknown>;
  /** Optional per-field tips from API (e.g. FastAPI live-audit) */
  field_messages?: Record<string, string>;
  field_tips?: Record<string, string>;
  /** Optional weights for tooltip “weight × score” */
  field_weights?: Record<string, number>;
  suggestions?: string[];
  [k: string]: unknown;
}

/** Optional explainability attachment on AI payloads */
export interface InsightAttribution {
  source_type?: string;
  source_name?: string;
  confidence?: number;
  reason?: string;
}

/**
 * One field suggestion from `GET /api/products/{id}/proposed-fields` (BFF / ContextBuilder).
 * Supports snake_case or camelCase from the wire.
 */
export interface ProposedFieldSuggestion {
  proposed_value?: string;
  proposedValue?: string;
  value?: string;
  source?: string;
  source_name?: string;
  sourceName?: string;
  confidence?: number;
  reason?: string;
  [k: string]: unknown;
}

/** Map of form field keys → suggestion payload */
export interface ProposedFieldsResponse {
  product_name?: ProposedFieldSuggestion;
  productName?: ProposedFieldSuggestion;
  core_usp?: ProposedFieldSuggestion;
  coreUsp?: ProposedFieldSuggestion;
  description?: ProposedFieldSuggestion;
  features?: ProposedFieldSuggestion;
  competitors?: ProposedFieldSuggestion;
  [k: string]: unknown;
}
