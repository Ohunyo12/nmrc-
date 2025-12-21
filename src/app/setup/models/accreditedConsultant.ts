export class IAccreditedConsultantInfo {
    accreditedConsultantId: number;
    registrationNumber: string;
    name: string;
    firmName: string;
    accreditedConsultantTypeId: number;
    cityId: number;
    countryId: number;
    accountNumber: string;
    solicitorBVN: string;
    emailAddress: string;
    phoneNumber: string;
    address: string;
    coreCompetence: string;
    accreditedConsultantStates: IAccreditedConsultantStateCovered[];
}
export class IAccreditedConsultantStateCovered {
    accreditedConsultantId: number;
    accreditedConsultantStateCoveredID: number;
    stateId: number;
    stateName: string;
}
export class IStateCovered {
    stateId: number;
    stateName: string;
}