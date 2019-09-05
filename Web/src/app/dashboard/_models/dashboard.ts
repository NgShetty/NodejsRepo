export class NotificationStatus{
    title: string;
    totalSuccessfulNotificationsAndroid:number
    totalFailedNotificationsAndroid:number
    totalSuccessfulNotificationsPercentageAndroid:any
    totalFailedNotificationsPercentageAndroid:any
    totalSuccessfulNotificationsIOS:number
    totalFailedNotificationsIOS:number
    totalSuccessfulNotificationsPercentageIOS:any
    totalFailedNotificationsPercentageIOS:any
    totalSuccessfulNotifications:number
    totalFailedNotifications:number
    totalSuccessfulNotificationsPercentage:any
    totalFailedNotificationsPercentage:any;

    androidTotalDeviceCount: number
    iosTotalDeviceCount: number
    totalDeviceCount: number

    androidTotalUserCount: number
    iosTotalUserCount: number
    totalUserCount: number
}
export class DeviceStatus{
    androidTotalDeviceCount: number
    iosTotalDeviceCount: number
    totalDeviceCount: number    
}
export class UserStatus{
    androidTotalUserCount: number
    iosTotalUserCount: number
    totalUserCount: number
    
}
export class ReportRequestBody{
    tenantIds:any;
    appentryIds:any;
    platforms:any;
    startDate:Date;
    endDate:Date;
}