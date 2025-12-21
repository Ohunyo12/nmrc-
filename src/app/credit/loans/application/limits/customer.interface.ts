export interface ISelectedCustomer {
    loanTypeId: number; 
    customerId: number;
    branchId: number; 
    relationshipManagerId: number;
    subSectorId:number;
    genaralview: boolean;
}

export interface ISelectedItems {
    subSectorId:number;
    relationshipManagerId: number;
    facilityAmount: number;
}