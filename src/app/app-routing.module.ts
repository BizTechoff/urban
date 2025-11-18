// import { CommonUIElementsModule } from 'common-ui-elements'
import { ErrorHandler, NgModule } from '@angular/core'
import { RouterModule, Routes } from '@angular/router'
import { HomeComponent } from './home/home.component'

import { AdminGuard, NotAuthenticatedGuard } from './common/authGuard'
import { ShowDialogOnErrorErrorHandler } from './common/showDialogOnErrorErrorHandler'
import { terms } from './terms'
import { SilentRedirectComponent } from './users/silent-redirect.component'
import { UserListComponent } from './users/user-list/user-list.component'

const defaultRoute = terms.home
const routes: Routes = [
  { path: defaultRoute, component: HomeComponent, canActivate: [NotAuthenticatedGuard] },
  {
    path: terms.userAccounts,
    component: UserListComponent,
    canActivate: [AdminGuard],
  },
  { path: '', component: SilentRedirectComponent, pathMatch: 'full' },
  { path: '**', component: SilentRedirectComponent } // תופס כל נתיב 
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
