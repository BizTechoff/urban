// import { CommonUIElementsModule } from 'common-ui-elements'
import { ErrorHandler, NgModule } from '@angular/core'
import { RouterModule, Routes } from '@angular/router'
import { HomeComponent } from './home/home.component'

import { ApartmentListComponent } from './apartments/apartment-list/apartment-list.component'
import { BuildingListComponent } from './buildings/building-list/building-list.component'
import { ShowDialogOnErrorErrorHandler } from './common/showDialogOnErrorErrorHandler'
import { ProjectListComponent } from './projects/project-list/project-list.component'
import { TenantListComponent } from './tenants/tenant-list/tenant-list.component'
import { terms } from './terms'
import { AdminGuard, AuthenticatedGuard, NotAuthenticatedGuard } from './users/authGuard'
import { SilentRedirectComponent } from './users/silent-redirect.component'
import { UserListComponent } from './users/user-list/user-list.component'

const defaultRoute = 'home'
const routes: Routes = [
  { path: defaultRoute, component: HomeComponent, canActivate: [NotAuthenticatedGuard], data: { name: terms.home } },
  { path: 'tenants', component: TenantListComponent, canActivate: [AuthenticatedGuard], data: { name: terms.tenants } },
  { path: 'projects', component: ProjectListComponent, canActivate: [AuthenticatedGuard], data: { name: terms.projects } },
  { path: 'buildings', component: BuildingListComponent, canActivate: [AuthenticatedGuard], data: { name: terms.buildings } },
  { path: 'apartments', component: ApartmentListComponent, canActivate: [AuthenticatedGuard], data: { name: terms.apartments } },
  { path: 'accounts', component: UserListComponent, canActivate: [AdminGuard], data: { name: terms.userAccounts } },
  { path: '', component: SilentRedirectComponent, pathMatch: 'full' },
  { path: '**', component: SilentRedirectComponent }
]
@NgModule({
  imports: [RouterModule.forRoot(routes)],//, CommonUIElementsModule],
  providers: [
    AdminGuard,
    { provide: ErrorHandler, useClass: ShowDialogOnErrorErrorHandler },
  ],
  exports: [RouterModule],
})
export class AppRoutingModule { }
