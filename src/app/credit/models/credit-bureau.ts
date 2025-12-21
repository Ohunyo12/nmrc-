export class CreditBureauAppModel {
    
    constructor(
      public customerId: number,
      public customerName: string,
      public customerCode: number,
      public dateOfBirth: Date,
      public customerBVN: number,
      public isUploaded: boolean,
      public isCreditBureauUploadCompleted: boolean,
      public isSearched: boolean,
      public creditBureauCount: number,
      public creditBureauUnitCount: number,
      public customerTypeId: number,
      public customerTypeName:string
    ) 
    { }
}



