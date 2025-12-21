import { Component, OnInit, Input } from '@angular/core';
import { DocumentpUloadService } from 'app/shared/services/document-upload.service';
import { LoadingService } from 'app/shared/services/loading.service';
import { saveAs } from 'file-saver';

@Component({
  selector: 'app-contingent-used-document',
  templateUrl: './contingent-used-document.component.html',
})
export class ContingentUsedDocumentComponent implements OnInit {
  apsDocuments: any;

   @Input() loanId:any;
  binaryFile: any;
  selectedDocument: any;
  displayDocument: boolean;
  pdfFile: any;
  pdfFileName: any;
  myDocExtention: any;

  constructor( private documentpUloadService: DocumentpUloadService,
    private loadingService: LoadingService,
    ) { }

  ngOnInit() {
    this.getContingentDocument(this.loanId)
  }
  getContingentDocument(body) {
    this.documentpUloadService.getContingentDocument(body).subscribe((response:any) => {
      this.apsDocuments = response.result
      
    }, (error) => {
    });
}

viewDocument(id: number) {
  this.loadingService.show();
  let doc = this.apsDocuments.find(x => x.documentId == id);
  if (doc != null) {
      this.binaryFile = doc.fileData;
      this.selectedDocument = doc.documentTitle;
      this.displayDocument = true;
      this.loadingService.hide();
  }
}

DownloadDocument(id: number) {
  let doc = this.apsDocuments.find(x => x.documentId == id);

  if (doc != null) {
      this.pdfFile = doc.fileData;
      this.pdfFileName = doc.documentTitle;
      this.myDocExtention = doc.fileExtension;
      var byteString = atob(this.pdfFile);
      var ab = new ArrayBuffer(byteString.length);
      var ia = new Uint8Array(ab);
      for (var i = 0; i < byteString.length; i++) {
          ia[i] = byteString.charCodeAt(i);
      }
      var bb = new Blob([ab]);

      if (this.myDocExtention == 'jpg' || this.myDocExtention == 'jpeg') {
          try {
              var file = new File([bb], this.pdfFileName + '.jpg', { type: 'image/jpg' });
              saveAs(file);
          } catch (err) {
              var saveFileAsBlob = new Blob([bb], { type: 'image/jpg' });
              window.navigator.msSaveBlob(saveFileAsBlob, this.pdfFileName + '.jpg');
          }
      }
      if (this.myDocExtention == 'png' || this.myDocExtention == 'png') {
          try {
              var file = new File([bb], this.pdfFileName + '.png', { type: 'image/png' });
              saveAs(file);
          } catch (err) {
              var saveFileAsBlob = new Blob([bb], { type: 'image/png' });
              window.navigator.msSaveBlob(saveFileAsBlob, this.pdfFileName + '.png');
          }
      }
      if (this.myDocExtention == 'pdf' || this.myDocExtention == '.pdf') {
          try {
              var file = new File([bb], this.pdfFileName + '.pdf', { type: 'application/pdf' });
              saveAs(file);
          } catch (err) {
              var saveFileAsBlob = new Blob([bb], { type: 'application/pdf' });
              window.navigator.msSaveBlob(saveFileAsBlob, this.pdfFileName + '.pdf');
          }
      }
      if (this.myDocExtention == 'xls' || this.myDocExtention == 'xlsx') {
          try {
              var file = new File([bb], this.pdfFileName + '.xlsx', { type: 'application/vnd.ms-excel' });
              saveAs(file);
          } catch (err) {
              var saveFileAsBlob = new Blob([bb], { type: 'application/vnd.ms-excel' });
              window.navigator.msSaveBlob(saveFileAsBlob, this.pdfFileName + '.xlsx');
          }
      }
      if (this.myDocExtention == 'doc' || this.myDocExtention == 'docx') {
          try {
              var file = new File([bb], this.pdfFileName + '.doc', { type: 'application/msword' });
              saveAs(file);
          } catch (err) {
              var saveFileAsBlob = new Blob([bb], { type: 'application/msword' });
              window.navigator.msSaveBlob(saveFileAsBlob, this.pdfFileName + '.doc');
          }
      }

  }

}
}
