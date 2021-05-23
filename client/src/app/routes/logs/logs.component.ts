import { Component, OnDestroy, OnInit } from '@angular/core';
import { PageEvent } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { Subscription } from 'rxjs';
import { Observable } from 'rxjs';
import { first } from 'rxjs/operators';
import { CoreLog, Logs } from 'src/app/model/log';
import { LogLevel } from 'src/app/model/logLevel';
import { LogService } from 'src/app/services/log.service';

@Component({
  selector: 'app-logs',
  templateUrl: './logs.component.html',
  styleUrls: ['./logs.component.scss']
})
export class LogsComponent implements OnInit, OnDestroy {


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
    private logService: LogService
  ) { }

  ngOnInit(): void {
  }

  
  ngOnDestroy(): void {
    this.sub?.unsubscribe();
  }

  private updateData(obs: Observable<Logs>): void {
    this.sub = obs.pipe(first()).subscribe((data) => {
      this.logService.log('meta of user-scores: ', LogLevel.Debug, false, data.meta);
      this.dataSource.data = data.data;
      this.total = data.meta.total;
      this.pageSize = data.meta.size;
      this.currentPage = Number(data.meta.page);
      this.isLoading = false;
    });
  }

  onPaginateChange(pageEvent: PageEvent): void {
    /*this.filter = {
      cameraID: pageEvent.pageSize,
      Tinizio: pageEvent.pageIndex,
      Tfine: this.sort
    };*/
  }

}
