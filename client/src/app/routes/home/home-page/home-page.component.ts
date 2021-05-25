import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { IMqttMessage, IMqttServiceOptions, MqttService } from 'ngx-mqtt';
import { Subscription } from 'rxjs';
import { Camera } from 'src/app/model/Camera/camera';
import { AccountService } from 'src/app/services/account.service';
import { CameraService } from 'src/app/services/camera.service';
import { LogService } from 'src/app/services/log.service';
import { environment } from 'src/environments/environment';
import { ListCamerasComponent } from '../../list-cameras/list-cameras.component';

@Component({
  selector: 'app-home-page',
  templateUrl: './home-page.component.html',
  styleUrls: ['./home-page.component.scss']
})
export class HomePageComponent implements OnDestroy {

  private MQTT_SERVICE_OPTIONS: IMqttServiceOptions = {
    connectOnCreate: true,
    hostname: environment.mqtt_broker_ip_for_client,
    port: environment.mqtt_broker_port,
    protocol: (environment.mqtt_broker_protocol === "wss") ? "wss" : "ws",
    path: '',
    username: this.accountService.userValue ? this.accountService.userValue.access_token : undefined,
    password: 'any'
  };

  public activeCameras: Camera[]
  private activeCameraIDs: string[]
  public crowdCameras: boolean[]
  private unsubscribe: Subscription[]

  constructor(
    public dialog: MatDialog,
    private cameraService: CameraService,
    private mqttService: MqttService,
    private logService: LogService,
    private accountService: AccountService
  ) {
    this.activeCameras = []
    this.activeCameraIDs = []
    this.crowdCameras = []
    this.unsubscribe = []
    this.setActiveCameras()
  }
  
  ngOnDestroy(): void {
    this.unsubscribe.forEach(obs => obs.unsubscribe())
  }

  connect(): void {
    this.mqttService.connect(this.MQTT_SERVICE_OPTIONS);
  }

  subscribe(topic: string): void {
    this.unsubscribe.push(
      this.mqttService.observe(topic).subscribe(
        (data: IMqttMessage) => {
          console.log(data)
          let msg = JSON.parse(data.payload.toString());
          this.crowdCameras[this.activeCameraIDs.indexOf(msg.camera_id)] = msg.data.group_number > 0
        },
        (error: Error) => {
          this.logService.log(`Something went wrong: ${error.message}`);
        }
      )
    )
  }

  private setActiveCameras(): void {
    this.cameraService.ActiveCameras.subscribe(
      x => {
        if (x) {
          this.activeCameras = x
          console.log("connecting")
          this.connect()
          console.log("connected")
          this.activeCameras.forEach(cam => {
            this.subscribe(cam.topic_root)
            this.crowdCameras.push(false)
          })
          console.log("pushed")
          this.activeCameraIDs = this.activeCameras.map(cam => cam.camera_id)
        }
      }
    )
  }

  public addNewCam(): void {
    this.dialog.open(ListCamerasComponent/*, {data:{
      post: (selected: string[] | null)=> {
        if (selected) {
          this.cameraService.setActiveCamerasFromIDs(selected)
          window.location.reload()
        }
      }, 
      selected: (ids:string) => this.cameraService.ActiveCamerasID.includes(ids)
    }}*/);
  }

  public getClass(i: number): string {
    return this.crowdCameras[i] ? "crowd" : "ok"
  }
}
