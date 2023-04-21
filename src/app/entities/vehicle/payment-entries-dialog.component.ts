import { Component, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Payment, PaymentItem } from './payment.model';
import { BackendService } from '@app/_services/backend-service';

@Component({
  selector: 'app-payment-entries-dialog',
  templateUrl: './payment-entries-dialog.html'
})
export class PaymentEntriesDialogComponent implements OnInit {
  payment: Payment;
  items: PaymentItem[];
  licencePlate: any;

  loading: boolean;

  constructor(public dialogRef: NgbActiveModal, private backendService: BackendService) {}

  ngOnInit() {
    if (this.payment) {
      this.loadPaymentItems(this.payment.uuid);
    } else {
      console.error('Payment not found');
    }
  }

  loadPaymentItems(uuid: string) {
    this.loading = true;
    this.backendService.getPaymentDetails(uuid).subscribe(
      data => {
        this.loading = false;
        console.log(data);
        if (data && data.success && data.answer && data.answer.items) {
          this.items = data.answer.items;
        }
      },
      error => {
        this.loading = false;
        console.error(error);
      }
    );
  }
}
