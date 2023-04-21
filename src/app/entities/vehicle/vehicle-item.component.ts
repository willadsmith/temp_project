import { Component, OnDestroy, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {ActivatedRoute, Router} from '@angular/router';

import {NgbModal, NgbModalRef} from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { BackendService } from '@app/_services/backend-service';
import { ConfirmService } from '@app/layout/form/confirm.service';
import { LoadingService } from '@app/_services/loading.service';
import { VehicleItem } from './vehicle.model';
import { BillValue } from './bill-value.model';
import { Deposit } from './deposit.model';
import { AccountInfo } from './account-info.model';
import { Payment } from './payment.model';
import { RoadExitEvent } from './road-exit-event.model';
import {PaymentEntriesDialogComponent} from "@app/entities/vehicle/payment-entries-dialog.component";

@Component({
  selector: 'app-vehicle-item',
  templateUrl: './vehicle-item.component.html',
  styleUrls: ['./vehicle-item.component.scss']
})
export class VehicleItemComponent implements OnInit, OnDestroy {
  legalAccount: any;

  error: any;
  success: any;

  vehiclesTotalItems: any;
  depositsTotalItems: any;

  vehiclesPage: any;
  depositsPage: any;
  logsPage: any;

  private subscription: any;
  predicate: any;
  reverse: any;
  accountNumber: any;
  licencePlate: any;

  account: Account;
  vehicle: VehicleItem;
  bill: BillValue;
  nativeBill: BillValue;
  payments: Payment[];
  exits: RoadExitEvent[];
  deposits: Deposit[];
  accountInfos: AccountInfo[];
  personalAccountInfo: AccountInfo;
  nativeAccountInfo: AccountInfo;
  payTotal: number;
  isNativeBill = false;

  forbiddenVehicle: boolean;
  loadingVehicle: boolean;
  loadingAccountInfo: boolean;
  loadingBill: boolean;
  loadingNativeBill: boolean;
  loadingPayments: boolean;
  loadingExits: boolean;
  loadingDeposits: boolean;

  failedPayments = false;
  failedBill = false;
  failedDeposits = false;

  currentPaymentsPage = 1;
  totalPaymentsItems: number;
  itemsPerPage = 20;
  currentLang: string;
  groupsRu: any;
  groupsKz: any;
  classesRu: any;
  classesKz: any;

  paymentEntriesDialogRef: NgbModalRef;

  constructor(
    private route: ActivatedRoute,
    private http: HttpClient,
    private toastr: ToastrService,
    public dialog: NgbModal,
    private router: Router,
    private modalService: NgbModal,
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
      this.licencePlate = params['licencePlate'];
      this.loadCheckItem(this.accountNumber, this.licencePlate);
    });
  }


  ngOnDestroy() {
  }

  loadCheckItem(accountNumber, licencePlate) {
    this.loadingVehicle = true;
    this.forbiddenVehicle = false;
    const $request = this.backendService.getListOfVehicleAccounts({
      accountNumber: this.accountNumber,
      page: 0,
      size: 20,
      licencePlate
    });
    $request.subscribe((data: any) => {
      // console.log(data);
      if (data && data.totalElements === 1) {
        this.loadVehicleItem(licencePlate);
        this.loadAccountInfo(licencePlate);
        this.loadBillInfo(licencePlate);
        this.loadPayments(licencePlate);
        this.loadDepositEntries(licencePlate);
      } else {
        this.loadingVehicle = false;
        this.forbiddenVehicle = true;
      }
    }, error1 => {
      this.loadingVehicle = false;
    });
  }

  loadVehicleItem(licencePlate) {
    this.loadingVehicle = true;
    const $request = this.backendService.getVehicleDetail(licencePlate);
    $request.subscribe((data: any) => {
      // console.log(data);
      this.loadingVehicle = false;
      if (data && data.success) {
        this.vehicle = data.answer;
        if (this.vehicle && this.vehicle.vehicleGroupExpirationDate) {
          const dt = new Date(this.vehicle.vehicleGroupExpirationDate);
          this.vehicle.vehicleGroupExpirationDateNew = new Date(dt.getTime() - 24 * 60 * 60 * 1000);
        }
      }
    }, error1 => {
      this.loadingVehicle = false;
    });
  }

  loadAccountInfo(licencePlate: string) {
    this.accountInfos = [];
    this.nativeAccountInfo = null;
    this.personalAccountInfo = null;
    this.loadingAccountInfo = false;
    this.backendService.getBillAccount(licencePlate).subscribe(data => {
      // console.log(data);
      if (data && data.success && data.answer) {
        this.accountInfos = data.answer;
        if (this.accountInfos && this.accountInfos.length > 0) {
          for (let i = 0; i < this.accountInfos.length; i++) {
            if (this.accountInfos[i].accountType === 'NATIVE') {
              this.nativeAccountInfo = this.accountInfos[i];
            }
            if (this.accountInfos[i].accountType === 'PERSONAL') {
              this.personalAccountInfo = this.accountInfos[i];
            }
          }
          if (this.accountInfos.length > 1) {
            this.loadNativeBillInfo(licencePlate);
          }
          this.loadingAccountInfo = true;
          this.checkDiffBalance();
        }
      }
    });
  }

  loadBillInfo(licencePlate: string) {
    this.loadingBill = true;
    this.failedBill = false;
    this.backendService.getBill(licencePlate, false).subscribe(
      data => {
        this.loadingBill = false;
        // console.log(data);
        if (data && data.success && data.answer) {
          this.bill = data.answer;
          this.payTotal = this.bill.total;
          this.checkDiffBalance();
        }
      },
      error => {
        this.loadingBill = false;
        this.failedBill = true;
        console.error(error);
      }
    );
  }

  loadNativeBillInfo(licencePlate: string) {
    this.loadingNativeBill = true;
    this.backendService.getBill(licencePlate, true).subscribe(
      data => {
        this.loadingNativeBill = false;
        // console.log(data);
        if (data && data.success && data.answer) {
          this.nativeBill = data.answer;
          this.checkDiffBalance();
        }
      },
      error => {
        this.loadingNativeBill = false;
        console.error(error);
      }
    );
  }

  checkDiffBalance() {
    if (!this.loadingBill && this.loadingAccountInfo) {
      if (this.nativeBill && this.nativeBill.total < this.bill.total) {
        this.payTotal = this.nativeBill.total;
        this.isNativeBill = true;
      } else {
        this.payTotal = this.bill.total;
        this.isNativeBill = false;
      }
    }
  }

  loadPayments(licencePlate: string) {
    this.loadingPayments = true;
    this.failedPayments = false;
    let currentPaymentsPage = this.currentPaymentsPage - 1;
    if (currentPaymentsPage < 0) {
      currentPaymentsPage = 0;
    }
    this.backendService.getPayments(licencePlate, currentPaymentsPage, this.itemsPerPage).subscribe(
      data => {
        this.loadingPayments = false;
        // console.log(data);
        if (data && data.success && data.answer && data.answer.content) {
          this.payments = data.answer.content;
          this.totalPaymentsItems = data.answer.totalElements;
        } else {
          this.payments = [];
          this.totalPaymentsItems = 0;
        }
      },
      error => {
        this.payments = [];
        this.totalPaymentsItems = 0;
        this.loadingPayments = false;
        this.failedPayments = true;
        console.error(error);
      }
    );
  }

  loadDepositEntries(licencePlate: string) {
    this.loadingDeposits = true;
    this.failedDeposits = false;
    this.backendService.getDepositEntries(licencePlate).subscribe(
      data => {
        this.loadingDeposits = false;
        // console.log(data);
        if (data && data.success && data.answer && data.answer.content) {
          this.deposits = data.answer.content;
        }
      },
      error => {
        this.loadingDeposits = false;
        this.failedDeposits = true;
        console.error(error);
      }
    );
  }

  trackIdentity(index, item: any) {
    return item.id;
  }

  pageChanged(event: any, type: string): void {
    console.log(type + ' page changed to: ' + event);
    if (type === 'payments') {
      this.currentPaymentsPage = event;
      this.loadPayments(this.licencePlate);
    }
    // else if (type === 'depts') {
    //     this.currentDebtsPage = event;
    //     this.loadDeptsHistory();
    // }  else if (type === 'deposits') {
    //     this.currentDepositsPage = event;
    //     this.loadDepositsHistory();
    // }
  }

  private onError(error, method) {
    // if (error) {
    //   this.alertService.error(error.error, error.message, null);
    // }
    if (method === 'loadVehicles') {

    } else if (method === 'loadDeposits') {
      this.loadingDeposits = false;
    }
  }

  backToLegalAccount() {
    if (this.accountNumber) {
      // window.open(`/vehicle-detail/${this.accountNumber}/${vehicleLicencePlate}`);
      this.router.navigate([`/legal-account/${this.accountNumber}`]);
    }
  }

  showPaymentDetails(payment: Payment) {
    this.paymentEntriesDialogRef = this.modalService.open(PaymentEntriesDialogComponent as Component, {
      size: 'lg'
    });
    this.paymentEntriesDialogRef.componentInstance.payment = payment;
    this.paymentEntriesDialogRef.componentInstance.licencePlate = this.licencePlate;
    this.paymentEntriesDialogRef.result.then(result => {
      if (result) {
        this.paymentEntriesDialogRef = null;
      }
    });
  }

}
