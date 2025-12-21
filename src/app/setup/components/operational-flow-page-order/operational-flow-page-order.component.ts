import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';
import { LoadingService } from 'app/shared/services/loading.service';
import { StaffRoleService } from 'app/setup/services';
import swal from 'sweetalert2';
import { GlobalConfig } from 'app/shared/constant/app.constant';

@Component({
  selector: 'app-operational-flow-page-order',
  templateUrl: './operational-flow-page-order.component.html',
  styleUrls: ['./operational-flow-page-order.component.scss']
})
export class OperationalFlowPageOrderComponent implements OnInit {
  displayOperationalFlowPage: boolean = false;
  operationalFlowPageForm: FormGroup;
  entityName: string;
  OperationalPage:any[]; 
  operations: any[]=[]; 
  flowOders: any[]=[];
  floworderId: any;
  activeIndex: number = 0;

  constructor(
    private fb: FormBuilder,
    private loadingService: LoadingService,
    private staffRolServ: StaffRoleService

  ) { }

  ngOnInit() {
    this.refresh();
  }

  clearApprovalSetupControl() {
    this.operationalFlowPageForm = this.fb.group({ 
      requiredOfferLetter: [false, Validators.required],
      requiredAvailment:[false, Validators.required],
      requiredAppraisal:[false,Validators.required],
      tag:['',Validators.required],
      operationId:['',Validators.required],
 });
}

 refresh(){
   this.clearApprovalSetupControl();
   this.loadDropdowns();
   this.loadFlowOrders();
 }

showAprovalSetupwModal() {
 this.entityName = "New Operational Order"
 this.clearApprovalSetupControl();
 this.displayOperationalFlowPage= true;
}


handleChange(evt) {
  this.activeIndex = evt.index;
}

submitOperationFlowForm(formObj){
 this.loadingService.show(); 
       let body = formObj.value;
       body.floworderId = this.floworderId;
      //  alert(body.floworderId);
     this.loadingService.show();
     if (body.floworderId > 0){
       this.staffRolServ.updateFlowOder(body).subscribe((res) => {
         if (res.success == true) {
             this.refresh();
             this.loadFlowOrders();
             this.loadingService.hide();
             swal(`${GlobalConfig.APPLICATION_NAME}`, res.message, 'success');
             this.displayOperationalFlowPage = false;
         } else {
             this.loadingService.hide();
            swal(`${GlobalConfig.APPLICATION_NAME}`, res.message, 'error');
         }
     }, (err: any) => { 
         this.loadingService.hide();
         swal(`${GlobalConfig.APPLICATION_NAME}`, err, 'error');
     });
     } else {
       this.staffRolServ.addFlowOder(body).subscribe((res) => {
         if (res.success == true) {
             this.refresh();
             this.loadFlowOrders();
             this.loadingService.hide();
            swal(`${GlobalConfig.APPLICATION_NAME}`, res.message, 'success');
             this.displayOperationalFlowPage = false;
         } else {
             this.loadingService.hide();
             swal(`${GlobalConfig.APPLICATION_NAME}`, res.message, 'error');
         }
     }, (err: any) => {
         this.loadingService.hide();
         swal(`${GlobalConfig.APPLICATION_NAME}`, err, 'error');
     });
     }
}   

editOperationalOrder( row, event){
    
  this.floworderId = row.floworderId;
 this.entityName = "Operational Flow Order"
 this.operationalFlowPageForm = this.fb.group({
  requiredAppraisal:[row.requiredAppraisal,Validators.required],
  requiredAvailment:[row.requiredAvailment,Validators.required],
  requiredOfferLetter:[row.requiredOfferLetter,Validators.required],
   operationId:[row.operationId, Validators.required],
   tag:[row.tag, Validators.required]
 });
 this.displayOperationalFlowPage = true;
}

loadFlowOrders() {
  this.staffRolServ.getAllOperations().subscribe((response: any) => {
      this.flowOders= response.result;
  });
}

loadDropdowns() {
  this.staffRolServ.getOperations().subscribe((response: any) => {
      this.operations= response.result;
  });
}

}
