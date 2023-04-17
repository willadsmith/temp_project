import { Component, OnDestroy, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {ActivatedRoute, Router} from '@angular/router';

import {NgbModal, NgbModalRef} from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { BackendService } from '@app/_services/backend-service';
import { ConfirmService } from '@app/layout/form/confirm.service';
import { LegalAccountVehicleDialogComponent } from './legal-account-vehicle-dialog.component';
import { LegalAccountSwitchDialogComponent } from './legal-account-switch-dialog.component';
import {Vehicle} from '@app/entities/legal-accounts/vehicle.model';
import {LoadingService} from '@app/_services/loading.service';
import {LegalAccountVehicleCardDialogComponent} from '@app/entities/legal-accounts/legal-account-vehicle-card-dialog.component';

declare var signXml: any;
declare var EventBus: any;
declare var endConnection: any;
declare var startConnection: any;

@Component({
  selector: 'app-legal-account-detail',
  templateUrl: './legal-account-detail.component.html',
  styleUrls: ['./legal-account-detail.component.scss']
})
export class LegalAccountDetailComponent implements OnInit, OnDestroy {
  legalAccount: any;

  vehicles = [];
  deposits = [];

  error: any;
  success: any;

  vehiclesTotalItems: any;
  depositsTotalItems: any;

  vehiclesPage: any;
  depositsPage: any;
  logsPage: any;
  itemsPerPage: any;

  predicate: any;
  loadingBalance = false;
  loadingVehicles = false;
  loadingDeposits = false;
  reverse: any;
  accountNumber: any;
  licencePlate: any;
  confirmDialogRef: NgbModalRef;
  vehicleAddDialogRef: NgbModalRef;
  switchLegalAccountDialogRef: NgbModalRef;

  private subscription: any;
  public signTag;
  public signStatus = false;
  public enableCardNumbers = false;

  constructor(
    private route: ActivatedRoute,
    private http: HttpClient,
    private toastr: ToastrService,
    public dialog: NgbModal,
    private router: Router,
    private loadingService: LoadingService,
    private confirmService: ConfirmService,
    private backendService: BackendService
  ) {
    this.itemsPerPage = 20;
    this.vehiclesPage = 1;
    this.depositsPage = 1;
    this.logsPage = 1;
  }

  ngOnInit() {
    this.subscription = this.route.params.subscribe((params: any) => {
      this.accountNumber = params['accountNumber'];
      if (this.accountNumber === '202205201809875') {
        this.enableCardNumbers = true;
      }
      this.loadItem(this.accountNumber);
    });
  }


  ngOnDestroy() {
  }

  loadItem(accountNumber) {
    const $request = this.backendService.geLegalAccountDetail(accountNumber);
    $request.subscribe((legalAccount: any) => {
      this.legalAccount = legalAccount;
      this.loadVehicles(true);
      this.loadDeposits();
    });
  }

  loadVehicles(isReset) {
    if (this.accountNumber) {
      if (isReset) {
        this.vehiclesPage = 1;
      }
      // let licencePlate = null;
      // if (this.licencePlate !== '' && this.licencePlate) {
      //   licencePlate = this.licencePlate.replaceAll(/\s/g, '').toUpperCase();
      // }
      this.vehicles = [];
      this.loadingVehicles = true;
      const $request = this.backendService.getListOfVehicleAccounts({
        accountNumber: this.accountNumber,
        page: this.vehiclesPage - 1,
        size: this.itemsPerPage
        // licencePlate
        // sort: this.sort()
      });
      $request.subscribe(
        (data: any) => {
          if (data) {
            this.vehiclesTotalItems = data.totalElements;
            this.vehicles = data.content;
          }
          this.loadingVehicles = false;
        },
        (res: Response) => this.onError(res, 'loadVehicles')
      );
    } else {
      console.log('legal-account Code not found');
    }
  }

  loadDeposits() {
    if (this.accountNumber) {
      // let licencePlate = null;
      // if (this.licencePlate !== '' && this.licencePlate) {
      //   licencePlate = this.licencePlate.replaceAll(/\s/g, '').toUpperCase();
      // }
      this.deposits = [];
      this.loadingDeposits = true;
      const $request = this.backendService.getDepositsOfAccounts({
        accountNumber: this.accountNumber,
        page: this.depositsPage - 1,
        size: this.itemsPerPage
        // licencePlate
        // sort: this.sort()
      });
      $request.subscribe(
        (data: any) => {
          if (data) {
            this.depositsTotalItems = data.totalElements;
            this.deposits = data.content;
          }
          this.loadingDeposits = false;
        },
        (res: Response) => this.onError(res, 'loadDeposits')
      );
    } else {
      console.log('legal-account Code not found');
    }
  }

  clearQueries() {
    this.licencePlate = '';
    this.loadVehicles(true);
  }

  trackIdentity(index, item: any) {
    return item.id;
  }


  vehiclesPageChanged(event: any): void {
    console.log('Page changed to: ' + event);
    this.vehiclesPage = event;
    this.loadVehicles(false);
  }

  depositsPageChanged(event: any): void {
    console.log('Page changed to: ' + event);
    this.depositsPage = event;
    // this.loadDeposits();
  }

  private onError(error, method) {
    // if (error) {
    //   this.alertService.error(error.error, error.message, null);
    // }
    if (method === 'loadVehicles') {
      this.loadingVehicles = false;
    } else if (method === 'loadDeposits') {
      this.loadingDeposits = false;
    }
  }

  startProcessSign(storage: string, sign: string, method: string, vehicles: Vehicle[]) {
    this.signTag = sign;
    startConnection();
    this.loadingService.showLoading();
    EventBus.subscribe('connect', res => {
      if (res === 1) {
        this.signatureConfirm(method, vehicles);
      } else {
        this.toastr.warning('Не запущен или не установлен NCALayer', 'Ошибка NCALayer!');
        this.loadingService.hideLoading();
        EventBus.unsubscribe('connect');
        EventBus.unsubscribe('token');
      }
    });
  }

  signatureConfirm(method: string, vehicles: Vehicle[]) {
    this.signXmlCall();
    EventBus.subscribe('signed', async (res) => {
      console.log('signed start', res);
      if (res['code'] === '500') {
        if (res.message ===  'action.canceled') {
          this.toastr.warning('Процесс подписи прекращен пользователем', 'Ошибка NCALayer!');
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

          const params = {
            xml: xml
          };

          this.signStatus = true;
          // console.log('method: ' + method);
          // console.log('vehicles: ' + vehicles);
          const vehiclesResult = [];
          for (let i = 0; i < vehicles.length; i++) {
            vehiclesResult.push({
              accountNumber: this.accountNumber,
              licencePlate: vehicles[i].licencePlate.toUpperCase()
            });
          }
          if (method === 'ADD') {
            this.backendService.addVehicleToLegalAccount({
              vehicles: vehiclesResult,
              signature: {
                params
              }
            }).subscribe(
              (data: any) => {
                this.loadVehicles(true);
              },
              (err: any) => {
                if (err && err.error && err.error.message === 'error.server_not_respond') {
                  this.toastr.warning('Данные текущего пользователя и сертификата не совпадают!', 'Ошибка!');
                } else {
                  this.toastr.warning('Не удалось добавить ТС', 'Ошибка Сервиса!');
                }
              }
            );
          } else {
            this.backendService.removeVehicleToLegalAccount({
              vehicles: vehiclesResult,
              signature: {
                params
              }
            }).subscribe(
              (data: any) => {
                this.loadVehicles(true);
              },
              (err: any) => {
                if (err && err.error && err.error.message === 'error.server_not_respond') {
                  this.toastr.warning('Данные текущего пользователя и сертификата не совпадают!', 'Ошибка!');
                } else {
                  this.toastr.warning('Не удалось удалить ТС из списка', 'Ошибка Сервиса!');
                }
              }
            );
          }

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

  openAddVehicleDialog(){
    this.vehicleAddDialogRef = this.dialog.open(LegalAccountVehicleDialogComponent as Component, {
      size: 'lg',
      backdrop: 'static'
    });
    this.vehicleAddDialogRef.componentInstance.accountNumber = this.accountNumber;

    this.vehicleAddDialogRef.result
      .then(response => {
        // console.log(response);
        this.vehicleAddDialogRef = null;
        if (response && response.result === true) {
          // console.log(response);
          this.loadVehicles(true);
        }
      })
      .catch(res => {});
  }

  openUpdateCardNumberDialog(licencePlate: any, cardNumber: any){
    this.vehicleAddDialogRef = this.dialog.open(LegalAccountVehicleCardDialogComponent as Component, {
      size: 'lg',
      backdrop: 'static'
    });
    this.vehicleAddDialogRef.componentInstance.accountNumber = this.accountNumber;
    this.vehicleAddDialogRef.componentInstance.cardNumber = cardNumber;
    this.vehicleAddDialogRef.componentInstance.licencePlate = licencePlate;

    this.vehicleAddDialogRef.result
      .then(response => {
        // console.log(response);
        this.vehicleAddDialogRef = null;
        if (response && response.result === true) {
          // console.log(response);
          this.loadVehicles(true);
        }
      })
      .catch(res => {});
  }

  openRemoveVehicleDialog(vehicleLicencePlate) {
    this.confirmDialogRef = this.confirmService.openModal('Вы действительно хотите удалить ТС <b>' + vehicleLicencePlate +
      '</b> из лицевого счета <b>' + this.accountNumber + '</b>? <br/>Ваше действие нужно подвердить подписью!!!');
    this.confirmDialogRef.result
      .then(result => {
        // console.log('result: ' + result);
        this.confirmDialogRef = null;
        if (result) {
          const vehicles = [{licencePlate: vehicleLicencePlate, isAdded: false, cardNumber: null}];
          this.startProcessSign('PKSC12', 'html', 'REMOVE', vehicles);
        }
      })
      .catch(res => {});
  }

  openSwitchLegalAccountDialog() {
    this.switchLegalAccountDialogRef = this.dialog.open(LegalAccountSwitchDialogComponent as Component, {
      size: 'xl',
      backdrop: 'static'
    });
    this.switchLegalAccountDialogRef.componentInstance.accountNumber = this.accountNumber;

    this.switchLegalAccountDialogRef.result
      .then(response => {
        // console.log(response);
        this.vehicleAddDialogRef = null;
        if (response && response.result === true) {
          // console.log(response);
          this.loadVehicles(true);
        }
      })
      .catch(res => {});
  }

  openVehicleDetails(vehicleLicencePlate) {
    if (vehicleLicencePlate) {
      // window.open(`/vehicle-detail/${this.accountNumber}/${vehicleLicencePlate}`);
      this.router.navigate([`/vehicle-detail/${this.accountNumber}/${vehicleLicencePlate}`]);
    }
  }
}
