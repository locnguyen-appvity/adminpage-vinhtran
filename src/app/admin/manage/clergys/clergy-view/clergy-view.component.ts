import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { take } from 'rxjs';
import { SharedPropertyService } from 'src/app/shared/shared-property.service';
import { SharedService } from 'src/app/shared/shared.service';
import { SimpleBaseComponent } from 'src/app/shared/simple.base.component';
import { GlobalSettings } from 'src/app/shared/global.settings';
import { LinqService } from 'src/app/shared/linq.service';
import { getHtmlExport } from './data-export';
import { saveAs } from 'file-saver';
import { asBlob } from 'html-docx-js-typescript';
import { HttpClient } from '@angular/common/http';
import Docxtemplater from 'docxtemplater';
import PizZipUtils from 'pizzip/utils/index.js';
import PizZip from 'pizzip';
import { DomSanitizer } from '@angular/platform-browser';

function loadFile(url, callback) {
	PizZipUtils.getBinaryContent(url, callback);
}
@Component({
	selector: 'app-clergy-view',
	templateUrl: './clergy-view.component.html',
	styleUrls: ['./clergy-view.component.scss']
})
export class ClergyViewComponent extends SimpleBaseComponent implements OnInit {
	public localItem: any;
	// public levelList: any[] = LEVEL_CLERGY;
	public groupsList: any[] = [];
	public arrMasses: any[] = [];
	public churchsList: any[] = [];
	public arrAppointments: any[] = [];
	public arrAnniversaries: any[] = [];
	public positionList: any[] = [];
	constructor(
		private service: SharedService,
		public sharedService: SharedPropertyService,
		public linq: LinqService,
		public router: Router,
		public activeRoute: ActivatedRoute,
		private httpClient: HttpClient,
		private sanitizer: DomSanitizer
	) {
		super(sharedService);
		this.ID = this.activeRoute.parent.snapshot.paramMap.get("id");
		if (!this.isNullOrEmpty(this.ID)) {
			this.getClergy();
		}

	}

	ngOnInit(): void {
		this.getAllData();
	}

	// {
	// 	"stName": "Giuse",
	// 	"name": "Nguyễn Văn Thể",
	// 	"type": "tu_trieu",
	// 	"organizationID": "1e8f563e-4543-4370-a091-0f07de220b85",
	// 	"phoneNumber": "",
	// 	"email": "",
	// 	"status": "publish",
	// 	"photo": "public/storage/images/840fa747-2dca-42f5-a368-69224c6b36af.png",
	// 	"content": null,
	// 	"dateOfBirth": null,
	// 	"placeOfBirth": null,
	// 	"fatherName": null,
	// 	"motherName": null,
	// 	"baptizeDate": null,
	// 	"confirmationDate": null,
	// 	"baptizePlace": null,
	// 	"confirmationPlace": null,
	// 	"bigSeminary": null,
	// 	"smallSeminary": null,
	// 	"bigSeminaryDate": null,
	// 	"smallSeminaryDate": null,
	// 	"identityCardNumber": null,
	// 	"identityCardType": null,
	// 	"identityCardIssueDate": null,
	// 	"identityCardIssuePlace": null,
	// 	"code": null,
	// 	"manageOrgId": null,
	// 	"belongOrgId": null,
	// 	"manageOrgPosition": null,
	// 	"level": "linh_muc",
	// 	"vowDate": null,//Ngày Khấn
	// 	"ripDate": null,
	// 	"ripOrgId": null,
	// 	"ripNote": null,
	// 	"note": null,
	// 	"parable": null,//Câu Châm ngôn
	// 	"birthOrgName": null,
	// 	"ripOrgName": null,
	// 	"orgName": null,
	// 	"created": "2023-07-03T00:00:00Z",
	// 	"modified": "2023-07-20T07:11:48.470276Z",
	// 	"createdBy": null,
	// 	"modifiedBy": null,
	// 	"id": "18f54830-9017-456d-a575-97439d31e697"
	// }

	// getControls(frmGrp: FormGroup, key: string) {
	// 	return (<FormArray>frmGrp.controls[key]).controls;
	// }

	// initialEventGroup(item: any): FormGroup {
	// 	return this.fb.group({
	// 		id: item ? item.id : '',
	// 		name: [item ? item.name : '', Validators.required],
	// 		day: [item ? item.day : '', Validators.required],
	// 		date: item ? item._date : '',
	// 		description: item ? item.description : '',
	// 	});
	// }

	// onAddSegment() {
	// 	let arrForm = this.dataItemGroup.get('items') as FormArray;
	// 	arrForm.push(this.initialEventGroup({}));

	// 	// let control = arrForm.controls[index];
	// 	// this.initialValueChangeHost(control);
	// }

	// actionsAsync() {
	// 	this.sharedService.dataItemObs.pipe(distinctUntilChanged(), share(), shareReplay({
	// 		bufferSize: 1,
	// 		refCount: true,
	// 	}), takeUntil(this.unsubscribe)).subscribe((res: any) => {
	// 		if (res.action === 'open-dialog-img') {
	// 			this.openDialogImg();
	// 		}
	// 	})
	// }

	openDialogImg(editor?: any) {
		// let config: any = {
		// 	data: {
		// 		entityID: "",
		// 		entityType: "",
		// 		hasGetData: false
		// 	}
		// };
		// config.disableClose = false;
		// config.panelClass = 'dialog-form-xxl';
		// config.maxWidth = '90vw';
		// config.autoFocus = true;
		// let dialogRef = this.dialog.open(DialogSelectedImgsComponent, config);
		// dialogRef.afterClosed().pipe(takeUntil(this.unsubscribe)).subscribe({
		// 	next: (res: any) => {

		// 	}
		// })
	}

	async onDownload() {
		if (this.dataProcessing) {
			return;
		}
		let options = {
			filter: `clergyID eq ${this.ID}`,
			sort: 'effectiveDate desc'
		}
		this.arrAppointments = [];
		this.dataProcessing = true;
		this.service.getAppointments(options).pipe(take(1)).subscribe(async (res: any) => {
			this.dataProcessing = false;
			let appointments = [];
			if (res && res.value && res.value.length > 0) {
				for (let item of res.value) {
					item.statusView = this.sharedService.getClergyStatus(item.status);
					item.positionView = this.sharedService.getNameExistsInArray(item.position, this.positionList, 'code');
					if (item && item.fromDate) {
						item._fromDate = this.sharedService.convertDateStringToMomentUTC_0(item.fromDate);
						item.fromDateView = item._fromDate.format('DD/MM/YYYY');
					}
					if (item && item.toDate) {
						item._toDate = this.sharedService.convertDateStringToMomentUTC_0(item.toDate);
						item.toDateView = item._toDate.format('DD/MM/YYYY');
					}
					if (item && item.effectiveDate) {
						item._effectiveDate = this.sharedService.convertDateStringToMomentUTC_0(item.effectiveDate);
						item.effectiveDateView = item._effectiveDate.format('DD/MM/YYYY');
					}
				}
				appointments = res.value;
			}
			// let dataExport = getHtmlExport(this.localItem, appointments);
			// const blob = await asBlob(dataExport, { margins: { top: 900, left: 900, right: 900, bottom: 900 } });
			// saveAs(blob, `${this.localItem.displayName} ${this.localItem.name}.docx`);
			let localItem = this.localItem;
			let seft = this;
			loadFile(
				'/assets/user.docx',
				function (error: Error | null, content: string) {
					if (error) {
						throw error;
					}
					const zip = new PizZip(content);
					const doc = new Docxtemplater(zip, {
						paragraphLoop: true,
						linebreaks: true,
					});
					doc.setData({
						pictureUrl: localItem.pictureUrl ? localItem.pictureUrl : "",
						displayName: localItem.displayName ? localItem.displayName : "Chưa cập nhật",
						name: localItem.name ? localItem.name : "Chưa cập nhật",
						stName: localItem.stName ? localItem.stName : "Chưa cập nhật",
						parable: localItem.parable ? localItem.parable : "Chưa cập nhật",
						dateOfBirthView: localItem.dateOfBirthView ? localItem.dateOfBirthView : "Chưa cập nhật",
						placeOfBirth: localItem.placeOfBirth ? localItem.placeOfBirth : "Chưa cập nhật",
						orgName: localItem.orgName ? localItem.orgName : "Chưa cập nhật",
						diocesName: localItem.diocesName ? localItem.diocesName : "Giáo Phận Phú Cường",
						fatherName: localItem.fatherName ? localItem.fatherName : "Chưa cập nhật",
						motherName : localItem.motherName ? localItem.motherName : "Chưa cập nhật"
					});
					try {
						// render the document (replace all occurences of {first_name} by John, {last_name} by Doe, ...)
						doc.render();
					} catch (error) {
						// The error thrown here contains additional information when logged with JSON.stringify (it contains a properties object containing all suberrors).
						function replaceErrors(key, value) {
							if (value instanceof Error) {
								return Object.getOwnPropertyNames(value).reduce(function (
									error,
									key
								) {
									error[key] = value[key];
									return error;
								},
									{});
							}
							return value;
						}
						console.log(JSON.stringify({ error: error }, replaceErrors));

						if (error.properties && error.properties.errors instanceof Array) {
							const errorMessages = error.properties.errors
								.map(function (error) {
									return error.properties.explanation;
								})
								.join('\n');
							console.log('errorMessages', errorMessages);
							// errorMessages is a humanly readable message looking like this :
							// 'The tag beginning with "foobar" is unopened'
						}
						throw error;
					}
					const out = doc.getZip().generate({
						type: 'blob',
						mimeType:
							'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
					});
					// Output the document using Data-URI
					saveAs(out, `${seft.localItem.displayName} ${seft.localItem.name}.docx`);
				}
			);
		})

	}


	getAllData() {
		this.getGroups();
		this.getChurchsList();
		this.getPositions();
	}

	getPositions() {
		let options = {
			select: "id,name,code,slot,level",
			filter: "status ne 'inactive'"
		}
		this.positionList = [];
		this.service.getPositions(options).pipe(take(1)).subscribe({
			next: (res: any) => {
				let items = []
				if (res && res.value && res.value.length > 0) {
					items = res.value;
				}
				this.positionList = items;
				this.getAppointments(this.ID);
			}
		})
	}

	getGroups() {
		this.groupsList = [];
		let options = {
			select: 'id,name,type',
			filter: "type eq 'dong_tu'"
		}
		this.service.getGroups(options).pipe(take(1)).subscribe({
			next: (res: any) => {
				let items = []
				if (res && res.value && res.value.length > 0) {
					items.push(...res.value);
					for (let item of items) {
						item.name = `${this.sharedService.updateTypeOrg(item.type)} ${item.name}`
					}
				}
				this.groupsList = items;
			}
		})
	}


	getChurchsList() {
		this.churchsList = [];
		let options = {
			select: 'id,name,type',
			filter: "type eq 'giao_xu' or type eq 'giao_diem' or type eq 'giao_ho'"
		}
		this.service.getOrganizations(options).pipe(take(1)).subscribe({
			next: (res: any) => {
				let items = []
				if (res && res.value && res.value.length > 0) {
					for (let item of res.value) {
						item.name = `${this.sharedService.updateNameTypeOrg(item.type)} ${item.name}`;
					}
					items.push(...res.value);
				}
				this.churchsList = items;
			}
		})
	}



	getClergy() {
		this.service.getClergy(this.ID).pipe(take(1)).subscribe({
			next: (res: any) => {
				if (res) {
					this.localItem = res;
					this.localItem.anniversaries = {};
					this.getAnniversaries(this.ID);
					this.localItem.dateOfBirthView = "Chưa cập nhật";
					this.localItem.identityCardTypeView = this.sharedService.getIdentityCardTypeName(this.localItem.identityCardType);
					this.localItem.identityCardIssueDateView = "Chưa cập nhật";
					this.localItem.displayName = `${this.sharedService.getClergyLevel(this.localItem)} ${this.localItem.stName}`;
					if (this.localItem.dateOfBirth) {
						this.localItem._dateOfBirth = this.sharedService.convertDateStringToMomentUTC_0(this.localItem.dateOfBirth);
						this.localItem.dateOfBirthView = this.sharedService.formatDate(this.localItem._dateOfBirth);
					}
					if (this.localItem.identityCardIssueDate) {
						this.localItem._identityCardIssueDate = this.sharedService.convertDateStringToMomentUTC_0(this.localItem.identityCardIssueDate);
						this.localItem.identityCardIssueDateView = this.sharedService.formatDate(this.localItem._identityCardIssueDate);
					}
					this.localItem.pictureUrl = './assets/icons/ic_priest.svg'
					if (this.localItem.photo) {
						this.localItem.pictureUrl = `${GlobalSettings.Settings.Server}/${this.localItem.photo}`;
					}
				}
			}
		})
	}

	getAppointments(clergyID: string) {
		let options = {
			filter: `clergyID eq ${clergyID} and status eq 'duong_nhiem'`
		}
		this.arrAppointments = [];
		this.dataProcessing = true;
		this.service.getAppointments(options).pipe(take(1)).subscribe((res: any) => {
			this.dataProcessing = false;
			if (res && res.value && res.value.length > 0) {
				for (let item of res.value) {
					item.order = this.sharedService.getOrderPositionClergy(item.position);
					item.positionView = this.sharedService.getNameExistsInArray(item.position, this.positionList, 'code');
				}
				this.arrAppointments = this.linq.Enumerable().From(res.value).OrderBy("$.order").ToArray();
			}
		})
	}

	getAnniversaries(clergyID: string) {
		let options = {
			sort: 'date asc',
			filter: `entityID eq ${clergyID} and entityType eq 'clergy' and (type eq 'baptize' or type eq 'confirmation' or type eq 'smallSeminary' or type eq 'bigSeminary' or type eq 'vow' or type eq 'pho_te' or type eq 'linh_muc')`
		}
		this.arrAnniversaries = [];
		this.dataProcessing = true;
		this.service.getAnniversaries(options).pipe(take(1)).subscribe((res: any) => {
			this.dataProcessing = false;
			if (res && res.value && res.value.length > 0) {
				for (let item of res.value) {
					item.dateView = "Chưa cập nhật";
					if (item.date) {
						item._date = this.sharedService.convertDateStringToMomentUTC_0(item.date);
						item.dateView = this.sharedService.formatDate(item._date);
					}
					if (this.isNullOrEmpty(item.locationName)) {
						item.locationName = "Chưa cập nhật";
					}
					if ((item.type == 'pho_te' || item.type == 'linh_muc' || item.type == 'baptize' || item.type == 'confirmation') && !this.isNullOrEmpty(item.description)) {
						item.descriptionView = `bới: ${item.description}`
					}
					this.localItem.anniversaries[item.type] = item;
				}
				this.arrAnniversaries = res.value;
			}
		})
	}

	onCancel() {
		this.router.navigate(['/admin/manage/clergys/clergys-list']);
	}

}