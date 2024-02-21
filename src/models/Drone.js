export class Drone {
  constructor({name, maxWeight}) {
    this.name            = name;
    this.maxWeight       = maxWeight;
    this.remaingCapacity = maxWeight;
    this.trips           = [];
    this.completedTrips  = [];
  }

  canCarry(weight) {
    return this.remaingCapacity >= weight;
  }

  makeDelivery(location, weight) {
    this.remaingCapacity -= weight;
    this.trips.push(location);
  }

  applyCompletedTripAndReset() {
    this.completedTrips.push(this.trips);
    this.trips           = [];
    this.remaingCapacity = this.maxWeight;
  }
}