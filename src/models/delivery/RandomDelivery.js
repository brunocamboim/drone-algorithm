import { Drone } from "../Drone.js";
import { Package } from "../Package.js";
import { IDelivery } from "./IDelivery.js";

export class RandomDelivery extends IDelivery {
  /**
   *
   * @param {Drone[]} drones
   * @param {Package[]} packages
   */
  make(drones, packages) {
    let remaingPackages = packages.length;
    while(remaingPackages > 0) {
      for (const drone of drones) {

        const copyOfPackages = [...packages];
        for (let i = packages.  length - 1; i >= 0; i--) {
          const packageForDelivery = packages[i]

          if (drone.canCarry(packageForDelivery.weight)) {
            drone.makeDelivery(packageForDelivery.location, packageForDelivery.weight);
            remaingPackages--;

            copyOfPackages.splice(i, 1);
          }
        }

        packages = [...copyOfPackages];

        if (drone.maxWeight !== drone.remaingCapacity) {
          drone.applyCompletedTripAndReset();
        }
      }
    }
  }
}