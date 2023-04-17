import { Component, Injectable } from '@angular/core';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { ConfirmDialogComponent } from './confirm-dialog.component';
import { InfoDialogComponent } from './info-dialog.component';

@Injectable()
export class InfoService {
  private isOpen = false;

  constructor(private modalService: NgbModal) {}

  openModal(infoTitle, infoText): NgbModalRef {
    if (this.isOpen) {
      return;
    }
    this.isOpen = true;
    const modalRef = this.modalService.open(InfoDialogComponent as Component, {
      size: 'lg'
    });
    modalRef.componentInstance.infoTitle = infoTitle;
    modalRef.componentInstance.infoText = infoText;
    modalRef.result.then(
      result => {
        this.isOpen = false;
      },
      reason => {
        this.isOpen = false;
      }
    );
    return modalRef;
  }
}
