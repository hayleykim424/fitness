import { Component, OnInit } from '@angular/core';
import { AuthenticationService } from '../authentication.service';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFireDatabase } from 'angularfire2/database';
import { Router } from '@angular/router';
import { DataService } from '../data.service';
import { ModalController, NavParams } from '@ionic/angular';

import { UsermealPage } from '../usermeal/usermeal.page';
import { Observable, BehaviorSubject } from 'rxjs';
import { UserProfile } from '../models/userProfile';


@Component({
  selector: 'app-nutrition',
  templateUrl: './nutrition.page.html',
  styleUrls: ['./nutrition.page.scss'],
})
export class NutritionPage implements OnInit {

  recipes$:BehaviorSubject<any[]> = new BehaviorSubject(null);
  recipes: Array<any> = [];
  recipeTypes:Array<any>=[];
  showRecipe: boolean = false;
  currentUser : any;
  recipeItems: any = [];
  

  rtitle: any;
  rinstruction: any;
  ringredients: any;
  rimage: any;
  rtype: any;

  rtitle1: any;
  rinstruction1: any;
  ringredients1: any;
  rimage1: any;
  rtype1: any;

  userStatus: any;

  constructor(
    private modalController:ModalController,
    private dataService:DataService,
    private router:Router,
    private authenticationService: AuthenticationService,
    public afAuth: AngularFireAuth, 
    private afDatabase: AngularFireDatabase
  ) { }

  ngOnInit() {
    // subscribe to the auth$ observable in this.authenticationService
    this.authenticationService.auth$.subscribe( (user) => {
      console.log(user);
      //if user is authenticated
      if( user ){
        //set showWorkout to true
        this.showRecipe = true
        //subscribe to the data in workouts
        this.afDatabase.object('recipes').valueChanges().subscribe((values:any[]) => {
          this.recipes$.next( values );
        });
      }
      //if user is not authenticated
      else{
        
        this.showRecipe = false;
      }
    });
  }

  ionViewDidEnter(){
    this.currentUser = this.afAuth.auth.currentUser;
    this.showTodaysRecipe();
    //this.showTypeOfRecipe("vegan");
    
    if(this.currentUser == null){
     this.showRecipe = false;
    }
    else{
      //çthis.workoutTpyeItems.length = 0;
      //this.workoutTpyeItems = [];
      //this.showPersonalRecipe();

      this.afAuth.auth.onAuthStateChanged(
        (user)=>{
          if(user){
            //status
            this.afDatabase.object('userProfile/' + this.afAuth.auth.currentUser.uid + '/status/').snapshotChanges().subscribe(
              (action)=>{
                if(action.payload.val())
                {
                  this.userStatus = action.payload.val();
                  this.showTypeOfRecipe(this.userStatus);
                  console.log(action.payload.val());
                }
                else
                {
                  console.log("No Data");
                }
            });
            
          }
          else{
            
          }
        }
      );
    }
}

showPersonalRecipe(){
  this.afAuth.auth.onAuthStateChanged(
    (user)=>{
      if(user){
        this.showRecipe = true;

        this.afDatabase.object('recipes/').snapshotChanges().subscribe(
          (action)=>{
            if(action.payload.val())
            {
              console.log(action.payload.val());
              //let items: any = action.payload.val();
              this.recipeItems = action.payload.val();
              this.recipeItems.forEach(
                (workout) =>{
                  this.recipes.push(workout);
                }
              );
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

showTypeOfRecipe(type)
  {
    this.recipes$.subscribe( (recipes) => {
      if( recipes ){
        
        this.recipeTypes = recipes.filter( (item) => {
          if( item.rtype == type){
            return item;
          }
        });
        //return the filtered array of workouts
        //return recipeTypes;
      }
      
    });
    // let items:any = [];
    // //items = [];
    // //items.length = 0;
    // this.recipes.forEach((Recipe)=>{
    //   if(Recipe.rtype == type)
    //   {
        
    //     items.push(Recipe);
        
    //   }
    // });
    // return items;
  }

  showTypeOfRecipes()
  {
    

    let items:any = [];
    
    if(this.userStatus == "anything")
    {
      this.afDatabase.object('recipes/').snapshotChanges().subscribe(
        (action)=>{
          if(action.payload.val())
          {
            //this.workoutItems = [];
            console.log(action.payload.val());
            this.recipeItems = action.payload.val();
            this.recipeItems.forEach(
              (recipe) =>{
                this.recipes.push(recipe);
              }
            );
            console.log( this.recipes );
          }
          else
          {
            console.log("No Data");
          }
        });
    }
    // this.recipes.forEach((Recipe)=>{
    //   if(Recipe.rtype == type)
    //   {
        
    //     items.push(Recipe);
        
    //   }
    // });
    // return items;
  }

  async showUserMeal(info){
    const modal = await this.modalController.create({
      component: UsermealPage,
      componentProps: info //from parameter of this function
    });
    return await modal.present();
  }

  showTodaysRecipe(){
    //rtitle
    this.afDatabase.object('recipes/' + '6' + '/rtitle/').snapshotChanges().subscribe(
      (action)=>{
        if(action.payload.val())
        {
          //console.log(action.payload.val());
          this.rtitle = action.payload.val();
        }
        else
        {
          console.log("No Data");
        }
    });

    //rtype
    this.afDatabase.object('recipes/' + '6' + '/rtype/').snapshotChanges().subscribe(
      (action)=>{
        if(action.payload.val())
        {
          //console.log(action.payload.val());
          this.rtype = action.payload.val();
        }
        else
        {
          console.log("No Data");
        }
    });

    //rimage
    this.afDatabase.object('recipes/' + '6' + '/rimage/').snapshotChanges().subscribe(
      (action)=>{
        if(action.payload.val())
        {
          //console.log(action.payload.val());
          this.rimage = action.payload.val();
        }
        else
        {
          console.log("No Data");
          
        }
    });

    //rinstruction
    this.afDatabase.object('recipes/' + '6' + '/rinstruction/').snapshotChanges().subscribe(
      (action)=>{
        if(action.payload.val())
        {
          //console.log(action.payload.val());
          this.rinstruction = action.payload.val();
        }
        else
        {
          console.log("No Data");
        }
    });

    //ringredients
    this.afDatabase.object('recipes/' + '6' + '/ringredients/').snapshotChanges().subscribe(
      (action)=>{
        if(action.payload.val())
        {
          //console.log(action.payload.val());
          this.ringredients = action.payload.val();
        }
        else
        {
          console.log("No Data");
        }
    });



    //rtitle
    this.afDatabase.object('recipes/' + '9' + '/rtitle/').snapshotChanges().subscribe(
      (action)=>{
        if(action.payload.val())
        {
          //console.log(action.payload.val());
          this.rtitle1 = action.payload.val();
        }
        else
        {
          console.log("No Data");
        }
    });

    //rtype
    this.afDatabase.object('recipes/' + '9' + '/rtype/').snapshotChanges().subscribe(
      (action)=>{
        if(action.payload.val())
        {
          //console.log(action.payload.val());
          this.rtype1 = action.payload.val();
        }
        else
        {
          console.log("No Data");
        }
    });

    //rimage
    this.afDatabase.object('recipes/' + '9' + '/rimage/').snapshotChanges().subscribe(
      (action)=>{
        if(action.payload.val())
        {
          //console.log(action.payload.val());
          this.rimage1 = action.payload.val();
        }
        else
        {
          console.log("No Data");
          
        }
    });

    //rinstruction
    this.afDatabase.object('recipes/' + '9' + '/rinstruction/').snapshotChanges().subscribe(
      (action)=>{
        if(action.payload.val())
        {
          //console.log(action.payload.val());
          this.rinstruction1 = action.payload.val();
        }
        else
        {
          console.log("No Data");
        }
    });

    //ringredients
    this.afDatabase.object('recipes/' + '9' + '/ringredients/').snapshotChanges().subscribe(
      (action)=>{
        if(action.payload.val())
        {
          //console.log(action.payload.val());
          this.ringredients1 = action.payload.val();
        }
        else
        {
          console.log("No Data");
        }
    });






  }

}
