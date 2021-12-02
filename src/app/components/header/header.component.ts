import {Component, OnInit} from '@angular/core';
import {ICategoryResponse} from 'src/app/shared/interfaces/category/category.interface';
import {CategoryService} from 'src/app/shared/services/category/category.service';
import {SubcategoryService} from "../../shared/services/subcategory/subcategory.service";
import {ISubCategory} from "../../shared/interfaces/subcategory/subcategory.interface";
import { IProductResponse } from 'src/app/shared/interfaces/product/product.intarface';
import { OrderService } from 'src/app/shared/services/order/order.service';
import {user} from "@angular/fire/auth";
import { AuthService } from 'src/app/shared/services/auth/auth.service';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {

  public userCategories: ICategoryResponse[] = [];
  public userSubCategories: ISubCategory[] = [];
  public total = 0;
  public basket: IProductResponse[] = [];
  public isUserLogin = false;
  public isAdminLogin = false;


  constructor(
    private categoryService: CategoryService,
    private subcategoryService: SubcategoryService,
    private orderService: OrderService,
    private auth: AuthService,
    private router: Router,
    private activatedRoute: ActivatedRoute
  ) {
  }

  ngOnInit(): void {
    this.loadCategory();
    this.loadSubCategory();
    this.loadBasket();
    this.checkChangeBasket();
    this.getAuthData();
    this.checkLogin();
  }

  loadCategory(): void {
    this.categoryService.getAllFB().subscribe(data => {
        this.userCategories = data as ICategoryResponse[];
      }, err => {
        console.log('loadCategory error', err);
      }
    )
  }

  loadSubCategory(): void {
    this.subcategoryService.getAllFB().subscribe(data => {
        this.userSubCategories = data as ISubCategory[];
      }, err => {
        console.log('loadSubCategory error', err)
      }
    )
  }

  loadBasket(): void{
    if(localStorage.length > 0 && localStorage.getItem('basket')){
      this.basket = JSON.parse(localStorage.getItem('basket') as string)
    } else {
      this.basket = [];
    }
    this.setTotalPrice();
  }

  setTotalPrice(): void{
    if (this.basket.length === 0){
      this.total = 0;
    } else {
      this.total = this.basket
        .reduce((total, p) => total + p.price * p.count, 0);
    }
  }

  checkChangeBasket(): void{
    this.orderService.changeBasket.subscribe(() => {
      this.loadBasket();
    });
  }

  checkLogin(): void{
    this.auth.currentUser$.subscribe(() => {
      this.getAuthData();
    })
  }

  getAuthData(): void{
    if (localStorage.length > 0 && localStorage.getItem('user')){
      const user = JSON.parse(localStorage.getItem('user')as string);
      if (user && user.role === 'ADMIN'){
        this.isAdminLogin = true;
        this.isUserLogin = false;
      } else if(user && user.role === 'USER'){
        this.isAdminLogin = false;
        this.isUserLogin = true;
      } else {
        this.isAdminLogin = false;
        this.isUserLogin = false;
      }
    } else {
      this.isAdminLogin = false;
      this.isUserLogin = false;
    }
  }

}
