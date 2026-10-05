/**
 * Geolocation & Distance Utilities for AmbuNear
 */

/**
 * Calculates the great-circle distance between two geographic coordinates using the Haversine formula.
 * @param {number} lat1 - Latitude of coordinate 1 in degrees
 * @param {number} lon1 - Longitude of coordinate 1 in degrees
 * @param {number} lat2 - Latitude of coordinate 2 in degrees
 * @param {number} lon2 - Longitude of coordinate 2 in degrees
 * @returns {number} Distance in Kilometers (km) rounded to 1 decimal place
 */
const calculateHaversineDistanceKm = (lat1, lon1, lat2, lon2) => {
  if (
    lat1 === undefined ||
    lon1 === undefined ||
    lat2 === undefined ||
    lon2 === undefined ||
    isNaN(lat1) ||
    isNaN(lon1) ||
    isNaN(lat2) ||
    isNaN(lon2)
  ) {
    return 0;
  }

  const toRad = (value) => (value * Math.PI) / 180;
  const EARTH_RADIUS_KM = 6371; // Mean radius of the Earth in km

  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(lat1)) *
      Math.cos(toRad(lat2)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distance = EARTH_RADIUS_KM * c;

  return Math.round(distance * 10) / 10;
};

/**
 * Estimates arrival time in minutes based on distance and emergency speed
 * @param {number} distanceKm
 * @returns {number} ETA in minutes (minimum 2 minutes)
 */
const estimateEtaMinutes = (distanceKm) => {
  if (!distanceKm || distanceKm <= 0) return 3;
  // Assume average emergency speed of 30 km/h in urban traffic -> 2 mins per km + 2 min prep
  const minutes = Math.ceil((distanceKm / 30) * 60) + 2;
  return Math.max(2, minutes);
};

module.exports = {
  calculateHaversineDistanceKm,
  estimateEtaMinutes,
};
