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
        return this.http.get(environment.serverUrl + 'user/optenerus'+ authtoken,{
            headers: headers
        });
    }
    getUserx() {
        let authtoken = localStorage.getItem('token');
        const body = JSON.stringify(authtoken);
        const headers = new HttpHeaders()
          .set('Content-Type', 'application/json');
        return this.http.post(environment.serverUrl + 'user/optenerus', body, {
          headers: headers
        });
      }
      getNewsDetails(newsId) {
       
        const headers = new HttpHeaders()
          .set('Content-Type', 'application/json');
        return this.http.get(environment.serverUrl + 'user/' + newsId, {
          headers: headers
        });
      }
      getHijos() {
        const headers = new HttpHeaders()
        .set('Content-Type', 'application/json');
        return this.http.get(environment.serverUrl + 'hijos', {
          headers: headers
        });
      }
      
      getUsers1() {
        return new Promise(resolve => {
          this.http.get(environment.serverUrl + 'hijos').subscribe(data => {
            resolve(data);
          }, err => {
            console.log(err);
          });
        });
      }
      
      getUsers(id){
        const headers = new HttpHeaders()
        .set('Content-Type', 'application/json');
        return this.http.put(environment.serverUrl + 'hijos/'+id,{
          headers: headers
        }
        );
      }


      deleteHijos(addressId) {
        let authtoken = localStorage.getItem('token');
        const headers = new HttpHeaders()
            .set('Authorization', authtoken)
        return this.http.delete(environment.serverUrl + 'hijos/' + addressId, {
            headers: headers
        });
    }

 
  }