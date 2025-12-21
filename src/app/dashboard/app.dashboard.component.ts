import { Category } from '../setup/models/category';
import { MenuVisibiltyService } from '../shared/services/role-menu.service';

import { Component, ViewChild, OnInit, AfterViewInit } from '@angular/core';
import { UIChart } from 'primeng/primeng';
import { interval, observable, Observable } from 'rxjs';
import { SelectItem, ChartModule } from 'primeng/primeng';
import swal from 'sweetalert2';
import { AdminService, AuthenticationService } from '../admin/services';
import { DashboardService } from 'app/dashboard/dashboard.service';
import { Location } from '@angular/common';
import { Router } from '@angular/router';
import { timeInterval } from 'rxjs/operators';


const DEFAULT_COLORS = ['#3366CC', '#DC3912', '#FF9900', '#109618', '#990099',
    '#3B3EAC', '#0099C6', '#DD4477', '#66AA00', '#B82E2E',
    '#316395', '#994499', '#22AA99', '#AAAA11', '#6633CC',
    '#E67300', '#8B0707', '#329262', '#5574A6', '#3B3EAC']

@Component({
    templateUrl: 'app.dashboard.component.html'
})

export class DashboardComponent implements OnInit {
   @ViewChild('mixedChart', {static: false}) mixedChart: UIChart;
    cities: SelectItem[];

    cars: any[];

    chartData: any;

    events: any[];
    loanCount: any[];
    sumProposedAmount: any[];
    sectorName: any[]
    startDate: Date;
    endDate: Date;
    performing: number = 0;
    non_performing: number = 0;
    loanOnPileCount: any;
    loanOnPileSum: any;
    totalExposureData: any = {};
    ratingExposureData: any = {};
    selectedCity: any;
    staffRole: string;
    loanApplicationSummaryBySector: any;
    showFilter: boolean;
    showAMC: boolean = false;
    loanPerformanceStatus: any[] = [];
    disbursedLoan: any;
    performingCount: number = 0;
    non_performingCount: number = 0;
    pieCallteralFacilityAmount: any[];
    pieCollateralValue: any[];
    pieFintrakLabels: any[];
    pieFintrakData: any[];
    pieFintrakColors: any[];
    pieDisbursedLoanLabels: any[];
    pieDisbursedLoanData: any[];
    pieDisbursedLoanColors: any[];
    pieDisbursedLoanStatus: any;
    pieCollaterExposureColors: any[];
    pieChartDataList: any = {};
    pieChartDisbursedLoanList: any = {};
    loanRatingExposure: any[] = [];
    rating: any;
    ratingCount: any;
    currentDate: Date;
    collateralExposureList: any;
    approvedLoan: any;
    approvedLoanCount: any;
    approvedLoanFigure: any;
    riskExposure: any;
    riskExposureFigure: any;
    riskExposureCount: any;
    corrStyleClass: string = 'corr-moderate';
    corrResult: string = 'N/A';
    userInfo: any;
    inner = '<span class="corr-moderate"></span>';
    loanPerformanceStatusLms: any;
    loanOnPileCountLms: any;
    loanOnPileSumLms: number;
    LMS_OPERATION_ID: number = 46;
    approvedLoansLms: any;
    approvedLoansCountLms: any;
    approvedLoansSumLms: number;
    subLoanPerformanceStatus: any;
    subLoanOnPileCount: any;
    subLoanOnPileSum: number;
    /**
    #06a738
    #b27608
    #d70000 */
    constructor(private testSrv: MenuVisibiltyService,
        private adminService: AdminService,
        private authService: AuthenticationService,
        private dashboard: DashboardService,
        private router: Router
    ) { }

    ngOnInit() {
        //swal(`${GlobalConfig.APPLICATION_NAME}`, 'Operation cancelled', 'error');
        this.currentDate = new Date();
        this.userInfo = this.authService.getUserInfo();
        // console.log("user login information: " + JSON.stringify(this.userInfo));
        this.staffRole = this.userInfo.staffRole;
        if (this.userInfo.corrMatrixId == 1) {
            this.corrStyleClass = 'corr-low';
        }
        if (this.userInfo.corrMatrixId == 3) {
            this.corrStyleClass = 'corr-above-average'
        };
        if (this.userInfo.corrMatrixId == 4) {
            this.corrStyleClass = 'corr-high';
            swal({
                title: 'YOUR RISK RATING IS HIGH!!!',
                text: 'You Will be denied access to Credit And Approval features on this system',
                type: 'warning',
                background: '#ff0000',
                confirmButtonColor: '#166c8f',
                width: '1000px',
                grow: 'fullscreen',
                allowOutsideClick: false,
                allowEscapeKey: false,
                allowEnterKey: false

            });
        }




        /*   this.chartData = {
               labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July'],
               datasets: [
                   {
                       label: 'First Dataset',
                       data: [65, 59, 80, 81, 56, 55, 40],
                       fill: false,
                       borderColor: '#FFC107'
                   },
                   {
                       label: 'Second Dataset',
                       data: [28, 48, 40, 19, 86, 27, 90],
                       fill: false,
                       borderColor: '#03A9F4'
                   }
               ]
           }*/

        var d = new Date();
        var a = new Date(this.currentDate.setMonth(d.getMonth() - 12));
        this.startDate = a;
        this.endDate = new Date();

        this.getLoanApplicationBySector(this.startDate, this.endDate);
        this.getLoanPerformance(this.startDate, this.endDate);
        this.getLoanOnPipeline(this.startDate, this.endDate);
        this.getSubsLoanOnPipeline(this.startDate, this.endDate);
        this.getExposureByRating(this.startDate, this.endDate);
        this.getApprovedLoans(this.startDate, this.endDate);
        this.getRiskExposure(this.startDate, this.endDate);
        this.getDisbursedLoan(this.startDate, this.endDate);
        this.getLoansInPipelineLms();
        this.getApprovedLoansLms();
    }

    getCorr(): string {
        if (this.userInfo.corrMatrixId == 1) {
            return '<span class="corr-low"></span>';
        }
        if (this.userInfo.corrMatrixId == 2) {
            return '<span class="corr-above-average"></span>';
        };
        if (this.userInfo.corrMatrixId == 4) {
            return '<span class="corr-high"></span>';
        }
    }


    hoursByTeamChartData = {

        labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
        datasets: [
            {
                label: 'Term',
                backgroundColor: DEFAULT_COLORS[0],
                data: [65, 59, 80, 55, 67, 73]
            },
            {
                label: 'Revolving',
                backgroundColor: DEFAULT_COLORS[1],
                data: [44, 63, 57, 90, 77, 70]
            },
            // {
            //     label: 'Contigent',
            //     backgroundColor: DEFAULT_COLORS[2],
            //     data: [67, 38, 43, 86, 56, 80]
            // }
        ]
    }

    hoursByProject: any[] =
        [
            { id: 1, name: 'Term', hoursSpent: 8 },
            { id: 2, name: 'Revolving Loan', hoursSpent: 16 },
            { id: 3, name: 'Self Liquidating Loan', hoursSpent: 24 },
        ];

    LoanPerformance = [
        { id: 1, name: this.performing, hoursSpent: this.performingCount },
        { id: 2, name: this.non_performing, hoursSpent: this.non_performingCount },
    ];

    chartOptions = {
        title: {
            display: true,
            text: 'Facility Performance'
        },
        legend: {
            position: 'bottom'
        },
    };

    pieLabels = this.hoursByProject.map((proj) => proj.name);
    pieData = this.hoursByProject.map((proj) => proj.hoursSpent);
    pieColors = this.configureDefaultColours(this.pieData);


    private configureDefaultColours(data: number[]): string[] {
        let customColours = []
        if (data.length) {

            customColours = data.map((element, idx) => {
                return DEFAULT_COLORS[idx % DEFAULT_COLORS.length];
            });
        }

        return customColours;
    }



    hoursByProjectChartData = {
        labels: this.pieLabels,
        datasets: [
            {
                data: this.pieData,
                backgroundColor: this.pieColors
            }
        ]
    }


    disbursedLoanData = {
        labels: this.pieLabels,
        datasets: [
            {
                data: this.pieData,
                backgroundColor: this.pieColors
            }
        ]
    }


    hoursByTeamChartDataMixed = {

        labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
        datasets: [
            {
                label: 'Principal',
                type: 'bar',
                backgroundColor: DEFAULT_COLORS[0],
                data: [65, 59, 80, 55, 67, 73]
            },
            {
                label: 'Interest',
                type: 'line',
                backgroundColor: DEFAULT_COLORS[1],
                data: [44, 63, 57, 90, 77, 70]
            }
        ]

    }

    onDataSelect(event) {

        let dataSetIndex = event.element._datasetIndex;
        let dataItemIndex = event.element._index;

        let labelClicked = this.hoursByTeamChartDataMixed.datasets[dataSetIndex].label;
        let valueClicked = this.hoursByTeamChartDataMixed.datasets[dataSetIndex].data[dataItemIndex];
        swal('Fintrak Banking', `Accured ${labelClicked} equals  ${valueClicked} Million Naira`, 'success');
    }
    ngAfterViewInit() {
        interval(1000).pipe(timeInterval()).subscribe(() => {

            var hoursByTeam = this.hoursByTeamChartDataMixed.datasets;
            var randomised = hoursByTeam.map((dataset) => {

                dataset.data = dataset.data.map((hours) => hours * (Math.random() * 2));

            });
            //  this.mixedChart.refresh();
        });

    }


    getLoanApplicationBySector(startDate, endDate) {
        let data = {
            startDate: startDate,
            endDate: endDate
        }
        ////console.log('data Dtate>>',data);

        this.dashboard.loanApplicationBysector(data)
            .subscribe(results => {
                this.loanApplicationSummaryBySector = results.result;
                this.loanCount = [];
                this.sumProposedAmount = [];
                this.sectorName = []
                if (this.loanApplicationSummaryBySector != null || this.loanApplicationSummaryBySector != undefined) {
                    this.loanApplicationSummaryBySector.forEach(data => {
                        //  if(this.loanCount.length < 6){
                        this.loanCount.push(data.loanCount)
                        this.sumProposedAmount.push(Number(data.sumOfProposedAmount) / 1000000000)
                        this.sectorName.push(data.sectorName.substr(0, 5))
                        //  }
                    });
                    this.totalExposureData = {
                        labels: this.sectorName,
                        datasets: [
                            {
                                label: 'Count(Unit)',
                                backgroundColor: DEFAULT_COLORS[0],
                                data: this.loanCount
                            },
                            {
                                label: 'Amount(In Billion Naira)',
                                backgroundColor: DEFAULT_COLORS[1],
                                data: this.sumProposedAmount
                            }]
                    }
                }
                ////console.log('this.loanApplicationSummaryBySector',this.loanApplicationSummaryBySector);
            });


    }
    getExposureByRating(startDate, endDate) {
        let data = {
            startDate: startDate,
            endDate: endDate
        }
        this.dashboard.loanRiskByExposure(data).subscribe(results => {
            this.loanRatingExposure = results.result;
            this.loanCount = [];
            this.rating = []
            if (this.loanRatingExposure.length != 0) {
                this.ratingCount = this.loanRatingExposure.map((data) => data.loanCount)
                this.rating = this.loanRatingExposure.map((data) => data.riskRating)//.substr(0, 5))

                //  }
                this.ratingExposureData = {
                    labels: this.sectorName,
                    datasets: [
                        {
                            label: 'Count(Unit)',
                            backgroundColor: DEFAULT_COLORS[0],
                            data: this.ratingCount
                        },
                        {
                            label: 'RisK Rate',
                            backgroundColor: DEFAULT_COLORS[1],
                            data: this.rating
                        }]
                }
            }
            ////console.log('this.loanRatingExposure',this.loanRatingExposure);
        });


    }
    getLoanPerformance(startDate, endDate) {
        let data = {
            startDate: startDate,
            endDate: endDate
        }
        ////console.log('data Dtate>>',data);

        this.dashboard.loanApplicationPerformance(data)
            .subscribe(response => {
                this.disbursedLoan = response.result;
                if (this.disbursedLoan != undefined) {
                    this.pieFintrakLabels = this.disbursedLoan.map((proj) => proj.name);
                    this.pieFintrakData = this.disbursedLoan.map((proj) => proj.hoursSpent);
                    this.pieFintrakColors = this.configureDefaultColours(this.pieFintrakData);
                }


                this.pieChartDataList = {
                    labels: this.pieFintrakLabels,
                    datasets: [
                        {
                            data: this.pieFintrakData,
                            backgroundColor: this.pieFintrakColors
                        }
                    ]
                }
            });
    }



    getDisbursedLoan(startDate, endDate) {
        let data = {
            startDate: startDate,
            endDate: endDate
        }
        ////console.log('data Dtate>>',data);

        this.dashboard.loanDisbursedLoan(data)
            .subscribe(response => {
                this.pieDisbursedLoanStatus = response.result;

                ////console.log('pieDisbursedLoanStatus',this.pieDisbursedLoanStatus);

                if (this.pieDisbursedLoanStatus != undefined) {
                    this.pieDisbursedLoanLabels = this.pieDisbursedLoanStatus.map((proj) => proj.type);
                    ////console.log('  this.pieDisbursedLoanLabels',  this.pieDisbursedLoanLabels);

                    this.pieDisbursedLoanData = this.pieDisbursedLoanStatus.map((proj) => proj.count);
                    ////console.log('this.pieDisbursedLoanData ',this.pieDisbursedLoanData )
                    this.pieDisbursedLoanColors = this.configureDefaultColours(this.pieDisbursedLoanData);
                }


                this.pieChartDisbursedLoanList = {
                    labels: this.pieDisbursedLoanLabels,
                    datasets: [
                        {
                            data: this.pieDisbursedLoanData,
                            backgroundColor: this.pieDisbursedLoanColors
                        }
                    ]
                }
            });
    }

    getLoanOnPipeline(startDate, endDate) {
        let data = {
            startDate: startDate,
            endDate: endDate
        }

        this.dashboard.loansOnPipeline(data)
            .subscribe(results => {
                this.loanPerformanceStatus = results.result;

                if (this.loanPerformanceStatus.length != 0) {
                    this.loanOnPileCount = this.loanPerformanceStatus[0].loanCount;
                    this.loanOnPileSum = this.loanPerformanceStatus[0].sumOfProposedAmount / 1000000000;
                } else {
                    this.loanOnPileCount = 0;
                    this.loanOnPileSum = 0;
                }
            });
    }

    getSubsLoanOnPipeline(startDate, endDate) {
        let data = {
            startDate: startDate,
            endDate: endDate
        }

        this.dashboard.subsLoansOnPipeline(data)
            .subscribe(results => {
                this.subLoanPerformanceStatus = results.result;

                if (this.subLoanPerformanceStatus.length != 0) {
                    this.subLoanOnPileCount = this.subLoanPerformanceStatus[0].loanCount;
                    this.subLoanOnPileSum = this.subLoanPerformanceStatus[0].sumOfProposedAmount / 1000000000;
                } else {
                    this.subLoanOnPileCount = 0;
                    this.subLoanOnPileSum = 0;
                }
            });
    }

    getLoansInPipelineLms() {
        this.dashboard.getLoansInPipelineLms(this.LMS_OPERATION_ID).subscribe(results => {
            this.loanPerformanceStatusLms = results.result;

            if (this.loanPerformanceStatusLms != null) {
                this.loanOnPileCountLms = this.loanPerformanceStatusLms.loanCount;
                this.loanOnPileSumLms = this.loanPerformanceStatusLms.sumOfProposedAmount / 1000000000;
            } else {
                this.loanOnPileCountLms = 0;
                this.loanOnPileSumLms = 0;
            }
        });
    }

    getApprovedLoansLms() {
        this.dashboard.getApprovedLoansLms().subscribe(results => {
            this.approvedLoansLms = results.result;

            if (this.approvedLoansLms != null) {
                this.approvedLoansCountLms = this.approvedLoansLms.loanCount;
                this.approvedLoansSumLms = this.approvedLoansLms.sumOfProposedAmount / 1000000000;
            } else {
                this.approvedLoansCountLms = 0;
                this.approvedLoansSumLms = 0;
            }
        });
    }

    GetFilterRecord() {
        this.getLoanApplicationBySector(this.startDate, this.endDate);
        this.getLoanPerformance(this.startDate, this.endDate);
        this.getLoanOnPipeline(this.startDate, this.endDate);
        this.getSubsLoanOnPipeline(this.startDate, this.endDate);
        this.getExposureByRating(this.startDate, this.endDate);
        this.getApprovedLoans(this.startDate, this.endDate);
        this.getRiskExposure(this.startDate, this.endDate);
        this.getDisbursedLoan(this.startDate, this.endDate);
        this.showFilter = false;
    }
    ShowFilter() {
        this.showFilter = true;
    }


    getCollateralExposure(startDate, endDate) {
        let data = {
            startDate: startDate,
            endDate: endDate
        }
        ////console.log('data Dtate>>',data);

        this.dashboard.collateralExposure(data)
            .subscribe(response => {
                this.collateralExposureList = response.result;
                if (this.collateralExposureList != undefined) {
                    this.pieCallteralFacilityAmount = this.collateralExposureList.map((proj) => proj.facilityAmount);
                    this.pieCollateralValue = this.collateralExposureList.map((proj) => proj.collateralValue);
                    this.pieCollaterExposureColors = this.configureDefaultColours(this.pieFintrakData);
                }


                this.pieChartDataList = {
                    labels: this.pieFintrakLabels,
                    datasets: [
                        {
                            data: this.pieFintrakData,
                            backgroundColor: this.pieFintrakColors
                        }
                    ]
                }
            });
    }

    getApprovedLoans(startDate, endDate) {
        let data = {
            startDate: startDate,
            endDate: endDate
        }
        ////console.log('data Dtate>>',data);

        this.dashboard.approvedLoan(data)
            .subscribe(response => {
                this.approvedLoan = response.result;
                ////console.log('this.approvedLoan ',this.approvedLoan);

                if (this.approvedLoan.length != 0) {
                    this.approvedLoanCount = this.approvedLoan[0].loanCount;
                    this.approvedLoanFigure = this.approvedLoan[0].sumOfProposedAmount / 1000000000;
                } else {
                    this.approvedLoanCount = 0;
                    this.approvedLoanFigure = 0;
                }
            });
    }

    getRiskExposure(startDate, endDate) {
        let data = {
            startDate: startDate,
            endDate: endDate
        }
        ////console.log('data Dtate>>',data);

        this.dashboard.totalRiskExposure(data)
            .subscribe(response => {
                this.riskExposure = response.result;
                ////console.log('this.riskExposure',this.riskExposure);

                //if(this.riskExposure.length!=0){
                if (this.riskExposure != 0) {
                    this.riskExposureCount = this.riskExposure[0].loanCount;
                    this.riskExposureFigure = this.riskExposure[0].sumOfProposedAmount / 1000000000;
                } else {
                    this.riskExposureCount = 0;
                    this.riskExposureFigure = 0;

                }
            });


    }

    testData: any;

    test(point) {
        const body = {
            applicationId: 9006,
            staffId: 1558,
            checkListIndex: 1,
        };
        // this.testSrv.test(body).subscribe((response) => {
        //     ////console.log('TEST RESPONSE: ==> ', JSON.stringify(response));
        // });
        // this.testSrv.test(12388).subscribe((response) => {
        //     this.testData = response;
        //     ////console.log('TEST RESPONSE: ==> ', JSON.stringify(response));
        // });
        this.testSrv.test(point).subscribe((response) => {
            this.testData = response;
            //console.log('TEST RESPONSE: ==> ', JSON.stringify(response));
        });
    }



    goTo() {
        //alert("Testing!");
        this.router.navigate(['/credit/appraisal/credit-appraisal']);
    }

    goToLms() {
        this.router.navigate(['/credit/loan-review-approval/appraisal']);
    }
}