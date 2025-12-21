export class ProductFeeEdit {
    constructor(
        public productId: number,
        public feeTargetName: string,
        public rateValue: number,
        public dependentAmount: number,
        public accountCategoryName: string,
        public productFeeId: number,
        public amortizationTypeName: string,
        public frequencyTypeName: string,
        public chargeName: string,
    ) { }
}