export class ICustomerInfo {
    customerId: number;
    customerCode: string;
    branchId: number;
    companyMainId: number;
    branchName: string;
    title: string;
    firstName: string;
    middleName: string;
    customerTypeName: string;
    customerName: string;
    searchItem: string;
    lastName: string;
    gender: string;
    dateOfBirth: string;
    placeOfBirth: string;
    nationality: string;
    maritalStatus: string;
    emailAddress: string;
    maidenName: string;
    spouse: string;
    firstChildName: string;
    childDateOfBirth: string;
    occupation: string;
    customerTypeId: number;
    relationshipOfficerId: number;
    politicallyExposedPerson: string;
    misCode: string;
    misStaff: string;
    approvalStatus: string;
    dateActedOn: string;
    actedOnBy: string;
    accountCreationComplete: string;
    creationMailSent: string;
    customerSensitivityLevelId: number;
    subSectorId: number;
    subSectorName: string;
    sectorId: number;
    sectorName: string;
    taxNumber: string;
    customerBVN: string;
    riskRatingId: number;
    riskRatingName: string;
    relationshipOfficerName: string;
    isPoliticallyExposed: string;
    customerAccountNo: string;
    customerCompanyInfomation: ICustomerCompanyInfomation[];
    customerAddresses: ICustomerAddresses[];
    customerPhoneContact: ICustomerPhoneContact[];
    customerCompanyDirectors: ICustomerCompanyDirectors[];
    customerCompanyShareholder: ICustomerCompanyShareholder[];
    customerCompanyAccountSignatory: ICustomerCompanyAccountSignatory[];
    customerClientOrSupplier: ICustomerClientOrSupplier[];
    customerSupplier: ICustomerSupplier[];
    customerIdentification: ICustomerIdentification[];
    customerBvn: ICustomerBvn[];
    customerEmploymentHistory: ICustomerEmploymentHistory[];
    customerRating : string
    ownership: string
}
export class ICustomerCompanyInfomation {
    companyInfomationId: number;
    customerId: number;
    registrationNumber: string;
    companyWebsite: string;
    companyEmail: string;
    registeredOffice: string;
    annualTurnOver: string;
    corporateBusinessCategory: string;
    creditRating: string;
    previousCreditRating: string;
    paidUpCapital: string;
    authorizedCapital: string;
    companyName: string;
    customerRating : string;
}
export class ICustomerAddresses {
    addressId: number;
    customerId: number;
    address: string;
    stateId: number;
    cityId: number;
    homeTown: string;
    nearestLandmark: string;
    electricMeterNumber: string;
    pobox: string;
    addressTypeId: number;
    active: string;
}
export class ICustomerPhoneContact {
    phoneContactId: number;
    phone: string;
    phoneNumber: string;
    customerId: number;
    active: boolean;
}
export class ICustomerCompanyDirectors {
    companyDirectorId: number;
    customerId: number;
    customerName: string;
    surname: string;
    firstname: string;
    bankVerificationNumber: string;
    companyDirectorTypeId: number;
    companyDirectorTypeName: string;
    numberOfShares: string;
    isPoliticallyExposed: string;
    address: string;
    phoneNumber: string;
    email: string;
}
export class ICustomerCompanyShareholder {
    companyDirectorId: number;
    customerId: number;
    customerName: string;
    surname: string;
    firstname: string;
    bankVerificationNumber: string;
    companyDirectorTypeId: number;
    companyDirectorTypeName: string;
    numberOfShares: string;
    isPoliticallyExposed: string;
    address: string;
    phoneNumber: string;
    email: string;
}

export class ICustomerCompanyAccountSignatory {
    companyDirectorId: number;
    customerId: number;
    customerName: string;
    surname: string;
    firstname: string;
    bankVerificationNumber: string;
    companyDirectorTypeId: number;
    companyDirectorTypeName: string;
    numberOfShares: string;
    isPoliticallyExposed: string;
    address: string;
    phoneNumber: string;
    email: string;
}
export class ICustomerClientOrSupplier {
    client_SupplierId: number;
    customerId: number;
    customerTypeId: number;
    clientOrSupplierName: string;
    firstName: string;
    middleName: string;
    lastName: string;
    client_SupplierAddress: string;
    client_SupplierPhoneNumber: string;
    client_SupplierEmail: string;
    client_SupplierTypeId: number;
    client_SupplierTypeName: string;
}
export class ICustomerSupplier {
    client_SupplierId: number;
    customerId: number;
    customerTypeId: number;
    clientOrSupplierName: string;
    firstName: string;
    middleName: string;
    lastName: string;
    client_SupplierAddress: string;
    client_SupplierPhoneNumber: string;
    client_SupplierEmail: string;
    client_SupplierTypeId: number;
    client_SupplierTypeName: string;
}
export class ICustomerIdentification {
    identificationId: number;
    customerId: number;
    identificationNo: string;
    identificationModeId: number;
    identificationMode: string;
    issuePlace: string;
    issueAuthority: string;
}
export class ICustomerBvn {
    customerBvnid: number;
    customerId: number;
    surname: string;
    firstname: string;
    bankVerificationNumber: string;
    isValidBvn: string;
    isPoliticallyExposed: string;
}
export class ICustomerEmploymentHistory {
    placeOfWorkId: number;
    employerName: string;
    employerAddress: string;
    employerStateId: number;
    employerCountryId: number;
    officePhone: string;
    employDate: string;
    previousEmployer: string;
    customerId: number;
    active: string;
}