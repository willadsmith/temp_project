import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { NgbActiveModal, NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { BackendService } from '@app/_services/backend-service';
import { ToastrService } from 'ngx-toastr';
import {TranslatePipe, TranslateService} from '@ngx-translate/core';


@Component({
  selector: 'app-decline-document-dialog',
  templateUrl: './decline-document-dialog.component.html',
  providers: [TranslatePipe]
})
export class DeclineDocumentDialogComponent implements OnInit {
  public router: Router;
  // Set our default values
  reasonType: string;
  comment = '';
  companyId: string;
  currentStatus = '';
  error = false;
  loading = false;
  types = [];

  constructor(public dialog: NgbModal,
              public dialogRef: NgbActiveModal,
              public http: HttpClient,
              private toastr: ToastrService,
              private translateService: TranslateService,
              private translatePipe: TranslatePipe,
              private backendService: BackendService) {
    this.changeCompanyTypeLang(this.translateService.currentLang);
  }

  ngOnInit() {
    this.types.push(
      {description: 'Неправильное наименование огранизации', code: 'INVALID_NAME'},
      {description: 'Другое', code: 'OTHERS'}
    );
  }

  confirm() {
    if (this.comment && this.comment.length < 3) {
      this.toastr.warning(this.translatePipe.transform('decline_document_description_reason'), this.translatePipe.transform('decline_document_info'));
      return;
    }
    const reqBody = {
      declineType: this.reasonType,
      comments: this.comment,
      companyId: this.companyId
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
        this.toastr.warning(this.translatePipe.transform('decline_document_not_declined_doc'), this.translatePipe.transform('decline_document_attention'));
      }
    );
  }

  changeReasonType(event: any) {
    if (event === 'INVALID_NAME') {
      this.comment = this.translatePipe.transform('decline_document_wrong_name_company');
    } else {
      this.comment = '';
    }
  }

  changeCompanyTypeLang(lang: string) {
    this.types = [];
    switch (lang) {
      case 'ru':
        return this.types.push(
          {description: 'Неправильное наименование огранизации', code: 'INVALID_NAME'},
          {description: 'Другое', code: 'OTHERS'}
        );
      case 'kz':
        return this.types.push(
          {description: 'Ұйымның дұрыс емес атауы', code: 'INVALID_NAME'},
          {description: 'Басқа', code: 'OTHERS'}
        );
      // case 'en':
      //   return this.types.push(
      //     {description: 'Неправильное наименование огранизации', code: 'INVALID_NAME'},
      //     {description: 'Другое', code: 'OTHERS'}
      //   );
      default:
        break;
    }
  }

}
