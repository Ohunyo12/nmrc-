import { Component, OnInit, Input } from '@angular/core';
import { CustomerService } from '../../../../customer/services/customer.service';
import { LoanApplicationService } from '../../../services';
import { ISelectedCustomer } from './customer.interface';
@Component({
    selector: 'credit-limits',
    templateUrl: './limit-exposure.component.html',
    //   styleUrls: ['./name.component.scss']
})
export class LimitExposureComponent implements OnInit {
     nPLLimitData: any;
     rMLimitData: any;
     onPLLimit: any;
     lnPLLimit: any;
     lrMLimit: any;
     rMLimit: any;
     orMLimit: any;
     brRatio: any;
     brTotalExposure: any;

     initiatedBalance: any;
     approvedBalance: any;
     nplExposure: any;
     limitString: string;

    // sectorLimitData: any;
    // segmentLimitData: any;
   
    // customerData: any;
    // customerRate_Limit = {};
    // customerRating: string;
    // investmentGrade: boolean;
    // ocustomerLimit: any;
    // lcustomerLimit: any;
  
    // nPLLimit: any;
    // lsectorLimit: any;
    // osectorLimit: any;
    // sectorLimit: any;
    // lsegmentLimit: any;
    // osegmentLimit: any;
    // segmentLimit: any;
     
    // orMLimit: any;
      
    // ogroupLimit: any;
    // lgroupLimit: any;
    // groupLimit: any;
    // genaralview: boolean = true;
    @Input() selectedCustomer: ISelectedCustomer;

    constructor(private customerService: CustomerService, private loanAppService: LoanApplicationService, ) { }

    ngOnInit() {
        this.load();
    }

    load() {
        ////console.log("this.selectedCustomer", this.selectedCustomer);
        
        if (this.selectedCustomer != null || this.selectedCustomer != undefined) {
            const cust = this.selectedCustomer;
            this.getBranchLimit(cust.branchId);
            this.getRmLimit(cust.relationshipManagerId)
        }
    }



    getRmLimit(relationshipManagerId) {
        this.loanAppService.getRMLimit(relationshipManagerId)
            .subscribe((res) => {
                this.rMLimitData = res.result;
                 this.orMLimit = res.result.outstandingBalance;
                this.lrMLimit = res.result.limit;

                this.initiatedBalance = res.result.initiated;
                this.approvedBalance = res.result.approved;
                this.nplExposure = res.result.nplExposure;
                this.limitString = res.result.limitString;
                // console.log('lrMLimit', res.result);
            }, (err) => {
                ////console.log(err);
            });
    }
    // getSegmentLimit(productClassId) {
    //     // const cust = this.selectedCustomer;
    //     this.loanAppService.getSegmentLimit(productClassId)
    //         .subscribe((res) => {
    //             this.segmentLimitData = res.result;
    //             // this.osegmentLimit = this.segmentLimit.outstandingBalance;
    //             this.lsegmentLimit = this.segmentLimit.limit;
    //             ////console.log('lsegmentLimit', res.result);
    //         }, (err) => {
    //             ////console.log(err);
    //         });
    // }
    // getSectorLimit(subSectorId) {
    //     this.loanAppService.getSectorLimit(subSectorId)
    //         .subscribe((res) => {
    //             ////console.log(res.result);
    //             this.sectorLimitData = res.result;
    //             //   this.osectorLimit = this.sectorLimit.outstandingBalance;
    //             this.lsectorLimit = this.sectorLimit.limit;

    //         }, (err) => {
    //             ////console.log(err);
    //         });
    // }
    getBranchLimit(branchId: number) {
        this.loanAppService.getValidateNPLByBranch(branchId).subscribe((res) => {
            this.nPLLimitData = res.result;
            this.lnPLLimit = res.result.limit;
            this.onPLLimit = res.result.outstandingBalance;
            this.brTotalExposure = res.result.totalExposure;
            this.brRatio = res.result.ratio;
            // console.log('nPLLimit', res.result);
        }, (err) => {
            ////console.log(err);
        });
    }

}