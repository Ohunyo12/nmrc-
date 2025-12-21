export class ChartOfAccount{
    constructor(

        public accountId: number,
        public accountCode: string,
        public accountName: string,
        public accountTypeId: number,
        public companyId: number,
        public branchId: number,
        public currencyId: number,
        public currencies: string[],
        public systemUse: boolean,
        public accountStatusId: number,
        public branchSpecific: boolean,
        public oldAccountId: string,
        public fsCaptionId: number,
        public createdBy: number,
        public isSubAccount: boolean,
        public mainAccountId: number,
        public glClassId: number
    ){

    }
}