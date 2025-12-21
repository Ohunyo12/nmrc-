import { Component, OnInit } from "@angular/core";
import { LoadingService } from "app/shared/services/loading.service";
import { LoanService } from "app/credit/services";

@Component({
  selector: "rejected-bulk-insurance",
  templateUrl: "rejected-insurance-upload.component.html",
})
export class RejectedInsuranceUploadComponent implements OnInit {
 
  insurancePolicies: any[] = [];
  selectionData: any[];

  constructor(
    private loadingSrv: LoadingService,
    private loanService: LoanService,
  ) {}

  ngOnInit() {
    this.getBulkInsuranceUploadRejectedApproval();
  }
  
  
  getBulkInsuranceUploadRejectedApproval(){
  this.loadingSrv.show();
  this.loanService.getBulkInsuranceUploadRejectedApproval().subscribe((response) =>{

      this.insurancePolicies = response.result;
      
      this.loadingSrv.hide();
  }, (err) => {
      this.loadingSrv.hide(1000);

  });
}
}