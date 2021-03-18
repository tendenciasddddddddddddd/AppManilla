import { Component, Injector, ViewChild, NgZone, HostListener } from '@angular/core';
import { IonSlides, IonContent } from '@ionic/angular';
import { BasePage } from '../base-page/base-page';
import { UserService } from './items.service';

import { BluetoothSerial } from '@ionic-native/bluetooth-serial/ngx';
import {  StorageService } from './../../providers/storage/storage.service';
import { BluetoothService } from './../../providers/bluetooth/bluetooth.service';
import { ToastController, AlertController } from '@ionic/angular';

@Component({
  selector: 'page-item',
  templateUrl: './item.html',
  styleUrls: ['./item.scss']
})
export class ItemPage extends BasePage {

  @ViewChild('slides') slides: IonSlides;
  @ViewChild(IonContent, { static: true }) content: IonContent;

  @HostListener('window:focus')
  onFocus(): void {
    this.onContentLoaded();
  }

  panel =false;
  idget=null;
  public selectedItems: Array<any> = [];
  addressList: any = {};
  //DIVICES*******************
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
    public userService1: UserService) {
    super(injector);
    
    
    //this.idget = this.actRoute.snapshot.params['id'];
    

  }

  enableMenuSwipe(): boolean {
    return false;
  }

  ngOnInit() {
    
  }

  onContentLoaded() {
    setTimeout(() => {
    //  this.contentLoaded.next();
    }, 400);
  }

  async ionViewDidEnter() {

    try {

      this.idget =  this.getParams().id;
      console.log(this.idget);
      if(this.idget!=null){
        this.userService1.getunitisubcategoria(this.idget)
        .subscribe((res: any) =>{
         this.addressList=res;
         this.panel=false;
        }, error => {
          console.log(error);
        }
  
        )
     }

    } catch (error) {
      this.showErrorView();
    }

  }

  
  //----------------------------------------------------------------CONECCION CON DISPOSITIVOS---------------------


  async onAddToCart() {

    this.panel=true;
    this.checkBluetoothEnabled()
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
 

}
interface pairedlist {
  "class": number,
  "id": string,
  "address": string,
  "name": string
}