export enum DepositEntryTypeEnum {
  DEPOSIT = 'DEPOSIT',
  PAYMENT = 'PAYMENT',
  REVERSE_DEPOSIT = 'REVERSE_DEPOSIT',
  REVERSE_PAYMENT = 'REVERSE_PAYMENT',
  LEGACY_DEPOSIT = 'LEGACY_DEPOSIT',
  LEGACY_PAYMENT = 'LEGACY_PAYMENT'
}

export class Deposit {
  constructor(
    public accountNumber: string,
    public amount: number,
    public createdDate: Date,
    public entryType: DepositEntryTypeEnum,
    public sourceGroup: string,
    public sourceCode: string,
    public sourceName: string,
    public sourceNumber: string,
    public sourceUser: string,
    public sourceId: string,
    public descriptionRu: string,
    public descriptionKz: string,
    public ticketNotFound: boolean
  ) {}
}
