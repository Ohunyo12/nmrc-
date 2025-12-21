import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';
import { LoadingService } from 'app/shared/services/loading.service';
import { LetterOfCreditService } from 'app/credit/services/letter-of-credit.service';
import { ApplicationStatus } from 'app/shared/constant/app.constant';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { CurrencyService } from 'app/setup/services/currency.service';

@Component({
selector: 'app-lc-search',
templateUrl: './lc-search.component.html'
})
export class LcSearchComponent implements OnInit {

    LCapplications: any[];
    lcEnhancements: any[] = [];
    lcUsanceExtensions: any[] = [];
    activeTabindex = 0;
    searchForm: FormGroup;

    searchString: string;
    displaySearchTable: boolean = true;
    displaySearchForm: boolean = false;
    showLCDetailsDialog: boolean = false;
    selectedLCApplication: any;
    reload = 0;
    releaseAmount: number;
    lcReleaseAmountId: number;
    lcUssanceId: number;
    currencies: any[];
    listShown= 0;
    @Input() isForLMSSearch = false;
    @Input() isLcCancelation = false;
    @Input() isLCEnhancement = false;
    @Input() isLCExtension = false;
    @Input() isLCUssanceExtension = false;
    @Output() LcEmitter: EventEmitter<any> = new EventEmitter<any>();
    // @Output() resetTabs: EventEmitter<boolean> = new EventEmitter<boolean>();

constructor(private lcService: LetterOfCreditService,
            private fb: FormBuilder,
            private currencyService: CurrencyService,
            private loadingService: LoadingService) 
            { }

ngOnInit() {
    this.clearControls();
    this.getAllCurrencies();
}


    showSearchForm() { this.displaySearchForm = true; }

    onTabChange(event) { 
        this.activeTabindex = event.index;
    }

    clearControls() {
        this.searchForm = this.fb.group({
            searchString: ['', Validators.required],
        });
    }

    getAllCurrencies() {
        this.currencyService.getAllCurrencies().subscribe((res) => {
            this.currencies = res.result;
            // console.log("currencies", this.currencies);
        }, (err) => {
            ////console.log(err);
        });
    }
    
    getLoanApplicationStatus(id) {
        let item = ApplicationStatus.list.find(x => x.id == id);
        return item == null ? 'n/a' : item.name;
    }

    getCurrencyCode(value): string {
        if ((value == undefined) || (value == null)) {
          //  console.log('value =>' + value);
            return '';
        }
        if ((this.currencies == undefined) || (this.currencies == null)) {return;}
        let currency = this.currencies.find(c => c.currencyId == value);
        return currency.currencyCode;
    }

    submitForm(form) {
        this.searchString = form.value.searchString;
        
        if(this.isForLMSSearch){
            this.loadingService.show();
            this.lcService.searchForLCLMS(this.searchString).subscribe((response: any) => {
                this.LCapplications = response.result;
                this.lcEnhancements = [];
                this.loadingService.hide();
                this.displaySearchForm = false;
                this.displaySearchTable = true;
                // this.displayApplicationDetail = false;
            }, (err: any) => {
                this.loadingService.hide(1000);
            });
        }else{
            this.loadingService.show();
            this.lcService.searchForLC(this.searchString).subscribe((response: any) => {
                this.LCapplications = response.result;
                this.lcEnhancements = [];
                this.loadingService.hide();
                this.displaySearchForm = false;
                this.displaySearchTable = true;
                // this.displayApplicationDetail = false;
            }, (err: any) => {
                this.loadingService.hide(1000);
            });
        }
    this.activeTabindex = 0;
    }

    view(row) {
        this.selectedLCApplication = undefined;
        this.releaseAmount = row.releaseAmount;
        this.lcReleaseAmountId = row.lcReleaseAmountId;
        this.lcUssanceId = row.lcUssanceId;
        ++this.reload;
        this.selectedLCApplication = row;
        this.showLCDetailsDialog = true;
    }

    viewCancelation(row) {
        this.selectedLCApplication = undefined;
        this.releaseAmount = row.releaseAmount;
        this.lcReleaseAmountId = row.lcReleaseAmountId;
        this.lcUssanceId = row.lcUssanceId;
        this.isLcCancelation = true;
        ++this.reload;
        this.selectedLCApplication = row;
        this.showLCDetailsDialog = true;
    }

    viewEnhancement(row){
        this.selectedLCApplication = undefined;
        this.releaseAmount = row.releaseAmount;
        this.lcReleaseAmountId = row.lcReleaseAmountId;
        this.lcUssanceId = row.lcUssanceId;
        this.isLCEnhancement = true;
        ++this.reload;
        this.selectedLCApplication = row;
        this.showLCDetailsDialog = true;
        // this.LcEmitter.emit(this.selectedLCApplication);
    }

    viewExtension(row){
        this.selectedLCApplication = undefined;
        this.releaseAmount = row.releaseAmount;
        this.lcReleaseAmountId = row.lcReleaseAmountId;
        this.lcUssanceId = row.lcUssanceId;
        this.isLCExtension = true;
        ++this.reload;
        this.selectedLCApplication = row;
        this.showLCDetailsDialog = true;
        // this.LcEmitter.emit(this.selectedLCApplication);
    }

    showEnhancementList(row){
        this.lcEnhancements = row.lcEnhancements;
        this.listShown = 1;//for enhancement
        this.activeTabindex = 1;
    }

    showExtensionList(row){
        this.lcEnhancements = row.lcExtensions;
        this.listShown = 2;//for extension
        this.activeTabindex = 1;
    }

    showUsanceExtensionList(row){
        this.lcEnhancements = row.lcUsanceExtensions;
        this.activeTabindex = 1;
    }

    closeLcDetailsDialog() {
        // this.isForLMSSearch = false;
        // if(this.isLcCancelation == true){
        // this.isForLMSSearch = true;
        // }
        if (this.isForLMSSearch == true){
            this.isLcCancelation = false;
        }
        this.isLCEnhancement = false;
        this.isLCExtension = false;
        this.listShown = 0;
        this.reload = 0;
        this.showLCDetailsDialog = false;
    }

    show: boolean = false; message: any; title: any; cssClass: any; // message box

    finishBad(message) {
        this.showMessage(message, 'error', "FintrakBanking");
    }

    finishGood(message) {
        this.showMessage(message, 'success', "FintrakBanking");
5    }

    showMessage(message: string, cssClass: string, title: string) {
        this.message = message;
        this.title = title;
        this.cssClass = cssClass;
        this.show = true;
    }

    hideMessage(event) {
        this.show = false;
    }
}
