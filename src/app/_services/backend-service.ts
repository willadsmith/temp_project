import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '@environments/environment';
import {Docs} from '@app/_models';
import {map} from 'rxjs/operators';

// const headerDict = {
//   'Content-Type': 'application/json',
//   'Accept': 'application/json',
//   'Access-Control-Allow-Headers': 'Content-Type',
// }

export interface IRequestOptions {
  headers?: HttpHeaders;
  observe?: 'body';
  params?: HttpParams | { [param: string]: string | string[] };
  reportProgress?: boolean;
  responseType?: 'json';
  method: string;
  withCredentials?: boolean;
  body?: any;
}

@Injectable()
export class BackendService {

  private api = environment.apiUrl;

  public constructor(public http: HttpClient) {
    // If you don't want to use the extended versions in some cases you can access the public property and use the original one.
    // for ex. this.httpClient.http.get(...)
  }

  /**
   * GET request
   * @param {string} endPoint it doesn't need / in front of the end point
   * @param {IRequestOptions} options options of the request like headers, body, etc.
   * @returns {Observable<T>}
   */
  public get<T>(options?: IRequestOptions): Observable<T> {
    // options.headers.append("Authorization", `Baerer ${localStorage.getItem('accessToken')}`)
    // options.headers = new HttpHeaders({
    //   'Authorization': `Baerer ${localStorage.getItem('accessToken')}`
    // });
    return this.http.get<T>(this.api, options);
  }


   /**
   * GET request
   * @param {string} endPoint it doesn't need / in front of the end point
   * @param {IRequestOptions} options options of the request like headers, body, etc.
   * @returns {Observable<T>}
   */
    public get2<T>(options?: IRequestOptions): Observable<T> {
      const httpHeaders = new HttpHeaders();
      httpHeaders.append('content-type', 'application/json');
      httpHeaders.append('Authorization', `Bearer ${localStorage.getItem('token')}`);
      // options.headers.append("Authorization", `Baerer ${localStorage.getItem('accessToken')}`)
      // options.headers = new HttpHeaders({
      //   'Authorization': `Baerer ${localStorage.getItem('accessToken')}`
      // });
      return this.http.get<T>(this.api + '/documents', options);
    }

  /**
   * POST request
   * @param {string} endPoint end point of the api
   * @param {Object} params body of the request.
   * @param {IRequestOptions} options options of the request like headers, body, etc.
   * @returns {Observable<T>}
   */
  public post<T>(params: any, options?: IRequestOptions): Observable<T> {
    if (options === undefined) {
      options = ({} as IRequestOptions);
    }
    options.headers = new HttpHeaders({
      'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
    });

    let httpParams = new HttpParams();
    Object.keys(params).forEach(function(key) {
      httpParams = httpParams.append(key, (params[key] === undefined ? '' : params[key]));
    });
    return this.http.post<T>(this.api, httpParams, options);
  }

  public post2<T>(params: any): Observable<T> {
    const headers = new HttpHeaders();
    headers.append('Accept', 'application/json');
    headers.append('Content-Type', 'multipart/form-data');

    return this.http.post<T>(this.api, params, {headers: headers});
  }

  /**
   * POST request for forms for content type multipart/form-data
   * @param {object} endPoint end point of the api
   * @returns {Observable<T>}
   */
  public sendPostForm<T>(params: any): Observable<T> {

    const headers = new HttpHeaders();
    headers.append('Accept', 'application/json');
    headers.append('Content-Type', 'multipart/form-data');

    return this.http.post<T>(this.api, params, {headers: headers});
  }

  getDocuments() {
    return this.http.post<Docs>(environment.apiUrl + '/documents', {}).pipe(map(user => user));
  }

  sign(url: string, params: object) {
    return this.http.post<any>(environment.apiUrl + url, params).pipe(map(sign => sign));
  }

  getListOfLegalAccounts() {
    return this.http.get<any>(environment.apiUrl + '/iban');
  }

  geLegalAccountDetail(accountNumber: string) {
    return this.http.get<any>(environment.apiUrl + '/iban/detail?accountNumber=' + accountNumber);
  }

  getMainLegalAccount() {
    return this.http.get<any>(environment.apiUrl + '/iban/getMain');
  }

  setMainLegalAccount(body: any) {
    return this.http.post<any>(environment.apiUrl + '/iban/setMain', body);
  }

  getListOfVehicleAccounts(body: any) {
    return this.http.post<any>(environment.apiUrl + '/auto/getList', body);
  }

  getVehicleDetail(licencePlate: any) {
    return this.http.get<any>(environment.apiUrl + '/auto/detail?licencePlate=' + licencePlate);
  }

  getBill(licencePlate: string, isNative: boolean): Observable<any> {
    return this.http.get(environment.apiUrl + '/auto/bill?licencePlate=' + licencePlate + '&isNative=' + isNative);
  }

  getBillAccount(licencePlate: string): Observable<any> {
    return this.http.get(environment.apiUrl + '/auto/bill/account?licencePlate=' + licencePlate);
  }

  getPayments(licencePlate: string, page: number, itemsPerPage: number): Observable<any> {
    return this.http.get(`${environment.apiUrl}/auto/payments?licencePlate=${licencePlate}&page=${page}&size=${itemsPerPage}`);
  }

  getPaymentDetails(uuid: string): Observable<any> {
    return this.http.get(environment.apiUrl + '/auto/payment-detail?uuid=' + uuid);
  }

  getDepositEntries(licencePlate: string): Observable<any> {
    return this.http.get(environment.apiUrl + '/auto/deposit-entries?licencePlate=' + licencePlate);
  }

  addVehicleToLegalAccount(body: any): Observable<any> {
    return this.http.post<Observable<any>>(environment.apiUrl + '/auto', body);
  }

  addCardNumberVehicle(body: any): Observable<any> {
    return this.http.put<Observable<any>>(environment.apiUrl + '/auto', body);
  }

  removeVehicleToLegalAccount(body: any) {
    return this.http.request('delete', environment.apiUrl + '/auto', {body});
  }

  getDepositsOfAccounts(body: any) {
    return this.http.post<any>(environment.apiUrl + '/iban/getDeposit', body);
  }

  updateContractDetail(body: FormData): Observable<any> {
    return this.http.post<any>(environment.apiUrl + '/contract', body);
  }

  renameCompany(body: any): Observable<any> {
    return this.http.post<any>(environment.apiUrl + '/company', body);
  }

  downloadDocumentRemote(companyId: any): any {
    let companyIdParam = '';
    if (companyId) {
      companyIdParam = '?companyid=' + companyId;
    }
    return this.http.get(environment.apiUrl + '/contract' + companyIdParam, {responseType: 'arraybuffer'});
  }

  downloadAssetRemote(assetId: any): any {
    return this.http.get(environment.apiUrl + '/contract/downloadAssets?assetId=' + assetId, {responseType: 'arraybuffer'});
  }

  passDocument(companyId: any) {
    return this.http.post<any>(environment.apiUrl + '/documents/passed?companyId=' + companyId, {});
  }

  declineDocument(body: any) {
    return this.http.post<any>(environment.apiUrl + '/documents/decline', body);
  }

  declineSignedDocument(body: any) {
    return this.http.post<any>(environment.apiUrl + '/documents/decline-signed', body);
  }

  createNewCompany(body: any) {
    return this.http.post<any>(environment.apiUrl + '/users/createCompany', body);
  }

  updateCompany(body: any) {
    return this.http.post<any>(environment.apiUrl + '/users/updateCompany', body);
  }

  setMainCompanyToAccount(body: any) {
    return this.http.post<any>(environment.apiUrl + '/users', body);
  }

  getSignatures(documentId: string) {
    return this.http.get<any>(environment.apiUrl + '/signature?documentId=' + documentId);
  }

  updateCompanyUser(userId, body: any) {
    body.id = userId;
    return this.http.post<any>(environment.apiUrl + '/companyUsers/' + userId, body);
  }
}
