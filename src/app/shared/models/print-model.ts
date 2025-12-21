export class PrintModel {
    documentTitle?: string;
    htmlDocument: string;
    htmlStyles?: string;

    constructor(_documentTitle?:string, _htmlDocument?: string, _htmlStyles?:string) {
        this.documentTitle = _documentTitle;
        this.htmlDocument = _htmlDocument;
        this.htmlStyles = _htmlStyles;
    }
}