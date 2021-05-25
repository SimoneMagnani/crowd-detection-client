// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  apiUrl: 'http://localhost:8080',
  root_topic: "detection",
  mqtt_broker_ip_for_cam: "192.168.1.1",
  mqtt_broker_ip_for_client: "localhost",
  mqtt_broker_port: 1884,
  mqtt_broker_protocol: 'ws',
  pixel_points:[{x:1,y:2}],
  cm_points:[{x:1,y:2}],
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.
