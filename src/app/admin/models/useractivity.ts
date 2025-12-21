export class UserActivity {
    constructor(
        public userId: number,
        public activityId: number,
        public activityName: string,
        public activityParentId: number,
        public selected: boolean,
        public activityParentName: string,
        public activityNameandParent: string,
        public expireOn: Date,
    ) { }
}