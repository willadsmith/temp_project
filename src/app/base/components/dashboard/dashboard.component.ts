import { Component, OnInit } from '@angular/core';
import { DashboardService } from '@app/_services';
import { ToastrService } from 'ngx-toastr';
import { ContractDetailDialogComponent } from '@app/entities/cabinet/contract-detail-dialog.component';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { DeclineDocumentDialogComponent } from '../dialogs/decline-document-dialog.component';
import { PassDocumentDialogComponent } from '../dialogs/pass-document-dialog.component';
import { BackendService } from '@app/_services/backend-service';
import * as FileSaver from 'file-saver';
import * as lodash from 'lodash';
import { LoadingService } from '@app/_services/loading.service';

declare var signXml: any;
declare var EventBus: any;
declare var endConnection: any;
declare var startConnection: any;
declare var getActiveTokens: any;
declare var selectSignType: any;
declare var chooseNCAStorage: any;

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class BaseDashboardComponent implements OnInit {

  contractDeclineDialogRef: NgbModalRef;
  contractPassDialogRef: NgbModalRef;

  constructor(
    private dashboardService: DashboardService,
    public dialog: NgbModal,
    private toastr: ToastrService,
    private loadingService: LoadingService,
    private backendService: BackendService
  ) { }

  public clicked = true;
  public clicked1 = false;
  public docsCompany;
  public signTag;
  public companyId;
  public signStatus = false;
  public currentStatus = '';
  bin = '';
  companyName = '';
  loadingDocuments = false;

  companiesTotalItems: any;
  companiesPage: any;
  itemsPerPage: any;
  sort = '';
  order = 'DESC';
  filterCounter = 0;
  filterIcon = 'filter';

  ngOnInit() {
    this.companiesPage = 1;
    this.itemsPerPage = 10;
    this.loadDocuments(true);
  }

  companiesPageChanged(event) {
    console.log(event);
    console.log('Page changed to: ' + event);
    this.companiesPage = event;
    this.loadDocuments(false);
  }

  clearQueries() {
    this.companyName = null;
    this.bin = null;
    this.currentStatus = null;
    this.loadDocuments(true);
  }

  loadDocuments(isReset) {
    if (isReset) {
      this.companiesPage = 1;
    }
    this.loadingDocuments = true;
    this.dashboardService.docsCompany('/company?page=' + this.companiesPage + '&take='
      + this.itemsPerPage + '&sort=' + this.sort + '&order=' + this.order,
      this.currentStatus, this.companyName, this.bin).subscribe((res: any) => {
        this.docsCompany = res.data;
        for (let i = 0; i < this.docsCompany.length; i++) {
          this.docsCompany[i].company.name = lodash.unescape(this.docsCompany[i].company.name);
        }
        this.companiesTotalItems = res.meta.itemCount;
        this.loadingDocuments = false;
      }, err => {
        // console.log(err);
        this.loadingDocuments = false;
      });
  }

  startProcessSign(storage: string, sign: string, id: string, docComp: any) {
    sign = sign.replace(/&/g, '&amp;');
    this.signTag = sign;
    this.companyId = id;
    startConnection();
    this.loadingService.showLoading();
    EventBus.subscribe('connect', res => {
      if (res === 1) {

        this.signatureDocsConfirm(docComp);
      } else {
        this.toastr.error('Не запущен или не установлен NCALayer', 'Ошибка');
        this.loadingService.hideLoading();
        EventBus.unsubscribe('connect');
        EventBus.unsubscribe('token');
      }
    });
  }

  createDocument(companyId: string) {
    if (!confirm('Вы уверены, что хотите создать документ?')) return;
    this.loadingDocuments = true;
    this.dashboardService.createDocument(companyId).subscribe(response => {
      this.loadingDocuments = false;
      this.toastr.success('Документ успешно создан', 'Успешно');
      this.loadDocuments(false);
    }, error => {
      this.loadDocuments(false);
      this.toastr.error('Не удалось создать документ', 'Ошибка!');
    });
  }
  signatureDocsConfirm(docComp: any) {
    this.signXmlCall();
    EventBus.subscribe('signed', async (res) => {
      if (res['code'] === '500') {
        if (res.message !== 'action.canceled') {
          this.toastr.error(`Ошибка NCALayer: ${res.message}`, 'Ошибка');
        }
        this.loadingService.hideLoading();
        EventBus.unsubscribe('signed');
        EventBus.unsubscribe('connect');
        EventBus.unsubscribe('token');
        endConnection();
      }

      if (res['code'] === '200') {
        if (res['responseObject'] !== undefined) {
          const xml = res['responseObject'];
          this.signStatus = true;
          docComp.loading = true;

          this.dashboardService.sign('/signature/operator', this.companyId, docComp.id, { xml }).
            subscribe(response => {
              // console.log(response);
              docComp.loading = false;
              this.toastr.success('Документ успешно подписан', 'Подписано');
              this.loadDocuments(false);
            }, error => {
              if (error && error.error && error.error.message === 'Пожалуйста используйте верную подпись') {
                this.toastr.error(error.error.message, 'Ошибка!');
              } else {
                this.toastr.error('Не удалось подписать документ', 'Ошибка!');
              }
              docComp.loading = false;
            });

          EventBus.unsubscribe('signed');
          EventBus.unsubscribe('connect');
          EventBus.unsubscribe('token');

          endConnection();
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

  approveDocument(documentId: string) {
    this.contractPassDialogRef = this.dialog.open(PassDocumentDialogComponent as Component, {
      size: 'lg',
      backdrop: 'static'
    });
    this.contractPassDialogRef.componentInstance.documentId = documentId;

    this.contractPassDialogRef.result
      .then(response => {
        this.contractPassDialogRef = null;
        if (response && response.result === true) {
          this.loadDocuments(false);
        }
      })
      .catch(res => {
      });
  }

  declineDocument(documentId: string,companyId:string, status: string) {
    this.contractDeclineDialogRef = this.dialog.open(DeclineDocumentDialogComponent as Component, {
      size: 'lg',
      backdrop: 'static'
    });
    this.contractDeclineDialogRef.componentInstance.documentId = documentId;
    this.contractDeclineDialogRef.componentInstance.companyId = companyId;
    this.contractDeclineDialogRef.componentInstance.currentStatus = status;

    this.contractDeclineDialogRef.result
      .then(response => {
        this.contractDeclineDialogRef = null;
        if (response && response.result === true) {
          this.loadDocuments(false);
        }
      })
      .catch(res => {
      });
  }

  downloadDocument(bin: string, documentId: string, companyId:string) {
    console.log(companyId)
    this.backendService.downloadDocumentRemote(documentId,companyId)
      .subscribe(response =>
        this.saveToFileSystem(response, 'Договор-' + bin + '.pdf', 'application/pdf'),
        error => {
          this.toastr.warning('Не удалось скачать файл', 'Ошибка');
        });
  }

  downloadAsset(asset) {
    // id: "a14f5a1e-1405-49c8-9e82-570cd413a3c9"
    // mimeType: "image/jpeg"
    // name: "M02Z01R1P01L01-2021-7b638efe-45e2-11ec-ab60-20677cf2af78.jpg"
    this.backendService.downloadAssetRemote(asset.id)
      .subscribe(response => this.saveToFileSystem(response, asset.name, asset.mimeType), error => {
        this.toastr.warning('Не удалось скачать файл', 'Ошибка');
      });
  }

  private saveToFileSystem(response: any, name: string, type: string) {
    const blob = new Blob([response], { type: type });
    FileSaver.saveAs(blob, name);
  }

  getCountFrom() {
    return (this.companiesPage - 1) * this.itemsPerPage === 0 ? 1 : (this.companiesPage - 1) * this.itemsPerPage + 1;
  }

  getCountTo() {
    return this.companiesPage * this.itemsPerPage < this.companiesTotalItems ? this.companiesPage * this.itemsPerPage : this.companiesTotalItems;
  }

  changeFilter() {
    this.filterCounter += 1;
    const index = this.filterCounter % 3;
    if (index === 0) {
      this.filterIcon = 'filter';
      this.filterCounter = 0;
      this.order = 'DESC';
      this.sort = '';
    } else if (index === 1) {
      this.filterIcon = 'arrow-up';
      this.order = 'DESC';
      this.sort = 'documents.contractNumber';
    } else {
      this.filterIcon = 'arrow-down';
      this.order = 'ASC';
      this.sort = 'documents.contractNumber';
    }
    this.loadDocuments(true);
  }
}
