import { Component, Injector, ViewChild } from '@angular/core';
import { IonContent } from '@ionic/angular';
import { BasePage } from '../base-page/base-page';
import { Cart } from '../../services/cart';
import { User } from '../../services/user';
import { CardAddPage } from '../card-add/card-add';
import { Subject, Observable, merge } from 'rxjs';
import { RegistrationService } from './configx.service';

@Component({
  selector: 'cart-page',
  templateUrl: './cart-page.html',
  styleUrls: ['./cart-page.scss']
})
export class CartPage extends BasePage {

  @ViewChild(IonContent, { static: true }) content: IonContent;

  public cart: Cart;
  public isSavingCart: boolean;

  protected contentLoaded: Subject<any>;
  protected loadAndScroll: Observable<any>;

  public subtotal = 0;
  autht=null;
  panel=false;
  users: any;

  constructor(injector: Injector,  public userService: RegistrationService,
    private cartService: Cart) {
    
    super(injector);
    

    this.contentLoaded = new Subject();

  }

  enableMenuSwipe(): boolean {
    return true;
  }

  ngOnInit() {
    
  }
  async getUsers(event: any = {}) {
    try{
     this.refresher = event.target;
     this.autht = await localStorage.getItem('token');
     if(this.autht!=null){
       
       this.userService.getUsers(this.autht)
       .subscribe((res: any) =>{
        
        this.users =res;
         console.log(res)
         
         this.showContentView();
       
       }, error => {
         console.log(error);
       }
 
       )
       this.onRefreshComplete();
    }
    }catch (error) {
 
      console.log(error);
    }
     
    
   }
  ionViewWillEnter() {
    this.autht = localStorage.getItem('token');
    if(this.autht!=null){
        this.panel=true;
        this.getUsers();
    }else{
      this.panel=false;
    }
  }

  async ionViewDidEnter() {

 
  }

  setupObservable() {
    this.loadAndScroll = merge(
      this.content.ionScroll,
      this.contentLoaded
    );
  }

  onContentLoaded() {
    setTimeout(() => {
      this.contentLoaded.next();
    }, 400);
  }



  async onAddButtonTouched() {

    await this.showLoadingView({ showOverlay: true });
    
    const modal = await this.modalCtrl.create({
      component: CardAddPage,
    });

    await modal.present();

    this.dismissLoadingView();

    const { data } = await modal.onWillDismiss();

    if (data) {
     // this.cards.unshift(data);
      this.showContentView();
    }
  }

  async onDeleteAddress(id, index) {

    try {

      const str = await this.translate.get('DELETE_CONFIRMATION').toPromise();

      const res = await this.showConfirm(str);

      if (!res) return;
        console.log("canselo")
        this.userService.deleteHijos(id).subscribe(res => {
          this.users.splice(index, 1);
        }, error => {
          this.showAlert('Somthing Wrong');
        })
     
      
      this.translate.get('DELETED').subscribe(str => this.showToast(str));
      
    } catch (error) {
      this.showContentView();
      this.translate.get('ERROR_NETWORK').subscribe(str => this.showToast(str));
    }

  }

  deleteAdress(id, index) {
    this.userService.deleteHijos(id).subscribe(res => {
      this.users.splice(index, 1);
    }, error => {
      this.showAlert('Somthing Wrong');
    })
  }
}
