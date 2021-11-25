import { Component, OnInit } from '@angular/core';
import { CategoryService } from 'src/app/shared/services/category/category.service';
import { ProductService } from 'src/app/shared/services/product/product.service';
import { SubcategoryService } from 'src/app/shared/services/subcategory/subcategory.service';
import {IProductResponse} from "../../shared/interfaces/product/product.intarface";

@Component({
  selector: 'app-products-details',
  templateUrl: './products-details.component.html',
  styleUrls: ['./products-details.component.scss']
})
export class ProductsDetailsComponent implements OnInit {

  public userProducts: IProductResponse[] = [];

  constructor(private categoryService: CategoryService, private subcategoryService: SubcategoryService, private productService: ProductService) {  }

  ngOnInit(): void {
    this.loadProducts();
  }

  loadProducts(): void {
      this.productService.getAllFB().subscribe(data => {
        this.userProducts = data as IProductResponse[];
      }, err => {
        console.log('load product error')
      })
  }

}
