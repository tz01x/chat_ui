import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { AppStateService } from '../../services/app-state.service';
import { Auth, GoogleAuthProvider, signInWithPopup, UserCredential } from '@angular/fire/auth';
import { concatMap, distinctUntilChanged, filter, from, of, switchMap } from 'rxjs';
import { Router } from '@angular/router';
import { StoreService } from '../../services/store.service';
import { User } from 'src/app/interfaces';


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  title = "Login";
  loading = false;

  loginForm = new FormGroup({
    username: new FormControl('', [Validators.required]),
    password: new FormControl('', Validators.required),
  })

  constructor(
    public appState: AppStateService,
    public auth: Auth,
    private router: Router,
    private db: StoreService
  ) { }

  ngOnInit(): void {
  }

  onSubmit() {
    if (this.loginForm.valid) {
      const { username, password } = this.loginForm.value;
      if (username && password) {
        this.loading = true;
        // todo: need to complect this implementation 

      }
    }
  }

  signInWithGoogle() {
    const provider = new GoogleAuthProvider();
    from(signInWithPopup(this.auth, provider))
      .subscribe({
        next: (result) => {
          this.getGoogleAuthUser(result);
        }, error: (error) => {
          this.invalidGoogleLogin(error);
        }
      })
  }

  getGoogleAuthUser(userCredential: UserCredential) {
    const {
      email,
      displayName,
      photoURL,
      uid,
      refreshToken,
    } = userCredential.user;



    from(userCredential.user.getIdToken())
      .pipe(switchMap((accessToken) => {
        return this.addUserToDB({
          email,
          displayName,
          photoURL,
          uid,
          refreshToken,
          'accessToken': accessToken,
          other: JSON.stringify(userCredential.user.toJSON())
        })
      })).subscribe({
        next: (res) => {
          const userRes = res as User;
          this.appState.setUserDocID(userRes.uid);
        },
        error:(err)=>{
          const {status} = err;
          if(status != undefined  && status==0){
            this.appState.showError('Connection Error');
          }else{
            this.appState.showError('Error Occurs');
          }
        },
        complete:()=>{
          this.router.navigate(['home']);
        }
      });


  }

  addUserToDB(user: User) {
    this.appState.setUser(user);
    return this.db.addUser(user);
  }

  invalidGoogleLogin(error: any) {
    console.log(error);
  }


}
