import { Component, Inject, Optional } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Observable, of, takeUntil } from 'rxjs';
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
			this.title = `Chỉnh Sửa ${this.localItem.name}`
		}
		else if (this.type == 'update-password') {
			this.localItem = this.dialogData.data;
			this.title = `Đổi Mật Khẩu Cho ${this.localItem.name}`
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

	updateValidator(){
		if (this.type == 'edit') {
			this.infoGroup.get('password').setValidators(null);
			this.infoGroup.get('userName').setValidators(null);
			this.infoGroup.get('role').setValidators(null);
		}
		else if (this.type == 'update-password') {
			this.infoGroup.get('name').setValidators(null);
		}
		this.infoGroup.get('password').updateValueAndValidity();
		this.infoGroup.get('userName').updateValueAndValidity();
		this.infoGroup.get('role').updateValueAndValidity();
		this.infoGroup.get('name').updateValueAndValidity();
	}

	intialMemberInfoGroup(item: any) {
		return this.fb.group({
			name: [item ? item.name : '', Validators.required],
			phoneNumber: item ? item.phoneNumber : '',
			password: [item ? item.password : '', Validators.required],
			role: [item ? item.role : '', Validators.required],
			userName: [item ? item.userName : '', Validators.required],
		})
	}

	//   {
	//     "_id": "6350dad62ca4cb4c7d13fe91",
	//     "name": "Vinh",
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
			"name": formValue.name,
			"address": formValue.address,
			"phoneNumber": formValue.phoneNumber,
			"deactive": 0,
		}
		if (this.localItem && !this.isNullOrEmpty(this.localItem._id)) {
			if (this.type == "update-password") {
				let dataJSONPass = {
					"role": formValue.role,
					"password": formValue.password
				}
				// this.service.updateUser(dataJSONPass, this.localItem._id).pipe(take(1)).subscribe({
				// 	next: () => {
				// 		this.dialogRef.close({ action: this.type === 'new' ? 'add' : 'save', data: formValue });
				// 	}
				// })
			}
			else {
				// this.service.updateUser(dataJSON, this.localItem._id).pipe(take(1)).subscribe({
				// 	next: () => {
				// 		this.dialogRef.close({ action: this.type === 'new' ? 'add' : 'save', data: formValue });
				// 	}
				// })
			}
		}
		else {
			dataJSON['password'] = formValue.password;
			dataJSON['role'] = formValue.role;
			dataJSON['userName'] = formValue.userName;
			// this.service.createUser(dataJSON).pipe(take(1)).subscribe({
			// 	next: () => {
			// 		this.dialogRef.close({ action: this.type === 'new' ? 'add' : 'save', data: formValue });
			// 	}
			// })
		}
	}

}
