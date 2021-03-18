import { Component, Injector, ViewChild, HostListener } from '@angular/core';
import { IonSlides, IonContent } from '@ionic/angular';
import { BasePage } from '../base-page/base-page';
import { Slide } from '../../services/slide';
import { Item } from '../../services/item';
import * as Parse from 'parse';
import { Category } from '../../services/category';
import { SubCategory } from '../../services/sub-category';
import { Subject, Observable, merge, of } from 'rxjs';
import { AddressAddPage } from '../address-add/address-add';
import { CustomerAddress } from '../../services/customer-address';
import { UserService } from './home.service';
import { ActivatedRoute, Router } from "@angular/router";
import {  usuario} from '../model/mod';
import {
  trigger,
  style,
  animate,
  transition,
  query,
  stagger
} from '@angular/animations';
import { Brand } from 'src/app/services/brand';
import { AppConfigService } from 'src/app/services/app-config';

@Component({
  selector: 'page-home',
  templateUrl: './home.html',
  styleUrls: ['./home.scss'],
 
})
export class HomePage extends BasePage {

  EndData= true;
  categories1: any;
  users: any;
  users1: any;
  autht;
  private queryItems: any = {
    page: 0,
    limit: 20,
    sortBy: 'desc',
    sortByField: 'createdAt',
  };

 


  public router: Router;
  
  hijosList: any = {};
  items1: usuario[];
  
  auxiliar: usuario[];
  public selectedItems: Array<any> = [];
  public layout: any;
  public addresses: CustomerAddress[] = [];
  constructor(injector: Injector,
  
     public userService: UserService) {
    super(injector);
    
  
  }

  enableMenuSwipe(): boolean {
    return false;
  }
  reloadCurrentRoute() {
    let currentUrl = this.router.url;
    this.router.navigateByUrl('/', {skipLocationChange: true}).then(() => {
        this.router.navigate([currentUrl]);
    });
  }
  ngOnInit() {
    
   
    
  }
 async getUsers(event: any = {}) {
   try{
    this.refresher = event.target;
    this.autht = await localStorage.getItem('token');
    if(this.autht!=null){
      this.EndData=false
      this.userService.getUsers(this.autht)
      .subscribe((res: any) =>{
        this.users =res;
        if(this.autht!=null){
            
        }
        console.log(res)
        this.users.lo
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
    
    this.showLoadingView({ showOverlay: false });
    this.getUsers();
  }
 
 
  //  ionViewDidEnter() {
  //   this.reloadCurrentRoute();
  // }

  // async ionViewDidEnter() {

  //   const title = await this.getTrans('APP_NAME');
  //   this.setPageTitle(title);

  //   this.setMetaTags({
  //     title: title
  //   });
  // }
  async onAddButtonTouched() {

    await this.showLoadingView({ showOverlay: true });
    
    const modal = await this.modalCtrl.create({
      component: AddressAddPage
    });
    
    await modal.present();

    this.dismissLoadingView();

    const { data } = await modal.onWillDismiss();
    
    if (data) {
      this.addresses.unshift(data);
      this.showContentView();
    }
  }
  



  async onClearSearch() {
    //this.suggestions = [];
  }

  onBlurSearchInput() {
   // setTimeout(() => this.suggestions = [], 100);
  }



  onSuggestionTouched() {
    //setTimeout(() => this.suggestions = [], 300);
  }



  trackByFn(index: number, item: any) {
    if (!item) return null;
    return item.id;
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

  onItemTouched(id) {
    this.navigateToRelative('./items/' + id);
   // this.router.navigate(['items/',_id]);
  }
}