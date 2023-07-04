import { Component, Inject, Optional } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Observable, of, take, takeUntil } from 'rxjs';
import { SharedPropertyService } from 'src/app/shared/shared-property.service';
import { SharedService } from 'src/app/shared/shared.service';
import { SimpleBaseComponent } from 'src/app/shared/simple.base.component';

@Component({
	selector: 'se-user-info',
	templateUrl: './user-info.component.html',
	styleUrls: ['./user-info.component.scss']
})
export class UserInfoComponent extends SimpleBaseComponent {

	public localItem: any;
	public infoGroup: FormGroup;
	public title: string = 'Thêm Người Dùng'
	public roleList$: Observable<any>;
	public hasChangedGroup: boolean = false;
	public hasChangedAvatar: boolean = false;
	public type: string = 'new';
	public hide: boolean = true;

	constructor(public sharedService: SharedPropertyService,
		private fb: FormBuilder,
		public dialogRef: MatDialogRef<UserInfoComponent>,
		@Optional() @Inject(MAT_DIALOG_DATA) private dialogData: any,
		private service: SharedService) {
		super(sharedService);
		if (this.dialogData.type) {
			this.type = this.dialogData.type;
		}
		if (this.type == 'edit') {
			this.localItem = this.dialogData.data;
			this.title = `Chỉnh Sửa ${this.localItem.fullName}`
		}
		else if (this.type == 'update-password') {
			this.localItem = this.dialogData.data;
			this.title = `Đổi Mật Khẩu Cho ${this.localItem.fullName}`
		}
		this.infoGroup = this.intialMemberInfoGroup(this.localItem);
		this.updateValidator();
		this.getListRoles();
		this.infoGroup.valueChanges.pipe(takeUntil(this.unsubscribe)).subscribe({
			next: () => {
				this.hasChangedGroup = true;
			}
		})
	}

	updateValidator() {
		if (this.type == 'edit') {
			this.infoGroup.get('password').setValidators(null);
			this.infoGroup.get('username').setValidators(null);
			this.infoGroup.get('priority').setValidators(null);
		}
		else if (this.type == 'update-password') {
			this.infoGroup.get('fullName').setValidators(null);
		}
		this.infoGroup.get('password').updateValueAndValidity();
		this.infoGroup.get('username').updateValueAndValidity();
		this.infoGroup.get('priority').updateValueAndValidity();
		this.infoGroup.get('fullName').updateValueAndValidity();
	}

	intialMemberInfoGroup(item: any) {
		return this.fb.group({
			fullName: [item ? item.fullName : '', Validators.required],
			// phoneNumber: item ? item.phoneNumber : '',
			password: [item ? item.password : '', Validators.required],
			priority: [item ? item.priority : '', Validators.required],
			username: [item ? item.username : '', Validators.required],
		})
	}

	//   {
	//     "id": "6350dad62ca4cb4c7d13fe91",
	//     "fullName": "Vinh",
	//     "address": "",
	//     "phoneNumber": "0987380003",
	//     "email": "",
	//     "role": "admin",
	//     "deactive": 0,
	//     "roleName": "Admin"
	// }

	getListRoles() {
		this.roleList$ = of([]);
		// this.service.getListRoles().pipe(take(1)).subscribe({
		// 	next: (res: any) => {
		// 		if (res && res.value) {
		// 			this.roleList$ = of(res.value);
		// 		}
		// 	}
		// })
	}

	valueChangesAvatar(event: any) {
		this.hasChangedAvatar = true;
	}

	closeDialog() {
		this.dialogRef.close(null);
	}

	onSaveItem() {
		let formValue = this.infoGroup.value;
		let dataJSON: any = {
			"fullName": formValue.fullName,
			// "address": formValue.address,
			// "phoneNumber": formValue.phoneNumber,
			"status": 1,
		}
		if (this.localItem && !this.isNullOrEmpty(this.localItem.id)) {
			if (this.type == "update-password") {
				let dataJSONPass = {
					"priority": formValue.priority,
					"password": formValue.password
				}
				this.service.updateUser(this.localItem.id, dataJSONPass).pipe(take(1)).subscribe({
					next: () => {
						this.dialogRef.close({ action: this.type === 'new' ? 'add' : 'save', data: formValue });
					}
				})
			}
			else {
				this.service.updateUser(this.localItem.id, dataJSON).pipe(take(1)).subscribe({
					next: () => {
						this.dialogRef.close({ action: this.type === 'new' ? 'add' : 'save', data: formValue });
					}
				})
			}
		}
		else {
			dataJSON['password'] = formValue.password;
			dataJSON['priority'] = formValue.priority;
			dataJSON['username'] = formValue.username;
			this.service.createUser(dataJSON).pipe(take(1)).subscribe({
				next: () => {
					this.dialogRef.close({ action: this.type === 'new' ? 'add' : 'save', data: formValue });
				}
			})
		}
	}

}
