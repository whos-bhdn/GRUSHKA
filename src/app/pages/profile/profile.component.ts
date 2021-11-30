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
      firstname: [null,
        [
          Validators.required,
          Validators.pattern('([A-Z][a-z]*)([\\s\\\'-][A-Z][a-z]*)*')
        ]
      ],
      lastname: [null,
        [
          Validators.required,
          Validators.pattern('([A-Z][a-z]*)([\\s\\\'-][A-Z][a-z]*)*')
        ]
      ],
      phone: [null,
        [
          Validators.required,
          Validators.pattern(/\(?([0-9]{3})\)?([ .-]?)([0-9]{3})\2([0-9]{4})/)
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
    const user = this.infoForm.value;
    localStorage.setItem('user', JSON.stringify(user));
    this.toastr.success("Дані успішно обновлено");
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
