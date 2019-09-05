import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AdalService } from '../shared/services/adal.service';
import { AuthenticationService } from '../shared/authentication/authentication.service';
import { EnvService } from '../shared/services/env.service';
import { UserService } from '../Users/user.service';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.less']
})
export class HeaderComponent implements OnInit {

  showUserProfileDiv: boolean = false;
  username:string="";
  userImage: any;
  constructor(private router: Router, private adal: AdalService, private authService: AuthenticationService, private userService: UserService, private sanitizer : DomSanitizer) { }

  ngOnInit() {
    this.authService.userProfile.subscribe((data) => {
      if(data){
      this.username=data.userName.replace(',','');
      this.userImage=data.imageUrl;
      }
  // this.getImageFromGraphService("https://graph.microsoft.com/v1.0/users/198cacf0-5ac9-4b85-bf73-3bf3ac1e053b/photo/$value");
  // this.userImage="https://graph.microsoft.com/v1.0/users/198cacf0-5ac9-4b85-bf73-3bf3ac1e053b/photo/$value";
   });
  
  }

  redirectToProfile()
  {
    this.router.navigate(['user/edit',{ fromUserPage: false }]);
  }

  signout()
  {
    this.adal.logout();
  }

  getImageFromGraphService(imageUrl:string) {
  
     this.userService.getUserImage(imageUrl).subscribe((data:any) => {
      this.userImage = this.createImageFromBlobAndReturn(data.body);
  });

  }
  
createImageFromBlobAndReturn(image: any):any {
  
  var binaryData = [];
  binaryData.push(image);
  
  var reader = new FileReader();
  reader.readAsBinaryString(new Blob(binaryData));
  
  const imageFile = new File([new Blob(binaryData)], "");
  let base64data = window.URL.createObjectURL(imageFile);
  console.log(this.sanitizer.bypassSecurityTrustUrl(base64data));
  return this.sanitizer.bypassSecurityTrustUrl(base64data);
  
  }
  closeDropdown(event: any)
  {
   this.showUserProfileDiv=false;
  }
  showUserPopup()
  {
    this.showUserProfileDiv=!this.showUserProfileDiv;
    event.stopPropagation();
  }
}
