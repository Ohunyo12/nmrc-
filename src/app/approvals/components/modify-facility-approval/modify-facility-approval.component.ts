import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { FormControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import swal from 'sweetalert2';
import { LoadingService } from 'app/shared/services/loading.service';
import { LoanApplicationService } from 'app/credit/services/loan-application.service';
import { ValidationService } from 'app/shared/services/validation.service';
import { GlobalConfig, TenorType } from 'app/shared/constant/app.constant';
import { HttpErrorResponse } from '@angular/common/http';
import { CreditAppraisalService } from 'app/credit/services/credit-appraisal.service';
import { ProductService } from 'app/setup/services/product.service';
import { IProductFees } from 'app/credit/loans/application/loanApplicationInfo.interface';
import { GeneralSetupService } from 'app/setup/services/general-setup.service';

@Component({
  selector: 'app-modify-facility-approval',
  templateUrl: './modify-facility-approval.component.html',
  styleUrls: ['./modify-facility-approval.component.scss']
})
export class ModifyFacilityApprovalComponent implements OnInit {

  selectedId: number = null;

    facilityModifications: any[] = [];
    facilityModificationForm: FormGroup;
	displayFacilityModificationForm: boolean = false;
	formState: string = 'Edit';
	operationId = 207;
	filteredSubsector: any[] = [];
	filteredProducts: any[] = [];
	productClassProcessId = 0;
    sectors: any[] = [];
    repaymentPatterns: any[] = [];
    loanReviewTypes: any[] = [];
    tenorTypes: any[] = [];
    subsectors: any[] = [];
    selectedDetailId: number;
    isContingent: boolean;
    feesCollection: IProductFees[];
    selectedProductId: number;
    approvalStatusData: any[] = [];
    // ---------------------- init ----------------------
 
    constructor(
        private fb: FormBuilder,
        private loadingService: LoadingService,
		private loanAppService: LoanApplicationService,
		private camService: CreditAppraisalService,
        private genSetupService: GeneralSetupService,
		private productService: ProductService,
    ) { }

    ngOnInit() {
        this.clearControls();
		this.getFacilityModificationsForApproval();
		this.loadDropdowns();
    }

    // ------------------- api-calls --------------------
 
	loadDropdowns() {
        // this.GetFilteredProducts();
        this.getAllLoanDetailReviewTypes();
        this.tenorTypes = TenorType.list;
        this.GetAllSectors();
		this.GetAllSubSectors();
		this.getAllApprovalStatus();
	}
	
	GetAllSectors(){
        this.loadingService.show();
        this.loanAppService.getSector().subscribe((response: any) => {
            this.loadingService.hide();
            this.sectors = response.result;
        }, (err: HttpErrorResponse) => {
            this.loadingService.hide(1000);
        });
    }

    GetAllSubSectors(){
        this.filteredSubsector = [];
        this.loadingService.show();
        this.loanAppService.getSubSector().subscribe((response: any) => {
            this.loadingService.hide();
            this.subsectors = response.result;
            this.filteredSubsector = response.result;
        }, (err: HttpErrorResponse) => {
            this.loadingService.hide(1000);
        });
	}
	
	getAllLoanDetailReviewTypes(){
        this.loadingService.show();
        this.loanReviewTypes = [];
        this.loanAppService.getAllLoanDetailReviewTypes().subscribe((response: any) => {
            this.loadingService.hide();
            this.loanReviewTypes = response.result;
        }, (err: HttpErrorResponse) => {
            this.loadingService.hide(1000);
        });
    }

    getAllRepaymentSchedules() {
        this.loadingService.show();
        this.camService.getAllRepaymentSchedules().subscribe((res) => {
            this.loadingService.hide();
			this.repaymentPatterns = res.result;
		}, (err: HttpErrorResponse) => {
            this.loadingService.hide(1000);
        });
    }
	
    approveFacilityModification(form) {
      const __this = this;
      const target = {
			targetId: form.value.facilityModificationId,
			comment: form.value.comment,
			operationId: this.operationId,
			forwardAction: form.value.forward
      };

      swal({
          title: 'Are you sure?',
          text: 'You want to approve the request?',
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
          __this.loanAppService.approveFacilityModification(target).subscribe((res) => {
              __this.loadingService.hide();
              if (res.success == true) {
                  swal(`${GlobalConfig.APPLICATION_NAME}`, res.message, 'success');
                  __this.reloadGrid();
                  
              } else {
                  swal(`${GlobalConfig.APPLICATION_NAME}`, res.message, 'error');
              }
          }, (err) => {
              __this.loadingService.hide();
              swal(`${GlobalConfig.APPLICATION_NAME}`, JSON.stringify(err), 'error');
          });
      }, function (dismiss) {
          if (dismiss == 'cancel') {
              swal(`${GlobalConfig.APPLICATION_NAME}`, 'Operation cancelled', 'error');
          }
      });
  }

    saveFacilityModification(form) {
        let body = {
            facilityModificationId: form.value.facilityModificationId,
            approvedAmount: form.value.approvedAmount,
			approvedInterestRate: form.value.approvedInterestRate,
			approvedTenor: form.value.approvedTenor,
			approvedProductId: form.value.approvedProductId,
			tenorModeId: form.value.tenorModeId,
			sectorId: form.value.sectorId,
			subSectorId: form.value.subSectorId,
			productClassId: form.value.productClassId,
			repaymentTerm: form.value.repaymentTerm,
			repaymentScheduleId: form.value.repaymentScheduleId,
			// isLineFacility: [false],
            fees: this.feesCollection,
			loanDetailReviewTypeId: form.value.loanDetailReviewTypeId
        };
        this.loadingService.show();
        if (!(this.selectedId > 0)) {
            this.loanAppService.saveFacilityModification(body).subscribe((response: any) => {
                this.loadingService.hide();
                if (response.success == true) this.reloadGrid();
                else this.finishBad(response.message);
            }, (err: any) => {
                this.loadingService.hide();
                this.finishBad(JSON.stringify(err));
            });
        } else {
            this.loanAppService.updateFacilityModification(body, this.selectedId).subscribe((response: any) => {
                this.loadingService.hide();
                if (response.success == true) this.reloadGrid();
                else this.finishBad(response.message);
            }, (err: any) => {
                this.loadingService.hide();
                this.finishBad(JSON.stringify(err));
            });
        }
    }

    getFacilityModificationsForApproval() {
        this.loadingService.show();
        this.loanAppService.getFacilityModificationsForApproval().subscribe((response: any) => {
			this.loadingService.hide();
            this.facilityModifications = response.result;
        }, (err: any) => {
			this.loadingService.hide();
			this.finishBad(JSON.stringify(err));
		});
    }

    deleteFacilityModification(row) {
        this.loadingService.show();
        this.loanAppService.deleteFacilityModification(row.facilityModificationId).subscribe((response: any) => {
			this.loadingService.hide();
            if (response.result == true) this.reloadGrid();
        }, (err: any) => {
			this.loadingService.hide();
			this.finishBad(JSON.stringify(err));
		});
    }

    reloadGrid() {
        this.displayFacilityModificationForm = false;
        this.getFacilityModificationsForApproval();
	}
	
	GetFilteredProducts() {
        if (this.productClassProcessId == null || this.productClassProcessId == undefined){
            return;
        }
        this.filteredProducts = [];
        this.loadingService.show();
        this.productService.getProductsByProductClassProcess(this.productClassProcessId).subscribe((response: any) => {
            this.loadingService.hide();
            this.filteredProducts = response.result;
            
            if(this.filteredProducts != null){
                this.filteredProducts = this.filteredProducts.filter(x=>x.usedByLos == true).sort();
            }
        }, (err: HttpErrorResponse) => {
            this.loadingService.hide(1000);
        });
	}
	
	feesData(event: IProductFees[]) {
        this.feesCollection = [];

        for (let i = 0; event.length > i; i++) {
            let body = {
                feeId: event[i].feeId,
                feeName: event[i].feeName,
                rate: event[i].rate,
            }
            this.feesCollection.push(body);
        }
	}
	
	getAllApprovalStatus(): void {
        this.loadingService.show();
        this.genSetupService.getApprovalStatus().subscribe((response: any) => {
            this.loadingService.hide();
            let tempData = response.result;
			this.approvalStatusData = tempData.slice(2, 4);
        }, (err: HttpErrorResponse) => {
            this.loadingService.hide(1000);
        });
    }

    // ---------------------- form ----------------------

    clearControls() {
        this.facilityModificationForm = this.fb.group({
			facilityModificationId: '',
			approvedAmount: ['', Validators.required],
			approvedInterestRate: ['', Validators.required],
			approvedTenor: ['', Validators.compose([Validators.required, ValidationService.positiveValue])],
			approvedProductId: ['', Validators.required],
			tenorModeId: ['', Validators.required],
			sectorId: [''],
			subSectorId: ['', Validators.required],
			productClassId: [''],
			repaymentTerm: [''],
			repaymentScheduleId: [''],
			// isLineFacility: [false],
			loanDetailReviewTypeId: ['', Validators.required],
			comment: ['', Validators.required],
			forward: ['', Validators.required]
      });
    }

    editFacilityModification(row) {
        this.clearControls();
        this.formState = 'Approve';
		this.selectedId = row.facilityModificationId;
		this.productClassProcessId = row.productClassProcessId;
		this.selectedDetailId = row.loanApplicationDetailId;
		this.selectedProductId = row.approvedProductId;
        this.facilityModificationForm = this.fb.group({
			facilityModificationId: row.facilityModificationId,
            approvedAmount: [row.approvedAmount, Validators.required],
			approvedInterestRate: [row.approvedInterestRate, Validators.required],
			approvedTenor: [row.approvedTenor, Validators.compose([Validators.required, ValidationService.positiveValue])],
			approvedProductId: [row.approvedProductId, Validators.required],
			tenorModeId: [row.tenorModeId, Validators.required],
			sectorId: row.sectorId,
			subSectorId: [row.subSectorId, Validators.required],
			productClassId: row.productClassId,
			repaymentTerm: row.repaymentTerm,
			repaymentScheduleId: row.repaymentScheduleId,
			// isLineFacility: [false],
			loanDetailReviewTypeId: [row.loanDetailReviewTypeId, Validators.required],
			comment: ['', Validators.required],
			forward: ['', Validators.required]
		});
		this.GetFilteredProducts();
        this.displayFacilityModificationForm = true;
    }

    showFacilityModificationForm() {
        this.clearControls();
        this.selectedId = null;
        this.displayFacilityModificationForm = true;
    }

    // ---------------------- message ----------------------

    show: boolean = false; message: any; title: any; cssClass: any;

    finishGood() { this.loadingService.hide(); }

    hideMessage(event) { this.show = false; }

    finishBad(message) {
        this.showMessage(message, 'error', "FintrakBanking");
        this.loadingService.hide();
    }

    showMessage(message: string, cssClass: string, title: string) {
        this.message = message;
        this.title = title;
        this.cssClass = cssClass;
        this.show = true;
    }
}


