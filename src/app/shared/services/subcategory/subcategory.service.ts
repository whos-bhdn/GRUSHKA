import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ISubCategory } from '../../interfaces/subcategory/subcategory.interface';
import {
  addDoc,
  collection,
  collectionData,
  deleteDoc,
  doc,
  DocumentData,
  DocumentReference,
  Firestore,
  setDoc
} from "@angular/fire/firestore";

@Injectable({
  providedIn: 'root'
})
export class SubcategoryService {


  constructor(private http: HttpClient, private firestore: Firestore) {  }

  getAllFB(): Observable<DocumentData[]> {
    return collectionData(collection(this.firestore, 'subcategory'), {
      idField: 'id'} );
  }

  createFB(subcategory: ISubCategory): Promise<DocumentReference<DocumentData>> {
    return addDoc(collection(this.firestore, "subcategory"), subcategory);
  }

  updateFB(subcategory: ISubCategory, id: string): Promise<void> {
    return setDoc(doc(this.firestore, "subcategory", id), subcategory);
  }

  deleteFB(id: string): Promise<void> {
    return deleteDoc(doc(this.firestore, "subcategory", id));
  }


}
