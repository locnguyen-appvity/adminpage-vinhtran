import moment from 'moment';
import { MomentDateAdapter } from '@angular/material-moment-adapter';
import { Injectable } from '@angular/core';

@Injectable()
export class AppCustomDateAdapter extends MomentDateAdapter {
    format(date: any): string {
        let formatString = 'DD/MM/YYYY';
        return moment(date).format(formatString);
    }
    getFirstDayOfWeek(): number {
        return 1;
    }
}

export const CUSTOM_DATE_FORMATS = {
    parse: {
        dateInput: 'DD/MM/YYYY',
    },
    display: {
        dateInput: 'DD/MM/YYYY',
        monthYearLabel: 'MM/YYYY',
        dateA11yLabel: 'DD/MM/YYYY',
        monthYearA11yLabel: 'MM/YYYY',
    }
};
