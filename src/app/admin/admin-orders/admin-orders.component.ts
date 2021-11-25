import { Component, OnInit } from '@angular/core';
import { IOrderResponse } from 'src/app/shared/interfaces/order/order.interface';
import {OrderService} from "../../shared/services/order/order.service";
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-admin-orders',
  templateUrl: './admin-orders.component.html',
  styleUrls: ['./admin-orders.component.scss']
})
export class AdminOrdersComponent implements OnInit {
  public orderForm!: FormGroup;
  public adminOrders: Array<IOrderResponse> = [];
  public currentOrderID!: number | string;
  public  editStatus = false;
  // public status: Array<string> = this.adminOrders.status;


  constructor(
    private orderService: OrderService,
    private fb: FormBuilder,
    private toastr: ToastrService,
  ) { }

  ngOnInit(): void {
    this.loadOrders();
    this.initOrderForm();
  }


  loadOrders(): void {
    this.orderService.getAllFB().subscribe(data => {
      this.adminOrders = data as IOrderResponse[];
      // console.log(this.adminOrders)
    }, err => {
      console.log('load orders err', err);
    })
  }

  initOrderForm(): void {
    this.orderForm = this.fb.group({
      name: [null,Validators.required],
      price: [null,Validators.required],
      status: [null, Validators.required]
    })
  }

  deleteOrder(order: IOrderResponse): void {
    this.orderService.deleteFB(order).then(() => {
      this.loadOrders();
    }).catch(err => {
      console.log('delete order error', err);
    });
  }

  editOrder(order: IOrderResponse): void {
    this.orderService.updateFB(order, order.id as string).then(() => {

      this.loadOrders();
      this.toastr.success(`успішно зміненно`);

    }).catch(err => {
      this.toastr.error(err.message);
    })
  }

}
