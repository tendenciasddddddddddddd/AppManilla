import { Component, Injector } from '@angular/core';
import { ActionSheetController } from '@ionic/angular';
import { BasePage } from '../base-page/base-page';
import { Card } from '../../services/card';
import { CardAddPage } from '../card-add/card-add';

@Component({
  selector: 'page-card-list',
  templateUrl: 'card-list.html',
  styleUrls: ['card-list.scss']
})
export class CardListPage extends BasePage {

  public cards: Card[] = [];
  autht=null;
  panel=false;

  constructor(injector: Injector,
    private actionSheetCtrl: ActionSheetController,
    private creditCardService: Card) {
    super(injector);
  }

  enableMenuSwipe() {
    return false;
  }

 
  ionViewWillEnter() {

    this.autht = localStorage.getItem('token');
    if(this.autht!=null){
        this.panel=true;
    }else{
      this.panel=false;
    }

  }
 

  

  async onDeleteCard(card: Card) {

    try {

      let str = await this.translate.get('DELETE_CONFIRMATION').toPromise();
      
      const res = await this.showConfirm(str);

      if (!res) return;
  
      await card.destroy();

      let index = this.cards.indexOf(card);
      if (index !== -1) this.cards.splice(index, 1);

      this.showContentView();
      this.translate.get('DELETED').subscribe(str => this.showToast(str));
      
    } catch (error) {
      this.showContentView();
      this.translate.get('ERROR_NETWORK').subscribe(str => this.showToast(str));
    }

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
      this.cards.unshift(data);
      this.showContentView();
    }
  }
}