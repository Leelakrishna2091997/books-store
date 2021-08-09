import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { config } from '../../../../src/config';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private httpClient: HttpClient) { }
  authenticate(data) {
    return this.httpClient.post(config.serverName + ':' + config.port + '/login', data).pipe(map((res: any) => {
      return res;
    }));
  }
  public isAuthenticated(): boolean {
    return localStorage.getItem('token') ? true : false;
  }
}
