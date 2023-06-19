import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthorsListComponent } from './authors-list.component';

const routes: Routes = [
  {
    path: '', component: AuthorsListComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AuthorsListRoutingModule { }
