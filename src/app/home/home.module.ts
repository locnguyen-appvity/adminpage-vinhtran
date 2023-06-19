import { NgModule } from '@angular/core';
import { HomeComponent } from './home.component';
import { SharedModule } from '../shared/shared.module';
import { HomeRoutingModule } from './home-routing.module';
import { MainBannerModule } from '../widgets/main-banner/main-banner.module';
import { PostNewModule } from '../widgets/post-new/post-new.module';
import { SearchMemberModule } from '../widgets/search-member/search-member.module';
import { FavoritePostsModule } from '../widgets/favorite-posts/favorite-posts.module';
import { NotificationsListModule } from '../widgets/notifications-list/notifications-list.module';
import { GuestReviewModule } from '../widgets/guest-review/guest-review.module';
import { CategoriesModule } from '../widgets/categories/categories.module';
import { PostsBannerModule } from '../widgets/posts-banner/posts-banner.module';
import { PostsListBannerModule } from '../widgets/posts-list-banner/posts-list-banner.module';


@NgModule({
	declarations: [
		HomeComponent
	],
	imports: [
		SharedModule,
		HomeRoutingModule,
		MainBannerModule,
		PostNewModule,
		SearchMemberModule,
		FavoritePostsModule,
		NotificationsListModule,
		GuestReviewModule,
		CategoriesModule,
		PostsBannerModule,
		PostsListBannerModule
	]
})
export class HomeModule {

}
