import { Pipe, PipeTransform } from '@angular/core';
@Pipe({
	name: 'splitText'
})

export class SplitTextPipe implements PipeTransform {
	transform(value: any, args?: any): any {
		/*if(args != undefined)
			return value.split(args)[0];*/
		return value.split("__")[1];
	}
}
