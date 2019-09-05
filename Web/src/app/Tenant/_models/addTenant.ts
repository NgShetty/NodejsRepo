import { AppPoolListItem } from 'src/app/AppPool/_models/app-pool-details';
import { Observable } from 'rxjs/internal/Observable';
import { AdminUser } from 'src/app/Users/_models/user';

export class AddTenant {
    name: string;
    appPoolsAllocated: Array<AppPoolListItem>;
    constructor() {
        this.appPoolsAllocated = new Array<AppPoolListItem>();
        this.teamMembers = new Array<AdminUser>();
    }
    teamMembers:Array<AdminUser>;
}
