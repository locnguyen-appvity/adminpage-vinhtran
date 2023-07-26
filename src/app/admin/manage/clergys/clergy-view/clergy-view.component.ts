import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { take } from 'rxjs';
import { SharedPropertyService } from 'src/app/shared/shared-property.service';
import { SharedService } from 'src/app/shared/shared.service';
import { SimpleBaseComponent } from 'src/app/shared/simple.base.component';
import { GlobalSettings } from 'src/app/shared/global.settings';
import { LinqService } from 'src/app/shared/linq.service';

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
		public activeRoute: ActivatedRoute
	) {
		super(sharedService);
		this.ID = this.activeRoute.parent.snapshot.paramMap.get("id");
		if (!this.isNullOrEmpty(this.ID)) {
			this.getClergy();
			this.getAnniversaries(this.ID);
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
					this.localItem.dateOfBirthView = "Chưa cập nhật";
					this.localItem.identityCardTypeView = "Chứng Minh";
					this.localItem.identityCardIssueDateView = "Chứng Minh";
					this.localItem.displayName =  `${this.sharedService.getClergyLevel(this.localItem)} ${this.localItem.stName}`;
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

	getAppointments(clergyID: string){
		let options = {
			filter: `clergyID eq ${clergyID} and status eq 'duong_nhiem'`
		}
		this.arrAppointments = [];
		this.dataProcessing = true;
		this.service.getAppointments(options).pipe(take(1)).subscribe((res: any) => {
			this.dataProcessing = false;
			if (res && res.value && res.value.length > 0) {
				for(let item of res.value){
					item.order = this.sharedService.getOrderPositionClergy(item.position);
					item.positionView = this.sharedService.getNameExistsInArray(item.position,this.positionList,'code');
				}
				this.arrAppointments = this.linq.Enumerable().From(res.value).OrderBy("$.order").ToArray();
			}
		})
	}

	getAnniversaries(clergyID: string){
		let options = {
			sort: 'date asc',
			filter: `type ne 'saint' and entityID eq ${clergyID} and entityType eq 'clergy' and (status eq 'auto' or type eq 'pho_te' or type eq 'linh_muc' or type eq 'rip')`
		}
		this.arrAnniversaries = [];
		this.dataProcessing = true;
		this.service.getAnniversaries(options).pipe(take(1)).subscribe((res: any) => {
			this.dataProcessing = false;
			if (res && res.value && res.value.length > 0) {
				for(let item of res.value){
					if (item.date) {
						item._date = this.sharedService.convertDateStringToMomentUTC_0(item.date);
						item.dateView = this.sharedService.formatDate(item._date);
					}
				}
				this.arrAnniversaries = res.value;
			}
		})
	}

	onCancel() {
		this.router.navigate(['/admin/manage/clergys/clergys-list']);
	}

}
