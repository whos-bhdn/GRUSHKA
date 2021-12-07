import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/shared/services/auth/auth.service';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {doc, docData, Firestore} from "@angular/fire/firestore";
import {Auth, createUserWithEmailAndPassword, signInWithEmailAndPassword, user} from "@angular/fire/auth";
import {Subscription} from "rxjs";
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {

  public infoForm!: FormGroup;
  public firstname!: string;
  public lastname!: string;
  public phone!: number;
  public address!: any;
  public userdataSubscription = Subscription;


  constructor(
    private auth: Auth,
    private authService: AuthService,
    private fb: FormBuilder,
    private afs: Firestore,
    private toastr: ToastrService
  ) { }

  ngOnInit(): void {
    this.initInfoForm()
  }

  initInfoForm(): void {
    this.infoForm = this.fb.group({
      firstname: [
        null,
        [
          Validators.required,
          Validators.pattern(/^[a-zA-Z0-9]*[a-zA-Z]+[a-zA-Z0-9]*$/)
        ]
      ],
      lastname: [
        null,
        [
          Validators.required,
          Validators.pattern(/^[a-zA-Z0-9]*[a-zA-Z]+[a-zA-Z0-9]*$/)
        ]
      ],
      phone: [
        null,
        [
          Validators.required,
          Validators.pattern(/^[0-9\-\+]{9,15}$/)
        ]
      ],
      address: [
        null, [
          Validators.required,
          Validators.minLength(6)
        ]
      ],
    })
  }

  confirmInfo(): void{
   if (this.infoForm.valid){
     const user = this.infoForm.value;
     localStorage.setItem('user', JSON.stringify(user));
     this.toastr.success("Дані успішно обновлено");
   } else if(this.infoForm.get('firstname')?.invalid){
     this.toastr.error("Ім'я вказано невірно")
   } else if(this.infoForm.get('lastname')?.invalid){
     this.toastr.error("Прізвище вказано невірно")
   }
   else if(this.infoForm.get('phone')?.invalid){
     this.toastr.error("Номер вказано невірно")
   }
   else if(this.infoForm.get('address')?.invalid){
     this.toastr.error("Адрес вказано невірно")
   }
  }

  dismissInfo(): void{
    this.infoForm = this.fb.group({
      firstname: '',
      lastname: '',
      phone: '',
      address: '',
    })
  }

  signOut(): void{
    this.authService.logOut();
  }

}
