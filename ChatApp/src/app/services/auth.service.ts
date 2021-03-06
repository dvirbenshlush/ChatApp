import { Injectable } from '@angular/core';
import { AngularFireAuth,  } from '@angular/fire/compat/auth';
import { AngularFirestore, AngularFirestoreDocument } from '@angular/fire/compat/firestore';
import { Router } from '@angular/router';
import * as firebase from 'firebase/compat/app';
import { BehaviorSubject, Observable, Subject } from 'rxjs';
import { User } from '../models/User.interface';

@Injectable({
  providedIn: 'root'
})
export class AuthService {


  private isLoggedIn$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false) ;
  private userDetails$: Subject<User> = new Subject<User>() ;

  constructor(private afs:AngularFirestore, private afAuth: AngularFireAuth, private router: Router) {
    const saveUserString = localStorage.getItem('user');
    if(saveUserString != null){
      this.isLoggedIn$.next(true)
    }

    afAuth.authState.subscribe(user =>{
      if(!!user){
        this.userDetails$.next(<User>user)
        const userString: string = JSON.stringify(user);
        localStorage.setItem('user' , userString);
        this.isLoggedIn$.next(true);
      }else{
        localStorage.removeItem('user');
        this.isLoggedIn$.next(false);
      }
    })
  }

  public signInWithGoogle(){
    this.authLogin(new firebase.default.auth.GoogleAuthProvider())
  }

  public signOut(): Promise<void> {
    return this.afAuth.signOut().then(()=>{
      localStorage.removeItem('user');
      this.router.navigate(['/']);
      this.userDetails$.next(undefined);
    });
  }

  public isLoggedIn() : Observable<boolean>{
    return this.isLoggedIn$.asObservable();
  }

  private authLogin(provider: firebase.default.auth.AuthProvider){
    return this.afAuth.signInWithPopup(provider).then(res =>{
      this.setUserData(res.user as User)
        });
    }

  private setUserData(user? : User): Promise<void> | void {
    if(!user) return;
    const userRef:AngularFirestoreDocument<User> = this.afs.doc(
      `users/${user.uid}`
    )
  
    
    const userData: User = {
      uid: user.uid,
      email: user.email,
      displayName:user.displayName,
      photoURL: user.photoURL
    }

    return userRef.set(userData,{merge:true});

  }


}
