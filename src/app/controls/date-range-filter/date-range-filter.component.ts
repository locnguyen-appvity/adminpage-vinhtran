import { distinctUntilChanged, share, takeUntil } from 'rxjs/operators';
import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { NavigationEnd, NavigationStart, Router } from '@angular/router';
import { CustomDateRangeComponent } from './custom-date-picker/custom-date-range.component';
import { SimpleBaseComponent } from 'src/app/shared/simple.base.component';
import { SharedPropertyService } from 'src/app/shared/shared-property.service';
import { CommonUtility } from 'src/app/shared/common.utility';

@Component({
    selector: 'se-date-range-filter',
    templateUrl: './date-range-filter.component.html',
})
export class DateRangeFilterComponent extends SimpleBaseComponent implements OnChanges {
    @Input() dateRangeDefault: string;
    @Input() dateRangeSetting: string;
    @Input() fromDate: any;
    @Input() toDate: any;
    @Input() requiredField: boolean = false;
    @Input() isGTDashboard: boolean = false;
    @Input() settingsOptions: any = {
        day: true,
        week: true,
        month: true,
        quarter: false,
        year: false
    };
    @Input() settingsOptionsDateRange: any = {
        today: true,
        dateRange: true,
    };
    @Input() target: string = '';
    @Output() onChange: EventEmitter<any> = new EventEmitter();

    public report_name: string = '';
    public overlapTrigger = true;
    public dateOptions: string = 'day';
    public dateTitle: string = 'Today';
    public dateTitleMobile: string = 'Today';
    public dateValueMoment: any = {
        fromDate: null,
        toDate: null
    };
    public dateValueMomentChache: any;
    public yearTitle: string = '';
    public ready: boolean = false;
    private dateRangeDefaultCurrent: string = 'day';
    private urlStart: string = '';
    private cacheUrl: string = '';
    public dateValueTitle = {
        dateTitle: this.dateTitle,
        dateTitleMobile: this.dateTitleMobile,
        yearTitle: this.yearTitle
    };

    constructor(public dialog: MatDialog,
        public router: Router,
        public sharedService: SharedPropertyService) {
        super(sharedService);
        this.dateValueMoment.fromDate = this.sharedService.moment();
        this.dateValueMomentChache = this.sharedService.moment();
        this.asyncResetDateFilter();
        this.asyncActions();
        this.cacheUrl = location.pathname;
    }

    ngOnChanges(changes: SimpleChanges): void {
        if (changes['dateRangeDefault'] && this.dateRangeDefault) {
            this.dateRangeDefaultCurrent = this.dateRangeDefault;
            this.getDefaultDateRange(this.fromDate);
        }
        if (changes['dateRangeSetting'] && this.dateRangeSetting) {
            this.dateRangeDefaultCurrent = this.dateRangeSetting;
            this.getDefaultDateRange(this.fromDate);
        }
        if (changes['fromDate'] && this.fromDate) {
            this.dateValueMoment.fromDate = this.sharedService.moment(this.fromDate.clone().format("YYYY-MM-DD"));
            this.getTitle(this.dateValueMoment);
        }
        if (changes['toDate'] && this.toDate) {
            this.dateValueMoment.toDate = this.sharedService.moment(this.toDate.clone().format("YYYY-MM-DD"));
            this.getTitle(this.dateValueMoment);
        }
    }

    getDefaultDateRange(dateMoment?: any) {
        this.dateOptions = this.dateRangeDefaultCurrent;
        this.getDateOption(dateMoment);
        this.getTitle(this.dateValueMoment);
        this.dateValueMoment = CommonUtility.getFilterDate({ date: this.dateValueMoment, key: this.dateOptions });
    }

    asyncActions() {
        this.sharedService.dataItemObs.pipe(distinctUntilChanged(), share(), takeUntil(this.unsubscribe)).subscribe({
            next: (res: any) => {
                if (res.action === 'change-filter-date-toolbar' && this.dateOptions !== 'custom') {
                    if (res.data) {
                        this.changeDateValue(res.data);
                    }
                } else if (res.action == 'get-title-filter-date-range') {
                    if (res.data && res.dateOptions) {
                        this.dateOptions = res.dateOptions;
                        this.dateValueMoment = res.data;
                        if (this.dateValueMoment.fromDate) {
                            this.dateValueMomentChache = this.dateValueMoment.fromDate.clone();
                        }
                        this.getTitle(this.dateValueMoment);
                    }
                }
            }
        });
    }

    asyncResetDateFilter() {
        this.router.events.pipe(takeUntil(this.unsubscribe)).subscribe({
            next: (event: any) => {
                if (event instanceof NavigationEnd) {
                    if (this.cacheUrl != event.url) {
                        this.cacheUrl = event.url;
                        if (event.url.includes('/logistics/ground-transport/trips')) {
                            if (!this.urlStart.includes('/logistics/ground-transport/trips')) {
                                this.resetFilterToDay(this.dateRangeDefaultCurrent);
                            }
                        }
                        else {
                            this.resetFilterToDay(this.dateRangeDefaultCurrent);
                        }
                    }

                }
                else if (event instanceof NavigationStart) {
                    this.urlStart = event.url;
                }
            }
        });
    }

    resetFilterToDay(dateRangeDefault: string) {
        this.dateOptions = dateRangeDefault;
        this.dateValueMoment.toDate = null;
        this.dateValueMoment.fromDate = this.sharedService.moment();
        this.dateValueMomentChache = this.sharedService.moment();
        this.getDateOption(this.sharedService.moment());
        this.dateValueMoment = CommonUtility.getFilterDate({ date: this.dateValueMoment, key: this.dateOptions });
        this.getTitle(this.dateValueMoment);
    }

    changeDateOptions(value: any) {
        if (value === 'more') {
            return;
        }
        this.dateValueMoment = {
            fromDate: null,
            toDate: null
        };
        if (value === 'custom') {
            // this.openCustomDialog();
        }
        else {
            this.dateOptions = value;
            this.getDateOption(this.sharedService.moment());
            this.getDateValue(this.dateValueMoment);
        }
    }

    getDateOption(dateMoment?: any) {
        let dateNow = this.sharedService.moment();
        if (!this.isNullOrEmpty(dateMoment)) {
            dateNow = this.sharedService.moment(dateMoment.clone().format("YYYY-MM-DD"));
        }
        switch (this.dateOptions) {
            case 'week':
                let dateStartWeek = this.sharedService.formatDate(dateNow.clone().startOf('week')) //CommonUtility.getDateFormatString(dateNow.clone().startOf('week'), 'MM/DD/YYYY');
                let duration = this.sharedService.formatDate(dateNow.clone())//CommonUtility.getDateFormatString(dateNow.clone(), 'MM/DD/YYYY');
                if (duration === dateStartWeek) {
                    dateNow = dateNow.clone().subtract(1, 'd');
                    this.dateValueMoment.fromDate = dateNow.clone().startOf('isoweek');
                    this.dateValueMomentChache = dateNow.clone().startOf('isoweek');
                }
                else {
                    this.dateValueMoment.fromDate = dateNow.clone().startOf('isoweek');
                    this.dateValueMomentChache = dateNow.clone().startOf('isoweek');
                }
                // console.log("this.dateValueMoment.fromDate...",this.dateValueMoment.fromDate.format("YYYY-MM-DD"));

                break;
            case 'month':
                this.dateValueMoment.fromDate = dateNow.clone().startOf('month');
                this.dateValueMomentChache = dateNow.clone().startOf('month');
                break;
            case 'day':
                this.dateValueMoment.fromDate = dateNow.clone();
                this.dateValueMomentChache = dateNow.clone();
                break;
            case 'quarter':
                this.dateValueMoment.fromDate = dateNow.clone().startOf('quarter');
                this.dateValueMomentChache = dateNow.clone().startOf('quarter');
                break;
            case 'year':
                // default:
                this.dateValueMoment.fromDate = dateNow.clone().startOf('year');
                this.dateValueMomentChache = dateNow.clone().startOf('year');
                break;
        }
    }

    changeDateValue(key: string) {
        if (this.dateValueMoment.fromDate) {
            switch (this.dateOptions) {
                case 'week':
                    if (key == 'next') {
                        this.dateValueMoment.fromDate = this.dateValueMomentChache.clone().add(1, 'w');
                    }
                    else {
                        this.dateValueMoment.fromDate = this.dateValueMomentChache.clone().subtract(1, 'w');
                    }
                    break;
                case 'month':
                    if (key == 'next') {
                        this.dateValueMoment.fromDate = this.dateValueMomentChache.clone().add(1, 'M');
                    }
                    else {
                        this.dateValueMoment.fromDate = this.dateValueMomentChache.clone().subtract(1, 'M');
                    }
                    break;
                case 'day':
                    if (key == 'next') {
                        this.dateValueMoment.fromDate = this.dateValueMomentChache.clone().add(1, 'd');
                    }
                    else {
                        this.dateValueMoment.fromDate = this.dateValueMomentChache.clone().subtract(1, 'd');
                    }
                    break;
                case 'quarter':
                    if (key == 'next') {
                        this.dateValueMoment.fromDate = this.dateValueMomentChache.clone().add(1, 'Q');
                    }
                    else {
                        this.dateValueMoment.fromDate = this.dateValueMomentChache.clone().subtract(1, 'Q');
                    }
                    break;
                case 'year':
                    if (key == 'next') {
                        this.dateValueMoment.fromDate = this.dateValueMomentChache.clone().add(1, 'Y');
                    }
                    else {
                        this.dateValueMoment.fromDate = this.dateValueMomentChache.clone().subtract(1, 'Y');
                    }
                    break;
            }
            this.dateValueMomentChache = this.dateValueMoment.fromDate.clone();
        }
        this.getDateValue(this.dateValueMoment);
    }

    getTitle(dateValueMoment: any) {
        if (dateValueMoment.fromDate) {
            switch (this.dateOptions) {
                case 'week':
                    this.dateTitle = `${CommonUtility.getDateFormatString(dateValueMoment.fromDate.clone().startOf('week'), 'MMMM DD')} - ${CommonUtility.getDateFormatString(dateValueMoment.fromDate.clone().endOf('week'), 'DD')}`;
                    this.dateTitleMobile = `${CommonUtility.getDateFormatString(dateValueMoment.fromDate.clone().startOf('week'), 'MMM DD')} - ${CommonUtility.getDateFormatString(dateValueMoment.fromDate.clone().endOf('week'), 'DD')}`;
                    this.yearTitle = ` ${dateValueMoment.fromDate.clone().format('YYYY')}`;
                    break;
                case 'month':
                    this.dateTitle = `${CommonUtility.getDateFormatString(dateValueMoment.fromDate, 'MMMM')}`;
                    this.dateTitleMobile = `${CommonUtility.getDateFormatString(dateValueMoment.fromDate, 'MMM')}`;
                    this.yearTitle = ` ${dateValueMoment.fromDate.clone().format('YYYY')}`;
                    break;
                case 'day':
                    let dateNow = CommonUtility.getDateFormatString(this.sharedService.moment(), 'MM/DD/YYYY');
                    this.dateTitle = CommonUtility.getDateFormatString(dateValueMoment.fromDate, 'MMMM DD');
                    this.dateTitleMobile = CommonUtility.getDateFormatString(dateValueMoment.fromDate, 'MMM DD');
                    this.yearTitle = ` ${dateValueMoment.fromDate.clone().format('YYYY')}`;
                    let duration = CommonUtility.getDateFormatString(dateValueMoment.fromDate.clone(), 'MM/DD/YYYY');
                    if (duration == dateNow) {
                        this.dateTitle = 'Today';
                        this.dateTitleMobile = 'Today';
                        this.yearTitle = '';
                    }
                    break;
                case 'quarter':
                    this.dateTitle = `${CommonUtility.getDateFormatString(dateValueMoment.fromDate, 'MMMM')} - ${CommonUtility.getDateFormatString(dateValueMoment.fromDate.clone().endOf('quarter'), 'MMMM')}`;
                    this.dateTitleMobile = `${CommonUtility.getDateFormatString(dateValueMoment.fromDate, 'MMM')} - ${CommonUtility.getDateFormatString(dateValueMoment.fromDate.clone().endOf('quarter'), 'MMMM')}`;
                    this.yearTitle = ` ${dateValueMoment.fromDate.clone().format('YYYY')}`;
                    break;
                case 'year':
                    this.dateTitle = `${CommonUtility.getDateFormatString(dateValueMoment.fromDate, 'MMMM')} - ${CommonUtility.getDateFormatString(dateValueMoment.fromDate.clone().endOf('year'), 'MMMM')}`;
                    this.dateTitleMobile = `${CommonUtility.getDateFormatString(dateValueMoment.fromDate, 'MMM')} - ${CommonUtility.getDateFormatString(dateValueMoment.fromDate.clone().endOf('year'), 'MMMM')}`;
                    this.yearTitle = ` ${dateValueMoment.fromDate.clone().format('YYYY')}`;
                    break;
            }
        }
        if (this.dateOptions === 'custom' && (dateValueMoment.fromDate || dateValueMoment.toDate)) {
            this.handleDateFilterCustom(dateValueMoment);
        }
        this.dateValueTitle = {
            dateTitle: this.dateTitle,
            dateTitleMobile: this.dateTitleMobile,
            yearTitle: this.yearTitle
        };
        // this.sharedService.sharedData({ action: 'title-filter-date-trip-flight-aviation', dateValueTitle: dateValueTitle });
    }

    handleDateFilterCustom(dateValueMoment: any) {
        if (this.checkToday(dateValueMoment)) {
            this.dateTitle = 'Today';
            this.dateTitleMobile = 'Today';
            this.yearTitle = '';
        }
        else {
            this.yearTitle = '';
            if (dateValueMoment.fromDate) {
                this.dateTitle = `From ${CommonUtility.getDateFormatString(dateValueMoment.fromDate.clone(), 'MMMM DD YYYY')}`;
                this.dateTitleMobile = `From ${CommonUtility.getDateFormatString(dateValueMoment.fromDate.clone(), 'MMM DD YY')}`;
                if (dateValueMoment.toDate) {
                    if (CommonUtility.getDateFormatString(dateValueMoment.fromDate.clone(), 'YYYY') == CommonUtility.getDateFormatString(dateValueMoment.toDate.clone(), 'YYYY')) {
                        this.yearTitle = CommonUtility.getDateFormatString(dateValueMoment.fromDate.clone(), 'YYYY');
                        // if (CommonUtility.getDateFormatString(dateValueMoment.fromDate.clone(), 'MMMM') == CommonUtility.getDateFormatString(dateValueMoment.toDate.clone(), 'MMMM')) {
                        //     this.dateTitle = `${CommonUtility.getDateFormatString(dateValueMoment.fromDate.clone(), 'MMMM DD')} - ${CommonUtility.getDateFormatString(dateValueMoment.toDate.clone(), 'DD')}`;
                        //     this.dateTitleMobile = `${CommonUtility.getDateFormatString(dateValueMoment.fromDate.clone(), 'MMM DD')} - ${CommonUtility.getDateFormatString(dateValueMoment.toDate.clone(), 'DD')}`;
                        // }
                        // else {
                        this.dateTitle = `${CommonUtility.getDateFormatString(dateValueMoment.fromDate.clone(), this.isGTDashboard ? 'MMM DD' : 'MMMM DD')} - ${CommonUtility.getDateFormatString(dateValueMoment.toDate.clone(), this.isGTDashboard ? 'MMM DD' : 'MMMM DD')}`;
                        this.dateTitleMobile = `${CommonUtility.getDateFormatString(dateValueMoment.fromDate.clone(), 'MMM DD')} - ${CommonUtility.getDateFormatString(dateValueMoment.toDate.clone(), 'MMM DD')}`;
                        // }
                    }
                    else {
                        this.dateTitle = `${CommonUtility.getDateFormatString(dateValueMoment.fromDate.clone(), 'MMMM DD YYYY')} - ${CommonUtility.getDateFormatString(dateValueMoment.toDate.clone(), 'MMMM DD YYYY')}`;
                        this.dateTitleMobile = `${CommonUtility.getDateFormatString(dateValueMoment.fromDate.clone(), 'MMM DD YY')} - ${CommonUtility.getDateFormatString(dateValueMoment.toDate.clone(), 'MMM DD YY')}`;
                    }
                }
            }
            else if (dateValueMoment.toDate) {
                this.dateTitle = `To ${CommonUtility.getDateFormatString(dateValueMoment.toDate.clone(), 'MMMM DD YYYY')}`;
                this.dateTitleMobile = `To ${CommonUtility.getDateFormatString(dateValueMoment.toDate.clone(), 'MMM DD YY')}`;
            }
        }
    }

    checkToday(dateValueMoment: any) {
        if (dateValueMoment.fromDate && dateValueMoment.toDate && CommonUtility.getDateFormatString(dateValueMoment.fromDate, 'YYYY-MM-DD') == CommonUtility.getDateFormatString(this.sharedService.moment(), 'YYYY-MM-DD')
            && CommonUtility.getDateFormatString(dateValueMoment.toDate, 'YYYY-MM-DD') == CommonUtility.getDateFormatString(this.sharedService.moment(), 'YYYY-MM-DD')) {
            return true;
        }
        return false;
    }

    getDateValue(dateValueMoment: any) {
        this.getTitle(dateValueMoment);
        this.dateValueMoment = this.getFilterDate({ date: dateValueMoment, key: this.dateOptions });
        let date = {
            fromDate: this.dateValueMoment.fromDate ? CommonUtility.getDateFormatString(this.dateValueMoment.fromDate, 'YYYY-MM-DD') : '',
            toDate: this.dateValueMoment.toDate ? CommonUtility.getDateFormatString(this.dateValueMoment.toDate, 'YYYY-MM-DD') : '',
            fromDateMoment: this.dateValueMoment.fromDate ? this.dateValueMoment.fromDate : '',
            toDateMoment: this.dateValueMoment.toDate ? this.dateValueMoment.toDate : '',
            previousFrom: this.dateValueMoment.previousFrom ? CommonUtility.getDateFormatString(this.dateValueMoment.previousFrom, 'YYYY-MM-DD') : '',
            previousTo: this.dateValueMoment.previousTo ? CommonUtility.getDateFormatString(this.dateValueMoment.previousTo, 'YYYY-MM-DD') : '',
        }
        let data = {
            date: date,
            key: this.dateOptions
        }
        this.onChange.emit({ action: "date-change", data: data })
        // this.sharedService.sharedData({ action: 'filter-date-trip-flight-aviation', data: data });
    }

    getFilterDate(data: any) {
        let filterDate = {
            fromDate: null,
            toDate: null,
            previousFrom: null,
            previousTo: null
        }
        switch (data.key) {
            case 'week':
                if (data.date && data.date.fromDate) {
                    filterDate.fromDate = data.date.fromDate.clone().startOf('isoweek');
                    filterDate.toDate = data.date.fromDate.clone().endOf('isoweek');
                    filterDate.previousFrom = data.date.fromDate.clone().startOf('isoweek').subtract(1, 'w');
                    filterDate.previousTo = data.date.fromDate.clone().endOf('isoweek').subtract(1, 'w');
                }
                break;
            case 'month':
                if (data.date && data.date.fromDate) {
                    filterDate.fromDate = data.date.fromDate.clone();
                    filterDate.toDate = data.date.fromDate.clone().endOf('month');
                    filterDate.previousFrom = data.date.fromDate.clone().subtract(1, 'M');
                    filterDate.previousTo = data.date.fromDate.clone().subtract(1, 'M').endOf('month');
                }
                break;
            case 'custom':
                if (data.date && data.date.fromDate) {
                    filterDate.fromDate = data.date.fromDate.clone();
                    filterDate.previousFrom = data.date.fromDate.clone();
                }
                if (data.date && data.date.toDate) {
                    filterDate.toDate = data.date.toDate.clone();
                    filterDate.previousTo = data.date.toDate.clone();
                }
                break;
            case 'day':
                if (data.date && data.date.fromDate) {
                    filterDate.fromDate = data.date.fromDate;
                    filterDate.previousFrom = data.date.fromDate.clone().subtract(1, 'd');
                    filterDate.previousTo = data.date.fromDate.clone().subtract(1, 'd');
                }
                break;
            case 'quarter':
                if (data.date && data.date.fromDate) {
                    filterDate.fromDate = data.date.fromDate.clone();
                    filterDate.toDate = data.date.fromDate.clone().endOf('quarter');
                    filterDate.previousFrom = data.date.fromDate.clone().subtract(1, 'Q');
                    filterDate.previousTo = data.date.fromDate.clone().subtract(1, 'Q').endOf('quarter');
                }
                break;
            case 'year':
                if (data.date && data.date.fromDate) {
                    filterDate.fromDate = data.date.fromDate.clone();
                    filterDate.toDate = data.date.fromDate.clone().endOf('year');
                    filterDate.previousFrom = data.date.fromDate.clone().subtract(1, 'y');
                    filterDate.previousTo = data.date.fromDate.clone().subtract(1, 'y').endOf('year');
                }
                break;
        }
        return filterDate;
    }

    goToToday() {
        this.changeDateOptions('day');
        if (this.dateOptions != 'day') {
            this.dateOptions = 'day';
        }
    }

    changeDateRangeCustom(dateValueMoment: any) {
        this.dateValueMoment = {
            fromDate: null,
            toDate: null
        };
        if (dateValueMoment && dateValueMoment.fromDate) {
            this.dateValueMoment.fromDate = dateValueMoment.fromDate.startOf('day');
        }
        if (dateValueMoment && dateValueMoment.toDate) {
            this.dateValueMoment.toDate = dateValueMoment.toDate.startOf('day');
        }
        this.getDateValue(this.dateValueMoment);
    }

    openCustomDialog() {
        const config = new MatDialogConfig();
        config.data = {
            fromDate: this.dateValueMoment.fromDate,
            toDate: this.dateValueMoment.toDate,
            requiredField: this.requiredField
        };
        config.disableClose = true;
        config.maxWidth = '80vw';
        config.height = 'auto';
        config.autoFocus = true;
        config.panelClass = 'dialog-form-xs';
        let dialogRef = this.dialog.open(CustomDateRangeComponent, config);
        dialogRef.afterClosed().pipe(takeUntil(this.unsubscribe)).subscribe({
            next: (res: any) => {
                if (res) {
                    this.dateOptions = 'custom';
                    this.changeDateRangeCustom(res);
                }
            }
        });
    }
}

