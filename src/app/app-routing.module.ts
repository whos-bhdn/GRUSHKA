import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { HomeComponent } from './pages/home/home.component';
import { ProductsComponent } from './pages/products/products.component';
import { BasketComponent } from './pages/basket/basket.component';
import { ProductsDetailsComponent } from './pages/products-details/products-details.component';
import { AdminComponent } from './admin/admin.component';
import { AdminCategoryComponent } from './admin/admin-category/admin-category.component';
import { AdminProductsComponent } from './admin/admin-products/admin-products.component';
import { AdminOrdersComponent } from './admin/admin-orders/admin-orders.component';
import {PaymentComponent} from "./pages/payment/payment.component";
import {ContactsComponent} from "./pages/contacts/contacts.component";
import {AdminSubcategoryComponent} from "./admin/admin-subcategory/admin-subcategory/admin-subcategory.component";
import {LoginComponent} from "./pages/login/login.component";
import {AuthGuard} from "./shared/guards/auth/auth.guard";
import { ProfileComponent } from './pages/profile/profile.component';
import {ProfileGuard} from "./shared/guards/profile/profile.guard";



const routes: Routes = [
  { path: "", component: HomeComponent },
  { path: "menu/:category", component: ProductsComponent},
  { path: "menu/:category/:name", component: ProductsDetailsComponent },
  { path: "basket", component: BasketComponent },
  { path: "payment", component: PaymentComponent},
  { path: "contacts", component: ContactsComponent },
  { path: "login", component: LoginComponent },
  { path: "profile", component: ProfileComponent, canActivate: [ProfileGuard] },
  { path: "admin", component: AdminComponent, canActivate: [AuthGuard], children: [
      { path: "admin-category", component: AdminCategoryComponent },
      { path: "admin-subcategory", component: AdminSubcategoryComponent },
      { path: "admin-products", component: AdminProductsComponent },
      { path: "admin-orders", component: AdminOrdersComponent },
    ]  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {

}
