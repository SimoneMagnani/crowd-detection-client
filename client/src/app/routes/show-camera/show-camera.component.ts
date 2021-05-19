import { HttpClient } from '@angular/common/http';
import { Component, Input, OnInit } from '@angular/core';
import { Camera } from 'src/app/model/Camera/camera';
import { LogLevel } from 'src/app/model/logLevel';
import { ApiURLService } from 'src/app/services/api-url.service';
import { LogService } from 'src/app/services/log.service';

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
    private logService: LogService
  ) { }

  ngOnInit(): void {
  }

  public toString(cam: Camera) : string {
    return JSON.stringify(cam)
  }

  public camName(): string {
    return this.camera.camera_name ? this.camera.camera_name : this.camera.camera_id
  }

  public delete() {
    if(confirm("Are you sure to delete " + this.camName() + " cam?")) {
      console.log(`${this.apiURL.baseApiUrl}/camera/${this.camera.camera_id}`)
      this.http.delete<Camera | null>(`${this.apiURL.baseApiUrl}/camera/${this.camera.camera_id}`).subscribe(
        x => this.logService.messageSnackBar("removed correctly" + this.camName()),
        err => this.logService.errorSnackBar(err))
        window.location.reload()
    }
  }

}
