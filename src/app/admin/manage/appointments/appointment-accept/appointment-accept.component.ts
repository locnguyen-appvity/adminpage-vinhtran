import { Component, Inject, Optional } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DateAdapter, MAT_DATE_FORMATS } from '@angular/material/core';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatTabChangeEvent } from '@angular/material/tabs';
import { Observable, forkJoin, take, takeUntil } from 'rxjs';
import { DialogConfirmComponent } from 'src/app/controls/confirm';
import { STATUS_CLERGY } from 'src/app/shared/data-manage';
import { AppCustomDateAdapter, CUSTOM_DATE_FORMATS } from 'src/app/shared/date.customadapter';
import { SharedPropertyService } from 'src/app/shared/shared-property.service';
import { SharedService } from 'src/app/shared/shared.service';
import { SimpleBaseComponent } from 'src/app/shared/simple.base.component';

@Component({
	selector: 'app-appointment-accept',
	templateUrl: './appointment-accept.component.html',
	styleUrls: ['./appointment-accept.component.scss'],
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
export class AppointmentAcceptComponent extends SimpleBaseComponent {

	public dataItemGroup: FormGroup;
	public mode: string = 'new';
	public localItem: any;
	public title: string = "Thêm";

	public clergysList: any[] = [];
	public appointerList: any[] = [];
	public entityList: any[] = [];
	public entityListFrom: any[] = [];
	public appointmentsList: any[] = [];
	public positionList: any[] = [];
	public positionFromList: any[] = [];
	public positionListCache: any[] = [];
	public statusClergy: any[] = STATUS_CLERGY;
	public searchValue: string = '';

	// public target: string = 'chon_thuyen_chuyen';
	private fromAppointmentItem: any;

	constructor(public override sharedService: SharedPropertyService,
		private fb: FormBuilder,
		private service: SharedService,
		public dialog: MatDialog,
		public dialogRef: MatDialogRef<AppointmentAcceptComponent>,
		@Optional() @Inject(MAT_DIALOG_DATA) private dialogData: any) {
		super(sharedService);

		if (this.dialogData.item) {
			this.title = "Xác Nhận";
			this.localItem = this.dialogData.item;
			this.mode = 'edit';
		}
		this.dataItemGroup = this.initialEventGroup(this.localItem);
		if (this.localItem && this.localItem.status == 'man_nhiem') {
			this.dataItemGroup.get('status').disable({
				onlySelf: true
			})
		}
		this.getEntityList('entityName');
		this.getEntityList('fromEntityName');
		this.getClergies();
		this.getPositions();
	}

	getAppointments(clergyID: string) {
		this.appointmentsList = [];
		if (!this.isNullOrEmpty(clergyID)) {
			let options = {
				filter: `clergyID eq ${clergyID} and (status eq 'duong_nhiem' or status eq 'cho_thuyen_chuyen')`
			}
			this.service.getAppointments(options).pipe(take(1)).subscribe((res: any) => {
				let dataItems = [];
				if (res && res.value && res.value.length > 0) {
					dataItems = res.value;
				}
				this.appointmentsList = dataItems
			})
		}
	}

	selectedTabChange(event: MatTabChangeEvent) {
		this.dataItemGroup.patchValue({
			fromEntityID: "",
			fromEntityName: "",
			fromAppointerID: "",
			fromAppointerName: "",
			fromEntityType: "",
			fromPosition: "",
			fromStatus: "",
			fromFromDate: "",
			fromEffectiveDate: "",
			fromToDate: "",
			fromAppointmentID: "",
			fromAppointmentName: ""
		})
	}

	initialEventGroup(item: any) {
		let fromDate = '';
		let toDate = '';
		let effectiveDate = '';
		let fromAppointmentToDate = '';
		if (item && item.fromDate) {
			item._fromDate = this.sharedService.convertDateStringToMomentUTC_0(item.fromDate);
			fromDate = item._fromDate;
		}
		if (item && item.toDate) {
			item._toDate = this.sharedService.convertDateStringToMomentUTC_0(item.toDate);
			toDate = item._toDate;
		}
		if (item && item.effectiveDate) {
			item._effectiveDate = this.sharedService.convertDateStringToMomentUTC_0(item.effectiveDate);
			effectiveDate = item._effectiveDate;
		}
		if (item && item.fromAppointmentToDate) {
			item._fromAppointmentToDate = this.sharedService.convertDateStringToMomentUTC_0(item.fromAppointmentToDate);
			fromAppointmentToDate = item._fromAppointmentToDate;
		}
		if (item && item.fromAppointmentID) {
			// 	this.target = 'chon_thuyen_chuyen';
			this.getAppointment(item.fromAppointmentID);
		}
		this.handlePositionList(item ? item.entityType : '', 'entityName');
		this.handlePositionList(item ? item.entityType : '', 'fromEntityName');
		return this.fb.group({
			id: item ? item.id : '',
			clergyName: item ? item.clergyName : "",
			clergyID: item ? item.clergyID : "",
			entityID: item ? item.entityID : "",
			_entityID: [item ? `${item.entityType}_${item.entityID}` : '', Validators.required],
			entityName: item ? item.entityName : "",
			appointerID: item ? item.appointerID : "",
			appointerName: item ? item.appointerName : "",
			entityType: item ? item.entityType : "",
			position: [item ? item.position : '', Validators.required],
			status: 'duong_nhiem',
			fromDate: fromDate,
			effectiveDate: [effectiveDate, Validators.required],
			toDate: toDate,
			fromEntityID: "",
			_fromEntityID: "",
			fromEntityName: "",
			fromAppointerID: "",
			fromAppointerName: "",
			fromEntityType: "",
			fromPosition: "",
			fromStatus: "",
			fromFromDate: "",
			fromEffectiveDate: "",
			fromFromDateView: "",
			fromToDateView: "",
			fromPositionView: "",
			fromEffectiveDateView: "",
			fromToDate: (item && item.fromAppointmentID) ? fromAppointmentToDate : "",
			fromAppointmentID: item ? item.fromAppointmentID : (this.fromAppointmentItem ? this.fromAppointmentItem.id : ""),
			fromAppointmentName: ""
		});
	}

	getAppointment(appointmentID: string) {
		this.service.getAppointment(appointmentID).pipe(take(1)).subscribe({
			next: (res: any) => {
				this.fromAppointmentItem = res;
			}
		})
	}

	valueChangeAutocomplete(event: any, target: string) {
		if (target == 'clergyName') {
			this.dataItemGroup.get('clergyID').setValue(event);
			this.getAppointments(event);
		}
		else if (target == 'entityName') {
			if (event && event.id) {
				this.dataItemGroup.get('entityID').setValue(event.id);
				this.dataItemGroup.get('entityType').setValue(event.type);
				this.dataItemGroup.get('entityName').setValue(event.name);
				this.handlePositionList(event.type, 'entityName');
			}
			else {
				this.dataItemGroup.get('entityID').setValue("");
				this.dataItemGroup.get('entityType').setValue("");
				this.dataItemGroup.get('entityName').setValue("");
				this.handlePositionList("", 'entityName')
			}
		}
		else if (target == 'fromEntityName') {
			if (event && event.id) {
				this.dataItemGroup.get('fromEntityID').setValue(event.id);
				this.dataItemGroup.get('fromEntityType').setValue(event.type);
				this.dataItemGroup.get('fromEntityName').setValue(event.name);
				this.handlePositionList(event.type, 'fromEntityName');
			}
			else {
				this.dataItemGroup.get('fromEntityID').setValue("");
				this.dataItemGroup.get('fromEntityType').setValue("");
				this.dataItemGroup.get('fromEntityName').setValue("");
				this.handlePositionList("", 'fromEntityName')
			}
		}
		// else if (target == 'appointerID') {
		// 	this.dataItemGroup.get('appointerName').setValue(event);
		// }
		else if (target == 'fromAppointmentName') {
			this.updateFromAppointment(event);
		}
	}
	onSelectItem(event: any, target: string) {
		if (target == 'appointerID') {
			this.dataItemGroup.get('appointerName').setValue(event ? event.name : "");
		}
		else if (target == 'fromAppointerID') {
			this.dataItemGroup.get('fromAppointerName').setValue(event ? event.name : "");
		}
	}

	updateFromAppointment(event: any) {
		if (event) {
			let fromDate = '';
			// let toDate = '';
			let effectiveDate = '';
			let fromFromDateView = '';
			// let fromToDateView = '';
			let fromEffectiveDateView = '';
			if (event && event.fromDate) {
				event._fromDate = this.sharedService.convertDateStringToMomentUTC_0(event.fromDate);
				fromDate = event._fromDate;
				fromFromDateView = this.sharedService.formatDate(event._fromDate);
			}
			// if (event && event.toDate) {
			// 	event._toDate = this.sharedService.convertDateStringToMomentUTC_0(event.toDate);
			// 	toDate = event._toDate;
			// 	fromToDateView = this.sharedService.formatDate(event._toDate);
			// }
			if (event && event.effectiveDate) {
				event._effectiveDate = this.sharedService.convertDateStringToMomentUTC_0(event.effectiveDate);
				effectiveDate = event._effectiveDate;
				fromEffectiveDateView = this.sharedService.formatDate(event._effectiveDate);
			}
			this.dataItemGroup.patchValue({
				fromEntityID: event ? event.entityID : '',
				_fromEntityID: `${event.entityType}_${event.entityID}`,
				fromEntityName: event.entityName,
				fromAppointerID: event.appointerID,
				fromAppointerName: event.appointerName,
				fromEntityType: event.entityType,
				fromPosition: event.position,
				fromStatus: 'man_nhiem',
				fromFromDate: fromDate,
				fromEffectiveDate: effectiveDate,
				// fromToDate: toDate,
				fromAppointmentID: event.id,
				fromAppointmentName: event.entityName,
				fromFromDateView: fromFromDateView,
				// fromToDateView: fromToDateView,
				fromPositionView: this.sharedService.getNameExistsInArray(event.position, this.positionListCache, 'code'),
				fromEffectiveDateView: fromEffectiveDateView,
			})
		}
		else {
			this.dataItemGroup.patchValue({
				fromEntityID: "",
				_fromEntityID: "",
				fromEntityName: "",
				fromAppointerID: "",
				fromAppointerName: "",
				fromEntityType: "",
				fromPosition: "",
				fromStatus: "",
				fromFromDate: "",
				fromEffectiveDate: "",
				fromToDate: "",
				fromAppointmentID: "",
				fromAppointmentName: "",
				fromFromDateView: "",
				fromPositionView: "",
				fromEffectiveDateView: "",
			})
		}
	}

	getPosition(item: any) {
		item.positionView = 'Chưa xác định'
		if (!this.isNullOrEmpty(item.position)) {
			let position = this.sharedService.getValueAutocomplete(item.position, this.positionList, 'code');
			if (position && position.name) {
				item.positionView = position.name;
			}
		}
	}

	handlePositionList(entityType: string, target: string) {
		let positionList = this.positionListCache;
		switch (entityType) {
			case 'giao_xu':
			case 'giao_diem':
			case 'giao_ho':
				positionList = this.positionListCache.filter(it => (it.level.includes('giao_xu') || it.level.includes('khac')));
				break;
			case 'co_so_giao_phan':
			case 'co_so_ngoai_giao_phan':
			case 'ban_muc_vu':
			case 'ban_chuyen_mon':
				positionList = this.positionListCache.filter(it => (it.level.includes('giao_phan') || it.level.includes('khac')));
				break;
			case 'giao_hat':
				positionList = this.positionListCache.filter(it => (it.level.includes('giao_hat') || it.level.includes('khac')));
				break;
			case 'cong_doan':
			case 'dong_tu':
				positionList = this.positionListCache.filter(it => (it.level.includes('dong_tu') || it.level.includes('khac')));
				break;
			default:
				positionList = this.positionListCache;
				break;
		}
		if (target == "fromEntityName") {
			this.positionFromList = positionList;
		}
		else {
			this.positionList = positionList;
		}
	}

	onValueChanges(event: any, target: string) {
		if (this.searchValue != event) {
			if (target == 'entityName') {
				// this.searchValue = event;
				// this.dataItemGroup.get('entityName').setValue(event);
				// this.getEntityList(target);
				this.handlePositionList('', 'entityName');
			}
			else if (target == 'fromEntityName') {
				// this.searchValue = event;
				// this.dataItemGroup.get('fromEntityName').setValue(event);
				// this.getEntityList(target);
				this.handlePositionList('', 'fromEntityName');
			}
		}
	}

	getFilter() {
		let filter = '';
		if (!this.isNullOrEmpty(this.searchValue)) {
			let quick = this.searchValue.replace("'", "`");
			quick = this.sharedService.handleODataSpecialCharacters(quick);
			let quickSearch = `contains(tolower(name), tolower('${quick}'))`;
			if (this.isNullOrEmpty(filter)) {
				filter = quickSearch;
			}
			else {
				filter = "(" + filter + ")" + " and (" + quickSearch + ")";
			}
		}
		return filter;
	}

	getEntityList(target: string) {
		forkJoin({ organization: this.getOrganizations(), group: this.getGroups() }).pipe(take(1)).subscribe({
			next: (res: any) => {
				let items = [];
				if (res && res.organization && res.organization.length > 0) {
					items.push(...res.organization);
				}
				if (res && res.group && res.group.length > 0) {
					items.push(...res.group);
				}
				if (target == 'entityName') {
					this.entityList = items;
				}
				else if (target == 'fromEntityName') {
					this.entityListFrom = items;
				}
			}
		})
	}

	getOrganizations() {
		return new Observable(obs => {
			let options = {
				select: 'id,name,type',
				filter: this.getFilter(),
				// skip: 0,
				// top: 5
			}
			this.service.getOrganizations(options).pipe(take(1)).subscribe({
				next: (res: any) => {
					let items = []
					if (res && res.value && res.value.length > 0) {
						items.push(...res.value);
						for (let item of items) {
							item._id = `${item.type}_${item.id}`;
							item.name = `${this.sharedService.updateNameTypeOrg(item.type)} ${item.name}`;
							item.groupName = this.sharedService.updateTypeOrg(item.type);
						}
					}
					obs.next(items);
					obs.complete();
				}
			})
		})
	}

	getGroups() {
		return new Observable(obs => {
			let options = {
				select: 'id,name,type',
				filter: this.getFilter(),
				// skip: 0,
				// top: 5
			}
			this.service.getGroups(options).pipe(take(1)).subscribe({
				next: (res: any) => {
					let items = []
					if (res && res.value && res.value.length > 0) {
						items.push(...res.value);
						for (let item of items) {
							item._id = `${item.type}_${item.id}`;
							item.name = `${this.sharedService.updateNameTypeOrg(item.type)} ${item.name}`;
							item.groupName = this.sharedService.updateTypeOrg(item.type);
						}
					}
					obs.next(items);
					obs.complete();
				}
			})
		})
	}

	getClergies() {
		this.clergysList = [];
		this.appointerList = [];
		this.service.getClergies().pipe(take(1)).subscribe({
			next: (res: any) => {
				let items = []
				if (res && res.value && res.value.length > 0) {
					items = res.value;
					for (let item of items) {
						item.name = `${this.sharedService.getClergyLevel(item)} ${item.stName} ${item.name}`;
					}
				}
				this.clergysList = items;
				this.appointerList = this.clergysList.filter(it => it.level == 'giam_muc');
				// if (this.isNullOrEmpty(this.dialogData.item)) {
				// 	let clergy = this.sharedService.getItemExistsInArray(this.clergyID, this.clergysList);
				// 	if (clergy) {
				// 		this.dataItemGroup.get('clergyName').setValue(clergy.name);
				// 	}
				// }
			}
		})
	}

	getPositions() {
		let options = {
			select: "id,name,code,slot,level",
			filter: "status ne 'inactive'"
		}
		this.positionListCache = [];
		this.service.getPositions(options).pipe(take(1)).subscribe({
			next: (res: any) => {
				let items = []
				if (res && res.value && res.value.length > 0) {
					items = res.value;
				}
				this.positionListCache = items;
				if (this.localItem && this.localItem.entityType) {
					this.handlePositionList(this.localItem.entityType, 'entityName');
				}
				else {
					this.positionList = this.positionListCache;
				}
				if (this.fromAppointmentItem) {
					this.updateFromAppointment(this.fromAppointmentItem);
				}
			}
		})
	}

	closeDialog() {
		this.dialogRef.close(null)
	}

	onSaveNew() {
		if (!this.isNullOrEmpty(this.dataItemGroup.get("fromAppointmentID").value)) {
			if (this.dataItemGroup.get('status').value != 'cho_xac_nhan') {
				let fromAppointmentJSON = {
					toDate: this.sharedService.ISOStartDay(this.dataItemGroup.get("fromToDate").value),
					status: this.dataItemGroup.get("fromStatus").value
				}
				forkJoin([
					this.onSaveAppointment(this.dataItemGroup.get("fromAppointmentID").value),
					this.service.updateAppointment(this.dataItemGroup.get("fromAppointmentID").value, fromAppointmentJSON)]).pipe(take(1)).subscribe({
						next: () => {
							this.dialogRef.close("OK");
						}
					})
			}
			else {
				this.onSaveAppointment(this.dataItemGroup.get("fromAppointmentID").value).pipe(take(1)).subscribe({
					next: () => {
						this.dialogRef.close("OK");
					}
				})
			}
		}
		else {
			this.onSaveAppointment("").pipe(take(1)).subscribe({
				next: () => {
					this.dialogRef.close("OK");
				}
			})
		}
	}

	onSaveItem() {
		this.checkValidateSaveAppointment(this.dataItemGroup.get('entityID').value, this.dataItemGroup.get('entityType').value, this.dataItemGroup.get('clergyID').value, "").pipe(take(1)).subscribe({
			next: (pass: boolean) => {
				if (pass) {
					if (this.dataItemGroup.get('position').value == 'huu' || this.dataItemGroup.get('position').value == 'nghi_duong') {
						//Xin thêm những chức vụ nào chỉ có 1, position thêm multi level, thêm biến acceptMember: 1,2,3
						this.onSaveNew();
					}
					else {
						let positionItem = this.sharedService.getItemExistsInArray(this.dataItemGroup.get('position').value, this.positionListCache, 'code');
						if (positionItem && positionItem.slot > 0) {
							let top = positionItem ? positionItem.slot : 1;
							this.checkValidateEntity(this.dataItemGroup.get('entityID').value, this.dataItemGroup.get('entityType').value, top).pipe(take(1)).subscribe({
								next: (res: any) => {
									if (this.isNullOrEmpty(res)) {
										this.onSaveNew();
									}
									else {
										let data: any = {
											submitBtn: 'Đồng Ý',
											cancelBtn: 'Hủy Tất Cả'
										}
										let clergyNames = "";
										if (res && res.length > 0) {
											clergyNames = res.map(it => it.clergyName).join(", ");
										}
										let confirmMessage = `<strong>${this.dataItemGroup.get('entityName').value}</strong> chỉ có thể có ${top} <strong>${this.sharedService.getNameExistsInArray(this.dataItemGroup.get('position').value, this.positionListCache, 'code')}</strong>
											nếu ấn nút <strong>Đồng Ý</strong> có nghĩa là bạn sẽ chuyển trạng thái của <strong>${clergyNames}</strong> hiện đang làm <strong>${this.sharedService.getNameExistsInArray(this.dataItemGroup.get('position').value, this.positionListCache, 'code')}</strong> tại ${this.dataItemGroup.get('entityName').value} thành <strong>Chờ Thuyên Chuyển</strong>`;
										if (res && res.length > 1) {
											data.arrFromList = res.map(it => {
												return {
													name: it.clergyName,
													value: it.id
												}
											});
											data.valueType = 'select';
											data.requireCtrl = true;
											confirmMessage = `<strong>${this.dataItemGroup.get('entityName').value}</strong> chỉ có thể có ${top} <strong>${this.sharedService.getNameExistsInArray(this.dataItemGroup.get('position').value, this.positionListCache, 'code')}</strong>
											nếu ấn nút <strong>Đồng Ý</strong> có nghĩa là bạn sẽ chuyển trạng thái của 1 trong những người sau <strong>${clergyNames}</strong> hiện đang làm <strong>${this.sharedService.getNameExistsInArray(this.dataItemGroup.get('position').value, this.positionListCache, 'code')}</strong> tại ${this.dataItemGroup.get('entityName').value} thành <strong>Chờ Thuyên Chuyển</strong>`;
										}
										data.confirmMessage = confirmMessage;
										let config: any = {
											data: data
										};
										this.showDialogConfirm(config).pipe(take(1)).subscribe({
											next: (resConfirm: any) => {
												if (resConfirm && resConfirm.action == 'ok') {
													let appointmentJSON = {
														status: 'cho_thuyen_chuyen',
													}
													let id = res[0].id;
													if (resConfirm.data) {
														id = resConfirm.data;
													}
													this.service.updateAppointment(id, appointmentJSON).pipe(take(1)).subscribe({
														next: () => {
															this.onSaveNew();
														}
													})
												}
												else {
													this.dialogRef.close(null);
												}
											}
										})
									}
								}
							})
						}
						else {
							this.onSaveNew();
						}
					}
				}
				else {
					let config: any = {
						data: {
							submitBtn: 'Nhập lại',
							cancelBtn: 'Hủy Tất Cả',
							confirmMessage: `<strong>Bổ nhiệm bị trừng lặp</strong>. ${this.dataItemGroup.get('clergyName').value} hiện đang ở ${this.dataItemGroup.get('entityName').value} bạn không thể tạo mới bổ nhiệm.`
						}
					};
					this.showDialogConfirm(config).pipe(take(1)).subscribe({
						next: (resConfirm: any) => {
							if (resConfirm && resConfirm.action == 'ok') {

							}
							else {
								this.dialogRef.close(null);
							}
						}
					})
				}
			}
		})

	}

	onSaveAppointment(fromAppointmentID: string) {
		return new Observable(obs => {
			let valueForm = this.dataItemGroup.value;
			let appointmentJSON = {
				clergyName: this.dataItemGroup.get('clergyName').value,
				clergyID: this.dataItemGroup.get('clergyID').value,
				entityID: valueForm.entityID,
				entityName: valueForm.entityName,
				appointerID: valueForm.appointerID,
				appointerName: valueForm.appointerName,
				entityType: valueForm.entityType,
				fromDate: this.sharedService.ISOStartDay(valueForm.fromDate),
				toDate: this.sharedService.ISOStartDay(valueForm.toDate),
				effectiveDate: this.sharedService.ISOStartDay(valueForm.effectiveDate),
				position: valueForm.position,
				fromAppointmentID: fromAppointmentID,
				fromAppointmentToDate: this.sharedService.ISOStartDay(this.dataItemGroup.get("fromToDate").value),
				status: this.dataItemGroup.get('status').value,
			}
			if (this.localItem && this.localItem.id) {
				this.service.updateAppointment(this.localItem.id, appointmentJSON).pipe(take(1)).subscribe({
					next: () => {
						obs.next();
						obs.complete();
					}
				})
			}
			else {
				this.service.createAppointment(appointmentJSON).pipe(take(1)).subscribe({
					next: () => {
						obs.next();
						obs.complete();
					}
				})
			}
		})
	}

	showDialogConfirm(config: any) {
		return new Observable(obs => {
			config.disableClose = true;
			config.panelClass = 'dialog-form-l';
			config.maxWidth = '80vw';
			config.autoFocus = false;
			let dialogRef = this.dialog.open(DialogConfirmComponent, config);
			dialogRef.afterClosed().pipe(takeUntil(this.unsubscribe)).subscribe({
				next: (res: any) => {
					obs.next(res);
					obs.complete();
				}
			});
		})
	}

	checkValidateStatus(statusChange: string, clergyID: string, appointerID: string) {
		return new Observable(obs => {
			if (statusChange == 'man_nhiem') {
				let options = {
					filter: `id ne ${appointerID} and clergyID eq ${clergyID} and status eq 'duong_nhiem'`,
					top: 1
				}
				this.dataProcessing = true;
				this.service.getAppointments(options).pipe(take(1)).subscribe((res: any) => {
					this.dataProcessing = false;
					if (res && res.value && res.value.length > 0) {
						obs.next('valid');
						obs.complete();
					}
					else {
						obs.next('enter-new-appointment');
						obs.complete();
					}

				})
			}
			else {
				obs.next('valid');
				obs.complete();
			}
		})
	}

	checkValidateEntity(entityID: string, entityType: string, top: number) {
		return new Observable(obs => {
			let options = {
				filter: `entityID eq ${entityID} and entityType eq '${entityType}' and status eq 'duong_nhiem'`,
				top: top
			}
			this.dataProcessing = true;
			this.service.getAppointments(options).pipe(take(1)).subscribe((res: any) => {
				this.dataProcessing = false;
				if (res && res.value && res.value.length > top - 1) {
					obs.next(res.value);
					obs.complete();
				}
				else {
					obs.next(null);
					obs.complete();
				}

			})
		})
	}

	checkValidateSaveAppointment(entityID: string, entityType: string, clergyID: string, appointmentID: string) {
		return new Observable(obs => {
			let filter = `entityID eq ${entityID} and entityType eq '${entityType}' and clergyID eq ${clergyID} and status eq 'duong_nhiem'`;
			if (!this.isNullOrEmpty(appointmentID)) {
				filter = `${filter} and id ne ${appointmentID}`;
			}
			let options = {
				filter: filter,
				top: 1
			}
			this.dataProcessing = true;
			this.service.getAppointments(options).pipe(take(1)).subscribe((res: any) => {
				this.dataProcessing = false;
				if (res && res.value && res.value.length > 0) {
					obs.next(false);
					obs.complete();
				}
				else {
					obs.next(true);
					obs.complete();
				}

			})
		})
	}

}
