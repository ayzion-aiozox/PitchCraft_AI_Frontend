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
