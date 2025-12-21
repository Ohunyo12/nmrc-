import { Component, OnInit, Input } from '@angular/core';
import { FormControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { LoadingService } from '../../../shared/services/loading.service';
import { OfficerRiskRatingService } from '../../services/officer-risk-rating.service'; // TODO: modify path!

@Component({
    templateUrl: 'officer-risk-rating.component.html',
    selector: 'officer-risk-rating',
    providers: [OfficerRiskRatingService, LoadingService]
})
export class OfficerRiskRatingComponent implements OnInit {

    // ------------------- declarations -----------------

    @Input() panel: boolean = false;
    @Input() label: string = '';

    @Input() set reload(value: number) { if (value > 0) this.getOfficerRatings(); }

    formState: string = 'New';
    selectedId: number = null;
    corr: any = null;

    officerRatings: any[] = [];
    currentRatingDetails: any;
    officerRatingForm: FormGroup = this.fb.group({});
    displayOfficerRatingForm: boolean = false;
    displayOfficerRatingDetail: boolean = false;
    displayCreditOfficerSearch: boolean = false;
    readonly: boolean = false;

    selectedCreditOfficer: string = '';
    selectedCreditOfficerId: number = null;

    // ---------------------- init ----------------------

    constructor(
        private fb: FormBuilder,
        private loadingService: LoadingService,
        private officerRiskRatingService: OfficerRiskRatingService,
    ) { }

    ngOnInit() {
        this.clearControls();
        //this.getOfficerRatings();
        // this.getOfficerRatingsFake();
        this.getRatingPeriods();
        this.getCreditOfficerRatingSetup();
        // this.displayOfficerRatingForm = true;
        this.initializeDynamicForm();
    }

    initializeDynamicForm() {
        if (this.corr == null) return;
        //this.categoriesCount = this.corr.count;
        let formControls = {};
        for (let c of this.corr.keyIndicators) {
            for (let f of c.parameters) {
                formControls[f.id] = f.hasException ? new FormControl(f.value) : new FormControl(f.value, [Validators.required, Validators.max(f.weight)]);
            }
        }
        this.officerRatingForm = this.fb.group(formControls);
    }

    // ------------------- api-calls --------------------

    saveOfficerRating(form) {
        let body = {
            creditOfficerId: this.selectedCreditOfficerId,
            assessment: Object.keys(form.value).map(key => { return { parameterId: key, score: form.value[key] } }), //form.value,
        };
        this.loadingService.show();
        this.officerRiskRatingService.saveOfficerRating(body).subscribe((response: any) => {
            this.loadingService.hide();
            if (response.success == true) {
                this.finishGood(response.message);
                this.displayOfficerRatingForm = false;
                this.creditOfficers = [];
            }
            else this.finishBad(response.message);
        });
    }

    getOfficerRatings() {
        this.officerRiskRatingService.getOfficerRatings().subscribe((response: any) => {
            this.officerRatings = response.result;
        });
    }

    getCreditOfficerRatingSetup() {
        // this.corr = {
        //     keyIndicators: [
        //         {
        //             keyIndicatorName: 'KIND 1', keyIndicatorWeight: 35, parameters: [
        //                 { id: 1, parameterName: 'ewew 4566 456', weight: 3 },
        //                 { id: 2, parameterName: 'Param deesssss 456', weight: 33 },
        //                 { id: 8, parameterName: 'w wwwwwww www 456', weight: 6 },
        //             ]
        //         },
        //         {
        //             keyIndicatorName: 'KIND 2', keyIndicatorWeight: 65, parameters: [
        //                 { id: 12, parameterName: 'ewwww 4566 456 Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate', weight: 27 },
        //                 { id: 5, parameterName: 'pooooo 4566 456', weight: 9 },
        //             ]
        //         },
        //     ],
        // };
        this.officerRiskRatingService.getOfficerRatingAssessmentParameters().subscribe((response: any) => {
            this.corr = response.result;
            this.initializeDynamicForm();
        });
    }

    reloadGrid() {
        this.displayOfficerRatingForm = false;
        this.getOfficerRatings();
    }

    creditOfficerSearch() {

    }

    // ---------------------- form ----------------------

    clearControls() {
        this.formState = 'New';
        this.ratingPeriodForm = this.fb.group({
            startDate: ['', Validators.required],
            endDate: ['', Validators.required],
        });
        this.creditOfficerSearchForm = this.fb.group({
            searchString: ['', Validators.required],
        });
    }

    // editOfficerRating(row) {
    //     this.clearControls();
    //     this.formState = 'Edit';
    //     this.selectedId = row.officerRatingId;
    //     this.officerRatingForm = this.fb.group({
    //         staffId: [row.staffId, Validators.required],
    //         ratingPeriodId: [row.ratingPeriodId, Validators.required],
    //     });
    //     this.displayOfficerRatingForm = true;
    // }

    showOfficerRatingDetail(row) {
        this.selectedCreditOfficer = row.creditOfficerName;
        if (row.corrComment == 'NOT RATED') return;
        this.loadingService.show();
        this.officerRiskRatingService.getCurrentCreditOfficerRiskRating(row.staffId).subscribe((response: any) => {
            this.loadingService.hide();
            this.currentRatingDetails = response.result;
            this.displayOfficerRatingDetail = true;
        }, (err: any) => {
            this.loadingService.hide();
        });

        // this.displayOfficerRatingDetail = true;
        // this.currentRatingDetails = {
        //     score: 23,
        //     comment: 'HIGH RISK',
        //     indicators: [
        //         { id: 1, name: 'cuuueu3euu 4566', score: 87 },
        //         { id: 2, name: 'cuuueue44uu 43332 rre', score: 9 },
        //         { id: 3, name: 'cuuueue45uu 788 gtrrr', score: 45 },
        //     ],
        //     parameters: [
        //         { id: 1, name: '2 4566', score: 3 },
        //         { id: 2, name: '2 43332 rre', score: 3 },
        //         { id: 3, name: 'e 788 gtrrr', score: 2 },
        //     ],
        // };
    }

    showOfficerRatingForm(row) {
        this.clearControls();
        this.selectedCreditOfficer = row.creditOfficerName;
        this.selectedCreditOfficerId = row.staffId;
        this.displayOfficerRatingForm = true;
    }

    // ---------------------- message ----------------------

    show: boolean = false; message: any; title: any; cssClass: any;

    finishGood(message) { 
        this.showMessage(message, 'success', "FintrakBanking");
        this.loadingService.hide(); 
    }

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

// -------------------------------------------------SEARCH---------------

    creditOfficers: any[] = [];
    creditOfficerSearchForm: FormGroup;


    submitCreditOfficerSearch(form) {
        let body = {
            searchString: form.value.searchString,
        };
        this.loadingService.show();
        this.officerRiskRatingService.submitCreditOfficerSearch(body).subscribe((response: any) => {
                this.loadingService.hide();
            // if (response.success == true)
            this.creditOfficers = response.result;    
            this.displayCreditOfficerSearch = false;
                // else this.finishBad(response.message);
            }, (err: any) => {
                this.loadingService.hide();
                this.finishBad(JSON.stringify(err));
            });
    }


    showCreditOfficerSearchForm() {
        this.clearControls();
        this.selectedId = null;
        this.displayCreditOfficerSearch = true;
    }


// -------------------------------------------------RATING-PERIOD---------------

    ratingPeriods: any[] = [];
    ratingPeriodForm: FormGroup;
    displayRatingPeriodForm: boolean = false;

    ratingPeriodsModal() {
        this.displayRatingPeriodForm = true;
    }

    saveRatingPeriod(form) {
        let body = {
            startDate: form.value.startDate,
            endDate: form.value.endDate,
        };
        this.loadingService.show();
        if (this.selectedId === null) {
            this.officerRiskRatingService.saveRatingPeriod(body).subscribe((response: any) => {
                this.loadingService.hide();
                if (response.success == true) this.reloadRatingPeriodGrid();
                else this.finishBad(response.message);
            }, (err: any) => {
                this.loadingService.hide();
                this.finishBad(JSON.stringify(err));
            });
        } else {
            this.officerRiskRatingService.updateRatingPeriod(body, this.selectedId).subscribe((response: any) => {
                this.loadingService.hide();
                if (response.success == true) this.reloadRatingPeriodGrid();
                else this.finishBad(response.message);
            }, (err: any) => {
                this.loadingService.hide();
                this.finishBad(JSON.stringify(err));
            });
        }
    }

    reloadRatingPeriodGrid() {
        // this.displayRatingPeriodForm = false;
        this.clearControls();
        this.getRatingPeriods();
    }

    getRatingPeriods() {
        this.officerRiskRatingService.getRatingPeriods().subscribe((response: any) => {
            this.ratingPeriods = response.result;
        });
    }








    //
    getOfficerRatingsFake() {
        this.officerRatings = [
            {
                creditOfficerName: 'dfghyjukiooiuhyg dfgtyhuiop',
corrScore: 67,
corrComment: 'HIGH RISK',
dateRated: new Date(),
                }
            ];
    }
}
