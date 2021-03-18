import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from 'src/environments/environment';

@Injectable({
    providedIn: 'root'
  })
  export class UserService {

    constructor(private http: HttpClient,) {
    }
  
    getUserx1() {
        let authtoken = localStorage.getItem('token');
        const headers = new HttpHeaders();
        return this.http.get(environment.serverUrl + 'user/'+ authtoken,{
            headers: headers
        });
    }
    getunitisubcategoria(id){
        const headers = new HttpHeaders();
        return this.http.get(environment.serverUrl + 'hijos/' + id 
        );
      }

 
  }