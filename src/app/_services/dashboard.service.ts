import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {BehaviorSubject, Observable} from 'rxjs';
import {map} from 'rxjs/operators';

import {environment} from '@environments/environment';
import {Docs, User, Company} from '../_models';

@Injectable({providedIn: 'root'})
export class DashboardService {
  private currentUserSubject: BehaviorSubject<User>;
  public currentUser: Observable<User>;
  public docs: Observable<Docs>;
  public company: Observable<Company>;

  constructor(private http: HttpClient) {
    this.currentUserSubject = new BehaviorSubject<User>(JSON.parse(localStorage.getItem('currentUser')));
    this.currentUser = this.currentUserSubject.asObservable();
  }

  docsCompany(url: string, status: string, companyName: string, bin: string) {
    let req_url = url;
    if (status && status !== '') {
      req_url += '&status=' + status;
    }
    if (companyName && companyName !== '') {
      req_url += '&name=' + companyName;
    }
    if (bin && bin !== '') {
      req_url += '&bin=' + bin;
    }
    return this.http.get<Company>(environment.apiUrl + req_url).pipe(map(doc => doc));
  }

  getCompaniesByBin(url: string, bin: string) {
    return this.http.get<Company>(environment.apiUrl + url + '?bin=' + bin).pipe(map(doc => doc));
  }

  users(url: string, bin: string, iin: string) {
    let req_url = url;
    if (bin && bin !== '') {
      req_url += '&bin=' + bin;
    }
    if (iin && iin !== '') {
      req_url += '&iin=' + iin;
    }
    return this.http.get<any>(environment.apiUrl + req_url).pipe(map(doc => doc));
  }

  sign(url: string,companyId: string, documentId: string, params: object) {
    return this.http.post<any>(environment.apiUrl + url, { companyId, documentId, params});
  }
  createDocument(companyId: string) {
    return this.http.post<any>(environment.apiUrl + '/documents/create', {
      companyId
    });
  }
}
