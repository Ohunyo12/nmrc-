import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CreditAppraisalService } from 'app/credit/services/credit-appraisal.service';

import { LoadingService } from 'app/shared/services/loading.service';


@Component({
  selector: 'app-workflow-change',
  templateUrl: './workflow-change.component.html'
 // styleUrls: ['./workflow-change.component.scss']
})
export class WorkflowChangeComponent implements OnInit {

   // ------------------- declarations -----------------
  workFlowChangeForm: FormGroup;
  displayworkFlowChangeForm: boolean = false;
  selectedId: number = null;
  workFlowChange: any[] = [];
  displayworkFlowChange: boolean;
  formState: string;
  loadingService: any;
  parameter: string;
  displayStartOperation: boolean = true;
  showBackButton: boolean = false;
  newOriginalDocument: boolean = false;
  approvedOriginalDocument: boolean = false;
  showDocumentUpload: boolean = true;
  dynamicText: string = '';
  skipWorkFlow: boolean;
  dynamicObject: any[] = [];
  dynamicObject2: any[] = [];
  dynamicObject3: any[] = [];
  targetOption: any;
  message: any;
  title: any;
  cssClass: any;
  show: boolean = false;
  

  constructor(
    private fb:FormBuilder,
    private creditAppraisalService: CreditAppraisalService,
    private loadServ: LoadingService
  ) {}
 
   

  ngOnInit() {
    this.clearControls();
    this.getWorkFlowChange();
  }

  getWorkFlowChange() {
    this.creditAppraisalService.getWorkFlowChange().subscribe((response: any) => {
        this.workFlowChange = response.result;
    });
}

  deleteworkFlowChange(row) {
    this.creditAppraisalService.deleteWorkFlowChange(row.flowChangeId).subscribe((response: any) => {
        if (response.result == true) this.reloadGrid();
    });
  }
    reloadGrid() {
      this.displayworkFlowChange = false;
      this.getWorkFlowChange();
  }

  setFlowPosition(e){
    if(e){this.skipWorkFlow = true;}
    else {this.skipWorkFlow = false;}
}


  clearControls() {
    // this.formState = 'New';
    this.workFlowChangeForm = this.fb.group({
        destinationUrl: ['', Validators.required],
        skipWorkFlow :['false'],
        mapByOperation: ['',Validators.required],
        documentOperation:['',Validators.required],
        fieldLabel:['',Validators.required]
     
    });
  }


  editworkFlowChange(row) { 
    this.clearControls();
    this.formState = 'Edit';
    this.selectedId = row.flowChangeId;
    this.workFlowChangeForm.setValue({
      destinationUrl: row.destinationUrl,
        skipWorkFlow: row.skipflow,
        documentOperation: row.documentOperation,
        fieldLabel: row.label,
        mapByOperation: row.documentOperation
    });
    this.displayworkFlowChange = true;
}



  showWorkFlowChange() {
    this.selectedId = null;
    this.displayworkFlowChange = true;
  }

  saveWorkFlowChange(form) {
    let body = {
        placeHolder: form.value.placeHolder,
        label: form.value.fieldLabel,
        skipflow:form.value.skipWorkFlow,
        operationId:form.value.documentOperation,
        destinationUrl:form.value. destinationUrl,
        productTypeId:form.value.mapByOperation,
        documentOperation:form.value.documentOperation
    }
   // console.log("we are here "+JSON.stringify(body));
    this.loadServ.show();
    if (this.selectedId === null) {
        this.creditAppraisalService.saveWorkFlowChange(body).subscribe((response: any) => {
            this.loadServ.hide();
            if (response.success == true) this.reloadGrid();
            else this.finishBad(response.message);
        }, (err: any) => {
            this.loadServ.hide();
            this.finishBad(JSON.stringify(err));
        });
    } else {
        this.creditAppraisalService.updateWorkFlowChange(body, this.selectedId).subscribe((response: any) => {
            this.loadServ.hide();
            if (response.success == true) this.reloadGrid();
            else this.finishBad(response.message);
        }, (err: any) => {
            this.loadServ.hide();
            this.finishBad(JSON.stringify(err));
        });
    }
}
  onSelectChange(target) {
    
     this.targetOption = target;
    if (this.targetOption == 1) {
      this.getAllproductTypes();
      
    }
     else if (this.targetOption == 2){
      this.getAllproductClass();
    }
    else if(this.targetOption == 3){
      this.getAllproducts();
    }
    else{
       this.targetOption = null;
       this.dynamicObject = [];
    }
    
  }


  getAllproductTypes(){
    this.dynamicText = "Product Types";
    this.creditAppraisalService.getAllproductTypes().subscribe((response: any) => {
      this.dynamicObject = response.result;
    });
  }

  getAllproductClass(){
    this.dynamicText = "Product Class";
    this.creditAppraisalService.getAllproductClass().subscribe((response: any) =>{
      this.dynamicObject = response.result;
    });
  }

  getAllproducts(){
    this.dynamicText = "Product";
    this.creditAppraisalService.getAllproducts().subscribe((response: any) =>{
      this.dynamicObject = response.result;
    });
  }

  displayworkFlowChangeCancel(){
    this.workFlowChangeForm.setValue({
      destinationUrl:null,

        skipWorkFlow:null,
        documentOperation: null,
        fieldLabel: null,
        mapByOperation: null,
    });
    this.dynamicObject = [];
    this.displayworkFlowChange = false;
   } 
   
  showMessage(message: string, cssClass: string, title: string) {
    this.message = message;
    this.title = title;
    this.cssClass = cssClass;
    this.show = true;
}

finishBad(message) {
    this.showMessage(message, 'error', "Fintrak Banking");
    this.loadServ.hide();
}
finishGood(message) {
    this.loadServ.hide();
    this.showMessage(message, 'success', "Fintrak Banking");
}


}
