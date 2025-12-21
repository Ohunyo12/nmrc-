import { Component, OnInit } from '@angular/core';
import { LoadingService } from 'app/shared/services/loading.service';
import { ApprovalService } from 'app/setup/services/approval.service';
import { GlobalConfig } from 'app/shared/constant/app.constant';
import swal from 'sweetalert2';

@Component({
  selector: 'app-approval-level-staff-modification',
  templateUrl: './approval-level-staff-modification.component.html',
  //styleUrls: ['./approval-level-staff-modification.component.scss']
})
export class ApprovalLevelStaffModificationComponent implements OnInit {
  levelStaffTableView:any;
  comment: any;
  approvalStatusId: any;
  tempStaffLevelId:any;
  response: any;
  displayModel: boolean;
  levelStaffView: any;
  operationLevel: string;
  constructor(private approvalService: ApprovalService,
    private loadingService: LoadingService,) { }

  ngOnInit() {
    this.getList();
  }


  getList(){
    this.approvalService.getTempAllLevelStaffApproval().subscribe((response: any) => {
               this.levelStaffTableView = response.result;
           });
         }
   
         viewtSelectLevelStaffDetail(data){
           
           this.levelStaffView=data;
           this.displayModel = true;
   
           if(this.levelStaffView.operation=='create'){
               this.operationLevel = 'Approval for New Operation';
           }else if(this.levelStaffView.operation=='update'){
             this.operationLevel = 'Update Operation'
           }else if(this.levelStaffView.operation=='delete'){
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
            tempStaffLevelId:__this.levelStaffView.tempStaffLevelId,
             comment:__this.comment,
             approvalStatusId :__this.approvalStatusId
           }
       
           
               __this.approvalService.goForLevelStaffApproval(data).subscribe((response: any) => {
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
