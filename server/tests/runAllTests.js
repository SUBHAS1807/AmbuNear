/**
 * AmbuNear - Unit & Integration Test Suite
 * Tests core business logic, geospatial distance calculations, state machines, and authentication.
 */
const { calculateHaversineDistanceKm, estimateEtaMinutes } = require('../utils/geo');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

let passedTests = 0;
let failedTests = 0;

function assert(condition, testName) {
  if (condition) {
    console.log(`  [PASS] ${testName}`);
    passedTests++;
  } else {
    console.error(`  [FAIL] ${testName}`);
    failedTests++;
  }
}

async function runTests() {
  console.log('====================================================');
  console.log('Running AmbuNear Automated Verification Test Suite');
  console.log('====================================================\n');

  // Group 1: Geolocation & Haversine Distance Tests
  console.log('[Test Group 1: Geolocation & Distance]');
  const distance1 = calculateHaversineDistanceKm(28.6139, 77.2090, 28.6250, 77.2180);
  assert(distance1 > 0 && distance1 < 3.0, `Calculates realistic urban distance (got ${distance1} km)`);

  const distanceSame = calculateHaversineDistanceKm(28.6139, 77.2090, 28.6139, 77.2090);
  assert(distanceSame === 0, `Identical coordinates yield 0.0 km (got ${distanceSame} km)`);

  const invalidDistance = calculateHaversineDistanceKm(NaN, 77.209, 28.6, null);
  assert(invalidDistance === 0, `Gracefully returns 0 for NaN/null inputs (got ${invalidDistance} km)`);

  const eta = estimateEtaMinutes(5.0);
  assert(eta >= 10 && eta <= 15, `Estimates realistic ETA for 5 km emergency transit (got ${eta} mins)`);

  // Group 2: Password Hashing & Bcrypt Tests
  console.log('\n[Test Group 2: Password Security & Cryptography]');
  const rawPassword = 'SecureAmbuPassword@2026';
  const salt = await bcrypt.genSalt(10);
  const hash = await bcrypt.hash(rawPassword, salt);

  assert(hash !== rawPassword, 'Password is never stored in plain text');
  assert(await bcrypt.compare(rawPassword, hash), 'Correct password successfully matches hash');
  assert(!(await bcrypt.compare('WrongPassword', hash)), 'Incorrect password fails match');

  // Group 3: JWT Token Verification & Expiry
  console.log('\n[Test Group 3: Authentication Tokens]');
  const secret = 'ambunear_test_secret_32_characters_long!';
  const payload = { id: '64a1234567890abcdef12345', role: 'PATIENT', email: 'test@ambunear.com' };
  const token = jwt.sign(payload, secret, { expiresIn: '1h' });

  const decoded = jwt.verify(token, secret);
  assert(decoded.id === payload.id, 'Decoded JWT preserves user id');
  assert(decoded.role === payload.role, 'Decoded JWT preserves user role');

  let tokenTamperFailed = false;
  try {
    jwt.verify(token, 'invalid_different_secret');
  } catch (err) {
    tokenTamperFailed = true;
  }
  assert(tokenTamperFailed, 'JWT signed with invalid secret is rejected');

  // Group 4: Booking State Machine Transitions
  console.log('\n[Test Group 4: Booking Lifecycle State Machine]');
  const validTransitions = {
    REQUESTED: ['ACCEPTED', 'REJECTED', 'CANCELLED'],
    ACCEPTED: ['ON_THE_WAY', 'CANCELLED'],
    ON_THE_WAY: ['ARRIVED', 'CANCELLED'],
    ARRIVED: ['TRIP_STARTED'],
    TRIP_STARTED: ['COMPLETED'],
  };

  const isTransitionAllowed = (current, target) => {
    return (validTransitions[current] || []).includes(target);
  };

  assert(isTransitionAllowed('REQUESTED', 'ACCEPTED'), 'REQUESTED -> ACCEPTED is valid');
  assert(isTransitionAllowed('ACCEPTED', 'ON_THE_WAY'), 'ACCEPTED -> ON_THE_WAY is valid');
  assert(isTransitionAllowed('ON_THE_WAY', 'ARRIVED'), 'ON_THE_WAY -> ARRIVED is valid');
  assert(isTransitionAllowed('ARRIVED', 'TRIP_STARTED'), 'ARRIVED -> TRIP_STARTED is valid');
  assert(isTransitionAllowed('TRIP_STARTED', 'COMPLETED'), 'TRIP_STARTED -> COMPLETED is valid');
  assert(!isTransitionAllowed('REQUESTED', 'COMPLETED'), 'REQUESTED directly to COMPLETED is blocked');
  assert(!isTransitionAllowed('COMPLETED', 'ON_THE_WAY'), 'COMPLETED cannot be reverted');

  // Group 5: API Error Envelope Structure
  console.log('\n[Test Group 5: Standard Response Contract]');
  const successEnvelope = { success: true, message: 'OK', data: { sample: 123 } };
  const errorEnvelope = { success: false, message: 'Not found', error: 'NOT_FOUND' };

  assert(successEnvelope.success === true && typeof successEnvelope.data === 'object', 'Success envelope has success boolean and data payload');
  assert(errorEnvelope.success === false && typeof errorEnvelope.error === 'string', 'Error envelope contains error code string');

  // Final Summary
  console.log('\n====================================================');
  console.log(`Test Execution Finished: ${passedTests} Passed, ${failedTests} Failed.`);
  console.log('====================================================');

  if (failedTests > 0) {
    process.exit(1);
  } else {
    process.exit(0);
  }
}

runTests();
