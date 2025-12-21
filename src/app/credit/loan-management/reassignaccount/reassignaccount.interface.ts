export interface IReassignAccount {
    productTypeId: number,
    targetId: number,
    staffAccountHistoryId: number,
    currentRMStaffId: number,
    startDate: Date,
    endDate: Date,
    effective: Date,
    newRMStaffId: number,
    reasonForChange: string,
    approvalStatusId: number,
    accountTypeId: number,
}