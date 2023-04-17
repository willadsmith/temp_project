import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { BackendService } from '@app/_services/backend-service';
import { AuthenticationService } from '../../_services/authentication.service';
import { ToastrService } from 'ngx-toastr';
import { InfoService } from '@app/layout/form/info.service';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { ContractDetailDialogComponent } from '@app/entities/cabinet/contract-detail-dialog.component';
import * as FileSaver from 'file-saver';
import { ConfirmService } from '@app/layout/form/confirm.service';
import { LoadingService } from '@app/_services/loading.service';
import { RenameCompanyDialogComponent } from "@app/entities/cabinet/rename-company-dialog.component";
import { CompanyDetailService } from "@app/_services/company-detail.service";

declare var signXml: any;
declare var EventBus: any;
declare var endConnection: any;
declare var startConnection: any;

@Component({
  selector: 'app-layout',
  templateUrl: './cabinet.component.html',
  styleUrls: ['./cabinet.component.scss']
})
export class CabinetComponent implements OnInit {

  public currentUrl: string;
  public isLogged = false;
  public docs;
  public signTag;
  public signStatus = false;
  public signLoading = false;
  contractDetailDialogRef: NgbModalRef;
  renameCompanyDialogRef: NgbModalRef;
  confirmDialogRef: NgbModalRef;
  currentUser: any;

  constructor(
    private router: Router,
    private toastr: ToastrService,
    private infoService: InfoService,
    public dialog: NgbModal,
    private loadingService: LoadingService,
    private confirmService: ConfirmService,
    private backendService: BackendService,
    private companyDetailService: CompanyDetailService
  ) {
    router.events.subscribe((url: any) => this.currentUrl = router.url);
  }

  ngOnInit() {
    this.loadDocuments();
  }

  loadDocuments() {
    this.backendService.getDocuments().subscribe(
      response => {
        this.docs = response;
      }
    );
  }

  singDocument(doc: any, assetsExist: boolean, sign: any, isResign: boolean) {
    if (!assetsExist) {
      // this.infoService.openModal('', '');
      this.toastr.warning('Заполните данные перед пописанием документа', 'Уведомление');
      return;
    }

    this.confirmDialogRef = this.confirmService.openModal('Вы уверены в правильности заполненных данных договора?');
    this.confirmDialogRef.result
      .then(result => {
        // console.log('result: ' + result);
        this.confirmDialogRef = null;
        if (result) {
          this.startProcessSign(doc, 'PKSC12', sign, isResign);
        }
      })
      .catch(res => { });
  }

  reSingDocument(doc: any, sign: any, isResign: boolean) {

    this.confirmDialogRef = this.confirmService.openModal('Вы уверены?');
    this.confirmDialogRef.result
      .then(result => {
        // console.log('result: ' + result);
        this.confirmDialogRef = null;
        if (result) {
          this.startProcessSign(doc, 'PKSC12', sign, isResign);
        }
      })
      .catch(res => { });
  }

  startProcessSign(doc: any, storage: string, sign: string, isResign: boolean) {

    this.signTag = sign;
    this.signLoading = true;
    startConnection();
    this.loadingService.showLoading();
    EventBus.subscribe('connect', res => {
      if (res === 1) {

        this.signatureDocsConfirm(doc, isResign);
      } else {
        this.toastr.warning('Не запущен или не установлен NCALayer', 'Уведомление');
        this.signLoading = false;
        this.loadingService.hideLoading();
        EventBus.unsubscribe('connect');
        EventBus.unsubscribe('token');
      }
    });
  }

  signatureDocsConfirm(doc: any, isResign: boolean) {
    this.signXmlCall();
    EventBus.subscribe('signed', async (res) => {
      console.log('signed start', res);
      if (res['code'] === '500') {
        if (res.message !== 'action.canceled') {
          this.toastr.error(`Ошибка NCALayer: ${res.message}`, 'Ошибка подписи');
        }
        this.loadingService.hideLoading();
        EventBus.unsubscribe('signed');
        EventBus.unsubscribe('connect');
        EventBus.unsubscribe('token');
        endConnection();
        this.signLoading = false;
      }

      if (res['code'] === '200') {
        if (res['responseObject'] !== undefined) {
          const xml = res['responseObject'];
          const params = {
            xml: xml
          };
          this.signStatus = true;
          let url = '';
          if (isResign) {
            url = '/resigned/document';
          } else {
            url = '/signature/document';
          }
          this.backendService.sign(url, { params, documentId: doc.id }).subscribe(response => {
            if (response.statusCode === 416) {
              this.toastr.error(response.message, 'Ошибка подписи');
            } else {
              this.toastr.success('Документ успешно подписан', 'Подписано');

              this.backendService.getDocuments().subscribe(
                result => {
                  this.docs = result;
                }
              );
            }
            this.signLoading = false;
          }, err => {
            // console.log(err);
            if (err && err.error && err.error.message === 'Пожалуйста используйте верную подпись') {
              this.toastr.error(err, 'Ошибка подписи');
            } else {
              this.toastr.error('Не удалось подписать', 'Ошибка подписи');
            }
            this.signLoading = false;
          });

          EventBus.unsubscribe('signed');
          EventBus.unsubscribe('connect');
          EventBus.unsubscribe('token');

          endConnection();
        } else {
          this.signLoading = false;
        }
        this.loadingService.hideLoading();
      }
    });
  }

  signXmlCall() {
    const xmlToSign = '<xml>' + this.signTag + '</xml>';
    const selectedStorage = 'PKCS12';

    signXml(selectedStorage, 'SIGNATURE', xmlToSign, 'signXmlBack');
  }

  fillContractData(document: any) {
    let contractData = null;
    if (document && document.company && document.company.jsonData) {
      contractData = document.company.jsonData;
    }
    this.contractDetailDialogRef = this.dialog.open(ContractDetailDialogComponent as Component, {
      size: 'lg',
      backdrop: 'static'
    });
    this.contractDetailDialogRef.componentInstance.contractData = contractData;
    this.contractDetailDialogRef.componentInstance.documentId = document.id;
    let hasAssets = false;
    let assetsName = null;
    if (document.assets && document.assets.length > 0) {
      hasAssets = true;
      assetsName = document.assets[0].name;
    }
    this.contractDetailDialogRef.componentInstance.hasAssets = hasAssets;
    this.contractDetailDialogRef.componentInstance.assetsName = assetsName;

    this.contractDetailDialogRef.result
      .then(response => {
        console.log(response);
        this.contractDetailDialogRef = null;
        if (response && response.result === true) {
          this.loadDocuments();
        }
      })
      .catch(res => {
      });
  }

  renameCompany(document: any) {
    let companyName = null;
    let documentId = null;
    if (document && document.company) {
      companyName = document.company.name;
      documentId=document.id;
    }
    this.renameCompanyDialogRef = this.dialog.open(RenameCompanyDialogComponent as Component, {
      size: 'lg',
      backdrop: 'static'
    });
    this.renameCompanyDialogRef.componentInstance.companyName = companyName;
    this.renameCompanyDialogRef.componentInstance.documentId=document.id
    this.renameCompanyDialogRef.result
      .then(response => {
        console.log(response);
        if (response && response.result === true) {
          console.log('here 1');
          this.currentUser = JSON.parse(localStorage.getItem('currentUser'));
          this.currentUser.company.name = response.companyName;
          localStorage.setItem('currentUser', JSON.stringify(this.currentUser));
          console.log('here 5');
          this.loadDocuments();
          this.companyDetailService.updateCompanyInfo();
        }
        this.renameCompanyDialogRef = null;
      })
      .catch(res => {
      });
  }

  downloadDocument(bin: string, documentId:string) {
    this.backendService.downloadDocumentRemote(documentId)
      .subscribe(response => this.saveToFileSystem(response, bin), error => {
        this.toastr.warning('Не удалось скачать файл', 'Ошибка');
      });
  }

  private saveToFileSystem(response: any, bin: string) {
    const blob = new Blob([response], { type: 'application/pdf' });
    FileSaver.saveAs(blob, 'Договор' + (bin === '' ? '' : '-' + bin) + '.pdf');
  }

}
