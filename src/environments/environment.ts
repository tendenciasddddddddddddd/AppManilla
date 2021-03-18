// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  serverUrl: 'http://manill-001-site1.btempurl.com/api/',
  appUrl: 'https://www.tryion.shop',
  appImageUrl: 'https://www.tryion.shop/assets/imgs/ionshop.png',
  appId: 'myAppId',
  fbId: '458557805016330',
  stripePublicKey: 'YOUR_STRIPE_PUBLIC_KEY',
  androidHeaderColor: '#222428',
  defaultLang: 'en',
  googleClientId: '528885237971-odqdss65k4dsp8n72o1bojuot9h7litl.apps.googleusercontent.com',
  currency: {
    code: 'USD',
    display: 'symbol',
    digitsInfo: '1.2-2',
  },
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.
