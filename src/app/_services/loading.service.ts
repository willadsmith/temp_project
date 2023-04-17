import { Injectable } from '@angular/core';
declare let $: any;

@Injectable()
export class LoadingService {
  private isLoading = true;
  private isPageReload = true;
  private animationType = 'wave';
  private backgroundColor = 'black';

  constructor() {}

  getLoadingStatus(): boolean {
    return this.isLoading;
  }

  showLoading(): void {
    // if(!this.isPageReload){
    //     this.backgroundColor = 'b';
    // }
    $('body').loadingModal({
      text: 'Подождите, идет загрузка...',
      animation: this.animationType,
      backgroundColor: this.backgroundColor
    });
    this.isLoading = true;
    // this.isPageReload = false;
  }

  hideLoading(): void {
    $('body').loadingModal('hide');
    setTimeout(function() {
      $('body').loadingModal('destroy');
    }, 1000);
    this.isLoading = false;
  }

}
