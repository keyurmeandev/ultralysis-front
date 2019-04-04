import { Injectable } from '@angular/core';
import * as _ from 'underscore';
import * as _lodash from 'lodash';

@Injectable()
export class HelperService {

    constructor() {}

    findWhere(list, properties) {
        return _.findWhere(list, properties);
    }

    where(list, properties) {
        return _.where(list, properties);
    }
    
    clone(list) {
        return _lodash.cloneDeep(list);
    }

    arrayContainsString(list, filterKey, searchText) {
        return _.filter(list, function(item){ 
            if (filterKey != undefined && filterKey != "")
                return item[filterKey].toLowerCase().includes(searchText.toLowerCase());
            else
                return item.toLowerCase().includes(searchText.toLowerCase());
        });
    }

    filterByKey(list, filterKey) {
        return _.filter(list, function(item){ 
            return item[filterKey];
        });
    }

    getRandomData() {
        var d = new Date();
        var randomData = d.getFullYear().toString() + d.getMonth().toString() + d.getDay().toString() + d.getHours().toString() + d.getMinutes().toString() + d.getSeconds().toString();
        return randomData;
    }

    merge(target, source) {
        return _lodash.merge(target,source);
    }

    order(collection, identity, sort_by) {
        return _lodash.orderBy(collection, identity, sort_by);
    }

    hasKey(list, key) {
        return _.has(list, key);
    }

    filter(collection, identity) {
        return _.filter(collection, identity);
    }

    find(collection, identity) {
        return _.find(collection, identity);
    }

    findIndex(collection, key) {
        _.findIndex(collection, key);
    }

    sortBy(list, iteratee) {
        return _.sortBy(list, iteratee);
    }

    max(list, iterate) {
        return _.max(list, iterate);
    }

    min(list, iterate) {
        return _.min(list, iterate);
    }

}
