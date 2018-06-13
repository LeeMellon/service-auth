import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

import { AngularFireAuth } from 'angularfire2/auth';
import { AngularFirestore, AngularFirestoreDocument } from 'angularfire2/firestore';
import { NotifyService } from './notify.service';
import * as firebase from 'firebase';
import { Observable, of } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { ProfileUser } from './profileuser.model';


@Injectable()
export class AuthService {
  user: Observable<ProfileUser | null>;
  loggedIn: boolean;
  db;
  constructor(
    private afAuth: AngularFireAuth,
    private afs: AngularFirestore,
    private router: Router,
    private notify: NotifyService,

  ) {
    this.user = this.afAuth.authState.pipe(
      switchMap(user => {
        if (user) {
          this.loggedIn = true;
          return this.afs.doc<ProfileUser>(`users/${user.uid}`).valueChanges();
        } else {
          this.loggedIn = false;
          return of(null);
        }
      })
    );
    this.db = firebase.firestore();
  }

  ////// OAuth Methods /////

  googleLogin() {
    const provider = new firebase.auth.GoogleAuthProvider();
    return this.oAuthLogin(provider);
  }

  githubLogin() {
    const provider = new firebase.auth.GithubAuthProvider();
    return this.oAuthLogin(provider);
  }

  facebookLogin() {
    const provider = new firebase.auth.FacebookAuthProvider();
    return this.oAuthLogin(provider);
  }

  twitterLogin() {
    const provider = new firebase.auth.TwitterAuthProvider();
    return this.oAuthLogin(provider);
  }

  private oAuthLogin(provider: any) {
    return this.afAuth.auth
      .signInWithPopup(provider)
      .then(credential => {
        this.notify.update('Welcome to Firestarter!!!', 'success');
        return this.updateUserData(credential.user);
      })
      .catch(error => this.handleError(error));
  }

  //// Anonymous Auth ////

  anonymousLogin() {
    return this.afAuth.auth
      .signInAnonymously()
      .then(credential => {
        this.notify.update('Welcome to Firestarter!!!', 'success');
        return this.updateUserData(credential.user); // if using firestore
      })
      .catch(error => {
        this.handleError(error);
      });
  }

  //// Email/Password Auth ////

  emailSignUp(email, password, displayName, img) {
    return this.afAuth.auth
    .createUserWithEmailAndPassword(email, password)
    .then(credential => {
      const userData = {email: email, userName: displayName, imgURL: img, uid: credential.user.uid, securityLvl: 10};
        this.notify.update('Welcome to Firestarter!!!', 'success');
        this.router.navigate(['profile']);
        return this.updateNewUserData(userData); // if using firestore
      })
      .catch(error => this.handleError(error));
  }

  emailLogin(email: string, password: string) {
    return this.afAuth.auth
      .signInWithEmailAndPassword(email, password)
      .catch(error => this.handleError(error));

  }

  // Sends email allowing user to reset password
  resetPassword(email: string) {
    const fbAuth = firebase.auth();

    return fbAuth
      .sendPasswordResetEmail(email)
      .then(() => this.notify.update('Password update email sent', 'info'))
      .catch(error => this.handleError(error));
  }

  update(userData: ProfileUser) {
    this.updateUserData(userData);
    console.log('update click' + userData.securityLvl);

  }

  signOut() {
    console.log(this.loggedIn);
    this.afAuth.auth.signOut().then(() => {
      this.router.navigate(['/']);
    });
  }

   getSecrets() {
    // const secretRef = this.db.collection('secrets').doc('mySecrets');
    // secretRef.get().then(doc => {
    //   return doc.data();
    // });
    return this.db.collection('secrets').doc('mySecrets');
  }


  // If error, console log and notify user
  private handleError(error: Error) {
    console.error(error);
    this.notify.update(error.message, 'error');
  }

  // Sets user data to firestore after succesful login
  private updateUserData(userData: ProfileUser) {
    const userRef: AngularFirestoreDocument<ProfileUser> = this.afs.doc(
      `users/${userData.uid}`
    );

      const data: ProfileUser = {
      uid: userData.uid,
      email: userData.email,
      userName: userData.userName,
      imgURL: userData.imgURL,
      securityLvl: userData.securityLvl
    };
    return userRef.set(data);
  }

   // Sets user data to firestore after succesful login
   private updateNewUserData(userData: ProfileUser) {
    const userRef: AngularFirestoreDocument<ProfileUser> = this.afs.doc(
      `users/${userData.uid}`
    );
    const data: ProfileUser = {
      uid: userData.uid,
      email: userData.email,
      userName: userData.userName,
      imgURL: userData.imgURL || 'https://goo.gl/Fz9nrQ',
      securityLvl: 10
    };
    return userRef.set(data);
  }
}
