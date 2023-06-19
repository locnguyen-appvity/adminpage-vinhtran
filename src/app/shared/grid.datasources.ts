import { DataSource } from "@angular/cdk/collections";
import { Observable ,  BehaviorSubject } from "rxjs";

export class GridDataSources extends DataSource<any> {
    constructor(private gridDataChanges: GridDataChanges) {
        super();
    }

    /** Connect function called by the table to retrieve one stream containing the data to render. */
    connect(): Observable<any[]> {
        return this.gridDataChanges.dataChanges;
    }

    disconnect() { 
    }
}

export class GridDataChanges {
    /** Stream that emits whenever the data has been modified. */
    public dataChanges: BehaviorSubject<any[]> = new BehaviorSubject<any[]>([]);
    private _data: any[] = [];
    private _total: number = 0;

    get data(): any[] {
        return this._data;
    }

    set data(items: any[]) {
        this._data = items;
        this.dataChanges.next(this.data);
    }

    get total(): number {
        return this._total;
    }

    set total(value: number) {
        this._total = value;
    }

    constructor() {
    }
}