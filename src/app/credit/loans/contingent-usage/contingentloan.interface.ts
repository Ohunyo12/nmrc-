export interface IContingentLoan {
    amountRequested: number;
    contingentLoanUsageId: number;
    contingentLoanId: number;
    customerId: number;
    customerName: string;
    productName: string;
    casaAccountNumber: string;
    loanReferenceNumber: string;
    loanApplicationReferenceNumber: string;
    currencyCode: string;
    currencyId: string;
    exchangeRate: number;
    effectiveDate: Date;
    maturityDate: Date;
    bookingDate: Date;
    contingentAmount: string;
    loanStatus: string;
    principalName: string;
    productId:number;
    requestedAmount: string;
    facilityAmount: string;
    percentageUsed: number;
    usedAmount: number;
    firstName: string;
    lastName: string;
    middleName: string;
    percentageRequested:string;
    loanSystemTypeId:number;
    documentTitle:string;
    documentFile:any;
    loanReviewApplicationId:any;
    loanApplicationNumber:any;
    
}