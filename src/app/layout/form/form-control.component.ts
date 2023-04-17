import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-form-control',
  template: `
    <div class="form-group row" style="margin-bottom: 13px;">
      <label class="col-4 col-form-label text-right font-weight-bold {{ labelClass }}" style="padding-top: 5px; padding-bottom: 5px;">
        <ng-content select="form-label"></ng-content>
      </label>
      <div class="col-6 {{ valueClass }}">
        <ng-content select="form-value"></ng-content>
      </div>
      <div class="col-2">
        <ng-content select="form-extra"></ng-content>
      </div>
    </div>
  `
})
export class FormControlComponent {
  @Input() labelClass = '';
  @Input() valueClass = '';

  constructor() {}
}
