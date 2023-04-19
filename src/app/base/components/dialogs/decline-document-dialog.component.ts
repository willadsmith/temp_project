import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { NgbActiveModal, NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { BackendService } from '@app/_services/backend-service';
import { ToastrService } from 'ngx-toastr';


@Component({
  selector: 'app-decline-document-dialog',
  templateUrl: './decline-document-dialog.component.html'
})
export class DeclineDocumentDialogComponent implements OnInit {
  public router: Router;
  // Set our default values
  reasonType: string;
  comment = '';
  documentId: string;
  companyId: string;
  currentStatus = '';
  error = false;
  loading = false;
  types = [];

  constructor(public dialog: NgbModal,
              public dialogRef: NgbActiveModal,
              public http: HttpClient,
              private toastr: ToastrService,
              private backendService: BackendService) {}

  ngOnInit() {
    this.types.push(
      {description: 'Неправильное наименование огранизации', code: 'INVALID_NAME'},
      {description: 'Другое', code: 'OTHERS'}
    );
  }

  confirm() {
    if (this.comment && this.comment.length < 3) {
      this.toastr.warning('Опишите причину', 'Оповещение!');
      return;
    }
    const reqBody = {
      declineType: this.reasonType,
      comments: this.comment,
      documentId: this.documentId,
      companyId:this.companyId
    };
    let request;
    if (this.currentStatus === 'APPROVED') {
      request = this.backendService.declineSignedDocument(reqBody);
    } else {
      request = this.backendService.declineDocument(reqBody);
    }
    request.subscribe(
      (data: any) => {
        // console.log(data);
        if (data) {
          this.dialogRef.close({result: true});
        }
      },
      (err: any) => {
        this.toastr.warning('Не удалось отклонить документ!', 'Ошибка Сервиса!');
      }
    );
  }

  changeReasonType(event: any) {
    if (event === 'INVALID_NAME') {
      this.comment = 'Неправильное наименование огранизации';
    } else {
      this.comment = '';
    }
  }

}
