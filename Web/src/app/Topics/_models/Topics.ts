export class AddTopic {
    topicName: string;
    topicDescription: string;
    associatedAppId: any;
    topicStatus: boolean;
    topicType: TopicType;
    topicValue: string;
}

export enum TopicType {
    default = 0,
    version = 1,
    securityGroup = 2,
    customTopic = 3,
    user=4
}

export class EditTopic extends AddTopic {
    id: any;
}

export class TopicListItem extends EditTopic {
    associatedApplication: AssociatedApplication;
    topicTypeDisplayText: string;
    modifiedDate: Date;
    createdDate: Date;
}

export class AssociatedApplication {
    application: any;
    name: string;
}

