export class DeviceDTO {
    
     id: string;
     userID: string;
     newNotificationToken: string;
     oldNotificationToken: string;
     platform: string;
     isDeleted: boolean;
     modifiedDate: Date;
     createdDate: Date;
     isEnabled:boolean;
     associatedApplication:any;
}