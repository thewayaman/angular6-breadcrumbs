import { Component, OnInit, OnDestroy, HostListener} from '@angular/core';
import { startWith, filter, pairwise, map, subscribeOn } from 'rxjs/operators';
import { Subscription } from 'rxjs';
import { BreadCrumbService } from './breadcrumbs.serivce';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-breadcrumbs',
  templateUrl: './breadcrumbs.component.html',
  styleUrls: ['./breadcrumbs.component.scss']
})
export class BreadcrumbsComponent implements OnInit, OnDestroy {

private breadCrumbsLabelArray: Array<string>;
private breadCrumbsURLArray: Array<string>;
private breadCrumbsArray$: Subscription;
private saveURL:string;
  location: any;
  constructor(private breadCrumbsService:BreadCrumbService,private router: Router,private activatedRoute:ActivatedRoute ) { }

    ngOnInit() {
      this.breadCrumbsArray$ = this.breadCrumbsService.breadCrumbArray.subscribe((element)=>{
        this.breadCrumbsLabelArray = element[0];
        this.breadCrumbsURLArray = element[1];
      });
    }

    @HostListener('window:unload')
    doSomething() {
      // Should be used to store breadcrumbs in local storage to prevent loss of data.
    }
    ngOnDestroy(){
      this.breadCrumbsArray$.unsubscribe();
    }

    /**
     * Function that takes the user back to the page on which the user has clicked in the breadcrumb.
     * @param `index` the position of the page within the breadcrumb to which the user needs to traverse.
     */
    private goBack(index: number): void {
      this.saveURL = this.breadCrumbsURLArray[index]
      this.router.navigateByUrl(this.breadCrumbsURLArray[index]);
    }

} 



