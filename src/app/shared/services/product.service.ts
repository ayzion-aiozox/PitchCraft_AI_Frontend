import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, catchError, of } from 'rxjs';
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
  ProductTemplate,
  CreateTemplateRequest,
  ProductStats,
} from '../models/product.model';

@Injectable({ providedIn: 'root' })
export class ProductService {
  private readonly baseUrl = (environment as { apiUrl?: string })?.apiUrl ?? '';

  constructor(private readonly http: HttpClient) {}

  private url(path: string): string {
    const base = this.baseUrl.replace(/\/$/, '');
    return path.startsWith('http') ? path : `${base}/${path}`;
  }

  private getWorkspaceId(): string | null {
    return (
      localStorage.getItem(LocalStorageConstant.WorkspaceId) ||
      (environment as { defaultWorkspaceId?: string }).defaultWorkspaceId ||
      null
    );
  }

  /** GET /api/products */
  getProducts(page = 1, pageSize = 20, workspaceId?: string): Observable<ApiResponse<PaginatedData<ProductListItem>>> {
    const wid = workspaceId ?? this.getWorkspaceId();
    let params = new HttpParams().set('page', page).set('pageSize', pageSize);
    if (wid) params = params.set('workspaceId', wid);
    return this.http.get<ApiResponse<PaginatedData<ProductListItem>>>(this.url(ApiEndpoints.products.base), { params }).pipe(
      catchError(() => of({ success: false } as ApiResponse<PaginatedData<ProductListItem>>))
    );
  }

  /** GET /api/products/{id} */
  getProduct(id: string): Observable<ApiResponse<Product>> {
    return this.http.get<ApiResponse<Product>>(this.url(ApiEndpoints.products.byId(id))).pipe(
      catchError(() => of({ success: false } as ApiResponse<Product>))
    );
  }

  /** POST /api/products */
  createProduct(body: CreateProductRequest): Observable<ApiResponse<Product>> {
    return this.http.post<ApiResponse<Product>>(this.url(ApiEndpoints.products.base), body).pipe(
      catchError((e) => of({ success: false, message: e?.error?.message } as ApiResponse<Product>))
    );
  }

  /** PUT /api/products/{id} */
  updateProduct(id: string, body: UpdateProductRequest): Observable<ApiResponse<Product>> {
    return this.http.put<ApiResponse<Product>>(this.url(ApiEndpoints.products.byId(id)), body).pipe(
      catchError((e) => of({ success: false, message: e?.error?.message } as ApiResponse<Product>))
    );
  }

  /** PATCH /api/products/{id}/status */
  updateProductStatus(id: string, status: Product['status']): Observable<ApiResponse<Product>> {
    return this.http.patch<ApiResponse<Product>>(this.url(ApiEndpoints.products.status(id)), { status }).pipe(
      catchError((e) => of({ success: false, message: e?.error?.message } as ApiResponse<Product>))
    );
  }

  /** DELETE /api/products/{id} */
  deleteProduct(id: string): Observable<ApiResponse<Record<string, never>>> {
    return this.http.delete<ApiResponse<Record<string, never>>>(this.url(ApiEndpoints.products.byId(id))).pipe(
      catchError((e) => of({ success: false, message: e?.error?.message } as ApiResponse<Record<string, never>>))
    );
  }

  /** POST /api/products/{id}/duplicate */
  duplicateProduct(id: string, newName?: string): Observable<ApiResponse<Product>> {
    return this.http.post<ApiResponse<Product>>(this.url(ApiEndpoints.products.duplicate(id)), newName != null ? { newName } : {}).pipe(
      catchError((e) => of({ success: false, message: e?.error?.message } as ApiResponse<Product>))
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
      catchError(() => of({ success: false } as ApiResponse<PaginatedData<ProductListItem>>))
    );
  }

  /** GET /api/products/stats */
  getStats(): Observable<ApiResponse<ProductStats>> {
    return this.http.get<ApiResponse<ProductStats>>(this.url(ApiEndpoints.products.stats)).pipe(
      catchError(() => of({ success: false } as ApiResponse<ProductStats>))
    );
  }

  /** GET /api/products/{id}/value-matrix */
  getValueMatrix(productId: string): Observable<ApiResponse<ValueMatrix>> {
    return this.http.get<ApiResponse<ValueMatrix>>(this.url(ApiEndpoints.products.valueMatrix(productId))).pipe(
      catchError(() => of({ success: false } as ApiResponse<ValueMatrix>))
    );
  }

  /** POST /api/products/{id}/value-matrix */
  createValueMatrix(productId: string, body: Omit<ValueMatrix, 'productId'>): Observable<ApiResponse<ValueMatrix>> {
    return this.http.post<ApiResponse<ValueMatrix>>(this.url(ApiEndpoints.products.valueMatrix(productId)), body).pipe(
      catchError((e) => of({ success: false, message: e?.error?.message } as ApiResponse<ValueMatrix>))
    );
  }

  /** PUT /api/products/{id}/value-matrix */
  updateValueMatrix(productId: string, body: Omit<ValueMatrix, 'productId'>): Observable<ApiResponse<ValueMatrix>> {
    return this.http.put<ApiResponse<ValueMatrix>>(this.url(ApiEndpoints.products.valueMatrix(productId)), body).pipe(
      catchError((e) => of({ success: false, message: e?.error?.message } as ApiResponse<ValueMatrix>))
    );
  }

  /** GET /api/products/{id}/documents */
  getDocuments(productId: string): Observable<ApiResponse<ProductDocument[]>> {
    return this.http.get<ApiResponse<ProductDocument[]>>(this.url(ApiEndpoints.products.documents(productId))).pipe(
      catchError(() => of({ success: false } as ApiResponse<ProductDocument[]>))
    );
  }

  /** POST /api/products/{id}/documents */
  addDocument(productId: string, body: CreateDocumentRequest): Observable<ApiResponse<ProductDocument>> {
    return this.http.post<ApiResponse<ProductDocument>>(this.url(ApiEndpoints.products.documents(productId)), body).pipe(
      catchError((e) => of({ success: false, message: e?.error?.message } as ApiResponse<ProductDocument>))
    );
  }

  /** DELETE /api/products/documents/{documentId} */
  deleteDocument(documentId: string): Observable<ApiResponse<Record<string, never>>> {
    return this.http.delete<ApiResponse<Record<string, never>>>(this.url(ApiEndpoints.products.documentById(documentId))).pipe(
      catchError((e) => of({ success: false, message: e?.error?.message } as ApiResponse<Record<string, never>>))
    );
  }

  /** GET /api/products/templates */
  getTemplates(page = 1, pageSize = 20, workspaceId?: string): Observable<ApiResponse<PaginatedData<ProductTemplate>>> {
    const wid = workspaceId ?? this.getWorkspaceId();
    let params = new HttpParams().set('page', page).set('pageSize', pageSize);
    if (wid) params = params.set('workspaceId', wid);
    return this.http.get<ApiResponse<PaginatedData<ProductTemplate>>>(this.url(ApiEndpoints.products.templates), { params }).pipe(
      catchError(() => of({ success: false } as ApiResponse<PaginatedData<ProductTemplate>>))
    );
  }

  /** POST /api/products/templates */
  createTemplate(body: CreateTemplateRequest): Observable<ApiResponse<ProductTemplate>> {
    return this.http.post<ApiResponse<ProductTemplate>>(this.url(ApiEndpoints.products.templates), body).pipe(
      catchError((e) => of({ success: false, message: e?.error?.message } as ApiResponse<ProductTemplate>))
    );
  }
}
