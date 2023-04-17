export class RoadExitEvent {
  constructor(public id: number,
              public passageUuid: string,
              public passageDate: any,
              public paymentUuid: string,
              public roadExitMode: any,
              public operatorId: string,
              public hcmCode: string,
              public hcmDescription: string,
              public vehicleLicencePlate: string,
              public vehicleClassCode: string,
              public vehicleGroupCode: string,
              public vehicleGroupExpirationDate: any,
              public baseCost: boolean,
              public accountBalance: number,
              public cashRequired: number,
              public cashAccepted: number,
              public cashChange: number,
              public debtTotal: number,
              public exitDate: any,
              public createdDate: any,
              public selected: boolean) {
  }
}
