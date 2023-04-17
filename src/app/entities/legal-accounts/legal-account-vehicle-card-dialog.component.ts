import { Component, OnDestroy, OnInit } from '@angular/core';
import { NgbActiveModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import {Vehicle} from '@app/entities/legal-accounts/vehicle.model';
import {ToastrService} from 'ngx-toastr';
import {BackendService} from '@app/_services/backend-service';
import {LoadingService} from '@app/_services/loading.service';
declare var signXml: any;
declare var EventBus: any;
declare var endConnection: any;
declare var startConnection: any;

@Component({
  selector: 'app-legal-account-vehicle-card-dialog',
  templateUrl: './legal-account-vehicle-card-dialog.component.html'
})
export class LegalAccountVehicleCardDialogComponent implements OnInit {
  accountNumber: string;
  licencePlate: string;
  cardNumber = '';
  isSaving: boolean;
  public signTag;
  public signStatus = false;
  public signLoading = false;
  public anyAdded = false;
  invalidLicencePlate = '-';

  constructor(
    public dialogRef: NgbActiveModal,
    private toastr: ToastrService,
    private loadingService: LoadingService,
    private backendService: BackendService) {}

  ngOnInit() {
    this.isSaving = false;
  }

  clear() {
    this.dialogRef.dismiss('cancel');
  }

  withOutSpaces(event): boolean {
    const regex = new RegExp('^[a-zA-Z0-9-]+$');
    const str = String.fromCharCode(!event.charCode ? event.which : event.charCode);
    if (regex.test(str)) {
      return true;
    }
    return false;
  }

  save() {
    this.saveCardNumber(null);
    // this.startProcessSign('PKSC12', 'html');
  }

  startProcessSign(storage: string, sign: string) {
    this.signTag = sign;
    this.signLoading = true;
    startConnection();
    this.loadingService.showLoading();
    EventBus.subscribe('connect', res => {
      if (res === 1) {
        this.signatureConfirm();
      } else {
        this.toastr.warning('Не запущен или не установлен NCALayer', 'Ошибка NCALayer!');
        this.signLoading = false;
        this.loadingService.hideLoading();
        EventBus.unsubscribe('connect');
        EventBus.unsubscribe('token');
      }
    });
  }

  signatureConfirm() {
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
        this.signLoading = false;
      }

      if (res['code'] === '200') {
        if (res['responseObject'] !== undefined) {
          const xml = res['responseObject'];

          const params = {
            xml: xml
          };

          this.signStatus = true;
          // console.log('vehicles: ' + vehicles);
          this.saveCardNumber(params);

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

  saveCardNumber(params: any) {
    const vehiclesResult = [];
    vehiclesResult.push({
      accountNumber: this.accountNumber,
      licencePlate: this.licencePlate.toUpperCase(),
      cardNumber: this.cardNumber
    });
    this.backendService.addCardNumberVehicle({
      vehicles: vehiclesResult,
      signature: {
        params
      }
    }).subscribe(
      (response: any) => {
        console.log(response);
        this.signLoading = false;
        this.dialogRef.close({result: true});
      },
      (err: any) => {
        // console.log(err);
        if (err && err.error && err.error.message === 'error.server_not_respond') {
          this.toastr.warning('Данные текущего пользователя и сертификата не совпадают!', 'Ошибка!');
        } else {
          this.toastr.warning('Не удалось добавить номер карты', 'Ошибка Сервиса!');
        }
        this.signLoading = false;
      }
    );
  }

}
