export interface CustomerType {
    lookupId: number;
    lookupName: string;
}

export class Customer {
    constructor(
        public customerId: number,
        public customerCode: string,
        public branchId: number,
        public title: string,
        public firstName: string,
        public middleName: string,
        public lastName: string,
        public gender: string,
        public dateOfBirth: Date,
        public placeOfBirth: string,
        public nationality: string,
        public maritalStatus: number,
        public emailAddress: string,
        public maidenName: string,
        public spouse: string,
        public firstChildName: string,
        public childDateOfBirth: Date,
        public occupation: string,
        public customerTypeId: number,
        public relationshipOfficerId: number,
        public politicallyExposedPerson: boolean,
        public misCode: string,
        public misStaff: string,
        public approvalStatus: number,
        public dateActedOn: Date,
        public actedOnBy: string,
        public accountCreationComplete: boolean,
        public creationMailSent: boolean,
        public customerSensitivityLevelId: number,
        public subSectorId: number,
        public taxNumber: string
     ) { }
}

export class CustomerGroup {
    constructor(
        public customerGroupId: number,
        public groupName: string,
        public groupCode: string,
        public groupDescription: string
    ) { }
}

export class CustomerGroupMap {
    constructor(
        public groupMapId: number,
        public customerId: number,
        public customerGroupId: number,
        public relationshipTypeId: string
    ) { }
}

export class CustomerGroupRelationship {
    constructor(
        public lookupId: number,
        public lookupName: string
    ) { }
}

export class CustomerFSCaptionGroup {
    constructor(
        public fsCaptionGroupId: number,
        public fsCaptionGroupName: string
    ){ }
}