import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HomePageComponent } from './routes/home/home-page/home-page.component';
import { LayoutComponent } from './layout/layout/layout.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { EmptyLayoutComponent } from './layout/empty-layout/empty-layout.component';
import { SharedModule } from './shared/shared.module';
import { AddCameraComponent } from './routes/add-camera/add-camera.component';
import { JWTInterceptor } from './helper/interceptor/jwt.interceptor';
import { EditCameraComponent } from './routes/edit-camera/edit-camera.component';
import { ShowCameraComponent } from './routes/show-camera/show-camera.component';
import { NavBarComponent } from './layout/layout/nav-bar/nav-bar.component';

@NgModule({
  declarations: [
    AppComponent,
    HomePageComponent,
    LayoutComponent,
    EmptyLayoutComponent,
    AddCameraComponent,
    EditCameraComponent,
    ShowCameraComponent,
    NavBarComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    HttpClientModule,
    SharedModule
  ], 
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: JWTInterceptor, multi: true }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
