import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders , HttpEvent, HttpResponse ,HttpRequest} from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { catchError } from 'rxjs/operators';
import { Observable, throwError } from 'rxjs';

@Injectable({
    providedIn: 'root'
  })
  export class UserService {


    httpOptions = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' })
    };
    
    private baseApiUrl: string;
    private apiDownloadUrl: string;
    private apiUploadUrl: string;
    private apiFileUrl: string;
    constructor(private http: HttpClient,) {
        this.baseApiUrl = 'http://manill-001-site1.btempurl.com/api/files/';
        this.apiDownloadUrl = this.baseApiUrl + 'download';
        this.apiUploadUrl = this.baseApiUrl + 'upload';
        this.apiFileUrl = this.baseApiUrl + 'filess';
    }
  
      // getNewsDetails(newsId) {
       
      //   const headers = new HttpHeaders()
      //     .set('Content-Type', 'application/json');
      //   return this.http.get(environment.serverUrl + 'user/' + newsId, {
      //     headers: headers
      //   });
      // }

      getNewsDetails(id){
        const headers = new HttpHeaders();
        return this.http.get(environment.serverUrl + 'user/' + id 
        );
      }
      createimage(blogData: FormData) {
        
        const headers = new HttpHeaders()
          .set('Content-Type', 'application/json');
        return this.http.post(environment.serverUrl + 'Blogs/', blogData, {
          headers: headers
        });
      }
      uploadFile1(file: Blob) {
        const formData = new FormData();
        formData.append('file', file);
        const headers = new HttpHeaders()
          .set('Content-Type', 'application/json');
        return this.http.post(environment.serverUrl+ 'files/upload' , formData, {
          headers: headers
          
        });
      }
      public uploadFile(file: Blob): Observable<HttpEvent<void>> {
        const formData = new FormData();
        formData.append('file', file);
      
        return this.http.request(new HttpRequest(
          'POST',
          this.apiUploadUrl,
          formData,
          {
            reportProgress: true
          }));
      }

      updateAddress(addressId, user: any) {
        const body = user;
        const headers = new HttpHeaders()
        .set('Content-Type', 'application/json');
        return this.http.put(environment.serverUrl+ 'user/'+ addressId ,  JSON.stringify(body), {
            headers: headers
        }).pipe(
          catchError(this.handleError)
        );
      }
      updateClassroom(id, user: any): Observable<any> {
        const body = user;
        const url = `${environment.serverUrl+ 'user'}/${id}`;
        return this.http.put(url, JSON.stringify(body), this.httpOptions)
          .pipe(
            catchError(this.handleError)
          );
      }
      // updateSong(id, song: Song): Observable<any> {
      //   return this.http.put('http://localhost:3000/api/update-song/' + id, song, this.httpOptions)
      //     .pipe(
      //       tap(_ => console.log(`Song updated: ${id}`)),
      //       catchError(this.handleError<Song[]>('Update Song'))
      //     );
      // }
      handleError(error) {
        let errorMessage = '';
        if (error.error instanceof ErrorEvent) {
          // client-side error
          errorMessage = `Error: ${error.error.message}`;
        } else {
          // server-side error
          errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}`;
        }
        window.alert(errorMessage);
        return throwError(errorMessage);
      }
  }