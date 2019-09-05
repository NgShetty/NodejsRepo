import { ApplicationDTO } from './createApplication';
import { AdminUser } from 'src/app/Users/_models/user';

export class EditApplicationDTO extends ApplicationDTO{
    id:any=null;   
    isAndroidConfigChanged:boolean;
    isIosConfigChanged:boolean;
    isMediaChanged:boolean;
    isAppMetadataChanged:boolean;
    constructor(){
        super();
        this.isAndroidConfigChanged=false;
        this.isIosConfigChanged=false;
        this.isMediaChanged=false;
        this.isAppMetadataChanged=false;
    }
}

export class ApplicationDetails extends EditApplicationDTO
{
    teamMembers: AdminUser[]
}
