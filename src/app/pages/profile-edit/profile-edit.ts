
import { Component, Injector } from '@angular/core';
import { BasePage } from '../base-page/base-page';
import { User } from '../../services/user';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { ParseFile } from 'src/app/services/parse-file';
import { UserService } from './profile.service';

@Component({
  selector: 'page-profile-edit',
  templateUrl: 'profile-edit.html',
  styleUrls: ['profile-edit.scss']
})
export class ProfileEditPage extends BasePage {

  public photo: ParseFile;
  public user: User;
  public form: FormGroup;
  addressList: any = {};
  nombre:string;
  autht;
  imagenUsuario:string = null;


  constructor(injector: Injector,  public userService: UserService) {
    super(injector);
    this.autht = localStorage.getItem('token');
    this.userService.getNewsDetails(this.autht)
    .subscribe((response: any) => {
        
        this.addressList = response;
          this.nombre= response.name;
          let formGroupParams: any = {
            type: new FormControl(this.addressList.type),
           name: new FormControl(this.addressList.name, Validators.required),
           username : new FormControl(this.addressList.username, Validators.required),
           email: new FormControl(this.addressList.email, Validators.required)
            
          };
        
          // Show the username field if user logged in with username/password
         
          this.form = new FormGroup(formGroupParams);
          console.log("echo")
        
        
        
    }, (error) => {
      console.log(error.error.message, 4000);
     
    });
   
  }

  enableMenuSwipe() {
    return true;
  }
  ionViewWillEnter() {
    
    this.autht = localStorage.getItem('token');
    
   
    
  }
  ngOnInit() {
    
   // this.setupForm();
  }
  
  onFileUploaded(blogData: FormData) {
    //this.photo = file;
    console.log('new blog has been submitted.', blogData);
    this.userService.createimage(blogData)
    .subscribe((response :any) => {
      console.log(response);
    })
  }
  
  public upload(event) {
    if (event.target.files && event.target.files.length > 0) {
      const file = event.target.files[0];
      console.log(file.name);
    this.imagenUsuario = file.name;
    }
  }

 setupForm() {
    
    
    
    
  }

  onDismiss() {
    this.modalCtrl.dismiss();
  }

  async onSubmit() {

    try {

      if (this.form.invalid) {
        return this.translate.get('INVALID_FORM')
        .subscribe(str => this.showToast(str));
      }

      this.showLoadingView({ showOverlay: false });

      const formData = Object.assign({}, this.form.value);

      if (formData.name) {
        formData.name = formData.name.trim();
      }

      if (formData.username) {
        formData.username = formData.username.trim();
      }

      if (this.photo) {
        formData.photo = this.photo;
      }

      if (formData.email) {
        formData.email = formData.email.trim();
      } else {
        delete formData.email;
      }
      formData._id = this.addressList._id;
      formData.image =this.imagenUsuario;
      console.log(formData)
      this.userService.updateAddress(this.addressList._id,formData)
      .subscribe((res: any) =>{
        this.addressList =res;
        
        //console.log(res)
         this.reloadCurrentRoute();
         this.showContentView();
         this.translate.get('SAVED').subscribe(str => this.showToast(str));
         this.onDismiss();
      }, error => {
        console.log(error);
        this.reloadCurrentRoute();
      });
      
    } catch (error) {

      console.log(error);

      if (error.code === 202) {
        this.translate.get('USERNAME_TAKEN').subscribe(str => this.showToast(str));
      } else if (error.code === 203) {
        this.translate.get('EMAIL_TAKEN').subscribe(str => this.showToast(str));
      } else if (error.code === 125) {
        this.translate.get('EMAIL_INVALID').subscribe(str => this.showToast(str));
      } else {
        this.translate.get('ERROR_NETWORK').subscribe(str => this.showToast(str));
      }

      this.showContentView();
    }
  }
  reloadCurrentRoute() {
    let currentUrl = this.router.url;
    this.router.navigateByUrl('/', {skipLocationChange: true}).then(() => {
        this.router.navigate([currentUrl]);
    });
  }
}
