export class WorkflowTarget {
    targetId: number;
    operationId: number;
    productClassId?: number;
    productId?: number;
    toStaffId: number;
    responsiblePerson: string;
    currentApprovalLevel: string;
    nextApplicationStatusId: number;
    finalApprovalLevelId?: number;
    amount : number;
    trailId : number;
}

// export class ForwardViewModel {
//     trailId: number;
//     staffId: number
// }