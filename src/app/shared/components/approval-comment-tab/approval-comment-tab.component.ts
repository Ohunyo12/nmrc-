import { Component, OnInit, Input } from '@angular/core';
import { LoanService } from 'app/credit/services/loan.service';
import { LoadingService } from 'app/shared/services/loading.service';
import { TargetLocator } from 'selenium-webdriver';



@Component({
  selector: 'approval-comment-tab',
  templateUrl: './approval-comment-tab.component.html',
 // styleUrls: ['./approval-comment-tab.component.scss']
})
export class ApprovalCommentTabComponent implements OnInit {
  approvalWorkflowData: any;
  @Input() operationId;
  @Input() target;

  constructor(private loanService: LoanService,private loadingService: LoadingService,) { }

  ngOnInit() {
    this.getApprovalWorkFlow(this.operationId,this.target)
  }

  getApprovalWorkFlow(operationId, target) {
    this.loadingService.show();
    this.loanService.getApprovalTrailByOperation(operationId, target).subscribe((res) => {
      this.approvalWorkflowData = res.result;
      this.loadingService.hide();
    });
  }

}
