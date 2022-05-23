// This file can be replaced during build by using the `fileReplacements` array.
// `ng build` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  hostedUrl: 'https://localhost:4200/',
  apiUrl: 'https://localhost:7279/api/',
  loggingEnabled: true,
  activitiesImgUrl: '../../assets/activities/',
  azureAD: {
    authUrl: `api://f45cae57-dd3e-46d7-8d33-f788033bce25/`,
    graphUrl: 'https://graph.microsoft.com/v1.0/',
    clientId: 'f45cae57-dd3e-46d7-8d33-f788033bce25',
    tokenId: 'f26c353e-08e3-45cb-aa2a-a2231a391931',
    authority: 'https://login.microsoftonline.com/'
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
