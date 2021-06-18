import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute } from '@angular/router';
import { Config } from 'src/app/model/config';
import { ApiURLService } from 'src/app/services/api-url.service';
import { LogService } from 'src/app/services/log.service';
import { environment } from 'src/environments/environment';
import { DialogData, ListCamerasComponent } from '../list-cameras/list-cameras.component';

@Component({
  selector: 'app-config',
  templateUrl: './config.component.html',
  styleUrls: ['./config.component.scss']
})
export class ConfigComponent implements OnInit {
  form: FormGroup;
  returnUrl = '';


  constructor(
    private formBuilder: FormBuilder,
    private http: HttpClient,
    private logService: LogService,
    private apiURL: ApiURLService,
    private dialog: MatDialog
  ) {
    this.form = this.formBuilder.group({
      distance: [100, Validators.compose([
        Validators.required,
        Validators.min(1),
      ])],
      fps: [1, Validators.compose([
        Validators.required,
        Validators.min(0.001),
      ])],
      min_people: [2, Validators.compose([
        Validators.required,
        Validators.min(0),
      ])],
      height_similarity: [0.7, Validators.compose([
        Validators.required,
        Validators.max(1),
        Validators.min(0),
      ])],
      sec_to_group: [2, Validators.compose([
        Validators.required,
        Validators.min(0),
      ])],
      sec_to_forget: [1, Validators.compose([
        Validators.required,
        Validators.min(0),
      ])],
    });
  }

  ngOnInit(): void {
  }

  get f() {
    return this.form.controls;
  }

  onSubmit(): void {
    if (this.form.invalid) {
      return;
    }

    let config: Config = {
      min_distance_cm: this.f.distance.value,
      fps: this.f.fps.value,
      min_people_in_group: this.f.min_people.value,
      height_similarity: this.f.height_similarity.value,
      min_seconds_for_group: this.f.sec_to_group.value,
      min_seconds_forget_group: this.f.sec_to_forget.value,
      cm_points: environment.cm_points,
      pixel_points: environment.pixel_points,
    }

    let option: DialogData = {
      post: (list: {id:string, selected:boolean}[] | null)=> {
        let selectedList = list?.filter(item => item.selected).map(item => item.id)
        if (selectedList) {
          let error = false
          this.logService.messageSnackBar(`Updating config on selected cameras... `, 60*1000);
          selectedList.forEach( id => {
            if(id) {
              this.http.put<Config | null>(`${this.apiURL.baseApiUrl}/config/camera/${id}`, config)
                .subscribe(
                  x => this.logService.messageSnackBar("update correctly"),
                  err => {error = true; this.logService.errorSnackBar(err)},
                  () => { if (!error) {this.dialog.closeAll()}}
                )
            }
            })
        }
      }, 
      selected: (ids:string) => false
    }

    this.dialog.open(ListCamerasComponent, {data:option});
  }

}
