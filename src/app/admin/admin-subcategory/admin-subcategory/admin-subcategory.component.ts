import { Component, OnInit } from '@angular/core';
import { SubcategoryService } from 'src/app/shared/services/subcategory/subcategory.service';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {ICategoryResponse} from "../../../shared/interfaces/category/category.interface";
import { ISubCategory } from 'src/app/shared/interfaces/subcategory/subcategory.interface';
import { CategoryService } from 'src/app/shared/services/category/category.service';

@Component({
  selector: 'app-admin-subcategory',
  templateUrl: './admin-subcategory.component.html',
  styleUrls: ['./admin-subcategory.component.scss']
})
export class AdminSubcategoryComponent implements OnInit {

  public subCategoryForm!: FormGroup;
  public adminSubcategories: ISubCategory[] = [];
  public adminCategories: ICategoryResponse[] = [];
  public editStatus = false;
  public currentCategoryID !: number | string;
  public isUploaded = false;
  public isUploaded2 = false;

  constructor(private subcategoryService: SubcategoryService, private fb: FormBuilder, private categoryService: CategoryService) { }

  ngOnInit(): void {
    this.initSubCategoryForm();
      this.loadSubCategory();
      this.loadCategory()
  }

  loadCategory(): void{
    this.categoryService.getAllFB().subscribe(data => {
      this.adminCategories = data as ICategoryResponse[];
    }, err => {
      console.log('load Category Error', err)
    })
  }

  initSubCategoryForm(): void {
    this.subCategoryForm = this.fb.group({
      name: [null, Validators.required],
      path: [null, Validators.required],
      category: [null, Validators.required],
    })
  }

  loadSubCategory(): void {
    this.subcategoryService.getAllFB().subscribe(data => {
        this.adminSubcategories = data as ISubCategory[];
      }, err => {
        console.log('loadSubCategory error', err);
      }
    )
  }

  saveSubCategory(): void {
    if (this.editStatus) {
      this.subcategoryService.updateFB(this.subCategoryForm.value, this.currentCategoryID as string).then(() => {
        this.loadSubCategory();
        this.editStatus = false;
        this.initSubCategoryForm();
        this.isUploaded = false;
        this.isUploaded2 = false;
      }).catch(err => {
        console.log(err);
      })
    } else {
      this.subcategoryService.createFB(this.subCategoryForm.value).then(() => {
        this.loadSubCategory();
        this.initSubCategoryForm();
        this.isUploaded = false;
        this.isUploaded2 = false;
      }).catch(err => {
        console.log(err)
      })
    }
  }

  deleteSubCategory(subcategory: ISubCategory): void {
    this.subcategoryService.deleteFB(subcategory.id as string).then(() => {
      this.loadSubCategory();
    }).catch(err => {
      console.log(err)
    })
  }

  editSubCategory(subcategory: ISubCategory): void {
    this.subCategoryForm.patchValue({
      name: subcategory.name,
      path: subcategory.path,
      category: subcategory.category,
    });
    this.currentCategoryID = subcategory.id;
    this.editStatus = true;
    this.isUploaded = true;
    this.isUploaded2 = true;
  }

  changeCategory(): void {}

}
