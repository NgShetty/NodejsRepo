import { Pipe, PipeTransform } from '@angular/core';

@Pipe({name: 'groupBy'})
export class GroupByPipe implements PipeTransform {
    transform(collection: any[], property: string): any[] {
        // prevents the application from breaking if the array of objects doesn't exist yet
        if(!collection) {
            return null;
        }

        const groupedCollection = collection.reduce((previous, current)=> {
            var collectionKey = "";

            if(current[property]=="2")
            collectionKey="Groups";
            else if(current[property]=="3")
            collectionKey="Topics";
            else if(current[property]=="1")
            collectionKey="Versions";
            else if(current[property]=="4")
            collectionKey="Users";

            if(!previous[collectionKey]) {
                previous[collectionKey] = [current];
            } else {
                previous[collectionKey].push(current);
            }

            return previous;
        }, {});

        // this will return an array of objects, each object containing a group of objects
        return Object.keys(groupedCollection).map(key => ({ key, value: groupedCollection[key] }));
    }
}