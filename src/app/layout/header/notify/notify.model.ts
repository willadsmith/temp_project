export interface NotifyModel {
  id: number;
  content: string;
  content_type: string;
  destination_id: number;
  isTransfer3P: number;
  transfer: AnotherBankTransfer;
  reason: string;
  status: number;
}

export interface NotifyListModel {
  [index: number]: NotifyModel;
}

export interface AnotherBankTransfer {
  amount: number;
  currency: string;
  date: string;
  name: string;
  refer: string;
}
