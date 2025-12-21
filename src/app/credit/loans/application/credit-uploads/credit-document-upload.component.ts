import { Component, OnInit, ViewChild } from '@angular/core';
import { LoadingService } from '../../../../shared/services/loading.service';
import { CustomerService } from '../../../../customer/services/customer.service';

@Component({
    selector: 'app-credit-document-upload',
    templateUrl: './credit-document-upload.component.html',
   // styleUrls: ['./credit-document-upload.component.scss']
})
export class CreditDocumentUploadComponent implements OnInit {
    uploadDocumentType: any[];
    displayMandatesUpload: boolean = true;
    displayUpload: boolean = true;
    kycDocumentUploadList:any[];
    binaryFile: any;
   
    selectedDocument: string;
    constructor(private loadingService: LoadingService, private customerService: CustomerService,) { }

    ngOnInit() { }


    uploadFileTitle: string = null;
    documentTypeId: number = null;
    files: FileList;
    file: File;
    @ViewChild('fileInput', {static: false}) fileInput: any;

    onFileChange(event) {
        this.files = event.target.files;
        this.file = this.files[0];
    }

    fileExtention(name: string) {
        var regex = /(?:\.([^.]+))?$/;
        return regex.exec(name)[1];
    }

    viewDocument(id: number) {
        let doc =null; // this.kycDocumentUploadList.find(x => x.documentId == id);
        if (doc != null) {
            this.binaryFile = doc.fileData;
            this.selectedDocument = doc.documentTitle;
            this.displayUpload = true;
        }
        ////console.log("binary file..", this.binaryFile);
    }

    uploadFile() {
        if (this.file != undefined || this.uploadFileTitle != null) {
            let body = {
                // customerId: this.customerId,
                // customerCode: this.customerCodetitle,
                documentTitle: this.uploadFileTitle,
                fileName: this.file.name,
                fileExtension: this.fileExtention(this.file.name),
                physicalFileNumber: 'n/a',
                physicalLocation: 'n/a',
                documentTypeId: this.documentTypeId, // TODO: redundant with fileExtension known
            };
            this.loadingService.show();
            this.customerService.uploadFile(this.file, body).then((val: any) => {
                ////console.log("val", val)
                this.uploadFileTitle = null;
                this.documentTypeId = null;
                this.fileInput.nativeElement.value = "";
                this.loadingService.hide();
                // this.getKYCDocumentUploads(this.customerId);
                // this.ShowNextButton = true;
                this.loadingService.hide();
               // this.displayMandatesUpload = false;
            }, (error) => {
                this.loadingService.hide(1000);
                ////console.log("error", error);
            });
        }
    }
}