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
  Firestore,
  setDoc
} from "@angular/fire/firestore";
import {environment} from "../../../../environments/environment";


@Injectable({
  providedIn: 'root'
})
export class CategoryService {

  constructor(
    private http: HttpClient,
    private firestore: Firestore,
  ) { }


  getAllFB(): Observable<DocumentData[]> {
    return collectionData(collection(this.firestore, "category"), {idField: "id"});
  }

  createFB(category: ICategoryResponse): Promise<DocumentReference<DocumentData>> {
    return addDoc(collection(this.firestore, "category"), category);
  }

  updateFB(category: ICategoryResponse, id: string): Promise<void> {
    return setDoc(doc(this.firestore, "category", id), category);
  }

  deleteFB(id: string): Promise<void> {
    return deleteDoc(doc(this.firestore, "category", id));
  }
}

