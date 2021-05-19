import { Injectable } from '@angular/core';
import { MatSnackBar, MatSnackBarConfig } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { environment } from 'src/environments/environment';
import { errorToString, OnError } from '../model/error';
import { LogLevel } from '../model/logLevel';

@Injectable({
  providedIn: 'root'
})
export class LogService {

  readonly maxLogInProduction = LogLevel.All;
  private isProduction = false;

  constructor(
    private snackBar: MatSnackBar,
  ) {
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

  private formatStringAndOpen(message: string, action?: string, config?: MatSnackBarConfig): void {
    message = message.charAt(0).toUpperCase() + message.slice(1);
    this.snackBar.open(message, action, config);
  }
  
  errorSnackBar(error: OnError | string, duration: number = 10000): void {
    const oe = error as OnError;
    let value = '';
    if (oe.status) {
      value = errorToString(oe);
    } else {
      value = error.toString();
    }
    this.formatStringAndOpen(value, undefined, { duration, panelClass: 'snackBarError' });
  }
}
