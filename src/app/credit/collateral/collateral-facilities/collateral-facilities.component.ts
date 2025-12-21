import { Component, Input, OnInit } from '@angular/core';
import { CollateralService } from 'app/setup/services/collateral.service';
import { GlobalConfig } from 'app/shared/constant/app.constant';
import { LoadingService } from 'app/shared/services/loading.service';
import swal from 'sweetalert2';

@Component({
  selector: 'app-collateral-facilities',
  templateUrl: './collateral-facilities.component.html'
})
export class CollateralFacilitiesComponent implements OnInit {
	
	proposedfacilities: any[] = [];
	@Input() collateralId = 0;
	@Input() set reload(value: number) {
        if (value > 0) {
		this.getProposedFacilities(this.collateralId);
        } else {
            // this.refresh();
        }
    }
	constructor(
		private collateralService: CollateralService,
		private loadingService:LoadingService,
	) { }

	ngOnInit() {
	}

	getProposedFacilities(collateralId: number): void {
		if (collateralId <= 0){
			return;
		}
        this.loadingService.show();
        this.collateralService.getProposedFacilitiesToCollateralByCollateralId(collateralId).subscribe((response: any) => {
            this.proposedfacilities = response.result;
            this.loadingService.hide();
        }, (err) => {
			this.loadingService.hide(1000);
			swal(`${GlobalConfig.APPLICATION_NAME}`, JSON.stringify(err), 'error');
		});
	}

}
