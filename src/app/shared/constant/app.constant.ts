
export class AppConstant {

    public static readonly REMEMBER_LAST_WORKAREA = false;

    public static get API_BASE(): string {
        return 'http://172.16.248.46:8081/api/v1/';
    }

    public static get TOKEN_URL(): string {
        return 'http://172.16.248.46:8081/token';
    }

    public static get API_VERSION(): boolean {
        return true;
    }

    public static accountCategories(): any[] {
        return [
            { accountCategoryId: 1, accountCategoryName: 'Assets' },
            { accountCategoryId: 2, accountCategoryName: 'Liabilities' },
            { accountCategoryId: 3, accountCategoryName: 'Capital and Reserves' },
            { accountCategoryId: 4, accountCategoryName: 'Income' },
            { accountCategoryId: 5, accountCategoryName: 'Expenses' },
        ];
    }

    public static treasuryProductTypes(): any[] {
        return [
            { treasuryProductId: 1, treasuryProductName: 'Both' },
            { treasuryProductId: 2, treasuryProductName: 'Non-Bank' },
            { treasuryProductId: 3, treasuryProductName: 'Inter-Bank' },
        ];
    }

    // public static collateralCategories(): any[] {
    //     return [
    //         { collateralCategoryId: 4001, collateralCategoryName: 'Real Estate' },
    //         { collateralCategoryId: 3201, collateralCategoryName: 'Treasury Products' },
    //         { collateralCategoryId: 1601, collateralCategoryName: 'Current and Savings Account' },
    //         { collateralCategoryId: 7201, collateralCategoryName: 'Stock' },
    //         { collateralCategoryId: 4401, collateralCategoryName: 'Others' },
    //     ];
    // }

    public static EMAIL_REGEXP(): RegExp {
        return /^[a-z0-9!#$%&'*+\/=?^_`{|}~.-]+@[a-z0-9]([a-z0-9-]*[a-z0-9])?(\.[a-z0-9]([a-z0-9-]*[a-z0-9])?)*$/i
    }

    public static ObjectsToParams(obj): string {
        const p = [];
        for (const key in obj) {
            if (key != null) {
                p.push(key + '=' + encodeURIComponent(obj[key]));
            }
        }
        return p.join('&');
    }

}

export class ApprovalStatus {
    public static readonly PENDING = 0;
    public static readonly PROCESSING = 1;
    public static readonly APPROVED = 2;
    public static readonly DISAPPROVED = 3;
    public static readonly AUTHORISED = 4;
    public static readonly REFERRED = 5;
    public static readonly REROUTE = 6;
    public static readonly ESCALATED = 7;
    public static readonly list: any[] = [
        { id: 0, name: 'Pending' },
        { id: 1, name: 'Processing' },
        { id: 2, name: 'Approved' },
        { id: 3, name: 'Disapproved' },
        { id: 4, name: 'Authorised' },
        { id: 5, name: 'Referred' },
        { id: 6, name: 'Reroute' },
        { id: 7, name: 'Escalated' },
    ];
}





export class FeeType {
    public static readonly RATE = 1;
    public static readonly AMOUNT = 2;
    public static readonly RANGE = 3;
}

export class RequestStatus {
    public static readonly PENDING = 1;
    public static readonly IN_PROGRESS = 2;
    public static readonly COMPLETED = 3;
    public static readonly CANCELLED = 4;
}

export class GlobalConfig {

    public static get APPLICATION_NAME(): string {
        return 'FinTrak Credit 360';
    }

    public static get TITLE_HEADER(): string {
        return 'Fintrak :: Credit 360';
    }
}

export class ConvertString {

    public static TO_NUMBER(pamount): number {
        if (typeof (pamount) == "string") {
            let __return;
            ({ __return, pamount } = ConvertString.regularExpression(pamount));
            return __return;
        } else if (typeof (pamount) == "number") {
            return pamount = pamount;
        }
    }
    public static ToNumberFormate(value): string {
        if (value == null) value = 0;
        return value.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
    }
    private static regularExpression(pamount: any) {
        return { __return: pamount = pamount.replace(/[^0-9-.]/g, ''), pamount };
    }
}

export class ReportPaths {
    public static readonly COLLATERAL_REV_REPORT = `${AppConstant.API_BASE}report/monitoring/collateral-property-revaluation`;
    public static readonly COVENANT_OVD_REPORT = `${AppConstant.API_BASE}report/monitoring/almost-due-covenants`;
    public static readonly NPL_LOAN_REPORT = `${AppConstant.API_BASE}report/monitoring/non-performing-loans`;
    public static readonly EXPIRED_SELFLIQ_REPORT = `${AppConstant.API_BASE}report/monitoring/expired-self-liquidating-loans`;
    public static readonly EXPIRED_ODLOANS_REPORT = `${AppConstant.API_BASE}report/monitoring/overdraft-loans`;
}

export enum JobTypeEnum {
    Legal = 1,
    MiddleOfficeVarification = 2,
    CamsolCheck = 4,
    BlackBookCheck = 5,
    Treasury = 7,
    CRM = 8,
    AuditAndControl = 9,
    Compliance = 10,
    Others = 11,
}

export enum JobSourceEnum {
    LoanApplicationDetail = 1,
	LoanBookingAndApproval = 2,
	OverdraftBookingAndApproval = 3,
	ContingentLiabilityBookingAndApproval = 4,
	LMSApplication = 5,
    LMSOperationAndApproval = 6,
    CollateralReleaseApproval = 7,
    Floating = 8,
    LoanApplicationCaptureCRMS = 9,

}

export enum JobSubTypeEnum {
    CollateralRelated = 1,
    BondsAndGauranteeVetting = 2,
    Others = 3,
    MiddleOfficeVerification = 4,
    CAMSOLCheck = 5,
    BlackBookCheck = 6,
    ConfirmationOfTreasuryBills = 7,
    ConfirmationOfDealSlip = 8,
    ConfirmationOfStock = 9,
    ConfirmationOfFBNQUEST = 10,
    OtherJobTypeOtherSubType = 11,
}

export enum JobSubTypeClassEnum {
    CollateralSearch = 1,
    CollateralVerification = 2,
    CollateralCharting = 3,
    AdditionalCharges =  4,
    CACSearch = 5,
}

export enum LoanSystemTypeEnum {
    TermDisbursedFacility = 1,
    OverdraftFacility = 2,
    ContingentFacility = 3,
    LineFacility = 4, 
    ThirdPartyLoans = 5,
}

export enum ApprovalStatusEnum {
    Pending = 0,
    Processing = 1,
    Approved = 2,
    Disapproved = 3,
    Authorised = 4,
    Referred = 5,
    Reroute = 6,
    Escalated = 7,
}

export enum JobRequestStatusEnum {
    Approved = 3,
	Cancel = 5,
	Disapproved = 4,
	Pending = 1,
	Processing = 2,
}

export enum JobTypeUnitEnum {
    LegalCorporate =1,
    Litigations =2,
    SecurityDocumentationAndManagement = 3,
    CorporateAndContract = 4,
    HubCordination = 5,
    AreaLegalManager = 6,
    AreaLegalOfficer = 7,
    LegalService =  8,
    LegalOfficer = 9,
    DocumentationAndVerification = 10,
    AuditAndControl = 11,
    Treasury = 12,
    confirmationOfTreasuryBills = 13,
    CAMSOLBLACKBOOK = 14,
    Compliance = 16,
    CACSearch = 18,
    ConfirmationOfFBNQUEST = 19,
}

export enum LoanApplicationStatus {
    CAMInProgress = 3,
    CAMCompleted = 4,
    OfferLetterGenerationInProgress = 5,
    OfferLetterGenerationCompleted = 6,
    OfferLetterReviewInProgress = 7,
    OfferLetterReviewCompleted = 8,
    AvailmentInProgress = 9,
    AvailmentCompleted = 10,
    LoanBookingInProgress = 11,
    LoanBookingCompleted = 12,
    ApplicationUnderReview = 17,
    BondAndGuaranteesInProgress = 18,
    LoanApplicationRejected = 19,
    OfferLetterRejected = 20,
    CancellationCompleted = 20

}

export class ApplicationStatus {
    public static readonly list: any[] = [ 
        { id: 1, name: 'Application In Progress' },
        { id: 2, name: 'Application Completed' },
        { id: 3, name: 'Credit Appraisal process' },
        { id: 4, name: 'Credit Appraisal Completed' },
        { id: 5, name: 'Offer Letter Generation In Progress' },
        { id: 6, name: 'Offer Letter Generation Completed' },
        { id: 7, name: 'Offer Letter Review In Progress' },
        { id: 8, name: 'Offer Letter Review Completed' },
        { id: 9, name: 'Availment In Progress' },
        { id: 10, name: 'Drawdown In Progress' }, //Availment Completed
        { id: 11, name: 'Loan Booking In Progress' },
        { id: 12, name: 'Loan Booking Completed' },
        { id: 13, name: 'Checklist In Progress' },
        { id: 14, name: 'Checklist Completed' },
        { id: 15, name: 'Loan Booking Request in Progress' },
        { id: 16, name: 'Loan Booking Request Completed' },
        { id: 17, name: 'Application Under Review' },
        { id: 18, name: 'Bond & Guarantees In Progress' },
        { id: 19, name: 'Loan Application Rejected' },
        { id: 20, name: 'Offer Letter Rejected' },
        { id: 22, name: 'Cancellation Completed'},
        { id: 24, name: 'LC Issuance Completed' },
        { id: 25, name: 'LC Shipping Release In Progress' },
        { id: 26, name: 'LC Shipping Release Completed' },
        { id: 27, name: 'LC Usance In Progress' },
        { id: 28, name: 'LC Usance Completed' },
        { id: 29, name: 'LC Issuance In Progress' },
        { id: 30, name: 'Letter Generation Request In Progress' },
        { id: 31, name: 'Letter Generation Request Completed' },
   
    ];
}

export enum LoanStatusEnum {
    Active = 1,
	Suspended = 2,
	Cancelled = 3,
	Terminated = 4,
	Inactive = 5,
	Completed = 6,
	WriteOff = 7
}

/*1	Application in Progress	5
2	Application Completed	10
3	Credit Appraisal process	25
4	FAM Completed	30
5	Offer Letter Generation In Progress	35
6	Offer Letter Generation Completed	40
7	Relationship Manager Offer Letter Review In Progress	45
8	Relationship Manager Offer Letter Review Completed	50
9	Availment In Progress	55
10	Availment Completed	60
11	Loan Booking In Progress	75
12	Loan Booking Completed	80
13	Checklist in Progress	15
14	Checklist Completed	20
15	Loan Booking Request in Progress	65
16	Loan Booking Request Completed	70
17	Application Under Review	85
18	Bond And Guarantees	90
20	Offer Letter Rejected	46
19	Loan Application Rejected	26
NULL	NULL	NULL*/

export class ApprovalGroupRole {
    public static readonly NONE = 1;
    public static readonly BU = 2;
    public static readonly CAP = 3;
    public static readonly CRO = 4;
    public static readonly MD = 5;
    public static readonly MCC = 6;
    public static readonly BCC = 7;
    public static readonly BOD = 8;
    public static readonly list: any[] = [
        { id: 1, name: 'None' },
        { id: 2, name: 'Business' },
        // { id: 3, name: 'Credit Analyst (CAP)' },
        { id: 3, name: 'Credit Risk Management (CRM)' },
        { id: 4, name: 'Chief Risk Officer (CRO)' },
        { id: 5, name: 'Managing Director (MD)' },
        { id: 6, name: 'MCC' },
        { id: 7, name: 'BCC' },
        { id: 8, name: 'BOD' },
    ];
}
export class CustomerTypeEnum {
    public static readonly INDIVIDUAL = 1;
    public static readonly CORPORATE = 2;
}

export class IntegratedCustomerTypeEnum {
    public static readonly INDIVIDUAL = 1;
    public static readonly CORPORATE = 2;
}

export class ProductClassEnum {
    public static readonly CORPORATE = 1;
    public static readonly COMMERCIAL = 2;
    public static readonly INDIVIDUAL = 4;
    public static readonly CASHCOLLATERIZED = 5;
    public static readonly INVOICEDISCOUNTINGFACILITY = 6;
    public static readonly PUBLICSECTOR = 11;
    public static readonly PRIVATEBANKING = 21;
    public static readonly IMPORTFINANCEFACILITY = 41
    public static readonly AUTOLOANS = 22;
    public static readonly PERSONALLOANS = 23;
    public static readonly FACILITYUPGRADESUPERSCHEME = 24;
    public static readonly CREDITCARD = 25;
    public static readonly MORTGAGELOANS = 26;
    public static readonly MHSS = 30;
    public static readonly WPOWER = 31;
    public static readonly MPOWER = 32;
    public static readonly EMERGINGBUSINESS = 33;
    public static readonly ADVANCEFORSCHOOLFEES = 29;
}
export class ProductLinesClassEnum {
    public static readonly INVOICEDISCOUNTINGFACILITY = 6;
    public static readonly IMPORTFINANCEFACILITY = 41
}

export enum FlowChangeEnum
    {
        CASHBACKED = 1,
        CLEANCARD = 2,
        SALARYBACKED = 3,
        TEMPORARYOVERDRAFT = 4,
        FAM = 5,
        CASHCOLLATERIZED = 10
    }

export class ProductClassProcessEnum {
    public static readonly FAM = 1;
    public static readonly CreditProgram = 2;
} 


export class CreditcardTypeEnum {
    public static readonly CASHBACKED = 1;
    public static readonly CLEANCARD = 2;
    public static readonly SALARYBACKED = 3;
}

export class RacSearchBaseEnum {
    public static readonly PRODUCT = 1;
    public static readonly CREDITCARD = 2;
}

export enum CheckListStatusEnum{
	Waived = 2,
	Provided = 3,
	Deferred = 4,
	Yes = 5,
	No = 6,
	Low = 7,
	Medium = 8,
	High = 9
}

export class ChecklistTypeEnum {
    public static readonly LoanEligibilityChecklist = 1;
    public static readonly RegulatoryChecklist = 2;
    public static readonly EnvironmentalandSocialChecklist = 3;
    public static readonly Prelendingcallgrid = 4;
    public static readonly AvailmentChecklist = 5;
    public static readonly GreenRating = 10;
}

export class CustomerModificationTypeEnum {
    public static readonly General_Information = 1;
    public static readonly Corporate_Information = 2;
    public static readonly Address_Addition = 3;
    public static readonly Address_Modification = 4;
    public static readonly Phone_Number_Addition = 5;
    public static readonly Phone_Number_Modification = 6;
    public static readonly Director_Addition = 7;
    public static readonly Director_Modification = 8;
    public static readonly Director_Removal = 9;
    public static readonly Signatory_Adition = 10;
    public static readonly Signatory_Modification = 11;
    public static readonly Signatory_Removal = 12;
    public static readonly Client_Addition = 13;
    public static readonly Client_Modification = 14;
    public static readonly Client_Removal = 15;
    public static readonly Supplier_Addition = 16;
    public static readonly Suplier_Modification = 17;
    public static readonly Supplier_Removal = 18;
    public static readonly Shareholder_Addition = 19;
    public static readonly Shareholder_Modification = 20;
    public static readonly Shareholder_Removal = 21;
    public static readonly Shareholder_Ultimate_Beneficiary_Addition = 22;
    public static readonly Shareholder_Ultimate_Beneficiary_Modification = 23;
    public static readonly Shareholder_Ultimate_Beneficiary_Removal = 24;
    public static readonly Employement_History_Addition = 25;
    public static readonly Employment_History_Modification = 26;
    public static readonly Next_of_Kin_Addition = 27;
    public static readonly Next_of_Kin_Modification = 28;
    public static readonly Customer_Children_Addition = 29;
    public static readonly Customer_Children_Modification = 30;
    public static readonly Document_Addition = 31;
}

export class ChecklistResponseTypeEnum {
    public static readonly ProvidedOrWaived = 1;
    public static readonly YesOrNo = 2;
}

export class FeeConcessionTypeEnum {
    public static readonly Interest = 1;
    public static readonly Fee = 2;
}

export enum ProductProcessEnum {
    CAMBased = 1,
    ProductBased = 2,
}

export enum ChargeTypeEnum
{
    NoCharge = 1,
    ChargeCustomer = 2,
    ChargeBank = 3,
    ChargeCustomerORBank = 4
}

export enum ProductTypeEnum {
    TermLoan = 1 ,
    SelfLiquidating = 2,
    CurrentAccount = 3,
    SavingsAccount = 4,
    Revolving = 6,
    ContingentLiability = 9,
    AdvisoryFee = 14,
    CommercialLoans = 40,
    ForeignExchangeRevolvingFacility = 41,
    SyndicatedLoan = 42
}

export enum AvailmentApprovalLevel {
    availmentFirstApprLvl = 59,
    availmentFinalApprLvl = 62
}

export enum CreditBureauTypeEnum {
    CRMS = 1,
    XDSCreditBureau = 2,
    CRCCreditBureau = 3,
    CRSCreditBureau = 4
}

export enum AccreditedConsultantTypeEnum {
        Solicitor = 1,
        Valuer = 2,
        Auditor = 3,
        RecoveryAgent = 4,
        SalesAgent = 6
}

export class TenorType { 
    public static readonly list: any[] = [
        { tenorModeId: 1, name: 'Months' },
        { tenorModeId: 2, name: 'Days' },
        { tenorModeId: 3, name: 'Years' }
    ]
}

export class CollateralUsageStatusEnum {
    public static readonly list: any[] = [
        { collateralUsageStatus: 1, name: 'Propose' },
        { collateralUsageStatus: 2, name: 'InUse' },
        { collateralUsageStatus: 3, name: 'Used' },
        { collateralUsageStatus: 4, name: 'Rejected' }
    ]
}

export enum CollateralGuaranteeSubType {
    PERSONAL_GUARANTEE = 13,
     CORPORATE_GUARANTEE = 22,
     CROSS_GUARANTEE = 134,
     JOIN_GUARANTEE_PERSONAL = 133,
     JOIN_GUARANTEE_CORPORATE = 135,
}

export enum CollateralType {
    MARKETABLE_SECURITIES = 1,
    IMMOVABLE_PROPERTY = 2,
    PLANT_AND_EQUIPMENT = 3,
    POLICY = 4,
    VEHICLE = 5,
    PRECIOUS_METAL = 6,
    FIXED_DEPOSIT = 7,
    CASA = 8,
    GUARANTEE = 9,
    STOCK = 14,
    MISCELLANEOUS = 17,
    PROMISSORY = 18,
    ISPO = 19,
    DOMICILIATIONCONTACT = 20,
    DOMICILIATIONSALARY = 21,
    INDEMNITY = 22,

}

export enum JobSource {
    LoanApplicationDetail = 1,
	LoanBookingAndApproval = 2,
	OverdraftBookingAndApproval = 3,
	ContingentLiabilityBookingAndApproval = 4,
	LMSApplication = 5,
    LMSOperationAndApproval = 6,
    CollateralReleaseApproval = 7

}

export enum FacilityReviewWorkflowEnum
{
	FacilityLineLimitChangeApproval = 246,
	FacilityLineTenorChangeApproval = 247,
}

export enum OverdraftReviewWorkflowEnum
{
    OverdraftInterestRateChangeApproval = 211,
	OverdraftRenewalApproval = 222,
	OverdraftTenorExtensionApproval = 223,
	OverdraftTopUpApproval = 224, 
	OverdraftSubAllocationApproval = 225
	
}

export enum CongintentReviewWorkflowEnum
{
	APSReleaseApproval = 226,
	CancelContingentLiabilityApproval = 227,
	CancelInactiveContigentLiabilityApproval = 228,
	ContingentLiabilityAmountAdditionApproval = 229,
	ContingentLiabilityAmountReductionApproval = 230,
	ContingentTerminateApproval = 231,
	ContingentRebookApproval = 232,
	ContingentLiabilityTenorExtensionApproval = 233,
	ContingentLiabilityTerminationApproval = 234,
	ContingentLiabilityRenewalApproval = 235,
	ContingentLiabilityUsageApproval = 236,
	ExpiredContigentLiabilityApproval = 237
}

export enum GeneralLoanReviewWorkflowEnum
{
	ChangeRepaymentAccountApproval = 212,
	LoanRecapitalizationApproval = 213,
	LoanTerminationApproval = 214,
	FullAndFinalApproval = 215,
	BulkLiquidationApproval = 216,
	RenewalApproval = 217,
    PaymentDateChangeApproval = 218,
	TenorExtensionApproval = 220,
	GlobalInterestRateChangeApproval = 240,
	ManualFeeChargeCollectionApproval = 243,
	PrepaymentManualLiquidationApproval = 244,
	ReversalOfPrepaymentManualLiquidationApproval = 245,
	LoanRecoveryApproval = 248,
	AnnualReviewApproval = 249
}

export enum TermLoanReviewWorkflowEnum
{
	LoanRecapitalizationApproval = 213,
	LoanTerminationApproval = 214,
    PaymentDateChangeApproval = 218,
	InterestAndPrincipalFrequencyChangeApproval = 219,
	TenorExtensionApproval = 220,
    WriteoffApproval = 221,
	LoanReversalRepaymentApproval = 241,
	LoanReversalFeeApproval = 242,
	PrepaymentManualLiquidationApproval = 244,
	ReversalOfPrepaymentManualLiquidationApproval = 245,
	LoanRecoveryApproval = 248,
	AnnualReviewApproval = 249
}

export enum LMSOperationEnum {
    LoanReversal = 17,
    InterestRateChange = 19,
    Prepayment = 21,
    PrincipalFrequencyChange = 22,
    InterestFrequencyChange = 23,
    InterestAndPrincipalFrequencyChange = 24,
    PaymentDateChange = 25,
    TenorExtension = 26,
    ChangeRepaymentAccount = 27,
    FeeChargeChange = 29,
    TerminateAndRebook = 30,
    CompleteWriteOff = 31,
    CancelUndisbursedLoan = 32,
    InterestSuspension = 33,
    LoanTermination = 34,
    CollateralRelease = 35,
    LoanReviewApprovalAppraisal = 46,
    NPLLoanReviewApprovalAppraisal = 71,
    WriteOffLoanReviewApprovalAppraisal = 79,
    Restructure = 51,
    CollateralMaintenance = 54,
    ContingentLiabilityUsage = 56,
    ReassigningOfAccount = 57,
    LoanRecapitilization = 59,
    LoanPerformance = 62,
    CAMSOLBlackbookModification = 70,
    CommercialLoanRollOver = 72,
    CommercialLoanSubAllocation = 74,
    LoanWorkOut = 80,
    FacilityLineAmountChange = 87,
    ContingentLiabilityTermination = 86,
    ContingentLiabilityRenewal = 85,
    OverdraftTenorExtension=52,
    OverdraftTopup=28,
    OverdraftSubAllocation=20,
    OverdraftRenewal=53,
    OverdraftInterestRateReview=75,
    CommercialLoanMaturityInstruction = 95,
    InterestRepricing =89,
    ContingentLiabilityAmountReduction =	97,
    ContingentLiabilityTenorExtension =	96,
    InterestOnPastDuePrincipal	= 94,
    InterestOnPastDueInterest =	93,
    LoanRecovery = 64,
    ContingentLiabilityRebook = 104,
    ManualFeeCharge = 99,
    GlobalInterestRateChange = 100,
    CancelContingentLiability = 105,
    ContingentLiabilityAmountAddition =	106,
    APS_RelaseChecklist =	107,
    APS_ReleaseCAP =	108,
    APS_ReleasePrincipaRequest =	109,
    FinalCollateralRelease =	110,
    TemporalCollateralRelease =	111,
    DailyWriteoffInterestAccural = 112,
    LoanRecoveryPayment = 113,
    LoanRecoveryCompletion = 114,
    FullAndFinalCompleteWriteOff = 115,
    LmsOperations = 116,
    EarnUnEarnedFee = 117,
    AnnualReview = 130,
    IndictiveTermsheet = 201,
    CreditCardsCashBacked = 202,
    AtcLodgementApproval = 136,
    AtcReleaseApproval = 137,
    CrmsApproval = 118,
    OriginalDocumentApproval = 134,
    CollateralValuationRequest = 144,
    SecurityRelease = 147,
    

}

export enum LoanScheduleTypeEnum
{ 
    Annuity = 1, 
    ReducingBalance = 2, 
    BulletPayment = 3, 
    AnnuityWithScheduledRepayment = 4, 
    IrregularSchedule = 5, 
    ConstantPrincipalAndInterest = 6,
    BallonPayment = 7
}

export enum DayCountConventionEnum 
{ 
    US_NASD_30_360 = 0, 
    Actual_Actual = 1 , 
    Actual_360 = 2, 
    Actual_365 = 3, 
    European_30_360 = 4,
    Isda_30_360 = 5, 
    No_Leap_Year_365 = 7, 
    No_Leap_Year_360 = 8, 
    Actual_364 = 9
};

export enum DealTypeEnum
{
    Backend = 1,
    Upfront = 2,
}

export enum LoanRepricingModeEnum
    {
        FloatingToMaturity = 1,
        FixedToMaturity = 2,
        FixedToMaturityWithRepricing = 3
    }

    export enum  Operations {
        LoanSales=58,
        LoanRecovery=64
    }

    export interface ReportTypeList {
        value: string;
        desc: string;
        index: number;
    }
    // tslint:disable-next-line:class-name
    export class statusReportType {
        public static reports: ReportTypeList[] = [
          { value: 'DisbursedLoansReport', desc: 'Disbursed Loans', index: 0 },
          { value: 'TerminatedLoansReport', desc: 'Terminated Loans', index: 1 },
          { value: 'InitiatedLoansReport', desc: 'Initiated Loans', index: 2 },
          { value: 'MaturedLoansReport', desc: 'Matured Loans', index: 3 },
          { value: 'ApprovedLoansReport', desc: 'Approved Loans', index: 4 },
          { value: 'CustomerListReport', desc: 'Customer List', index: 5 },
          { value: 'CancelledLoansReport', desc: 'Cancelled Loans', index: 6 }
        ];
    }

export enum AdhocApprovalEnum {
    AdhocApprovallevel1 = 1,
    AdhocApprovallevel2 = 2
}

export enum OperationsEnum
{
    //setup operations
    StaffCreation = 3,
    UserCreation = 4,
    ProductCreation = 5,
    ChartOfAccountCreation = 7,
    CustomerGroupCreation = 8,
    FeeCreation = 10,

    //loan origination operations

    TermLoanBooking = 1,
    LoanApplication = 2,
    CreditAppraisal = 6,
    LoanPreliminaryEvaluation = 9,
    CollateralSearchInitiation = 12,
    RevolvingLoanBooking = 13,
    ContigentLoanBooking = 14,
    DailyInterestAccural = 15,
    InterestLoanRepayment = 16,
    LoanReversal = 17,
    LoanPrepayment = 18,
    ContractualInterestRateChange = 19,
    OverdraftSubAllocation = 20,
    Prepayment = 21,
    PrincipalFrequencyChange = 22,
    InterestFrequencyChange = 23,
    InterestandPrincipalFrequencyChange = 24,
    PaymentDateChange = 25,
    TenorChange = 26,
    CASAAccountChange = 27,
    OverdraftTopup = 28,
    Fee_chargeChange = 29,
    TerminateAndRebook = 30,
    CompleteWriteOff = 31,
    CancelUndisbursedLoan = 32,
    InterestSuspension = 33,
    LoanTermination = 34,
    CollateralRelease = 35,
    LoanBookingFeeDeferral = 36,
    OfferLetterApproval = 37, // MIGHT NOT BE USED
    LoanAvailment = 38,
    CorporateDrawdownRequest = 39,
    LoanBookingFeeOveride = 40,
    BondsAndGuarantees = OfferLetterApproval,
    DefferedChecklistApproval = 42,
    CustomerInformationApproval = 44,
    OverrideRequest = 43,
    LoanReviewApprovalApplication = 45,
    LoanReviewApprovalAppraisal = 46,
    LoanReviewApprovalOfferLetter = 47,
    LoanReviewApprovalAvailment = 48,
    FeeConcessionApproval = 49,
    CreditBureauSearch = 50,
    Restructured = 51,
    OverdraftTenorExtension = 52,
    OverdraftRenewal = 53,
    CollateralMaintenance = 54,
    StaffRoleCreation = 55,
    ContingentLiabilityUsage = 56,
    ReassigningOfAccount = 57,
    LoanSales = 58,
    LoanRecapitilization = 59,
    CollateralApproval = 60,
    IsurancePolicyApproval = 61,
    LoanPerformance = 62,
    CommercialLoanBooking = 63,
    LoanRecovery = 64,
    ChecklistOperation = 65,
    PrincipalLoanRepayment = 66,
    InterestPastDueLoanRepayment = 67,
    PrincipalPastDueLoanRepayment = 68,
    InterestOnPastDueInterest = 93,
    InterestOnPastDuePrincipal = 94,
    PenalFee = 69,
    CamsolBackbookModification = 70,
    NPLoanReviewApprovalAppraisal = 71,
    CommercialLoanRollOver = 72,
    ForeignExchangeLoanBooking = 73,
    CommercialLoanSubAllocation = 74,
    OverdraftInterestRate = 75,
    ApprovalWorkflowGroupModification = 76,
    ApprovalWorkflowLevelModification = 77,
    ApprovalLevelStaffModification = 78,
    LoanWorkOut = 80,
    LoanApplicationCancellation = 81,
    ContingentRequestBooking = 83,
    LoanAndOverdraftRequestBooking = 82,
    ContingentLiabilityTermination = 86,
    ContingentLiabilityRenewal = 85,
    FacilityLineAmountChange = 87,
    InterestRepricing = 89,
    //Added by Yemi
    StaffReliefCreation = 84,
    AccreditedConsultantCreated = 88,
    WrittenOffLoanReviewApprovalAppraisal = 79,
    CollateralSearchCompletion = 90,
    MaturityInstruction = 95,
    ContingentLiabilityTenorExtension = 96,
    ContingentLiabilityAmountReduction = 97,
    IndividualDrawdownRequest = 98,
    ManualFeeCharge = 99,
    GlobalInterestRateChange = 100,
    CustomerGroupMapping = 101,
    DeleteStaff = 102,
    UserAccountStatusChange = 103,
    ContingentLiabilityTerminateAndRebook = 104,
    CancelContingentLiability = 105,
    ContingentLiabilityAmountAddition = 106,
    APS_RelaseChecklist = 107,
    APS_ReleaseCAP = 108,
    APS_ReleasePrincipaRequest = 109,
    FinalCollateralRelease = 110,
    TemporalCollateralRelease = 111,
    DailyWriteoffInterestAccural = 112,
    LoanRecoveryPayment = 113,
    LoanRecoveryCompletion = 114,
    FullAndFinalCompleteWriteOff = 115,
    LmsOperations = 116,
    EarnUnEarnedFee = 117,

    //
    AdhocApproval = 133,
    OriginalDocumentApproval = 134,
    lcIssuance = 135,
    AtcReleaseApproval = 137,
    AtcLodgementApproval = 136,
    lcReleaseOfShippingDocuments = 138,
    ProjectSiteReportApproval = 139,
    lcUssance = 140,
    CreditCardDrawdownRequest = 141,
    LetterGenerationRequest = 142,
    CollateralValuationRequest = 144,
    CreditCardsSalaryBacked = 145,
    CreditCardsCleanCards = 146,
    SecurityRelease = 147,
    WaivedChecklistApproval = 148,
    //InitiationLevelAppraisal = 148,   //this has to be changed, using an existing enum
    CallMemo = 150,

    //New Id's for existing Enumn that were edited

    AnnualReview = 200, //formerly id= 114
    IndictiveTermsheet = 201,   //formerly id = 115
    CreditCardsCashBacked = 202,    //formerly 116
    CollateralSwap = 206,

}

export enum ActivityParentId 
{
    SystemAdmin = 1,
    AdminSetup = 2,
    CreditSetup = 3,
    ApprovalSetup = 4,
    SetupApproval = 5,
    CustomerManagement = 6,
    CollateralApproval = 7,
    CreditApproval = 8,
    CreditOrigination = 9,
    CreditManagement = 10,
    CreditReport = 11,
    NotInUse = 12,

}
