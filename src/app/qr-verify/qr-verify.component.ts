import {Component, OnInit} from '@angular/core';
import {Router, ActivatedRoute} from '@angular/router';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {first} from 'rxjs/operators';
import {ToastrService} from 'ngx-toastr';
import * as FileSaver from 'file-saver';
import {LoadingService} from '@app/_services/loading.service';
import {BackendService} from '@app/_services/backend-service';

@Component({
  templateUrl: 'qr-verify.component.html',
  styleUrls: ['./qr-verify.component.scss']
})
export class QrVerifyComponent implements OnInit {
  xml: string;
  documentId: string;
  contractNumber = '';
  signatures = [];
  notFoundDocument = false;
  loadingSignatures = false;
  private subscription: any;

  constructor(
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private backendService: BackendService,
    private loadingService: LoadingService,
    private toastr: ToastrService
  ) {
  }

  ngOnInit() {
    this.subscription = this.route.params.subscribe((params: any) => {
      this.documentId = params['documentId'];
      this.loadSignatures(this.documentId);
    });
  }

  loadSignatures(documentId: string) {
    this.loadingSignatures = true;
    const $request = this.backendService.getSignatures(documentId);
    $request.subscribe((signatures: any) => {
      if (signatures && signatures.length > 0) {
        let clientSignature = null;
        let operatorSignature = null;
        let tempSignature;
        for (let i = 0; i < signatures.length; i++) {
          tempSignature = signatures[i];
          if (!this.contractNumber && tempSignature.contract_number) {
            this.contractNumber = tempSignature.contract_number;
          }
          if (tempSignature.name === 'clientSignature') {
            if (!clientSignature) {
              clientSignature = tempSignature;
            } else if (tempSignature.created_at > clientSignature.created_at){
              clientSignature = tempSignature;
            }
          }
          if (tempSignature.name === 'operatorSignature') {
            if (!operatorSignature) {
              operatorSignature = tempSignature;
            } else if (tempSignature.created_at > operatorSignature.created_at){
              operatorSignature = tempSignature;
            }
          }
        }
        if (operatorSignature) {
          this.signatures.push(operatorSignature);
        }
        if (clientSignature) {
          this.signatures.push(clientSignature);
        }
      } else {
        this.notFoundDocument = true;
      }
      this.loadingSignatures = false;
    }, err => {
      // console.log(err);
      this.loadingSignatures = false;
    });
  }

  downloadXML(xml) {
    console.log(xml);
    this.saveToFileSystem(xml, 'signature.xml', 'text/xml;charset=utf-8');
  }

  private saveToFileSystem(response: any, name: string, type: string) {
    const blob = new Blob([response], {type: type});
    FileSaver.saveAs(blob, name);
  }
}
