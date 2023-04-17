import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { NgbActiveModal, NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import {BackendService} from '@app/_services/backend-service';
import {ToastrService} from 'ngx-toastr';


@Component({
  selector: 'app-rename-company-dialog',
  templateUrl: './rename-company-dialog.component.html'
})
export class RenameCompanyDialogComponent implements OnInit {
  public router: Router;
  // Set our default values
  companyName: string;
  documentId:string;
  error = false;
  loading = false;

  constructor(public dialog: NgbModal,
              public dialogRef: NgbActiveModal,
              public http: HttpClient,
              private toastr: ToastrService,
              private backendService: BackendService) {}

  ngOnInit() {
  }

  confirm() {
    const reqBody = {
      companyName: this.companyName,
      documentId:this.documentId
    };
    this.loading = true;
    this.backendService.renameCompany(reqBody).subscribe(
      (data: any) => {
        // console.log(data);
        if (data) {
          this.dialogRef.close({result: true, companyName: this.companyName});
        }
        this.loading = false;
      },
      (err: any) => {
        // console.log(err);
        this.loading = false;
        this.toastr.warning('Не удалось обновить наименование организации.', 'Ошибка!');
      }
    );
  }

}
