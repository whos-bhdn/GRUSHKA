import { Component, OnInit } from '@angular/core';
import { CategoryService } from 'src/app/shared/services/category/category.service';
import { ProductService } from 'src/app/shared/services/product/product.service';
import { SubcategoryService } from 'src/app/shared/services/subcategory/subcategory.service';
import {IProductResponse} from "../../shared/interfaces/product/product.intarface";
import { ToastrService } from "ngx-toastr";
import { OrderService } from "../../shared/services/order/order.service";

@Component({
  selector: 'app-products-details',
  templateUrl: './products-details.component.html',
  styleUrls: ['./products-details.component.scss']
})
export class ProductsDetailsComponent implements OnInit {

  public userProducts: IProductResponse[] = [];
  public header!: string;
  public name!: string;

  constructor(
    private categoryService: CategoryService,
    private subcategoryService: SubcategoryService,
    private productService: ProductService,
    private toastr: ToastrService,
    private orderService: OrderService,
  ) {  }

  ngOnInit(): void {
    this.loadProducts()
  }

  loadProducts(): void {
      this.productService.getAllFB().subscribe(data => {
        this.userProducts = data as IProductResponse[];
        // this.userProducts.forEach(e => {
        //   if (e.subcategory != null && e.subcategory.path === name){
        //     this.header = e.subcategory.path;
        //   } else {
        //     this.header = e.category.path;
        //   }
        // })
      }, err => {
        console.log('load product error')
      })
  }

  addToBasket(product: IProductResponse): void {
    let basket: IProductResponse[] = [];
    if (localStorage.length > 0 && localStorage.getItem('basket')){
      basket = JSON.parse(localStorage.getItem('basket') as string);
      if (basket.some(p => p.id === product.id)){
        const index = basket.findIndex(p => p.id === product.id);
        basket[index].count += product.count;
      }
      else {
        basket.push(product);
      }
    }
    else {
      basket.push(product);
    }
    localStorage.setItem('basket', JSON.stringify(basket));
    product.count = 1;
    this.orderService.changeBasket.next(true);
    this.toastr.success('Product successfully added to basket');
  }

}
