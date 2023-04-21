import { Injectable } from '@angular/core';
declare let $: any;

@Injectable()
export class LoadingService {
  private isLoading = true;
  private isPageReload = true;
  private animationType = 'wave';
  private backgroundColor = 'black';
  private currentLang = localStorage.getItem('lang');
  private textLoading = '';

  constructor() {}

  getCurrentLang() {
    if (this.currentLang === undefined || '') {
      this.textLoading = 'Подождите, идет загрузка...';
    }

    switch (this.currentLang){
      case 'ru':
        return this.textLoading = 'Подождите, идет загрузка...';
      case 'kz':
        return this.textLoading = 'Күте тұрыңыз, жүктеу жүріп жатыр...';
      case 'en':
        return this.textLoading = 'Подождите, идет загрузка...';
      default:
        break;
    }
  }

  getLoadingStatus(): boolean {
    return this.isLoading;
  }

  showLoading(): void {
    this.getCurrentLang();
    // if(!this.isPageReload){
    //     this.backgroundColor = 'b';
    // }
    $('body').loadingModal({
      text: this.textLoading,
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
