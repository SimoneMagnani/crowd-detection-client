import { HttpClient, HttpParams } from '@angular/common/http';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { PageEvent } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { Observable } from 'rxjs';
import { first } from 'rxjs/operators';
import { CoreLog, Logs } from 'src/app/model/log';
import { LogLevel } from 'src/app/model/logLevel';
import { ApiURLService } from 'src/app/services/api-url.service';
import { LogService } from 'src/app/services/log.service';

@Component({
  selector: 'app-logs',
  templateUrl: './logs.component.html',
  styleUrls: ['./logs.component.scss']
})
export class LogsComponent implements OnInit, OnDestroy {
  form: FormGroup;
  azz: CoreLog = {
    timestamp: 1,
    camera_id: "string",
    topic: "string",
    data: {
      timestamp: 1,
      group_number: 1,
      group_sizes: [2,3],
      people_number: 2
    }
  }
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
    private logService: LogService,
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

  private select(): void {
    let query = {
      page: this.currentPage,
      limit: this.pageSize,
      before: this.f.Tinizio.value || 0,
      after: this.f.Tfine.value || Date.now(),
      camera_id: this.f.id.value || "ciao",
      topic: this.f.topic.value || "detection/ciao"
    }
    this.updateData(this.http.get<Logs>(this.apiURL.baseApiUrl+'/data',
      {params: new HttpParams().set('query', JSON.stringify(query))}
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
      this.currentPage = Number(data.next_page - 1);
      this.total = Number(data.total)
      this.isLoading = false;
    });
  }

  onPaginateChange(pageEvent: PageEvent): void {    
    this.pageSize = pageEvent.pageSize;
    this.currentPage = pageEvent.pageIndex;
    this.select();
  }

}
