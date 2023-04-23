import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { NgbActiveModal, NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import {BackendService} from '@app/_services/backend-service';
import {ToastrService} from 'ngx-toastr';
import {TranslatePipe} from '@ngx-translate/core';


@Component({
  selector: 'app-contract-detail-dialog',
  templateUrl: './contract-detail-dialog.component.html',
  providers: [TranslatePipe]
})
export class ContractDetailDialogComponent implements OnInit {
  public router: Router;
  // Set our default values
  contractData: any;
  documentId: any;
  hasAssets: boolean;
  assetsName: string;

  userPosition: string;
  userFio: string;
  userDoc: string;
  legalAddress: string;
  factAddress: string;
  email: string;
  iik: string;
  kbe: string;
  bik: string;
  bank: string;
  website: string;
  phone: string;
  error = false;
  loading = false;
  fileToUpload: File | null = null;

  constructor(public dialog: NgbModal,
              public dialogRef: NgbActiveModal,
              public http: HttpClient,
              private toastr: ToastrService,
              private translatePipe: TranslatePipe,
              private backendService: BackendService) {}

  ngOnInit() {
    if (this.contractData) {
      // console.log(this.contractData);
      this.userPosition = this.contractData.userPosition;
      this.userFio = this.contractData.userFio;
      this.userDoc = this.contractData.userDoc;
      this.legalAddress = this.contractData.legalAddress;
      this.factAddress = this.contractData.factAddress;
      this.email = this.contractData.email;
      this.iik = this.contractData.iik;
      this.kbe = this.contractData.kbe;
      this.bik = this.contractData.bik;
      this.bank = this.contractData.bank;
      this.website = this.contractData.website !== null && this.contractData.website !== 'null' ? this.contractData.website : '';
      this.phone = this.contractData.phone;
      // console.log('bik ' + this.bik);
      // console.log('BANK ' + this.bank);
    }
  }

  confirm() {
    // const reqBody = {
    //   userPosition: this.userPosition !== null && this.userPosition !== '' && this.userPosition !== undefined ? this.userPosition.replac('/</g, '«').replac('/>/g, '»') : null,
    //   userFio: this.userFio !== null && this.userFio !== '' && this.userFio !== undefined ? this.userFio.replac('/</g, '«').replac('/>/g, '»') : null,
    //   userDoc: this.userDoc !== null && this.userDoc !== '' && this.userDoc !== undefined ? this.userDoc.replac('/</g, '«').replac('/>/g, '»') : null,
    //   legalAddress: this.legalAddress !== null && this.legalAddress !== '' && this.legalAddress !== undefined ? this.legalAddress.replac('/</g, '«').replac('/>/g, '»') : null,
    //   factAddress: this.factAddress !== null && this.factAddress !== '' && this.factAddress !== undefined ? this.factAddress.replac('/</g, '«').replac('/>/g, '»') : null,
    //   email: this.email !== null && this.email !== '' && this.email !== undefined ? this.email.replac('/</g, '«').replac('/>/g, '»') : null,
    //   iik: this.iik !== null && this.iik !== '' && this.iik !== undefined ? this.iik.replac('/</g, '«').replac('/>/g, '»') : null,
    //   kbe: this.kbe !== null && this.kbe !== '' && this.kbe !== undefined ? this.kbe.replac('/</g, '«').replac('/>/g, '»') : null,
    //   bik: this.bik !== null && this.bik !== '' && this.bik !== undefined ? this.bik.replac('/</g, '«').replac('/>/g, '»') : null,
    //   bank: this.bank !== null && this.bank !== '' && this.bank !== undefined ? this.bank.replac('/</g, '«').replac('/>/g, '»') : null,
    //   website: this.website !== null && this.website !== '' && this.website !== undefined ? this.website.replac('/</g, '«').replac('/>/g, '»') : null,
    //   phone: this.phone !== null && this.phone !== '' && this.phone !== undefined ? this.phone.replac('/</g, '«').replac('/>/g, '»') : null,
    //   files: this.fileToUpload
    // };
    const formData = new FormData();
    // tslint:disable-next-line:max-line-length
    formData.append('userPosition', this.userPosition !== null && this.userPosition !== '' && this.userPosition !== undefined ? this.userPosition.replace(/</g, '«').replace(/>/g, '»') : null);
    formData.append('userFio', this.userFio !== null && this.userFio !== '' && this.userFio !== undefined ? this.userFio.replace(/</g, '«').replace(/>/g, '»') : null);
    formData.append('userDoc', this.userDoc !== null && this.userDoc !== '' && this.userDoc !== undefined ? this.userDoc.replace(/</g, '«').replace(/>/g, '»') : null);
    // tslint:disable-next-line:max-line-length
    formData.append('legalAddress', this.legalAddress !== null && this.legalAddress !== '' && this.legalAddress !== undefined ? this.legalAddress.replace(/</g, '«').replace(/>/g, '»') : null);
    // tslint:disable-next-line:max-line-length
    formData.append('factAddress', this.factAddress !== null && this.factAddress !== '' && this.factAddress !== undefined ? this.factAddress.replace(/</g, '«').replace(/>/g, '»') : null);
    formData.append('email', this.email !== null && this.email !== '' && this.email !== undefined ? this.email.replace(/</g, '«').replace(/>/g, '»') : null);
    formData.append('iik', this.iik !== null && this.iik !== '' && this.iik !== undefined ? this.iik.replace(/</g, '«').replace(/>/g, '»') : null);
    formData.append('kbe', this.kbe !== null && this.kbe !== '' && this.kbe !== undefined ? this.kbe.replace(/</g, '«').replace(/>/g, '»') : null);
    formData.append('bik', this.bik !== null && this.bik !== '' && this.bik !== undefined ? this.bik.replace(/</g, '«').replace(/>/g, '»') : null);
    formData.append('bank', this.bank !== null && this.bank !== '' && this.bank !== undefined ? this.bank.replace(/</g, '«').replace(/>/g, '»') : null);
    formData.append('website', this.website !== null && this.website !== '' && this.website !== undefined ? this.website.replace(/</g, '«').replace(/>/g, '»') : null);
    formData.append('phone', this.phone !== null && this.phone !== '' && this.phone !== undefined ? this.phone.replace(/</g, '«').replace(/>/g, '»') : null);
    formData.append('files', this.fileToUpload);
    formData.append('documentId', this.documentId);
    // console.log(reqBody);
    this.loading = true;
    this.backendService.updateContractDetail(formData).subscribe(
      (data: any) => {
        // console.log(data);
        if (data) {
          this.dialogRef.close({result: true});
        }
        this.loading = false;
      },
      (err: any) => {
        // console.log(err);
        this.loading = false;
        this.toastr.warning(this.translatePipe.transform('contract_detail_error_update_data'), this.translatePipe.transform('dashboard_error') + '!');
      }
    );
  }

  handleFileInput(files: FileList) {
    this.fileToUpload = files.item(0);
  }

  changeFile() {
    this.hasAssets = false;
  }


}
