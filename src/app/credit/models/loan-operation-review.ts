export class LoanOperationReviewModel {

    constructor(
        loanReviewOperationsId: number,
        loanId: number,
        productTypeId: number,
        operationTypeId: number,
        reviewDetails: string,
        proposedEffectiveDate: string,
        interateRate: string,
        prepayment: string,
        maturityDate: string,
        principalFrequencyTypeId: number,
        interestFrequencyTypeId: number,
        principalFirstPaymentDate: string,
        interestFirstPaymentDate: string,
        tenor: string,
        cASA_AccountId: number,
        accountNumber: string,
        overDraftTopup: string,
        fee_Charges: string,
        terminationAndReBook: string,
        completeWriteOff: string,
        cancelUndisbursedLoan: string,
        approvalStatusId: number,
        isManagementRate: boolean,
        reviewIrregularSchedule: ReviewIrregularScheduleModel[]
    ) { }
}

export class ReviewIrregularScheduleModel {

    constructor(
        irregularScheduleInputId: number,
        loanReviewOperationId: number,
        paymentDate: string,
        paymentAmount: string,
        createdBy: number,
        dateTimeCreate: string

    ) { }
}