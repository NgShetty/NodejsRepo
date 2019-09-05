import { ApplicationListItem } from 'src/app/Application/_models/applicationList';


export class UserDTO {
    name: string;
    email: string;
    role: Array<Role>;
    applicationList: Array<ApplicationListItem>;
    tenantList: Array<TenantListItem>;
    status: boolean;
    constructor() {
        this.applicationList = [];
        this.role = [];
    }
}


export class Role {
    roleID: number;
    roleName: string;
}


export class TenantListItem {
    id: any;
    name: string;
    applicationList: Array<ApplicationListItem>;
    constructor() {
        this.applicationList = [];
    }
}

export class AdminUser {
    id: any;
    userId: string;
    userName: string
    imageUrl:string;
    // isActive: boolean;
    roleType: TenantRoleType;
}

export enum Roles {
    SystemAdmin = 0,
    SystemReader,
    TenantOwner,
    TenantReader,
    AppOwner,
    AppNotificationOwner,
    AppReader

}


// export class UserListItem
// {
//     userId: string;
//     userName: string;
//     imageUrl: string;
//     // applicationList: Array<ApplicationListItem>;
//     // tenantList: Array<TenantListItem>;
// }

export class User {
    userId: string;
    userName: string;
    imageUrl: string;
    // status: string;
    // createdDate: Date;
}

export class UserListItem extends User {
    tenantSpaceNames: Array<TenantObject>;
    tenantApplicationList: Array<TenantApplicationList>;
}

export class TenantApplicationList {
    tenantObject: TenantObject
    ApplicationObjs: Array<ApplicationObject>
}

export class TenantObject {
    tenantId: any
    tenantName: string
}

export class ApplicationObject {
    applicationId: any

    applicationName: string
}


export class SystemUser extends User {

}
export class TenantUser extends User {
    // tenantId: any
}
export class AppUser extends TenantUser {
    tenantId: any
    appId: any
    roleType:ApplicationRoleType
}

export enum TenantRoleType
    {
        tenantOwner = 0,
        tenantReader
    }
    export enum SystemRoleType
    {
        systemAdmin=0,
        systemReader
    }
    export enum ApplicationRoleType
    {
        applicationOwner = 0,
        applicationReader,
        applicationNotificationOwner
    }