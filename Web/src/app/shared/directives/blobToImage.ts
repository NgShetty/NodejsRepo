import { Directive, ElementRef, OnInit , Input } from '@angular/core';
import { UserService } from 'src/app/Users/user.service';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';

@Directive({
  selector: '[graphImageUrl]'
})
export class DisplayImage implements OnInit {
  @Input('graphImageUrl') imageUrl: string;
  imageBlob: any="";
  constructor(private el: ElementRef, private userService: UserService,private sanitizer: DomSanitizer) { }
  ngOnInit() {
    this.getImageFromGraphService(this.imageUrl);
    }

    getImageFromGraphService(imageUrl:string) {
      this.userService.getUserImage(imageUrl).subscribe((data:any) => {
       this.createImageFromBlobAndReturn(data.body);
   });
   }
   
 createImageFromBlobAndReturn(image: any):any {
   
   var binaryData = [];
   binaryData.push(image);
   
  //  var reader = new FileReader();
  //  reader.readAsArrayBuffer(new Blob(binaryData));
   
   const imageFile = new Blob(binaryData);
   let base64data = window.URL.createObjectURL(imageFile);
   console.log(this.sanitizer.bypassSecurityTrustUrl(base64data));
   this.imageBlob = this.sanitizer.bypassSecurityTrustUrl(base64data);
   console.log(this.el.nativeElement);
   this.el.nativeElement.src = this.imageBlob.changingThisBreaksApplicationSecurity;
   }
}