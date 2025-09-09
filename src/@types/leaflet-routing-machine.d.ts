import * as L from 'leaflet';

declare module 'leaflet' {
  namespace Routing {
    class Control extends L.Control {
  constructor(options?: unknown);
  getPlan(): unknown;
      setWaypoints(waypoints: L.LatLng[]): void;
      getWaypoints(): L.LatLng[];
    }
  function control(options?: unknown): Control;
  }
}
