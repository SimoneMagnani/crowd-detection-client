import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute } from '@angular/router';
import { ApiURLService } from 'src/app/services/api-url.service';
import { LogService } from 'src/app/services/log.service';
import { ListCamerasComponent } from '../list-cameras/list-cameras.component';

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
      distance: ['', Validators.required],
      fps: ['', Validators.required],
      min_people: ['', Validators.required]
    });
  }

  ngOnInit(): void {
  }

  get f() {
    return this.form.controls;
  }

  onSubmit(): void {
    if (this.form.invalid) {
      //console.log(this.f)
      const errors: string[] = [];
      if (this.f.distance.invalid) {
        errors.push('distance');
      }
      if (this.f.fps.invalid) {
        errors.push('fps');
      }
      if (this.f.min_people.invalid) {
        errors.push('min_people');
      }
      if (errors.length > 0) {
        this.logService.log('Missing ' + errors.join(' and ') + '.');
      }
      return;
    }

    this.dialog.open(ListCamerasComponent);

    interface Config {
        min_distance_cm: number,
        fps: number,
        min_people_in_group: number
    }

    let config: Config = {
      min_distance_cm: this.f.distance.value,
      fps: this.f.fps.value,
      min_people_in_group: this.f.min_people.value
    }
    
    this.http.put<Config | null>(`${this.apiURL.baseApiUrl}/config/camera/:id`, config)
      .subscribe(
        x => this.logService.messageSnackBar("update correctly"),
        err => this.logService.errorSnackBar(err)
      );
  }

}
