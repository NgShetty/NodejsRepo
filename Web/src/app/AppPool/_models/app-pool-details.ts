import { TenantAllocated } from 'src/app/Tenant/_models/tenant-details';

// export class AppPoolDTO
// {
//  Id: any;
//  Name  : string;
//  Capacity : number;
//  AllocatedSpaces : number;
//  Available : number;
//  IsActive : boolean;
//  CreatedDate: Date;
//  CurrentTenantQuota : number;
//  Tenants:Array<TenantAllocated>
// }

export class AppPoolAdd {
    name: string
    capacity: number
    allocatedSpaces: number
    available: number
    isActive: boolean
    createdDate: Date
}
export class AppPoolEdit extends AppPoolAdd {
    id: any;
}
export class AppPoolDetails extends AppPoolEdit {
    tenants: Array<TenantAllocated>
}

export class AppPoolListItem extends AppPoolEdit {
    currentTenantQuota: number
    currentTenantQuotaTemp : number
    constructor()
    {
        super();
        this.currentTenantQuota=0;
        this.currentTenantQuotaTemp=0;
    }
}


