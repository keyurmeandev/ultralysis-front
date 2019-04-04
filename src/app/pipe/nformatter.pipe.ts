import { Pipe, PipeTransform } from '@angular/core';
import { formatNumber, toString } from '@progress/kendo-angular-intl';

@Pipe({
  name: 'nformatter'
})
export class NformatterPipe implements PipeTransform {
	transform(num: any, decimal: any): any {
		
		if (typeof (decimal) === 'undefined')
			decimal = 0;

	    var isNegative = false;
	    var formattedNumber;
	    if (num < 0) {
	        isNegative = true;
	    }
	    num = Math.abs(num);
	    if (num >= 1000000) {
	        formattedNumber = (num / 1000000).toFixed(2).replace(/\.0$/, '') + 'm';
	    } else {
	        if (decimal) {

	        	if (decimal == -1)
	        		formattedNumber = num;
	        	else {
	            	formattedNumber = num.toFixed(decimal).replace(/./g, function(c, i, a) {
	                	return c;
	            	});
	            }
	        }
	        else {
	            formattedNumber = num.toFixed(0).replace(/./g, function(c, i, a) {
	                return i && c !== "." && ((a.length - i) % 3 === 0) ? ',' + c : c;
	            });
	        }
	    }
	    if (isNegative) {
	        formattedNumber = '-' + formattedNumber;
	    }
	    return formattedNumber;
	}
}
