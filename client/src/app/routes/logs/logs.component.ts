import { HttpClient, HttpParams } from '@angular/common/http';
import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { MatDatepicker } from '@angular/material/datepicker';
import { PageEvent } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { Observable } from 'rxjs';
import { first } from 'rxjs/operators';
import { CoreLog, Logs } from 'src/app/model/log';
import { ApiURLService } from 'src/app/services/api-url.service';
import { LogService } from 'src/app/services/log.service';

@Component({
  selector: 'app-logs',
  templateUrl: './logs.component.html',
  styleUrls: ['./logs.component.scss']
})
export class LogsComponent implements OnInit, OnDestroy {
  @ViewChild('NgxMatDatetimePickerI') pickerI!: MatDatepicker<Date>;
  @ViewChild('NgxMatDatetimePickerF') pickerF!: MatDatepicker<Date>;

  public showSpinners = true;
  public showSeconds = true;

  form: FormGroup;
  displayedColumns = ["timestamp", "camera_id", "topic", "group_sizes", "people_number"]

  private sub: Subscription | undefined;
  dataSource = new MatTableDataSource<CoreLog>([]);
  total = 0;
  pageSizeOptions: number[] = [10, 20, 50];
  pageSize: number = this.pageSizeOptions[0];
  currentPage = 0;
  isLoading = true;
  private filter = {
    cameraID: null,
    Tinizio: null,
    Tfine: null
  };

  constructor(
    private route: ActivatedRoute,
    private formBuilder: FormBuilder,
    private apiURL: ApiURLService,
    private http: HttpClient
  ) {
    this.form = this.formBuilder.group({
      id: new FormControl(this.route.snapshot.queryParams.camera_id),
      Tinizio: new FormControl(''),
      Tfine: new FormControl(''),
      topic: new FormControl(''),
    });
  }

  ngOnInit(): void { 
    this.select()
  }

  private timeToUTC(gtmTime: number):number {
    return gtmTime + new Date().getTimezoneOffset()*60*1000
  }

  public timeToGTM(UTCTime: number):number {
    return UTCTime - new Date().getTimezoneOffset()*60*1000
  }

  public select(): void {
    if (this.f.Tinizio.value)
    console.log(this.f.Tinizio.value.getTime())
    console.log(Date.now())
    let query = {
      page: this.currentPage+'',
      limit: this.pageSize+'',
      after: (this.f.Tinizio.value ? this.timeToUTC(this.f.Tinizio.value.getTime()) : 0)+'',
      before: (this.f.Tfine.value ? this.timeToUTC(this.f.Tfine.value.getTime()) : Date.now())+'',
      camera_id: this.f.id.value || "",
      topic: this.f.topic.value || ""
    }
    console.log(query)
    this.updateData(this.http.get<Logs>(this.apiURL.baseApiUrl+'/data',
      {params: query}
    ))
  }



  get f() {
    return this.form.controls;
  }

  
  ngOnDestroy(): void {
    this.sub?.unsubscribe();
  }

  private updateData(obs: Observable<Logs>): void {
    this.sub = obs.pipe(first()).subscribe((data) => {
      this.dataSource.data = data.data;
      this.currentPage = Number(data.pageNum);
      this.total = Number(data.total)
      this.isLoading = false;
    });
  }

  onPaginateChange(pageEvent: PageEvent): void {    
    this.pageSize = pageEvent.pageSize;
    this.currentPage = pageEvent.pageIndex;
    this.select();
  }

  getRelevantTopic(topic: string): string {
    return topic.substring(0, topic.lastIndexOf('/'))
  }

}
