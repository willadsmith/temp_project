import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { BackendService } from '@app/_services/backend-service';
import {TranslatePipe} from '@ngx-translate/core';

@Component({
  selector: 'app-layout',
  templateUrl: './legal-account.component.html',
  styleUrls: ['./legal-account.component.scss'],
  providers: [TranslatePipe]
})
export class LegalAccountComponent implements OnInit {

  public currentUser;
  public userProfile;
  private xin;
  private currentIban;
  public legalAccounts = [];
  loading = false;
  currentPage = 1;
  totalItems = 0;
  itemsPerPage = 20;

  constructor(
    private toastr: ToastrService,
    private router: Router,
    private translatePipe: TranslatePipe,
    private backendService: BackendService
  ) {}

  ngOnInit() {
    this.currentUser = localStorage.getItem('currentUser');
    this.userProfile = JSON.parse(this.currentUser).user;
    this.loading = true;
    this.backendService.getMainLegalAccount().subscribe(data => {
      if (data && data.accounts) {
        if (data.accounts[0].iban) {
          this.router.navigate(['/legal-account/' + data.accounts[0].iban]);
        } else {
          this.loadLegals();
        }
      } else {
        this.loadLegals();
      }
    }, err => {
      this.loading = false;
      this.toastr.error(this.translatePipe.transform('legal_account_error_upload_data'), this.translatePipe.transform('dashboard_error') + '!');
    });
  }

  pageChanged(event: any): void {
    console.log('Page changed to: ' + event);
    this.currentPage = event;
    this.loadLegals();
  }

  loadLegals() {
    this.loading = true;
    this.backendService.getListOfLegalAccounts().subscribe(
      data => {
        if (data) {
          this.totalItems = data.totalElements;
          this.legalAccounts = data.content;
        }
        this.loading = false;
      }, err => {
        this.loading = false;
        this.toastr.error(this.translatePipe.transform('legal_account_error_upload_data'), this.translatePipe.transform('dashboard_error') + '!');
      }
    );
  }

  setMain(legalAccount: any) {
    let xin = null;
    let companyName = null;
    let email = null;
    let mobileNumber = null;
    let address = null;
    if (legalAccount.owner) {
      xin = legalAccount.owner.xin;
      mobileNumber = legalAccount.owner.mobileNumber;
      address = legalAccount.owner.address;
      email = legalAccount.owner.email;
      if (legalAccount.owner.ownerType === 'COMPANY') {
        companyName = legalAccount.owner.companyName;
      } else {
        companyName = legalAccount.owner.lastName + ' ' + legalAccount.owner.firstName + ' ' + legalAccount.owner.middleName;
      }
    }
    const reqBody = {
      iban: legalAccount.accountNumber,
      contractNumber: legalAccount.contractNumber,
      xin: xin,
      companyName: companyName,
      email: email,
      mobileNumber: mobileNumber,
      address: address
    };
    // this.loading = true;
    this.backendService.setMainLegalAccount(reqBody).subscribe(
      data => {
        // console.log(data);
        this.router.navigate(['/legal-account/' + data.iban]);
      }, err => {
        // this.loading = false;
          this.toastr.error(this.translatePipe.transform('legal_account_error_choose_account'), this.translatePipe.transform('dashboard_error') + '!');
      }
    );
  }

}
