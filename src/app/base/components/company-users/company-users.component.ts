import { Component, OnInit } from '@angular/core';
import {NgbModal, NgbModalRef} from '@ng-bootstrap/ng-bootstrap';
import {DashboardService} from '@app/_services';
import {ToastrService} from 'ngx-toastr';
import {LoadingService} from '@app/_services/loading.service';
import {BackendService} from '@app/_services/backend-service';
import * as lodash from 'lodash';
import {UsersSwitchCompanyDialogComponent} from '../dialogs/users-switch-company-dialog.component';
import {CompanyUserUpdateDialogComponent} from "@app/base/components/dialogs/company-user-update-dialog.component";

@Component({
  selector: 'app-company-users',
  templateUrl: './company-users.component.html',
  styleUrls: ['./company-users.component.scss']
})
export class BaseCompanyUsersComponent implements OnInit {

  contractDetailDialogRef: NgbModalRef;

  public clicked = true;
  public users;
  public signTag;
  public signStatus = false;
  bin = '';
  iin = '';
  loadingUsers = false;

  usersTotalItems: any;
  usersPage: any;
  itemsPerPage: any;

  constructor(
    private dashboardService: DashboardService,
    public dialog: NgbModal,
    private toastr: ToastrService,
    private loadingService: LoadingService,
    private backendService: BackendService
  ) {}

  ngOnInit() {
    this.usersPage = 1;
    this.itemsPerPage = 10;
    this.loadUsers(true);
  }

  companiesPageChanged(event){
    console.log(event);
    console.log('Page changed to: ' + event);
    this.usersPage = event;
    this.loadUsers(false);
  }

  clearQueries() {
    this.bin = null;
    this.iin = null;
    this.loadUsers(true);
  }

  loadUsers(isReset){
    if (isReset) {
      this.usersPage = 1;
    }
    this.loadingUsers = true;
    this.dashboardService.users('/companyUsers/all?page=' + this.usersPage + '&size=10&sort=createdDate', this.bin, this.iin).subscribe((res: any) => {
      this.users = res.data;

      for (let i = 0; i < this.users.length; i++) {
        if (this.users[i].company) {
          this.users[i].company.name = lodash.unescape(this.users[i].company.name);
        }
      }
      this.usersTotalItems = res.meta.itemCount;
      // console.log(this.users);
      this.loadingUsers = false;
    }, err => {
      // console.log(err);
      this.loadingUsers = false;
    });
  }

  editCompany(user: any) {
    this.contractDetailDialogRef = this.dialog.open(CompanyUserUpdateDialogComponent as Component, {
      size: 'lg',
      backdrop: 'static'
    });
    const userBody = {
      firstName: user.firstName,
      lastName: user.lastName,
      middleName: user.middleName,
      position: user.position,
      operatorDoc: user.operatorDoc,
      email: user.email,
      isMain: user.isMain
    };
    this.contractDetailDialogRef.componentInstance.companyUser = userBody;
    this.contractDetailDialogRef.componentInstance.companyUserId = user.id;
    this.contractDetailDialogRef.result
      .then(response => {
        this.contractDetailDialogRef = null;
        if (response && response.result === true) {
          this.loadUsers(false);
        }
      })
      .catch(res => {
      });
  }

  getCountFrom() {
    return (this.usersPage - 1) * this.itemsPerPage === 0 ? 1 : (this.usersPage - 1) * this.itemsPerPage + 1;
  }

  getCountTo() {
    return this.usersPage * this.itemsPerPage < this.usersTotalItems ? this.usersPage * this.itemsPerPage : this.usersTotalItems;
  }
}
