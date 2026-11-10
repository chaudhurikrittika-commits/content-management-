import test from 'node:test';
import assert from 'node:assert/strict';
import {
  encryptData,
  decryptData,
  generateTOTPCode,
  verifyTOTPCode,
  getTOTPSecondsRemaining,
  maskSensitiveValue
} from './crypto.ts';

test('E2EE AES-256-GCM encryption and decryption roundtrip', async () => {
  const secretData = 'Contract payout: $14,500 via Chase Wire Routing 021000021';
  const passphrase = 'SuperSecretCreatorPassphrase2026!';

  const encrypted = await encryptData(secretData, passphrase);
  assert.ok(encrypted.includes(':'), 'Encrypted output should contain salt:iv:ciphertext');
  assert.notEqual(encrypted, secretData, 'Encrypted output must not match plaintext');

  const decrypted = await decryptData(encrypted, passphrase);
  assert.equal(decrypted, secretData, 'Decrypted text should match original plaintext exactly');
});

test('E2EE decryption fails with incorrect passphrase', async () => {
  const secretData = 'Confidential sponsor notes';
  const correctPass = 'CorrectPass123!';
  const wrongPass = 'WrongPass999!';

  const encrypted = await encryptData(secretData, correctPass);
  
  await assert.rejects(
    async () => {
      await decryptData(encrypted, wrongPass);
    },
    /operation failed|OperationError/i
  );
});

test('TOTP generates 6-digit string and verifies current step', () => {
  const secret = 'OMNIVIBE_MFA_SECRET_CREATOR_KEY';
  const now = 1773000000000;
  const code = generateTOTPCode(secret, now);

  assert.equal(code.length, 6, 'TOTP code must be 6 digits');
  assert.match(code, /^[0-9]{6}$/, 'TOTP code must consist of digits only');

  const isValidCurrent = verifyTOTPCode(code, secret, now);
  assert.equal(isValidCurrent, true, 'Current code should verify successfully');

  // Verify within 1-step window (e.g. 15 seconds earlier)
  const isValidLeeway = verifyTOTPCode(code, secret, now + 15000);
  assert.equal(isValidLeeway, true, 'Code should verify within acceptable step window');

  // Fails with totally mismatched code
  const isInvalid = verifyTOTPCode('000000', secret, now);
  assert.equal(isInvalid, false, 'Invalid code should be rejected');
});

test('TOTP seconds remaining returns value between 1 and 30', () => {
  const remaining = getTOTPSecondsRemaining(Date.now(), 30);
  assert.ok(remaining >= 1 && remaining <= 30, 'Seconds remaining must be in [1, 30]');
});

test('Mask sensitive value masks strings and numbers', () => {
  assert.equal(maskSensitiveValue(15000), '$•••••• (Encrypted)');
  assert.equal(maskSensitiveValue(undefined), '••••••');
});
