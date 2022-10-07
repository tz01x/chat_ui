import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { AppStateService } from '../../services/app-state.service';
import { Auth, GoogleAuthProvider, signInWithPopup, UserCredential } from '@angular/fire/auth';
import { distinctUntilChanged, filter, from } from 'rxjs';
import { Router } from '@angular/router';
import { StoreService } from '../../services/store.service';


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
    this.appState.showNonfiction('you are cool');
  }

  onSubmit() {
    if (this.loginForm.valid) {
      const { username, password } = this.loginForm.value;
      if (username && password) {
        this.loading = true;
        // todo: need to complect this implementation 

        // this.appState.authenticateUser(username, password).subscribe((result: any) => {
        //   console.log(result);
        //   this.loading = false;
        // })

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

    this.appState.setUser({
      email,
      displayName,
      photoURL,
      uid,
      refreshToken,
      other: JSON.stringify(userCredential.user.toJSON())
    })
    
    from(this.db.addUser({
      email,
      displayName,
      photoURL,
      uid,
      refreshToken,
      other: JSON.stringify(userCredential.user.toJSON())
    })).subscribe((res)=>{
      this.appState.setUserDocID(res);
    })

    this.router.navigate(['home']);
    


  }

  invalidGoogleLogin(error: any) {
    console.log(error);
  }


}
