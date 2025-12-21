export class LoanSchedule {
    principalFrequency: any;

    constructor(
        public principalAmount: number,
        public interestRate: number,
        public loanDate: Date,
        public scheduleMethod: number,
        public interestFrequency: string,
        public principalfrequency: string,
        public tenor: number,
        public principalFirstDate: Date,
        public intrestFirstDate: Date,
        public maturityDate: Date,
        public firstPaymentDate: Date,
        public numberOfPayments: number,
        public accrualBasis: number,
        public integralFeeAmount: number,
        public interestChargeType: number,
        public effectiveDate: Date,
        public irregularPaymentSchedule: any,
        public effectiveInterestRate: number,
        public shouldDisburse: boolean,
        public formData: any,

    ) {

    }
}

