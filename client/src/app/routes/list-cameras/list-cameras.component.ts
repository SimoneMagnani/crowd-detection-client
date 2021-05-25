import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSelectionList } from '@angular/material/list';
import { Camera } from 'src/app/model/Camera/camera';
import { CameraService } from 'src/app/services/camera.service';



export interface DialogData {
  post: (ids: string[] | null) => void;
  selected: (id:string) => boolean;
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
    @Inject(MAT_DIALOG_DATA) public data: DialogData
  ) {
    this.cameras = []
    this.isActiveCameras = []
    this.cameraService.allCameras.subscribe(
      x => {
        if (x) {
          this.isActiveCameras = x.map(cam => this.data.selected(cam.camera_id))
          this.cameras = x
        }
      }
    )
   }

  ngOnInit(): void {
  }

  public save(): void {
    console.log(this.selectedCameras)
    this.data.post(this.selectedCameras._value)
  }

}
