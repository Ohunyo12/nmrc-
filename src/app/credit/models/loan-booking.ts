export class LoanModel {

    constructor(
        public customerId: number,
        public productId: number,
        public casaAccountId: number,
        public casaAccountId2: number,
        public currencyId: number,
        public branchId: number,
        public exchangeRate: number,
        public loanApplicationId: number,
        public loanApplicationDetailId: number,
        public loanStatusId: number,
        public customerGroupId: number,
        public loanTypeId: number,
        public productPriceIndexId: number,
        public subSectorId: number,
        public productTypeId: number,
        public scheduleTypeId: number,
        public interestRate: number,
        public customerAvailableAmount: number,
        public casaBalance: number = 0,
        public feeOverride: boolean,
        public loanBookingRequestId: number,
        public passCode: string,
        public username: string,
        public loanScheduleInput: {},

        public revolvingLoanInput: {},
        public contingentLoanInput: {},

        public loanCovenant: {},
        public loanChargeFee: {},
        public loanGuarantor: {},
        public loanCollateral: {},
        public monitoringTriggers: {},
        public loanPrincipal: number,
        public loanBeneficiary: {},
        public nostroRateCodeId: number,
        public effectiveDate: Date,
        public maturityDate: Date,
        public isInEditMode: boolean,
        public loanId : number,
        public comment: string,
        public legalContingentCode: string,

    ) { }

}

export class monitoringTriggersModel {
    constructor(
        public applicationDetailId: number,
        public monitoringTriggerId: number,
        public monitoringTrigger: string,
        public productCustomerName: string,
    ) { }
}

export class contingentLoanInputModel {
    constructor(
        public customerId: number,
        public productId: number,
        public casaAccountId: number,
        public branchId: number,
        public currencyId: number,
        public exchangeRate: number,
        public loanApplicationId: number,
        public effectiveDate: Date,
        public maturityDate: Date,
        public contingentAmount: number,
        public approvedAmount: number,
        public loanStatusId: number,
        public customerGroupId: number,
        public loanTypeId: number,
        public legalContingentCode: string
    ) { }
}

export class revolvingLoanInputModel {
    constructor(
        public customerId: number,
        public productId: number,
        public casaAccountId: number,
        public branchId: number,
        public currencyId: number,
        public exchangeRate: number,
        public loanApplicationId: number,
        public interestRate: number,
        public effectiveDate: Date,
        public maturityDate: Date,
        public overdraftLimit: number,
        public approvedAmount: number,
        public loanStatusId: number,
        public customerGroupId: number,
        public loanTypeId: number,
        public customerSensitivityLevelId: string,
        public accrualBasis: number,
        public revolvingTypeId: number,
        //public  scheduleDayCountConventionId: number,
    ) { }
}

export class FXLoanBeneficiaryModel {
    constructor(
        public beneficiaryCurrencyId: number,
        public beneficiaryCurrencyCode: number,
        public beneficiaryAmount: number,
        public beneficiaryReason: string,
        public beneficiaryRateCode: string,
        public beneficiaryRateCodeId: number,
        public beneficiaryRateAmount: number,
        public beneficiaryExchangeValue: number
    ) { }

}

export class DrawdownFacilitiesInformation {
    loanApplicationDetailId: number;
    operationId: number;
    productClassId: number;
    productId: number;
    requestAmount: number;
    AvailableAmount: number;
    tenor: number;
    interestRate: number;
}

export class DrawdownSubmitionModel {
    amount_Requested: number;
    loanApplicationDetailId: number;
    loanApplicationId: number;
    casaAccountId: number;
    casaAccountId2: number;
    productId: number;
    chargeFeeOnce : boolean;
    //tenor: number;
}
