import { Injectable } from "@angular/core";
import { GlobalConfig } from "../constant/app.constant";
import { PrintModel } from "../models/print-model";

@Injectable()
export class PrintService {

    printDocument(_printObject: PrintModel): void {
        let printTitle = `${GlobalConfig.APPLICATION_NAME}`;
        let printContents, popupWin;
        printContents = _printObject.htmlDocument;
        popupWin = window.open('', '_blank', 'top=0,left=0,height=100%,width=auto');
        popupWin.document.open();
        popupWin.document.write(`
          <html>
            <head>
              <title>${printTitle}</title>
              <style>
                ${_printObject.htmlStyles}
              </style>
            </head>
            <body onload="window.print();window.close()">${printContents}</body>
          </html>`
        );
        popupWin.document.close();
    }
}