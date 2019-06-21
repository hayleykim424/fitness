import { Component, OnInit } from '@angular/core';
import { AuthenticationService } from '../authentication.service';
import { AngularFireAuth } from '@angular/fire/auth';
import { Validators, FormBuilder, FormGroup } from '@angular/forms';
import { ToastController } from '@ionic/angular';
import { Router } from '@angular/router';


@Component({
  selector: 'app-signup',
  templateUrl: './signup.page.html',
  styleUrls: ['./signup.page.scss'],
})
export class SignupPage implements OnInit {
  private signUpForm:FormGroup;


  constructor(
    private authService:AuthenticationService,
    private formBuilder:FormBuilder,
    private router:Router,
    public afAuth: AngularFireAuth,
    private toaster:ToastController
  ) { }

  ngOnInit() {//called when the module is initialised
    this.signUpForm = this.formBuilder.group({
      email: ['', [ Validators.required, Validators.email ]],
      password:['', [Validators.required, Validators.minLength(6)]]
      // workoutWeek: ['', [ Validators.required, Validators.toString ]],
      // workoutRun: ['', [ Validators.required, Validators.toString ]],
      // workoutSquat: ['', [ Validators.required, Validators.toString ]]
    });
  }

  

  signUp( formData ){
    console.log(formData);

    this.authService.signUp(formData.email, formData.password)
    .then( (response) => {
      this.sendEmailVerification()
      //sign up successful
      this.showToast('Verification email sent!');

      //this.afAuth.auth.
      console.log(response);
      //navigate to home when signed up?
      this.router.navigate(['/login']);

      //this.router.navigate(['/home']);
    })
    .catch( (error) => {
      //sign up failed
      this.showToast('Error signing up. Please try again!');
      console.log(error);
    });

  }

  sendEmailVerification() {
    this.afAuth.authState.subscribe(user => {
        user.sendEmailVerification()
        .then(() => {
          console.log('email sent');
        })
      });
  }

  

    async showToast(message:string){
      const toast = await this.toaster.create({
        message: message,
        position: 'bottom',
        duration: 1000
      });
      toast.present();
    }

    showHome(){
      this.router.navigate(['/tabs/home']);
    }

    showSignIn(){
      this.router.navigate(['/login']);
    }

}
