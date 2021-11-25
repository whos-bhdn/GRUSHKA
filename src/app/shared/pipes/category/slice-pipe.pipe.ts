import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'slicePipe'
})
export class SlicePipePipe implements PipeTransform {

  transform(value: any, obj: any): any {
    if (!value){
      return []
    }
    const sliced = value.filter((el: any)=> el.category.path === obj.name)
    if (sliced.length >= 4){
      return sliced.slice(0, 4)
    }
    return sliced
  }

}
