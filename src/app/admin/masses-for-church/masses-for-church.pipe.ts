import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'massesForChurchTransformer'
})
export class MassesForChurchTransformerPipe implements PipeTransform {

  public itemValue: any = {
    ngay_thuong: {},
    chieu_thu_bay: {},
    chua_nhat: {},
    khac: {}
  }

  transform(masses: any): unknown {
    let itemValue = {
      ngay_thuong: [],
      chieu_thu_bay: [],
      chua_nhat: [],
      khac: []
    }
    for (let masse of masses) {
      itemValue[masse.code].push(masse);
    }
    let value = [];
    for(let key in itemValue){
      if(itemValue[key].length > 0){
        value.push({
          name: key,
          data: itemValue[key].map(it=>it.time).join(", ")
        })
      }
      // else if(itemValue[key].length > 0) {

      // }
    }
    return;
  }

}
