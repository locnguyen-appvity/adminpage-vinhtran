import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ManageComponent } from './manage.component';

const myRoutes: Routes = [
	{
		path: '', component: ManageComponent,
		children: [
			{
				path: 'saints-list',
				loadChildren: () => import('./saints/saints.module').then(m => m.SaintsModule)
			},
			{
				path: 'giao_hat',
				loadChildren: () => import('./groups/groups.module').then(m => m.GroupsModule)
			},
			{
				path: 'hoi_doan',
				loadChildren: () => import('./groups/groups.module').then(m => m.GroupsModule)
			},
			{
				path: 'ban_muc_vu',
				loadChildren: () => import('./groups/groups.module').then(m => m.GroupsModule)
			},
			{
				path: 'dong_tu',
				loadChildren: () => import('./groups/groups.module').then(m => m.GroupsModule)
			},
			{
				path: 'co_so_giao_phan',
				loadChildren: () => import('./groups/groups.module').then(m => m.GroupsModule)
			},
			{
				path: 'co_so_ngoai_giao_phan',
				loadChildren: () => import('./groups/groups.module').then(m => m.GroupsModule)
			},
			{
				path: 'ban_chuyen_mon',
				loadChildren: () => import('./groups/groups.module').then(m => m.GroupsModule)
			},
			{
				path: 'giao_xu',
				loadChildren: () => import('./organizations/organizations.module').then(m => m.OrganizationsModule)
			},
			{
				path: 'giao_diem',
				loadChildren: () => import('./organizations/organizations.module').then(m => m.OrganizationsModule)
			},
			{
				path: 'giao_ho',
				loadChildren: () => import('./organizations/organizations.module').then(m => m.OrganizationsModule)
			},
			{
				path: 'migrations',
				loadChildren: () => import('./migrations/migrations.module').then(m => m.MigrationsModule)
			},
			{
				path: 'appointments',
				loadChildren: () => import('./appointments/appointments.module').then(m => m.AppointmentsModule)
			},
			{
				path: 'clergys',
				loadChildren: () => import('./clergys/clergys.module').then(m => m.ClergysModule)
			},
			{
				path: 'positions',
				loadChildren: () => import('./positions/positions.module').then(m => m.PositionsModule)
			},
			{ path: '', redirectTo: 'saints-list', pathMatch: 'full' },
		],
	},
	// { path: '', component: UserNavbarComponent, outlet: "sidebar" }
];

@NgModule({
	imports: [RouterModule.forChild(myRoutes)],
	exports: [RouterModule]
})
export class ManageRoutingModule { }
