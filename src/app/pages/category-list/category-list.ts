import { Component, Injector, ViewChild, OnInit, HostListener } from '@angular/core';
import { IonContent} from '@ionic/angular';
import { Category } from '../../services/category';
import { BasePage } from '../base-page/base-page';
import { Subject, Observable, merge } from 'rxjs';
import { Item } from 'src/app/services/item';
//import { BluetoothSerial,BluetoothSerialOriginal } from '@ionic-native/bluetooth-serial';
import { BluetoothSerial } from '@ionic-native/bluetooth-serial/ngx';
import {  StorageService } from './../../providers/storage/storage.service';
import { BluetoothService } from './../../providers/bluetooth/bluetooth.service';
import { ToastController, AlertController } from '@ionic/angular';
import {
  trigger,
  style,
  animate,
  transition,
  query,
  stagger
} from '@angular/animations';


@Component({
  selector: 'page-category-list',
  templateUrl: './category-list.html',
  styleUrls: ['./category-list.scss'],
  animations: [
    trigger('staggerIn', [
      transition('* => *', [
        query(':enter', style({ opacity: 0, transform: `translate3d(0,10px,0)` }), { optional: true }),
        query(':enter', stagger('40ms', [animate('100ms', style({ opacity: 1, transform: `translate3d(0,0,0)` }))]), { optional: true })
      ])
    ])
  ]
})
export class CategoryListPage extends BasePage implements OnInit {

  @ViewChild(IonContent, { static: true }) container: IonContent;

 
  

  public categories: Category[] = [];
  public params: any = {};
  public skeletonArray = Array(32);

  public suggestions: Item[] = [];

  protected contentLoaded: Subject<any>;
  protected loadAndScroll: Observable<any>;
 
  
  public layout: any;
//----------------------
pairedList: pairedlist;
listToggle: boolean = false;
pairedDeviceID: number = 0;
dataSend: string = "";
//--------------
devices: any[] = [];
showSpinner = false;
isConnected = false;
message = '';
messages = [];
  constructor(injector: Injector,
    public  bluetoothSerial: BluetoothSerial,
    public alertCtrl1: AlertController,
    public bluetooth: BluetoothService,
    public storage: StorageService,
    private itemService: Item,
  ) {
    super(injector);
    this.checkBluetoothEnabled()
  }

  ngOnInit() {
    // this.showSpinner = true;
    // this.bluetooth.storedConnection().then((connected) => {
    //   this.isConnected = true;
    //   this.showSpinner = false;
    //   this.sendMessage('nada');
    // }, (fail) => {
    //   this.bluetooth.searchBluetooth().then((devices: Array<Object>) => {
    //     this.devices = devices;
    //     this.showSpinner = false;
    //   }, (error) => {
    //     this.showToast(this.translate.instant(error));
    //     this.showSpinner = false;
    //   });
    // });
  }

  disconnect(): Promise<boolean> {
    return new Promise(result => {
      this.isConnected = false;
      this.bluetooth.disconnect().then(response => {
        result(response);
      });
    });
  }
  ngOnDestroy() {
    this.disconnect();
  }
  refreshBluetooth(refresher) {
    if (refresher) {
      this.bluetooth.searchBluetooth().then((successMessage: Array<Object>) => {
        this.devices = [];
        this.devices = successMessage;
        refresher.target.complete();
      }, fail => {
        this.showToast(this.translate.instant(fail));
        refresher.target.complete();
      });
    }
  }

  checkConnection(seleccion) {
    this.bluetooth.checkConnection().then(async (isConnected) => {
      const alert = await this.alertCtrl1.create({
        header: this.translate.instant('BLUETOOTH.ALERTS.RECONNECT.TITLE'),
        message: this.translate.instant('BLUETOOTH.ALERTS.RECONNECT.MESSAGE'),
        buttons: [
          {
            text: this.translate.instant('CANCEL'),
            role: 'cancel',
            handler: () => {}
          },
          {
            text: this.translate.instant('ACCEPT'),
            handler: () => {
              this.disconnect().then(() => {
                this.bluetooth.deviceConnection(seleccion.id).then(success => {
                  this.sendMessage('nada');
                  this.isConnected = true;
                  this.showToast(this.translate.instant(success));
                }, fail => {
                  this.isConnected = false;
                  this.showToast(this.translate.instant(fail));
                });
              });
            }
          }
        ]
      });
      await alert.present();
    }, async (notConnected) => {
      const alert = await this.alertCtrl1.create({
        header: this.translate.instant('BLUETOOTH.ALERTS.CONNECT.TITLE'),
        message: this.translate.instant('BLUETOOTH.ALERTS.CONNECT.MESSAGE'),
        buttons: [
          {
            text: this.translate.instant('CANCEL'),
            role: 'cancel',
            handler: () => {}
          },
          {
            text: this.translate.instant('ACCEPT'),
            handler: () => {
              this.bluetooth.deviceConnection(seleccion.id).then(success => {
                this.sendMessage('nada');
                this.isConnected = true;
                this.showToast(this.translate.instant(success));
              }, fail => {
                this.isConnected = false;
                this.showToast(this.translate.instant(fail));
              });
            }
          }
        ]
      });
      await alert.present();
    });
  }
  sendMessage(message: string) {
    this.bluetooth.dataInOut(`${message}\n`).subscribe(data => {
      if (data !== 'BLUETOOTH.NOT_CONNECTED') {
        try {
          if (data) {
            const entry = JSON.parse(data);
            this.addLine(message);
          }
        } catch (error) {
          console.log(`[bluetooth-168]: ${JSON.stringify(error)}`);
        }
        // this.presentToast(data);
        this.message = '';
      } else {
        alert(this.translate.instant(data));
      }
    });
  }
  /**
   * Recupera la información básica del servidor para las graficas de lineas.
   * @param message
   */
  addLine(message) {
    this.messages.push(message);
  }
  /**
   * Presenta un cuadro de mensaje.
   * @param {string} text Mensaje a mostrar.
   */
  
  
  //***************************************************************************************************************************** */
  checkBluetoothEnabled() {
    try{
      this.bluetoothSerial.isEnabled().then(success => {
        this.listPairedDevices();
      }, error => {
        
        this.translate.get('Habilite Bluetooth').toPromise();
      });
    }catch(error)
    {
      const str = this.translate.get('Solo funciona en tu teléfono!! Estamos trabajando duro para mostrar en la web').toPromise();
    }
    
  }

  listPairedDevices() {
    this.bluetoothSerial.list().then(success => {
      this.pairedList = success;
      this.listToggle = true;
    }, error => {
      alert("Please Enable Bluetooth")
      this.listToggle = false;
    });
  }

 



  

 

 

  

 
  enableMenuSwipe(): boolean {
    return false;
  }

 

  ionViewWillEnter() {
    if (this.container) {
      this.container.scrollToTop();
    }
  }

  async ionViewDidEnter() {

    
    
  }


  

  onContentLoaded() {
    setTimeout(() => {
      this.contentLoaded.next();
    }, 400);
  }


  async onSearch(event: any = {}) {

    const searchTerm = event.target.value;

    if (searchTerm) {

      try {
        this.suggestions = await this.itemService.load({
          tag: searchTerm.toLowerCase(),
          limit: 10,
        });
      } catch (error) {
        console.log(error.message);
      }

    }

  }

  async onClearSearch() {
    this.suggestions = [];
  }

  trackByFn(index: number, item: any) {
    if (!item) return null;
    return item.id;
  }

}
interface pairedlist {
  "class": number,
  "id": string,
  "address": string,
  "name": string
}