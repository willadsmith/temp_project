import { Component, OnDestroy, OnInit } from '@angular/core';
import { NgbActiveModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import {Vehicle} from '@app/entities/legal-accounts/vehicle.model';
import {ToastrService} from 'ngx-toastr';
import {BackendService} from '@app/_services/backend-service';
import {LoadingService} from '@app/_services/loading.service';
import {TranslatePipe} from '@ngx-translate/core';
declare var signXml: any;
declare var EventBus: any;
declare var endConnection: any;
declare var startConnection: any;

@Component({
  selector: 'app-legal-account-vehicle-dialog',
  templateUrl: './legal-account-vehicle-dialog.component.html',
  providers: [TranslatePipe]
})
export class LegalAccountVehicleDialogComponent implements OnInit {
  accountNumber: string;
  isSaving: boolean;
  vehicles: Vehicle[];
  public signTag;
  public signStatus = false;
  public signLoading = false;
  public anyAdded = false;
  invalidLicencePlate = '-';

  constructor(
    public dialogRef: NgbActiveModal,
    private toastr: ToastrService,
    private loadingService: LoadingService,
    private translatePipe: TranslatePipe,
    private backendService: BackendService) {}

  ngOnInit() {
    this.isSaving = false;
    this.vehicles = [];
    this.vehicles.push({licencePlate: '', isAdded: false, cardNumber: null});
  }

  clear() {
    this.dialogRef.dismiss('cancel');
  }

  withOutSpaces(event): boolean {
    const regex = new RegExp('^[a-zA-Z0-9]+$');
    const str = String.fromCharCode(!event.charCode ? event.which : event.charCode);
    if (regex.test(str)) {
      return true;
    }
    return false;
  }

  save() {
    this.startProcessSign('PKSC12', 'html');
  }

  public addNewVehicle(){
    this.vehicles.push({licencePlate: '', isAdded: false, cardNumber: null});
  }

  public removeVehicle(index) {
    this.vehicles.splice(index, 1);
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
        this.toastr.warning(this.translatePipe.transform('legal_account_vehicle_dialog_error_connection_nca_layer'), this.translatePipe.transform('login_main_error_nca_layer') + '!');
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
          this.toastr.warning(this.translatePipe.transform('legal_account_vehicle_dialog_cancel_sign_process') + '!', this.translatePipe.transform('login_main_error_nca_layer') + '!');
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
          const vehiclesResult = [];
          for (let i = 0; i < this.vehicles.length; i++) {
            if (!this.vehicles[i].isAdded) {
              vehiclesResult.push({
                accountNumber: this.accountNumber,
                licencePlate: this.vehicles[i].licencePlate.toUpperCase()
              });
            }
          }
          this.backendService.addVehicleToLegalAccount({
            vehicles: vehiclesResult,
            signature: {
              params
            }
          }).subscribe(
            (response: any) => {
              console.log(response);
              if (response && response.body && response.body.data) {
                const dataResult = response.body.data;
                let notFoundVehicle = false;
                const notFoundVehiclesList = [];
                for (let i = 0; i < dataResult.length; i++) {
                  if (dataResult[i] === '') {
                    notFoundVehicle = true;
                    notFoundVehiclesList.push(this.vehicles[i].licencePlate.toUpperCase());
                  }
                }
                if (notFoundVehicle) {
                  let licencePlate = '';
                  let isMulti = false;
                  if (notFoundVehiclesList.length > 0) {
                    licencePlate = notFoundVehiclesList.join();
                    if (notFoundVehiclesList.length > 1) {
                      isMulti = true;
                    }
                  }
                  this.toastr.warning((isMulti ?
                    this.translatePipe.transform('legal_account_vehicle_dialog_grnz_not_found_many')
                    + licencePlate + this.translatePipe.transform('legal_account_vehicle_dialog_grnz_not_found_many2')
                    : this.translatePipe.transform('legal_account_vehicle_dialog_grnz_not_found_once')
                    + licencePlate + this.translatePipe.transform('legal_account_vehicle_dialog_grnz_not_found_once2')
                    ), 'Ошибка!',
                    {timeOut: 10000});
                }
              }
              this.signLoading = false;
              this.dialogRef.close({result: true});
            },
            (err: any) => {
              // console.log(err);
              if (err && err.error && err.error.message === 'error.server_not_respond') {
                this.toastr.warning(this.translatePipe.transform('legal_account_vehicle_dialog_error_data_user_sign'), this.translatePipe.transform('legal_account_vehicle_dialog_error_data_user_sign') + '!');
              } else {
                if (err.error && err.error.error
                  && err.error.error.code === 6) {
                  const errorBody = err.error.error;
                  if (errorBody.description.includes('already has personal account')) {
                    const startIndex = errorBody.description.indexOf('[');
                    const endIndex = errorBody.description.indexOf(']');
                    this.invalidLicencePlate = errorBody.description.substr(
                      startIndex + 1, endIndex - startIndex - 1);
                    for (let i = 0; i < this.vehicles.length; i++) {
                      if (this.vehicles[i].licencePlate.toUpperCase() !== this.invalidLicencePlate) {
                        this.vehicles[i].isAdded = true;
                        this.anyAdded = true;
                      } else {
                        break;
                      }
                    }
                    this.toastr.warning(this.translatePipe.transform('legal_account_vehicle_dialog_grnz_busy') + this.invalidLicencePlate +
                      this.translatePipe.transform('legal_account_vehicle_dialog_grnz_busy2'),
                      this.translatePipe.transform('legal_account_vehicle_dialog_error_data_user_sign') + '!',
                      {timeOut: 12000});
                  } else {
                    this.toastr.warning(this.translatePipe.transform('legal_account_vehicle_dialog_error_add_ts'),
                      this.translatePipe.transform('legal_account_vehicle_dialog_error_service'));
                  }
                } else {
                  this.toastr.warning(this.translatePipe.transform('legal_account_vehicle_dialog_error_add_ts'),
                    this.translatePipe.transform('legal_account_vehicle_dialog_error_service'));
                }
              }
              this.signLoading = false;
            }
          );

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

}
