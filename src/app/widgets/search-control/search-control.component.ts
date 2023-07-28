import { Component, Input } from '@angular/core';
import { take, takeUntil } from 'rxjs';
import { SharedPropertyService } from 'src/app/shared/shared-property.service';
import { SharedService } from 'src/app/shared/shared.service';
import { SimpleBaseComponent } from 'src/app/shared/simple.base.component';
import { DialogItemsComponent } from '../dialog-items/dialog-items.component';
import { MatDialog } from '@angular/material/dialog';
import { FormBuilder, FormGroup } from '@angular/forms';

@Component({
	selector: 'app-search-control',
	templateUrl: './search-control.component.html',
	styleUrls: ['./search-control.component.scss']
})
export class SearchControlComponent extends SimpleBaseComponent {
	@Input() target: string = 'clergys';
	@Input() title: string = '';
	@Input() data: any;
	public arrGroups: any[] = [];
	public ctrlFormGroup: FormGroup;
	public positionList: any[] = [];

	constructor(public sharedService: SharedPropertyService,
		public dialog: MatDialog,
		private fb: FormBuilder,
		public service: SharedService) {
		super(sharedService);
		this.getGroups();
		this.getPositions();
		this.ctrlFormGroup = this.fb.group({
			groupID: (this.data && this.data.groupID) ? this.data.groupID : 'all',
			name: (this.data && this.data.name) ? this.data.name : '',
			masses: (this.data && this.data.masses) ? this.data.masses : '',
			position: (this.data && this.data.position) ? this.data.position : 'all',
		})
	}

	getPositions() {
		// let options = {
		// 	filter: "type eq 'giao_xu'"
		// }
		this.positionList = [];
		this.service.getPositions().pipe(take(1)).subscribe({
			next: (res: any) => {
				let items = []
				if (res && res.value && res.value.length > 0) {
					items = res.value;
				}
				this.positionList = items;
			}
		})
	}

	getGroups() {
		this.arrGroups = [];
		let options = {
			filter: "type eq 'giao_hat'"
		}
		this.service.getGroups(options).pipe(take(1)).subscribe({
			next: (res: any) => {
				let items = []
				if (res && res.value && res.value.length > 0) {
					items = res.value;
				}
				this.arrGroups = items;
			}
		})
	}

	openFormDialog(item: any) {
		let config = {
			disableClose: true,
			panelClass: 'dialog-form-xxl',
			maxWidth: '80vw',
			minHeight: '90vh',
			autoFocus: true,
			data: {
				item: item,
				title: this.title,
				target: this.target
			}
		}
		let dialogRef = this.dialog.open(DialogItemsComponent, config);
		dialogRef.afterClosed().pipe(takeUntil(this.unsubscribe)).subscribe({
			next: (res: any) => {
			}
		});
	}

	onSearch() {
		this.openFormDialog(this.ctrlFormGroup.value);
	}
}
