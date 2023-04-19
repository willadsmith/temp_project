import { Component, OnDestroy, OnInit } from '@angular/core';
import { NgbActiveModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import {Vehicle} from '@app/entities/legal-accounts/vehicle.model';
import {ToastrService} from 'ngx-toastr';
import {BackendService} from '@app/_services/backend-service';
import {LoadingService} from '@app/_services/loading.service';
import {Router} from "@angular/router";
declare var signXml: any;
declare var EventBus: any;
declare var endConnection: any;
declare var startConnection: any;

@Component({
  selector: 'app-legal-account-switch-dialog',
  templateUrl: './legal-account-switch-dialog.component.html'
})
export class LegalAccountSwitchDialogComponent implements OnInit {
  accountNumber: string;
  public legalAccounts = [];
  public currentPage = 1;
  public totalItems = 0;
  public itemsPerPage = 20;
  public loading = false;
  public selectLoading = false;

  constructor(
    public dialogRef: NgbActiveModal,
    private toastr: ToastrService,
    private router: Router,
    private loadingService: LoadingService,
    private backendService: BackendService) {}

  ngOnInit() {
    this.loadLegals();
  }

  clear() {
    this.dialogRef.dismiss('cancel');
  }

  withOutSpaces(event): boolean {
    const regex = new RegExp('^[a-zA-Z0-9]+$');
    const str = String.fromCharCode(!event.charCode ? event.which : event.charCode);
    if (regex.test(str)) {
      return true;
    }
    return false;
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
        this.toastr.error('Не удалось загрузить данные', 'Ошибка!');
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
        this.dialogRef.close();
        this.router.navigate(['/legal-account/' + data.iban]);
      }, err => {
        // this.loading = false;
        this.toastr.error('Не удалось выбрать лицевой счет', 'Ошибка!');
      }
    );
  }

}
