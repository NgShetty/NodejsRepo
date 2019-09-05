export class ApplicationReport
{
    name: string;
    totalTopics: number;
    topicsCount : Array<number[]>;
    topicNames: Array<string>;
}

export class ActiveDevices
{
    applicationName: string;
    androidVersions: string[]
    iOSVersions: string[]
    androidDeviceCount: number[]
    androidTotalDeviceCount: number
    iOSDeviceCount: number[]
    iOSTotalDeviceCount: number
    totalDeviceCount: number

}

export class ApplicationTopics{
 applicationName : string
 applicationTotalTopicCount: number
 applicationTopics: string[];
 applicationTopicsCount: number[];
}

export class NotificationStatus
{
    title: string;
    totalSuccessfulNotificationsAndroid: number;
    totalFailedNotificationsAndroid: number;
    totalSuccessfulNotificationsPercentageAndroid: any;
    totalFailedNotificationsPercentageAndroid: any;
    totalSuccessfulNotificationsIOS: number;
    totalFailedNotificationsIOS: number;
    totalSuccessfulNotificationsPercentageIOS:any;
    totalFailedNotificationsPercentageIOS: any;
    totalSentNotifications: number;
    totalReceivedNotifications: number;
    totalSentNotificationsPercentage: any;
    totalReceivedNotificationsPercentage: any;
}

export class ReportRequestBody
    {
         tenantIds : string[]

         appentryIds : string[]

         platforms : string[]

         startDate : string

         endDate : string
    }