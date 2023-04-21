import { Component, OnInit } from '@angular/core';

import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-confirm-dialog',
  templateUrl: './confirm-dialog.component.html'
})
export class ConfirmDialogComponent implements OnInit {
  confirmText: string;
  loading = false;

  constructor(public dialogRef: NgbActiveModal) {}

  ngOnInit() {
    console.log('`confirm Dialog` component');
  }

  confirm() {
    this.dialogRef.close(true);
  }
}
