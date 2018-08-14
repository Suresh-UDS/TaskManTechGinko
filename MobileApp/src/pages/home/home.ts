import {Component, Injectable} from '@angular/core';
import { NavController } from 'ionic-angular';
// import { CanActivate } from '@angular/router';
// import { Routes,Router, RouterModule } from '@angular/router';
// import {authService} from "../service/authService";
@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
@Injectable()
export class HomePage {
/*implements CanActivate {
 constructor(private authService: authService, private router: Router) {}
  canActivate(): boolean {
    let isUserLoggedIn = this.authService.isUserLoggedIn;

    if (!isUserLoggedIn) {
      let redirect = !customRedirect ? customRedirect : '/unrestricted';
      this.router.navigate([redirect]);
    }

    return isUserLoggedIn;
  }

*/
}
