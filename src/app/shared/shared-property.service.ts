import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import moment from 'moment';

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

    public displayGridMessage(totalItems: number) {
        let message = "";
        if (totalItems === 0) {
            message = "Không có dữ liệu.";
        }
        return message;
    }

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

    public convertDateStringToMoment(data: string): any {
        if (!this.isNullOrEmpty(data)) {
            return this.moment(data);
        };
        return null;
    }

    public ISOStartDay(data: any): string {
        if (!this.isNullOrEmpty(data)) {
            return data.startOf('day').format('YYYY-MM-DDTHH:mm:ss[Z]');
        };
        return null;
    }

    public ISOEndDay(data: any): string {
        if (!this.isNullOrEmpty(data)) {
            return data.endOf('day').format('YYYY-MM-DDTHH:mm:ss[Z]');
        };
        return null;
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

    public getValueAutocomplete(value: any, data: any, key: string = '_id') {
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

    public checkItemExistsInArray(value: any, data: any, key: string = '_id') {
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
            str = str.replace(/à|á|ạ|ả|ã|â|ầ|ấ|ậ|ẩ|ẫ|ă|ằ|ắ|ặ|ẳ|ẵ/g, "a");
            str = str.replace(/è|é|ẹ|ẻ|ẽ|ê|ề|ế|ệ|ể|ễ/g, "e");
            str = str.replace(/ì|í|ị|ỉ|ĩ/g, "i");
            str = str.replace(/ò|ó|ọ|ỏ|õ|ô|ồ|ố|ộ|ổ|ỗ|ơ|ờ|ớ|ợ|ở|ỡ/g, "o");
            str = str.replace(/ù|ú|ụ|ủ|ũ|ư|ừ|ứ|ự|ử|ữ/g, "u");
            str = str.replace(/ỳ|ý|ỵ|ỷ|ỹ/g, "y");
            str = str.replace(/đ/g, "d");
            str = str.replace(/À|Á|Ạ|Ả|Ã|Â|Ầ|Ấ|Ậ|Ẩ|Ẫ|Ă|Ằ|Ắ|Ặ|Ẳ|Ẵ/g, "A");
            str = str.replace(/È|É|Ẹ|Ẻ|Ẽ|Ê|Ề|Ế|Ệ|Ể|Ễ/g, "E");
            str = str.replace(/Ì|Í|Ị|Ỉ|Ĩ/g, "I");
            str = str.replace(/Ò|Ó|Ọ|Ỏ|Õ|Ô|Ồ|Ố|Ộ|Ổ|Ỗ|Ơ|Ờ|Ớ|Ợ|Ở|Ỡ/g, "O");
            str = str.replace(/Ù|Ú|Ụ|Ủ|Ũ|Ư|Ừ|Ứ|Ự|Ử|Ữ/g, "U");
            str = str.replace(/Ỳ|Ý|Ỵ|Ỷ|Ỹ/g, "Y");
            str = str.replace(/Đ/g, "D");
            // Some system encode vietnamese combining accent as individual utf-8 characters
            // Một vài bộ encode coi các dấu mũ, dấu chữ như một kí tự riêng biệt nên thêm hai dòng này
            str = str.replace(/\u0300|\u0301|\u0303|\u0309|\u0323/g, ""); // ̀ ́ ̃ ̉ ̣  huyền, sắc, ngã, hỏi, nặng
            str = str.replace(/\u02C6|\u0306|\u031B/g, ""); // ˆ ̆ ̛  Â, Ê, Ă, Ơ, Ư
            // Remove extra spaces
            // Bỏ các khoảng trắng liền nhau
            str = str.replace(/ + /g, " ");
            str = str.trim();
            // Remove punctuations
            // Bỏ dấu câu, kí tự đặc biệt
            str = str.replace(/!|@|%|\^|\*|\(|\)|\+|\=|\<|\>|\?|\/|,|\.|\:|\;|\'|\"|\&|\#|\[|\]|~|\$|_|`|-|{|}|\||\\/g, " ");
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
}
