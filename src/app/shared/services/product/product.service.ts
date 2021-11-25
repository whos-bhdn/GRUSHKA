import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ICategoryResponse } from '../../interfaces/category/category.interface';
import {
  addDoc,
  collection,
  collectionData,
  deleteDoc,
  doc,
  DocumentData,
  DocumentReference,
  Firestore, getDocs, query, QuerySnapshot,
  setDoc, where
} from "@angular/fire/firestore";
import {IProductResponse} from "../../interfaces/product/product.intarface";
import {environment} from "../../../../environments/environment";



@Injectable({
  providedIn: 'root'
})

export class ProductService {


  constructor(private http: HttpClient,
              private firestore: Firestore,
              ) { }


  getAllFB(): Observable<DocumentData[]> {
    return collectionData(collection(this.firestore, "product"), {idField: "id"});
  }

  getByCategoryFB(categoryName: string): Promise<QuerySnapshot<DocumentData>> {
    const q = query(collection(this.firestore, "product"), where("category.path", "==", categoryName));
    return getDocs(q);
  }

  getBySubcategoryFB(subcategoryName: string): Promise<QuerySnapshot<DocumentData>> {
    const s = query(collection(this.firestore, "product"), where("subcategory.path", "==", subcategoryName));
    return getDocs(s)
  }

  createFB(product: IProductResponse): Promise<DocumentReference<DocumentData>> {
    return addDoc(collection(this.firestore, "product"), product);
  }

  updateFB(product: IProductResponse, id: string): Promise<void> {
    return setDoc(doc(this.firestore, "product", id), product);
  }

  deleteFB(id: string): Promise<void> {
    return deleteDoc(doc(this.firestore, "product", id));
  }


}
