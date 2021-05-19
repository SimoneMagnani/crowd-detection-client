import { Component, OnInit } from '@angular/core';
import { AccountService } from 'src/app/services/account.service';

@Component({
  selector: 'app-nav-bar',
  templateUrl: './nav-bar.component.html',
  styleUrls: ['./nav-bar.component.scss']
})
export class NavBarComponent implements OnInit {

  constructor(
    private accountService: AccountService
  ) { }

  ngOnInit(): void {
  }

  public logout(): void {
    this.accountService.logout();
    window.location.reload();
  }

  public isLogged(): boolean {
    return this.accountService.userValue != null
  }

}
