import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import moment from 'moment';
import { LEVEL_CLERGY } from './data-manage';

@Injectable({
    providedIn: "root"
})
export class SharedPropertyService {
    constructor() {
    }

    get moment(): any {
        return moment;
    }

    private target: string = '';
    set Target(target: string) {
        this.target = target;
    }

    get Target() {
        return this.target;
    }

    private currentUser: any;
    set CurrentUser(currentUser: any) {
        this.currentUser = currentUser;
    }

    get CurrentUser() {
        return this.currentUser;
    }

    private _rootEndPointAPI: string = '';
    get RootEndPointAPI() {
        return this._rootEndPointAPI;
    }

    set RootEndPointAPI(rootEndPointAPI) {
        this._rootEndPointAPI = rootEndPointAPI;
    }

    private currentState: any;
    set CurrentState(currentState: any) {
        this.currentState = currentState;
    }

    get CurrentState() {
        return this.currentState;
    }

    public dataItem = new Subject<any>();
    public levelList: any[] = LEVEL_CLERGY;
    // Observable any streams
    dataItemObs = this.dataItem.asObservable();
    // Service message commands
    sharedData(data: any) {
        /*data = {
            action: action (string),
            data: data(any)
        } */
        this.dataItem.next(data);
    }

    public isChangedValue(orginalValue: any, currentValue: any) {
        let orginal = (orginalValue === null || orginalValue === undefined) ? '' : orginalValue;
        let current = (currentValue === null || currentValue === undefined) ? '' : currentValue;
        return orginal != current;
    }

    public isString(value: any) {
        return typeof value === 'string' || value instanceof String;
    };

    public isNullOrEmpty(data: any) {
        if (data === null || data === "" || data === undefined) {
            return true;
        }
        return false;
    }

    public convertDateStringToMomentUTC_0(data: string): any {
        if (!this.isNullOrEmpty(data)) {
            return this.moment.utc(data);
        };
        return null;
    }


    getClergyLevel(item: any) {
        if (!this.isNullOrEmpty(item.level)) {
            let level = this.getValueAutocomplete(item.level, this.levelList, 'code');
            if (level && level.name) {
                return level.name;
            }
        }
        return "";
    }

    getTypeGetData(entityType: string) {
        switch (entityType) {
            case 'giao_xu':
            case 'giao_diem':
            case 'giao_ho':
                return 'organization';
            default:
                return 'group';
        }
    }

    getOrderPositionClergy(position: string) {
        switch (position) {
            case 'chanh_xu':
                return '1';
            case 'pho_xu':
                return '2';
            case 'pho_biet_cu':
                return '3';
            case 'huu':
            case 'nghi_duong':
            case 'huu_duong':
                return '9';
            default:
                return "5";
        }
    }

    getClergyStatus(status: string) {
        switch (status) {
            case 'duong_nhiem':
                return 'Đương Nhiệm'
            case 'man_nhiem':
                return 'Mãn Nhiệm'
            case 'cho_thuyen_chuyen':
                return 'Chờ Thuyên Chuyển'
            case 'cho_xac_nhan':
                return 'Chờ Xác Nhận'
            case 'dang_phuc_vu':
                return 'Đang Phục Vụ'
            case 'huu':
            case 'huu_duong':
                return 'Hưu Dưỡng'
            case 'rip':
                return 'R.I.P'
            default:
                return "Chưa Xác Định";
        }
    }

    getClergyStatusClass(status: string) {
        switch (status) {
            case 'duong_nhiem':
            case 'dang_phuc_vu':
                return 'approved-label'
            case 'man_nhiem':
            case 'huu':
            case 'huu_duong':
                return 'end-label'
            case 'cho_thuyen_chuyen':
                return 'pending-label pending-label--appointment'
            case 'cho_xac_nhan':
                return 'draft-label'
            case 'rip':
                return 'rip-label'
            default:
                return "draft-label";
        }
    }

    getIdentityCardTypeName(identityCardType: string) {
        switch (identityCardType) {
            case 'chung_minh':
                return 'Chứng Minh'
            case 'can_cuoc':
                return 'Căn Cước'
            case 'passport':
                return 'Passport'
            default:
                return identityCardType;
        }
    }

    updateTypeOrg(type: string) {
        switch (type) {
            case 'giao_hat':
                return 'Giáo hạt'
            case 'giao_xu':
                return 'Giáo xứ'
            case 'giao_ho':
                return 'Giáo họ'
            case 'giao_diem':
                return 'Giáo điểm'
            case 'dong_tu':
                return 'Dòng'
            case 'cong_doan':
                return 'Cộng Đoàn'
            case 'co_so_giao_phan':
                return 'Cơ Sở Giáo Phận';
            case 'co_so_ngoai_giao_phan':
                return 'Cơ Sở Ngoài Giáo Phận';
            case 'ban_muc_vu':
                return 'Ban Mục Vụ';
            case 'ban_chuyen_mon':
                return 'Ban Chuyên Môn';
            default:
                return "";
        }
    }

    updateNameTypeOrg(type: string) {
        switch (type) {
            case 'giao_hat':
                return 'Giáo hạt'
            case 'giao_xu':
            case 'giao_xu_ngoai_giao_phan':
                return 'Giáo xứ'
            case 'giao_diem':
                return 'Giáo điểm'
            case 'dong_tu':
                return 'Dòng'
            case 'cong_doan':
                return 'Cộng Đoàn'
            case 'dioceses':
            case 'diocese':
                return 'Giáo Phận'
            // case 'co_so_giao_phan':
            //     return 'Cơ Sở Giáo Phận';
            // case 'ban_muc_vu':
            //     return 'Ban Mục Vụ';
            // case 'ban_chuyen_mon':
            //     return 'Ban Chuyên Môn';
            default:
                return "";
        }
    }

    parseOffsetTimezone(offset: any): number {
        if (offset) {
            if (typeof offset === "number") {
                return offset;
            };
            let arrOffset = offset.split(".");
            if (arrOffset.length > 1) {
                return (
                    parseFloat(arrOffset[0] || 0) +
                    parseFloat(arrOffset[1] || 0) / 60
                );
            };
            return parseFloat(arrOffset[0] || 0);
        };
        return 0;
    }

    public convertDateStringToMoment(data: string, offset: any): any {
        if (!this.isNullOrEmpty(data)) {
            if (/Z$/.test(data) === false) {
                data = data + 'Z';
            };
            let date: any = moment(data);
            let currentTimezone = this.parseOffsetTimezone(offset) * 60;
            let timezone = date._offset;
            let timespan = 0;
            if (currentTimezone !== timezone) {
                timespan = 0 - (currentTimezone - timezone);
            };
            if (date.isDST()) {
                date.subtract(timespan, "m");
            };
            return date;
        };
        return null;
    }

    public ISOStartDay(data: any): string {
        if (!this.isNullOrEmpty(data)) {
            return data.startOf('day').format('YYYY-MM-DDTHH:mm:ss[Z]');
        };
        return null;
    }

    public ISODay(data: any): string {
        if (!this.isNullOrEmpty(data)) {
            return data.format('YYYY-MM-DDTHH:mm:ss[Z]');
        };
        return null;
    }

    public ISOEndDay(data: any): string {
        if (!this.isNullOrEmpty(data)) {
            return data.endOf('day').format('YYYY-MM-DDTHH:mm:ss[Z]');
        };
        return null;
    }

    public formatDate(data: any): string {
        if (!this.isNullOrEmpty(data)) {
            return data.format('DD/MM/YYYY');
        };
        return "";
    }

    public formatDateTime(data: any): string {
        if (!this.isNullOrEmpty(data)) {
            return data.format('DD/MM/YYYY hh"mm');
        };
        return "";
    }

    public removeAccents(str) {
        return !this.isNullOrEmpty(str) ? str.normalize('NFD')
            .replace(/[\u0300-\u036f]/g, '')
            .replace(/đ/g, 'd').replace(/Đ/g, 'D') : str;
    }

    public isPageSkipLogin() {
        let currentUrl = window.location.href;
        if (currentUrl.endsWith('welcome')
        ) {
            return true;
        }
        return false;
    }

    public handleODataSpecialCharacters(attribute: any): string {
        let result = '';
        result = encodeURIComponent(attribute);
        return result;
    }

    public getValueAutocomplete(value: any, data: any, key: string = 'id') {
        if (!this.isNullOrEmpty(value)) {
            if (data && data.length > 0) {
                for (let item of data) {
                    if (item[key] === value) {
                        return item;
                    }
                }
            }
        }
        return null;
    }

    public checkValueExistsInArray(value: any, data: any) {
        if (!this.isNullOrEmpty(value)) {
            if (data && data.length > 0) {
                for (let item of data) {
                    if (item === value) {
                        return true;
                    }
                }
            }
        }
        return false;
    }

    public checkItemExistsInArray(value: any, data: any, key: string = 'id') {
        if (!this.isNullOrEmpty(value)) {
            if (data && data.length > 0) {
                for (let item of data) {
                    if (item[key] === value) {
                        return true;
                    }
                }
            }
        }
        return false;
    }

    public getNameExistsInArray(value: any, data: any, key: string = 'id', keyTitle: string = 'name') {
        if (!this.isNullOrEmpty(value)) {
            if (data && data.length > 0) {
                for (let item of data) {
                    if (item[key] === value) {
                        return item[keyTitle];
                    }
                }
            }
        }
        return "";
    }

    public getItemExistsInArray(value: any, data: any, key: string = 'id'): any {
        if (!this.isNullOrEmpty(value)) {
            if (data && data.length > 0) {
                for (let item of data) {
                    if (item[key] === value) {
                        return item;
                    }
                }
            }
        }
        return null;
    }

    public convertLocaleLowerCase(str: string) {
        if (!this.isNullOrEmpty(str)) {
            return str.toLocaleLowerCase();
        }
        return str;
    }

    public convertUpperCase(str: string) {
        if (!this.isNullOrEmpty(str)) {
            return str.toUpperCase();
        }
        return str;
    }

    public removeVietnameseTones(str: string) {
        if (!this.isNullOrEmpty(str)) {
            str = str.normalize("NFD")
                .replace(/[\u0300-\u036f]/g, "")
                .replace(/đ/g, "d")
                .replace(/Đ/g, "D");
        }
        return str;
    }

    public firstUpperCase(str: string) {
        if (!this.isNullOrEmpty(str)) {
            const arr = this.convertLocaleLowerCase(str).split(" ");
            return arr.map(it => {
                return it.charAt(0).toUpperCase() + it.slice(1);
            }).join(" ");
        }
        return str;
    }

    public getLinkOfName(str: string, key: string = '-') {
        if (!this.isNullOrEmpty(str)) {
            str = this.removeVietnameseTones(str);
            const validatePattern = /[\&\*\(\)\{\}\[\]\|\<\>\?\/\\\'\`\!\%\^\:\,\.\;]/g;
            str = this.convertLocaleLowerCase(str.replace(validatePattern, ''));
            str = str.replace(/ /g, key);
        }
        return str;
    }
}
