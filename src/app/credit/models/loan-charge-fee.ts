  export class ChargeFeeAppModel {
        
    
        constructor(
          public chargeFeeId: number,
          // public applicationDetailIdId: number,
          // public loanSystemTypeId: number,
          public chargeFeeName: string,
          public feeRateValue: number,
          public feeDependentAmount: number,
          public feeAmount: number,
          public feeIntervalName: number,
          public isIntegralFee: boolean,
          public isRequired: boolean,
          public isPosted: boolean = true,
          public valueBase : string,
          public dealTypeId : number,
          //public isDutiable: boolean;
          // public casaAccountName: string,
          // public casaAccount: number,
          // public description: string,
          // public isDeferred: boolean = false,
          // public effectiveDate: Date,
        ) 
        {
    
        }
    }
    
    