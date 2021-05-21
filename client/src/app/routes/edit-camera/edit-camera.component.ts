import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Camera } from 'src/app/model/Camera/camera';
import { ApiURLService } from 'src/app/services/api-url.service';
import { CameraService } from 'src/app/services/camera.service';
import { LogService } from 'src/app/services/log.service';

@Component({
  selector: 'app-edit-camera',
  templateUrl: './edit-camera.component.html',
  styleUrls: ['./edit-camera.component.scss']
})
export class EditCameraComponent implements OnInit {
  public cameras: Camera[] = [];

  constructor(
    private logService: LogService,
    private cameraService: CameraService
  ) { }

  ngOnInit(): void {
    this.cameraService.allCameras.subscribe(
      x => {
        this.logService.log("received " +x?.length+ " cameras")
        if (x)
          this.cameras = x
      },
      err => this.logService.errorSnackBar(err)
    );
  }

}
