import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { first } from 'rxjs/operators';
import { ToastrService } from 'ngx-toastr';

declare var signXml: any;
declare var EventBus: any;
declare var endConnection: any;
declare var startConnection: any;
declare var getActiveTokens: any;
declare var selectSignType: any;
declare var chooseNCAStorage: any;
declare var changeLocaleCall: any;
declare let $: any;

import { AuthenticationService } from '@app/_services';
import { LoadingService } from '@app/_services/loading.service';
import {TranslatePipe, TranslateService} from '@ngx-translate/core';

@Component({
    templateUrl: 'login.component.html',
    styleUrls: ['./login.component.scss'],
    providers: [TranslatePipe]
})
export class LoginComponent implements OnInit {
    loginForm: FormGroup;
    loading = false;
    submitted = false;
    regItem = false;
    returnUrl: string;
    version: string;
    xml: string;
    method: string;
    auth_xml: string;
    reg_xml: string;
    error = '';
    roleUser: string;
    userObject: {};
    firstName: string;
    lastName: string;
    idn: string;
    bin: string;
    email: string;
    middleName: string;
    company: string;
    companyType: string;
    companyTypes = [];
    companyName: string;
    companyNameType = 'FIO';
    currentLang = '';
    public xinMask = [/\d/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/];

    constructor(
        private formBuilder: FormBuilder,
        private route: ActivatedRoute,
        private translate: TranslateService,
        private router: Router,
        private authenticationService: AuthenticationService,
        private loadingService: LoadingService,
        private toastr: ToastrService,
        private translatePipe: TranslatePipe
    ) {
        this.userObject = this.authenticationService.currentUserValue;
        // redirect to home if already logged in
        if (this.authenticationService.currentUserValue) {
            this.router.navigate(['/']);
        }
        this.changeCompanyTypeLang(this.translate.currentLang);
    }

    ngOnInit() {
        this.currentLang = localStorage.getItem('lang') ? localStorage.getItem('lang') : 'ru';
        this.loginForm = this.formBuilder.group({
            username: ['', Validators.required],
            password: ['', Validators.required]
        });

        this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/';
    }

    setLang(lang: string) {
        localStorage.setItem('lang', lang);
        this.translate.use(lang);

        this.changeCompanyTypeLang(lang);
    }

    changeReg() {
        this.regItem = !this.regItem;
        this.idn = '';
        this.bin = '';
        this.email = '';
        this.companyName = '';
        this.companyNameType = 'FIO';
    }

    changeOwnerType(event: any) {
        console.log(event);
        if (event === 'ИП' || event === 'ЖК') {
            this.bin = '';
            this.companyName = '';
            this.companyNameType = 'FIO';
        }
    }

    changeCompanyTypeLang(lang: string) {
        this.companyTypes = [];
        switch (lang) {
            case 'ru':
                return this.companyTypes.push(
                    {description: 'Индивидуальный предприниматель', code: 'ИП'},
                    {description: 'Товарищество с ограниченной ответственностью', code: 'ТОО'},
                    {description: 'Акционерное общество', code: 'АО'},
                    {description: 'Коммунальные государственные учреждения', code: 'КГУ'},
                    {description: 'Государственное учреждение', code: 'ГУ'},
                    {description: 'Государственное коммунальное предприятие на праве хозяйственного ведения', code: 'ГКП на ПХВ'},
                    {description: 'Некоммерческого акционерного общества', code: 'НАО'},
                    {description: 'Республиканское государственное предприятие', code: 'РГП'},
                    {description: 'Республиканского государственного предприятия на праве хозяйственного ведения', code: 'РГП на ПХВ'},
                    {description: 'Республиканское государственное казённое предприятие', code: 'РГКП'});
            case 'kz':
                return this.companyTypes.push(
                    {description: 'Жеке кәсіпкер', code: 'ЖК'},
                    {description: 'Жауапкершілігі шектеулі серіктестік', code: 'ЖШС'},
                    {description: 'Акционерлік қоғам', code: 'АҚ'},
                    {description: 'Коммуналдық мемлекеттік мекемелер', code: 'ҚМУ'},
                    {description: 'Мемлекеттік мекеме', code: 'ММ'},
                    {description: 'Шаруашылық жүргізу құқығындағы мемлекеттік коммуналдық кәсіпорын', code: 'ШЖҚ МКК'},
                    {description: 'Коммерциялық емес акционерлік қоғам', code: 'КЕАҚ'},
                    {description: 'Республикалық мемлекеттік кәсіпорын', code: 'РМК'},
                    {description: 'Шаруашылық жүргізу құқығындағы республикалық мемлекеттік кәсіпорын', code: 'ШЖҚ РМК'},
                    {description: 'Республикалық мемлекеттік қазыналық кәсіпорын', code: 'РМҚК'});
            case 'en':
                return this.companyTypes.push(
                    {description: 'Индивидуальный предприниматель', code: 'ИП'},
                    {description: 'Товарищество с ограниченной ответственностью', code: 'ТОО'},
                    {description: 'Акционерное общество', code: 'АО'},
                    {description: 'Коммунальные государственные учреждения', code: 'КГУ'},
                    {description: 'Государственное учреждение', code: 'ГУ'},
                    {description: 'Государственное коммунальное предприятие на праве хозяйственного ведения', code: 'ГКП на ПХВ'},
                    {description: 'Некоммерческого акционерного общества', code: 'НАО'},
                    {description: 'Республиканское государственное предприятие', code: 'РГП'},
                    {description: 'Республиканского государственного предприятия на праве хозяйственного ведения', code: 'РГП на ПХВ'},
                    {description: 'Республиканское государственное казённое предприятие', code: 'РГКП'});
            default:
                break;
        }
    }

    changeCompanyNameType(event: any) {
        this.companyName = '';
    }

    selectNCAStore() {
        startConnection();
        this.loadingService.showLoading();
        EventBus.subscribe('connect', res => {
            if (res === 1) {
                changeLocaleCall(this.translate.currentLang === 'kz' ? 'kz': this.translate.currentLang);
                this.loading = true;

                selectSignType('LOGIN');
                this.authSubmit();
            } else {
                this.toastr.error(this.translatePipe.transform('login_main_connection_error_nca_layer'), this.translatePipe.transform('login_main_error_nca_layer'));
                this.loadingService.hideLoading();
                EventBus.unsubscribe('connect');
                this.loading = false;
                // EventBus.unsubscribe('token');
            }
        });
    }

    selectNCAStoreReg() {
        startConnection();
        this.loadingService.showLoading();
        EventBus.subscribe('connect', res => {
            if (res === 1) {
                this.loading = true;

                selectSignType('LOGIN');
                this.regSubmit();
            } else {
                this.toastr.warning(this.translatePipe.transform('login_main_connection_error_nca_layer'), this.translatePipe.transform('login_main_error_nca_layer'));
                this.loadingService.hideLoading();
                EventBus.unsubscribe('connect');
                this.loading = false;
                // EventBus.unsubscribe('token');
            }
        });
    }

    authSubmit() {
        EventBus.subscribe('signConnectResult', res => {

            if (res['code'] === '500') {
                if (res.message ===  'action.canceled') {
                    this.toastr.warning(this.translatePipe.transform('login_main_sign_process_cancel_user'), this.translatePipe.transform('login_main_error_nca_layer'));
                }
                this.loading = false;
                this.loadingService.hideLoading();
                selectSignType('');
                EventBus.unsubscribe('signed');
                EventBus.unsubscribe('connect');
                EventBus.unsubscribe('token');
                EventBus.unsubscribe('signConnectResult');
                endConnection();
            }

            if (res['code'] === '200') {
                EventBus.subscribe('auth_token', response => {
                    // console.log('auth_token', response);
                    this.auth_xml = response;

                    this.onSubmit();
                });
                this.loadingService.hideLoading();

                EventBus.unsubscribe('signConnectResult');
                EventBus.unsubscribe('connect');
            }
        });
    }

    regSubmit() {
        // this.signatureReg()

        EventBus.subscribe('signConnectResult', res => {
            if (res['code'] === '500') {
                if (res.message ===  'action.canceled') {
                    this.toastr.warning(this.translatePipe.transform('login_main_sign_process_cancel_user'), this.translatePipe.transform('login_main_error_nca_layer'));
                }
                this.loading = false;
                this.loadingService.hideLoading();
                selectSignType('');
                EventBus.unsubscribe('signed');
                EventBus.unsubscribe('connect');
                EventBus.unsubscribe('token');
                EventBus.unsubscribe('signConnectResult');
                endConnection();
            }

            if (res['code'] === '200') {
                EventBus.subscribe('auth_token', response => {
                    // console.log('auth_token', response);
                    this.reg_xml = response;

                    this.signatureReg();
                });
                this.loadingService.hideLoading();
                EventBus.unsubscribe('signConnectResult');
                EventBus.unsubscribe('connect');
            }
        });
    }

    withOutSpaces(event): boolean {
        const charCode = event.which ? event.which : event.keyCode;
        if (charCode === 32) {
            return false;
        }
        return true;
    }

    onSubmit() {
        this.authenticationService.logout();

        const params = {
            xml: this.auth_xml
        };

        this.submitted = true;
        this.version = '1.0';
        this.method = 'XML.verify';

        this.loading = true;
        this.authenticationService.login(params)
            .pipe(first())
            .subscribe(
                data => {
                    this.loading = false;
                    this.returnUrl = '/cabinet';
                    this.router.navigate([this.returnUrl]);
                    EventBus.unsubscribe('connect');
                    EventBus.unsubscribe('auth_token');
                    endConnection();
                },
                error => {
                    this.error = '';
                    if (error && error.error && error.error.message) {
                        this.error = error.error.message;
                    }
                    this.loading = false;
                    this.toastr.error(this.error, this.translatePipe.transform('dashboard_error'));
                    EventBus.unsubscribe('connect');
                    EventBus.unsubscribe('auth_token');
                    endConnection();
                });
    }

    signatureReg() {
        this.authenticationService.logout();

        const signedXml = {
            params: {
                xml: this.reg_xml
            }
        };

        this.submitted = true;
        this.version = '1.0';
        this.method = 'XML.verify';

        this.loading = true;
        if (this.companyType === 'ИП') {
            this.bin = this.idn;
            if (this.companyNameType !== 'OWN_NAME') {
                this.companyName = null;
            }
        }
        this.authenticationService.register(this.companyType, this.idn, this.bin, this.email, this.companyName, signedXml )
            .pipe(first())
            .subscribe(
                data => {
                    this.loading = false;
                    this.toastr.success('Пользователь зарегистрирован', 'Готово');
                    this.changeReg();
                    this.returnUrl = '/cabinet';
                    this.router.navigate([this.returnUrl]);
                    EventBus.unsubscribe('connect');
                    EventBus.unsubscribe('auth_token');
                    endConnection();
                },
                error => {
                    // console.log(error);
                    if (error && error.error && error.error.message) {
                        const messageError = error.error.message;
                        if (messageError === 'error.server_not_respond') {
                            this.toastr.error('Введенные Вами данные и данные сертификата не совпадают!', 'Ошибка!');
                        } else if (messageError === 'Email is already exists') {
                            this.toastr.error('Введенный Вами email уже существует!', 'Ошибка!');
                        } else {
                            this.toastr.error(error.error.message, 'Ошибка');
                        }
                    } else {
                        this.toastr.error(error.error, 'Ошибка');
                    }
                    this.error = error;
                    this.loading = false;
                    EventBus.unsubscribe('connect');
                    EventBus.unsubscribe('auth_token');
                    endConnection();
                });

        EventBus.unsubscribe('signed');
        EventBus.unsubscribe('connect');
        EventBus.unsubscribe('token');

        endConnection();
    }

    signXmlCall() {
        const xmlToSign = '<xml>' + this.reg_xml + '</xml>';
        const selectedStorage = 'PKCS12';

        signXml(selectedStorage, 'SIGNATURE', xmlToSign, 'signXmlBack');
    }
}
