import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { FormControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
//import { LoadingService } from '../../services/loading.service';
import { CreditAppraisalService } from '../../../credit/services/credit-appraisal.service'; // TODO: modify path!
import swal from 'sweetalert2';
import { LoadingService } from 'app/shared/services/loading.service';

import { DocumentpUloadService } from '../../services/document-upload.service';
import { GlobalConfig } from '../../constant/app.constant';
import { saveAs } from 'file-saver';
import { ProductService } from 'app/setup/services/product.service';
import { LoanApplicationService } from 'app/credit/services/loan-application.service';
import { StaffRoleService } from 'app/setup/services';
import { isNullOrUndefined } from 'util';


@Component({
    templateUrl: 'document-upload.component.html',
    selector: 'document-upload',
  // providers: [DocumentUploadComponent] 
})
export class DocumentUploadComponent implements OnInit {

    // ------------------- declarations -----------------

    
    @Input() autoZIndex: boolean = true;
    @Input() panel: boolean = false;
    @Input() label: string = '';
    @Input() deleteLink: boolean = true;
    @Input() documentDates: boolean = false;
    @Input() panelTitle: string = "Document Uploads";
    @Input() showUploadForm: boolean = true;
    @Input() showUploadGrid: boolean = true;
    @Input() isOperationSpecific: boolean = true;
    @Input() countryCode;
    @Input() operationId: number = 0;
    @Input() customerId: number = 0;
    @Input() customerGroupId: number = 0;
    @Input() targetId: number = 0;
    @Input() targetReferenceNumber: string = ''; // OR code

    @Output() uploadCount: EventEmitter<number> = new EventEmitter<number>(); // todo
    @Output() deferrDocsCount: EventEmitter<number> = new EventEmitter<number>();
    @Output() requiredDocumentsUploadSatisfied: EventEmitter<boolean> = new EventEmitter<boolean>();
    @Output() displayApproveModal: EventEmitter<boolean> = new EventEmitter<boolean>();

    showRequiredDocumentTypes = false;
    @Input() isLms: boolean = false;
    @Input() showOriginalCopy = false;
    @Input() isFromDrawDownRequest: boolean;

    @Input() set reload(value: number) {
        if (value > 0) {
            this.documentUploads = null;
            this.requiredDocumentTypes = [];
            this.getDocumentsByTarget();
            this.getDocumentsByTarget1();
            this.getProductIds();
            this.getDeletedDocumentsByTarget();
            this.getDocumentCategories();
        }
    }

    @Input() set reloadDocsOnly(value: number) {
        if (value > 0) {
            this.documentUploads = null;
            this.getDocumentsByTarget();
            this.getDocumentsByTarget();
            this.getDeletedDocumentsByTarget();
        }
    }

   hideModal(){
   this.displayApproveModal.emit(true);
  }
    
    productIds: number[] = [];
    productClassIds: number[] = [];
    sectorIds: number[] = [];
    subSectorIds: number[] = [];
    documentCategories: any[] = [];
    documentTypes: any[] = [];
    files: FileList;

    formState: string = 'New';
    selectedId: number = null;
    file: File;
    documentUploads: any[] = [];
    documentUploads1: any[] = [];
    documentUploadForm: FormGroup;
    displayDocumentUploadForm: boolean = false;
    productDocumentMappingsData: any[] = [];
    requiredDocumentTypes: any[];
    requiredDocumentTypes2: any[];
    numberOfRequiredDocumentTypes = 0;
    documentDeleted: any[] = [];
    deferredDocs: any[] = [];
    fileDocument: any;
    binaryFile: string;
    selectedDocument: any;
    displayDocument: boolean = false;
    myPdfFile: any;
    

    onFileChange(event) {
        this.files = event.target.files;
        this.file = this.files[0];
    }
    
    // ---------------------- init ----------------------
    constructor(
        private fb: FormBuilder,
        private loanAppService: LoanApplicationService,
        private productService: ProductService,
        private loadingService: LoadingService,
        private creditAppraisalService: CreditAppraisalService,
        private staffRole: StaffRoleService,
    ) { }

    ngOnInit() {
        this.countryCode = "NG";
        this.creditAppraisalService.setCountryCode("NG");
        this.clearControls();
        this.getDocumentCategories();
         this.hideModal(); 
    }

    userisAnalyst:boolean = false;
    userIsRelationshipManager = false;
    userIsAccountOfficer = false;
    userIsAccountOfficer2 = false;
    staffRoleRecord: any;
    
    getUserRole() {
        this.staffRole.getStaffRoleByStaffId().subscribe((res)=>{
            this.staffRoleRecord = res.result;
                if(this.staffRoleRecord.staffRoleCode == 'AO' || this.staffRoleRecord.staffRoleCode == 'AO / RO'
                || this.staffRoleRecord.staffRoleCode == 'PMU'
                || this.staffRoleRecord.staffRoleCode == 'RMO'
                || this.staffRoleRecord.staffRoleCode == 'CP'
                || this.staffRoleRecord.staffRoleCode == 'RO'
                || this.staffRoleRecord.staffRoleCode == 'BM') { 
                    this.userIsAccountOfficer = true; 
                }
            });
    }
    getDocumentTypesByCategory(id) {
        this.loadingService.show();
        this.creditAppraisalService.getDocumentTypesByCategory(id).subscribe((response: any) => {
            this.documentTypes = response.result;
            this.loadingService.hide();
        }, (err) => {
            this.loadingService.hide(1000);
        });
    }

    getDocumentCategories() {
        this.loadingService.show();
        this.creditAppraisalService.getDocumentCategories().subscribe((response: any) => {
            this.documentCategories = response.result;
            this.loadingService.hide();
        }, (err) => {
            this.loadingService.hide(1000);
        });
    }

    getProductIds() {
        if(isNullOrUndefined(this.targetReferenceNumber) || this.targetReferenceNumber == ''){
            return;
        }
            this.loadingService.show();
        this.loanAppService.loanApplicationDetailsByReference(this.targetReferenceNumber).subscribe((response: any) => {
            this.productIds = [];
            this.productClassIds = [];
            this.sectorIds = [];
            this.subSectorIds = [];
            if (response.count > 0) {
                for (var detail of response.result) {
                    this.productClassIds.push(detail.productClassId);
                    this.productIds.push(detail.approvedProductId);
                    this.sectorIds.push(detail.sectorId);
                    this.subSectorIds.push(detail.subSectorId);
                    
                }
                this.getAllProductDocumentMappings();
            }
            this.loadingService.hide();
        }, (err) => {
            this.loadingService.hide(1000);
        });
    }

    getAllProductDocumentMappings() {
        this.requiredDocumentTypes2 = [];
        this.requiredDocumentTypes = [];
        this.showRequiredDocumentTypes = false;
		this.loadingService.show();
		this.productService.getAllProductDocumentMappings().subscribe((response: any) => {
            this.loadingService.hide();
            this.productDocumentMappingsData = response.result;
            if (!isNullOrUndefined(this.productDocumentMappingsData) && this.productDocumentMappingsData.length > 0) {
                this.validateRequiredUpload();
            }
            if (this.requiredDocumentTypes.length > 0) {
                this.showRequiredDocumentTypes = true;
            }
		});
    }

    validateRequiredUpload() {
        this.productIds.forEach((id) => {
            if (this.requiredDocumentTypes.length <= 0) {
                this.requiredDocumentTypes = this.productDocumentMappingsData.filter(m =>m.mapToProduct == true && m.productId == id);
            } else {
                this.requiredDocumentTypes2 = this.productDocumentMappingsData.filter(m =>m.mapToProduct == true && m.productId == id);
                this.requiredDocumentTypes2.forEach((d) => {
                    this.requiredDocumentTypes.push(d);
                });
            }
        });

        this.productClassIds.forEach((id) => {
            if (this.requiredDocumentTypes.length <= 0) {
                this.requiredDocumentTypes = this.productDocumentMappingsData.filter(m =>m.mapToProductClass == true && m.productClassId == id);
            } else {
                this.requiredDocumentTypes2 = this.productDocumentMappingsData.filter(m =>m.mapToProductClass == true && m.productClassId == id);
                this.requiredDocumentTypes2.forEach((d) => {
                    this.requiredDocumentTypes.push(d);
                });
            }
        });

        this.sectorIds.forEach((id) => {
            if (this.requiredDocumentTypes.length <= 0) {
                this.requiredDocumentTypes = this.productDocumentMappingsData.filter(m =>m.mapToSector == true && m.sectorId == id);
            } else {
                this.requiredDocumentTypes2 = this.productDocumentMappingsData.filter(m =>m.mapToSector == true && m.sectorId == id);
                this.requiredDocumentTypes2.forEach((d) => {
                    this.requiredDocumentTypes.push(d);
                });
            }
        });

        this.subSectorIds.forEach((id) => {
            if (this.requiredDocumentTypes.length <= 0) {
                this.requiredDocumentTypes = this.productDocumentMappingsData.filter(m =>m.mapToSubSector == true && m.subSectorId == id);
            } else {
                this.requiredDocumentTypes2 = this.productDocumentMappingsData.filter(m =>m.mapToSubSector == true && m.subSectorId == id);
                this.requiredDocumentTypes2.forEach((d) => {
                    this.requiredDocumentTypes.push(d);
                });
            }
        });

    }

    getDeferredDocumentByLoanApplicationId(loanApplicationId) {
        this.loadingService.show();
      this.creditAppraisalService.getDeferredDocumentByLoanApplicationId(loanApplicationId).subscribe((response) => {
          this.deferredDocs = response.result;
          this.loadingService.hide();
          if (isNullOrUndefined(response.result)) {
            this.deferrDocsCount.emit(0);
        } else {
            this.deferrDocsCount.emit(this.targetId);
        }
      }, (err) => {
          this.loadingService.hide(1000);
      });
    }

    checkIfRequiredDocumentsAreUploaded() {
        let numberRequiredDocsNotuploaded = 0;
        if (this.requiredDocumentTypes == undefined || this.requiredDocumentTypes == null || this.requiredDocumentTypes.length <= 0) {
            this.requiredDocumentsUploadSatisfied.emit(true);
            return;
        }
        this.requiredDocumentTypes.forEach((m) => {
            if (this.documentUploads == null || this.documentUploads == undefined) {
                return;
            }
            if (m.required == true && this.documentUploads.findIndex(d => d.documentTypeId == m.documentTypeId) == -1) {
                ++numberRequiredDocsNotuploaded;
            }
        });
        this.requiredDocumentsUploadSatisfied.emit(numberRequiredDocsNotuploaded == 0);
        return;
    }

    
    documentIsUploaded(documentTypeId): string {

        if (this.documentUploads == undefined || this.documentUploads == null || this.documentUploads.length <= 0) {
            return '<span class="label label-info">No</span>';
        }
        return (this.documentUploads.findIndex(d => d.documentTypeId == documentTypeId) == -1) ? '<span class="label label-info">No</span>' : '<span class="label label-success">Yes</span>';
    }


    fileExtention(name: string) {
        var regex = /(?:\.([^.]+))?$/;
        return regex.exec(name)[1];
    }

    // ------------------- api-calls --------------------
    
    saveDocumentUpload(form, overwrite = false) {
        const countryCode = this.countryCode;
        this.creditAppraisalService.setCountryCode(countryCode);

        let body = {
            fileName: this.file.name,
            fileExtension: this.fileExtention(this.file.name),
            fileSize: this.file.size,
            issueDate: form.value.issueDate,
            expiryDate: form.value.expiryDate,
            documentTypeId: form.value.documentTypeId,            
            fileSizeUnit: 'kilobyte',
            isOriginalCopy: form.value.isOriginalCopy,

            operationId: this.operationId,
            customerGroupId: this.customerGroupId == null ? 0 : this.customerGroupId,
            customerId: this.customerId == null ? 0 : this.customerId,
            targetId: this.targetId,
            targetReferenceNumber: this.targetReferenceNumber, 
            overwrite: overwrite
        };

     // console.log('this.selectedId', this.selectedId)
        this.loadingService.show();
        if (this.selectedId === null) {
            this.creditAppraisalService.uploadDocument2(this.file, body).subscribe((response: any) => {
                this.loadingService.hide();
                if (response.result == 3) {
                    this.confirmOverwrite();
                } 
                else {
                    if (response.success == true){
                        this.getDeferredDocumentByLoanApplicationId(this.targetId);
                        swal(`${GlobalConfig.APPLICATION_NAME}`, response.message, 'success');
                        //swal({ title: `${GlobalConfig.APPLICATION_NAME}`, text: response.message, timer: 2000 })
                        this.reloadGrid();

                    } 
                    else{this.finishBad(response.message); } 
                }
            }, (err: any) => {
                this.loadingService.hide();
                this.finishBad(JSON.stringify(err));
            });
        } else {
            this.creditAppraisalService.updateDocument(body, this.selectedId).subscribe((response: any) => {
                this.loadingService.hide();
                if (response.success == true) {
                  
                    this.getDeferredDocumentByLoanApplicationId(this.targetId);
                    swal(`${GlobalConfig.APPLICATION_NAME}`, response.message, 'success');
                    this.reloadGrid();
                }
                else {this.finishBad(response.message); 
                }
            }, (err: any) => {
                this.loadingService.hide();
                this.finishBad(JSON.stringify(err));
            });
        }
    }

    confirmOverwrite(): void {
        const __this = this;
        swal({
            title: 'File already exist!',
            text: 'Are you sure you want to OVERWRITE it?',
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
            __this.saveDocumentUpload(__this.documentUploadForm,true);
           
        }, function (dismiss) {
            if (dismiss === 'cancel') {
                swal(`${GlobalConfig.APPLICATION_NAME}`, 'Operation cancelled', 'error');
            }
        });
    }

    
/*this.documentpUloadService.uploadFile(this.file, body).then((response: any) => {
                if (response.result == 3) {
                    body.overwrite = true;
                    this.confirmOverwrite(body);
                } else {
                    this.uploadFileTitle = null;
                    this.fileInput.nativeElement.value = "";
                    this.getAllUploadedDocument(body);
                }
                this.loadingService.hide();
            }, (error) => {
                this.loadingService.hide(1000);
            }); */
    // getDocuments() {
    //     this.creditAppraisalService.getDocuments().subscribe((response: any) => {
    //         this.documentUploads = response.result;
    //     });
    // }

    getDocumentsByTarget() {  
        if ( this.operationId==undefined || this.targetId==undefined || this.operationId==0 || this.targetId==0) {
            return;
        }
        if(this.isLms){
            this.loadingService.show();
            this.creditAppraisalService.getDocumentsByTargetLms(this.operationId, this.targetId,this.isOperationSpecific, this.isLms).subscribe((response: any) => {
                this.loadingService.hide();
                this.documentUploads = response.result;
                if (isNullOrUndefined(response.result)) {
                    this.uploadCount.emit(0);
                } else {
                    this.uploadCount.emit(response.result.length);
                }
            
            },(err: any) => {
                this.loadingService.hide(1000);
            });
        }else{
            this.loadingService.show();
            this.creditAppraisalService.getDocumentsByTarget(this.operationId, this.targetId,this.isOperationSpecific).subscribe((response: any) => {
                this.loadingService.hide();
                this.documentUploads = response.result;
                if (isNullOrUndefined(response.result)) {
                    this.uploadCount.emit(0);
                } else {
                    this.uploadCount.emit(response.result.length);
                } 
            },(err: any) => {
                this.loadingService.hide(1000);
            });
            
        }
    }

    
    getDocumentsByTarget1() {  
        if ( this.targetId==undefined || this.targetId==0) {
            return;
        }
       
            this.loadingService.show();
            this.creditAppraisalService.getDocumentsByTarget1( this.targetId).subscribe((response: any) => {
                this.loadingService.hide();
                this.documentUploads1 = response.result;
                if (isNullOrUndefined(response.result)) {
                    this.uploadCount.emit(0);
                } else {
                    this.uploadCount.emit(response.result.length);
                } 
            },(err: any) => {
                this.loadingService.hide(1000);
            });
            
        }
    

    getDeletedDocumentsByTarget() {
      
        if ( this.operationId==undefined || this.targetId==undefined) {
            return;
        }
            this.loadingService.show();
            this.creditAppraisalService.getDeletedDocumentsByTarget(this.operationId, this.targetId).subscribe((response: any) => {
            this.loadingService.hide();
            this.documentDeleted = response.result;
        },(err: any) => {
            this.loadingService.hide(1000);
        });
    }
    // getDocumentUpload(id) {
    //     this.creditAppraisalService.getDocument(id).subscribe((response: any) => {
    //         this.documentUploads = response.result;
    //     });
    // }

    deleteDocumentUpload(row) {
        const countryCode = this.countryCode;
        this.creditAppraisalService.setCountryCode(countryCode);
        const __this = this;
        swal({
            title: 'File DELETE operation!',
            text: 'Are you sure you want to DELETE the file '+ row.fileName +'?',
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
            __this.loadingService.show();
            __this.creditAppraisalService.deleteDocument(row.documentUploadId, row.documentTypeId).subscribe((response: any) => {
                __this.reloadGrid();
                __this.loadingService.hide();
            }, (err: any) => {
                swal(`${GlobalConfig.APPLICATION_NAME}`, err, 'error')
                __this.loadingService.hide();
            });
        }, function (dismiss) {
            if (dismiss === 'cancel') {
                swal(`${GlobalConfig.APPLICATION_NAME}`, 'Operation cancelled', 'error');
            }
        });
    }

    // deleteDocumentUpload(row) {
    //     this.creditAppraisalService.deleteDocument(row.documentUploadId).subscribe((response: any) => {
    //         console.log(response);
    //         this.reloadGrid();
    //     });
    // }

    reloadGrid() {
        this.clearControls();
        this.getDocumentsByTarget();
        this.getDeletedDocumentsByTarget();
    }

    // ---------------------- form ----------------------

    clearControls() {
        this.formState = 'New';
        this.documentUploadForm = this.fb.group({
            fileName: [''],
            fileExtension: [''],
            fileSize: [''],
            fileSizeUnit: [''],
            fileData: ['',Validators.required ],
            issueDate: [''],
            expiryDate: [''],
            physicalFilenumber: [''],
            physicalLocation: [''],
            isOriginalCopy: false,
            documentTypeId: ['', Validators.required],
            documentCategoryId: ['', Validators.required],
            isExternalParty:['']
            // requiredDocumentId:['', Validators.required]
        });
        if (this.isFromDrawDownRequest) {
            this.documentUploadForm.controls['documentCategoryId'].setValue('19');
            this.getDocumentTypesByCategory(19);
        }
        
    }

    // editDocumentUpload(row) {
    //     this.clearControls();
    //     this.formState = 'Edit';
    //     this.selectedId = row.documentUploadId;
    //     this.documentUploadForm = this.fb.group({
    //         fileName: [row.fileName, Validators.required],
    //         fileExtension: [row.fileExtension],
    //         fileSize: [row.fileSize],
    //         fileSizeUnit: [row.fileSizeUnit],
    //         fileData: [row.fileData, Validators.required],
    //         issueDate: [row.issueDate],
    //         expiryDate: [row.expiryDate],
    //         physicalFilenumber: [row.physicalFilenumber],
    //         physicalLocation: [row.physicalLocation],
    //         documentTypeId:[row.documentTypeId]
    //     });
    //     this.displayDocumentUploadForm = true;
    // }

    showDocumentUploadForm() {
        this.clearControls();
        this.selectedId = null;
        this.displayDocumentUploadForm = true;
    }

    // ---------------------- message ----------------------

    show: boolean = false; message: any; title: any; cssClass: any;

    finishGood() { this.loadingService.hide(); }

    hideMessage(event) { this.show = false; }

    finishBad(message) {
        this.showMessage(message, 'error', "FintrakBanking");
        this.loadingService.hide();
    }

    showMessage(message: string, cssClass: string, title: string) {
        this.message = message;
        this.title = title;
        this.cssClass = cssClass;
        this.show = true;
    }

    // getDocumentType() {
    //     this.creditAppraisalService.getDocumentType().subscribe((response: any) => {
    //         this.documentType = response.result;
    //     });
    // }

    


   

    downloadDocument(row, view=false) {
        
        this.fileDocument = null;
        this.loadingService.show();
        this.creditAppraisalService.downloadDocument(row.documentUploadId).subscribe((response: any) => {
            this.fileDocument = response.result;
          
            if (this.fileDocument != null) {
                this.loadingService.hide();
                const downloadedFileName = this.fileDocument.fileName;
                this.binaryFile = this.fileDocument.fileData;
                this.selectedDocument = this.fileDocument.fileName;

                if (view) {
                    this.hideModal();
                    this.displayDocument = true;
                    return;
                }

                let myDocExtention = this.fileDocument.fileExtension;
                var byteString = atob(this.binaryFile);
                var ab = new ArrayBuffer(byteString.length);
                var ia = new Uint8Array(ab);
                for (var i = 0; i < byteString.length; i++) {
                    ia[i] = byteString.charCodeAt(i);
                }
                var bb = new Blob([ab]);

                if (myDocExtention == 'jpg' || myDocExtention == 'jpeg') {
                    try {
                        var file = new File([bb], downloadedFileName, { type: 'image/jpg' });
                        saveAs(file);
                    } catch (err) {
                        var saveFileAsBlob = new Blob([bb], { type: 'image/jpg' });
                        window.navigator.msSaveBlob(saveFileAsBlob, downloadedFileName);
                    }
                }
                if (myDocExtention == 'png' || myDocExtention == 'png') { 
                    try {
                        var file = new File([bb], downloadedFileName, { type: 'image/png' });
                        saveAs(file);
                    } catch (err) {
                        var saveFileAsBlob = new Blob([bb], { type: 'image/png' });
                        window.navigator.msSaveBlob(saveFileAsBlob, downloadedFileName);
                    }
                }
                if (myDocExtention == 'pdf' || myDocExtention == '.pdf') {
                    try {
                        var file = new File([bb], downloadedFileName, { type: 'application/pdf' });
                        saveAs(file);
                    } catch (err) {
                        var saveFileAsBlob = new Blob([bb], { type: 'application/pdf' });
                        window.navigator.msSaveBlob(saveFileAsBlob, downloadedFileName);
                    }
                }
                if (myDocExtention == 'xls' || myDocExtention == 'xlsx') {
                    try {
                        var file = new File([bb], downloadedFileName, { type: 'application/vnd.ms-excel' });
                        saveAs(file);
                    } catch (err) {
                        var saveFileAsBlob = new Blob([bb], { type: 'application/vnd.ms-excel' });
                        window.navigator.msSaveBlob(saveFileAsBlob, downloadedFileName);
                    }
                }
                if (myDocExtention == 'doc' || myDocExtention == 'docx') {
                    try {
                        var file = new File([bb], downloadedFileName, { type: 'application/msword' });
                        saveAs(file);
                    } catch (err) {
                        var saveFileAsBlob = new Blob([bb], { type: 'application/msword' });
                        window.navigator.msSaveBlob(saveFileAsBlob, downloadedFileName);
                    }
                }
            }

        }, (error) => {
            this.loadingService.hide(1000);
        });
    }

    
    downloadDocument1(row, view=false) {
        
        this.fileDocument = null;
        this.loadingService.show();
        this.creditAppraisalService.downloadDocument1(row.documentUploadId).subscribe((response: any) => {
            this.fileDocument = response.result;
          
            if (this.fileDocument != null) {
                this.loadingService.hide();
                const downloadedFileName = this.fileDocument.fileName;
                this.binaryFile = this.fileDocument.fileData;
                this.selectedDocument = this.fileDocument.fileName;

                if (view) {
                    this.hideModal();
                    this.displayDocument = true;
                    return;
                }

                let myDocExtention = this.fileDocument.fileExtension;
                var byteString = atob(this.binaryFile);
                var ab = new ArrayBuffer(byteString.length);
                var ia = new Uint8Array(ab);
                for (var i = 0; i < byteString.length; i++) {
                    ia[i] = byteString.charCodeAt(i);
                }
                var bb = new Blob([ab]);

                if (myDocExtention == 'jpg' || myDocExtention == 'jpeg') {
                    try {
                        var file = new File([bb], downloadedFileName, { type: 'image/jpg' });
                        saveAs(file);
                    } catch (err) {
                        var saveFileAsBlob = new Blob([bb], { type: 'image/jpg' });
                        window.navigator.msSaveBlob(saveFileAsBlob, downloadedFileName);
                    }
                }
                if (myDocExtention == 'png' || myDocExtention == 'png') { 
                    try {
                        var file = new File([bb], downloadedFileName, { type: 'image/png' });
                        saveAs(file);
                    } catch (err) {
                        var saveFileAsBlob = new Blob([bb], { type: 'image/png' });
                        window.navigator.msSaveBlob(saveFileAsBlob, downloadedFileName);
                    }
                }
                if (myDocExtention == 'pdf' || myDocExtention == '.pdf') {
                    try {
                        var file = new File([bb], downloadedFileName, { type: 'application/pdf' });
                        saveAs(file);
                    } catch (err) {
                        var saveFileAsBlob = new Blob([bb], { type: 'application/pdf' });
                        window.navigator.msSaveBlob(saveFileAsBlob, downloadedFileName);
                    }
                }
                if (myDocExtention == 'xls' || myDocExtention == 'xlsx') {
                    try {
                        var file = new File([bb], downloadedFileName, { type: 'application/vnd.ms-excel' });
                        saveAs(file);
                    } catch (err) {
                        var saveFileAsBlob = new Blob([bb], { type: 'application/vnd.ms-excel' });
                        window.navigator.msSaveBlob(saveFileAsBlob, downloadedFileName);
                    }
                }
                if (myDocExtention == 'doc' || myDocExtention == 'docx') {
                    try {
                        var file = new File([bb], downloadedFileName, { type: 'application/msword' });
                        saveAs(file);
                    } catch (err) {
                        var saveFileAsBlob = new Blob([bb], { type: 'application/msword' });
                        window.navigator.msSaveBlob(saveFileAsBlob, downloadedFileName);
                    }
                }
            }

        }, (error) => {
            this.loadingService.hide(1000);
        });
    }

    downloadDocumentCreditBereau(row, view=false) { 
        this.fileDocument = null;
        this.loadingService.show();
        this.creditAppraisalService.downloadDocumentCreditBereau(row.documentUploadId).subscribe((response: any) => {
            this.fileDocument = response.result;
            if (this.fileDocument != null) {
                this.loadingService.hide();
                const downloadedFileName = this.fileDocument.fileName;
                this.binaryFile = this.fileDocument.fileData;
                this.selectedDocument = this.fileDocument.documentTitle;

                if (view) {
                    this.displayDocument = true;
                    return;
                }

                let myDocExtention = this.fileDocument.fileExtension;
                var byteString = atob(this.binaryFile);
                var ab = new ArrayBuffer(byteString.length);
                var ia = new Uint8Array(ab);
                for (var i = 0; i < byteString.length; i++) {
                    ia[i] = byteString.charCodeAt(i);
                }
                var bb = new Blob([ab]);

                if (myDocExtention == 'jpg' || myDocExtention == 'jpeg') {
                    try {
                        var file = new File([bb], downloadedFileName, { type: 'image/jpg' });
                        saveAs(file);
                    } catch (err) {
                        var saveFileAsBlob = new Blob([bb], { type: 'image/jpg' });
                        window.navigator.msSaveBlob(saveFileAsBlob, downloadedFileName);
                    }
                }
                if (myDocExtention == 'png' || myDocExtention == 'png') {
                    try {
                        var file = new File([bb], downloadedFileName, { type: 'image/png' });
                        saveAs(file);
                    } catch (err) {
                        var saveFileAsBlob = new Blob([bb], { type: 'image/png' });
                        window.navigator.msSaveBlob(saveFileAsBlob, downloadedFileName);
                    }
                }
                if (myDocExtention == 'pdf' || myDocExtention == '.pdf') {
                    try {
                        var file = new File([bb], downloadedFileName, { type: 'application/pdf' });
                        saveAs(file);
                    } catch (err) {
                        var saveFileAsBlob = new Blob([bb], { type: 'application/pdf' });
                        window.navigator.msSaveBlob(saveFileAsBlob, downloadedFileName);
                    }
                }
                if (myDocExtention == 'xls' || myDocExtention == 'xlsx') {
                    try {
                        var file = new File([bb], downloadedFileName, { type: 'application/vnd.ms-excel' });
                        saveAs(file);
                    } catch (err) {
                        var saveFileAsBlob = new Blob([bb], { type: 'application/vnd.ms-excel' });
                        window.navigator.msSaveBlob(saveFileAsBlob, downloadedFileName);
                    }
                }
                if (myDocExtention == 'doc' || myDocExtention == 'docx') {
                    try {
                        var file = new File([bb], downloadedFileName, { type: 'application/msword' });
                        saveAs(file);
                    } catch (err) {
                        var saveFileAsBlob = new Blob([bb], { type: 'application/msword' });
                        window.navigator.msSaveBlob(saveFileAsBlob, downloadedFileName);
                    }
                }
            }

        }, (error) => {
            this.loadingService.hide(1000);
        });
    }

    // pdfFile: any;
    // pdfFileName: string;
    // displayPdf: boolean = false;
    // myDocExtention: string;
    // pdfData: any;
    // fileUrl: string;

    // viewPdfDocument(id: number) {
    //     let doc = this.documentUploads.find(x => x.documentId == id);
    //     if (doc != null) {
    //         this.displayPdf = true;
    //         this.fileUrl = 'https://cdn.rawgit.com/DenisVuyka/pdf-test-01/4b729e21/sample.pdf';
    //     };
    // }

    // viewExcelDocument(id: number) {
    //     let doc = this.documentUploads.find(x => x.documentId == id);
    //     if (doc != null) {
    //         this.pdfFile = doc.fileData;
    //         this.pdfFileName = doc.documentTitle;
    //         var byteString = atob(this.pdfFile);
    //         var ab = new ArrayBuffer(byteString.length);
    //         var ia = new Uint8Array(ab);
    //         for (var i = 0; i < byteString.length; i++) {
    //             ia[i] = byteString.charCodeAt(i);
    //         }
    //         var bb = new Blob([ab]);
    //         var file = new File([bb], this.pdfFileName + '.xlsx', { type: 'application/vnd.ms-excel' });
    //         // saveAs(file)
    //     }
    // }



}
