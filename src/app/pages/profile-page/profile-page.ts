import { Component, Injector, OnInit, ViewChild } from '@angular/core';
import { BasePage } from '../base-page/base-page';
import { User } from '../../services/user';
import { ProfileEditPage } from '../profile-edit/profile-edit';
import { ChangePasswordPage } from '../change-password/change-password';
import { SettingsPage } from '../settings-page/settings-page';
import { SignInPage } from '../sign-in/sign-in';
import { IonContent } from '@ionic/angular';
import { UserService } from './user.service';
@Component({
  selector: 'profile-page',
  templateUrl: './profile-page.html',
  styleUrls: ['./profile-page.scss']
})
export class ProfilePage extends BasePage implements OnInit {

  @ViewChild(IonContent, { static: true }) container: IonContent;

  public user: User;
  public currentColor: string
  public isGuest: boolean;
  addressList: any = {};
  nombre;
  autht;
  constructor(injector: Injector, public userService: UserService,) {
    super(injector);
    this.currentColor = 'blue';
    this.autht = localStorage.getItem('token');
  }

  enableMenuSwipe() {
    return false;
  }

  ionViewWillEnter() {
    if (this.container) {
      this.container.scrollToTop();
    }
    this.autht = localStorage.getItem('token');
    if(this.autht!=null){
      this.userService.getNewsDetails(this.autht)
      .subscribe((response: any) => {
           this.nombre = response.name;
       
          this.addressList = response;
          console.log("bien echo");
          this.isGuest=true;
      }, (error) => {
        console.log(error.error.message, 4000);
        this.isGuest=false;
      });
    }else{
      this.nombre = "Invitado"
      this.isGuest=false;
    }
 
  }

 
  async ionViewDidEnter() {
    
    
  }

  ngOnInit() {
    
  }

  checkIsGuest() {
    // this.isGuest = this.user &&
    //   this.user.attributes.authData &&
    //   this.user.attributes.authData['anonymous'] !== undefined;
    
     
  }

  goTo(page: string) {

    if (this.autht==null && page !== 'help') {
      return this.onPresentSignInModal();
    }

    this.navigateToRelative('./' + page);
  }

  async onPresentSignInModal() {

    await this.showLoadingView({ showOverlay: true });

    const modal = await this.modalCtrl.create({
      component: SignInPage,
      componentProps: {
        showLoginForm: true
      }
    });

    await modal.present();

    this.showContentView();
  }

  async onPresentSignUpModal() {

    await this.showLoadingView({ showOverlay: true });

    const modal = await this.modalCtrl.create({
      component: SignInPage,
      componentProps: {
        showSignUpForm: true
      }
    });

    await modal.present();

    this.showContentView();
  }

  async onPresentEditModal() {

    if (this.autht==null) return this.onPresentSignInModal();

    await this.showLoadingView({ showOverlay: true });

    const modal = await this.modalCtrl.create({
      component: ProfileEditPage
    });
    setTimeout(() => {
      modal.present();
    }, 500);
   // await modal.present();

    this.showContentView();
  }

  async onPresentChangePasswordModal() {

    if (this.autht==null) return this.onPresentSignInModal();

    await this.showLoadingView({ showOverlay: true });

    const modal = await this.modalCtrl.create({
      component: ChangePasswordPage
    });

    await modal.present();

    this.showContentView();
  }

  async onPresentSettingsModal() {

    if (this.autht==null) return this.onPresentSignInModal();

    await this.showLoadingView({ showOverlay: true });

    const modal = await this.modalCtrl.create({
      component: SettingsPage
    });

    await modal.present();

    this.showContentView();
  }

  async onLogout() {
   
    try{
      const str = await this.translate.get('¿Estás seguro que deseas cerrar sesión?').toPromise();
      const res = await this.showConfirm(str);
      if (!res) return;
       console.log("action")
        localStorage.removeItem("token");
       this.isGuest=false;
       this.reloadCurrentRoute();
       window.location.reload(true);
    }catch (error) {
      this.showContentView();
      this.translate.get('ERROR_NETWORK').subscribe(str => this.showToast(str));
    }

    // var est= window.dispatchEvent(new CustomEvent('user:logout'));
    // if (est){
    //   localStorage.removeItem("token");
    //   this.isGuest=false;
    // }else{
    //   console.log("ninguna accion");
    // }
    
  }
  reloadCurrentRoute() {
    let currentUrl = this.router.url;
    this.router.navigateByUrl('/', {skipLocationChange: true}).then(() => {
        this.router.navigate([currentUrl]);
    });
  }
}
