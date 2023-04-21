import { EventEmitter, Injectable } from '@angular/core';

@Injectable()
export class CompanyDetailService {
  companyInfoFunction = new EventEmitter();
  constructor() {}

  updateCompanyInfo() {
    this.companyInfoFunction.emit(null);
  }

}
