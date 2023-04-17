export enum PaymentType {
  ACCOUNT = 'ACCOUNT',
  CARD = 'CARD',
  CASH = 'CASH',
  POS = 'POS'
}

export class PaymentItem {
  constructor(
    public uuid: string,
    public amount: number,
    public passageUuid: string,
    public passageDate: Date,
    public roadSectorName: string
  ) {}
}

export class Payment {
  constructor(
    public uuid: string,
    public accountNumber: string,
    public selected: boolean,
    public createdDate: Date,
    public cash: number,
    public change: number,
    public licencePlate: string,
    public items: PaymentItem[],
    public paymentType: any,
    public reversed: boolean,
    public sourceGroup: string,
    public sourceCode: string,
    public sourceName: string,
    public sourceNumber: string,
    public sourceType: string,
    public sourceUser: string,
    public descriptionRu: string,
    public descriptionKz: string,
    public sourceId: string,
    public tax: number,
    public total: number,
    public vehicleClass: string,
    public showDetails: boolean
  ) {}
}
