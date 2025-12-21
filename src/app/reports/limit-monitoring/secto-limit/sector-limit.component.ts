

import { Component, OnInit } from '@angular/core';
import { ReportService } from '../../service/report.service';
import { SafeResourceUrl, DomSanitizer } from '@angular/platform-browser';
import { LoadingService } from '../../../shared/services/loading.service';

@Component({

    templateUrl: 'sector-limit.component.html'

})
export class SectorLimitComponent implements OnInit {
    [x: string]: any;
    displayReport: boolean = false; reportSrc: SafeResourceUrl; showButton: boolean= false;
    constructor(private reportServ: ReportService, private sanitizer: DomSanitizer,
        private loadingService: LoadingService) { }

    ngOnInit() { }
    showPopup() {
        this.displayReport = true;
    }
    popoverSeeMore() {
        this.loadingService.show();
        // this.displayReport = false;
        let path: string = '';
        this.reportServ.getSectorLimit()
            .subscribe((response: any) => {
                path = response.result;
                this.reportSrc = this.sanitizer.bypassSecurityTrustResourceUrl(path);
                this.loadingService.hide(10000);
                this.showButton = true;
                this.displayReport = true;
            }); return;
    }


    // load data ..


}