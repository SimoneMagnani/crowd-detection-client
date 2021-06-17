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
  @Input() customIcon!: string;
  @Input() onCustomClick!: () => void;
  @Input() secondSub!: string;
  constructor(
    public dialog: MatDialog,
  ) { }

  ngOnInit(): void {
  }

  public toString(cam: Camera) : string {
    return JSON.stringify(cam)
  }

  public edit() {
    this.dialog.open(EditCameraDialogComponent, {data: this.camera}).afterClosed().subscribe(e => {
      window.location.reload()
    });
  }

  public active(): string {
    return this.camera.detection ? "active" : "not active"
  }

  public activeClass(): string {
    return this.camera.detection ? "active" : "not_active"
  }
}
