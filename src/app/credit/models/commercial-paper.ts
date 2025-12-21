export class commercialPaperSubAllocationSource{
    constructor(
        public loanReferenceNumber: string,
        public principalAmount: number,
        public customerId : number,
        public newPrincipalAmount: number,
        public currencyCode : string
    ){}
}