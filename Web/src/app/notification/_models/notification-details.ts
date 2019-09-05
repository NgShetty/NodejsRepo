import { ApplicationDTO, AssociatedTopic } from 'src/app/Application/_models/createApplication';
import { Time } from '@angular/common';
import { AssociatedApplication } from 'src/app/Topics/_models/Topics';
import { ApplicationListItem } from 'src/app/Application/_models/applicationList';


export class NotificationAdd {
    constructor() {
        this.application = new ApplicationListItem();
        this.messageBody = "";
        this.isAndroidNotification = false;
        this.isIOSNotification = false;
        this.topics = [];
        this.notificationImage={};
        this.notificationSound={};

    }
    application: ApplicationListItem;
    isIOSNotification: boolean;
    isAndroidNotification: boolean;
    sendNotificationType: NotificationType;
    title: string;
    messageBody: string;
    
    isScheduled: boolean;
    scheduledDate: Date;
    scheduledTime: any;
    zoneOffset: string;
  
    // zoneName: string;
    status: boolean;
    topics: AssociatedTopic[] = [];
    notificationImage: any = {};
    notificationSound: any = {};
}

export enum NotificationType {
    broadcast = 0,
    users = 1

}

export class NotificationEdit extends NotificationAdd {
    id: any;
}

export class NotificationListItem
{
          id :any;
          application : AssociatedApplication
          isIOSNotification :boolean
          isAndroidNotification : boolean
          platformDisplayText:string
          recipientsDisplayText : string
          sentBy : string
          messageBody : string
          createdDate :Date
          successCount : number
          failureCount : number
          successDisplayText:string
          failureDisplayText : string
          topics: AssociatedTopic[]
          isScheduled: boolean
}

export enum Category
{
    default = 0,
    version=1,
    securityGroup=2,
    customTopic=3,
    globalVersion=4,
    globalSecurityGroup=5,
    globalTopic=6
}

export class NotificationDetails extends NotificationEdit
{
    platformDisplayText:string
    recipientsDisplayText: string
    sentBy:string
}