import {Component, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {BackendService} from '@app/_services/backend-service';
import {AuthenticationService} from '../../_services/authentication.service';
import {ToastrService} from 'ngx-toastr';
import {InfoService} from '@app/layout/form/info.service';
import {NgbModal, NgbModalRef} from '@ng-bootstrap/ng-bootstrap';
import {ContractDetailDialogComponent} from '@app/entities/cabinet/contract-detail-dialog.component';
import * as FileSaver from 'file-saver';
import {ConfirmService} from '@app/layout/form/confirm.service';
import {LoadingService} from '@app/_services/loading.service';
import {RenameCompanyDialogComponent} from "@app/entities/cabinet/rename-company-dialog.component";
import {CompanyDetailService} from "@app/_services/company-detail.service";
import {TranslatePipe} from '@ngx-translate/core';

declare var signXml: any;
declare var EventBus: any;
declare var endConnection: any;
declare var startConnection: any;

@Component({
  selector: 'app-layout',
  templateUrl: './cabinet.component.html',
  styleUrls: ['./cabinet.component.scss'],
  providers: [TranslatePipe]
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
    private translatePipe: TranslatePipe,
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

  singDocument(assetsExist: boolean, sign: any, isResign: boolean) {
    if (!assetsExist) {
      // this.infoService.openModal('', '');
      this.toastr.warning(this.translatePipe.transform('cabinet_full_data_before_sign'), this.translatePipe.transform('cabinet_info'));
      return;
    }

    this.confirmDialogRef = this.confirmService.openModal(this.translatePipe.transform('cabinet_question_full_doc'));
    this.confirmDialogRef.result
      .then(result => {
        // console.log('result: ' + result);
        this.confirmDialogRef = null;
        if (result) {
          this.startProcessSign('PKSC12', sign, isResign);
        }
      })
      .catch(res => {});
  }

  reSingDocument(sign: any, isResign: boolean) {

    this.confirmDialogRef = this.confirmService.openModal(this.translatePipe.transform('cabinet_are_you_sure'));
    this.confirmDialogRef.result
      .then(result => {
        // console.log('result: ' + result);
        this.confirmDialogRef = null;
        if (result) {
          this.startProcessSign('PKSC12', sign, isResign);
        }
      })
      .catch(res => {});
  }

  startProcessSign(storage: string, sign: string, isResign: boolean) {

    this.signTag = sign;
    this.signLoading = true;
    startConnection();
    this.loadingService.showLoading();
    EventBus.subscribe('connect', res => {
      if (res === 1) {

        this.signatureDocsConfirm(isResign);
      } else {
        this.toastr.warning(this.translatePipe.transform('cabinet_error_connection_nca_layer'), this.translatePipe.transform('cabinet_error_nca_layer'));
        this.signLoading = false;
        this.loadingService.hideLoading();
        EventBus.unsubscribe('connect');
        EventBus.unsubscribe('token');
      }
    });
  }

  signatureDocsConfirm(isResign: boolean) {
    this.signXmlCall();
    EventBus.subscribe('signed', async (res) => {
      console.log('signed start', res);
      if (res['code'] === '500') {
        if (res.message !== 'action.canceled') {
          this.toastr.error(this.translatePipe.transform('cabinet_error_nca_layer') + res.message , this.translatePipe.transform('cabinet_error_sign'));
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
          this.backendService.sign(url, {params}).subscribe(response => {
            if (response.statusCode === 416) {
              this.toastr.error(response.message, this.translatePipe.transform('cabinet_error_sign'));
            } else {
              this.toastr.success(this.translatePipe.transform('cabinet_sign_completed'), this.translatePipe.transform('cabinet_signed'));

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
              this.toastr.error(err, this.translatePipe.transform('cabinet_error_sign'));
            } else {
              this.toastr.error(this.translatePipe.transform('cabinet_not_sign'), this.translatePipe.transform('cabinet_error_sign'));
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
    if (document && document.company) {
      companyName = document.company.name;
    }
    this.renameCompanyDialogRef = this.dialog.open(RenameCompanyDialogComponent as Component, {
      size: 'lg',
      backdrop: 'static'
    });
    this.renameCompanyDialogRef.componentInstance.companyName = companyName;
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

  downloadDocument(bin: string) {
    this.backendService.downloadDocumentRemote(null)
      .subscribe(response => this.saveToFileSystem(response, bin), error => {
        this.toastr.warning(this.translatePipe.transform('cabinet_error_download'), this.translatePipe.transform('dashboard_error'));
      });
  }

  private saveToFileSystem(response: any, bin: string) {
    const blob = new Blob([response], { type: 'application/pdf' });
    FileSaver.saveAs(blob, 'Договор' + (bin === '' ? '' : '-' + bin) + '.pdf');
  }

}
