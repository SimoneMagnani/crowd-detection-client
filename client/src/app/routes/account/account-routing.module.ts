import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { EmptyLayoutComponent } from 'src/app/layout/empty-layout/empty-layout.component';
import { LoginComponent } from './login/login.component';

const routes: Routes = [
  {
    path: '', component: EmptyLayoutComponent,
    children: [
      { path: 'login', component: LoginComponent},
      //{ path: 'register', component: RegistrationComponent },
      //{ path: 'update', component: UpdateComponent, canActivate: [AuthGuard] }
      { path: '**', redirectTo: 'login' }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AccountRoutingModule { }
