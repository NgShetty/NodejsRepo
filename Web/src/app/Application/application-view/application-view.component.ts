import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, NavigationExtras, Router } from '@angular/router';
import { ApplicationService } from '../application.service';
import { EditApplicationDTO } from '../_models/editApplication';

@Component({
  selector: 'app-application-view',
  templateUrl: './application-view.component.html',
  styleUrls: ['./application-view.component.css']
})
export class ApplicationViewComponent implements OnInit {

  IsIosActive: boolean = true;
  IsAndroidActive: boolean = false;
  guid: any = null;
  appRecord: EditApplicationDTO;
  applicationImage: any[] = [];
  notificationImageFiles: any[] = [];
  audioFiles: any[] = [];
  selectedAppImageFile: any[] = [];
  selectedJsonFile: any[] = [];
  selectedApnsFile: any[] = [];


  constructor(private route: ActivatedRoute, private applicationService: ApplicationService,
    private router: Router) {

   
  }

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      this.guid = params["appId"];
    });

    if (this.guid != null) {
      this.applicationService.getApplicationById(this.guid).subscribe((res: any) => {
        this.appRecord = res.data;
        this.applicationImage = res.data.applicationImageFilePath;
        this.notificationImageFiles = res.data.notificationImagesFilePath;
        this.audioFiles = res.data.notificationSoundsFilePath;
      });
    }
  }

  iosactive(tabId: any) {
    this.IsIosActive = true;
    this.IsAndroidActive = false;
  }

  androidactive(tabId: any) {
    this.IsIosActive = false;
    this.IsAndroidActive = true;
  }

  backtoApplicationList() {
    this.router.navigate(["application"]);
  }
}
