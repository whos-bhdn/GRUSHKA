import {Component, OnInit} from '@angular/core';
import {CategoryService} from 'src/app/shared/services/category/category.service';
import {ICategoryResponse} from "../../shared/interfaces/category/category.interface";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-admin-category',
  templateUrl: './admin-category.component.html',
  styleUrls: ['./admin-category.component.scss']
})
export class AdminCategoryComponent implements OnInit {

  public adminCategories: Array<ICategoryResponse> = []
  public editStatus = false;
  public categoryForm!: FormGroup;
  public currentCategoryID !: number | string;
  public isUploaded = false;
  public isUploaded2 = false;

  constructor(
    private categoryService: CategoryService,
    private fb: FormBuilder,
    private toastr: ToastrService,
    ) {
  }

  ngOnInit(): void {
    this.initCategoryForm();
    this.loadCategory()
  }

  initCategoryForm(): void {
    this.categoryForm = this.fb.group({
      name: [null, Validators.required],
      path: [null, Validators.required],
    })
  }

  loadCategory(): void {
    this.categoryService.getAllFB().subscribe(data => {
        this.adminCategories = data as ICategoryResponse[];
      }, err => {
      this.toastr.error(err.message);
      }
    )
  }

  saveCategory(): void {
    if (this.editStatus) {
      this.categoryService.updateFB(this.categoryForm.value, this.currentCategoryID as string).then(() => {
        this.loadCategory();
        this.editStatus = false;
        this.initCategoryForm();
        this.isUploaded = false;
        this.isUploaded2 = false;
        this.toastr.success('Category successfully updated!');
      }).catch(err => {
        this.toastr.error(err.message);
      })
    } else {
      this.categoryService.createFB(this.categoryForm.value).then(() => {
        this.loadCategory();
        this.initCategoryForm();
        this.isUploaded = false;
        this.isUploaded2 = false
        this.toastr.success('Category successfully created!');
      }).catch(err => {
        this.toastr.error(err.message);
      })
    }
  }

  deleteCategory(category: ICategoryResponse): void {
    this.categoryService.deleteFB(category.id as string).then(() => {
      this.loadCategory();
      this.toastr.success('Category successfully deleted!');
    }).catch(err => {
      this.toastr.error(err.message);
    })
  }

  editCategory(category: ICategoryResponse): void {
    this.categoryForm.patchValue({
      name: category.name,
      path: category.path
    });
    this.currentCategoryID = category.id;
    this.editStatus = true;
    this.isUploaded = true;
    this.isUploaded2 = true;
  }

  valueByControl(control: string): string {
    return this.categoryForm.get(control)?.value;
  }

}


