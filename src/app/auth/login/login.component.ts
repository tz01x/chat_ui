import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { AppStateService } from '../../../services/app-state.service';
import { Auth, GoogleAuthProvider, signInWithPopup, UserCredential } from '@angular/fire/auth';
import { distinctUntilChanged, filter, from } from 'rxjs';
import { Router } from '@angular/router';


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
    private router: Router
  ) { }

  ngOnInit(): void {
  }

  onSubmit() {
    if (this.loginForm.valid) {
      const { username, password } = this.loginForm.value;
      if (username && password) {
        this.loading = true;

        this.appState.authenticateUser(username, password).subscribe((result: any) => {
          console.log(result);
          this.loading = false;
        })

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
    debugger;
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
    })

    this.router.navigate(['message']);


  }

  invalidGoogleLogin(error: any) {
    console.log(error);
  }


}