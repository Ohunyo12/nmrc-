import { Component, OnChanges, Input } from '@angular/core';
import { LoanService } from 'app/credit/services/loan.service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
    selector: 'app-facility-summary',
    templateUrl: 'facility-summary.component.html'
})
export class FacilitySummaryComponent {
    customerExposure: any[] = [];  
    @Input() applicationId: number = 0;
    @Input() set reload(value: number) { if (value > 0) this.getFacilitySummary(); }
    constructor(
        private LoanServ: LoanService,
        private route: ActivatedRoute, 
        private router: Router,
    ) { }  
    getFacilitySummary() {
        if (this.applicationId == 0) return;
        this.LoanServ.getFacilitySummary(this.applicationId).subscribe((response: any) => {
            this.customerExposure = response.result;
        });
    }
    viewDetail(loanId, productTypeId) {
        if (loanId < 1) return;
        this.router.navigate(['/credit/loan/facility-detail-summary'], {
            queryParams: {
                loanId: loanId,
                productTypeId: productTypeId
            }
        });
    }
}