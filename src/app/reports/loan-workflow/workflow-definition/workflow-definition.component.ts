
import { Component, OnInit } from '@angular/core';
import { ApprovalService } from '../../../setup/services/approval.service';
import { ReportService } from '../../service/report.service';
import { SafeResourceUrl, DomSanitizer } from '@angular/platform-browser';
import { LoadingService } from '../../../shared/services/loading.service';


/**
* This class represents the lazy loaded HomeComponent.
*/
@Component({
    templateUrl: 'workflow-definition.component.html',
})
export class WorkflowDefinitionComponent implements OnInit {
    operations: any[]; displayReport: boolean = false; reportSrc: SafeResourceUrl;
    displayTestReport:boolean= false; operationId: number;


    constructor(private approvalServ: ApprovalService, private reportServ: ReportService, private loadingSer: LoadingService ,private sanitizer: DomSanitizer, ) { }
      
    ngOnInit() {
        this.getOperation();
    }

    getOperation() {
        this.approvalServ.getAllOperations().subscribe((response: any) => {
            this.operations = response.result;
        });
    }

    onSelectOperation(id: number) {
        this.operationId = id;

    }

    onPreview() {
        this.loadingSer.show();
        let path: string;
        if (this.operationId !== null && this.operationId !== 0) {
            this.reportServ.getWorkflowDefinition(this.operationId).subscribe((response: any) => {
                path = response.result;
                this.reportSrc = this.sanitizer.bypassSecurityTrustResourceUrl(path);
                this.displayTestReport = true;
                this.loadingSer.hide(10000);
                this.displayReport = true;
                return;
            });
        }
    }
}