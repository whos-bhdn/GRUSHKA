import {Component, OnInit} from '@angular/core';
import {IProductResponse} from "../../shared/interfaces/product/product.intarface";
import {AngularFirestore} from "@angular/fire/compat/firestore";
import {ProductService} from "src/app/shared/services/product/product.service";
import {ICategoryResponse} from "../../shared/interfaces/category/category.interface";
import {CategoryService} from "../../shared/services/category/category.service";
import {ActivatedRoute, NavigationEnd, Router} from "@angular/router";
import {Subscription} from "rxjs";
import {OrderService} from "../../shared/services/order/order.service";
import {ToastrModule, ToastrService} from 'ngx-toastr';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  public userProducts: IProductResponse[] = [];
  public userCategories: ICategoryResponse[] = [];
  public eventsSubscriptions!: Subscription;
  public newSortArr: IProductResponse[] = [];
  public categoryName!: string;
  public userProduct!: IProductResponse;
  public accessoriesArr: IProductResponse[] = [];
  public smartphonesArr: IProductResponse[] = [];
  public computersArr: IProductResponse[] = [];
  public audioArr: IProductResponse[] = [];
  public tabletsArr: IProductResponse[] = [];
  public btname: IProductResponse[] = [];
  public uid!: string;


  constructor(
    private productService: ProductService,
    private categoryService: CategoryService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private orderService: OrderService,
    private toastr: ToastrService
  ) {
  }

  ngOnInit(): void {
    this.loadProducts();
    this.loadCategory();
  }

  loadProducts(): void {
    this.productService.getAllFB().subscribe(data => {

        this.userProducts = data as IProductResponse[];
        this.btname = this.userProducts.filter(e => e.category.name === 'Accessories')

        // console.log(data)

        this.newSortArr = [];
        this.userProducts.forEach(e => {

          // if (e.name === `Poco F3`) this.uid = e.id;
          if (e.category.path === 'audio') {
            this.audioArr.push(e);
          } else if (e.category.path === 'accessories') {
            this.accessoriesArr.push(e);
          } else if (e.category.path === 'smartphones') {
            this.smartphonesArr.push(e)
          } else if (e.category.path === 'computers') {
            this.computersArr.push(e)
          } else if (e.category.path === 'tablets') {
            this.tabletsArr.push(e)
          }
        })
      }, err => {
        console.log('loadProducts error', err);
      }
    )
  }


  loadCategory(): void {
    this.categoryService.getAllFB().subscribe(data => {
        this.userCategories = data as ICategoryResponse[];
      }, err => {
        console.log('loadCategory error', err);
      }
    )
  }

  addToBasket(product: IProductResponse): void {
    let basket: IProductResponse[] = [];
    if (localStorage.length > 0 && localStorage.getItem('basket')) {
      basket = JSON.parse(localStorage.getItem('basket') as string);
      if (basket.some(p => p.id === product.id)) {
        const index = basket.findIndex(p => p.id === product.id);
        basket[index].count += product.count;
      } else {
        basket.push(product);
      }
    } else {
      basket.push(product);
    }
    localStorage.setItem('basket', JSON.stringify(basket));
    product.count = 1;
    this.orderService.changeBasket.next(true);
    this.toastr.success('Product successfully added to basket');
  }

  add(a: string): void {
    this.btname = []
    console.log(this.btname)
    this.btname = this.userProducts.filter(e => e.category.name === a)
  }

}
