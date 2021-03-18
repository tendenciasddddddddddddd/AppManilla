import { Component, OnInit, Output, EventEmitter, ViewChild, ElementRef, Input } from '@angular/core';
import { Platform, ActionSheetController } from '@ionic/angular';
import { CameraOptions, Camera } from '@ionic-native/camera/ngx';
import { TranslateService } from '@ngx-translate/core';
import { ParseFile } from 'src/app/services/parse-file';
import { UserService } from 'src/app/pages/profile-edit/profile.service';

@Component({
  selector: 'app-upload-box',
  templateUrl: './upload-box.component.html',
  styleUrls: ['./upload-box.component.scss']
})
export class UploadBoxComponent implements OnInit {

  @ViewChild('fileInput', { static: true }) fileInput: ElementRef;

  @Input() text: string;

  @Output('onFileUploaded')

  private eventFileUpload: EventEmitter<ParseFile> = new EventEmitter<ParseFile>();

  public parseFile: any;
  public isUploading: boolean = false;
  valorImagen=null;
  constructor(private platform: Platform,
    private parseFileService: ParseFile,
    private camera: Camera,
     public userService: UserService,
    private actionSheetCtrl: ActionSheetController,
    private translate: TranslateService) { }

  ngOnInit() {
  }

  onBoxTouched() {
    this.fileInput.nativeElement.click();
  }

  onFileChanged(event: any = null) {
    this.isUploading = true;
    //this.doUpload(event.target.files[0], false);
    if (event.target.files && event.target.files.length > 0) {
      const file = event.target.files[0];
      
      this. cargarimagenServer(file);
      console.log(file.name);
      
    }
  }
  cargarimagenServer(file){
  
    this.userService.uploadFile(file).subscribe(
      (response :any) => {
        setTimeout(() => {
          this.valorImagen= "http://manill-001-site1.btempurl.com/uploads/"+file.name;
        }, 1000);
        
      },
      error => {
        console.log(error);
        this.isUploading = false;
      }
    );
  }
  async chooseImage(sourceType: number) {

    try {

      const options: CameraOptions = {
        sourceType: sourceType,
        destinationType: this.camera.DestinationType.DATA_URL,
        targetWidth: 400,
        targetHeight: 400,
        quality: 70,
        mediaType: this.camera.MediaType.PICTURE,
        encodingType: this.camera.EncodingType.JPEG,
        correctOrientation: true
      };

      const imageData = await this.camera.getPicture(options);

      this.cargarimagenServer(imageData);

    } catch (error) {
      console.warn(error);
    }

  }

  async presentActionSheet() {

    const trans = await this.translate.get([
      'PHOTO_LIBRARY',
      'CAMERA',
      'CANCEL',
      'CHOOSE_AN_OPTION']
    ).toPromise();

    const actionSheet = await this.actionSheetCtrl.create({
      header: trans.CHOOSE_AN_OPTION,
      buttons: [{
        text: trans.PHOTO_LIBRARY,
        handler: () => {
          this.chooseImage(this.camera.PictureSourceType.PHOTOLIBRARY);
        }
      }, {
        text: trans.CAMERA,
        handler: () => {
          this.chooseImage(this.camera.PictureSourceType.CAMERA);
        }
      }, {
        text: trans.CANCEL,
        role: 'cancel'
      }]
    });

    return await actionSheet.present();

  }

  async doUpload(fileOrBase64: string, isBase64: boolean = true) {

    try {
      this.isUploading = true;
      this.parseFile = await this.parseFileService.upload(fileOrBase64, isBase64);
      this.isUploading = false;
      this.eventFileUpload.emit(this.parseFile);
      console.log("estamos onfilechanhe");
    } catch (error) {
      this.isUploading = false;
      console.warn(error.message);
    }

  }


}
