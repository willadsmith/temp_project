import { Injectable } from '@angular/core';
// import { BackendService } from '../../../core/services/backend.service';
import { Observable } from 'rxjs';
// import { map } from 'rxjs/operators';
// import { CommonResponse } from '../../../core/models/common-response';
import { NotifyListModel } from './notify.model';
// import { CommunicateService } from '../../../core/services/communicate.service';

@Injectable()
export class NotifyService {

  constructor(
    // private backendService: BackendService,
    // private communicateService: CommunicateService
    ) {
  }

  public getNotifyList(): Observable<NotifyListModel> {
    // return this.backendService.get<CommonResponse>({params: {action: 'GET_NOTIFY'}}).pipe(map(response => {
    //   if (response.success) {
    //     return <NotifyListModel> response.reason;
    //   }
    // }));
    return 
  }

  public markAsRead(msgId: number): void {
    // this.backendService.post({action: 'MARK_AS_READ', msg_id: msgId}).subscribe(response => {
    //   if ((<CommonResponse> response).success) {
    //     // this.communicateService.publish('notify-mark-as-read', msgId);
    //   }
    // });
  }

  // public markAsReadAsync(msgId: number): Observable<>CommonResponse {
  //   return Observable.create(observer => {
  //     // this.backendService.post({action: 'MARK_AS_READ', msg_id: msgId}).subscribe(response => {
  //     //   if ((<CommonResponse> response).success) {
  //     //     // this.communicateService.publish('notify-mark-as-read', msgId);
  //     //     observer.next((<CommonResponse> response));
  //     //     observer.complete();
  //     //   }
  //     // });
  //   });
  // }

}
