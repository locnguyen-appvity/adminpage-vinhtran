import { Component } from '@angular/core';
import { FormControl } from '@angular/forms';
import { DateAdapter, MAT_DATE_FORMATS } from '@angular/material/core';
import { Moment } from 'moment';
import { OwlOptions } from 'ngx-owl-carousel-o';
import { Observable, forkJoin, take, takeUntil } from 'rxjs';
import { PageService } from 'src/app/page/page.service';
import { CommonUtility } from 'src/app/shared/common.utility';
import { AppCustomDateAdapter, CUSTOM_DATE_FORMATS } from 'src/app/shared/date.customadapter';
import { SharedPropertyService } from 'src/app/shared/shared-property.service';
import { SimpleBaseComponent } from 'src/app/shared/simple.base.component';

@Component({
	selector: 'app-events-daily',
	templateUrl: './events-daily.component.html',
	styleUrls: ['./events-daily.component.scss'],
	providers: [
		{
			provide: DateAdapter,
			useClass: AppCustomDateAdapter
		},
		{
			provide: MAT_DATE_FORMATS,
			useValue: CUSTOM_DATE_FORMATS
		}
	]
})
export class EventsDailyComponent extends SimpleBaseComponent {

	// public carouselSlide: any;
	// @ViewChild('carouselSlide') set elemOnHTML(elemOnHTML: any) {
	// 	if (!!elemOnHTML) {
	// 		this.carouselSlide = elemOnHTML;
	// 	}
	// }
	public dateControl: FormControl;
	public dataItems: any = [
		{
			id: 1,
			name: "1"
		},
		{
			id: 2,
			name: "2"
		},
		{
			id: 3,
			name: "3"
		}
	];
	public limit: number = 10;
	public customOptions: OwlOptions = {
		loop: true,
		mouseDrag: false,
		touchDrag: false,
		pullDrag: false,
		dots: false,
		center: true,
		navSpeed: 700,
		// navText: ['', ''],
		responsive: {
			0: {
				items: 1
			},
			400: {
				items: 1
			},
			740: {
				items: 1
			},
			940: {
				items: 1
			}
		},
		nav: false
	}

	public currentIndex: number = 0;
	// private currentCount: number = 0;
	private currentDate: Moment;
	public dateView: any = {
		0: {
			dayTilte: "",
			dateView: ""
		},
		1: {
			dayTilte: "",
			dateView: ""
		},
		2: {
			dayTilte: "",
			dateView: ""
		}
	};
	public parablesView: any = {
		0: {
			quotation: "",
			metaDescription: "",
			link: ""
		},
		1: {
			quotation: "",
			metaDescription: "",
			link: ""
		},
		2: {
			quotation: "",
			metaDescription: "",
			link: ""
		}
	};

	public spinnerLoading: boolean = false;
	public noParables: boolean = true;
	public anniversaries: any[] = [];

	constructor(
		public sharedService: SharedPropertyService,
		public service: PageService,) {
		super(sharedService);
		this.currentDate = this.sharedService.moment();
		this.dateControl = new FormControl(this.currentDate);
		if (this.unsubscribe['change-date']) {
			this.unsubscribe['change-date'].unsubscribe();
		}
		this.spinnerLoading = true;
		this.unsubscribe['change-date'] = forkJoin({ getParablesDaily: this.getParablesDaily(), getAnniversaries: this.getAnniversaries() }).pipe(take(1)).subscribe({
			next: (res: any) => {
				if (this.unsubscribe['change-date']) {
					this.unsubscribe['change-date'].unsubscribe();
				}
				this.updateDateTitle(this.currentDate, this.currentIndex);
				this.updateParablesTitle(this.currentIndex, res.getParablesDaily);
				this.spinnerLoading = false;
			}
		})
		this.dateControl.valueChanges.pipe(takeUntil(this.unsubscribe)).subscribe({
			next: (value: any) => {
				let _dateNew = this.sharedService.formatDate(value);
				let _currDate = this.sharedService.formatDate(this.currentDate);
				if (this.sharedService.isChangedValue(_dateNew, _currDate)) {
					this.currentDate = value;
					if (this.unsubscribe['change-date']) {
						this.unsubscribe['change-date'].unsubscribe();
					}
					this.spinnerLoading = true;
					this.unsubscribe['change-date'] = forkJoin({ getParablesDaily: this.getParablesDaily(), getAnniversaries: this.getAnniversaries() }).pipe(take(1)).subscribe({
						next: (res: any) => {
							if (this.unsubscribe['change-date']) {
								this.unsubscribe['change-date'].unsubscribe();
							}
							this.updateDateTitle(this.currentDate, this.currentIndex);
							this.updateParablesTitle(this.currentIndex, res.getParablesDaily);
							this.spinnerLoading = false;
						}
					})
				}
			}
		});
	}

	getParablesDaily() {
		return new Observable(obs => {
			let options = {
				top: 1,
				filter: `date eq ${this.currentDate.format("YYYY-MM-DD")}`
			};
			this.service.getParablesDaily(options).pipe(take(1)).subscribe({
				next: (res: any) => {
					let item;
					if (res && res.value && res.value[0]) {
						this.noParables = false;
						item = res.value[0];
						if (item.created) {
							item._created = this.sharedService.convertDateStringToMoment(item.created, this.offset);
							item.createdView = item._created.format('DD/MM/YYYY hh:mm A');
						}
					}
					else {
						this.noParables = true;
					}
					obs.next(item);
					obs.complete();
				}
			})
		})
	}

	onPrev() {
		// this.currentCount--;
		this.currentDate = this.currentDate.clone().add(-1, 'd');
		if (this.unsubscribe['change-date']) {
			this.unsubscribe['change-date'].unsubscribe();
		}
		this.dateControl.setValue(this.currentDate);
		this.spinnerLoading = true;
		this.unsubscribe['change-date'] = forkJoin({ getParablesDaily: this.getParablesDaily(), getAnniversaries: this.getAnniversaries() }).pipe(take(1)).subscribe({
			next: (res: any) => {
				if (this.unsubscribe['change-date']) {
					this.unsubscribe['change-date'].unsubscribe();
				}
				if (this.currentIndex == 0) {
					this.currentIndex = 2;
				}
				else {
					this.currentIndex--;
				}
				this.updateDateTitle(this.currentDate, this.currentIndex);
				this.updateParablesTitle(this.currentIndex, res.getParablesDaily);
				this.spinnerLoading = false;
			}
		})
	}

	onNext() {
		// this.currentCount++;
		this.currentDate = this.currentDate.clone().add(1, 'd');
		if (this.unsubscribe['change-date']) {
			this.unsubscribe['change-date'].unsubscribe();
		}
		this.spinnerLoading = true;
		this.dateControl.setValue(this.currentDate);
		this.unsubscribe['change-date'] = forkJoin({ getParablesDaily: this.getParablesDaily(), getAnniversaries: this.getAnniversaries() }).pipe(take(1)).subscribe({
			next: (res: any) => {
				if (this.unsubscribe['change-date']) {
					this.unsubscribe['change-date'].unsubscribe();
				}
				if (this.currentIndex == 2) {
					this.currentIndex = 0;
				}
				else {
					this.currentIndex++;
				}
				this.updateDateTitle(this.currentDate, this.currentIndex);
				this.updateParablesTitle(this.currentIndex, res.getParablesDaily);
				this.spinnerLoading = false;
			}
		})
	}

	updateDateTitle(dateMoment: Moment, index: number) {
		this.dateView[index].dayTilte = CommonUtility.convertDayEngToVi(dateMoment.format('dddd'));
		this.dateView[index].dateView = `Ngày ${dateMoment.format('DD')} tháng ${dateMoment.format('MM')} năm ${dateMoment.format('YYYY')}`;
	}

	updateParablesTitle(index: number, data: any) {
		if (!this.isNullOrEmpty(data)) {
			this.parablesView[index].quotation = data.quotation;
			this.parablesView[index].code = data.code;
			this.parablesView[index].name = data.name;
			this.parablesView[index].parableID = data.parableID;
			this.noParables = false;
		}
		else {
			this.parablesView[index].quotation = "";
			this.parablesView[index].code = "";
			this.parablesView[index].name = "";
			this.parablesView[index].parableID = "";
			this.noParables = true;
		}
	}

	getAnniversaries() {
		return new Observable(obs => {
			let options = {
				filter: `day eq '${this.currentDate.format("DD/MM")}' and entityType eq 'clergy' and (type eq 'birth' or type eq 'pho_te' or type eq 'linh_muc' or type eq 'rip' or type eq 'saint')`
			}
			this.dataProcessing = true;
			this.anniversaries = [];
			this.service.getAnniversaries(options).pipe(take(1)).subscribe({
				next: (res: any) => {
					if (res && res.value && res.value.length > 0) {
						let requests: Observable<any>[] = [];
						for (let item of res.value) {
							item._days = 0;
							if (item.date) {
								item._date = this.sharedService.convertDateStringToMomentUTC_0(item.date);
								item.dayView = item._date.format('DD/MM/YYYY');
								let dur = this.sharedService.moment().diff(item._date, 'years');
								if (dur > 0) {
									item._days = dur;
								}
							}
							requests.push(this.updateEntityName(item));
						}
						forkJoin(requests).pipe(take(1)).subscribe({
							next: (items: any) => {
								this.anniversaries = items;
							}
						})
					}
					this.dataProcessing = false;
					obs.next();
					obs.complete();
				}
			})
		})
	}

	updateEntityName(item: any) {
		return new Observable(obs => {
			if (item.entityType == 'clergy' && item.entityID) {
				this.getClergy(item.entityID).pipe(take(1)).subscribe({
					next: (entityName: any) => {
						if ((item.type == 'pho_te' || item.type == 'linh_muc')) {
							item.title = `Kỷ niệm ${item._days > 0 ? item._days + ' năm' : ""} ${item.name} của ${entityName}`;
						}
						else if (item.type == 'saint') {
							item.title = `Mừng bổn mạng của ${entityName}`;
						}
						else if (item.type == 'rip') {
							item.title = `Lễ giỗ ${item._days > 0 ? item._days + ' năm' : ""} của ${entityName}`;
						}
						else if (item.type == 'birth') {
							item.title = `Mừng sinh nhật của ${entityName}`;
						}
						obs.next(item);
						obs.complete();
					}
				})
			}
			else {
				obs.next(item);
				obs.complete();
			}
		})
	}

	getClergy(id: string) {
		return new Observable(obs => {
			this.service.getClergy(id).pipe(take(1)).subscribe({
				next: (res: any) => {
					let name = ""
					if (res && res.name) {
						name = `${this.sharedService.getClergyLevel(res)} ${res.stName} ${res.name}`;
					}
					obs.next(name);
					obs.complete();
				}
			})
		})
	}

}
