export class JobRequestDetailModel {
    constructor(
        public jobSubTypeclassId: number,
        public jobSubTypeclassName: string,
        public jobSubTypeId: number,
        public jobTypeId: number,
        public amount: number,
        public jobRequestId: number,
        public accreditedConsultantId: number,
        public accountNumber: number,
        public currencyId: number,
        public description2 : string,
        public stateId : number
    ) { }
}





