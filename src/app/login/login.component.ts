import { THIS_EXPR } from '@angular/compiler/src/output/output_ast';
import { Component, OnInit } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../core/services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  constructor(public authService: AuthService, public router: Router) { }
  title = 'book-finder';
  username = new FormControl('', Validators.required);
  password = new FormControl('', Validators.required);
  signIn() {
    this.authService.authenticate({ "username": this.username.value, "password": this.password.value }).subscribe(res => {
      console.log(res);
      if (res && res.token) {
        localStorage.setItem('token', res.token);
        this.router.navigateByUrl('/dashboard');
      }
    }, (err => {
      console.log(err);
    }))

  }
  ngOnInit(): void {
  }
  goToRegister() {
    this.router.navigateByUrl('register');
  }
  goToForget() {
    this.router.navigateByUrl('forgot-pwd');
  }
}
