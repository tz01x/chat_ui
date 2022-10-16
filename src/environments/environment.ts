// This file can be replaced during build by using the `fileReplacements` array.
// `ng build` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  chatSocketUrl:'http://localhost:8080/afterNet',
  api:'http://127.0.0.1:8000/afternet',
  firebase : {
    apiKey: "AIzaSyBb7AQNYrIPHZ9zu0yIr4zUjRKMnhIFgIE",
    authDomain: "rt-chat-586d8.firebaseapp.com",
    projectId: "rt-chat-586d8",
    storageBucket: "rt-chat-586d8.appspot.com",
    messagingSenderId: "285118792626",
    appId: "1:285118792626:web:0babfcbae15ea1e06f5aab"
  }
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/plugins/zone-error';  // Included with Angular CLI.
