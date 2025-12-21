export class RiskGrandHeader {
    constructor(
        public grandHeaderId: number,
        public foreHeaderId: number,
        public grandName: string,
        public grandDiscription: string,
        public weight: number,
    ) { }
}