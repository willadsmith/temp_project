export class VehicleClass {
  id?: number;
  code: string;
  description: string;
  descriptionKz: string;
}

export class VehicleGroup {
  code: string;
  description: string;
  descriptionKz: string;
  invisible?: boolean;
}

export class VehicleOwner {
  xin: string;
  cityName: string;
  regionName: string;
  street: string;
  house: string;
  apartment: string;
  kato: string;
  companyName?: string;
  companyCode?: string;
  firstName?: string;
  lastName?: string;
  middleName?: string;
  notes: string;
}

export class VehicleItem {
  id?: number;
  licencePlate: string;
  colorName: string;
  model: string;
  rfid: string;
  vehicleYear: number;
  srtsSerialNumber: string;
  vehicleClass: VehicleClass;
  vehicleGroup: VehicleGroup;
  vehicleGroupExpirationDate: any;
  vehicleGroupExpirationDateNew: any;
  owner: VehicleOwner;
  balance?: number;

  getShortName(): string {
    if (this.owner && this.owner.lastName && this.owner.firstName) {
      let shortName = this.owner.lastName + ' ' + this.owner.firstName.substr(0, 1) + '.';
      if (this.owner.middleName) {
        shortName += '' + this.owner.middleName.substr(0, 1) + '.';
      }
      return shortName;
    }
    return '';
  }
}
