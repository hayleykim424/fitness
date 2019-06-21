import { Component, OnInit } from '@angular/core';
import { AuthenticationService } from '../authentication.service';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFireDatabase } from 'angularfire2/database';
import { Router } from '@angular/router';
import { DataService } from '../data.service';
import { ModalController, NavParams } from '@ionic/angular';

import { UserworkoutPage } from '../userworkout/userworkout.page';
import { UserProfile } from '../models/userProfile';
import { Observable, BehaviorSubject } from 'rxjs';
// import { Subscription } from 'rxjs';
// import { NavController } from 'ionic-angular';

@Component({
  selector: 'app-workout',
  templateUrl: './workout.page.html',
  styleUrls: ['./workout.page.scss'],
})
export class WorkoutPage implements OnInit {

  //workouts: Array<any> = [];
  //showWorkout: boolean = false;
  //currentUser : any;
  //workoutItems: any = [];
  //workoutTpyeItems: any = [];

  //workout as an Observable (so will update automatically)
  workouts$:BehaviorSubject<any[]> = new BehaviorSubject(null);
  workoutTypes:Array<any>=[];
  workoutTypesChest:Array<any>=[];
  workoutTypesCore:Array<any>=[];
  workoutTypesLeg:Array<any>=[];
  workoutTypesShoulder:Array<any>=[];

  workouts: Array<any> = [];
  showWorkout: boolean = false;
  currentUser : any;
  workoutItems: any = [];
  workoutTpyeItems: any = [];

  activity: any;
  endurance: any;
  ftitle: any;
  fdescription: any;
  fimage: any;
  ftype: any;
  //randomly picked 3 workouts
  randomPick:Array<any> = [];

  profile = {} as UserProfile;

  constructor(
    //public navCtrl: NavController,
    private modalController:ModalController,
    private dataService:DataService,
    private router:Router,
    private authenticationService: AuthenticationService,
    public afAuth: AngularFireAuth, 
    private afDatabase: AngularFireDatabase
  ) 
  {   
  }

  ngOnInit() {
    // subscribe to the auth$ observable in this.authenticationService
    this.authenticationService.auth$.subscribe( (user) => {
      console.log(user);
      //if user is authenticated
      if( user ){
        //set showWorkout to true
        this.showWorkout = true
        //subscribe to the data in workouts
        this.afDatabase.object('workouts').valueChanges().subscribe((values:any[]) => {
          this.workouts$.next( values );
        });
      }
      //if user is not authenticated
      else{
        
        this.showWorkout = false;
      }
    });
    this.pickRandomWorkout();
  }

ionViewDidEnter(){
  //call to showTypeOfWorkout('back') for testing
  this.showTypeOfWorkout('back');
  this.showTypeOfWorkoutChest('chest');
  this.showTypeOfWorkoutCore('core');
  this.showTypeOfWorkoutShoulder('shoulder');
  this.showTypeOfWorkoutLeg('leg');

  this.showTodaysWorkout();
}

ionPageWillLeave() {
}

showPersonalWorkout(){
  this.afAuth.auth.onAuthStateChanged(
    (user)=>{
      if(user){

        //activity
        this.afDatabase.object('userProfile/' + this.afAuth.auth.currentUser.uid + '/activity/').snapshotChanges().subscribe(
          (action)=>{
            if(action.payload.val())
            {
              console.log(action.payload.val());
              this.activity = action.payload.val();
            }
            else
            {
              console.log("No Data");
            }
        });

        //endurance
        this.afDatabase.object('userProfile/' + this.afAuth.auth.currentUser.uid + '/endurance/').snapshotChanges().subscribe(
          (action)=>{
            if(action.payload.val())
            {
              console.log(action.payload.val());
              this.endurance = action.payload.val();
            }
            else
            {
              console.log("No Data");
            }
        });

        this.showWorkout = true;

        this.afDatabase.object('workouts/').snapshotChanges().subscribe(
          (action)=>{
            if(action.payload.val())
            {
              //this.workoutItems = [];
              console.log(action.payload.val());
              //let items: any = action.payload.val();
              this.workoutItems = action.payload.val();
              this.workoutItems.forEach(
                (workout) =>{
                  this.workouts.push(workout);
                }
              );
              console.log( this.workouts );
            }
            else
            {
              console.log("No Data");
            }
          });
      }
    }
  );

}

showTypeOfWorkout(type)
  {
    


    //subscribe to the workout$ and filter according to type
    this.workouts$.subscribe( (workouts) => {
      //set workoutTypes to values filtered using type
      if( workouts ){
        
        this.workoutTypes = workouts.filter( (item) => {
          if( item.wtype == type){
            return item;
          }
        });
        //return the filtered array of workouts
        //return workoutTypes;
      }

      // let count = workouts.length;
      // if( this.activity < 2 ){
      //   //create array to hold randomly picked workouts
      //   let workoutsArray:Array<any> = [];
      // //loop 3 times
      //   for( let i=0; i < 3; i++ ){
      //     //add random workout to the workoutsArray
      //     workoutsArray.push( workouts[ Math.round(Math.random() * count) ] );
      //  }
      // } 
      
    });
  }

  pickRandomWorkout(){

    this.afAuth.auth.onAuthStateChanged(
      (user)=>{
        if(user){
  
          //activity
          this.afDatabase.object('userProfile/' + this.afAuth.auth.currentUser.uid + '/activity/').snapshotChanges().subscribe(
            (action)=>{
              if(action.payload.val())
              {
                console.log(action.payload.val());
                this.activity = action.payload.val();
              }
              else
              {
                console.log("No Data");
              }
          });
  
          //endurance
          this.afDatabase.object('userProfile/' + this.afAuth.auth.currentUser.uid + '/endurance/').snapshotChanges().subscribe(
            (action)=>{
              if(action.payload.val())
              {
                console.log(action.payload.val());
                this.endurance = action.payload.val();
              }
              else
              {
                console.log("No Data");
              }
          });
        }
      }
    );

    if(this.endurance == 3)
    {
      this.workouts$.subscribe( (workouts) => {
        if(workouts){
          const count:number = workouts.length;
          for( let i:number = 0; i < 3; i++ ){
            let rand:number = Math.round( Math.random() * count);
            console.log( workouts[ rand ] );
            this.randomPick[i] = workouts[ rand ];
          }
        }
      })
    }
    else if(this.endurance > 3)
    {
      this.workouts$.subscribe( (workouts) => {
        if(workouts){
          const count:number = workouts.length;
          for( let i:number = 0; i < 5; i++ ){
            let rand:number = Math.round( Math.random() * count);
            console.log( workouts[ rand ] );
            this.randomPick[i] = workouts[ rand ];
          }
        }
      })
    }
    else if(this.endurance == 5)
    {
      this.workouts$.subscribe( (workouts) => {
        if(workouts){
          const count:number = workouts.length;
          for( let i:number = 0; i < 10; i++ ){
            let rand:number = Math.round( Math.random() * count);
            console.log( workouts[ rand ] );
            this.randomPick[i] = workouts[ rand ];
          }
        }
      })
    }
    else if(this.endurance <= 2)
    {
      this.workouts$.subscribe( (workouts) => {
        if(workouts){
          const count:number = workouts.length;
          for( let i:number = 0; i < 2; i++ ){
            let rand:number = Math.round( Math.random() * count);
            console.log( workouts[ rand ] );
            this.randomPick[i] = workouts[ rand ];
          }
        }
      })
    }
    else
    {
      this.workouts$.subscribe( (workouts) => {
        if(workouts){
          const count:number = workouts.length;
          for( let i:number = 0; i < 5; i++ ){
            let rand:number = Math.round( Math.random() * count);
            console.log( workouts[ rand ] );
            this.randomPick[i] = workouts[ rand ];
          }
        }
      })
    }

    
  }



  showTypeOfWorkoutChest(type)
  {
    //subscribe to the workout$ and filter according to type
    this.workouts$.subscribe( (workouts) => {
      //set workoutTypes to values filtered using type
      if( workouts ){
        this.workoutTypesChest = workouts.filter( (item) => {
          if( item.wtype == type){
            return item;
          }
        });
        //return the filtered array of workouts
        //return workoutTypes;
      }
      
    });
  }

  showTypeOfWorkoutLeg(type)
  {
    //subscribe to the workout$ and filter according to type
    this.workouts$.subscribe( (workouts) => {
      //set workoutTypes to values filtered using type
      if( workouts ){
        this.workoutTypesLeg = workouts.filter( (item) => {
          if( item.wtype == type){
            return item;
          }
        });
        //return the filtered array of workouts
        //return workoutTypes;
      }
      
    });
  }

  showTypeOfWorkoutShoulder(type)
  {
    //subscribe to the workout$ and filter according to type
    this.workouts$.subscribe( (workouts) => {
      //set workoutTypes to values filtered using type
      if( workouts ){
        this.workoutTypesShoulder = workouts.filter( (item) => {
          if( item.wtype == type){
            return item;
          }
        });
        //return the filtered array of workouts
        //return workoutTypes;
      }
      
    });
  }

  showTypeOfWorkoutCore(type)
  {
    //subscribe to the workout$ and filter according to type
    this.workouts$.subscribe( (workouts) => {
      //set workoutTypes to values filtered using type
      if( workouts ){
        this.workoutTypesCore = workouts.filter( (item) => {
          if( item.wtype == type){
            return item;
          }
        });
        //return the filtered array of workouts
        //return workoutTypes;
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

  showTodaysWorkout(){
    //wtitle
    this.afDatabase.object('workouts/' + '17' + '/wtitle/').snapshotChanges().subscribe(
      (action)=>{
        if(action.payload.val())
        {
          console.log(action.payload.val());
          this.ftitle = action.payload.val();
        }
        else
        {
          console.log("No Data");
        }
    });

    //wdescription
    this.afDatabase.object('workouts/' + '17' + '/wdescription/').snapshotChanges().subscribe(
      (action)=>{
        if(action.payload.val())
        {
          console.log(action.payload.val());
          this.fdescription = action.payload.val();
        }
        else
        {
          console.log("No Data");
        }
    });

    //wtype
    this.afDatabase.object('workouts/' + '17' + '/wtype/').snapshotChanges().subscribe(
      (action)=>{
        if(action.payload.val())
        {
          console.log(action.payload.val());
          this.ftype = action.payload.val();
        }
        else
        {
          console.log("No Data");
        }
    });

    //wimage
    this.afDatabase.object('workouts/' + '17' + '/wimage/').snapshotChanges().subscribe(
      (action)=>{
        if(action.payload.val())
        {
          console.log(action.payload.val());
          this.fimage = action.payload.val();
        }
        else
        {
          console.log("No Data");
        }
    });
}

  

}
