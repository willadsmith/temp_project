export class BillItemValue {
  uuid: string;
  amount: number;
  passageUuid: string;
  passageDate: any;
  roadSectorName: string;
  roadSectorNameKz: string;
}

export class BillValue {
  accountNumber: string;
  isDiff: boolean;
  balance: number;
  deficit: number;
  licencePlate: string;
  items: BillItemValue[];
  paymentType: any;
  total: number;
  vehicleClassCode: string;
  vehicleGroupCode: string;
}
