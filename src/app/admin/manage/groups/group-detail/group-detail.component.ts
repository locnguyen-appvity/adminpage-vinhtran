import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable, forkJoin, of, take } from 'rxjs';
import { SharedPropertyService } from 'src/app/shared/shared-property.service';
import { SharedService } from 'src/app/shared/shared.service';
import { SimpleBaseComponent } from 'src/app/shared/simple.base.component';

@Component({
	selector: 'se-group-detail',
	templateUrl: './group-detail.component.html',
	styleUrls: ['./group-detail.component.scss']
})
export class GroupDetailComponent extends SimpleBaseComponent {

	public dataItemGroup: FormGroup;
	public localItem: any;
	public matTooltipBack: string = "Danh Sách";
	public statusLabel: any = {
		title: "Tạo Mới",
		class: 'draft-label'
	}
	public target: string = "giao_hat";
	public entityList: any;
	public fileSelected: any;

	constructor(public override sharedService: SharedPropertyService,
		private fb: FormBuilder,
		public activeRoute: ActivatedRoute,
		public router: Router,
		private service: SharedService) {
		super(sharedService);
		this.ID = this.activeRoute.parent.snapshot.paramMap.get("id");
		if (this.router.url.includes("hoi_doan")) {
			this.target = 'hoi_doan';
		}
		else if (this.router.url.includes("co_so_giao_phan")) {
			this.target = 'co_so_giao_phan';
		}
		else if (this.router.url.includes("co_so_ngoai_giao_phan")) {
			this.target = 'co_so_ngoai_giao_phan';
		}
		else if (this.router.url.includes("ban_muc_vu")) {
			this.target = 'ban_muc_vu';
		}
		else if (this.router.url.includes("ban_chuyen_mon")) {
			this.target = 'ban_chuyen_mon';
		}
		else if (this.router.url.includes("dong_tu")) {
			this.target = 'dong_tu';
		}
		else if (this.router.url.includes("cong_doan")) {
			this.target = 'cong_doan';
		}
		this.matTooltipBack = `Danh Sách ${this.sharedService.updateNameTypeOrg(this.target)}`
		if (!this.isNullOrEmpty(this.ID)) {
			this.getGroup();
		}
		this.dataItemGroup = this.fb.group({
			name: ["", [Validators.required]],
			description: "",
			phone: "",
			email: "",
			address: "",
			area: "",
			latitude: "",
			longitude: "",
			content: "",
			entityID: "",
			entityName: "",
			_entityID: "",
			entityType: "",
			photo: ""
		});
		if (this.target != 'giao_hat') {
			this.getEntityList();
		}
	}

	onSelectItem(event: any, target: string) {
		if (target == "entityID") {
			this.dataItemGroup.get("entityType").setValue(event ? event._type : "");
			this.dataItemGroup.get("entityName").setValue(event ? event.name : "");
			this.dataItemGroup.get("entityID").setValue(event ? event.id : "");
		}
	}

	getEntityList() {
		let requests: any = {
			groups: this.getGroups()
		}
		if (this.target == 'co_so_ngoai_giao_phan') {
			requests.dioceses = this.getDioceses()
		}
		forkJoin(requests).pipe(take(1)).subscribe({
			next: (res: any) => {
				let entityList = [];
				if (res && res.groups && res.groups.length > 0) {
					entityList.push(...res.groups);
				}
				if (res && res.dioceses && res.dioceses.length > 0) {
					entityList.push(...res.dioceses);
				}
				this.entityList = entityList;
			}
		})
	}

	getGroups() {
		return new Observable(obs => {
			let options = {
				select: 'id,name,type',
				filter: "type eq 'giao_hat'"
			}
			this.service.getGroups(options).pipe(take(1)).subscribe({
				next: (res: any) => {
					let items = [];
					if (res && res.value && res.value.length > 0) {
						for (let item of res.value) {
							item._type = "group";
							item._id = `${item._type}_${item.id}`;
							item.name = `${this.sharedService.updateNameTypeOrg(item.type)} ${item.name}`;
							item.groupName = this.sharedService.updateNameTypeOrg(item.type);
						}
						items = res.value;
					}
					obs.next(items);
					obs.complete();
				}
			})
		})
	}

	getDioceses() {
		return new Observable(obs => {
			let options = {
				select: 'id,name,type',
				filter: "status ne 'inactive'"
			}
			this.service.getDioceses(options).pipe(take(1)).subscribe({
				next: (res: any) => {
					let items = [];
					if (res && res.value && res.value.length > 0) {
						for (let item of res.value) {
							item._type = "dioceses";
							item._id = `${item._type}_${item.id}`;
							item.name = `${this.sharedService.updateNameTypeOrg(item._type)} ${item.name}`;
							item.groupName = this.sharedService.updateNameTypeOrg('dioceses');
						}
						items = res.value;
					}
					obs.next(items);
					obs.complete();
				}
			})
		})
	}

	getGroup() {
		this.service.getGroup(this.ID).pipe(take(1)).subscribe({
			next: (res: any) => {
				if (res) {
					this.localItem = res;
					this.statusLabel = this.updateLabelTitle(this.localItem.status);
					let _entityID = "";
					if (!this.isNullOrEmpty(this.localItem.entityID) && !this.isNullOrEmpty(this.localItem.entityType)) {
						_entityID = `${this.localItem.entityType}_${this.localItem.entityID}`
					}
					else if (!this.isNullOrEmpty(this.localItem.entityName)) {
						_entityID = this.localItem.entityName;
					}
					this.dataItemGroup.patchValue({
						name: this.localItem.name,
						description: this.localItem.description,
						content: this.localItem.content,
						entityID: this.localItem.entityID,
						entityType: this.localItem.entityType,
						entityName: this.localItem.entityName,
						_entityID: _entityID,
						phone: this.localItem.phone,
						email: this.localItem.email,
						address: this.localItem.address,
						area: this.localItem.area,
						latitude: this.localItem.latitude,
						longitude: this.localItem.longitude,
						photo: this.localItem.photo,
					});
				}
			}
		})
	}

	updateLabelTitle(status: string) {
		let statusLabel = {
			title: "Tạo Mới",
			class: 'draft-label'
		}
		switch (status) {
			case 'draft':
				statusLabel.title = "Lưu Nháp";
				statusLabel.class = "pending-label";
				break;
			case 'publish':
			case 'active':
				statusLabel.title = "Đã Xuất Bản";
				statusLabel.class = "approved-label";
				break;
			case 'inactive':
				statusLabel.title = "Tạm Ẩn";
				statusLabel.class = "rejected-label";
				break;
		}
		return statusLabel;
	}

	onSave() {
		let valueForm = this.dataItemGroup.value;
		let dataJSON = {
			name: valueForm.name,
			description: valueForm.description,
			content: valueForm.content,
			entityID: valueForm.entityID,
			entityType: valueForm.entityType,
			entityName: valueForm.entityName,
			area: valueForm.area,
			phone: valueForm.phone,
			email: valueForm.email,
			address: valueForm.address,
			latitude: valueForm.latitude,
			longitude: valueForm.longitude,
			photo: this.fileSelected ? this.fileSelected.filePath : valueForm.photo,
			// status: valueForm.status ? 'active' : 'inactive',
			// type: 'giao_hat'
		}
		this.dataProcessing = true;
		this.service.updateGroup(this.ID, dataJSON).pipe(take(1)).subscribe({
			next: () => {
				this.dataProcessing = false;
				this.routeToBack();
			}
		})
	}

	valueChangesFile(event: any) {
		if (event && event.action == 'value-change') {
			this.fileSelected = event.data ? event.data : "";
		}
	}

	routeToBack() {
		this.router.navigate([`/admin/manage/${this.target}/list`]);
	}

}
