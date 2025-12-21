import { Component, OnInit, Output, EventEmitter, SimpleChanges, Input, OnChanges} from '@angular/core';
import { LoanApplicationService } from '../../../../services';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
//import { OnChanges } from '@angular/core/src/metadata/lifecycle_hooks';

@Component({
    selector: 'first-trader',
    templateUrl: './first-trader.component.html',
    // styleUrls: ['./name.component.scss']
})
export class FirstTraderComponent implements OnInit, OnChanges {
    marketLocations: any[] = [];
    traderLoan: FormGroup
    @Input() resetForm: boolean = false;
    @Output() firstTraders: EventEmitter<FormGroup> = new EventEmitter<FormGroup>();

    @Input() set extendedFormDefaultBody(value: any) {
        if (value != null) { this.setDefaultFormValues(value); }
    }

    constructor(private loanAppService: LoanApplicationService, private fb: FormBuilder, ) { }

    ngOnInit() {
        this.initTraderLoan();
        this.getApprovedMarket();
    }

    ngOnChanges(changes: SimpleChanges) {
        //Called before any other lifecycle hook. Use it to inject dependencies, but avoid any serious work here.
        //Add '${implements OnChanges}' to the class.
        if (this.resetForm)
            this.traderLoan.reset();
    }

    firstTrader(): void {
        if (this.traderLoan.valid)
            this.firstTraders.emit(this.traderLoan);
    }



    getApprovedMarket() {
        this.loanAppService.getApprovedMarkets().subscribe((response: any) => {
            this.marketLocations = response.result;
        });
    }

    initTraderLoan() {
        this.traderLoan = this.fb.group({
            marketId: ['', Validators.required],
            averageMonthlyTurnover: ['', Validators.required],
            soldItems: ['', Validators.required]
        })
    }

    setDefaultFormValues(body:any) {
        this.traderLoan.controls["marketId"].setValue(body.marketId);
        this.traderLoan.controls["averageMonthlyTurnover"].setValue(body.averageMonthlyTurnover);
        this.traderLoan.controls["soldItems"].setValue(body.soldItems);
    }
}