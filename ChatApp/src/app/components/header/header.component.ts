import { Component, OnDestroy, OnInit } from '@angular/core';
import { Observable, Subscription } from 'rxjs';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {
  public isLoggedIn$!: Observable<boolean>;

  constructor(private authSservice : AuthService) { }


  ngOnInit(): void {
    this.isLoggedIn$ = this.authSservice.isLoggedIn();
  }

  public loginWithGoogle(){
    this.authSservice.signInWithGoogle();
  }

  
  public signOut(){
    this.authSservice.signOut();
  }
}
