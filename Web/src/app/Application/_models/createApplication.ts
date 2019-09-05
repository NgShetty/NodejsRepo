import { EditTenant } from 'src/app/Tenant/_models/editTenant';
import { TopicType } from 'src/app/Topics/_models/Topics';
import { TenantListItem } from 'src/app/Tenant/_models/tenantList';

export class ApplicationDTO {
    tenant: TenantListItem;
    status: boolean;
    name: string;
    token: string;
    applicationImageFilePath: any = {};
    notificationSoundsFilePath: any = [];
    notificationImagesFilePath: any = [];
    androidConfig: AndroidAppConfig;
    iosConfig: iOSAppConfig;
    topics:  Array<AssociatedTopic>= [];

    constructor() {
        this.androidConfig = new AndroidAppConfig();
        this.iosConfig = new iOSAppConfig();
        this.notificationImagesFilePath = [];
        this.notificationSoundsFilePath = [];
        this.name = "";
        this.applicationImageFilePath = {};
        this.topics=[];
        this.tenant = new TenantListItem();
    }
}

export class iOSAppConfig {
    appToken: string;
    bundleId: string;
    expiresOn: Date;
    certificateThumbPrint: string;
    certificatePassword: string;
    apnsCertificateFilePath: string;
    enabled: boolean;
    apnsCertificateFileBytes: any;

    constructor() {
        this.apnsCertificateFileBytes = "";
        this.appToken="";
        this.bundleId="";
        this.enabled=true;
        this.apnsCertificateFilePath="";
        this.certificatePassword="";
        this.certificateThumbPrint="";
    }
}

export class AndroidAppConfig {
    appToken: string;
    packageName: string;
    fcmApiKey: string
    googleServicesJsonFilePath: string;
    enabled: boolean;

    constructor() {
        this.googleServicesJsonFilePath = "";
        this.appToken="";
        this.packageName="";
        this.fcmApiKey="";
        this.enabled=true;
    }
}

 export enum BlobAssetType
{
        applicationIcon = 0,
        notificationImage=1,
        notificationSound=2,
        googleServicesJson=3
}
export class AssociatedTopic
{
    id:any
    topicName:string
    topicType: TopicType
    topicValue: string
}
