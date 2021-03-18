import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CategoryListPage } from './category-list';
import { SharedModule } from '../../shared.module';
import { FormsModule } from '@angular/forms';

@NgModule({
  declarations: [
    CategoryListPage,
  ],
  imports: [
    RouterModule.forChild([
      {
        path: '',
        component: CategoryListPage,
      }
    ]),
    SharedModule,
    FormsModule
  ],
})
export class CategoryListPageModule {}
