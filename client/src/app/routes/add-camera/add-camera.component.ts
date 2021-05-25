import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Camera } from 'src/app/model/Camera/camera';
import { ApiURLService } from 'src/app/services/api-url.service';
import { LogService } from 'src/app/services/log.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-add-camera',
  templateUrl: './add-camera.component.html',
  styleUrls: ['./add-camera.component.scss']
})
export class AddCameraComponent implements OnInit {
  form: FormGroup;
  returnUrl = '';

  constructor(
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private http: HttpClient,
    private logService: LogService,
    private apiURL: ApiURLService,
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
    let root = environment.root_topic
    topic = topic.startsWith("/") ? topic.substring(1) : topic
    topic = topic.startsWith(root) ? topic.substring(root.length) : topic
    topic = topic.startsWith("/") ? topic.substring(1) : topic
    let newCamera = {
      "camera_name": this.f.cname.value,
      "camera_address": this.f.address.value,
      "topic_root": topic,
      "mqtt_broker_ip": environment.mqtt_broker_ip_for_cam,
      "mqtt_broker_port": environment.mqtt_broker_port
    }
    console.log(`${this.apiURL.baseApiUrl}/cameras`)
    this.http.post<Camera | null>(`${this.apiURL.baseApiUrl}/cameras`, newCamera)
      .subscribe(
        x => this.logService.messageSnackBar("add correctly " +x?.camera_id),
        err => this.logService.errorSnackBar(err)
      );

  }
}
