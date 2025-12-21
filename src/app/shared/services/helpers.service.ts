import { Injectable } from '@angular/core';



@Injectable()
export class HelperService {
    allacceptedExtention: Array<string> =  ['docx', 'pdf', 'PDF',
                                        'jpg', 'jpeg','png', 'PNG',
                                         'JPG', 'JPEG',
                                        'txt', 'xlsx', 'xls', 'doc', 'xml', 'zip', 'rar', 'msg'
                                    ];
    acceptedExtentionPicAndPdf: Array<string> =  ['pdf', 'jpg', 'jpeg', 'png'];
    constructor() { }

    fileExtention(name: string) {
        const regex = /(?:\.([^.]+))?$/;
        return regex.exec(name)[1];
    }

    durationToString(durationInMinute: number, addAgoFlag = true): string {
        
        const MINUTES = 1;
        const HOURS = 60 * MINUTES;

        const agoFlag = addAgoFlag ? "" : "";
        // const HOURS_TO_DAYS = MINUTES_TO_HOUR * 24
        if (durationInMinute < 60 * MINUTES) {
            return `${Math.floor(durationInMinute)} min ${agoFlag}`;
        }

        if (durationInMinute < 24 * HOURS) {
            const noOfHours = Math.floor(durationInMinute / (60 * MINUTES));
            const minutes = durationInMinute - noOfHours * (60 * MINUTES);

            return `${noOfHours} hr ${Math.floor(minutes)} min  ${agoFlag}`;
        }

        if (durationInMinute > 24 * HOURS) {
            let noOfHoursRemaining = 0;
            let minutesRemaining = 0;
            const noOfDays = Math.floor(durationInMinute / (24 * 60 * MINUTES));

            const noOfMinutesRemaining =
                durationInMinute - noOfDays * 24 * 60 * MINUTES;

            if (noOfMinutesRemaining > 60 * MINUTES) {
                noOfHoursRemaining = Math.floor(noOfMinutesRemaining / (60 * MINUTES));
                minutesRemaining = Math.floor(
                    noOfMinutesRemaining - noOfHoursRemaining * (60 * MINUTES)
                );
            }

            return `${noOfDays} days,  ${noOfHoursRemaining} hr, ${minutesRemaining} min  ${agoFlag}`;
        }
    }


}