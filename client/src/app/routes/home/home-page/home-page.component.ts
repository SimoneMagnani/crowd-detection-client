import { HttpClient } from '@angular/common/http';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { IMqttMessage, IMqttServiceOptions, MqttService } from 'ngx-mqtt';
import { Subscription } from 'rxjs';
import { map } from 'rxjs/operators';
import { Camera } from 'src/app/model/Camera/camera';
import { AccountService } from 'src/app/services/account.service';
import { ApiURLService } from 'src/app/services/api-url.service';
import { CameraService } from 'src/app/services/camera.service';
import { LogService } from 'src/app/services/log.service';
import { environment } from 'src/environments/environment';
import { DialogData, ListCamerasComponent } from '../../list-cameras/list-cameras.component';

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
  public crowdCameras: string[]
  private unsubscribe: Subscription[]

  constructor(
    public dialog: MatDialog,
    private cameraService: CameraService,
    private mqttService: MqttService,
    private logService: LogService,
    private accountService: AccountService,
    private router: Router,
    private http: HttpClient,
    private apiURL: ApiURLService
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

  subscribe(topic: string, id: string): void {
    this.unsubscribe.push(
      this.mqttService.observe(topic).subscribe(
        (data: IMqttMessage) => {
          let msg = JSON.parse(data.payload.toString());
          this.crowdCameras[this.activeCameraIDs.indexOf(id)] = msg.group_number > 0 ? `found ${msg.group_number} group${msg.group_number > 1 ? 's':''}` : ''
          //console.log(`the ${this.activeCameraIDs.indexOf(id)} cam  has ${this.crowdCameras[this.activeCameraIDs.indexOf(id)]} as msg`)
        },
        (error: Error) => {
          this.logService.log(`Something went wrong: ${error.message}`);
        }
      )
    )
  }

  private startDetection(id:string, next?: (value: Object) => void): void {
    this.cameraService.nonDetectingCameras.subscribe(
      cameras => 
        this.camerasToStartStop(cameras, id, "starting " + id,
                                  `${this.apiURL.baseApiUrl}/camera/${id}/detection/start`, next)
    )
  }

  private camerasToStartStop(cameras: Camera[] | undefined, id:string, msg: string, api: string, next?: (value: Object) => void): void {
    cameras?.forEach(cam => 
      {
        if (cam.camera_id == id){
          this.logService.messageSnackBar(msg);
          this.http.put(api,{}).subscribe(
            next, 
            error => this.logService.errorSnackBar(error),
            () => window.location.reload())
        }
    })
  }

  private stopDetection(id:string, next?: (value: Object) => void): void {
    this.cameraService.detectingCameras.subscribe(
      cameras => 
        this.camerasToStartStop(cameras, id, "stopping " + id,
                                  `${this.apiURL.baseApiUrl}/camera/${id}/detection/stop`, next)
    )
  }

  private setActiveCameras(): void {
    this.cameraService.ActiveCameras.subscribe(
      x => {
        if (x) {
          this.activeCameras = x
          this.connect()
          this.activeCameras.forEach(cam => {
            this.startDetection(cam.camera_id, x => {})
            this.subscribe(cam.topic_root+'/'+cam.camera_id, cam.camera_id)
            this.crowdCameras.push('')
          })
          this.activeCameraIDs = this.activeCameras.map(cam => cam.camera_id)
        }
      }
    )
  }

  public startCams(): void {
    let option: DialogData = {
      post: (list: {id:string, selected:boolean}[] | null)=> {
        list?.forEach(item => {
          if (item.selected) {
            this.startDetection(item.id, x => {})
          } else {
            this.stopDetection(item.id, x => {})
          }
        })
      }, 
      selected: (id:string) => false
    }
    this.cameraService.detectingCameras.subscribe(
      allCameras => option.selected = (id:string) => allCameras?.find(cam => cam.camera_id == id) ? true : false,
      () => {},
      () => this.dialog.open(ListCamerasComponent, {data:option})
    )

    
  }

  public addNewCam(): void {
    let option: DialogData = {
      post: (list: {id:string, selected:boolean}[] | null) => {
        let selectedList = list?.filter(item => item.selected).map(item => item.id)
        if (selectedList) {
          this.cameraService.setActiveCamerasFromIDs(selectedList)
          window.location.reload()
        }
      }, 
      selected: (ids:string) => this.cameraService.ActiveCamerasID.includes(ids)
    }
    this.dialog.open(ListCamerasComponent, {data:option});
  }

  public getClass(i: number): string {
    return this.crowdCameras[i] ? "crowd" : "ok"
  }

  public goToLogFor(id: string): void {
    this.router.navigate(['/logs'], { queryParams: { camera_id: id }});
  }

  public remove(cam_id: string): () => void {
    return () => {
      this.cameraService.setActiveCamerasFromIDs(this.cameraService.ActiveCamerasID.filter(id => id != cam_id))
      window.location.reload()
    }
  }
}
