import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import { OrderService } from 'src/app/shared/services/order/order.service';
import {IProductResponse} from "../../shared/interfaces/product/product.intarface";
import {User} from "../../shared/interfaces/user/user.iterface";
import {ToastrService} from "ngx-toastr"

@Component({
  selector: 'app-basket',
  templateUrl: './basket.component.html',
  styleUrls: ['./basket.component.scss']
})
export class BasketComponent implements OnInit {


  public basket: Array<IProductResponse> = [];
  public user!: User;
  public total: number = 0;
  public orderForm!: FormGroup;

  constructor(
    private orderService: OrderService,
    private fb: FormBuilder,
    private toastr: ToastrService
  ) { }

  ngOnInit(): void {
    this.loadUserInfo();
    this.initOrderForm();
    this.loadBasket();
  }

  initOrderForm(): void {
    this.orderForm = this.fb.group({
      firstName: [this.user?.firstname, Validators.required],
      lastName: [this.user?.lastname, Validators.required],
      phoneNumber: [this.user?.phoneNumber, Validators.required],
      address: [this.user?.address, Validators.required],
      payment: ['card', Validators.required],
    })
  }

  changeCount(product: IProductResponse, status: boolean): void {
    if (status){
      ++product.count
    }
    else if(!status && product.count>1){
      --product.count
    }
    localStorage.setItem('basket', JSON.stringify(this.basket));
    this.orderService.changeBasket.next(true);
  }

  loadBasket(): void{
    if(localStorage.length > 0 && localStorage.getItem('basket')){
      this.basket = JSON.parse(localStorage.getItem('basket') as string)
    } else {
      this.basket = [];
    }
    this.setTotalPrice();
  }

  loadUserInfo():void {
    if (localStorage.length > 0 && localStorage.getItem('user')) {
      this.user = JSON.parse(localStorage.getItem('user') as string)
    } else {
      localStorage.removeItem('user');
    }
  }

  setTotalPrice(): void{
    if (this.basket.length === 0){
      this.total = 0;
    } else {
      this.total = this.basket
        .reduce((total, p) => total + p.price * p.count, 0);
    }
  }

  deleteProduct(product: IProductResponse): void{
    if (confirm("Are you sure you want to delete this?")){
      const index = this.basket.findIndex(p => p.id === product.id);
      this.basket.splice(index, 1);
      localStorage.setItem('basket', JSON.stringify(this.basket));
      this.orderService.changeBasket.next(true)
      this.toastr.error("Product is deleted successfully");
    }
  }

  changePayment(element: HTMLInputElement): void{
    this.orderForm.patchValue({
      payment: element.value
    })
  }

  confirmOrder(): void{
    const order = {
      ...this.orderForm.value,
      basket: this.basket,
      price: this.total,
      selected: 'PENDING',
      status: ["PENDING", "SENDED", "DELIVERED"],
    }
    this.orderService.createFB(order).then(() => {
      localStorage.removeItem('basket');
      this.orderService.changeBasket.next(false);
      this.loadBasket()
    }).catch(err => {
      console.log('create order err', err);
    });
  }

}
