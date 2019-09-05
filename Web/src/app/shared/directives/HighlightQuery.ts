import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'highlightQuery',
    pure: false
})
export class HighlightQuery implements PipeTransform {
    transform(value: string, query: string) {
        if (value != undefined && value != "" && value != null && query != undefined && query != "" && query != null)
            return value.toLocaleLowerCase().replace(query.toLocaleLowerCase(), `<strong style="color:#00A3E0">${query.toLocaleLowerCase()}</strong>`)
        else {
            return value;
        }
    }
}