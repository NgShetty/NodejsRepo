import { AssociatedTopic } from './createApplication';

export class ApplicationListItem {
    id: any;
    name: string;
    imagePath: any=[];
    readers: number;
    owners: number;
    registeredAndroidDevices: number;
    registerediOSDevices: number;
    createdDate: Date;
    topics:  Array<AssociatedTopic>= [];
    status: boolean;
    notificationSoundsFilePath: any = [];
    notificationImagesFilePath: any = [];
    constructor()
    {
        this.notificationImagesFilePath = [];
        this.notificationSoundsFilePath = [];
    }
}