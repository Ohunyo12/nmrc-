import { Injectable } from '@angular/core';

@Injectable()
export class DateUtilService {

    constructor() { }

    public dateAdd(date, interval, units): Date {
        var ret = new Date(date);
        switch (interval.toLowerCase()) {
            case 'year': ret.setFullYear(ret.getFullYear() + units); break;
            case 'quarter': ret.setMonth(ret.getMonth() + 3 * units); break;
            case 'month': ret.setMonth(ret.getMonth() + units); break;
            case 'week': ret.setDate(ret.getDate() + 7 * units); break;
            case 'day': ret.setDate(ret.getDay() + units); break;
            case 'hour': ret.setTime(ret.getTime() + units * 3600000); break;
            case 'minute': ret.setTime(ret.getTime() + units * 60000); break;
            case 'second': ret.setTime(ret.getTime() + units * 1000); break;
            default: ret = undefined; break;
        }

        return ret;
        //return `${ret.getDate()}/${ret.getMonth() + 1}/${ret.getFullYear()}`;
    }


    public formatJsonDate(date) {
        var jsonDate = new Date(date);
        let month = Number((jsonDate.getMonth() + 1)) < 10 ? '0' + (jsonDate.getMonth() + 1) : (jsonDate.getMonth() + 1);
        let day = Number(jsonDate.getDate()) < 10 ? '0' + jsonDate.getDate() : jsonDate.getDate();
        let year = Number(jsonDate.getFullYear());

        return day + '/' + month + '/' + year;
    }

    public dateDiff(date1, date2) {
        var dt1 = new Date(date1);
        var dt2 = new Date(date2);
        return Math.floor((Date.UTC(dt2.getFullYear(), dt2.getMonth(), dt2.getDate()) - Date.UTC(dt1.getFullYear(), dt1.getMonth(), dt1.getDate())) / (1000 * 60 * 60 * 24));
    }
}