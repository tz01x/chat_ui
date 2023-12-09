import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { AppStateService } from '../../services/app-state.service';
import { Auth, GoogleAuthProvider, signInWithPopup, UserCredential } from '@angular/fire/auth';
import { from, switchMap } from 'rxjs';
import { Router } from '@angular/router';
import { StoreService } from '../../services/store.service';
import { User } from 'src/app/interfaces';
import { InteractiveLoading } from 'src/app/loading';
import { TokenService } from 'src/app/services/token.service';


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  title = "Login";
  loading = false;
  interactiveLoading:InteractiveLoading;

  loginForm = new FormGroup({
    username: new FormControl('', [Validators.required]),
    password: new FormControl('', Validators.required),
  })

  constructor(
    public appState: AppStateService,
    public auth: Auth,
    private router: Router,
    private db: StoreService,
    private tokenService: TokenService
  ) { 
    this.interactiveLoading = new InteractiveLoading();
  }

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

    const obj = userCredential.user.toJSON() as any;
    const accessToken = obj?.stsTokenManager?.accessToken;
    this.interactiveLoading.showLoaderUntilCompleted(
      this.addUserToDB({
        email,
        displayName,
        photoURL,
        uid,
        refreshToken,
        accessToken,
        other: JSON.stringify(obj)
      })
    ).subscribe({
      next: (res) => {
        this.tokenService.setToken({access_token: res.access_token, refresh_token: res.refresh_token});
        this.appState.setUser(res.user);
        this.appState.isAuthUser.next(true);
      },
      error:(err)=>{
        this.appState.networkErrorHandler(err);
      },
    });


  }

  addUserToDB(user: User) {
    return this.db.addUser(user);
  }

  invalidGoogleLogin(error: any) {
    console.log(error);
  }


}
