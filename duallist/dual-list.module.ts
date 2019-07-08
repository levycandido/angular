import {NgModule, ModuleWithProviders} from '@angular/core';
import {CommonModule} from '@angular/common';
import { DuallistPipe } from 'app/shared/pipes/duallist.pipe';
import { DragulaModule } from 'ng2-dragula/components/dragular.module';
import { RouterModule } from '@angular/router/src/router_module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TemplatesModule } from 'app/arquitetura/shared/templates/templates.module';
import { NgxPaginationModule } from 'ngx-pagination';
import { DualListComponent } from 'app/shared/components/duallist/dual-list.component';


@NgModule({
	imports: [CommonModule, DragulaModule, FormsModule],
		declarations: [
		DualListComponent,
		DuallistPipe
	],
	exports: [
		DualListComponent, DuallistPipe
	]
})
export class DualListModule {

}
