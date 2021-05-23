import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ConnectionStatus, MqttService, SubscriptionGrant } from 'ngx-mqtt-client';
import { Camera } from 'src/app/model/Camera/camera';
import { CoreLog, Logs } from 'src/app/model/log';
import { CameraService } from 'src/app/services/camera.service';
import { LogService } from 'src/app/services/log.service';
import { ListCamerasComponent } from '../../list-cameras/list-cameras.component';

@Component({
  selector: 'app-home-page',
  templateUrl: './home-page.component.html',
  styleUrls: ['./home-page.component.scss']
})
export class HomePageComponent implements OnInit {

  public activeCameras: Camera[]
  private activeCameraIDs: string[]
  public crowdCameras: boolean[]

  constructor(
    public dialog: MatDialog,
    private cameraService: CameraService,
    private mqttService: MqttService,
    private logService: LogService
  ) {
    this.activeCameras = []
    this.activeCameraIDs = []
    this.crowdCameras = []
    this.setActiveCameras()
    this.mqttService.status().subscribe((s: ConnectionStatus) => {
      const status = s === ConnectionStatus.CONNECTED ? 'CONNECTED' : 'DISCONNECTED';
      this.logService.log(status)
    });
  }

  connect(): void {
    this.mqttService.connect({});
  }

  subscribe(topic: string): void {
    this.mqttService.subscribeTo<CoreLog>(topic)
      .subscribe({
        next: (msg: SubscriptionGrant | CoreLog) => {
          if (msg instanceof SubscriptionGrant) {
            this.logService.log('Subscribed to ' + topic + ' topic!');
          } else {
            this.crowdCameras[this.activeCameraIDs.indexOf(msg.camera_id)] = msg.data.group_number > 0
          }
        },
        error: (error: Error) => {
          this.logService.log(`Something went wrong: ${error.message}`);
        }
      });
  }

  private setActiveCameras(): void {
    this.cameraService.ActiveCameras.subscribe(
      x => {
        if (x) {
          this.activeCameras = x
          this.activeCameras.forEach(cam => {
            this.subscribe(cam.topic_root)
            this.crowdCameras.push(false)
          })
          this.activeCameraIDs = this.activeCameras.map(cam => cam.camera_id)
        }
      }
    )
  }

  ngOnInit(): void {
  }

  public addNewCam(): void {
    this.dialog.open(ListCamerasComponent);
  }

  public getClass(i: number): string {
    return this.crowdCameras[i] ? "crowd" : "ok"
  }
}
