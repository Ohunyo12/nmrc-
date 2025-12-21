import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { GroupsActivitiesComponent } from './user-groups-activities/groups-activities.component';
import { UserProfileComponent } from './user-profile/user-profile.component';
import { AuthenticationService } from '../admin/services';


@NgModule({
    declarations: [GroupsActivitiesComponent, UserProfileComponent],
    imports: [CommonModule],
    exports: [FormsModule],
    providers: [AuthenticationService],
})
export class FeatureModule { }