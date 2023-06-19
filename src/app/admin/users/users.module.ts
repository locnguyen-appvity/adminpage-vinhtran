import { NgModule } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatToolbarModule } from '@angular/material/toolbar';
import { SharedModule } from '../shared/shared.module';
import { UserListModule } from './user-list/user-list.module';
import { UserNavbarModule } from './user-navbar/user-navbar.module';
import { UsersRoutingModule } from './users-routing.module';
import { UsersComponent } from './users.component';



@NgModule({
  declarations: [
    UsersComponent
  ],
  imports: [
    SharedModule,
    UsersRoutingModule,
    UserListModule,
    UserNavbarModule,
    MatToolbarModule,
    MatButtonModule
  ]
})
export class UsersModule { }
