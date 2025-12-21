export class Ledger {
    constructor(
        public accountTypeId: number,
        public accountTypeName: string,
        public accountTypeCode: string,
        public accountCategoryId: number,
        public accountCategoryName: string, // prepared at api
    ) {}
}
    