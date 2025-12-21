import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { LoadingService } from '../../../../shared/services/loading.service';
import { CollateralService } from '../../../../setup/services';
import { ApprovalStatus, GlobalConfig } from '../../../../shared/constant/app.constant';
import { Router } from '@angular/router';
//import { LoanApplicationService } from 'app/credit/services/loanapplication.service';
import swal from 'sweetalert2';
import { CountryStateService } from '../../../../setup/services/state-country.service';
import { log } from 'util';
import { LoanApplicationService } from '../../../services';

@Component({
    selector: 'app-collateral-mapping',
    templateUrl: './collateral-mapping.component.html',
    //styleUrls: ['./collateral-mapping.component.scss']
})
export class CollateralMappingComponent implements OnInit {

    activeTabindex: boolean = true;
    loanApplicationDetails: any[];
    loanApplicationLists: any[];
    registeredCollateral: any[] = [];
    selectedCollateral: any[] = [];
    mappedCollateral: any[];
    selectedSustomerCollaterals: any[];
    cities: any;
    countries: any;
    requirementItems: any;
    loanApplicationDetailId: any;
    productId: any;
    displayCollateral: boolean;

    addNewCollateral: boolean = false;

    [x: string]: any;
    showCustomerCollaterals: boolean;
    selectedCustomerId: number;
    customerCollaterals: any[];
    collateralTypes: any[] = [];
    subTypes: any[];
    constructor(
        private loadingService: LoadingService,
        private collateralService: CollateralService,
        private router: Router,
        private loanServ: LoanApplicationService,
        private locationService: CountryStateService,
    ) { }

    @Input() customerId: number;
    @Input() loanApplicationId: number;
    @Output() closeForm: EventEmitter<any> = new EventEmitter<string>();
    ngOnInit() {
        this.getCustomerCollateral(this.customerId);
        this.loadDropdowns();
        this.getMappedCollateral();
        ////console.log(this.loanApplicationId);

    }

    loadDropdowns() {
        this.locationService.getAllCities().subscribe((response: any) => {
            this.cities = response.result;
        });
        this.locationService.getAllCountries().subscribe((response: any) => {
            this.countries = response.result;
        });



        this.collateralService.getMappedCollateralToLoanApplication(this.customerId, this.loanApplicationId)
        .subscribe((response: any) => {
            this.selectedCollateral = response.result;
           ////console.log('ct ==> ', response.result);
            this.CalculateSecurityValue(this.selectedCollateral);
        });

        this.collateralService.getCollateralTypes().subscribe((response: any) => {
            this.collateralTypes = response.result;
            ////console.log('ct ==> ', response.result);

        });
        this.collateralService.getCollateralSubTypes().subscribe((response: any) => {
            this.subTypes = response.result;
            ////console.log('cst ==> ', response.result);

        });



        // this.collateralService.getFrequencyTypes().subscribe((response: any) => {
        //     this.frequencyTypes = response.result;
        // });
        // this.currencyService.getAllCurrencies().subscribe((response: any) => {
        //     this.currencies = response.result;
        // });
        // this.collateralService.getValueBaseTypes().subscribe((response: any) => {
        //    this.valueBaseTypes = response.result;
        // });
        // this.collateralService.getValuers().subscribe((response: any) => {
        //    this.valuers = response.result;
        // });
        // this.ledgerService.get().subscribe((response: any) => {
        //    this.accountTypes = response.result;
        // });
    }
    getCollateralSubTypeName(id) {
        ////console.log(id);
        if (id > 0 && id !== "undefined") {
            let item = this.subTypes.find(x => x.collateralSubTypeId == +id);
            return item == null ? 'n/a' : item.collateralSubTypeName;
        }

    }

    getMappedCollateral() {
        ////console.log(this.loanApplicationId);
        this.mappedCollateral= [];
        this.loanServ.getLoanApplicationCollateralMappingByLoanApplication(this.loanApplicationId)
            .subscribe((responed) => {
                this.mappedCollateral = responed.result;
                // this.CalculateSecurityValue(this.mappedCollateral);
                ////console.log(' this.mappedCollateral ==> ', this.mappedCollateral);
            });
          }

    private CalculateSecurityValue(collation: any[]) {
        let tempValue: number;
        let bodyObj: any[] = [];
        tempValue = this.totalSecurityValue;
         this.totalSecurityValue = 0;
        ////console.log(event);
        for (let i = 0; collation.length > i; i++) {
            ////console.log(typeof (collation[i].securityValue));
            tempValue = tempValue + collation[i].securityValue; // - (x.securityCollateralValue * (x.haircut * 0.01) ) 
        }
        this.totalSecurityValue = tempValue;
    }

    onDone() {
        this.closeForm.emit(false);
    }
    showCollateralMapping: boolean;
    showMappingModalForm() {
        this.showCollateralMapping = true;
        this.collateralService.getUnmappedCollateralToLoanApplication(this.customerId, this.loanApplicationId).subscribe((response: any) => {
            this.registeredCollateral = response.result;       
        });
      
    }
    editCustomerCollateral(index) {
        ////console.log("index", index);
        this.selectedSustomerCollaterals = index;
        //  ////console.log(this.selectedSustomerCollaterals);

        this.addNewCollateral = true;
    }

    getApprovalStatus(id) {
        let item = ApprovalStatus.list.find(x => x.id == id);
        return item == null ? 'n/a' : item.name;
    }

    getCollateralTypeName(id) {
        let item = this.collateralTypes.find(x => x.collateralTypeId == id);
        return item == null ? 'n/a' : item.collateralTypeName;
    }

    showModalForm() {
        this.addNewCollateral = this.addNewCollateral ? false : true;
        ////console.log(this.addNewCollateral);
        this.getCustomerCollateral(this.customerId);
    }

    onRowSelect(event) {
        ////console.log(event.data);

        this.requirementItems = true;
        this.selectedCustomerId = event.data.customerId;
        this.loanApplicationId = event.data.loanApplicationId;
        this.loanApplicationDetailId = event.data.loanApplicationDetailId
        this.productId = event.data.proposedProductId;
        this.getChecklistDetailByTargetId(this.loanApplicationDetailId);
        ////console.log(this.loanApplicationId, this.loanApplicationDetailId, this.productId, this.selectedCustomerId);

    }
    totalSecurityValue: number = 0;
    allBodies: any[] = [];
    onSaveCollateralsMapping() {
        let tempValue: number;
        tempValue = this.totalSecurityValue;
        this.totalSecurityValue = 0;
        for (let i = 0; this.selectedCollateral.length > i; i++) {
            ////console.log(this.selectedCollateral[i].collateralId, this.loanApplicationId);
            const bodyObj = {
                collateralCustomerId: this.selectedCollateral[i].collateralId,
                loanapplicationDetailId: '',
                loanApplicationId: this.loanApplicationId,
            }
            this.allBodies.push(bodyObj);
           // this.CalculateSecurityValue() ;
        }
      
        this.loanServ.addLoanApplicationCollateralMapping(this.allBodies).subscribe((response: any) => {
            swal(`${GlobalConfig.APPLICATION_NAME}`, 'Collateral added successfully', 'success');
            this.selectedCollateral = [];
            this.showCollateralMapping = false
        },
            (err) => {
                swal(`${GlobalConfig.APPLICATION_NAME}`, JSON.stringify(err), 'error');
            });
    }

    calculateTotalSecurity(event) { 
        let collateral: any[] = event.items;
        this.CalculateSecurityValue(collateral)
       
    }
    securityValue: number = 0;

    removeCalculateTotalSecurity(event) {
        let tempValue: number;
        let bodyObj: any[] = [];
        tempValue = this.totalSecurityValue;
        this.totalSecurityValue = 0;
        let collateral: any[] = event.items;
        for (let i = 0; collateral.length > i; i++) {
            const body = {
                collateralId: collateral[i].collateralId,
                loanapplicationDetailId: '',
                loanApplicationId: this.loanApplicationId,
                loanApplicationCollateralId: collateral[i].loanApplicationCollateralId
            };
            bodyObj.push(body);
            this.securityValue += collateral[i].securityValue;

        }
        if (this.totalSecurityValue > 0) {
            this.totalSecurityValue = 0;
            this.totalSecurityValue = tempValue - this.securityValue;
        } else {
            this.totalSecurityValue = this.securityValue;
        }
        this.loadingService.show();
        this.collateralService.deleteCollateralApplicationMapped(bodyObj).subscribe((res) => {
            this.loadingService.hide();
            if (res.success === true) {
                swal(`${GlobalConfig.APPLICATION_NAME}`, res.message, 'success');
            }
        }, (err: any) => {
            ////console.log(err);

        });

    }

    gotoCollateralInformation() {
        this.displayCollateral = true;
        ////console.log(this.displayCollateral );

        this.router.navigate(['/credit/loan/loan-collateral-infomation', this.customerId]);
    }

    getCustomerCollateral(id): void {
        ////console.log(id);

        if (+id == 0) {
            this.selectedCustomerId = id;
            this.showCustomerCollaterals = true;
        }

        if (+id > 0) {
            this.selectedCustomerId = id;
            ////console.log('emmitting customer id...', id);
            this.loadingService.show();
            this.collateralService.getCustomerCollateral(id).subscribe((response: any) => {
                this.customerCollaterals = response.result;
                this.showCustomerCollaterals = true;
                this.loadingService.hide();
            }, (err) => {
                this.loadingService.hide(1000);
            });
        }
    }
}