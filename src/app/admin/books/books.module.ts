import { NgModule } from '@angular/core';
import { BooksComponent } from './books.component';
import { BooksRoutingModule } from './books-routing.module';
import { SharedModule } from 'src/app/shared/shared.module';



@NgModule({
  declarations: [
    BooksComponent
  ],
  imports: [
    SharedModule,
    BooksRoutingModule
  ]
})
export class BooksModule { }
