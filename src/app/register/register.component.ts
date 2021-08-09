import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { config } from 'src/config';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit {

  constructor(public formBuilder: FormBuilder, public http: HttpClient, private router: Router) { }
  public registerForm = this.formBuilder.group({
    'personalDetails': new FormGroup({
      firstName: new FormControl('', Validators.required),
      lastName: new FormControl(''),
      city: new FormControl('', Validators.required),
      state: new FormControl('', Validators.required),
      country: new FormControl('', Validators.required),
      postalCode: new FormControl('', Validators.required),
      addressLine1: new FormControl('', Validators.required),
      homePhone: new FormControl('', Validators.required),
      // addressLine2: new FormControl(''),
      phone: new FormControl(''),
      emailId: new FormControl('', Validators.required),
    }),
    'loginDetails': new FormGroup({
      password: new FormControl('', Validators.required),
      confirmPassword: new FormControl('', Validators.required),
      answer: new FormControl('', Validators.required),
      hintQuestion: new FormControl(''),
      userName: new FormControl('', Validators.required)
    })
  });
  public isUsernameAvailable: any;
  public isCheckAvailable: any;
  public hintsArray: any;
  public errorMessage: any = '';
  ngOnInit(): void {
    this.getHints();
  }

  checkAvailability() {
    // username-check
    this.isCheckAvailable = true;
    this.http.get(config.serverName + ':' + config.port + '/username-check/' + this.registerForm.value['loginDetails']['userName'], { observe: 'response' }).
      subscribe(res => {
        console.log(res);
        if (res.status == 200) {
          this.isUsernameAvailable = true;
        } else {
          this.isUsernameAvailable = false;
          this.registerForm.controls['loginDetails'].get('userName').reset();
        }
      }, (err: HttpErrorResponse) => {
        console.log(err);
      })

  }
  submitRegisterForm() {
    //   {
    //     "firstname": "spandan",
    //     "lastname": "polu",
    //     "city": "Nellore",
    //     "state": "Andhra Pradesh",
    //     "country": "India",
    //     "zip_code": 524002,
    //     "home_phone": 7893400709,
    //     "email": "spandan90@gmail.com",
    //     "username": "spandan",
    //     "password": "password",
    //     "hint_question": 1,
    //     "hint_answer": "blue"
    // }
    console.log(this.registerForm.value);
    this.http.post(config.serverName + ':' + config.port + '/register', {
      firstname: this.registerForm.value['personalDetails']['firstName'],
      lastname: this.registerForm.value['personalDetails']['lastName'],
      city: this.registerForm.value['personalDetails']['city'],
      state: this.registerForm.value['personalDetails']['state'],
      country: this.registerForm.value['personalDetails']['country'],
      zip_code: this.registerForm.value['personalDetails']['postalCode'],
      home_phone: this.registerForm.value['personalDetails']['phone'],
      email: this.registerForm.value['personalDetails']['emailId'],
      password: this.registerForm.value['loginDetails']['password'],
      hint_question: this.registerForm.value['loginDetails']['hintQuestion'],
      hint_answer: this.registerForm.value['loginDetails']['answer'],
      username: this.registerForm.value['loginDetails']['userName']
    }, { observe: 'response' }).subscribe((res: any) => {
      if (res.status == 200 && res.body.token) {
        localStorage.setItem('token', res.body.token);
        this.router.navigateByUrl('dashboard');
      } else {
        if (res.body.non_field_errors && res.body.non_field_errors.length > 0)
          this.errorMessage = res.body.non_field_errors[0];
      }
      console.log(res);
    }, err => {
      console.log(err);
      if (err.error.non_field_errors.length > 0) {
        this.errorMessage = err.error.non_field_errors[0];
      }

    })
  }
  resetForm() {
    this.registerForm.reset();
  }
  getHints() {
    this.http.get(config.serverName + ':' + config.port + '/hints').subscribe(res => {
      this.hintsArray = res;
    })
  }
}
