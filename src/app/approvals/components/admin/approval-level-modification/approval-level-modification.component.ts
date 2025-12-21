import { Component, OnInit } from '@angular/core';
import { ApprovalService } from 'app/setup/services/approval.service';
import { LoadingService } from 'app/shared/services/loading.service';
import swal from 'sweetalert2';
import { GlobalConfig } from 'app/shared/constant/app.constant';

@Component({
  selector: 'app-approval-level-modification',
  templateUrl: './approval-level-modification.component.html',
//  styleUrls: ['./approval-level-modification.component.scss']
})
export class ApprovalLevelModificationComponent implements OnInit {
  approvalLevelList: any;
  groupLevelList: any;
  displayModal: boolean;
  response: any;
  comment: string;
  approvalStatusId: number=0;
  tempApprovalLevelId: any;
  operationLevel: string;

  constructor(private approvalService: ApprovalService,
    private loadingService: LoadingService,) { }

  ngOnInit() {
    this.getList();
  }

  getList(){
 this.approvalService.getAllApprovalLevelList().subscribe((response: any) => {
            this.approvalLevelList = response.result;
        });
      }

      getApprovalWorkflowLevel(data){
        
          this.groupLevelList=data;
        if(this.groupLevelList.operation=='create'){
            this.operationLevel = 'New Approval Level Setup';
        }else if(this.groupLevelList.operation=='update'){
          this.operationLevel = 'Update Approval Level Setup'
        }else if(this.groupLevelList.operation=='delete'){
          this.operationLevel = 'Delete Approval Level Setup'
        }
          this.displayModal=true;
      }

      closeModal(){
        this.displayModal=false;
      }
     
      forwardLevelApproval()
      {
    
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
          tempApprovalLevelId:__this.groupLevelList.tempApprovalLevelId,
          comment:__this.comment,
          approvalStatusId :__this.approvalStatusId
        }
    
        
            __this.approvalService.goForLevelApproval(data).subscribe((response: any) => {
          __this.response = response.result;
          let success = response.success;
       
          if(response){
    
            if (success==true){
                __this.getList();
                __this.displayModal=false;
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
