import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from 'src/environments/environment';

@Injectable({
    providedIn: 'root'
  })
export class RegistrationService {

  constructor(private http: HttpClient,) {
  }

 
  createUser(user: any) {
    const body = JSON.stringify(user);
    const headers = new HttpHeaders()
      .set('Content-Type', 'application/json');
    return this.http.post(environment.serverUrl + 'configurations', body, {
      headers: headers
    });
  }
  getUsers(id){
    const headers = new HttpHeaders()
    .set('Content-Type', 'application/json');
    return this.http.get(environment.serverUrl + 'configurations/authenticat/'+id,{
      headers: headers
    }
    );
  }
}