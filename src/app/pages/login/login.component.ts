import { Component, OnDestroy, OnInit } from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {Auth,signInWithEmailAndPassword,createUserWithEmailAndPassword,User} from '@angular/fire/auth';
import {Observable, Subscription} from "rxjs";
import firebase from "firebase/compat";
import {doc, docData, Firestore, getDoc, setDoc} from '@angular/fire/firestore';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/shared/services/auth/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit, OnDestroy {
  public loginForm!: FormGroup;
  public signUpForm!: FormGroup;
  public user$!: Observable<User | null>;
  public loginSubscription!: Subscription;
  public isSignUp = false;

  constructor(
    private fb: FormBuilder,
    private auth: Auth,
    private afs: Firestore,
    private router: Router,
    private authService: AuthService
  ) { }

  ngOnInit(): void {
    this.initLoginForm();
    this.initsignUpForm();
  }

  initLoginForm(): void {
    this.loginForm = this.fb.group({
      email: [null, Validators.required],
      password: [null, Validators.required],
    })
  }

  initsignUpForm(): void{
    this.signUpForm = this.fb.group({
      email: [null, Validators.required],
      password: [null, Validators.required]
    })
  }

  signUpFormRequared(): void {
  this.isSignUp = !this.isSignUp
  }

  loginM(): void{
    const { email, password } = this.loginForm.value;
    this.login(email, password);
  }

  signUp(): void{
    const { email, password } = this.signUpForm.value;
    this.emailSignUp(email, password);
    this.signUpFormRequared();
  }

  async emailSignUp(email: string, password: string): Promise<any> {
    const credential = await createUserWithEmailAndPassword(this.auth,email,password);
    const user = {
      email: credential.user.email,
      firstName: '',
      lastName: '',
      phoneNumber: '',
      address: '',
      orders: [],
      role: 'USER'
    }
    let data = await setDoc(doc(this.afs, "users", credential.user.uid), user);
    return data
  }

  async login(email: string, password: string): Promise<any>{
    const credential = await signInWithEmailAndPassword(this.auth, email, password);
    this.loginSubscription = docData(doc(this.afs, 'users', credential.user.uid)).subscribe(user => {
      localStorage.setItem('user', JSON.stringify(user));
      if (user && user.role === 'ADMIN'){
        this.router.navigate(['/admin']);
      } else if (user && user.role === 'USER'){
        this.router.navigate(['/profile'])
      }
      this.authService.currentUser$.next(true);
    });
  }

  ngOnDestroy() {
    this.loginSubscription.unsubscribe();
  }




}
