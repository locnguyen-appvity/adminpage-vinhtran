import { NgModule } from '@angular/core';
import { HomeComponent } from './home.component';
import { SharedModule } from '../shared/shared.module';
import { HomeRoutingModule } from './home-routing.module';
import { MainBannerModule } from '../widgets/main-banner/main-banner.module';
import { PostNewModule } from '../widgets/post-new/post-new.module';
import { SearchOrganizationsModule } from '../widgets/search-organizations/search-organizations.module';
import { FavoritePostsModule } from '../widgets/favorite-posts/favorite-posts.module';
import { NotificationsListModule } from '../widgets/notifications-list/notifications-list.module';
import { GuestReviewModule } from '../widgets/guest-review/guest-review.module';
import { CategoriesModule } from '../widgets/categories/categories.module';
import { PostsBannerModule } from '../widgets/posts-banner/posts-banner.module';
import { PostsListBannerModule } from '../widgets/posts-list-banner/posts-list-banner.module';
import { SearchClergysModule } from '../widgets/search-clergys/search-clergys.module';


@NgModule({
	declarations: [
		HomeComponent
	],
	imports: [
		SharedModule,
		HomeRoutingModule,
		MainBannerModule,
		PostNewModule,
		SearchOrganizationsModule,
		FavoritePostsModule,
		NotificationsListModule,
		GuestReviewModule,
		CategoriesModule,
		PostsBannerModule,
		PostsListBannerModule,
		SearchClergysModule
	]
})
export class HomeModule {

}
