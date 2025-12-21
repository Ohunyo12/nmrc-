export class UserNotification {
    message: string;
    actionUrl: string;
    count: number;
    constructor(obj?: any) {
        this.message = obj && obj.message || null;
        this.actionUrl = obj && obj.actionUrl || null;
        this.count = obj && obj.count || null;
    }
}