import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuard } from './helper/guards/auth.guard';
import { LayoutComponent } from './layout/layout/layout.component';
import { AddCameraComponent } from './routes/add-camera/add-camera.component';
import { HomePageComponent } from './routes/home/home-page/home-page.component';


const accountModule = () => import('./routes/account/account.module').then(x => x.AccountModule);

const routes: Routes = [
  {
  path: '', component: LayoutComponent,
  children: [
    { path: 'home', component: HomePageComponent, canActivate: [AuthGuard] },
    { path: 'account', loadChildren: accountModule },
    { path: 'camera/add', component: AddCameraComponent, canActivate: [AuthGuard] },
    //{ path: 'game', loadChildren: () => GameModule },
    { path: '**', redirectTo: 'home' }
  ]
},];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
