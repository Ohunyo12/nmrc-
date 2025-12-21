export class RiskParentHeader {
    constructor(
        public parentHeaderId: number,
        public grandHeaderId: number,
        public parentName: string,
        public parentDiscription: string,
        public weight: number
    ) { }
}
    