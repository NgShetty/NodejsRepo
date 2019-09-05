import { EditTenant } from './editTenant';

export class TenantListItem extends EditTenant{
    createdDate: Date;
    spaceAllocated:number;
    spaceUtilized:number;
    spaceAvailable:number;
    assignedAppPoolDisplayText: string;
}
