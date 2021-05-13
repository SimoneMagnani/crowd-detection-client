import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { environment } from 'src/environments/environment';
import { LogLevel } from '../model/logLevel';

@Injectable({
  providedIn: 'root'
})
export class LogService {

  readonly maxLogInProduction = LogLevel.All;
  private isProduction = false;

  constructor( ) {
    if (environment.production) {
      this.isProduction = true;
    }
  }

  // tslint:disable-next-line: no-any
  log(message: string, severity: LogLevel = LogLevel.Debug, withDate: boolean = false, ...data: any[]): void {
    if (this.isProduction && severity > this.maxLogInProduction) {
      // skip this log in production
      return;
    }
    let value = '';
    if (withDate) {
      value = `${new Date()} - `;
    }
    value = value.concat(`[${severity.toString()}]: ${message}`);
    if (data) {
      console.log(value, ...data);
    } else {
      console.log(value);
    }
  }
}
