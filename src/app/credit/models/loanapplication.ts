export class LoanAppModel {

    constructor(
        public loanTypeId: number,
        public CompanyId: number,
        public branchId: number,
        public productClassId: number,
        public customerGroupId: number,
        public customerId: number,
        public relationshipOfficerId: number,
        public relationshipManagerId: number,
        public principalAmount: number,
        public interestRate: number,
        public tenor: number,
        public loanInformation: string,
        public currencyId: number,
        public customerTypeId: number,
        public productId: number,
        public customerName: string,
        public customerAccount: string,
        public exchangeRate: number,
        public sectorId: number,
        public subSectorId: number,
        public loanApplicationNo: string,

        public    LoanApplicationCollateral:
        {
              customerCollateralId: number,
              certificateOfOwnership: number,
              cityId: number,
              city: number,
              collateralTypeId: number,
              collateralType : number,
              documentTitle: number,
              latitude: number,
              longitude: number,
              locationAddress: number,
              nearestBusStop: number,
              nearestLandmark: number,
              otherInformations: number,
              loanApplicationId: number,
              ApplicationReferanceNumbe: number
            }

    ) {

    }
}

export interface LoanCustomerDetailsModel {
         customerId: number;
         customerName: string;
         customerSectorId: number;
         customerSectorName: string;
         subSectorId: number;
         subSectorName: string;
         productClassId: number;
         loanAmount: number;
         branchName: string;
         relationshipOfficerId: number;
         relationshipManagerId: number;
         customerBvnInformation: number;
         customerCompanyDirectors: string;
         customerTypeId: number;
        }
