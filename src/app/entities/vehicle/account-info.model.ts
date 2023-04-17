export class AccountInfo {
  constructor(
    public id: number,
    public accountType: string,
    public accountNumber: string,
    public balance: number,
    public createdDate: Date,
    public modifiedDate: Date
  ) {}
}
