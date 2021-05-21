import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Camera } from 'src/app/model/Camera/camera';
import { CameraService } from 'src/app/services/camera.service';
import { ListCamerasComponent } from '../../list-cameras/list-cameras.component';

@Component({
  selector: 'app-home-page',
  templateUrl: './home-page.component.html',
  styleUrls: ['./home-page.component.scss']
})
export class HomePageComponent implements OnInit {

  public activeCameras: Camera[]

  constructor(
    public dialog: MatDialog,
    private cameraService: CameraService
  ) {
    this.activeCameras = []
    this.setActiveCameras()
  }

  private setActiveCameras(): void {
    this.cameraService.ActiveCameras.subscribe(
      x => {if (x) this.activeCameras = x}
    )
  }

  ngOnInit(): void {
  }

  public addNewCam(): void {
    this.dialog.open(ListCamerasComponent);
  }
}
