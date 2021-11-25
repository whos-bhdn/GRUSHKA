import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {ICategoryResponse} from "../../shared/interfaces/category/category.interface";
import {IProductResponse} from "../../shared/interfaces/product/product.intarface";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import { CategoryService } from 'src/app/shared/services/category/category.service';
import { ProductService } from 'src/app/shared/services/product/product.service';
import {SubcategoryService} from "../../shared/services/subcategory/subcategory.service";
import {Storage, ref, deleteObject, getDownloadURL, uploadBytesResumable,} from "@angular/fire/storage";
import { percentage } from "rxfire/storage";
import {ISubCategory} from "../../shared/interfaces/subcategory/subcategory.interface";
import { ToastrService } from "ngx-toastr";
import {count} from "rxjs/operators";


@Component({
  selector: 'app-admin-products',
  templateUrl: './admin-products.component.html',
  styleUrls: ['./admin-products.component.scss']
})
export class AdminProductsComponent implements OnInit {

  @ViewChild('close') close!: ElementRef;

  public adminCategories: Array<ICategoryResponse> = [];
  public adminSubCategorites: Array<ISubCategory> = [];
  public adminProducts: Array<IProductResponse> = [];
  public currentProductID!: number | string;
  public editStatus = false;
  public productForm!: FormGroup;
  public isUploaded = false;
  public uploadPercent!: number;


  constructor(
    private toastr: ToastrService,
    private categoryService: CategoryService,
    private subcategoryService: SubcategoryService,
    private productService: ProductService,
    private fb: FormBuilder,
    private storage: Storage
  ) { }

  ngOnInit(): void {
    this.loadCategories();
    this.loadSubCategories();
    this.initProductForm();
    this.loadProducts()
  }

  initProductForm(): void {
    this.productForm = this.fb.group({
      category: [null,Validators.required],
      id: [null,Validators.required],
      subcategory: [null,Validators.required],
      name: [null,Validators.required],
      price: [null,Validators.required],
      path: [null,Validators.required],
      imagePath: [null,Validators.required],
      description: [null,Validators.required],
      count: 1
    })
  }

  loadCategories(): void {
    this.categoryService.getAllFB().subscribe(data => {
      this.adminCategories = data as ICategoryResponse[];
    }, err =>{
      this.toastr.error(err.message);
    })
  }

  loadSubCategories(): void{
    this.subcategoryService.getAllFB().subscribe(data => {
      this.adminSubCategorites = data as ISubCategory[];
    }, err => {
      this.toastr.error(err.message);
    })
  }

  loadProducts(): void {
    this.productService.getAllFB().subscribe(data => {
      this.adminProducts = data as IProductResponse[];
    }, err => {
      this.toastr.error(err.message);
    })
  }

  saveProduct(): void {
    if (this.editStatus){
      this.productService.updateFB(this.productForm.value, this.currentProductID as string).then(() => {
        this.loadProducts();
        this.editStatus = false;
        this.initProductForm();
        this.isUploaded = false;
      }).catch(err => {
        this.toastr.error(err.message);
      });
    } else {
      const product = { ...this.productForm.value, count: 1 };
      this.productService.createFB(product).then(() => {
        this.loadProducts();
        this.initProductForm();
        this.isUploaded = false;
      }).catch(err => {
        this.toastr.error(err.message);
      });
    }
  }

  editProduct(product: IProductResponse): void {
    this.productForm.patchValue({
      category: product.category,
      name: product.name,
      path: product.path,
      description: product.path,
      price: product.price,
      imagePath: product.imagePath
    });
    this.currentProductID = product.id;
    this.editStatus = true;
    this.isUploaded = true;
  }

  deleteProduct(product: IProductResponse): void {
    this.productService.deleteFB(product.id as string).then(() => {
      this.loadProducts();
      this.deleteImage(product.imagePath);
    }).catch(err => {
      this.toastr.error(err.message);
    });
  }


  deleteImage(imagePath?: string): void {
    imagePath = imagePath ? imagePath : this.valueByControl('imagePath')
    this.isUploaded = false;
    this.uploadPercent = 0;
    const task = ref(this.storage, imagePath);
    deleteObject(task).then(() => {
      this.toastr.success(task.name)
      console.log('File deleted successfully');
      this.productForm.patchValue({
        imagePath: null
      })
    })
  }

  upload(event: any): void {
    const file = event.target.files[0];
    this.uploadFile('products', file.name, file)
      .then(data => {
        this.productForm.patchValue({
          imagePath: data
        });
        this.isUploaded = true;
      })
      .catch(err => {
        console.log(err);
      })
  }

  async uploadFile(folder: string, name: string, file: File | null): Promise<string> {
    const ext = file!.name.split('.').pop();
    const path = `${folder}/${name}.${ext}`;
    let url = '';
    if (file) {
      try {
        const storageRef = ref(this.storage, path);
        const task = uploadBytesResumable(storageRef, file);
        percentage(task).subscribe(data => {
          this.uploadPercent = data.progress
        });
        await task;
        url = await getDownloadURL(storageRef);
      } catch (e: any) {
        console.error(e);
      }
    } else {
      console.log('wrong format')
    }
    return Promise.resolve(url);
  }



  valueByControl(control: string): string {
    return this.productForm.get(control)?.value;
  }

  changeCategory(): void {}
  changeSubCategory(): void {}

}
