import { AfterContentInit, AfterViewInit, Component, Inject, OnInit, ViewChild } from '@angular/core';
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
export class ListCamerasComponent implements AfterViewInit {

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
  ngAfterViewInit(): void {
    this.selectedCameras.selectionChange.subscribe(
      x => {
        if(x.options[0].value == 'all' && x.options[0].selected){
          x.source.selectAll()
        } else if(x.options[0].value == 'all' && !x.options[0].selected) {
          x.source.deselectAll()
        } else if(x.options[0].selected){
          let value = x.source.options.toArray().filter(x => x.value != 'all').every(x => x.selected)
          x.source.options.find(x => x.value == 'all')?._setSelected(value)
        } else{
          x.source.options.find(x => x.value == 'all')?._setSelected(false)
        }
      }
    )
  }
  public getName(camera:Camera): string {
    return this.cameraService.camName(camera)
  }

  public save(): void {
    let data = this.selectedCameras.selectedOptions.selected
      .filter(opt => opt.value != 'all')
      .map(opt => opt.value)

    if(data.length > 0) {
      this.data.post(data)
    } 
  }


}
