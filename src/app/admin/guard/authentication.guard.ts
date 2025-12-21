import { MenuVisibiltyService } from '../../shared/services/role-menu.service';
import { AuthenticationService } from '../services/authentication.service';
import { Injectable } from '@angular/core';
import { Router, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';

@Injectable()
export class AuthGuard implements CanActivate {

    private canEnter: boolean = false;
    userInfo: any;

    constructor(
        private router: Router,
        private authService: AuthenticationService,
        private menuService: MenuVisibiltyService
    ) { }

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
        this.userInfo = this.authService.getUserInfo();
        this.authService.redirectUrl = state.url;
        
        
        if (sessionStorage.getItem('auth')) {

            let userActivities: any[] = this.authService.getLoggedInUserActivities();
            

            let allowedactivities = route.data['activities'] || [];
            


        this.canEnter = this.menuService.checkActivities(allowedactivities, userActivities) && this.verifyCorr(state.url);
            
            if (this.canEnter === true) {
                return this.canEnter;
            } else {
                this.router.navigate(['/auth/accessdenied'], { queryParams: { returnUrl: state.url } });
                return false;
            }
            
        }

        this.router.navigate(['/auth/login'], { queryParams: { returnUrl: state.url } });
        
        return false;
    }

    verifyCorr(activity: string): boolean {
        let activityNames = ['credit','approval'];

        if (this.userInfo.corrMatrixId > 0 && (this.userInfo.corrMatrixId == 4 || this.userInfo.corrMatrixId == 3) && this.stringArrayExists(activity, activityNames)) {
            return false;
        }
        return true;
    }

    stringArrayExists(target: string, source: string[]): boolean {
        for (let wd of source) {
            if (target.includes(wd)) {
                return true;
            }
        }
        return false;
    }
}