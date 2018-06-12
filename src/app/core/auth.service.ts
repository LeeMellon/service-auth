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

  constructor(
    private afAuth: AngularFireAuth,
    private afs: AngularFirestore,
    private router: Router,
    private notify: NotifyService
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
    console.log(displayName);
    return this.afAuth.auth
    .createUserWithEmailAndPassword(email, password)
    .then(credential => {
      const thisUser: ProfileUser = {email: email, userName: displayName, imgURL: img, uid: credential.uid};
      console.log('thisUser on creation  ' + thisUser.uid + 'thisUser name  ' + thisUser.userName + 'email  ' + thisUser.email);
        this.notify.update('Welcome to Firestarter!!!', 'success');
        this.router.navigate(['profile']);
        return this.updateNewUserData(credential.user, thisUser); // if using firestore
      })
      .catch(error => this.handleError(error));
  }

  emailLogin(email: string, password: string) {
    return this.afAuth.auth
      .signInWithEmailAndPassword(email, password)
      .then(credential => {
        this.notify.update('Welcome to Firestarter!!!', 'success');
        this.router.navigate(['profile']);
        return this.updateUserData(credential.user);
      })
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

  signOut() {
    console.log(this.loggedIn);
    this.afAuth.auth.signOut().then(() => {
      this.router.navigate(['/']);
    });
  }

  // If error, console log and notify user
  private handleError(error: Error) {
    console.error(error);
    this.notify.update(error.message, 'error');
  }

  // Sets user data to firestore after succesful login
  private updateUserData(user: ProfileUser) {
    const userRef: AngularFirestoreDocument<ProfileUser> = this.afs.doc(
      `users/${user.uid}`
    );

      const data: ProfileUser = {
      uid: user.uid,
      email: user.email || null,
      userName: user.userName || 'nameless user',
      imgURL: user.imgURL || 'https://goo.gl/Fz9nrQ'
    };
    // console.log('data ' + data.email + '  ' + data.displayName + '  ' + data.uid);
    return userRef.set(data);
  }

   // Sets user data to firestore after succesful login
   // NOT DOING WHAT ITS SUPPOSED TO. FIRESTORE DOCS NOT SAVING CORRETLY(?)
  //  EXTRA USER INFO DOES NOT SAVE TO DB ???
   private updateNewUserData(user, thisUser: ProfileUser) {
    const userRef: AngularFirestoreDocument<ProfileUser> = this.afs.doc(
      `users/${user.uid}`
    );
    console.log('usr ' + user.uid);
    console.log('thisUser ' + thisUser.uid);

    const data: ProfileUser = {
      uid: user.uid,
      email: user.email,
      userName: thisUser.userName,
      imgURL: thisUser.imgURL || 'https://goo.gl/Fz9nrQ'
    };
    console.log('data ' + data.email + '  ' + data.userName + '  ' + data.uid);
    return userRef.set(data);
  }
}
