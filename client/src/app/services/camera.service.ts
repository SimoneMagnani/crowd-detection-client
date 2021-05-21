import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Camera } from '../model/Camera/camera';
import { ApiURLService } from './api-url.service';

@Injectable({
  providedIn: 'root'
})
export class CameraService {

  private homeLocalStorage = 'activeCameras';

  constructor(
    private http: HttpClient,
    private apiURL: ApiURLService
  ) { }

  get allCameras(): Observable<Camera[] | null> {
    return this.http.get<Camera[] | null>(`${this.apiURL.baseApiUrl}/cameras`)
  }

  public camName(camera: Camera): string {
    return camera.camera_name ? camera.camera_name : camera.camera_id
  }

  public setActiveCameras(camera: Camera[]): void {
    localStorage.setItem(this.homeLocalStorage, JSON.stringify(camera.map(cam => cam.camera_id)))
  }

  get ActiveCamerasID(): string[] {
    let ids = localStorage.getItem(this.homeLocalStorage)
    if (ids){
      return JSON.parse(ids)
    } else {
      return []
    }
  }

  get ActiveCameras(): Observable<Camera[] | undefined> {
    return this.allCameras.pipe(map(allCameras => allCameras?.filter(cam => this.ActiveCamerasID.includes(cam.camera_id))))
  }
}
