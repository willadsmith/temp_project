import {Component, OnDestroy, OnInit} from '@angular/core';
import {NotifyService} from './notify.service';
import {NotifyListModel, NotifyModel} from './notify.model';
import {Router} from '@angular/router';
// import {CommunicateService} from '../../../core/services/communicate.service';
import {Subscription} from 'rxjs';
// import {PaymentService} from '../../../pages/payments/services/payment.service';
// import {TransferService} from '../../../pages/transfers/services/transfer.service';
import {ToasterService} from 'angular2-toaster';

@Component({
  selector: 'app-notify',
  templateUrl: './notify.component.html',
  styleUrls: ['./notify.component.scss']
})

export class NotifyComponent implements OnInit, OnDestroy {
  public notifyCount: number;
  public notifyList: NotifyListModel = [];

  private subscription: Subscription;

  constructor(private router: Router,
              private notifyService: NotifyService,
              // private paymentService: PaymentService,
              // private transferService: TransferService,
              private toasterService: ToasterService,
              // private communicateService: CommunicateService
              ) {
  }

  ngOnInit() {
    // this.notifyService.getNotifyList().subscribe(notifyList => {
    //   this.notifyList = notifyList;
    //   this.notifyCount = (<any>this.notifyList).length;
    // });

    // this.subscription = this.communicateService.on('notify-mark-as-read').subscribe((msgId) => {
    //   this.notifyList = (<[NotifyModel]>this.notifyList).filter(value => value.id !== Number(msgId));
    //   this.notifyCount = (<[NotifyModel]>this.notifyList).length;
    // });
  }

  ngOnDestroy(): void {
    // this.subscription.unsubscribe();
  }

  public onClickNotice(notify: NotifyModel): void {
    if (notify.isTransfer3P === 1) {
      this.router.navigate(['transfers/incoming-transfer'], {queryParams: {id: notify.id}});
      // this.communicateService.publish('incoming-transfer-id', notify.id);
    } else {
      // this.paymentService.getInvoice(notify.destination_id).subscribe(invoice => {
      //   const parameters: any = {
      //     auto: true
      //   };
      //   if (invoice.check_details === 25) {
      //     parameters.type = invoice.check_details;
      //   }
      //   invoice.parameters.forEach(parameter => {
      //     parameters[parameter.code] = parameter.value;
      //   });
      //   this.router.navigate(['payments/categories/' + invoice.code], {queryParams: parameters});
      //   this.notifyService.markAsRead(notify.id);
      // });
    }
  }

  public onClickNoticeReject(notify: NotifyModel): void {
    // this.transferService.rejectStatementInterbank(notify.transfer.refer).subscribe(response => {
    //   if (response.success) {
    //     this.toasterService.pop('success', response.reason);
    //     this.router.navigate(['transfers/history']);
    //   } else {
    //     this.toasterService.pop('error', response.reason);
    //   }
    // });
  }

}
