export class Docs {
    name: string;
    uid: string;
    body_html: string;
    created: string;
}

export class Company {
    data: [{
        name: string;
        bin: string;
        id: string;
        createdAt: string;
        documents: object;
        iban: string;
        status: string;
    }];
}

export class CompanyEntity {
  name: string;
  bin: string;
  id: string;
  createdAt: string;
  documents: object;
  iban: string;
  status: string;
}
