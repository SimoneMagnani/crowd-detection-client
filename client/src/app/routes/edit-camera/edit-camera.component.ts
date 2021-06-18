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
    private cameraService: CameraService,
    private apiURL: ApiURLService,
    private http: HttpClient
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

  public delete(camera: Camera): () => void {
    return () =>{
      if(confirm("Are you sure to delete " + this.cameraService.camName(camera) + " cam?")) {
        let error = false
        //console.log(`${this.apiURL.baseApiUrl}/camera/${camera.camera_id}`)
        this.http.delete<Camera | null>(`${this.apiURL.baseApiUrl}/camera/${camera.camera_id}`).subscribe(
          x => this.logService.messageSnackBar("removed correctly" + this.cameraService.camName(camera)),
          err => { error = true; this.logService.errorSnackBar(err)},
          () => { if (!error) window.location.reload() }
        )
      }
    }
  }
}
