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
import { EditCameraDialogComponent } from './routes/edit-camera-dialog/edit-camera-dialog.component';
import { ListCamerasComponent } from './routes/list-cameras/list-cameras.component';
import { LogsComponent } from './routes/logs/logs.component';
import { environment } from 'src/environments/environment';
import { IMqttServiceOptions, MqttModule } from "ngx-mqtt";
import { ConfigComponent } from './routes/config/config.component';

const MQTT_SERVICE_OPTIONS: IMqttServiceOptions = {
  connectOnCreate: false,
  hostname: environment.mqtt_broker_ip_for_client,
  port: environment.mqtt_broker_port,
  protocol: (environment.mqtt_broker_protocol === "wss") ? "wss" : "ws",
  path: '',
};

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
    EditCameraDialogComponent,
    ListCamerasComponent,
    LogsComponent,
    ConfigComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    HttpClientModule,
    SharedModule,
    MqttModule.forRoot(MQTT_SERVICE_OPTIONS),
  ], 
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: JWTInterceptor, multi: true },
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
