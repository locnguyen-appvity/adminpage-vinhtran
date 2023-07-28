import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'imageUrlTransformer'
})
export class ImageUrlTransformerPipe implements PipeTransform {

  transform(imageUrl: string, newBaseUrl: string): unknown {
    return imageUrl.replace(/^https?:\/\/[^\/]+/, newBaseUrl);
  }

}
