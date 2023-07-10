import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { take } from 'rxjs';
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
	public matTooltipBack: string = "Danh Sách Giáo Xứ";
	public statusLabel: any = {
		title: "Tạo Mới",
		class: 'draft-label'
	}

	constructor(public override sharedService: SharedPropertyService,
		private fb: FormBuilder,
		public activeRoute: ActivatedRoute,
		public router: Router,
		private service: SharedService) {
		super(sharedService);
		this.ID = this.activeRoute.parent.snapshot.paramMap.get("id");
		if (!this.isNullOrEmpty(this.ID)) {
			this.getGroup();
		}
		this.dataItemGroup = this.fb.group({
			name: ["", [Validators.required]],
			description: "",
			content: "",
			status: false
		});
	}

	getGroup() {
		this.service.getGroup(this.ID).pipe(take(1)).subscribe({
			next: (res: any) => {
				if (res) {
					this.localItem = res;
					this.statusLabel = this.updateLabelTitle(this.localItem.status);
					this.dataItemGroup.patchValue({
						name: this.localItem.name,
						description: this.localItem.description,
						content: this.localItem.content
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
			status: valueForm.status ? 'active' : 'inactive'
		}
		this.dataProcessing = true;
		this.service.updateGroup(this.ID, dataJSON).pipe(take(1)).subscribe({
			next: () => {
				this.dataProcessing = false;
				this.routeToBack();
			}
		})
	}


	routeToBack() {
		this.router.navigate(['/admin/manage/groups/groups-list']);
	}

}
