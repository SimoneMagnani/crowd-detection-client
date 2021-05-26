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

  public cams: {camera:Camera, selected:boolean}[]
  @ViewChild('selectedCameras') selectedCameras!: MatSelectionList; 

  constructor(
    private cameraService: CameraService,
    @Inject(MAT_DIALOG_DATA) public data: DialogData
  ) {
    this.cams = []
    this.cameraService.allCameras.subscribe(
      x => {
        if (x) {
          x.forEach(cam => this.cams.push({camera:cam, selected: this.data.selected(cam.camera_id)}))
        }
      }
    )
   }

  ngOnInit(): void {
  }

  public save(): void {
    this.data.post(this.selectedCameras.selectedOptions.selected.map(opt => opt.value))
  }
  
  public selectAllCameras(): void {
    this.selectedCameras.selectAll()
  }

}
