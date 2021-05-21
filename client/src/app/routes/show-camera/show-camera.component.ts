import { HttpClient } from '@angular/common/http';
import { Component, Input, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Camera } from 'src/app/model/Camera/camera';
import { ApiURLService } from 'src/app/services/api-url.service';
import { CameraService } from 'src/app/services/camera.service';
import { LogService } from 'src/app/services/log.service';
import { EditCameraDialogComponent } from '../edit-camera-dialog/edit-camera-dialog.component';

@Component({
  selector: 'app-show-camera',
  templateUrl: './show-camera.component.html',
  styleUrls: ['./show-camera.component.scss']
})
export class ShowCameraComponent implements OnInit {
  @Input() camera!: Camera;
  constructor(
    private http: HttpClient,
    private apiURL: ApiURLService,
    public dialog: MatDialog,
    private logService: LogService,
    private cameraService: CameraService
  ) { }

  ngOnInit(): void {
  }

  public toString(cam: Camera) : string {
    return JSON.stringify(cam)
  }



  public delete() {
    if(confirm("Are you sure to delete " + this.cameraService.camName(this.camera) + " cam?")) {
      console.log(`${this.apiURL.baseApiUrl}/camera/${this.camera.camera_id}`)
      this.http.delete<Camera | null>(`${this.apiURL.baseApiUrl}/camera/${this.camera.camera_id}`).subscribe(
        x => this.logService.messageSnackBar("removed correctly" + this.cameraService.camName(this.camera)),
        err => this.logService.errorSnackBar(err))
        window.location.reload()
    }
  }

  public edit() {
    this.dialog.open(EditCameraDialogComponent, {data: this.camera}).afterClosed().subscribe(e => {
      window.location.reload()
    });
  }
}
