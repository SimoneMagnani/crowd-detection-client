import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { map } from 'rxjs/operators';
import { Camera } from 'src/app/model/Camera/camera';
import { OnError } from 'src/app/model/error';
import { LogLevel } from 'src/app/model/logLevel';
import { ApiURLService } from 'src/app/services/api-url.service';
import { LogService } from 'src/app/services/log.service';

@Component({
  selector: 'app-add-camera',
  templateUrl: './add-camera.component.html',
  styleUrls: ['./add-camera.component.scss']
})
export class AddCameraComponent implements OnInit {
  form: FormGroup;
  loading = false;
  submitted = false;
  returnUrl = '';

  constructor(
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private http: HttpClient,
    private logService: LogService,
    private apiURL: ApiURLService
  ) {
    this.form = this.formBuilder.group({
      topic: ['', Validators.required],
      address: ['', Validators.required],
      cname: ['',]
    });
  }

  ngOnInit(): void {
    // get return url from route parameters or default to '/'
    this.returnUrl = this.route.snapshot.queryParams.returnUrl || '/';
  }

  // convenience getter for easy access to form fields
  // tslint:disable-next-line: typedef
  get f() {
    return this.form.controls;
  }

  onSubmit(): void {

    // stop here if form is invalid
    if (this.form.invalid) {
      //console.log(this.f)
      const errors: string[] = [];
      if (this.f.topic.invalid) {
        errors.push('topic');
      }
      if (this.f.address.invalid) {
        errors.push('address');
      }
      if (errors.length > 0) {
        this.logService.log('Missing ' + errors.join(' and ') + '.');
      }
      return;
    }
    let topic = this.f.topic.value
    let root = "detection"
    topic = topic.startsWith("/") ? topic.substring(1) : topic
    topic = topic.startsWith(root) ? topic.substring(root.length) : topic
    console.log(this.f)
    let newCamera = {
      "camera_name": this.f.cname.value,
      "camera_address": this.f.address.value,
      "topic_root": topic,
      "mqtt_broker_ip": "192.168.99.100",
      "mqtt_broker_port": 1884
    }
    console.log(`${this.apiURL.baseApiUrl}/cameras`)
    this.http.post<Camera | null>(`${this.apiURL.baseApiUrl}/cameras`, newCamera)
      .subscribe(
        x => this.logService.messageSnackBar("add correctly " +x?.camera_id),
        err => this.logService.errorSnackBar(err)
      );

  }
}
