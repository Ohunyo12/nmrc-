import { UserGroup } from './user-group';
import { UserActivity } from './useractivity';
export interface User {
    staffId: number,
    username: string,
    password: string,
    confirmPassword: string,
    securityQuestion: string,
    securityAnswer: string,
    createdBy: number,
    group: UserGroup[],
    activities: UserActivity[],
}

export interface IUserProfile {
    username: string;
    isLoggedIn: boolean;
    accessToken: string;
    staffId: number;
}
