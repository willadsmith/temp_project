import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { BaseDashboardComponent } from './base/components/dashboard/dashboard.component';
import { BaseUsersComponent } from './base/components/users/users.component';
import { LoginBaseComponent } from './base/login/login-base.component';
import { CabinetComponent } from './entities/cabinet/cabinet.component';
import { LegalAccountComponent } from './entities/legal-accounts/legal-account.component';
import { LegalAccountDetailComponent } from './entities/legal-accounts/legal-account-detail.component';
import {VehicleItemComponent} from './entities/vehicle/vehicle-item.component';

import { LoginComponent } from './login';
import { QrVerifyComponent } from './qr-verify/qr-verify.component';
import { AuthGuard } from './_helpers';
import { BaseGuard } from './_helpers';
import { PublicPageGuard } from './_helpers/public-page.guard';
import {BaseCompanyUsersComponent} from "@app/base/components/company-users/company-users.component";

const routes: Routes = [
    { path: 'cabinet', component: CabinetComponent, canActivate: [AuthGuard] },
    { path: 'legal-account',
      component: LegalAccountComponent,
      canActivate: [AuthGuard]
    },
    {
      path: 'legal-account/:accountNumber',
      component: LegalAccountDetailComponent,
      canActivate: [AuthGuard]
    },
    {
      path: 'vehicle-detail/:accountNumber/:licencePlate',
      component: VehicleItemComponent,
      canActivate: [AuthGuard]
    },
    { path: 'base/dashboard', component: BaseDashboardComponent, canActivate: [BaseGuard] },
    { path: 'base/users', component: BaseUsersComponent, canActivate: [BaseGuard] },
    { path: 'base/company-users', component: BaseCompanyUsersComponent, canActivate: [BaseGuard] },
    { path: 'login', component: LoginComponent, canActivate: [PublicPageGuard]},
    { path: 'qr-verify/:documentId', component: QrVerifyComponent },
    { path: '', component: LoginComponent, canActivate: [PublicPageGuard]},
    { path: 'base/login', component: LoginBaseComponent, canActivate: [PublicPageGuard]},
    // otherwise redirect to home
    { path: '**', component: LoginComponent, canActivate: [PublicPageGuard]}
];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule]
})
export class AppRoutingModule { }
