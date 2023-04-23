import { Component, OnDestroy, OnInit } from '@angular/core';
import { NgbActiveModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { BackendService } from '@app/_services/backend-service';
import { LoadingService } from '@app/_services/loading.service';
import { Router } from '@angular/router';
import {TranslatePipe} from '@ngx-translate/core';

@Component({
  selector: 'app-company-user-update-dialog',
  templateUrl: './company-user-update-dialog.component.html',
  providers: [TranslatePipe]
})
export class CompanyUserUpdateDialogComponent implements OnInit {
  public companies = [];
  public loading = false;

  public companyUser: any;
  public companyUserId: any;

  constructor(
    public dialogRef: NgbActiveModal,
    private toastr: ToastrService,
    private router: Router,
    private loadingService: LoadingService,
    private translatePipe: TranslatePipe,
    private backendService: BackendService) {}

  ngOnInit() {
  }

  clear() {
    this.dialogRef.dismiss('cancel');
  }

  updateCompanyUser() {
    this.loading = true;
    this.backendService.updateCompanyUser(this.companyUserId, this.companyUser).subscribe(
      data => {
        this.loading = false;
        this.dialogRef.close({ result: true });
      }, err => {
        this.loading = false;
          this.toastr.error(this.translatePipe.transform('dialogs_company_not_update_signer'), this.translatePipe.transform('dashboard_error'));
      }
    );
  }

}
