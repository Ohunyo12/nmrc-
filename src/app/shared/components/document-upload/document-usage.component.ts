import { Component, OnInit, Input, Output, EventEmitter, ViewChild } from '@angular/core';
import { FormControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { LoadingService } from '../../services/loading.service';
import { CreditAppraisalService } from '../../../credit/services/credit-appraisal.service'; // TODO: modify path!
import swal from 'sweetalert2';
import { saveAs } from 'file-saver';

@Component({
    templateUrl: 'document-usage.component.html',
    selector: 'document-usage',
    providers: [DocumentUsageComponent] 
})
export class DocumentUsageComponent implements OnInit {

    // ------------------- declarations -----------------

    supportingDocuments: any[] = [];
    @ViewChild('fileInput', {static: false}) fileInput: any;
    customerName: string = '';
    selectedId: number = null;

    documentUploads: any[] = [];
    documentCategories: any[] = [];
    documentTypes: any[] = [];
    documentSearchForm: FormGroup;
    displayDocumentSearchForm: boolean = false;
    

    // ---------------------- init ----------------------

    constructor(
        private fb: FormBuilder,
        private loadingService: LoadingService,
        private creditAppraisalService: CreditAppraisalService,
    ) { }

    ngOnInit() {
        this.clearControls();
        this.getDocumentCategories();
    }

    getDocumentCategories() {
        this.creditAppraisalService.getDocumentCategories().subscribe((response: any) => {
            this.documentCategories = response.result;
        });
    }
    
    getDocumentTypesByCategory(id) {
        this.creditAppraisalService.getDocumentTypesByCategory(id).subscribe((response: any) => {
            this.documentTypes = response.result;
        });
    }
    
    // ------------------- api-calls --------------------

    getCustomerDocuments(form) {
        let body = {
            customerCode: form.value.customerCode,
            documentTypeId: form.value.documentTypeId,
            documentCategoryId: form.value.documentCategoryId,
        };
        this.loadingService.show();
        this.documentUploads = [];
        this.creditAppraisalService.getCustomerDocuments(body).subscribe((response: any) => {
            this.loadingService.hide();
            if (response.success == true) {
                this.documentUploads = response.result.documents;
                this.customerName = response.result.customerName;
            } else {
                this.finishBad(JSON.stringify(response.message));
            }
        }, (err: any) => {
            this.finishBad(JSON.stringify(err));
        });
    }


    // ---------------------- form ----------------------

    clearControls() {
        this.documentSearchForm = this.fb.group({
            customerCode: ['', Validators.required],
            documentTypeId: [''],
            documentCategoryId: [''],
        });
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



    fileDocument: any;
    binaryFile: string;
    selectedDocument: string;
    displayDocument: boolean = false;
    myPdfFile: any;

    downloadDocument(row, view = false) {
        this.fileDocument = null;
        this.loadingService.show();
        this.creditAppraisalService.downloadDocument(row.documentUploadId).subscribe((response: any) => {
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
 
    

}
