import { Component, OnInit } from '@angular/core';
import { AuthenticationService } from '../authentication.service';
import { AngularFireAuth } from '@angular/fire/auth';
import { Validators, FormBuilder, FormGroup } from '@angular/forms';
import { ToastController } from '@ionic/angular';
import { Router } from '@angular/router';
import { DataService } from '../data.service';
import { BehaviorSubject } from 'rxjs';

//import { SignupPage } from '../SignupPage';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {
  signInForm:FormGroup;
  //user = {};
  uid:string;
  auth$:BehaviorSubject<any> = new BehaviorSubject(null);

  constructor(
    private authService:AuthenticationService,
    private formBuilder:FormBuilder,
    private toaster:ToastController,
    private router:Router,
    public afAuth: AngularFireAuth,
    private dataService:DataService 
  ) { 
    this.afAuth.authState.subscribe( (user) => {
      if( user ){
        this.auth$.next( user );
      }
      else{
        this.auth$.next( null );
      }
    });
  }

  ngOnInit() {
    this.signInForm = this.formBuilder.group({
      email: ['', [ Validators.required, Validators.email ]],
      password:['', [Validators.required, Validators.minLength(6)]]
    });
  }


  // login(username, password) {
  //   this.angularFireAuth.auth.signInWithEmailAndPassword(username, password)
  //     .then((user) => {
  //       if(user.emailVerified) {
  //         // Redirect the user here
  //       } else {
  //         // Tell the user to have a look at its mailbox
  //       }
  //     });
  // }

  signIn(formData){

    this.afAuth.auth.signInWithEmailAndPassword(formData.email, formData.password)
      .then((user) => {
        if(user.user.emailVerified) {

          let userData = this.afAuth.auth.signInWithEmailAndPassword( formData.email, formData.password)
          .then( user => this.auth$.next(user) )
          this.uid = this.afAuth.auth.currentUser.uid;
          this.dataService.setUid(this.uid);
          //take user to notes
          this.router.navigate(['/tabs/home']);
        }
        else {
          // Tell the user to have a look at its mailbox
          this.showToast('Error: Check your email and accout details');
          console.log(user);
        }
      });
  }

  // signIn( formData ){
  //   this.authService.signIn(formData.email, formData.password)
  //   .then( (response) => {
  //     //the user is signed in
  //     //console.log(response);
  //     if(response.success){
  //       //show toast
  //       this.showToast('Welcome!')
  //       .then( ()=> {
  //         this.dataService.setUid(response.uid);
  //         //take user to notes
  //         this.router.navigate(['/tabs/home']);

  //       });
  //     }
  //     else{
  //       this.showToast('Something went wrong. Try again');
  //       console.log(response);
  //     }
      
  //   })
  //   .catch( (error) => {
  //     //error signing in
  //     console.log(error);

  //   });
  // }

  async showToast(msg){
    const toast = await this.toaster.create({
      message: msg,
      duration: 2000
    });
    toast.present();
  }

  showSignUp(){
    this.router.navigate(['/signup']);
  }

}
