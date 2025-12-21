export class RiskRating {
    constructor(
        public riskRatingId: number,
        public rates: string,
        public maxRange: number,
        public minRange: number,
        public advicedRate: number,
        public ratesDescription: string,
        public productId: number
    ) { }
}
    