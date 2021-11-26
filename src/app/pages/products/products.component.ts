import {Component, OnDestroy, OnInit} from '@angular/core';
import {ICategoryResponse} from 'src/app/shared/interfaces/category/category.interface';
import {IProductRequest, IProductResponse} from 'src/app/shared/interfaces/product/product.intarface';
import {ProductService} from 'src/app/shared/services/product/product.service';
import {CategoryService} from "../../shared/services/category/category.service";
import {Subscription} from 'rxjs';
import {ActivatedRoute, Router, NavigationEnd} from "@angular/router";
import {OrderService} from "../../shared/services/order/order.service";
import {ToastrService} from "ngx-toastr"

@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.scss']
})
export class ProductsComponent implements OnInit, OnDestroy {

  public userCategories: ICategoryResponse[] = [];
  public userProducts: IProductResponse[] = [];
  public eventsSubscriptions!: Subscription;
  public newSortArr: IProductResponse[] = [];
  public sortBySub: IProductResponse[] = [];
  public currentCategoryName!: string;
  public currentSubCategoryName!: string;
  public header!: string;



  constructor(
    private productService: ProductService,
    private categoryService: CategoryService,
    private router: Router,
    private orderService: OrderService,
    private toastr: ToastrService,
    private activatedRoute: ActivatedRoute) {
    this.eventsSubscriptions = this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        const categoryName = this.activatedRoute.snapshot.paramMap.get('category');
        this.loadProducts(categoryName as string)
      }
    })
  }


  ngOnInit(): void {
  }

  ngOnDestroy(): void {
    this.eventsSubscriptions.unsubscribe();
  }


  loadProducts(name: string): void {
    //*----- Метод з лапєцу
    // this.productService.getByCategoryFB(name).then(data => {
    //   this.newSortArr = [];
    //   data.forEach((doc) => {
    //     // console.log(doc.id, " => ", doc.data());
    //     const product: IProductResponse = { id: doc.id, ...doc.data() as IProductRequest};
    //     this.newSortArr.push(product);
    //   });
    //   this.currentCategoryName = this.newSortArr[0].category.name;
    // }).catch(err => {
    //   console.log('load products error', err)
    // })
  // *---- Метод який я писав сам
    this.productService.getAllFB().subscribe(data => {
        this.userProducts = data as IProductResponse[];
        this.newSortArr = [];
        this.userProducts.forEach(e => {
          if (e.category.path === name || e.subcategory?.path === name) {
            this.newSortArr.push(e)
            if (e.subcategory != null && e.subcategory.path === name){
              this.header = e.subcategory.path;
            } else {
              this.header = e.category.path;
            }
          };
        })
      }, err => {
        console.log('loadProducts error', err);
      }
    )
  }


  changeCount(product: IProductResponse, status: boolean): void {
    if (status){
      ++product.count
    }
    else if(!status && product.count>1){
      --product.count
    }
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
    this.toastr.success('Successfully added product to basket')
  }



}
