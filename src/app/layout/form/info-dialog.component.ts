import { Component, OnInit } from '@angular/core';

import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-info-dialog',
  templateUrl: './info-dialog.component.html'
})
export class InfoDialogComponent implements OnInit {
  infoTitle: string;
  infoText: string;
  loading = false;

  constructor(public dialogRef: NgbActiveModal) {}

  ngOnInit() {
    console.log('`info Dialog` component');
  }
}
