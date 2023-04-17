import { Component, OnDestroy, OnInit } from '@angular/core';
import { NgbActiveModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import {Vehicle} from '@app/entities/legal-accounts/vehicle.model';
import {ToastrService} from 'ngx-toastr';
import {BackendService} from '@app/_services/backend-service';
import {LoadingService} from '@app/_services/loading.service';
import {Router} from '@angular/router';
import {DashboardService} from "@app/_services";
import * as lodash from "lodash";
import {Company, CompanyEntity} from "@app/_models";
import {TranslatePipe} from '@ngx-translate/core';
declare var signXml: any;
declare var EventBus: any;
declare var endConnection: any;
declare var startConnection: any;

@Component({
  selector: 'app-user-switch-company-dialog',
  templateUrl: './users-switch-company-dialog.component.html',
  providers: [TranslatePipe]
})
export class UsersSwitchCompanyDialogComponent implements OnInit {
  accountNumber: string;
  public companies = [];
  public currentPage = 1;
  public totalItems = 0;
  public itemsPerPage = 20;
  public loading = false;
  public bin = '';
  public userId = '';
  public companyId = '';
  public companyName = '';
  public companyType = '';
  public selectLoading = false;

  public companyOpened = false;
  public infoNew = '';
  public currentCompanyId = '';
  public currentStatus = 'CREATE';

  constructor(
    public dialogRef: NgbActiveModal,
    private toastr: ToastrService,
    private router: Router,
    private loadingService: LoadingService,
    private backendService: BackendService,
    private translatePipe: TranslatePipe,
    private dashboardService: DashboardService) {}

  ngOnInit() {
    this.loadCompanies();
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

  loadCompanies() {
    this.loading = true;
    this.dashboardService.getCompaniesByBin('/company/findall', this.bin)
      .subscribe((res: any) => {
        this.companies = res[0];
        for (let i = 0; i < this.companies.length; i++) {
          this.companies[i].name = lodash.unescape(this.companies[i].name);
        }
        if (this.companies.length > 1) {
          this.sortByCompaniesDate();
        }
        this.loading = false;
    }, err => {
      // console.log(err);
      this.loading = false;
      this.toastr.error(this.translatePipe.transform('users_switch_download_error_data'), this.translatePipe.transform('users_switch_error'));
    });
  }

  openNewCompany() {
    this.companyOpened = true;
    this.infoNew = '';
    this.currentStatus = 'CREATE';
  }

  openUpdateCompany(companyId: any, info: string) {
    this.companyOpened = true;
    this.infoNew = info;
    this.currentCompanyId = companyId;
    this.currentStatus = 'UPDATE';
  }

  closeUpdateCompany() {
    this.companyOpened = false;
    this.infoNew = '';
    this.currentCompanyId = null;
    this.currentStatus = 'CLOSE';
    this.loadCompanies();
  }

  setMain(companyId: any) {
    const reqBody = {
      userId: this.userId,
      companyId: companyId
    };
    this.selectLoading = true;
    this.backendService.setMainCompanyToAccount(reqBody).subscribe(
      data => {
        // console.log(data);
        this.dialogRef.close({ result: true });
      }, err => {
        this.selectLoading = false;
        this.toastr.error(this.translatePipe.transform('users_switch_update_invalid_company'), this.translatePipe.transform('users_switch_error'));
      }
    );
  }

  createOrUpdateCompany() {
    if (this.currentStatus === 'CREATE') {
      this.createNewCompany();
    } else if (this.currentStatus === 'UPDATE') {
      this.updateCompany();
    }
  }

  createNewCompany(){
    const reqBody = {
      bin: this.bin,
      name: this.companyName,
      info: this.infoNew,
      companyType: this.companyType
    };
    this.selectLoading = true;
    this.backendService.createNewCompany(reqBody).subscribe(
      data => {
        // console.log(data);
        this.setMain(data.id);
      }, err => {
        this.selectLoading = false;
        this.toastr.error(this.translatePipe.transform('users_switch_not_create_new_branch'), this.translatePipe.transform('users_switch_error'));
      }
    );
  }

  updateCompany(){
    const reqBody = {
      companyId: this.currentCompanyId,
      info: this.infoNew
    };
    this.selectLoading = true;
    this.backendService.updateCompany(reqBody).subscribe(
      data => {
        this.selectLoading = false;
        this.closeUpdateCompany();
      }, err => {
        this.selectLoading = false;
        this.toastr.error(this.translatePipe.transform('users_switch_update_invalid_company'), this.translatePipe.transform('users_switch_error'));
      }
    );
  }
  private getTime(date?: string) {
    return date != null ? new Date(date).getTime() : 0;
  }


  public sortByCompaniesDate(): void {
    this.companies.sort((a: CompanyEntity, b: CompanyEntity) => {
      return this.getTime(a.createdAt) - this.getTime(b.createdAt);
    });
  }

}
