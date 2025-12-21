export class Collateral {
  constructor(
        public  collateralTypeId: number,
        public  collateralCategoryId: number,
        public  hairCut: number,
        public  collateralTypeName: string,
        public  details: string,
        public  requiresLocation: boolean,
        public  collateralCategoryName: string
  ) {  }
}



// public collateralCategoryName: string,
//     public collateralCategoryId: number,
//     public collateralTypeId: number,
//     public details: string,
//     public hairCut: number,
//     public collateralTypeName: string,
//     public dateTimeCreated: Date,
//    // public companyId: 