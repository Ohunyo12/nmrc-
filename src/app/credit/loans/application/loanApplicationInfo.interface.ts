export interface IApplicationInfo {
    customerGroupId: number, loanTypeId: number, customerId: number,
    loanApplicationDetailId: number, customerName: string, ApplicationRef: number, loanApplicationId: number, iblRequest: boolean
}

export interface ILoanApplication {
    loanApplicationId: number,
    applicationReferenceNumber: number,
    customerTypeId: number,
    loanTypeId: number,
    proposedAmount: number,
    proposedTenor: number,
    tenorMode: number,
    // casaAccountId: number,
    // loanPreliminaryEvaluationId: number,
    loantermSheetId: number,
    relationshipOfficerId: number,
    relationshipManagerId: number,
    loanInformation: string,
    ownershipStructure: string,
    loansWithOthers: number,
    customerName: string,
    customerAccount: string,
    customerId: number,
    isInvestmentGrade: boolean,
    requireCollateral: boolean,
    loanApplicationDetail: ILoanApplicationDetail[],
    customerGroupId: number,
    productClassId: number,
    regionId: number,
    requireCollateralTypeId: number,
    isNewApplication: boolean,
    collateralDetail: string,
    isAdHocApplication: boolean,
    loanApprovedLimitId: number,
    isEmployerRelated: boolean,
    relatedEmployerId: number,
    termSheetCode: string,
    iblRequest: boolean
    // isRelatedParty: boolean,
    // isPoliticallyExposed: boolean
    //isFirstTime: boolean

};

export interface ILoanApplicationDetail {
    loanApplicationDetailId: number,
    customerId: number,
    customerName: string,
    proposedProductId: string,
    proposedProductName: string,
    proposedTenor: number,
    tenorModeId: number,
    proposedInterestRate: number,
    proposedAmount: number,
    currencyId: number,
    currencyName: string,
    exchangeRate: number,
    exchangeAmount: number,
    subSectorId: number,
    sectorId: number,
    productClassId: number,
    loanPurpose: string,
    repaymentTerm: string,
    repaymentScheduleId: number,

    interestRepaymentId: number,
    interestRepayment: string,
    isMoratorium: boolean,
    moratorium: string,

    isTakeOverApplication: boolean,
    isLineFacility:boolean,
    approvedLineLimit: number,
    loanDetailReviewTypeId: number,
    approvedTradeCycleId: number,
    fieldOne: string,
    fieldTwo: string,
    fieldThree: string,
    productPriceIndexId: number,
    productPriceIndexRate: string,
    productPriceIndexSpread: number,
    crmsFundingSourceId: number,
    crmsPaymentSourceId: number,
    invoiceDetails: IInvoiceDetails[],
    productFees: IProductFees[],
    traderLoan: ITraderLoan,
    educationLoan: IEducationLoan,
    bondDetails: IBondDetails,
    syndicatedLoan: ISyndicatedLoan[],
    casaAccountId: number,
    operatingCasaAccountId: number,
    flowchangeId: number,
    oldApplicationRefForRenewal: string,
    iblRequest: boolean,
    propertyTypeId: number;
    propertyTitle: string;
    propertyPrice: number;
    downPayment: number;
  
}

export interface ISyndicatedLoan {
    syndicationId: number,
    bankCode: string,
    bankName: string,
    amountContributed: string,
    typeId: number
}

export interface IBondDetails {
    casaAccountId: number,
    principalId: number,
    bondAmount: number,
    bondCurrencyId: number,
    contractStartDate: Date,
    contractEndDate: Date,
    isTenored: boolean,
    isBankFormat: boolean,
    bondfcyRate: number,
    bondfcyAmount: number
}
export interface IEducationLoan {
    schoolFeesCollected: number,
    averageSchoolFees: number,
    numberOfStudent: number,
}
export interface ITraderLoan {
    marketId: number,
    averageMonthlyTurnover: number,
    soldItems: string,
}
export interface IInvoiceDetails {
    principalId: number,
    contractNo: string,
    invoiceNo: string,
    invoiceDate: Date,
    invoiceAmount: number,
    invoiceCurrencyId: number,
    contractEndDate: Date,
    contractStartDate: Date,
    invoiceDocument: string,
    purchaseOrderNumber: string;
    certificateNumber: string;
    reValidated: boolean;
    entrySheetNumber: string;
}

export interface IProductFees {
    feeId: number,
    feeName: string,
    rate: number
}



