import { LoadingService } from '../../../shared/services/loading.service';
import { Component, OnInit } from '@angular/core';
import { CollateralService } from '../../../setup/services/collateral.service';
import { FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'collateral-release-awaiting-job-request',
  templateUrl: 'collateral-release-awaiting-job-request.component.html',
})
export class CollateralReleaseAwaitingJobRequestComponent implements OnInit {



    collateralReleaseData: any[];
    collaterals:any;
    constructor(
        private fb: FormBuilder,
        private loadingService: LoadingService,
        private collateralService: CollateralService,
        private router: Router,

    ) { }

    ngOnInit(){
        this.getReleaseRecord();
    }
    getReleaseRecord(){
    this.loadingService.show();
    this.collateralService.getCollateralReleaseAwaitingJobRequest().subscribe((response: any) => {
        this.collateralReleaseData = response.result;
        this.loadingService.hide(1000);
      }, (err) => {
          this.loadingService.hide(1000);
      });
    }

    onRowSelect(event) {
        this.router.navigate(['/credit/collateral/collateral-release-list', event.data.collateralCustomerId]);
    }

    viewRecord(d) {
        
    }
}