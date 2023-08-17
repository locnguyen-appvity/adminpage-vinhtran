import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginPageComponent } from './login-page/login-page.component';
import { AppRoutingPreloadingStrategy } from './app-routing.preloading';

const routes: Routes = [
  {
    path: 'admin',
    loadChildren: () => import('./admin/admin.module').then(m => m.AdminModule)
  },
  // {
  //   path: 'page',
  //   loadChildren: () => import('./page/page.module').then(m => m.PageModule)
  // },
  { path: 'login', component: LoginPageComponent },
  // { path: '', redirectTo: 'page', pathMatch: 'full' },
  { path: '**', redirectTo: 'admin', pathMatch: 'full' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { preloadingStrategy: AppRoutingPreloadingStrategy })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
