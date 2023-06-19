import { NgModule } from '@angular/core';
import { MatListModule } from '@angular/material/list';
import { SharedModule } from 'src/app/shared/shared.module';
import { UserNavbarComponent } from './user-navbar.component';



@NgModule({
  declarations: [
    UserNavbarComponent
  ],
  imports: [
    SharedModule,
    MatListModule,
  ],
  exports: [UserNavbarComponent]
})
export class UserNavbarModule { }
