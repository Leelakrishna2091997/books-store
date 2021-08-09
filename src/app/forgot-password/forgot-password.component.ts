import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { config } from 'src/config';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.scss']
})
export class ForgotPasswordComponent implements OnInit {

  constructor(private http: HttpClient, private router: Router) { }
  newPassword = new FormControl('', Validators.required);
  confirmPassword = new FormControl('', Validators.required);
  answer = new FormControl('', Validators.required);
  hintQuestion = new FormControl('');
  userName = new FormControl('', Validators.required);
  public hintsArray: any;
  public isVerified = false;
  //   {
  //     "username": "spandan",
  //     "new_password": "passwor",
  //     "hq_id": 1,
  //     "hint_answer": "blue"
  // }
  ngOnInit(): void {
    this.getHints();
  }
  getHints() {
    this.http.get(config.serverName + ':' + config.port + '/hints').subscribe(res => {
      this.hintsArray = res;
    })
  }

  submit() {
    this.http.post(config.serverName + ":" + config.port + '/reset-password',
      { "username": this.userName.value, "new_password": this.confirmPassword.value }, { observe: 'response' }).subscribe(res => {
        console.log(res);
        if (res && res.status == 204) {
          this.router.navigateByUrl('login')
        }

      });

  }
  submitQuestion() {
    // {"username": "leela","hq_id": "2", "hint_answer": "Bye"}
    this.http.post(config.serverName + ":" + config.port + '/verify',
      { "username": this.userName.value, "hq_id": this.hintQuestion.value, "hint_answer": this.answer.value }, { observe: 'response' }).subscribe(res => {
        console.log(res);
        if (res && res.status == 200) {
          this.isVerified = true;
        }

      });

  }
}
