import { Component, Injector } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { BasePage } from '../base-page/base-page';
import { CustomerAddress } from '../../services/customer-address';
import { Zone } from '../../services/zone';
import { RegistrationService } from './hijos.service';
import {  usuario} from '../model/mod';

@Component({
  selector: 'address-add',
  templateUrl: './address-add.html',
  styleUrls: ['./address-add.scss']
})
export class AddressAddPage extends BasePage {

  public form: FormGroup;
  public zones: Zone[] = [];
  public subzones: Zone[] = [];
  imagenUsuario:string = null;
  autht=null;
  public users: usuario;
  constructor(injector: Injector,
    private zoneService: Zone,
    
    public registrationService: RegistrationService,
    private customerAddressService: CustomerAddress) {
    super(injector);
  }

  ngOnInit() {
    this.setupForm();
  }

  enableMenuSwipe(): boolean {
    return false;
  }

  ionViewWillEnter() {
    this.autht = localStorage.getItem('token');
  }

  setupForm() {
    this.form = new FormGroup({
      fisrtname: new FormControl('', Validators.required),
      lastname: new FormControl('', Validators.required),
      description: new FormControl('', Validators.required),
      age: new FormControl('', Validators.required),
      status: new FormControl('', Validators.required),
      isDefault: new FormControl(false),
    });
  }

  onDismiss(users: usuario=null) {
    this.modalCtrl.dismiss(users);
  }

  public upload(event) {
    if (event.target.files && event.target.files.length > 0) {
      const file = event.target.files[0];
      console.log(file.name);
    this.imagenUsuario = file.name;
    }
  }

  async onSubmit() {

    if (this.form.invalid) {
      return this.translate.get('INVALID_FORM').subscribe(str => this.showToast(str));
    }

    try {

      //await this.showLoadingView({ showOverlay: false });
      
      const formData = Object.assign({}, this.form.value);
      formData.fkpadre=this.autht;
      formData.image = this.imagenUsuario;
     // const address = await this.customerAddressService.create(formData);
      this.registrationService.createUser(formData)
      .subscribe((user: any) => {
        this.users=user
        this.showContentView();
       
       this.onDismiss(this.users);
       window.location.reload(true);
       window.dispatchEvent(new CustomEvent('user:login', {
        detail: user.fisrtname
      }));
       console.log(user)
      }, error => {
        console.log(error)
      })
     
      this.reloadCurrentRoute();
     // this.showContentView();
     // this.onDismiss(address);
      
    } catch (error) {
      this.showContentView();
      this.translate.get('ERROR_NETWORK').subscribe(str => this.showToast(str));
    }

  }
  reloadCurrentRoute() {
    let currentUrl = this.router.url;
    this.router.navigateByUrl('/', {skipLocationChange: true}).then(() => {
        this.router.navigate([currentUrl]);
    });
  }

}
