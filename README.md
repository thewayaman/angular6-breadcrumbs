# angular6-breadcrumbs
A simple breadcrumb's implementation, to allow for dynamic page changes and handle menu option.


Define the the labels for individual components/pages in the app.routing.ts using the data property of Route and set the sibling flag as true if the page is a head node for subsequent child nodes and false if it is a child node or a terminal node.

	app.routing.module.ts

	Route:Routes = 
		[{
		    path: 'examplecomp1',
		    component: ExampleComponent,
		    data:{ breadCrumbLabel:"Example1", sibling:false}
		},
		{
		    path: 'examplecomp2',
		    loadChildren: './examplecomp2-create/examplecomp2.module#ExampleComponent2Module',
		    data:{ breadCrumbLabel:'Example2',sibling:true}
		},
		...,
		...,
		]
	imports: [
		  RouterModule.forRoot(Route),
		  ...,]


The loadRouting method in the breadcrumb service should be called when the application loads for the first time(i.e. preferably in the constructor of the AppModule Class) for example:-

	app.module.ts

	import { BreadCrumbService } from './shared/breadcrumbs/breadcrumbs.serivce';

	export class AppModule {
	  constructor(private breadCrumbService :BreadCrumbService){
	    breadCrumbService.loadRouting();
	  }
	 }

Import the breadcrumb service into a shared module, to make the <breadcrumb> directive usable in your component.

	shared.module.ts
  
	 import { BreadcrumbsComponent } from './breadcrumbs/breadcrumbs.component';

	 declarations: [...,
			BreadcrumbsComponent
			]
	 exports: [...,
		   BreadcrumbsComponent
		   ]

	export class SharedModule { }


Import this shared module in your component's routing module.

	Example.component.ts

	import { SharedModule } from '../shared/shared.module';

	Example.component.html

	<div class="col-md-6">
	  <app-breadcrumbs></app-breadcrumbs>
	 </div>

