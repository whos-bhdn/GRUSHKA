import {Injectable} from '@angular/core';
import {Observable, Subject} from "rxjs";
import {
  addDoc,
  collection,
  collectionData, deleteDoc,
  doc,
  DocumentData,
  DocumentReference, Firestore,
  setDoc
} from "@angular/fire/firestore";
import {IProductResponse} from "../../interfaces/product/product.intarface";
import {HttpClient} from "@angular/common/http";
import {IOrderResponse} from "../../interfaces/order/order.interface";

@Injectable({
  providedIn: 'root'
})
export class OrderService {

  changeBasket = new Subject<boolean>();


  constructor(
    private http: HttpClient,
    private firestore: Firestore,
  ) {
  }

  getAllFB(): Observable<DocumentData[]> {
    return collectionData(collection(this.firestore, "orders"),{idField: "id"});
  }

  createFB(order: IOrderResponse): Promise<DocumentReference<DocumentData>> {
    return addDoc(collection(this.firestore, "orders"), order);
  }

  deleteFB(order: IOrderResponse): Promise<void> {
    return deleteDoc(doc(this.firestore, "orders", order.id as string));
  }

  updateFB(order: IOrderResponse, id: string): Promise<void> {
    return setDoc(doc(this.firestore, "orders", order.id as string), order);
  }

}
