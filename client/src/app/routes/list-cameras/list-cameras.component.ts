import { Component, OnInit, ViewChild } from '@angular/core';
import { MatSelectionList } from '@angular/material/list';
import { Camera } from 'src/app/model/Camera/camera';
import { CameraService } from 'src/app/services/camera.service';


export interface DialogData {
  localStorage: string;
  activeCameras: Camera[];
}

@Component({
  selector: 'app-list-cameras',
  templateUrl: './list-cameras.component.html',
  styleUrls: ['./list-cameras.component.scss']
})
export class ListCamerasComponent implements OnInit {

  public cameras: Camera[]
  public isActiveCameras: boolean[]
  @ViewChild('selectedCameras') selectedCameras!: MatSelectionList; 

  constructor(
    private cameraService: CameraService,
  ) {
    this.cameras = []
    this.isActiveCameras = []
    this.cameraService.allCameras.subscribe(
      x => {
        if (x) {
          let ids = this.cameraService.ActiveCamerasID
          this.isActiveCameras = x.map(cam => ids.includes(cam.camera_id))
          this.cameras = x
        }
      }
    )
   }

  ngOnInit(): void {
  }

  public save(): void {
    let toSave: Camera[] = []
    this.selectedCameras._value?.forEach(v => toSave.push(this.cameras[+v]))
    this.cameraService.setActiveCameras(toSave)
    window.location.reload()
  }

}
