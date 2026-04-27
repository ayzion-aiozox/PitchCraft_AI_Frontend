import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable, catchError, map, of } from 'rxjs';
import { environment } from '../../../environments/environment';
import { ApiEndpoints } from '../constants/api-endpoints';
import { LocalStorageConstant } from '../constants/local-storage.constant';
import type {
  ApiResponse,
  PaginatedData,
  ProductListItem,
  Product,
  CreateProductRequest,
  UpdateProductRequest,
  ProductValueRow,
  ValueMatrix,
  ProductDocument,
  CreateDocumentRequest,
  UploadDocumentResponse,
  ProductTemplate,
  CreateTemplateRequest,
  ProductStats,
  ProductExtractionJob,
  StartExtractionResponse,
  EmbedProductRequest,
  EmbedProductResponse,
  AnalyzeKnowledgeResponse,
  AnalyzeStrategicResponse,
  MarketRadarResponse,
  GenerateValueMatrixResponse,
  ScoreResponse,
  AuditLiveRequest,
  AuditLiveResponse,
  AnalyzeFormDataBody,
  MarketRadarRequestBody,
  ProposedFieldsResponse,
} from '../models/product.model';

@Injectable({ providedIn: 'root' })
export class ProductService {
  private readonly baseUrl = (environment as { apiUrl?: string })?.apiUrl ?? '';

  /**
   * Map .NET / mixed JSON envelopes to `ApiResponse` (`Data` → `data`, `Success` → `success`).
   */
  private normalizeApiEnvelope<T>(raw: unknown): ApiResponse<T> {
    if (!raw || typeof raw !== 'object' || Array.isArray(raw)) {
      return raw as ApiResponse<T>;
    }
    const r = raw as Record<string, unknown>;
    const successRaw = r['success'] ?? r['Success'];
    const success =
      typeof successRaw === 'boolean'
        ? successRaw
        : r['data'] != null || r['Data'] != null
          ? true
          : false;
    return {
      success,
      data: (r['data'] ?? r['Data']) as T | undefined,
      message: (r['message'] ?? r['Message']) as string | undefined,
      errorCode: (r['errorCode'] ?? r['ErrorCode']) as string | undefined,
      errors: (r['errors'] ?? r['Errors']) as string[] | undefined,
    };
  }

  /** Known DTO keys for blob/path after upload (flat or nested under document/file). */
  private pickStoragePathFromObject(obj: unknown): string | undefined {
    if (!obj || typeof obj !== 'object') return undefined;
    const r = obj as Record<string, unknown>;
    const keys = [
      'storagePath',
      'storage_path',
      'StoragePath',
      'blobPath',
      'blob_path',
      'BlobPath',
      'relativePath',
      'relative_path',
      'RelativePath',
      'fileUrl',
      'file_url',
      'FileUrl',
      'downloadUrl',
      'download_url',
      'DownloadUrl',
      'path',
      'Path',
      'filePath',
      'file_path',
      'FilePath',
      'storageUri',
      'StorageUri',
    ];
    for (const k of keys) {
      const v = r[k];
      if (v == null) continue;
      const t = String(v).trim();
      if (t) return t;
    }
    return undefined;
  }

  /**
   * Persist the server path from upload — required for embed `storage_path`.
   * Handles camelCase, snake_case, PascalCase, nested `document`/`Data`, and shallow DFS.
   */
  pickUploadStoragePath(data: UploadDocumentResponse | undefined): string | undefined {
    if (!data) return undefined;
    const seen = new WeakSet<object>();
    const walk = (obj: unknown, depth: number): string | undefined => {
      if (depth <= 0 || !obj || typeof obj !== 'object') return undefined;
      if (seen.has(obj as object)) return undefined;
      seen.add(obj as object);
      const direct = this.pickStoragePathFromObject(obj);
      if (direct) return direct;
      const r = obj as Record<string, unknown>;
      const preferNested = ['data', 'Data', 'document', 'Document', 'file', 'File', 'result', 'Result', 'value', 'Value', 'payload', 'Payload'];
      for (const k of preferNested) {
        const inner = r[k];
        if (inner && typeof inner === 'object') {
          const hit = walk(inner, depth - 1);
          if (hit) return hit;
        }
      }
      for (const v of Object.values(r)) {
        if (v && typeof v === 'object' && !Array.isArray(v)) {
          const hit = walk(v, depth - 1);
          if (hit) return hit;
        }
      }
      return undefined;
    };
    return walk(data, 6);
  }

  /** BFF requires at least one of content, url, storage_path per document */
  embedDocumentHasEmbeddablePayload(d: EmbedProductRequest['documents'][number]): boolean {
    const content = d.content != null && String(d.content).trim();
    const url = d.url != null && String(d.url).trim();
    const sp = (d.storage_path ?? d.storagePath) != null && String(d.storage_path ?? d.storagePath).trim();
    return !!(content || url || sp);
  }

  pickUploadDocumentId(data: UploadDocumentResponse | undefined, fallback: string): string {
    if (!data) return fallback;
    const r = data as Record<string, unknown>;
    const candidates: unknown[] = [data.documentId, data.document_id, r['DocumentId'], r['documentId']];
    for (const c of candidates) {
      if (c != null && String(c).trim()) return String(c).trim();
    }
    return fallback;
  }

  pickUploadFileName(data: UploadDocumentResponse | undefined, fallback: string): string {
    if (!data) return fallback;
    const r = data as Record<string, unknown>;
    const candidates: unknown[] = [data.fileName, data.file_name, r['FileName'], r['fileName']];
    for (const c of candidates) {
      if (c != null && String(c).trim()) return String(c).trim();
    }
    return fallback;
  }

  constructor(private readonly http: HttpClient) {}

  private url(path: string): string {
    const base = this.baseUrl.replace(/\/$/, '');
    return path.startsWith('http') ? path : `${base}/${path}`;
  }

  /** Map HttpClient failures (400/404/502 JSON bodies) to ApiResponse shape for UI messages */
  private mapHttpErrorToApiFailure<T>(err: unknown): ApiResponse<T> {
    if (err instanceof HttpErrorResponse) {
      const body = err.error;
      let message: string | undefined;
      let errorCode: string | undefined;
      if (body && typeof body === 'object' && !Array.isArray(body)) {
        const o = body as Record<string, unknown>;
        const msg = o['message'];
        const detail = o['detail'];
        const title = o['title'];
        message =
          (typeof msg === 'string' ? msg : undefined) ??
          (typeof detail === 'string' ? detail : undefined) ??
          (typeof title === 'string' ? title : undefined);
        const ec = o['errorCode'];
        errorCode = typeof ec === 'string' ? ec : undefined;
      }
      if (!message && typeof body === 'string' && body.trim()) {
        message = body;
      }
      // Never leak request URLs (Angular often embeds them in `err.message`).
      const fallback =
        err.status === 0
          ? 'Network error. Please check your connection and backend URL.'
          : `Request failed (${err.status})`;
      return {
        success: false,
        message: message || err.statusText || fallback,
        errorCode,
      } as ApiResponse<T>;
    }
    return { success: false, message: 'Request failed.' } as ApiResponse<T>;
  }

  private getWorkspaceId(): string | null {
    return (
      localStorage.getItem(LocalStorageConstant.WorkspaceId) ||
      (environment as { defaultWorkspaceId?: string }).defaultWorkspaceId ||
      null
    );
  }

  /** Embed `collection_id`: Qdrant id from login, else workspace id (and env default). */
  private getCollectionIdForEmbed(): string | null {
    const q = localStorage.getItem(LocalStorageConstant.QdrantCollectionId)?.trim();
    if (q) return q;
    return this.getWorkspaceId();
  }

  /** GET /api/products */
  getProducts(page = 1, pageSize = 20, workspaceId?: string): Observable<ApiResponse<PaginatedData<ProductListItem>>> {
    const wid = workspaceId ?? this.getWorkspaceId();
    let params = new HttpParams().set('page', page).set('pageSize', pageSize);
    if (wid) params = params.set('workspaceId', wid);
    return this.http.get<ApiResponse<PaginatedData<ProductListItem>>>(this.url(ApiEndpoints.products.base), { params }).pipe(
      catchError((e) => of(this.mapHttpErrorToApiFailure<PaginatedData<ProductListItem>>(e)))
    );
  }

  /** GET /api/products/{id} */
  getProduct(id: string): Observable<ApiResponse<Product>> {
    return this.http.get<ApiResponse<Product>>(this.url(ApiEndpoints.products.byId(id))).pipe(
      catchError((e) => of(this.mapHttpErrorToApiFailure<Product>(e)))
    );
  }

  /** POST /api/products */
  createProduct(body: CreateProductRequest): Observable<ApiResponse<Product>> {
    const payload = this.serializeProductUpsert(body as unknown as Record<string, unknown>);
    return this.http.post<ApiResponse<Product>>(this.url(ApiEndpoints.products.base), payload).pipe(
      catchError((e) => of(this.mapHttpErrorToApiFailure<Product>(e)))
    );
  }

  /** PUT /api/products/{id} */
  updateProduct(id: string, body: UpdateProductRequest): Observable<ApiResponse<Product>> {
    const payload = this.serializeProductUpsert(body as unknown as Record<string, unknown>);
    return this.http.put<ApiResponse<Product>>(this.url(ApiEndpoints.products.byId(id)), payload).pipe(
      catchError((e) => of(this.mapHttpErrorToApiFailure<Product>(e)))
    );
  }

  /** PATCH /api/products/{id}/status */
  updateProductStatus(id: string, status: Product['status']): Observable<ApiResponse<Product>> {
    return this.http.patch<ApiResponse<Product>>(this.url(ApiEndpoints.products.status(id)), { status }).pipe(
      catchError((e) => of(this.mapHttpErrorToApiFailure<Product>(e)))
    );
  }

  /** DELETE /api/products/{id} */
  deleteProduct(id: string): Observable<ApiResponse<Record<string, never>>> {
    return this.http.delete<ApiResponse<Record<string, never>>>(this.url(ApiEndpoints.products.byId(id))).pipe(
      catchError((e) => of(this.mapHttpErrorToApiFailure<Record<string, never>>(e)))
    );
  }

  /** POST /api/products/extract — start URL scraping; body: { url: string } */
  startExtraction(body: { url: string }): Observable<ApiResponse<StartExtractionResponse>> {
    return this.http.post<ApiResponse<StartExtractionResponse>>(this.url(ApiEndpoints.products.extract), body).pipe(
      catchError((e) => {
        const r = this.mapHttpErrorToApiFailure<StartExtractionResponse>(e);
        if (!r.message || r.message === 'Request failed.') {
          return of({ ...r, message: r.message || 'Extraction failed.' } as ApiResponse<StartExtractionResponse>);
        }
        return of(r);
      })
    );
  }

  /** GET /api/products/extract/{extractionId} — poll extraction */
  getExtraction(extractionId: string): Observable<ApiResponse<ProductExtractionJob>> {
    return this.http.get<ApiResponse<ProductExtractionJob>>(this.url(ApiEndpoints.products.extractById(extractionId))).pipe(
      catchError((e) => of(this.mapHttpErrorToApiFailure<ProductExtractionJob>(e)))
    );
  }

  /** GET /api/products/extract/{extractionId}/download — markdown */
  downloadExtractionMarkdown(extractionId: string): Observable<Blob> {
    return this.http.get(this.url(ApiEndpoints.products.extractDownloadMd(extractionId)), {
      responseType: 'blob',
      headers: new HttpHeaders({ Accept: 'text/markdown, text/plain, */*' }),
    });
  }

  /** GET /api/products/extract/{extractionId}/download/pdf — pdf */
  downloadExtractionPdf(extractionId: string): Observable<Blob> {
    return this.http.get(this.url(ApiEndpoints.products.extractDownloadPdf(extractionId)), {
      responseType: 'blob',
      headers: new HttpHeaders({ Accept: 'application/pdf, application/octet-stream, */*' }),
    });
  }

  /**
   * POST /api/products/{id}/embed (BFF only). Body: product_id, collection_id, documents[], optional product_fields, etc.
   * `collection_id` defaults to `QdrantCollectionId` from login (localStorage), else workspace id.
   */
  embedProduct(productId: string, body: EmbedProductRequest): Observable<ApiResponse<EmbedProductResponse>> {
    const collectionDefault = this.getCollectionIdForEmbed();
    const merged: EmbedProductRequest = {
      ...body,
      product_id: body.product_id ?? productId,
    };
    if (merged.collection_id === undefined || merged.collection_id === '') {
      if (collectionDefault) merged.collection_id = collectionDefault;
    }
    for (const doc of merged.documents) {
      if (!this.embedDocumentHasEmbeddablePayload(doc)) {
        return of({
          success: false,
          message:
            'Each document must include content, url, or storage_path (use the path returned from document upload).',
        } as ApiResponse<EmbedProductResponse>);
      }
    }
    const payload = this.serializeEmbedProductRequest(merged);
    return this.http.post<ApiResponse<EmbedProductResponse>>(this.url(ApiEndpoints.products.embed(productId)), payload).pipe(
      catchError((e) => of(this.mapHttpErrorToApiFailure<EmbedProductResponse>(e)))
    );
  }

  /** BFF / FastAPI: snake_case JSON */
  private serializeEmbedProductRequest(body: EmbedProductRequest): Record<string, unknown> {
    const documents = body.documents.map((d) => this.serializeEmbedDocument(d));
    // product_id / collection_id first so Network → Payload lists them before the documents array;
    // large `content` inside documents is last per serializeEmbedDocument (Chrome otherwise shows [{,…}]).
    const out: Record<string, unknown> = {};
    if (body.product_id) out['product_id'] = body.product_id;
    if (body.collection_id) out['collection_id'] = body.collection_id;
    if (body.product_fields != null && Object.keys(body.product_fields).length > 0) {
      out['product_fields'] = body.product_fields;
    }
    if (body.embed_product_metadata !== undefined) {
      out['embed_product_metadata'] = body.embed_product_metadata;
    }
    if (body.idempotent !== undefined) {
      out['idempotent'] = body.idempotent;
    }
    out['documents'] = documents;
    return out;
  }

  private serializeEmbedDocument(d: EmbedProductRequest['documents'][number]): Record<string, unknown> {
    const id = d.id ?? d.documentId;
    const name = d.name ?? d.fileName;
    const storage_path = d.storage_path ?? d.storagePath;
    const o: Record<string, unknown> = {};
    // Short fields first. Put huge `content` last or DevTools collapses the whole object as [{,…}].
    if (storage_path != null && String(storage_path).trim()) {
      const sp = String(storage_path).trim();
      o['storage_path'] = sp;
      o['storagePath'] = sp;
    }
    if (d.url != null && String(d.url).trim()) o['url'] = d.url;
    if (id) o['id'] = id;
    if (name) o['name'] = name;
    if (d.type) o['type'] = d.type;
    if (d.content != null && String(d.content).trim()) o['content'] = d.content;
    return o;
  }

  /** POST /api/products/{id}/analyze-knowledge */
  analyzeKnowledge(
    productId: string,
    body?: AnalyzeFormDataBody
  ): Observable<ApiResponse<AnalyzeKnowledgeResponse>> {
    return this.http
      .post<ApiResponse<AnalyzeKnowledgeResponse>>(this.url(ApiEndpoints.products.analyzeKnowledge(productId)), body ?? {})
      .pipe(catchError((e) => of(this.mapHttpErrorToApiFailure<AnalyzeKnowledgeResponse>(e))));
  }

  /** POST /api/products/{id}/analyze-strategic */
  analyzeStrategic(
    productId: string,
    body?: AnalyzeFormDataBody
  ): Observable<ApiResponse<AnalyzeStrategicResponse>> {
    return this.http
      .post<ApiResponse<AnalyzeStrategicResponse>>(this.url(ApiEndpoints.products.analyzeStrategic(productId)), body ?? {})
      .pipe(catchError((e) => of(this.mapHttpErrorToApiFailure<AnalyzeStrategicResponse>(e))));
  }

  /** POST /api/products/{id}/market-radar */
  marketRadar(productId: string, body?: MarketRadarRequestBody): Observable<ApiResponse<MarketRadarResponse>> {
    return this.http
      .post<ApiResponse<MarketRadarResponse>>(this.url(ApiEndpoints.products.marketRadar(productId)), body ?? {})
      .pipe(catchError((e) => of(this.mapHttpErrorToApiFailure<MarketRadarResponse>(e))));
  }

  /** POST /api/products/{id}/generate-value-matrix */
  generateValueMatrix(
    productId: string,
    body?: AnalyzeFormDataBody
  ): Observable<ApiResponse<GenerateValueMatrixResponse>> {
    return this.http
      .post<ApiResponse<GenerateValueMatrixResponse>>(this.url(ApiEndpoints.products.generateValueMatrix(productId)), body ?? {})
      .pipe(catchError((e) => of(this.mapHttpErrorToApiFailure<GenerateValueMatrixResponse>(e))));
  }

  /** POST /api/products/{id}/score */
  scoreProduct(productId: string): Observable<ApiResponse<ScoreResponse>> {
    return this.http.post<ApiResponse<ScoreResponse>>(this.url(ApiEndpoints.products.score(productId)), {}).pipe(
      catchError((e) => of(this.mapHttpErrorToApiFailure<ScoreResponse>(e)))
    );
  }

  /** POST /api/products/audit-live */
  auditLive(body: AuditLiveRequest): Observable<ApiResponse<AuditLiveResponse>> {
    return this.http.post<ApiResponse<AuditLiveResponse>>(this.url(ApiEndpoints.products.auditLive), body).pipe(
      catchError((e) => of(this.mapHttpErrorToApiFailure<AuditLiveResponse>(e)))
    );
  }

  /**
   * GET /api/products/{id}/proposed-fields — document-backed field suggestions (ContextBuilder).
   * Returns empty data on 404/501 or network error so the UI can fall back to extraction-only ghosts.
   */
  getProposedFields(productId: string): Observable<ApiResponse<ProposedFieldsResponse>> {
    return this.http.get<unknown>(this.url(ApiEndpoints.products.proposedFields(productId))).pipe(
      map((raw) => this.normalizeApiEnvelope<ProposedFieldsResponse>(raw)),
      catchError((e: unknown) => {
        if (e instanceof HttpErrorResponse && (e.status === 404 || e.status === 501)) {
          return of({ success: true, data: {} as ProposedFieldsResponse });
        }
        return of({ success: true, data: {} as ProposedFieldsResponse });
      })
    );
  }

  /** POST /api/products/{id}/duplicate */
  duplicateProduct(id: string, newName?: string): Observable<ApiResponse<Product>> {
    return this.http.post<ApiResponse<Product>>(this.url(ApiEndpoints.products.duplicate(id)), newName != null ? { newName } : {}).pipe(
      catchError((e) => of(this.mapHttpErrorToApiFailure<Product>(e)))
    );
  }

  /** GET /api/products/search */
  searchProducts(params: {
    searchTerm?: string;
    status?: string;
    createdAfter?: string;
    createdBefore?: string;
    page?: number;
    pageSize?: number;
    sortBy?: string;
    sortDescending?: boolean;
  } = {}): Observable<ApiResponse<PaginatedData<ProductListItem>>> {
    let httpParams = new HttpParams();
    Object.entries(params).forEach(([k, v]) => {
      if (v !== undefined && v !== null && v !== '') httpParams = httpParams.set(k, String(v));
    });
    return this.http.get<ApiResponse<PaginatedData<ProductListItem>>>(this.url(ApiEndpoints.products.search), { params: httpParams }).pipe(
      catchError((e) => of(this.mapHttpErrorToApiFailure<PaginatedData<ProductListItem>>(e)))
    );
  }

  /** GET /api/products/stats */
  getStats(): Observable<ApiResponse<ProductStats>> {
    return this.http.get<ApiResponse<ProductStats>>(this.url(ApiEndpoints.products.stats)).pipe(
      catchError((e) => of(this.mapHttpErrorToApiFailure<ProductStats>(e)))
    );
  }

  /** GET /api/products/{id}/value-matrix */
  getValueMatrix(productId: string): Observable<ApiResponse<ValueMatrix>> {
    return this.http.get<ApiResponse<ValueMatrix>>(this.url(ApiEndpoints.products.valueMatrix(productId))).pipe(
      catchError((e) => of(this.mapHttpErrorToApiFailure<ValueMatrix>(e)))
    );
  }

  /** POST /api/products/{id}/value-matrix */
  createValueMatrix(productId: string, body: Omit<ValueMatrix, 'productId'>): Observable<ApiResponse<ValueMatrix>> {
    return this.http.post<ApiResponse<ValueMatrix>>(this.url(ApiEndpoints.products.valueMatrix(productId)), body).pipe(
      catchError((e) => of(this.mapHttpErrorToApiFailure<ValueMatrix>(e)))
    );
  }

  /** PUT /api/products/{id}/value-matrix */
  updateValueMatrix(productId: string, body: Omit<ValueMatrix, 'productId'>): Observable<ApiResponse<ValueMatrix>> {
    return this.http.put<ApiResponse<ValueMatrix>>(this.url(ApiEndpoints.products.valueMatrix(productId)), body).pipe(
      catchError((e) => of(this.mapHttpErrorToApiFailure<ValueMatrix>(e)))
    );
  }

  /** GET /api/products/{id}/documents */
  getDocuments(productId: string): Observable<ApiResponse<ProductDocument[]>> {
    return this.http.get<ApiResponse<ProductDocument[]>>(this.url(ApiEndpoints.products.documents(productId))).pipe(
      catchError((e) => of(this.mapHttpErrorToApiFailure<ProductDocument[]>(e)))
    );
  }

  /** POST /api/products/{id}/documents */
  addDocument(productId: string, body: CreateDocumentRequest): Observable<ApiResponse<ProductDocument>> {
    return this.http.post<ApiResponse<ProductDocument>>(this.url(ApiEndpoints.products.documents(productId)), body).pipe(
      catchError((e) => of(this.mapHttpErrorToApiFailure<ProductDocument>(e)))
    );
  }

  /**
   * POST /api/products/{id}/documents/upload — `multipart/form-data` only (not JSON).
   * Form part name must be `file` to bind to the BFF `IFormFile` parameter; do not use `files` (that name is for the .NET→FastAPI client, not the browser→BFF call).
   * `Authorization` and `X-Workspace-Id` are added by interceptors like other product routes.
   */
  uploadDocument(productId: string, file: File): Observable<ApiResponse<UploadDocumentResponse>> {
    const form = new FormData();
    form.append('file', file, file.name);
    return this.http.post<ApiResponse<UploadDocumentResponse>>(this.url(ApiEndpoints.products.documentUpload(productId)), form).pipe(
      map((raw) => this.normalizeApiEnvelope<UploadDocumentResponse>(raw)),
      catchError((e) => of(this.mapHttpErrorToApiFailure<UploadDocumentResponse>(e)))
    );
  }

  /** DELETE /api/products/documents/{documentId} */
  deleteDocument(documentId: string): Observable<ApiResponse<Record<string, never>>> {
    return this.http.delete<ApiResponse<Record<string, never>>>(this.url(ApiEndpoints.products.documentById(documentId))).pipe(
      catchError((e) => of(this.mapHttpErrorToApiFailure<Record<string, never>>(e)))
    );
  }

  /** GET /api/products/templates */
  getTemplates(page = 1, pageSize = 20, workspaceId?: string): Observable<ApiResponse<PaginatedData<ProductTemplate>>> {
    const wid = workspaceId ?? this.getWorkspaceId();
    let params = new HttpParams().set('page', page).set('pageSize', pageSize);
    if (wid) params = params.set('workspaceId', wid);
    return this.http.get<ApiResponse<PaginatedData<ProductTemplate>>>(this.url(ApiEndpoints.products.templates), { params }).pipe(
      catchError((e) => of(this.mapHttpErrorToApiFailure<PaginatedData<ProductTemplate>>(e)))
    );
  }

  /** POST /api/products/templates */
  createTemplate(body: CreateTemplateRequest): Observable<ApiResponse<ProductTemplate>> {
    return this.http.post<ApiResponse<ProductTemplate>>(this.url(ApiEndpoints.products.templates), body).pipe(
      catchError((e) => of(this.mapHttpErrorToApiFailure<ProductTemplate>(e)))
    );
  }

  /**
   * Upsert payloads vary by backend (.NET often uses camelCase, FastAPI often uses snake_case).
   * To avoid “saved but not returned on edit”, send both key styles.
   */
  private serializeProductUpsert(body: Record<string, unknown>): Record<string, unknown> {
    const out: Record<string, unknown> = { ...body };

    const mapStr = (camel: string, snake: string) => {
      const v = body[camel];
      if (v !== undefined) out[snake] = v;
    };
    const mapArr = (camel: string, snake: string) => {
      const v = body[camel];
      if (v !== undefined) out[snake] = v;
    };

    mapStr('productName', 'product_name');
    mapStr('subtitle', 'subtitle');
    mapStr('description', 'description');
    mapStr('category', 'category');
    mapStr('businessModel', 'business_model');
    mapArr('targetSizes', 'target_sizes');
    mapStr('coreUsp', 'core_usp');
    mapStr('strategicDescription', 'strategic_description');
    mapArr('targetIndustries', 'target_industries');
    mapStr('competitors', 'competitors');
    mapStr('websiteUrl', 'website_url');
    mapStr('competitorWebsiteUrls', 'competitor_website_urls');
    mapStr('status', 'status');
    if (body['templateId'] !== undefined) out['template_id'] = body['templateId'];

    // valueRows -> value_rows + painPoint -> pain_point
    const rows = body['valueRows'];
    if (Array.isArray(rows)) {
      out['value_rows'] = rows.map((r) => {
        if (!r || typeof r !== 'object') return r;
        const rr = r as Record<string, unknown>;
        const mapped: Record<string, unknown> = { ...rr };
        if (rr['painPoint'] !== undefined && mapped['pain_point'] === undefined) mapped['pain_point'] = rr['painPoint'];
        if (rr['pain_point'] !== undefined && mapped['painPoint'] === undefined) mapped['painPoint'] = rr['pain_point'];
        return mapped;
      });
    }

    return out;
  }
}
