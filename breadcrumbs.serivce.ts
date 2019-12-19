import { Injectable } from '@angular/core';
import { Router, ActivationEnd,Event as RouterEvent } from '@angular/router';
import { filter, debounceTime, pluck, merge, } from 'rxjs/operators';
import { Subject, Observable,of,zip } from 'rxjs';

@Injectable()
export class BreadCrumbService {
    private breadCrumbURLArray = [];
    private breadCrumbLabelArray = [];
    private menuAction = new Subject<boolean>();
    private mergedStream = new Observable();
    public breadCrumbArray = new Subject<Array<Array<string>>>();
    constructor(private router: Router) { }

    /**
     * Emits an event notifying that one of the menu item has been clicked
     * @fires menu click event
     */

    public menuClicked(): void {
        /**
         * Menu click event
         *
         * @event Hurl#snowball
         * @type {Observable}
         * @property {boolean} isPacked - Indicates whether the snowball is tightly packed.
         */
        this.menuAction.next(true);
    }

    /**
     * Called when the application is loaded for the first time.
     * 
     * @listens menuAction event.
     * @listens router events.
     */
    public loadRouting(): void {

        this.mergedStream.pipe(merge(
            this.menuAction.asObservable(),
            this.router.events
                .pipe(
                    filter(event => event instanceof ActivationEnd), pluck('snapshot'),
                    // pluck('data'),
                    debounceTime(1000)   
                )))
            .subscribe((routerInfo) => {
            if (routerInfo === true) {
                this.clearData();
            } else {
                if (routerInfo['routeConfig']['path'] == 'home') {
                    this.clearData();
                    this.appendData(routerInfo['_routerState']['url'], routerInfo['data']['breadCrumbLabel'])
                } else {
                    const data = routerInfo['children'][0]['data']['breadCrumbLabel'];
                    const url = routerInfo['_routerState']['url'];
                    if (this.breadCrumbLabelArray.length != 0) {
                        if (routerInfo['children'][0]['data']['sibling']) {
                            this.clearData();
                            this.appendData(url,data);
                        } else if (this.breadCrumbLabelArray.includes(data)) {
                            const dataIndex = this.breadCrumbLabelArray.indexOf(data) + 1;
                            this.breadCrumbLabelArray.splice(dataIndex);
                            this.breadCrumbURLArray.splice(dataIndex);
                        } else {
                            this.appendData(url, data);
                        }
                    } else {
                        this.appendData(url, data);
                    }
                }
                this.breadCrumbArray.next([this.breadCrumbLabelArray,this.breadCrumbURLArray]);
            }
        });



    }
    /**
     * Appends the latest page node to the breadcrumb storage.
     * @param {string[]}
     */
    public appendData(...arg: Array<string>): void {
        this.breadCrumbURLArray.push(arg[0]);
        this.breadCrumbLabelArray.push(arg[1]);
    }
    /**
     * Clears the breadcrumb storage.
     */
    public clearData(): void {
        this.breadCrumbURLArray = [];
        this.breadCrumbLabelArray = [];
    }
    /**
     * Returns an array containing the bread crumb elements.
     * @returns {string[]} `Breadcrumb`
     */
    public getHistory(): string[] {
        return this.breadCrumbLabelArray;
    }

    ngOnDestroy() {
        this.menuAction.unsubscribe();
    }


} 



import { Resolve } from '@angular/router';
import 'rxjs/add/observable/of';
import 'rxjs/add/operator/delay';

@Injectable()
export class HnResolver implements Resolve<Observable<string>> {
  constructor() {}

  resolve() {
    return Observable.of('Hello Alligator!').delay(2000);
  }
}