import { Component, OnInit } from '@angular/core';
import { ApprovalService } from 'app/setup/services/approval.service';
import { LoadingService } from 'app/shared/services/loading.service';
import swal from 'sweetalert2';
import { GlobalConfig } from 'app/shared/constant/app.constant';

@Component({
  selector: 'app-approval-group-modification',
  templateUrl: './approval-group-modification.component.html',
  //styleUrls: ['./approval-workflow-modification.component.scss']
})
export class ApprovalGroupModificationComponent implements OnInit {
  approvalGroupList:any[];
  displayModel: boolean;
  WorkflowGroupView: any;
  comment: any;
  approvalStatusId: number=0;
  response: any;
  operationLevel: string;

  constructor(private approvalService: ApprovalService,
    private loadingService: LoadingService,) { }

  ngOnInit() {
    this.getList();
  }

  getList(){
 this.approvalService.getAllApprovalGroupList().subscribe((response: any) => {
            this.approvalGroupList = response.result;
        });
      }

      getSelectedWorkflowGroup(data){

        
        this.WorkflowGroupView=data;
        this.displayModel = true;

        if(this.WorkflowGroupView.operation=='create'){
            this.operationLevel = 'Approval for New Operation';
        }else if(this.WorkflowGroupView.operation=='update'){
          this.operationLevel = 'Update Operation'
        }else if(this.WorkflowGroupView.operation=='delete'){
          this.operationLevel = 'Delete Operation'
        }
      }
      closeModal(){
        this.displayModel = false;
      }

      forwardGroupApproval(){
        let __this = this;
        swal({
            title: 'Are you sure?',
            text: 'Are you sure you want to proceed?',
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
        let data ={
          tempGroupOperationMappingId:__this.WorkflowGroupView.tempGroupOperationMappingId,
          comment:__this.comment,
          approvalStatusId :__this.approvalStatusId
        }
    
        
            __this.approvalService.goForGorupApproval(data).subscribe((response: any) => {
          __this.response = response.result;
          let success = response.success;
       
          if(response){
    
            if (success==true){
                __this.getList();
                __this.displayModel = false;
                __this.loadingService.hide();
                swal('FinTrak Credit 360', response.message, 'success');
                __this.comment="";
               __this.approvalStatusId =0
              }else{
                __this.loadingService.hide();
                swal('FinTrak Credit 360', response.message, 'error');
              }
         
          }
          __this.loadingService.hide();
      }, (err) => {
          __this.loadingService.hide(1000);
      });
    
            
      
        }, function (dismiss) {
            if (dismiss === 'cancel') {
                swal(`${GlobalConfig.APPLICATION_NAME}`, 'Operation cancelled', 'error');
            }
        });
    
    
    
        
      }
}
