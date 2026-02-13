import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export class BaseApiService {
  protected apiUrl: string;
  protected httpClient: HttpClient;

  get<T>(endpoint: string, params?: {}, reqOpts?: object): Observable<T> {
    const formattedEndpoint = this.appendUrlParams(endpoint, params);
    return this.httpClient.get<T>(this.apiUrl + formattedEndpoint, reqOpts);
  }

  post<T>(endpoint: string, body: any, reqOpts?: object) {
    return this.httpClient.post<T>(this.apiUrl + endpoint, body, reqOpts);
  }

  put<T>(endpoint: string, body: any, reqOpts?: object) {
    return this.httpClient.put<T>(this.apiUrl + endpoint, body, reqOpts);
  }

  delete<T>(endpoint: string, params?: any, reqOpts?: object) {
    const formattedEndpoint = this.appendUrlParams(endpoint, params);
    return this.httpClient.delete<T>(this.apiUrl + formattedEndpoint, reqOpts);
  }

  patch<T>(endpoint: string, body: any, reqOpts?: object) {
    return this.httpClient.patch<T>(this.apiUrl + endpoint, body, reqOpts);
  }

  appendUrlParams(endpoint: string, params: any): string {
    return endpoint.replace(/{(\w+)}/g, (match) => {
      return params[match.replace(/{|}/g, '')] || match;
    });
  }
}
