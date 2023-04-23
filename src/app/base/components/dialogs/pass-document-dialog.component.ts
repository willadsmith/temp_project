import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { NgbActiveModal, NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { BackendService } from '@app/_services/backend-service';
import { ToastrService } from 'ngx-toastr';
import {TranslatePipe} from '@ngx-translate/core';


@Component({
  selector: 'app-pass-document-dialog',
  templateUrl: './pass-document-dialog.component.html',
  providers: [TranslatePipe]
})
export class PassDocumentDialogComponent implements OnInit {
  public router: Router;
  // Set our default values
  reasonType: string;
  documentId: string;
  currentStatus = '';
  error = false;
  loading = false;
  types = [];

  constructor(public dialog: NgbModal,
              public dialogRef: NgbActiveModal,
              public http: HttpClient,
              private toastr: ToastrService,
              private translatePipe: TranslatePipe,
              private backendService: BackendService) {}

  ngOnInit() {
  }

  confirm() {
    this.loading = true;
    const request = this.backendService.passDocument(this.documentId);
    request.subscribe(
      (data: any) => {
        // console.log(data);
        if (data) {
          this.dialogRef.close({result: true});
        }
      },
      (err: any) => {
        this.toastr.warning(this.translatePipe.transform('pass_document_error_confirm'), this.translatePipe.transform('pass_document_error_service'));
      }
    );
  }

}
