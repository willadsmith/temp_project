import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-form-control-static',
  template: `
    <div class="form-group row" *ngIf="value">
      <label class="col-4 col-form-label text-right" *ngIf="label">{{ label }}</label>
      <div class="col-6">
        <p class="form-control-plaintext font-weight-bold bg-light" style="padding-left: 15px;" *ngIf="value">{{ value }}</p>
      </div>
      <div class="col-2">
        <ng-content select="form-extra"></ng-content>
      </div>
    </div>
  `
})
export class FormControlStaticComponent {
  @Input() label = '';
  @Input() value: any;

  constructor() {}
}
