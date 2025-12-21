export class StaffDetails {
    constructor(
        public staffId: number, public address: string, public companyId: number,
        public addressOfNok: string, public branchId: number, public comment: string,
        public customerSensitivityLevel: number, public dateOfBirth: Date, public departmentId: number,
        public email: string, public emailOfNok: string, public gender: string, public genderNok: string,
        public jobTitleId: number, public misinfoId: string, public nameOfNok: string,
        public nokrelationship: string, public phone: string, public phoneOfNok: string,
        public stateId: number, public firstName: string, public middleName: string,
        public lastName: string, public staffCode: string, public rankId: number, public branchName: string,
        public departmentName: string
    ) { }
}