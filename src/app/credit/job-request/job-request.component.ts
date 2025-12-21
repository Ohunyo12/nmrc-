import { saveAs } from 'file-saver';
import { LoadingService } from '../../shared/services/loading.service';
import { FormGroup, Validators, FormBuilder, FormControl } from '@angular/forms';
import { Component, Input, Output, EventEmitter, OnInit, ViewChild } from '@angular/core';
import { Subject } from 'rxjs';
import swal from 'sweetalert2';
import { Customer } from '../../customer/models/customer';
import { JobService } from "../services/job.service";
import { RequestJobTypeService } from '../../setup/services/request-job-type.service';
import { DepartmentService } from '../../setup/services/department.service';
import { JobSubTypeEnum, JobTypeEnum, JobTypeUnitEnum, GlobalConfig } from '../../shared/constant/app.constant';
import { GeneralSetupService } from '../../setup/services/general-setup.service';
import { StaffRealTimeSearchService } from 'app/setup/services';


@Component({
    selector: 'job-request-template',
    templateUrl: 'job-request.component.html',
    styleUrls: [`./job-request.component.css`]
})

export class JobRequestComponent implements OnInit {
    targetStaffStaffId = null;
    displaykyc = false;
    displaySearchModal = false;
    show = false;
    message: any;
    title: any;
    cssClass: any;
    customers: any;
    customer: Customer;
    officers: any[];
    selectedItem: any = {};
    searchResults: Object;
    searchTerm$ = new Subject<any>();
    searchDepartmentUnitId$: number = 0;
    customerId: any;
    customerTypes = [];
    selectedCustomer: any = {};
    documentTitle: string;
    displayJobRequest = false;
    jobTypes: any[] = [];
    jobSubTypeData: any[] = [];
    departmentUnits: any[] = [];
    filteredList: any[] = [];
    staffList: any[] = [];
    query: string;
    queryTwo: string;
    jobRequestForm: FormGroup;
    requireDocument = false;
    len: any[] = [];
    documentType: any[];
    binaryFile: string;
    selectedDocument: string;
    displayDocument: boolean = false;
    myPdfFile: any;
    allDepartment: any[] = [];
    jobDepartments: any[] = [];
    jobRequests: any;
    filteredStaffDepartment: any = {};
    departmentUnitsData: any = {};
    documentTypeName: string;
    uploadFileTitle: string = null;
    files: FileList;
    file: File;
    supportingDocuments: any[] = [];
    tdsize: string;
    borderValue: string;
    hideableDocValue: string = "hide";
    showDocumentGrid: boolean = false;
    staffDepartmentId: number;
    departmentStaffId: number;
    toEmail: string;
    toEmailVisibilityString: string = 'hide';
    receiverStaffVisibilityString: string = 'hide';
    departmentName: string;
    displayReviewTab: boolean = true;
    operations: any[] = [];
    isLegalSearch: boolean = false;
    showBusinessChargeCheckbox = 'hide';
    canChargeBusiness = false;
    buttonVisibilityText = null;
    jobRequestCode: string;
    displaySupportingDocument: boolean = false;
    

    //Output Event emmitter definition consumed during loan Booking
    @Output() notify: EventEmitter<any> = new EventEmitter<string>();
    @Output() displayOption: EventEmitter<any> = new EventEmitter<string>();
    @Output() displayOptionNoRefresh: EventEmitter<any> = new EventEmitter<string>();



    @Input() isLMS: boolean = false;

    @Input() pageHeaderTitle: string;
    @Input() hideableClassValue: string = "";
    @Input() isReassigned: boolean;
    @Input() isAcknowledged: boolean;
    @Input() targetId: number;
    @Input() requestComment: number;
    @Input() operationsId: number;
    @Input() operationTypeName: number;
    @Input() requestStatusId: number = 1;
    @Input() operationAvailable: boolean = true;
    @Input() hideCloseButton: boolean = false;
    @Input() jobSourceId: number;
    @ViewChild('fileInput', {static: false}) fileInput: any;
    @Input() moduleId: number;
    @Input() moduleReferenceNumber: number;
    @Input() isApplicationLevel: boolean;
    @Input() canSearchTargetStaff: boolean;
    @Input() useFacilityDropdownToDetermineTarget: boolean;
    @Input() facilityList: any;
    @Input() onPage: boolean = false;
    collateralItem: any;
    lenPlacing: boolean;
    displayMap: boolean;
    jobCode: any;
    filteredSubsector: any;
    operationId: any;
    subsector: any;
    sector: any;
    secondArea: any = null;
    firstArea: any = true;
    thirdArea: any = null;
    messageContent: any;
    subjectContent: any;
    uploadArray: { documentTitle: string; fileName: string; fileExtension: string; jobRequestCode: any; physicalFileNumber: string; physicalLocation: string; documentTypeId: string; };
    responseMessage: any;
    autoSaveUsed: any = null;
    jobTypeHub: any;
    jobDestinationUnits: any;
    searchedName: any;
    reassignedTo: any;
    
    //...........End of Input variables 

    constructor(
        private departmentSer: DepartmentService,
        private fb: FormBuilder,
        private jService: JobService,
        private genSrv: GeneralSetupService,
        private jobTypeService: RequestJobTypeService,
        private realSearchSrv: StaffRealTimeSearchService,
        private loadingSrv: LoadingService) {
            this.realSearchSrv.search(this.searchTerm$).subscribe(results => {
                if (results != null) {
                    this.searchResults = results.result; 
                }
            });
    }

    ngOnInit() {
        // this.loadingSrv.show();
        this.loadDropdowns();
        this.InitJobRequestForm();
        this.getAlloperations();
        // this.loadingSrv.hide();

        if (this.operationsId > 0) {
            this.operationAvailable = true
            this.jobRequestForm.controls['operationId'].setValue(this.operationsId ? this.operationsId : this.operationsId);
        }

        if (this.hideCloseButton) this.buttonVisibilityText = 'hide';
        else this.buttonVisibilityText = null;
    }

    openSearchBox(): void {
        this.displaySearchModal = true;
    }

    pickSearchedData(data) {
        this.searchedName = data.fullName;
        this.jobRequestForm.controls['receiverStaffId'].setValue(data.staffId);
        this.targetStaffStaffId = data.staffId;
        this.reassignedTo = data.staffId;
        this.isReassigned = true;
        this.displaySearchModal = false;
    }

    searchDB(searchString) {
        searchString.preventDefault;
        this.searchTerm$.next(searchString);
    }

    setVerificationChargeBase(xc) {
        if (xc) this.canChargeBusiness = true;
        else this.canChargeBusiness = false;
    }

    // getAllJobRequest(): void {
    //     this.jService.getJobRequestByDepartment().subscribe((response: any) => {
    //         this.jobRequests = response.result;
    //         this.notify.emit(this.jobRequests);
    //     });
    // }

    loadDropdowns() {
        this.GetFilteredSubsector();
        this.getAllDepartments();

        this.jService.getSector().subscribe((response: any) => this.sector = response.result);
        this.jService.getSubSector().subscribe((response: any) => this.subsector = response.result);
        this.jobTypeService.getJobTypes().subscribe((response: any) => {
            this.jobTypes = response.result;
        });
    }

    legalTemplate: string = '<h1>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; COLLATERAL SEARCH</h1><p><strong>Dear Legal Team,</strong></p><p><br></p><p>Kindly accede to our collateral search request for the property with the following details:</p> <p><br></p> <p>Customer&apos;s name: </p><p>Property Type:</p><p>Property Description:</p><p>Property Registration Number: </p><p>City:</p><p><br></p><p>Your prompt response will be highly appreciated.</p><p><br></p>';

    onRequestTypeChange(jobId): any {
        this.jobTypeService.getJobSubTypes(jobId).subscribe((response: any) => {
            this.jobSubTypeData = response.result;
        });
        this.getJobDepartments(jobId);
        this.getDestinationUnits(jobId);
        if(jobId ==  JobTypeEnum.Others) {this.canSearchTargetStaff = true;}
        else { this.canSearchTargetStaff = false;}
    }

    onJobSubTypeChange(jobId): any {
        const senderComment = this.jobRequestForm.controls['senderComment'];
        if (jobId != null || jobId > 0) {
            var jobType = this.jobTypes.filter(x => x.jobTypeId == jobId)[0];
            if (jobType != null && jobType.jobTypeId === JobSubTypeEnum.CollateralRelated) {
                senderComment.setValue(this.legalTemplate);
                this.isLegalSearch = true;
            }
            else { this.isLegalSearch = false; senderComment.setValue(null); }
        }

        if(jobId == JobSubTypeEnum.OtherJobTypeOtherSubType){
            const departmentUnitId = this.jobRequestForm.controls['departmentUnitId'];
            departmentUnitId.clearValidators();
            departmentUnitId.updateValueAndValidity();
        }
        if(jobId == JobSubTypeEnum.BondsAndGauranteeVetting){
            this.jobRequestForm.controls['departmentUnitId'].setValue(JobTypeUnitEnum.LegalService);
        }
    }

    getAlloperations(): any {
        this.genSrv.getAllOperations().subscribe((response: any) => {
            this.operations = response.result;
        });
    }

    validateSelectedOperations(indx): any {
        var lookupId = this.operations.filter(x => x.lookupId == indx)[0].lookupId
        this.operationId = lookupId;
    }

    changeTargetId(targetId): any { this.targetId = targetId;}

    GetFilteredSubsector() {
        this.filteredSubsector = [];
        this.jService.getSubSector().subscribe((response: any) => {
            this.filteredSubsector = response.result;
        });
    }

    next() { 
        const __this = this;
        if (__this.secondArea == true) {
            if(__this.requireDocument) {
                swal({
                    title: 'Do you want to continue?',
                    text: 'You are about to upload document for this request. Click yes to continue',
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
                    __this.secondArea = null;
                    __this.thirdArea = true;
                    __this.saveJobRequest(__this.jobRequestForm);
                    __this.autoSaveUsed = true;
                    __this.messageContent = __this.jobRequestForm.value.senderComment;
                    __this.subjectContent = __this.jobRequestForm.value.requestSubject;
                }, function (dismiss) {
                    if (dismiss == 'cancel') {
                        swal('Fintrak Credit 360', 'Request cancelled', 'error');
                        __this.emitClose();
                    }
                });
            }
            
            else {
                 __this.thirdArea = null;
                 __this.secondArea = null;
                __this.messageContent = __this.jobRequestForm.value.senderComment;
                __this.subjectContent = __this.jobRequestForm.value.requestSubject;
            }
        }
        
        else if (__this.secondArea === null) {
            __this.secondArea = true;
            __this.firstArea = null;
            __this.thirdArea = null;
        } 
    }

    previous() {
        if (this.secondArea === true) {
            this.resetAccordion();
        }
        else if (this.thirdArea === true) {
            this.secondArea = true;
            this.firstArea = null;
            this.thirdArea = null;
        }
        this.messageContent = this.jobRequestForm.value.senderComment;
        this.subjectContent = this.jobRequestForm.value.requestSubject;
    }

    buildData(form): any{
        let body = {
            jobTypeId: form.value.jobTypeId,
            jobSubTypeId: form.value.jobSubTypeId,
            receiverStaffId: this.targetStaffStaffId,
            reassignedTo : this.reassignedTo,
            departmentId: form.value.departmentId,
            departmentUnitId: form.value.departmentUnitId,
            requestTitle: form.value.requestSubject,
            senderComment: form.value.senderComment,
            isReassigned: this.isReassigned,
            isAcknowledged: this.isAcknowledged,
            targetId: this.targetId,
            jobSourceId : this.jobSourceId,
            operationsId: form.value.operationId,
            operationId: form.value.operationId,
            requestStatusId: this.requestStatusId,
            isApplicationLevel : this.isApplicationLevel,
            moduleId: this.moduleId,
            moduleReferenceNumber: this.moduleReferenceNumber,
            jobRequestCode: this.jobRequestCode,
            documentTitle: this.uploadFileTitle,
            fileName: this.file ? this.file.name : null,
            fileExtension: this.file ? this.fileExtention(this.file.name) : null,
            physicalFileNumber: 'n/a',
            physicalLocation: 'n/a',
            documentTypeId: '1',
            documentList : this.documentList,
        }; return body; 

    }
    saveJobRequest(form) {
        let body = this.buildData(form);
        this.loadingSrv.show();
        this.jService.saveJobRequest(body).subscribe((res) => {
            if (res.success === true) {
                this.jobCode = res.result;
                if(!this.requireDocument){
                    this.emitClose();
                    //this.getAllJobRequest();
                    //this.jobRequestForm.reset();
                    swal('Request', res.message, 'success');
                    this.getSupportingDocuments(this.jobRequestCode);
                }
                this.responseMessage = res.message;
                this.loadingSrv.hide();
            } else {
                swal('Request', res.message, 'error');
                this.loadingSrv.hide();
                //this.getSupportingDocuments(this.jobRequestCode);
            }
        }, (err: any) => {
            swal('Request', JSON.stringify(err), 'error');
            this.loadingSrv.hide();
        });
    }

    sendRequest(form) {
        let body = this.buildData(form);
        this.loadingSrv.show();
        if(!this.requireDocument){ 
            //... NON DOCUMENT RELATED REQUEST...
            this.jService.saveJobRequest(body).subscribe((res) => {
                if (res.success === true) {
                    this.jobRequestCode = this.jobCode = res.result;
                    this.emitClose();
                    //this.getAllJobRequest();
                    //this.jobRequestForm.reset();
                    swal('Fintrak Credit 360', res.message, 'success');
                    this.loadingSrv.hide();
                } 
                else { swal('Fintrak Credit 360', res.message, 'error'); this.loadingSrv.hide();}
            }, 
            (err: any) => { swal('Fintrak Credit 360', JSON.stringify(err), 'error'); this.loadingSrv.hide(); });
        }
        //...END OF NON DOCUMENT RELATED REQUEST...
        else { 
            swal(
                'Fintrak Credit 360', 
                this.responseMessage, 
                'success'
                ); 
                this.loadingSrv.hide(); 
                this.emitClose(); 
            }
    }

    documentList:  any;
    saveDocument(){
        const uploadFileTitle = this.jobRequestForm.controls['uploadFileTitle'];
        this.loadingSrv.show();
        this.jService.uploadFileOnly(this.file,this.uploadArray).then((val: any) => {
            if (val.success) {
                this.uploadFileTitle = null;
                this.file = null
                this.getSupportingDocuments(this.jobCode);
                this.loadingSrv.hide();
            }
            else { swal('Request', val.message, 'warning'); this.loadingSrv.hide(); }
        }, (error) => { swal('Upload Request', JSON.stringify(error), 'error'); this.loadingSrv.hide(); });
    }

    onFileChange(event) { 
        this.files = event.target.files;
        this.file = this.files[0];
    }

    uploadArrays: any[] =[];
    acceptedExtention: Array<any> = ['docx','pdf','jpg','jpeg','png','txt','xlsx','xls','doc','xml'];
    validateUpload() { 
        if ((this.file != undefined || this.file != null ) && this.uploadFileTitle != null) {

            let fileExtension = this.fileExtention(this.file.name);      
            if(this.acceptedExtention.find(ob => ob === fileExtension)== null) {
             swal(`${GlobalConfig.APPLICATION_NAME}`, 'Please Upload Files with Accepted Extentions ' + this.acceptedExtention , 'warning');
             return;
            }
            
            this.uploadArray = {
                documentTitle: this.uploadFileTitle,
                fileName: this.file.name,
                fileExtension: this.fileExtention(this.file.name),
                jobRequestCode : this.jobCode,
                physicalFileNumber: 'n/a',
                physicalLocation: 'n/a',
                documentTypeId: '1',
            }; 
            this.saveDocument();
            swal('Upload Request', this.uploadArray.fileName + ' attached', 'info');
        } else { swal('Upload Request', 'File Upload failed', 'info'); }
    }

    addDocument(ans) {
        const uploadFileTitle = this.jobRequestForm.controls['uploadFileTitle'];
        const fileInput = this.jobRequestForm.controls['fileInput'];
        if(ans)
        {
            this.requireDocument = true;
            //if(this.supportingDocuments.length <= 0) uploadFileTitle.setValidators(Validators.required);  
        } 
        else
        {
            this.requireDocument = false;
            uploadFileTitle.clearValidators();
            uploadFileTitle.updateValueAndValidity();
        } 
    }

    fileExtention(name: string) {
        var regex = /(?:\.([^.]+))?$/;
        return regex.exec(name)[1];
    }

    onDepartmentSelect(departmentId) {
        this.departmentName = this.allDepartment.filter(x => x.departmentId == departmentId)[0].departmentName;

        this.getDepartmentUnits(departmentId);
        this.validateControlVisibility();
    }

    onDepartmentUnitSelect(departmentUnitId: number) {
        this.searchDepartmentUnitId$ = departmentUnitId;
        if(this.departmentUnitsData.length > 0 ) {
            this.toEmail = this.departmentUnitsData.filter(x => departmentUnitId == departmentUnitId)[0].departmentUnitEmail;
        }
        this.getUnitOfficers(departmentUnitId);
        this.validateControlVisibility();
    }

    validateControlVisibility() {
        if (this.toEmail == null) {
            this.toEmailVisibilityString = 'hide';
        } else {
            this.toEmailVisibilityString = null;
        }

        if (this.officers == null) {
            this.receiverStaffVisibilityString = 'hide';
        } else {
            this.receiverStaffVisibilityString = null;
        }
    }

    select(id, name, groupId) {
        this.filteredList = [];
        this.jobRequestForm.controls['receiverStaffId'].setValue(id);
        this.jobRequestForm.controls['receiverStaffName'].setValue(name);
        this.jobRequestForm.controls['staffApprovalGroupId'].setValue(groupId);
    } 

   
    viewDocument(row) {
        const doc = row;
        this.jService.getSupportingDocumentById(row.documentId).subscribe((response: any) => {
            this.binaryFile = response.result[0].fileData;
            if ( this.binaryFile  != null) {
                this.binaryFile = this.binaryFile;
                this.selectedDocument = doc.documentTitle;
                this.displayDocument = true;
            }
        });
    }
    //window.open("data:application/pdf;base64, " + base64EncodedPDF);
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

    deleteDocument(row){
        const doc = row;
        this.jService.deleteLoanDocument(row.documentId).subscribe((response: any) => {
            if(response.success){
                swal('Fintrak Credit 360',response.message,'success');
                this.getSupportingDocuments(this.jobCode);
            }
            else{ swal('Fintrak Credit 360',response.message,'error'); }
        });
    }

    getSupportingDocuments(jobRequestCode: any) {
        const uploadFileTitle = this.jobRequestForm.controls['uploadFileTitle'];
        this.jService.getSupportingDocumentByJobRequestCode(jobRequestCode).subscribe((response: any) => {
            this.supportingDocuments = response.result;
            if (this.supportingDocuments.length > 0) {
                this.showDocumentGrid = true;
                uploadFileTitle.clearValidators(); 
                uploadFileTitle.updateValueAndValidity();
            }
            let doctype = this.supportingDocuments.values;
        });
    }

    getDocumentType() {
        this.documentType = [];
        this.documentType.push({ name: 'Bank Statement', value: 3 });
        this.documentType.push({ name: 'Collateral', value: 2 });
        this.documentType.push({ name: 'Legal', value: 1 });
        this.documentType.push({ name: 'Others', value: 4 });
    }

    getCustomerTypes() {
        this.customerTypes = [];
        this.customerTypes.push({ name: 'Internal', value: 1 });
        this.customerTypes.push({ name: 'External', value: 2 });
        this.customerTypes.push({ name: 'Others', value: 3 });
    }

    emitClose() { 
        this.resetAccordion();
        this.InitJobRequestForm();
        this.messageContent = null;
        this.subjectContent = null;
        this.responseMessage = null;
        this.requireDocument = false;
        this.targetStaffStaffId = null;
        this.reassignedTo = null;
        this.autoSaveUsed = null;
        this.isReassigned = false;
        this.displayOption.emit('Close');
        this.supportingDocuments = [];
        
    }

    emitCloseNoRefresh() {
        this.resetAccordion();
        this.InitJobRequestForm();
        this.messageContent = null;
        this.subjectContent = null;
        this.responseMessage = null;
        this.requireDocument = false;
        this.targetStaffStaffId = null;
        this.reassignedTo = null;
        this.autoSaveUsed = null;
        this.isReassigned = false;
        this.supportingDocuments = [];
        this.displayOptionNoRefresh.emit('Close');
    }

    resetAccordion() {
        this.secondArea = null;
        this.firstArea = true;
        this.thirdArea = null;
    }

    getUnitOfficers(departmentUnitId) {
        this.jService.getUnitOfficers(departmentUnitId).subscribe((res) => {
            this.filteredStaffDepartment = this.officers = res.result;
        }, (err) => { });
    }

    getAllDepartments() {
        this.departmentSer.getDepartments().subscribe((res) => {
            this.allDepartment = res.result;
        });
    }

    getJobDepartments(jobTypeId) {
        this.departmentSer.getJobDepartments(jobTypeId).subscribe((res) => {
            this.jobDepartments = res.result;
        });
    }

    getDepartmentUnits(departmentId) {
        this.departmentSer.getDepartmentUnits(departmentId).subscribe((res) => {
            this.departmentUnitsData = this.departmentUnits = res.result;
        });
    }

    getDestinationUnits(jobSubTypeId) {
        this.jobTypeService.getJobDestinationUnits(jobSubTypeId).subscribe((res) => {
            this.jobDestinationUnits  = res.result;
        });
    }

    

    InitJobRequestForm() {
        try { this.jobRequestForm.controls['senderComment'].setValue('') }
        catch (error) { }

        this.jobRequestForm = this.fb.group({
            jobTypeId: ['', Validators.required],
            jobSubTypeId: ['', Validators.required],
            receiverStaffId: [''],
            departmentId: [''],
            departmentUnitId: ['', Validators.required],
            operationId: [this.operationsId, Validators.required],
            targetId: [''],
            staffApprovalGroupId: [''],
            receiverStaffName: [''],
            senderComment: ['', Validators.required],
            requireDocument: [''],
            uploadFileTitle: [''],
            requestSubject: ['', Validators.required],
            description: [''],
            fileInput: [''],
            searchedName: ['']
        });

        const targetIdField = this.jobRequestForm.controls['targetId'];
        if(this.useFacilityDropdownToDetermineTarget){targetIdField.setValidators(Validators.required);}
    }

    validateSelectedStaff() {
        this.jService.getOfficers()
            .subscribe((res) => { var staff: any[] = res.result; }, (err) => { });

        return (control: FormControl) => {
            if (this.officers.find(x => x.name === control.value) == null) {
                return { error: true };
            }
            return null;
        }
    }

    showMessage(message: string, cssClass: string, title: string) {
        this.message = message;
        this.title = title;
        this.cssClass = cssClass;
        this.show = true;
    }

    finishBad(message) {
        this.loadingSrv.hide();
        this.showMessage(message, 'error', "FintrakBanking");
    }

    finishGood(message) {
        this.loadingSrv.hide();
        this.showMessage(message, 'success', 'FintrakBanking');
    }

}