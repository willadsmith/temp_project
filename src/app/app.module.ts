import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { ReactiveFormsModule } from '@angular/forms';
import {HttpClientModule, HTTP_INTERCEPTORS, HttpClient} from '@angular/common/http';

import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ToastrModule } from 'ngx-toastr';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ToasterModule } from 'angular2-toaster';

// used to create fake backend
// import { fakeBackendProvider } from './_helpers';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';

import { JwtInterceptor, ErrorInterceptor } from './_helpers';
import { HomeComponent } from './home';
import { LoginComponent } from './login';
import { registerLocaleData } from '@angular/common';
import localeRu from '@angular/common/locales/ru';
import localeKz from '@angular/common/locales/kk';
import { QrVerifyComponent } from './qr-verify/qr-verify.component';
import { LayoutModule } from './layout/layout.module';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { BackendService } from './_services/backend-service';
import { LoadingService } from './_services/loading.service';
import { BaseComponentsModule } from './base/components/components.module';
import { FoundComponent } from './founder/founder.component';
import { TextMaskModule } from 'angular2-text-mask';
import { EntityModule } from './entities/entity.module';
import { NgSelectModule } from '@ng-select/ng-select';
import { CompanyDetailService } from './_services/company-detail.service';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';

registerLocaleData(localeRu);
registerLocaleData(localeKz);

export function createTranslateLoader(http: HttpClient) {
    return new TranslateHttpLoader(http, './assets/i18n/', '.json');
}

@NgModule({
    imports: [
        BrowserModule,
        LayoutModule,
        FormsModule,
        ReactiveFormsModule,
        HttpClientModule,
        AppRoutingModule,
        NgbModule,
        CommonModule,
        EntityModule,
        NgSelectModule,
        BaseComponentsModule,
        BrowserAnimationsModule,
        ToastrModule.forRoot(),
        TextMaskModule,
        ToasterModule.forRoot(),
        TranslateModule.forRoot({
            defaultLanguage: 'ru',
            loader: {
                provide: TranslateLoader,
                useFactory: (createTranslateLoader),
                deps: [HttpClient]
            }
        })
    ],
    declarations: [
        AppComponent,
        HomeComponent,
        LoginComponent,
        QrVerifyComponent,
        FoundComponent
    ],
    providers: [
        { provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true },
        { provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true },
        LoadingService,
        BackendService,
        CompanyDetailService
    ],
    bootstrap: [AppComponent]
})
export class AppModule {}
