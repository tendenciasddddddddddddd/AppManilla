import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TabsPage } from './tabs.page';
import { AuthGuard } from '../services/guards/auth.guard';

const routes: Routes = [
  {
    path: '1',
    component: TabsPage,
    children: [
      {
        path: 'home',
        children: [
          {
            path: '',
            loadChildren: () => import('../pages/home/home.module').then(m => m.HomePageModule)
          },
          {
            path: 'search',
            loadChildren: () => import('../pages/search/search.module').then(m => m.SearchPageModule)
          },
          {
            path: 'search/:term',
            loadChildren: () => import('../pages/search/search.module').then(m => m.SearchPageModule)
          },
          {
            path: 'items',
            loadChildren: () => import('../pages/item-list/item-list.module').then(m => m.ItemListPageModule)
          },
       
          {
            path: 'categories',
            loadChildren: () => import('../pages/category-list/category-list.module').then(m => m.CategoryListPageModule)
          },
      
          {
            path: 'items/:id',
            loadChildren: () => import('../pages/item/item.module').then(m => m.ItemPageModule)
          },
     
          {
            path: 'items/:itemId/:slug',
            loadChildren: () => import('../pages/item/item.module').then(m => m.ItemPageModule)
          },
    
        ]
      },
      {
        path: 'browse',
        children: [
          {
            path: '',
            loadChildren: () => import('../pages/category-list/category-list.module').then(m => m.CategoryListPageModule)
          },
     
          {
            path: 'items',
            loadChildren: () => import('../pages/item-list/item-list.module').then(m => m.ItemListPageModule)
          },
          {
            path: 'items/:itemId/:slug',
            loadChildren: () => import('../pages/item/item.module').then(m => m.ItemPageModule)
          },
     
    
        ]
      },
      {
        path: 'cart',
        children: [
          {
            path: '',
            loadChildren: () => import('../pages/cart-page/cart-page.module').then(m => m.CartPageModule)
          },
          {
            path: 'items/:itemId/:slug',
            loadChildren: () => import('../pages/item/item.module').then(m => m.ItemPageModule)
          },
    
          {
            path: 'checkout',
            loadChildren: () => import('../pages/checkout-page/checkout-page.module').then(m => m.CheckoutPageModule)
          },
    
        ]
      },
      {
        path: 'account',
        children: [
          {
            path: '',
            loadChildren: () => import('../pages/profile-page/profile-page.module').then(m => m.ProfilePageModule)
          },
          {
            path: 'payment',
            canActivate: [AuthGuard],
            loadChildren: () => import('../pages/card-list/card-list.module').then(m => m.CardListPageModule)
          },
          {
            path: 'addresses',
            loadChildren: () => import('../pages/address-list/address-list.module').then(m => m.AddressListPageModule)
          },
          {
            path: 'help',
            loadChildren: () => import('../pages/about/about.module').then(m => m.AboutPageModule)
          },
          {
            path: 'favorites',
            canActivate: [AuthGuard],
            loadChildren: () => import('../pages/favorite/favorite.module').then(m => m.FavoritePageModule)
          },
          {
            path: 'favorites/:itemId/:slug',
            canActivate: [AuthGuard],
            loadChildren: () => import('../pages/item/item.module').then(m => m.ItemPageModule)
          },
    
          {
            path: 'orders',
            canActivate: [AuthGuard],
            loadChildren: () => import('../pages/order-list-page/order-list-page.module').then(m => m.OrderListPageModule)
          },
         
          {
            path: 'pages/:id/:slug',
            loadChildren: () => import('../pages/page/page.module').then(m => m.PageViewModule)
          }
        ]
      },
      {
        path: '',
        redirectTo: '/1/home',
        pathMatch: 'full'
      }
    ]
  },
  {
    path: '',
    redirectTo: '/1/home',
    pathMatch: 'full'
  }
];

@NgModule({
  imports: [
    RouterModule.forChild(routes)
  ],
  exports: [RouterModule]
})
export class TabsPageRoutingModule {}
