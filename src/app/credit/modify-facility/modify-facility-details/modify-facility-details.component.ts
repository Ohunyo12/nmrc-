
import swal from 'sweetalert2';
import { saveAs } from 'file-saver';
import { DateUtilService } from 'app/shared/services/dateutils';
import { race } from 'rxjs';
import { ExchangeRateService, StaffService } from 'app/admin/services';
import { DetailedPeerCertificate } from 'tls';
import values from 'assets/config/values';
import { GlobalConfig, ConvertString, FlowChangeEnum, ProductClassProcessEnum, ProductClassEnum, ProductTypeEnum, TenorType } from 'app/shared/constant/app.constant';
import { Validators, FormGroup, AbstractControl, FormBuilder } from '@angular/forms';
import { IProductFees } from 'app/credit/loans/application/loanApplicationInfo.interface';
import { ViewChild, Output, EventEmitter, Input, Component, OnInit, NgZone, SimpleChanges } from '@angular/core';
import { ValidationService } from 'app/shared/services/validation.service';
import { HttpErrorResponse } from '@angular/common/http';
import { ProductService } from 'app/setup/services';
import { CasaService } from 'app/customer/services/casa.service';
import { LoadingService } from 'app/shared/services/loading.service';
import { CreditAppraisalService, LoanApplicationService, LoanService } from 'app/credit/services';
import { CustomerGroupService } from 'app/customer/services/customer-group.service';
import { CustomerService } from 'app/customer/services/customer.service';

function ValidateGreaterThanZero(c: AbstractControl): { [key: string]: boolean } | null {

    if (c.value == undefined && isNaN(c.value) || c.value <= 0) {
        return { zero: true }
    }
    return null;
}

@Component({
  selector: 'app-modify-facility-details',
  templateUrl: './modify-facility-details.component.html',
  styleUrls: ['./modify-facility-details.component.scss']
})
export class ModifyFacilityDetailsComponent implements OnInit {

    customer: any;
    selectedProductId: number;
    message: string;
    title: string;
    cssClass: string;
    show: boolean;
    loanApp: any;
    allExchangeRates: any;
    categoryTeirs: any;
    ProductId: any;
    showCategoryTypeInput: boolean = false;
    repaymentPatterns: any[];
    isContingent: boolean;
    buttonText: string;
    displayADAuth: boolean = false;
    bulkUPload: boolean= false;
    adAuthPassCode: string = null;
    uploadedData: any;
    failedUpload: any;
    approvedTenor:any;
    racFails: boolean = false;
    isLineFacility: boolean = false;
    loanReviewTypes: any[] = [];
    tenorTypes: any[] = [];
    records: any;
    bankLimit: any;

    readonly CASH_BACKED = 5; 
    readonly INVOICE_DISCOUNTING = 6; 
    readonly FIRST_EDUCATION = 7; 
    readonly FIRST_TRADERS = 8; 
    readonly IMPORT_FINANCE = 9; 
    readonly BOND_AND_GUARANTEES = 10;
    readonly TEAM_LOAN = 1; 
    readonly COMMERIAL_LOAN = 2; 
    readonly RETAIL_LOAN = 3; 
    readonly INDIVIDUAL_LOAN = 4;

    testObject: any = null;

    isInvoiceBased: boolean = false; 
    
    disableControl: boolean = false;
    tenorMode: number;
    selectedDetailId: number;
    allowedCurrencies: any[] = [];
    invoiceTable: any[] = [];
    collectFeesLebel: string; invoiceInfo: FormGroup;
    syndicationFormDetail: FormGroup;
    programmType: string;
    racCurrencyId: number;
    marketLocations: any[] = [];
    racApplicationSpecialProcessFlow: any[] = [];
    es: any; 
    bondDetails: any; 
    startdate: Date; 
    enddate: Date;
    customerLimitMoney: number;
    projectName: string = "Total Project Amount (NGN)"
    isProductProgram: boolean = false;
    addFacilityLabel: string = ' Add Facility';
    addBulkInvoice: string = ' Add Bulk';
    isFeeEditable: boolean;
    displayInvoiceDetails2: boolean=false;
    private CAMORFAM;
    filteredSubsector: any[] = [];
    filteredProducts: any[] = [];
    sectors: any[] = [];
    subsectors: any[] = [];
    facilityDetailsForm: FormGroup;


    @Input() editMode: boolean = false;
    @Input() customerGroupId: number;
    @Input() loanTypeId: number;
    @Input() customerId: number;
    @Input() set loanApplicationDetailId(value: number){
        if (value > 0){
            this.getApplicationDetail(value);
            this.GetFilteredProducts();
        }
    }
    @Input() productClassProcessId = 0;
    @Input() productClassId: number;
    @Input() customerName: string;
    @Input() newLoanApplicationId: number;
    @Input() ApplicationRef: number;
    

    @Output() facilityDetailsData = new EventEmitter<any[]>();
    // @Output() closeWindow = new EventEmitter<boolean>();
    @Output() openModification = new EventEmitter<boolean>();
    
    productTenor: number = 0;
    isCashedBacked: boolean = false;
    isTod: boolean = false;
    @Input() isAdhoc = false;
    constructor(private fb: FormBuilder, private casaService: CasaService, 
        private loanAppService: LoanApplicationService,
        private productService: ProductService, private loanService: LoanService, 
        private loadingSrv: LoadingService, private customerService: CustomerService,
        private camService: CreditAppraisalService, private zone: NgZone, 
        private dateUtilService: DateUtilService,
    ) {	 }
     
    // ngOnChanges(changes: SimpleChanges) {
    //     //Called before any other lifecycle hook. Use it to inject dependencies, but avoid any serious work here.
    //     //Add '${implements OnChanges}' to the class.
    //     if (value > 0){
    //         this.getApplicationDetail(value);
    //     }
    // }
	 ngOnInit() {
        // if(this.productClassId != ProductClassEnum.CREDITCARD){
        //     this.searchBasePlaceholder = "PRODUCTCLASS"; 
        // }
        // if(this.productClassId == ProductClassEnum.CREDITCARD){
        //     this.searchBasePlaceholder = "CREDITCARD"; 
        // }
        this.InitfacilityDetailsForm();
        this.loadDropdowns();
        this.getAllRepaymentSchedules();
    }

    loadDropdowns() {
        this.GetFilteredSubsector();
        // this.GetFilteredProducts();
        this.getAllLoanDetailReviewTypes();
        this.tenorTypes = TenorType.list;
        this.GetAllSectors();
        this.GetAllSubSectors();
    }

    GetAllSectors(){
        this.loadingSrv.show();
        this.loanAppService.getSector().subscribe((response: any) => {
            this.loadingSrv.hide();
            this.sectors = response.result;
        }, (err: HttpErrorResponse) => {
            this.loadingSrv.hide(1000);
        });
    }

    GetAllSubSectors(){
        this.loadingSrv.show();
        this.loanAppService.getSubSector().subscribe((response: any) => {
            this.loadingSrv.hide();
            this.subsectors = response.result;
        }, (err: HttpErrorResponse) => {
            this.loadingSrv.hide(1000);
        });
    }

    GetFilteredProducts() {
        if (this.productClassProcessId == null || this.productClassProcessId == undefined){
            return;
        }
        this.filteredProducts = [];
        this.loadingSrv.show();
        this.productService.getProductsByProductClassProcess(this.productClassProcessId).subscribe((response: any) => {
            this.loadingSrv.hide();
            this.filteredProducts = response.result;
            
            if(this.filteredProducts != null){
                this.filteredProducts = this.filteredProducts.filter(x=>x.usedByLos == true).sort();
            }
        }, (err: HttpErrorResponse) => {
            this.loadingSrv.hide(1000);
        });
    }

    GetFilteredSubsector() {
        this.filteredSubsector = [];
        this.loanAppService.getSubSector().subscribe((response: any) => {
            this.filteredSubsector = response.result;
        });
    }

    getAllLoanDetailReviewTypes(){
        this.loadingSrv.show();
        this.loanReviewTypes = [];
        this.loanAppService.getAllLoanDetailReviewTypes().subscribe((response: any) => {
            this.loadingSrv.hide();
            this.loanReviewTypes = response.result;
        }, (err: HttpErrorResponse) => {
            this.loadingSrv.hide(1000);
        });
    }

    getAllRepaymentSchedules() {
        this.loadingSrv.show();
        this.camService.getAllRepaymentSchedules().subscribe((res) => {
            this.loadingSrv.hide();
            this.repaymentPatterns = res.result;
        }, (err: HttpErrorResponse) => {
            this.loadingSrv.hide(1000);
        });
    }

    feesCollection: IProductFees[];

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
    
    showMessage(message: string, cssClass: string, title: string) {
        this.message = message;
        this.title = title;
        this.cssClass = cssClass;
        this.show = true;
    }

    resetForm(): void {
        this.facilityDetailsForm.reset();
        this.loanApplicationDetailId = 0;
    }

    InitfacilityDetailsForm() {
        this.facilityDetailsForm = this.fb.group({
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
            loanDetailReviewTypeId: ['', Validators.required]
        });
    }

    getApplicationDetail(id) {
        this.loadingSrv.show();
        this.loanAppService.getApplicationDetailFields(id).subscribe((response: any) => {
            this.loadingSrv.hide();
            this.resetForm();
            this.testObject = response.result;

            this.selectedDetailId = id;
            this.selectedProductId = response.result.approvedProductId;
            this.facilityDetailsForm.controls["approvedProductId"].setValue(response.result.approvedProductId);
            this.facilityDetailsForm.controls["approvedInterestRate"].setValue(response.result.approvedInterestRate);
            this.facilityDetailsForm.controls["approvedTenor"].setValue(response.result.approvedTenor);      
            this.facilityDetailsForm.controls["tenorModeId"].setValue(response.result.tenorModeId);
            this.facilityDetailsForm.controls["sectorId"].setValue(response.result.sectorId);
            this.facilityDetailsForm.controls["subSectorId"].setValue(response.result.subSectorId);
            this.facilityDetailsForm.controls["productClassId"].setValue(response.result.productClassId);
            this.facilityDetailsForm.controls["loanDetailReviewTypeId"].setValue(response.result.loanDetailReviewTypeId);
            this.facilityDetailsForm.controls["approvedAmount"].setValue(response.result.approvedAmount);
            this.onSectorClassChange(response.result.sectorId);
            // this.facilityDetailsForm.controls["productPriceIndexId"].setValue(response.result.productPriceIndexId);
            // this.facilityDetailsForm.controls["productPriceIndexRate"].setValue(response.result.productPriceIndexRate);
            // this.facilityDetailsForm.controls["productPriceIndexSpread"].setValue(response.result.productPriceIndexSpread);
            // this.facilityDetailsForm.controls["crmsPaymentSourceId"].setValue(response.result.crmsPaymentSourceId);
            // this.facilityDetailsForm.controls["loanPurpose"].setValue(response.result.loanPurpose);
            // this.facilityDetailsForm.controls["repaymentTerm"].setValue(response.result.repaymentTerm);
            // this.facilityDetailsForm.controls["repaymentScheduleId"].setValue(+response.result.repaymentScheduleId);
            // this.facilityDetailsForm.controls["isTakeOverApplication"].setValue(response.result.isTakeOverApplication);
            // this.facilityDetailsForm.controls["isLineFacility"].setValue(response.result.isLineFacility);
            // this.facilityDetailsForm.controls["operatingCasaAccountId"].setValue(response.result.operatingCasaAccountId);
            
            // // all
            // this.facilityDetailsForm.controls["casaAccountId"].setValue(response.result.casaAccountId);
            
            // invoice
            // this.facilityDetailsForm.controls["principalId"].setValue(extension.principalId);            
            // this.facilityDetailsForm.controls["invoiceCurrencyId"].setValue(extension.invoiceCurrencyId);
            // this.facilityDetailsForm.controls["invoiceAmount"].setValue(extension.invoiceAmount);
            // this.facilityDetailsForm.controls["contractDate"].setValue(new Date(extension.contractStartDate));
            // this.facilityDetailsForm.controls["contractExpiryDate"].setValue(new Date(extension.contractEndDate));
            

            // last
            // this.facilityDetailsForm.controls["currencyId"].setValue(response.result.currencyId);
            // this.onCurrencyChanged(response.result.currencyId);
            
        }, (err: HttpErrorResponse) => {
            this.loadingSrv.hide(1000);
        });
    }

    onSectorClassChange(id) {
        if (id == '' || id == null) {
            id = -1;
            this.filteredSubsector = [];
        }
        if (this.subsectors == null || this.subsectors == undefined){
            return;
        }
        this.filteredSubsector = this.subsectors.length > 0 ? this.subsectors.filter(x => x.sectorId == +id) : [];
    }

    updateFacilityDetails(){
        let body = {
            loanApplicationDetailId: this.selectedDetailId,
            approvedProductId: this.facilityDetailsForm.controls["approvedProductId"].value,
            approvedInterestRate: this.facilityDetailsForm.controls["approvedInterestRate"].value,
            approvedTenor: this.facilityDetailsForm.controls["approvedTenor"].value,      
            tenorModeId: this.facilityDetailsForm.controls["tenorModeId"].value,
            sectorId: this.facilityDetailsForm.controls["sectorId"].value,
            subSectorId: this.facilityDetailsForm.controls["subSectorId"].value,
            productClassId: this.facilityDetailsForm.controls["productClassId"].value,
            loanDetailReviewTypeId: this.facilityDetailsForm.controls["loanDetailReviewTypeId"].value,
            approvedAmount: this.facilityDetailsForm.controls["approvedAmount"].value,
            fees: this.feesCollection
        };

        this.loadingSrv.show();
        // this.loanAppService.modifyFacility(body, this.selectedDetailId).subscribe((res) => {
        this.loanAppService.saveFacilityModification(body).subscribe((res) => {
        this.loadingSrv.hide();
            if(res.success == true){
                this.updateSuccessful(res.message);
                swal(`${GlobalConfig.APPLICATION_NAME}`, res.message, 'success');
            }else{
            swal(`${GlobalConfig.APPLICATION_NAME}`, res.message, 'error');
            }
        }, (err) => {
            this.loadingSrv.hide(1000);
        });
    }

    endModificationAndRefresh(){
        this.openModification.emit(false);
    }

    updateSuccessful(action: string) {
        this.resetForm();
        this.endModificationAndRefresh();
        swal(`${GlobalConfig.APPLICATION_NAME}`, action, 'success');
    }

    validateTenor(approvedTenor) {
        if (this.tenorMode == undefined) {
            this.tenorMode = 1;
        }
        let amt = ConvertString.TO_NUMBER(approvedTenor);

        let approvedProductTenor = 0;


        if (this.tenorMode == 1 && amt==12) {
            approvedProductTenor = (amt * 30)+5;
        }
        if (this.tenorMode == 1 && amt !=12) {
            approvedProductTenor = amt * 30;
        }
        if (this.tenorMode == 2) {
            approvedProductTenor = amt;
        }
        if (this.tenorMode == 3) {
            approvedProductTenor = amt * 365;
        }
        
        if ((this.productTenor < approvedProductTenor) && (this.productTenor > 0)) {
            swal(`${GlobalConfig.APPLICATION_NAME}`, 'Tenor limit exceeded', 'error');
            this.facilityDetailsForm.get('approvedTenor').setValue("");
            return;
        }
    }

    validateTenor2(tenorMode) {
        if (tenorMode == undefined || tenorMode =="") {
            this.tenorMode = 1;
        }
        let amt = ConvertString.TO_NUMBER(this.approvedTenor);
        let approvedProductTenor = 0;
        if (this.tenorMode == 1 && amt==12) {
            approvedProductTenor = (amt * 30)+5;
        }
        if (this.tenorMode == 1 && amt !=12) {
            approvedProductTenor = amt * 30;
        }
        if (tenorMode == 2) {
            approvedProductTenor = amt;
        }
        if (tenorMode == 3) {
            approvedProductTenor = amt * 365;
        }
        
        if (this.productTenor < approvedProductTenor) {
            swal(`${GlobalConfig.APPLICATION_NAME}`, 'Tenor limit exceeded', 'error');
            this.facilityDetailsForm.get('approvedTenor').setValue("");
            return;
        }
    }

    emitFinishModification(){
        this.endModificationAndRefresh();
    }

}
