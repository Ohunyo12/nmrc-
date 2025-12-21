export class ProductType {
    constructor(
        public productTypeId: number,
        public productTypeName: string,
        public productGroupId: number,
        public productGroupName: string,
        public requirePrincipalGl: boolean,
        public requirePrincipalGl2: boolean,
        public requireInterestIncomeExpenseGl: boolean,
        public requireInterestReceivablePayableGl: boolean,
        public requirePremiumDiscountGl: boolean,
        public requireDormantGl: boolean,
        public requireOverdrawnGL: boolean,
        public dealClassificationId: number,
        public requireRate: boolean,
        public requireTenor: boolean,
        public requireScheduleType: boolean
    ) {}
}