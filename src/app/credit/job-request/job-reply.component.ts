import { Component, Input, Output, EventEmitter, ViewChild  } from '@angular/core';
import { LoadingService } from '../../shared/services/loading.service';
import { RequestJobTypeService } from '../../setup/services/request-job-type.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { JobService } from "../services/job.service";
import {LoanApplicationService} from '../services/loan-application.service';
import { CustomerInformationDetailComponent } from '../../customer/components';
import { saveAs } from 'file-saver';
import { ProductClassEnum, AccreditedConsultantTypeEnum, GlobalConfig, JobRequestStatusEnum, JobSubTypeClassEnum, JobTypeEnum, JobSubTypeEnum, LMSOperationEnum, JobSourceEnum, LoanSystemTypeEnum } from '../../shared/constant/app.constant';
import { CountryStateService } from '../../setup/services';
import { CasaService } from '../../customer/services/casa.service';
import { Subject } from 'rxjs';
import swal from 'sweetalert2';
import { AuthenticationService } from 'app/admin/services/authentication.service';
import { AuthorizationService } from 'app/admin/services/authorization.service';
import { CreditJobRequestComponent } from 'app/credit/job-request/credit-job-request.component';
import { DatePipe } from '@angular/common';
import { CreditAppraisalService, LoanReviewApplicationService } from '../services';
import { JobRequestDetailModel } from '../models/job-request';

@Component({
selector: 'job-reply-template',
templateUrl: 'job-reply.component.html',
styleUrls: ['job-request.component.scss'],
})

export class ReplyRequestComponent {
    twoFactorAuthStaffCode: string = null;
    twoFactorAuthPassCode: string = null;
    showCollateralInformation: boolean;
    reload:number=0;
    customerAccount: any;
    selectedSolictor: any;
    solicitors: any;
    collateralState: any[];
    states: any[] = [];
    isReplied: boolean = false;
    fileDocument: any;
    showDocumentGrid: boolean = false;
    jobRequestCode: any;
    hasCollateralInxData: boolean = false;
    collateralTypeId: number;
    collateralCustomerId: number;
    collateralDetailsText: any;
    hideCollateralDetailsTab: boolean = true;
    tabIndex: number;
    isRejection: boolean;
    invoiceFeedbackForm: FormGroup;
    statusApprovalId: any;
    loanApplicationId: any;
    loanApplicationDetailId: any;
    jobCollateralText: any;
    bondsAndGaurantees: any[]=[];
    jobCollateral: any;
    hasCollateral: boolean = false;
    requestStatusArray: JobRequestStatusEnum;
    firstEduDetail: any;
    firstTraderDetail: any;
    
    responseControlNoDataText: string;
    disableReplyControl: boolean;
    statusFeedbackList: any;
    invoiceDiscountItem: any[] =[];
    invoiceDiscountDetail: any[] =[];
    loanData: any;
    applicationRecord: any[] =[];
    jobForm: FormGroup;
    rmJobForm: FormGroup;
    lastTabText: string ;
    jobDataText: string;
    showDetailsTab: boolean = false;
    invoiceSelected: boolean = false; 
    displayStatusFeedbackList: boolean = false
    loggedInStaffId: any;
    to: any;
    receiverStaffId: any;
    filteredJobData: any;
    jobComments: any[]=[];
    
    jobRequestId: number;
    branch: any;
    commentForm: FormGroup;
    displayResponseWindow: boolean = false;
    feedbackOptions: ({ label: string; icon: string; command: () => void; } | { label: string; icon: string; url: string; } | { label: string; icon: string; routerLink: string[]; })[];
    jobSubTypeData: any;
    contentSubject: string;
    contentInfo: any;
    comment: any;
    feedback: string = null;
    departments: any[] = [];
    showLoadIcon: boolean = false; // lazyloading
    jobRequests: any[] =[];
    displaySearchModal: boolean = false;
    searchResults: Object; 
    searchTerm$ = new Subject<any>();
    userDepartmentId = 0;
    documentTypeName: string; 
    uploadFileTitle: string = null;
    files: FileList;
    file: File;
    supportingDocuments: any[] = [];
    jobTypes: any[] = [];
    displayReassignForm: boolean = false;
    replyForm: FormGroup; 
    lastSelectedDepartmentId?: number = null;
    enableResponse: any ;
    staffList: any[] = [];
    query: string;
    fromSender: string;
    queryTwo: string;
    filteredList: any[] = [];
    show: boolean = false; message: any; title: any; cssClass: any; 
    canTerminate: boolean = false;
    responseComment: any;
    displayReferBackUpload: boolean;
    @Output() saveCompleted: EventEmitter<any> = new EventEmitter<any>();

    //..........Input variables 
    @Input() emittableJobRequestRecord: any;
    @Input() jobData: any;
    @Input() pageHeaderTitle: string;
    @Input() hideableClassValue: string ="";
    @Input() jobId: boolean;
    @Input() reasignedTo: boolean;
    @Input() viewOnly: boolean;

    //...........End of Input variables 

    //Output Event emmitter definition consumed during loan Booking
    @Output() notify: EventEmitter<any> = new EventEmitter<string>();
    @Output() displayOption: EventEmitter<any> = new EventEmitter<string>();
    @Output() displayOptionNoRefresh: EventEmitter<any> = new EventEmitter<string>();

    @ViewChild(CustomerInformationDetailComponent, {static: false}) customerInfo: CustomerInformationDetailComponent;
    //@ViewChild(CollateralInformationViewComponent) CollateralInfoObj: CollateralInformationViewComponent;
    //@ViewChild(LoanApplicationDetailsViewComponent) applicationInfoObj: LoanApplicationDetailsViewComponent;
    @ViewChild(CreditJobRequestComponent, {static: false}) requestViewObj: CreditJobRequestComponent;

    private _dynamicJobRequestId = 0;
    isApplicationBased: boolean;
    isApplicationDetailBased: boolean;
    userInfo: any;
    isSender: boolean;
    canChargeBusiness: boolean;
    jobRequestDetail: any;
    displayTwoFactorAuth: boolean;
    jobApprovalStatus: any;
    jobInvoiceApprovalStatus: any;
    uploadArray: { documentTitle: string; fileName: string; fileExtension: string; physicalFileNumber: string; physicalLocation: string; documentTypeId: string; jobRequestCode: string };
    debitBusiness: boolean;
    isLegal: boolean;
    referBackUploadForm: FormGroup;
    detail: any;
    lmsRData: any;
    untrackedOperation: boolean;
    isLoanManagementSystemDrivenRequest: boolean;
    //jobForm2: FormGroup;
    jobSubTypeClass:any;
    searchModel: JobRequestDetailModel[] = [];
    rmSearchModel: JobRequestDetailModel[] = [];
    jobSubTypeclassId: any;
    jobSubTypeRecord: any;
    userSpecific: boolean;
    jobDestinationUnits: any;
    newUnitId: any;
    applicationReferenceNumber:string = null;
    disableAppraisalMemorandumTab: boolean;
    disableSupportingDocumentsTab: boolean;
    
    
    constructor(
    private loadingService: LoadingService,
    private jobTypeService: RequestJobTypeService,
    private jService: JobService,
    private fb: FormBuilder,
    private loanAppServ: LoanApplicationService,
    private casa: CasaService,
    private countryStateSrv: CountryStateService,
    private authService: AuthenticationService,
    private authorizationService: AuthorizationService, 
    private camService: CreditAppraisalService,
    
    private reviewService: LoanReviewApplicationService,
    ) { }

    ngOnInit() {
        this.clearRequestControls();
        this.getAllStates();
        this. getApprovalStatus();
        const userInfo = this.userInfo = this.authService.getUserInfo();
        //this.systemDate = userInfo.applicationDate;
        //this.username = userInfo.userName;
    }

    // terminateRequest() {
    //     swal('This feature has not been implemented');
    // }

    getAllStates() {
    this.countryStateSrv.getStates().subscribe((response: any) => { 
        this.states = response.result; 
        },);
    }
    getApprovalStatus() {
        this.jService.getJobRequestApprovalStatus().subscribe((response: any) => { 
            let statuses = response.result;
            this.jobApprovalStatus = statuses.filter(x=>x.approvalStatusId != JobRequestStatusEnum.Pending
                && x.approvalStatusId != JobRequestStatusEnum.Processing);
            this.jobInvoiceApprovalStatus = statuses.filter(x=>x.approvalStatusId != JobRequestStatusEnum.Pending
                && x.approvalStatusId != JobRequestStatusEnum.Processing
                && x.approvalStatusId != JobRequestStatusEnum.Cancel);
                this.replyForm.controls['statusId'].setValue(JobRequestStatusEnum.Approved);

            },);
        }

    setVerificationChargeBase(xc) { 
        const casaAccountId = this.rmJobForm.controls['casaAccountId'];
        if (xc){
            this.canChargeBusiness = true;
            casaAccountId.clearValidators();
            casaAccountId.updateValueAndValidity();
            this.debitBusiness = true;
        } 
        else{
            this.canChargeBusiness = false;
            casaAccountId.setValidators(Validators.required);
            casaAccountId.updateValueAndValidity();
            this.debitBusiness = false;
        } 
    }

    getCustomerAccount(id) {
    this.casa.getAllCustomerAccountByCustomerId(id).subscribe((response: any) => { 
        this.customerAccount = response.result; 
        },);
    }

    pipe = new DatePipe('en-US');
    solicitorMail: string ;
    onSelectedStateChange(id) {
        if(this.searchModel.length > 0 && this.searchModel.some(x=>x.stateId != id)){
            swal(
                'Fintrak Credit 360',
                'Another state already has data.',
                'info'
            );
            this.jobForm.controls['stateId'].setValue(this.searchModel[0].stateId);
            return;
        }
        this.selectedSolictor = null;
        this.collateralState = this.states.filter(x=>x.stateId == id);
        this.solicitorMail = '<p><strong>Dear Sir,&nbsp;</strong></p><p><br></p><p>Kindly conduct a comprehensive search on the title document – <strong>DOCUMENT NAME</strong> IN <strong>'+ this.collateralState[0].stateName.toUpperCase() +'</strong> STATE and dated <strong>'+this.pipe.transform(new Date, 'longDate')+'</strong> with a view to determining who is the current holder/owner of the legal estate interest in the property and whether or not the title of the said current holder is free from encumbrance(s) and encroachment(s) of any nature and/or Government acquisition (please note that for this purpose it is sufficient to state that there is no annotation to that effect on the title document/survey plan/land registry file).</p><p><br></p><p>We will be much obliged to receive your report of search and certificate of good title (if applicable) for the attention of the undersigned, within 24 hours.</p><p><br></p><p>Where the search report is favourable, kindly proceed to carry out a charting exercise in respect of the survey plan attached to the title document at the Surveyor General Office to confirm the following:-</p><p>That the property is free from acquisition or revocation of any kind</p><p>That the survey plan is within the right coordinates,</p><p>That the survey plan attached to the title document corresponds/matches with the Surveyor General’s copy and the Assignor’s Survey (where applicable)</p><p>That the address of the Property stated on the Survey Plan is the same with the address stated on the title document. (here we may state the actual addresses for clarity)</p><p>That the survey plan is without any other defect that may lead to queries which may stall or delay subsequent perfection exercises</p><p><br></p><p>Thank you.</p><p><br></p><p>Please acknowledge receipt of this mail.</p><p><br></p><p><br></p><p><br></p>';
        this.jobForm.controls['solicitorMail'].setValue(this.solicitorMail);
        this.jobForm.controls['solicitorId'].setValue(null);
        this.getStateSolicitors(id);
        this.setDefaultCharges();
    }

    showCustomerInformation() {
        this.customerInfo.loadLoanCustomerList(this.loanApplicationId);
    }
    
    getDestinationUnits(jobTypeId) {
        this.jobTypeService.getJobDestinationUnits(jobTypeId).subscribe((res) => {
            this.jobDestinationUnits  = res.result;
        });
    }

    onDepartmentUnitSelect(val){
        var unitName = this.jobDestinationUnits.filter(x=>x.jobTypeUnitId == val)[0].unitName;
        this.newUnitId = val;
        const __this = this;
        swal({
            title: 'Do you want to continue?',
            text: 'This job request will be re-routed to '+ unitName +' and will be invisible to you.',
            type: 'question',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes',
            cancelButtonText: 'No, cancel!',
            confirmButtonClass: 'btn btn-success btn-move',
            cancelButtonClass: 'btn btn-danger',
            buttonsStyling: true,
        }).then(function () {
            
            __this.ReRouteUnit(__this.jobRequestId,__this.newUnitId)
        }, function (dismiss) {
            if (dismiss == 'cancel') {
                __this.newUnitId = null;
                __this.loadingService.hide();
            }
        });
    }

    ReRouteUnit(jobRequestId,jobTypeUnitId){
        let body ={
            jobRequestId : jobRequestId,
            jobTypeUnitId : jobTypeUnitId
        };

        this.loadingService.show();
        this.jobTypeService.ReRouteJobUnit(body).subscribe((res) => {
            if (res.success === true) {
                this.emitClose();
                swal('Fintrak Credit 360', res.message, 'success');
                this.loadingService.hide();
            } 
            else { swal('Fintrak Credit 360', res.message, 'error'); this.loadingService.hide();}
        }, 
        (err: any) => { swal('Fintrak Credit 360', JSON.stringify(err), 'error'); this.loadingService.hide(); });
        
    }

    get dynamicJobRequestId(): number { return this._dynamicJobRequestId; }

    @Input()
    set dynamicJobRequestId(dynamicJobRequestId: number) {
        this._dynamicJobRequestId = dynamicJobRequestId;
        this.tabIndex = 0;
        this.solicitors = null
        this.searchModel  = [];
        if(this.jobData != null) {
            var d = this.jobData.filter(x=>x.jobRequestId == dynamicJobRequestId);
            this.filteredJobData = d[0]; 
            this.applicationReferenceNumber = this.filteredJobData != null ? this.filteredJobData['refNo'] : null;
            // var isReassigned = this.filteredJobData != null ? this.filteredJobData['receiverStaffId'] : 0;
            // var reassignedTo = this.filteredJobData != null ? this.filteredJobData['reassignedTo'] : null;
            // var assignee = this.filteredJobData != null ? this.filteredJobData['assignee'] : null;
            // var assigneeBranch = this.filteredJobData != null ? this.filteredJobData['assigneeBranch'] : null;
            //('this.applicationReferenceNumber',this.applicationReferenceNumber);
            //console.log('this.filteredJobData',this.filteredJobData );
            this.jobRequestCode = this.filteredJobData != null ? this.filteredJobData['jobRequestCode'] : null;
            this.isSender = this.filteredJobData['senderStaffId'] != null && this.filteredJobData['senderStaffId'] != 0;
            this.setJobInitialPropertyValues();
            this.getJobSubType(this.filteredJobData['jobTypeId']);
            this.getDestinationUnits(this.filteredJobData['jobTypeId']);
            if(this.jobSubTypeRecord  != null && this.jobSubTypeRecord  != undefined){
                this.ProcessResponseSettings(this.filteredJobData);
            }
            //this.ProcessResponseSettings(this.filteredJobData);
            
            this.getLegalJobRequestDetail(this.filteredJobData['jobRequestId']);
            this.getJobComments(this.jobRequestId);
            this.getSupportingDocuments(this.jobRequestCode);
           
            if(this.filteredJobData['requestStatusId'] != JobRequestStatusEnum.Pending && this.filteredJobData['requestStatusId'] != JobRequestStatusEnum.Processing) {
                this.isReplied = true;
                this.responseControlNoDataText = 'no-data-div';
            }
            else {
                this.isReplied = false;
            } 
        }
    }

    getLegalJobRequestDetail(jobRequestId){ 
        this.jService.getlegalJobRequestDetailById(jobRequestId).subscribe((response: any) => {
            this.jobRequestDetail = response.result;
            this.jobRequestDetail.forEach(item => {
                var searchModel = {
                    jobSubTypeclassId :  this.jobSubTypeclassId,
                    jobSubTypeclassName: item.jobSubTypeClassName,
                    jobSubTypeId :  0,
                    jobTypeId : 0,
                    amount : item.amount,
                    jobRequestId : item.jobRequestId,
                    accreditedConsultantId :  0,
                    accountNumber :  0,
                    currencyId :  0,
                    description2  : '',
                    stateId : 0
                };
    
                this.rmSearchModel.push(searchModel);
                if(item.jobSubTypeclassId == JobSubTypeClassEnum.CollateralSearch)
                this.rmJobForm.controls['searchAmount'].setValue(item.amount);

                if(item.jobSubTypeclassId == JobSubTypeClassEnum.CollateralCharting)
                this.rmJobForm.controls['chartAmount'].setValue(item.amount);

                if(item.jobSubTypeclassId == JobSubTypeClassEnum.CollateralVerification)
                this.rmJobForm.controls['verificationAmount'].setValue(item.amount);

                if(item.jobSubTypeclassId == JobSubTypeClassEnum.AdditionalCharges)
                this.rmJobForm.controls['additionalChargeAmount'].setValue(item.amount);

                if(item.jobSubTypeclassId == JobSubTypeClassEnum.AdditionalCharges)
                this.rmJobForm.controls['additionalChargeJustification'].setValue(item.description);
            });
        });
    }

    binaryFile: string;
    selectedDocument: string;
    displayDocument: boolean = false;
    myPdfFile: any;
    allowedImageExtensions: Array<any> = []; 
    viewDocument(row) {
        const doc = row;
        this.jService.getSupportingDocumentById(row.documentId).subscribe((response: any) => {
             var binaryFile = response.result[0].fileData;
           // if(this.allowedImageExtensions.find(ext => ext === row.fileExtension) != null){ 
                if ( binaryFile  != null) {
                    this.binaryFile = binaryFile;
                    this.selectedDocument = doc.documentTitle;
                    this.displayDocument = true;
                }
            /*}
            if(row.fileExtension == 'bmp','gif'){

            }
            else {
                const extension =row.fileExtension; // fileName.substr(fileName.lastIndexOf('.') + 1);
                let file = this.createFile(binaryFile, extension, row.fileName)
                if (file !== null) {
                    const fileURL = URL.createObjectURL(file);
                    window.open(fileURL,  this.removeExtension(row.fileName) );
                }
            }*/
        });
    }

    removeExtension(filename): string{
        var lastDotPosition = filename.lastIndexOf(".");
        if (lastDotPosition === -1) return filename;
        else return filename.substr(0, lastDotPosition);
    }

    createFile(binaryFile, extension, fileName): string{
        var byteString = atob(binaryFile);
        var ab = new ArrayBuffer(byteString.length);
        var ia = new Uint8Array(ab);
        for (var i = 0; i < byteString.length; i++) {
            ia[i] = byteString.charCodeAt(i);
        }
        let file = null
        var bb = new Blob([ab]);
        if (extension == 'pdf' || extension == '.pdf') {
            file = new File([bb],fileName, { type: 'application/pdf' });
       }
       if (extension == 'xls' || extension == 'xlsx') {
            file = new File([bb], fileName + '.xlsx', { type: 'application/vnd.ms-excel' });
       }
       if (extension == 'doc' || extension == 'docx') {
            file = new File([bb], fileName + '.doc', { type: 'application/msword' });
       }

       return file;
    }

    ViewAllDocument(pdfFile,pdfFileName,myDocExtention) {
        if (pdfFile != null) {
                var byteString = atob(pdfFile);
                var ab = new ArrayBuffer(byteString.length);
                var ia = new Uint8Array(ab);
                for (var i = 0; i < byteString.length; i++) {
                    ia[i] = byteString.charCodeAt(i);
                }
                var bb = new Blob([ab]);
                if (myDocExtention == 'pdf' || myDocExtention == '.pdf') {
                    var file = new File([bb], pdfFileName + '.pdf', { type: 'application/pdf' });
                }
                // if (this.myDocExtention == 'xls' || this.myDocExtention == 'xlsx') {
                //     var file = new File([bb], this.pdfFileName + '.xlsx', { type: 'application/vnd.ms-excel' });
                // }
                // if (this.myDocExtention == 'doc' || this.myDocExtention == 'docx') {
                //     var file = new File([bb], this.pdfFileName + '.doc', { type: 'application/msword' });
                // }
                window.open(byteString)
        };
    }

    DownloadDocument(row) {
        this.jService.getSupportingDocumentById(row.documentId).subscribe((response: any) => {
            this.binaryFile = response.result[0].fileData;
            if (this.binaryFile!= null) {
                this.selectedDocument = row.documentTitle;
                let myDocExtention = row.fileExtension;
                var byteString = atob(this.binaryFile);
                var ab = new ArrayBuffer(byteString.length);
                var ia = new Uint8Array(ab);
                for (var i = 0; i < byteString.length; i++) {
                    ia[i] = byteString.charCodeAt(i);
                }
                var bb = new Blob([ab]);
                if (myDocExtention == 'jpg' || myDocExtention == 'jpeg') {
                    try {
                        var file = new File([bb], this.selectedDocument + '.jpg', { type: 'image/jpg' });
                        saveAs(file);
                    } catch (err) {
                        var saveFileAsBlob = new Blob([bb], { type: 'image/jpg' });
                        window.navigator.msSaveBlob(saveFileAsBlob, this.selectedDocument + '.jpg');
                    }
                }
                if (myDocExtention == 'png' || myDocExtention == 'png') {
                    try {
                        var file = new File([bb], this.selectedDocument + '.png', { type: 'image/png' });
                        saveAs(file);
                    } catch (err) {
                        var saveFileAsBlob = new Blob([bb], { type: 'image/png' });
                        window.navigator.msSaveBlob(saveFileAsBlob, this.selectedDocument + '.png');
                    }
                }
                if (myDocExtention == 'pdf' || myDocExtention == '.pdf') {
                    try {
                        var file = new File([bb], this.selectedDocument + '.pdf', { type: 'application/pdf' });
                        saveAs(file);
                    } catch (err) {
                        var saveFileAsBlob = new Blob([bb], { type: 'application/pdf' });
                        window.navigator.msSaveBlob(saveFileAsBlob, this.selectedDocument + '.pdf');
                    }
                }
                if (myDocExtention == 'xls' || myDocExtention == 'xlsx') {
                    try {
                        var file = new File([bb], this.selectedDocument + '.xlsx', { type: 'application/vnd.ms-excel' });
                        saveAs(file);
                    } catch (err) {
                        var saveFileAsBlob = new Blob([bb], { type: 'application/vnd.ms-excel' });
                        window.navigator.msSaveBlob(saveFileAsBlob, this.selectedDocument + '.xlsx');
                    }
                }
                if (myDocExtention == 'doc' || myDocExtention == 'docx') {
    
                    try {
                        var file = new File([bb], this.selectedDocument + '.doc', { type: 'application/msword' });
                        saveAs(file);
                    } catch (err) {
                        var saveFileAsBlob = new Blob([bb], { type: 'application/msword' });
                        window.navigator.msSaveBlob(saveFileAsBlob, this.selectedDocument + '.doc');
                    }
                }
            }
        });
    }

    getDocumentDataByDocumentId(documentId): any{
        this.jService.getSupportingDocumentById(documentId).subscribe((response: any) => {
            this.binaryFile = response.result[0].fileData;
        });
    }

    setJobInitialPropertyValues(): any { 
        if(this.filteredJobData != null || this.filteredJobData != undefined){
            this.loggedInStaffId = this.filteredJobData['loggedInStaffId'];
            this.contentSubject = this.filteredJobData['requestTitle'];
            this.contentInfo = this.filteredJobData['senderComment']; 
            this.responseComment = this.filteredJobData['responseComment']; 
            this.fromSender = this.filteredJobData['fromSender'];
            this.to = this.filteredJobData['to'];
            this.branch =this.filteredJobData['fromBranchName']; 
            this.jobRequestId = this.filteredJobData['jobRequestId'];
        }
    }	

    ProcessResponseSettings(data): any { 
        this.loanData = data;
        this.invoiceDiscountDetail = [];
        this.invoiceDiscountItem = [];
        this.showDetailsTab = false;
        this.lastTabText = null;
        this.firstEduDetail = null;
        this.firstTraderDetail = null;
        this.hasCollateral = false;
        this.hasCollateralInxData = false;
        this.hideCollateralDetailsTab = true;
        this.collateralDetailsText = null;
        this.tabIndex = 0;

        if(this.jobSubTypeRecord != null && data != undefined && data != null && this.jobSubTypeRecord[0].requireCharge){
            this.jobCollateralText = this.jobSubTypeRecord[0].jobSubTypeName;
            this.hasCollateral =true;
        }
        
        // if(data != null && data != undefined && data['jobSubTypeId'] == JobSubTypeEnum.CollateralRelated){
        //     this.hasCollateral =true;
        // } 
        if(data != null && data != undefined){
            this.getRequestedJob(data);
        }
        
    }

    getRequestedJob(jobRequestRecord): any {
        this.isLoanManagementSystemDrivenRequest = false;
        if(jobRequestRecord == null || jobRequestRecord == undefined)
        return;

        if(this.invoiceDiscountDetail) this.invoiceDiscountDetail.splice(0, -1);

        if(jobRequestRecord['jobTypeId'] == JobTypeEnum.Legal) {
            this.isLegal = true;
        }
        
        if(this.loanData == null && jobRequestRecord['jobSourceId'] == JobSourceEnum.LMSApplication) {
            this.isLoanManagementSystemDrivenRequest = true;
            this.jService.getLMSRApplicationData(jobRequestRecord['targetId']).subscribe((response: any) => {
                if(response.success){
                    this.lmsRData = response.result;
                    this.camService.getLoanApplicationDetail(this.lmsRData[0]['loanId'], this.lmsRData[0]['loanSystemTypeId']).subscribe((resDetail) => {
                        if(resDetail.success){
                            this.detail = resDetail.result;
                            this.loanAppServ.getLoanApplicationDetailById( this.detail['loanApplicationDetailId']).subscribe((response: any) => {
                                if(response.success){
                                    this.applicationRecord = response.result;
                                    this.loanData = this.applicationRecord[0];
                                    this.getLoanData();
                                }
                            });
                        }
                    });
                }
            });
        }

        if(this.loanData == null && jobRequestRecord['jobSourceId'] == JobSourceEnum.LMSOperationAndApproval ) {
            this.isLoanManagementSystemDrivenRequest = true;
            this.jService.getLMSROperationData(jobRequestRecord['targetId']).subscribe((response: any) => {
                if(response.success){
                    this.lmsRData = response.result;
                    this.camService.getLoanApplicationDetail(this.lmsRData[0]['loanId'], this.lmsRData[0]['loanSystemTypeId']).subscribe((resDetail) => {
                        if(resDetail.success){
                            this.detail = resDetail.result;
                            this.loanAppServ.getLoanApplicationDetailById( this.detail['loanApplicationDetailId']).subscribe((response: any) => {
                                if(response.success){
                                    this.applicationRecord = response.result;
                                    this.loanData = this.applicationRecord[0];
                                    this.getLoanData();
                                }
                            });
                        }
                    });
                }
            });
        }

        if(this.loanData == null && 
            jobRequestRecord['operationsId'] in LMSOperationEnum ) { 
            this.isLoanManagementSystemDrivenRequest = true;
             this.jService.getLMSROperationData(jobRequestRecord['targetId']).subscribe((response: any) => {
                    if(response.success){
                        this.lmsRData = response.result;
                        this.camService.getLoanApplicationDetail(this.lmsRData[0]['loanId'], this.lmsRData[0]['loanSystemTypeId']).subscribe((resDetail) => {
                            if(resDetail.success){
                                this.detail = resDetail.result;
                                this.loanAppServ.getLoanApplicationDetailById( this.detail['loanApplicationDetailId']).subscribe((response: any) => {
                                    if(response.success){
                                        this.applicationRecord = response.result;
                                        this.loanData = this.applicationRecord[0];
                                        this.getLoanData(); 
                                    }
                                });
                            }
                        });
                    }
                });
            // if(jobRequestRecord['operationsId'] == LMSOperationEnum.LoanReviewApprovalAppraisal
            // || jobRequestRecord['operationsId'] == LMSOperationEnum.NPLLoanReviewApprovalAppraisal
            // || jobRequestRecord['operationsId'] == LMSOperationEnum.WriteOffLoanReviewApprovalAppraisal) {
               
            // }
        }

     

        if(this.loanData == null && (jobRequestRecord['jobSourceId'] == JobSourceEnum.ContingentLiabilityBookingAndApproval 
        || jobRequestRecord['jobSourceId'] == JobSourceEnum.LoanBookingAndApproval
        || jobRequestRecord['jobSourceId'] == JobSourceEnum.OverdraftBookingAndApproval)) {
            this.isLoanManagementSystemDrivenRequest = false;
            this.jService.getLOSLoanData(jobRequestRecord['targetId'],jobRequestRecord['operationsId']).subscribe((response: any) => {
                if(response.success){
                    var loanOperationData = response.result;
                    this.camService.getLoanApplicationDetail(loanOperationData[0]['loanId'], loanOperationData[0]['loanSystemTypeId']).subscribe((resDetail) => {
                        if(resDetail.success){
                            this.detail = resDetail.result;
                            this.loanAppServ.getLoanApplicationDetailById( this.detail['loanApplicationDetailId']).subscribe((response: any) => {
                                if(response.success){
                                    this.applicationRecord = response.result;
                                    this.loanData = this.applicationRecord[0];
                                    this.getLoanData();
                                }
                            });
                        }
                    });
                }
            });
        }

        if(jobRequestRecord['operationId'] == null && !this.isLoanManagementSystemDrivenRequest) { 
            this.isApplicationBased = false; 
            this.isApplicationDetailBased = true;
            this.loanApplicationDetailId= jobRequestRecord['targetId'];
            this.loanAppServ.getLoanApplicationDetailById(jobRequestRecord['targetId']).subscribe((response: any) => {
                if(response.success){ 
                    this.applicationRecord = response.result;
                    this.loanData = this.applicationRecord[0];
                    this.getLoanData();
                    if(this.loanData != null && this.loanData.customerId > 0 ) {
                        this.customerInfo.viewSingleCustomerDetails(this.loanData.customerId);
                    }
                }
            });
        }
    }

    getLoanData(){ 
        if(this.loanData != null && this.loanData != undefined) { 
            this.loanApplicationId = this.loanData['loanApplicationId'];

            this.jobDataText = null;
            if(this.hasCollateral ) { 
                this.jobCollateral = this.loanData['loanCollateral']
                this.getCustomerAccount(this.loanData.customerId);
                //this.jobCollateralText ='Collateral'
            }  
            else {
                this.jobCollateralText = null;
                this.jobCollateral =[];
            } 

            // if(this.hasCollateral != true && this.loanData.productClassId === ProductClassEnum.FIRSTRADER && this.loanData['firstTradderDetail'] != null) {
            //     this.jobDataText = 'First Trader Information';
            //     this.firstTraderDetail = this.loanData['firstTradderDetail'];
            // } 
            // else { this.firstTraderDetail = null; }
            //console.debug('loanData', this.loanData);
            //console.debug('invoiceDiscountDetail', this.loanData['invoiceDiscountDetail']);
            if(this.hasCollateral != true &&  this.loanData.productClassId === ProductClassEnum.INVOICEDISCOUNTINGFACILITY && this.loanData['invoiceDiscountDetail'] != null) {
                this.jobDataText = 'Invoice Discounting Information';
                this.invoiceDiscountDetail = this.loanData['invoiceDiscountDetail'];
            } 
            else { this.invoiceDiscountDetail = []; }

            // if(this.hasCollateral != true &&  this.loanData.productClassId === ProductClassEnum.FIRSTEDU && this.loanData['firstEducationtDetail'] != null) {
            //     this.jobDataText = 'First Education Information';
            //     this.firstEduDetail = this.loanData['firstEducationtDetail'];
            // } 
            // else { this.firstEduDetail = null; }
      }
    }

    
    ViewCollateralDetails(index_data) {
        this.collateralDetailsText = "Collateral Details";
        this.hideCollateralDetailsTab = false;
        if(index_data != null) {
         this.showCollateralInformation = true;
            this.collateralCustomerId= index_data.collateralCustomerId;
            this.reload++;
        }
    }
   
    getJobSubType(jobId): any{
        if(jobId != null && jobId > 0){
            this.loadingService.show();
            this.jobTypeService.getJobSubTypes(jobId).subscribe((response: any) => {
                if(response.success ){
                    this.loadingService.hide(1000);
                    this.jobSubTypeData = response.result;
                    if(this.jobSubTypeData[0] != null){ 
                        this.jobSubTypeRecord =  this.jobSubTypeData.filter(x=>x.jobSubTypeId == this.filteredJobData['jobSubTypeId']);
                        this.getJobSubTypeClass( this.jobSubTypeRecord[0].jobSubTypeId);
                        this.ProcessResponseSettings(this.filteredJobData);
                    }
                } else {this.loadingService.hide();}
            });
        }
    }
    getJobSubTypeClass(jobSubTypeId): any{
        if(jobSubTypeId != null && jobSubTypeId > 0) {
            this.jobTypeService.getJobSubTypeClass(jobSubTypeId).subscribe((response: any) => {
                if(response.success){ 
                    this.jobSubTypeClass = response.result;

                }
            });
        }
    }

    getStateSolicitors(stateId): any{
        this.solicitors = null;
        this.jService.getSolicitorsByStateId(stateId).subscribe((response: any) => {
            const consultants = response.result;
            if(consultants != null || consultants != undefined) this.solicitors = consultants.filter(x=>x.accreditedConsultantTypeId == AccreditedConsultantTypeEnum.Solicitor);
        });
    }

    onSelectedSolicitorChange(id){
        this.selectedSolictor = this.solicitors.filter(x=>x.accreditedConsultantId == id);
    }

    setChargeJustification() {
        const additionCharge = this.jobForm.value.additionalChargeAmount; 
        const justify = this.jobForm.controls['additionalChargeJustification'];
        if (additionCharge > 0) { 
            justify.setValidators(Validators.required);
        } else { justify.clearAsyncValidators(); }
    }

    getJobComments(jobRequestId): any {
        this.jService.getJobComments(jobRequestId).subscribe((response: any) => {
            this.jobComments = response.result;
        });
    }

    onSelectedLoanDetail(dat) {
        this.loanData = dat.data;
    }

    getJobStatusFeedback(statusId): any {
        this.jService.getJobStatusFeedback(statusId,this.filteredJobData['jobTypeId']).subscribe((response: any) => {
            this.statusFeedbackList = response.result;    
        });
    }

    onSelectedSearchClass(val){
        this.jobSubTypeclassId = val;
        if(this.collateralState == null) {
            swal(
                'Fintrak Credit 360', 
                'State must be selected',
                'info'
                ); return;
        }

        this.setDefaultCharges();
    }

    setDefaultCharges(){
        var amount = 0.00;
        this.jobForm.controls['searchAmount'].setValue(amount);
        if(this.jobSubTypeclassId == JobSubTypeClassEnum.CollateralCharting)
        {
            let chartAmount = amount = this.collateralState[0].chartingAmount;
            this.jobForm.controls['searchAmount'].setValue(Math.round(chartAmount * 100) / 100);
        }
        if (this.jobSubTypeclassId == JobSubTypeClassEnum.CollateralVerification) 
        { 
            let verificationAmount = amount = this.collateralState[0].verificationAmount; 
            this.jobForm.controls['searchAmount'].setValue(Math.round(verificationAmount * 100) / 100,2 );
        }
        if (this.jobSubTypeclassId == JobSubTypeClassEnum.CollateralSearch) 
        { 
            let searchAmount = amount = this.collateralState[0].collateralSearchChargeAmount;
            this.jobForm.controls['searchAmount'].setValue(Math.round(searchAmount * 100) / 100);
        }

        if(amount == 0){
            var jobSubTypeClassRecord = this.jobSubTypeClass.filter(x=>x.jobSubTypeclassId == this.jobSubTypeclassId)[0];
            if(jobSubTypeClassRecord != null && jobSubTypeClassRecord.defaultChargeAmount > 0) {
                this.jobForm.controls['searchAmount'].setValue(Math.round(jobSubTypeClassRecord.defaultChargeAmount * 100) / 100);
            }
        }
    }

    AddCharge(){
        if(this.jobForm.value.searchAmount > 0){
            if(this.searchModel.some(x=>x.jobSubTypeclassId == this.jobSubTypeclassId)){
                swal(
                    'Fintrak Credit 360', 
                    'Only one search entry allowed for each search option.',
                    'info'
                    );  
                    this.jobForm.controls['jobSubTypeClassId'].setValue(null); 
                    return;
            } 
            if(this.jobForm.value.solicitorId <= 0 ){
                swal(
                    'Fintrak Credit 360', 
                    'Select a solicitor',
                    'info'
                    );  
                    this.jobForm.controls['jobSubTypeClassId'].setValue(null); 
                    return;
            }
            var jobSubTypeClassRecord = this.jobSubTypeClass.filter(x=>x.jobSubTypeclassId == this.jobSubTypeclassId)[0];
            var searchModel = {
                jobSubTypeclassId :  this.jobSubTypeclassId,
                jobSubTypeclassName: jobSubTypeClassRecord.jobSubTypeclassName,
                jobSubTypeId :  0,
                jobTypeId : 0,
                amount : this.jobForm.value.searchAmount,
                jobRequestId : this.jobRequestId,
                accreditedConsultantId :  this.jobForm.value.solicitorId,
                accountNumber :  0,
                currencyId :  0,
                description2  : this.jobForm.value.solicitorMail,
                stateId : this.jobForm.value.stateId
            };

            this.searchModel.push(searchModel);
            this.jobForm.controls['searchAmount'].setValue(null);
            return;

        }
        swal(
            'Fintrak Credit 360', 
            'Enter the search amount',
            'error'
            );
    }

    SaveCollateralSearchInstruction() {
        this.loadingService.show();
        if(this.jobForm.value.solicitorMail == null || this.jobForm.value.solicitorMail == undefined){
            swal(
                'Fintrak Credit 360',
                'The Solicitor Email Message Box is empty',
                'error'
                );
            return;
        }
        if(this.searchModel.length <= 0){
            swal(
                'Fintrak Credit 360',
                'At least one search type must be defined.',
                'error'
                );
        }
        const body = {
            additionalChargeJustification: this.jobForm.value.additionalChargeJustification,
            collateralStateId : this.jobForm.value.stateId,
            solicitorId : this.jobForm.value.solicitorId,
            jobRequestId : this.jobRequestId,
            description2 : this.jobForm.value.solicitorMail,
            searchDetails : this.searchModel
            //casaAccountId : this.jobForm.value.casaAccountId
        }; 

        this.jService.saveCollateralLegalInstructions(body).subscribe((res) => {
            if (res.success === true) {
                this.displayResponseWindow = false;
                swal(
                    'Fintrak Credit 360',
                     res.message, 
                     'success'
                     );
                this.emitClose();
            } 
            else { 
                swal(
                    'Fintrak Credit 360', 
                    res.message, 
                    'error'); 
                }

            this.loadingService.hide();
        }, (err: any) => {
            swal('Fintrak Credit 360', JSON.stringify(err), 'warning');
            this.loadingService.hide();
        });
        this.loadingService.hide();
    }

    removeSearchFee(evt, indx) {
        evt.preventDefault();
        let currRecord = this.searchModel[indx];
        this.searchModel.splice(indx, 1);
    }

    promptToGoForApproval() { 
        this.authorizationService.twoFactorAuthEnabled().subscribe((res) => {
            if (res.result == true) {
                
                if(res.userSpecific) { this.userSpecific = true;}
                else { this.userSpecific = false;}

                this.displayTwoFactorAuth = true;
                this.loadingService.hide();
            } else {
                this.DebitAccountWithLegalFees();
            }
        }, (err) => {
            swal(`${GlobalConfig.APPLICATION_NAME}`, JSON.stringify(err), 'error');
            this.loadingService.hide();
        });
    }

    DebitAccountWithLegalFees() {
        this.loadingService.show();
        const body = {
            jobRequestId : this.jobRequestId,
            feeNarration :  this.rmJobForm.value.feeNarration,
            casaAccountId : this.rmJobForm.value.casaAccountId,
            isInitiation: true,
            userName: this.twoFactorAuthStaffCode,
            passCode: this.twoFactorAuthPassCode,
            debitBusiness: this.debitBusiness,
            jobSubTypeId: this.filteredJobData['jobSubTypeId']
        }; 
        this.jService.DebitAccountWithLegalFees(body).subscribe((res) => {
            if (res.success === true) {
                this.displayResponseWindow = false;
                swal(
                    'Fintrak Credit 360',
                     res.message, 
                     'success'
                     );
                this.filteredJobData['hasLegalRecommendedSearch'] = true;
                this.filteredJobData['customerCharged'] = true;
            } 
            else { 
                swal(
                    'Fintrak Credit 360',
                     res.message, 
                     'error'
                     ); 
            }
            this.loadingService.hide();
        }, (err: any) => {
            swal(
                'Fintrak Credit 360',
                 JSON.stringify(err), 
                 'warning'
                 );
            this.loadingService.hide();
        });
        //this.loadingService.hide();
    }
    
    isGlobalRejection: boolean;
    onApprovalStatusChange(inval, isGlobalRejection: boolean,row){
        this.isGlobalRejection = isGlobalRejection; 
        this.statusApprovalId = inval;  
        if(inval == JobRequestStatusEnum.Disapproved || inval == JobRequestStatusEnum.Cancel ){
            this.getJobStatusFeedback(inval);
            this.isRejection  = true;
            if(!this.isGlobalRejection)this.displayStatusFeedbackList = true; 
        } 
        else if(inval == JobRequestStatusEnum.Approved && !isGlobalRejection){
            this.isRejection  = false;
            this.updateJobRequestForInvoiceStatus(true,null,row.invoiceId);
        }     
        else if(inval == JobRequestStatusEnum.Approved && isGlobalRejection){
            this.isRejection  = false;
        }     
    }

    rejectionFeedbackId: any;
    logRejectionStatus(form){
        let feedBackId = form.value.feedBackId;
        if(!this.isGlobalRejection){
            this.updateJobRequestForInvoiceStatus(false, feedBackId,null);
        } else this.displayStatusFeedbackList = false;
    }

    updateJobRequestForInvoiceStatus(status,rejectionId,invoiceId) { 
        let body = {
            status : status,
            rejectionId : rejectionId,
            jobRequestId : this.jobRequestId,
            invoiceId : invoiceId
        }
        this.loadingService.show();
        this.jService.updateJobRequestForInvoiceSatus(body).subscribe((res) => {
            if (res.success === true) {
                swal('', res.message, 'success');
                this.displayStatusFeedbackList = false;
            } 
            else { 
                swal('', res.message, 'error'); 
                this.displayStatusFeedbackList = false;
            }
            this.loadingService.hide();
        }, (err: any) => {
            swal('', JSON.stringify(err), 'warning');
            this.loadingService.hide();
        });
        this.loadingService.hide();
    }

    onSelectedInvoiceItem(dat){
        this.invoiceDiscountItem = dat.data;
        this.invoiceDiscountItem.length > 0 ? this.showDetailsTab = true : this.showDetailsTab = false;
        this.invoiceSelected = true;
        this.lastTabText = 'INVOICE DISCOUNTING DETAIL';

    } 

    acknowledgeJob() {

    }

    clearRequestControls() {
        this.replyForm = this.fb.group({
            responseComment: ['', Validators.required],
            // requestSubject: ['', Validators.required],
            description: [''],
            jobSubTypeId: [''],
            disapprove: [''],
            fileInput: [''],
            statusId: ['',Validators.required],
            feedBackId: [''],
            uploadFileTitle: ['']
        });

        this.invoiceFeedbackForm = this.fb.group({
            //invoiceComment: ['', Validators.required],
            feedBackId: ['', Validators.required]
        });
        
        this.referBackUploadForm = this.fb.group({
            uploadFileTitle: ['', Validators.required],
            fileInput: ['', Validators.required]
        });

        this.commentForm = this.fb.group({
            comment: ['', Validators.required],
        });

        // this.jobForm = this.fb.group({
        //     stateId: ['', Validators.required],
        //     solicitorId: ['', Validators.required],
        //     additionalChargeAmount: [''],
        //     additionalChargeJustification: [''],
        //     verificationAmount: [''],
        //     searchAmount: ['',Validators.required],
        //     chartAmount: [''],
        //     solicitorMail: [''],
        // });
        this.jobForm = this.fb.group({
            stateId: ['', Validators.required],
            solicitorId: ['', Validators.required],
            searchAmount: ['',Validators.required],
            jobSubTypeClassId: ['',Validators.required],
            solicitorMail: [''],
        });

        this.rmJobForm = this.fb.group({
            additionalChargeAmount: [''],
            additionalChargeJustification: [''],
            casaAccountId: ['',Validators.required],
            verificationAmount: [''],
            searchAmount: [''],
            feeNarration: ['', Validators.required],
            chartAmount: [''],
        });
    }

    validateUpload(){
        if (this.file != undefined && this.file != null && this.uploadFileTitle != null) {
            this.uploadArray = {
                documentTitle: this.uploadFileTitle,
                fileName: this.file ? this.file.name : '',
                fileExtension: this.file ? this.fileExtention(this.file.name) : '',
                jobRequestCode : this.jobRequestCode,
                physicalFileNumber: 'n/a',
                physicalLocation: 'n/a',
                documentTypeId: '1',
            } 
            const description = this.replyForm.controls['description'];
            if(this.uploadFileTitle == null){
                swal('Fintrak Credit 360','Document description required','warning');
                //description.setValidators(Validators.required);
                //description.updateValueAndValidity();
                return;
            }
            
            this.saveDocument();
            //description.clearValidators();
            //description.updateValueAndValidity();
            this.uploadArray = null;
            this.file = null;
            this.uploadFileTitle = null;
            //swal('Upload Request',this.uploadArray.fileName + this.uploadArray.fileExtension + ' loaded', 'info');
            
        } else { swal('Upload Request','File Upload failed', 'info'); }
    }

    saveDocument(){
        this.loadingService.show();
        this.jService.uploadFileOnly(this.file,this.uploadArray).then((val: any) => {
            if (val.success) {
                this.uploadFileTitle = null;
                //this.emitClose();
                swal('Request', val.message, 'success');
                this.getSupportingDocuments(this.jobRequestCode);
                this.loadingService.hide();
            }
            else {
                swal('Request', val.message, 'warning');
                this.loadingService.hide();
            }
            return true;
        }, (error) => {
            swal('Upload Request', JSON.stringify(error), 'error');
            this.loadingService.hide();
        });
    }

    validateReferBackUpload(){
        if (this.file != undefined && this.file != null && this.uploadFileTitle != null) {
            this.uploadArray = {
                documentTitle: this.uploadFileTitle,
                fileName: this.file ? this.file.name : '',
                fileExtension: this.file ? this.fileExtention(this.file.name) : '',
                jobRequestCode : this.jobRequestCode,
                physicalFileNumber: 'n/a',
                physicalLocation: 'n/a',
                documentTypeId: '1',
            } 
            const description = this.replyForm.controls['description'];
            if(this.uploadFileTitle == null){
                swal('Fintrak Credit 360','Document description required','warning');
                return;
            }
            
            this.saveDocument();
            //description.clearValidators();
            //description.updateValueAndValidity();
            this.uploadArray = null;
            this.file = null;
            this.uploadFileTitle = null;
            //swal('Upload Request',this.uploadArray.fileName + this.uploadArray.fileExtension + ' loaded', 'info');
            
        } else { swal('Upload Request','File Upload failed', 'info'); }
    }

    clearCommentForm(){
        this.commentForm = this.fb.group({
            comment: ['', Validators.required],
        });
    }

    checked: boolean = true;

    reply: any = {
        id: null,
        senderComment: '',
        fromSender: '',
        reassignedTo: '',
    };

    openSearchBox(): void {
        this.displaySearchModal = true; 
    }

    reassignJobRequest(index) {
        this.clearRequestControls();
        var row = this.jobRequests[index];
        this.reply = {
            fromSender: row.fromSender,
            senderComment: row.senderComment,
        };
        this.reply.id = row.jobRequestId;
        this.displayReassignForm = true;
    }

    emitClose(){
        this.tabIndex = 0;
        // this.displayOption.emit(true);
        this.displayOption.emit('Close');
        this.jobRequests = [];
        // const docDescription = this.replyForm.controls['subSectorId'];
        // const fileInputText = this.replyForm.get('fileInput'); 
    }

    setRequireAdditionalDescription(ev) { 
        const additionalChargeJustification = this.jobForm.controls['additionalChargeJustification'];
        if(ev != null && ev != undefined && ev > 0) {
            
            additionalChargeJustification.setValidators(Validators.required);
            additionalChargeJustification.updateValueAndValidity();
        }
        else{
            additionalChargeJustification.clearValidators();
            additionalChargeJustification.updateValueAndValidity();
        }
        
    }

    emitCloseNoRefresh(){
        this.tabIndex = 0;
        this.displayOptionNoRefresh.emit(true);
        this.jobRequests = [];
    }

    replyJobRequest(form) { 
        const loggedInStaffId =  this.filteredJobData['loggedInStaffId'];
        const reassignedTo =    this.filteredJobData['reassignedTo'];
        const isReassigned =    this.filteredJobData['isReassigned'];
        const receiverStaffId =    this.filteredJobData['receiverStaffId'];

        const __this = this;
        swal({
            title: 'Do you want to continue?',
            text: 'Note: responding to this request will complete the process. '+'\n' + 'You can make use of the refer-back tab.',
            type: 'question',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes',
            cancelButtonText: 'No, cancel!',
            confirmButtonClass: 'btn btn-success btn-move',
            cancelButtonClass: 'btn btn-danger',
            buttonsStyling: true,
        }).then(function () {
            if(isReassigned == true && reassignedTo != loggedInStaffId){
                swal('Fintrak Credit 360', 'You cannot respond to this request. '+'\n'+'Job is reasigned to a different staff', 'info');
                return;
            }
            else if(receiverStaffId != null  && receiverStaffId != loggedInStaffId ){
                swal('Fintrak Credit 360', 'You cannot respond to this request. '+'\n'+'Job is already asigned to a different staff', 'info');
                return;
            }
            if (__this.file != undefined && __this.uploadFileTitle != null) { 
                __this.saveReplyWithFile(form);
            }
            else { 
                __this.saveReplyInfo(form);
            }
        }, function (dismiss) {
            if (dismiss == 'cancel') {
                swal('Fintrak Credit 360', 'Operation cancelled', 'error');
                __this.loadingService.hide();
            }
        });
    }

    @ViewChild('fileInput', {static: false}) fileInput: any;
    saveReplyWithFile(form) {
        let body = {
            responseComment: form.value.responseComment,
            statusId :form.value.statusId, 
            rejectionReasonId: form.value.feedBackId,
            jobRequestCode: this.jobRequestCode,
            documentTitle: this.uploadFileTitle,
            fileName: this.file != null ? this.file.name : '',
            fileExtension: this.file != null ? this.fileExtention(this.file.name) : '',
            physicalFileNumber: 'n/a',
            physicalLocation: 'n/a',
            documentTypeId: '1', 
        };
        
        this.loadingService.show();
        this.jService.replyAnduploadFile(this.file, body).then((val: any) => {
            if(val.success) {
                this.uploadFileTitle = null;
                this.fileInput.nativeElement.value = "";
                this.emitClose();
                swal('Request', val.message , 'success');
            }
            else {
                swal('Request', val.message , 'error');
            }
            
            this.loadingService.hide();
        }, (error) => {
            swal('Upload Request', error , 'error');
            return false;
        });
        return true;
    }

    saveReplyInfo(form) {
        let body = {
            responseComment: form.value.responseComment,
            statusId :form.value.statusId, 
            rejectionReasonId: form.value.feedBackId,
        };
        
        this.loadingService.show();
        this.jService.updateJobRequestReply(body, this.jobRequestId).subscribe((res) => {
            if (res.success == true) {
                this.displayResponseWindow = false; 
                this.emitClose();
                swal('',res.message,"success");
            } else {
                swal('',res.message,"error");
            }
            this.loadingService.hide();
        }, (err: any) => {
            swal('',JSON.stringify(err),'warning');
        });
        this.getJobComments(this.jobRequestId);
        //this.saveCompleted.emit(true);

        this.emitClose();
    }

    getSupportingDocuments(jobRequestCode: any) {
        this.jService.getSupportingDocumentByJobRequestCode(jobRequestCode).subscribe((response: any) => {
            this.supportingDocuments = response.result;
            if(this.supportingDocuments.length > 0){
                this.showDocumentGrid = true; 
            }
            let doctype = this.supportingDocuments.values;
        });
    }

    onFileChange(event) {
        this.files = event.target.files;
        this.file = this.files[0];
        //const docDescription = this.replyForm.get('description');
        //docDescription.setValidators(Validators.required); 
    }

    mandateFileAttachment(){
        const fileInputText = this.replyForm.get('fileInput');
        fileInputText.setValidators(Validators.required);
    }

    fileExtention(name: string) {
        var regex = /(?:\.([^.]+))?$/;
        return regex.exec(name)[1];
    }

    submitCommentForm(form) {
        this.loadingService.show();
        let body = {
            message: form.value.comment,
            jobRequestId: this.jobRequestId
        };
        this.jService.saveJobComment(body,).subscribe((res) => {
            if (res.success == true) {
                //this.displayCommentWindow = false;
                swal('',res.message,"success");
                this.getJobComments(this.jobRequestId);
                this.clearCommentForm();
            } else {
                swal('',res.message,"warning");
            }
            this.loadingService.hide();
        }, (err: any) => {
            swal('',JSON.stringify(err),"error");
        });
    }

    onSelectedBondItem(e){}
    
    hideMessage(event) {
        this.show = false;
    }

}