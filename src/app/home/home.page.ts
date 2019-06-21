import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFireDatabase } from 'angularfire2/database';
import { UserProfile } from '../models/userProfile';
import { UserworkoutPage } from '../userworkout/userworkout.page';
import { UsermealPage } from '../usermeal/usermeal.page';
import { ModalController, NavParams } from '@ionic/angular';
import { Observable, BehaviorSubject } from 'rxjs';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
})
export class HomePage implements OnInit {

  //user logged in?
  currentUser : any;
  showBtn     : boolean = true;
  showGreeting : boolean = false;
  workoutTypes:Array<any>=[];
  name: any;
  wtitle: any;
  wtype: any;
  rtitle: any;
  rtype: any;
  wimage: any;
  rimage: any;
  wdescription: any;
  rinstruction: any;
  ringredients: any;

  workouts$:BehaviorSubject<any[]> = new BehaviorSubject(null);
  foods$:BehaviorSubject<any[]> = new BehaviorSubject(null);

  profile = {} as UserProfile;

  constructor(
    private modalController:ModalController,
    private router:Router,
    public afAuth: AngularFireAuth,
    private afDatabase: AngularFireDatabase

  ) { }

  ngOnInit() {
    console.log(this.currentUser);
    //subscribe to the data in workouts
    this.afDatabase.object('workouts').valueChanges().subscribe((values:any[]) => {
      this.workouts$.next( values );
    });
    this.afDatabase.object('recipes').valueChanges().subscribe((values:any[]) => {
      this.workouts$.next( values );
    });
  }

  ionViewWillEnter(){
    this.currentUser = this.afAuth.auth.currentUser;

    this.showTodaysWorkout();
    this.showTodaysRecipe();

    if(this.currentUser == null){
     this.showBtn = true;
     this.showGreeting = false;
    }
    else{
      this.showBtn = true;

      //username
      this.afDatabase.object('userProfile/' + this.afAuth.auth.currentUser.uid + '/username/').snapshotChanges().subscribe(
        (action)=>{
          if(action.payload.val())
          {
            console.log(action.payload.val());
            this.name = action.payload.val();
          }
          else
          {
            console.log("No Data");
          }
      });
      this.showGreeting = true;
    }
    console.log(this.currentUser);
  }
 

  showSignup(){
    this.router.navigate(['/signup']);
  }

  showTodaysWorkout(){
      //wtitle
      this.afDatabase.object('workouts/' + '12' + '/wtitle/').snapshotChanges().subscribe(
        (action)=>{
          if(action.payload.val())
          {
            console.log(action.payload.val());
            this.wtitle = action.payload.val();
          }
          else
          {
            console.log("No Data");
          }
      });

      //wdescription
      this.afDatabase.object('workouts/' + '12' + '/wdescription/').snapshotChanges().subscribe(
        (action)=>{
          if(action.payload.val())
          {
            console.log(action.payload.val());
            this.wdescription = action.payload.val();
          }
          else
          {
            console.log("No Data");
          }
      });

      //wtype
      this.afDatabase.object('workouts/' + '12' + '/wtype/').snapshotChanges().subscribe(
        (action)=>{
          if(action.payload.val())
          {
            console.log(action.payload.val());
            this.wtype = action.payload.val();
          }
          else
          {
            console.log("No Data");
          }
      });

      //wimage
      this.afDatabase.object('workouts/' + '12' + '/wimage/').snapshotChanges().subscribe(
        (action)=>{
          if(action.payload.val())
          {
            console.log(action.payload.val());
            this.wimage = action.payload.val();
          }
          else
          {
            console.log("No Data");
          }
      });
  }

  showTodaysRecipe(){
    //rtitle
    this.afDatabase.object('recipes/' + '7' + '/rtitle/').snapshotChanges().subscribe(
      (action)=>{
        if(action.payload.val())
        {
          console.log(action.payload.val());
          this.rtitle = action.payload.val();
        }
        else
        {
          console.log("No Data");
        }
    });

    //rtype
    this.afDatabase.object('recipes/' + '7' + '/rtype/').snapshotChanges().subscribe(
      (action)=>{
        if(action.payload.val())
        {
          console.log(action.payload.val());
          this.rtype = action.payload.val();
        }
        else
        {
          console.log("No Data");
        }
    });

    //rimage
    this.afDatabase.object('recipes/' + '7' + '/rimage/').snapshotChanges().subscribe(
      (action)=>{
        if(action.payload.val())
        {
          console.log(action.payload.val());
          this.rimage = action.payload.val();
        }
        else
        {
          console.log("No Data");
          
        }
    });

    //rinstruction
    this.afDatabase.object('recipes/' + '7' + '/rinstruction/').snapshotChanges().subscribe(
      (action)=>{
        if(action.payload.val())
        {
          console.log(action.payload.val());
          this.rinstruction = action.payload.val();
        }
        else
        {
          console.log("No Data");
        }
    });

    //ringredients
    this.afDatabase.object('recipes/' + '7' + '/ringredients/').snapshotChanges().subscribe(
      (action)=>{
        if(action.payload.val())
        {
          console.log(action.payload.val());
          this.ringredients = action.payload.val();
        }
        else
        {
          console.log("No Data");
        }
    });
}

async showUserWorkout(info){
  const modal = await this.modalController.create({
    component: UserworkoutPage,
    componentProps: info //from parameter of this function
  });
  return await modal.present();
}

  async showUserMeal(info){
    const modal = await this.modalController.create({
      component: UsermealPage,
      componentProps: info //from parameter of this function
    });
    return await modal.present();
  }
}
