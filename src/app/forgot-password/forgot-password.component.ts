import { Component, OnInit } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.scss']
})
export class ForgotPasswordComponent implements OnInit {

  constructor() { }
  newPassword = new FormControl('', Validators.required);
  confirmPassword = new FormControl('', Validators.required);
  answer = new FormControl('', Validators.required);
  hintQuestion = new FormControl('');
  userName = new FormControl('', Validators.required);
  //   {
  //     "username": "spandan",
  //     "new_password": "passwor",
  //     "hq_id": 1,
  //     "hint_answer": "blue"
  // }
  ngOnInit(): void {
  }
  submit() { }
  submitQuestion() { }
}
