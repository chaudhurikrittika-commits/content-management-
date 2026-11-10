import React, { useState, useEffect } from 'react';
import {
  Shield,
  Lock,
  Unlock,
  Key,
  Smartphone,
  CheckCircle2,
  AlertCircle,
  Copy,
  Check,
  RefreshCw,
  Eye,
  EyeOff,
  Clock,
  Download,
  Terminal
} from 'lucide-react';
import { UserProfile, SecurityAuditEntry } from '../types/index.ts';
import {
  generateTOTPCode,
  verifyTOTPCode,
  getTOTPSecondsRemaining,
  encryptData,
  decryptData
} from '../utils/crypto.ts';

interface SecurityModalProps {
  currentUser: UserProfile;
  isVaultUnlocked: boolean;
  onToggleVaultLock: (passphrase: string, shouldUnlock: boolean) => Promise<boolean>;
  auditLogs: SecurityAuditEntry[];
  onAddAuditLog: (log: Omit<SecurityAuditEntry, 'id' | 'timestamp'>) => void;
}

export const SecurityModal: React.FC<SecurityModalProps> = ({
  currentUser,
  isVaultUnlocked,
  onToggleVaultLock,
  auditLogs,
  onAddAuditLog
}) => {
  const [activeTab, setActiveTab] = useState<'mfa' | 'e2ee' | 'audit'>('mfa');

  // MFA State
  const mfaSecret = 'OMNIVIBE_MFA_SECURE_2026_KEY';
  const [totpSecondsRemaining, setTotpSecondsRemaining] = useState(30);
  const [currentTOTPCode, setCurrentTOTPCode] = useState('');
  const [testCodeInput, setTestCodeInput] = useState('');
  const [mfaVerificationResult, setMfaVerificationResult] = useState<'success' | 'failed' | null>(null);

  // E2EE Vault Passphrase State
  const [passphraseInput, setPassphraseInput] = useState('CreatorVault2026!');
  const [vaultError, setVaultError] = useState<string | null>(null);
  const [isProcessingVault, setIsProcessingVault] = useState(false);

  // E2EE Sandbox Demo
  const [sandboxPlaintext, setSandboxPlaintext] = useState('Confidential Payout Wire: Chase Routing 021000021 Acct 88291048');
  const [sandboxCiphertext, setSandboxCiphertext] = useState('');
  const [sandboxDecrypted, setSandboxDecrypted] = useState('');
  const [isEncrypting, setIsEncrypting] = useState(false);

  // Backup codes
  const backupCodes = [
    'A9F2-4821', '8BC1-9920', '3DE7-1049', '5FA3-8271',
    '78E1-2940', '91A8-7732', '24C5-6610', '60D9-3814'
  ];
  const [copiedCode, setCopiedCode] = useState(false);

  // Live TOTP clock interval
  useEffect(() => {
    const updateTOTP = () => {
      const now = Date.now();
      setTotpSecondsRemaining(getTOTPSecondsRemaining(now, 30));
      setCurrentTOTPCode(generateTOTPCode(mfaSecret, now, 30));
    };

    updateTOTP();
    const interval = setInterval(updateTOTP, 1000);
    return () => clearInterval(interval);
  }, [mfaSecret]);

  // Test verify MFA code
  const handleVerifyTOTP = (e: React.FormEvent) => {
    e.preventDefault();
    const isValid = verifyTOTPCode(testCodeInput.trim(), mfaSecret);
    if (isValid) {
      setMfaVerificationResult('success');
      onAddAuditLog({
        userId: currentUser.id,
        userName: currentUser.name,
        action: 'MFA_CHALLENGE',
        status: 'SUCCESS',
        ipAddress: '192.168.1.104 (Verified session)',
        details: `TOTP Code ${testCodeInput.trim()} authenticated successfully`
      });
    } else {
      setMfaVerificationResult('failed');
      onAddAuditLog({
        userId: currentUser.id,
        userName: currentUser.name,
        action: 'MFA_CHALLENGE',
        status: 'FLAGGED',
        ipAddress: '192.168.1.104 (Session)',
        details: `Failed TOTP challenge attempt with code: ${testCodeInput.trim()}`
      });
    }
  };

  // Toggle Vault Lock/Unlock
  const handleVaultToggle = async () => {
    setIsProcessingVault(true);
    setVaultError(null);
    try {
      if (isVaultUnlocked) {
        // Lock
        await onToggleVaultLock('', false);
        onAddAuditLog({
          userId: currentUser.id,
          userName: currentUser.name,
          action: 'VAULT_LOCK',
          status: 'SUCCESS',
          ipAddress: '192.168.1.104',
          details: 'User locked AES-256-GCM zero-knowledge vault'
        });
      } else {
        // Unlock
        if (!passphraseInput) {
          setVaultError('Please provide master passphrase');
          setIsProcessingVault(false);
          return;
        }
        const success = await onToggleVaultLock(passphraseInput, true);
        if (success) {
          onAddAuditLog({
            userId: currentUser.id,
            userName: currentUser.name,
            action: 'VAULT_UNLOCK',
            status: 'SUCCESS',
            ipAddress: '192.168.1.104',
            details: 'Key derived via PBKDF2 (100,000 iterations); Vault unlocked'
          });
        } else {
          setVaultError('Failed to derive decryption key with provided passphrase');
        }
      }
    } catch (err: any) {
      setVaultError(err.message || 'Encryption error');
    } finally {
      setIsProcessingVault(false);
    }
  };

  // Run Sandbox Encryption
  const handleRunSandboxEncryption = async () => {
    setIsEncrypting(true);
    try {
      const encrypted = await encryptData(sandboxPlaintext, passphraseInput || 'CreatorVault2026!');
      setSandboxCiphertext(encrypted);
      const decrypted = await decryptData(encrypted, passphraseInput || 'CreatorVault2026!');
      setSandboxDecrypted(decrypted);
    } catch (e: any) {
      console.error(e);
    } finally {
      setIsEncrypting(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Security Header Banner */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-slate-900 text-white flex items-center justify-center font-bold">
            <Shield className="w-6 h-6 text-indigo-400" />
          </div>
          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
              Security, MFA & End-to-End Encryption
            </h1>
            <p className="text-xs text-slate-500 mt-0.5">
              Zero-knowledge client-side encryption (AES-256-GCM) & Multi-Factor Authentication (RFC 6238 TOTP).
            </p>
          </div>
        </div>

        {/* Global Security Status Indicators */}
        <div className="flex items-center gap-2">
          <div className="px-3 py-1.5 rounded-lg bg-emerald-50 border border-emerald-200 text-xs font-semibold text-emerald-800 flex items-center gap-1.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>MFA Protected</span>
          </div>

          <div
            className={`px-3 py-1.5 rounded-lg border text-xs font-semibold flex items-center gap-1.5 ${
              isVaultUnlocked
                ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                : 'bg-amber-50 text-amber-800 border-amber-200'
            }`}
          >
            {isVaultUnlocked ? (
              <>
                <Unlock className="w-4 h-4 text-emerald-600" />
                <span>E2EE Vault Open</span>
              </>
            ) : (
              <>
                <Lock className="w-4 h-4 text-amber-600" />
                <span>E2EE Vault Locked</span>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 pb-2">
        <button
          onClick={() => setActiveTab('mfa')}
          className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-semibold transition-colors ${
            activeTab === 'mfa' ? 'bg-slate-900 text-white' : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <Smartphone className="w-4 h-4" />
          <span>Multi-Factor Authentication</span>
        </button>

        <button
          onClick={() => setActiveTab('e2ee')}
          className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-semibold transition-colors ${
            activeTab === 'e2ee' ? 'bg-slate-900 text-white' : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <Lock className="w-4 h-4" />
          <span>E2EE Vault & Passphrase</span>
        </button>

        <button
          onClick={() => setActiveTab('audit')}
          className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-semibold transition-colors ${
            activeTab === 'audit' ? 'bg-slate-900 text-white' : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <Terminal className="w-4 h-4" />
          <span>Security Audit Log ({auditLogs.length})</span>
        </button>
      </div>

      {/* Tab 1: MFA */}
      {activeTab === 'mfa' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* TOTP Authenticator Generator */}
          <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <Smartphone className="w-4 h-4 text-indigo-600" />
                <h3 className="text-sm font-semibold text-slate-900">
                  Live Authenticator Token (TOTP)
                </h3>
              </div>
              <span className="text-[11px] text-emerald-600 font-semibold bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                Active & Rotating
              </span>
            </div>

            <p className="text-xs text-slate-600 leading-relaxed">
              Compatible with Google Authenticator, Authy, and 1Password. A new 6-digit cryptographic token is generated every 30 seconds based on RFC 6238.
            </p>

            {/* Rotating 6-digit display */}
            <div className="p-4 rounded-xl bg-slate-900 text-white flex flex-col items-center justify-center space-y-2">
              <span className="text-[11px] text-slate-400 uppercase tracking-widest font-mono">
                Current 6-Digit Authenticator Passcode
              </span>
              <div className="text-4xl font-mono font-bold tracking-widest text-indigo-300">
                {currentTOTPCode.slice(0, 3)} {currentTOTPCode.slice(3)}
              </div>

              {/* Progress bar for 30s step */}
              <div className="w-full max-w-xs mt-2 space-y-1">
                <div className="flex justify-between text-[10px] text-slate-400 font-mono">
                  <span>Rotating in</span>
                  <span>{totpSecondsRemaining}s</span>
                </div>
                <div className="w-full bg-slate-800 rounded-full h-1.5 overflow-hidden">
                  <div
                    className="bg-indigo-500 h-full transition-all duration-1000 ease-linear rounded-full"
                    style={{ width: `${(totpSecondsRemaining / 30) * 100}%` }}
                  />
                </div>
              </div>
            </div>

            {/* Interactive Code Validator */}
            <form onSubmit={handleVerifyTOTP} className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-3">
              <label className="text-xs font-semibold text-slate-800 block">
                Test Authenticator Challenge:
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  maxLength={6}
                  value={testCodeInput}
                  onChange={(e) => setTestCodeInput(e.target.value)}
                  placeholder="Enter 6-digit code"
                  className="w-full px-3 py-2 text-sm font-mono tracking-wider border border-slate-200 rounded-lg bg-white"
                />
                <button
                  type="submit"
                  className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-semibold whitespace-nowrap transition-colors"
                >
                  Verify Code
                </button>
              </div>

              {mfaVerificationResult === 'success' && (
                <div className="p-2.5 bg-emerald-50 border border-emerald-200 rounded-lg text-xs text-emerald-800 flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                  <span>Passcode verified! MFA identity successfully authenticated.</span>
                </div>
              )}
              {mfaVerificationResult === 'failed' && (
                <div className="p-2.5 bg-red-50 border border-red-200 rounded-lg text-xs text-red-800 flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 text-red-600 flex-shrink-0" />
                  <span>Invalid or expired code. Please use the current 6-digit token.</span>
                </div>
              )}
            </form>
          </div>

          {/* Backup Recovery Codes */}
          <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs space-y-4 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <div className="flex items-center gap-2">
                  <Key className="w-4 h-4 text-indigo-600" />
                  <h3 className="text-sm font-semibold text-slate-900">
                    Emergency Backup Recovery Codes
                  </h3>
                </div>
                <span className="text-xs text-slate-500">8 Remaining</span>
              </div>

              <p className="text-xs text-slate-600 mt-2">
                If you ever lose access to your primary authenticator device, you can use one of these one-time backup recovery codes to log into OmniVibe Studio.
              </p>

              <div className="grid grid-cols-2 gap-2 mt-4">
                {backupCodes.map((code) => (
                  <div
                    key={code}
                    className="p-2.5 bg-slate-50 rounded-lg border border-slate-200 font-mono text-xs text-slate-800 text-center font-bold"
                  >
                    {code}
                  </div>
                ))}
              </div>
            </div>

            <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
              <span className="text-[11px] text-slate-500">
                Store in an encrypted password manager.
              </span>
              <button
                onClick={() => {
                  navigator.clipboard.writeText(backupCodes.join('\n'));
                  setCopiedCode(true);
                  setTimeout(() => setCopiedCode(false), 2000);
                }}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-lg transition-colors"
              >
                {copiedCode ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedCode ? 'Copied' : 'Copy All Codes'}</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: E2EE Vault */}
      {activeTab === 'e2ee' && (
        <div className="space-y-6">
          {/* Master Key Controls */}
          <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div>
                <h3 className="text-sm font-semibold text-slate-900 flex items-center gap-2">
                  <Lock className="w-4 h-4 text-indigo-600" />
                  <span>Client-Side Master Passphrase & Vault State</span>
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Protects sensitive sponsorship wire instructions, brand financial deals, and contract terms.
                </p>
              </div>

              <div
                className={`px-3 py-1 rounded-full text-xs font-bold uppercase ${
                  isVaultUnlocked
                    ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                    : 'bg-amber-50 text-amber-700 border border-amber-200'
                }`}
              >
                {isVaultUnlocked ? 'Vault Unlocked' : 'Vault Locked'}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="sm:col-span-2">
                <label className="text-xs font-semibold text-slate-700 block mb-1">
                  Master Vault Passphrase (PBKDF2 SHA-256 100K Iterations)
                </label>
                <input
                  type="password"
                  value={passphraseInput}
                  onChange={(e) => setPassphraseInput(e.target.value)}
                  placeholder="Enter vault passphrase"
                  className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg focus:outline-hidden focus:border-indigo-500"
                />
              </div>

              <div className="flex items-end">
                <button
                  onClick={handleVaultToggle}
                  disabled={isProcessingVault}
                  className={`w-full py-2 px-4 rounded-lg text-xs font-semibold text-white transition-all shadow-sm ${
                    isVaultUnlocked
                      ? 'bg-slate-800 hover:bg-slate-900'
                      : 'bg-emerald-600 hover:bg-emerald-700'
                  }`}
                >
                  {isProcessingVault
                    ? 'Processing...'
                    : isVaultUnlocked
                    ? 'Lock E2EE Vault'
                    : 'Unlock E2EE Vault'}
                </button>
              </div>
            </div>

            {vaultError && (
              <div className="p-3 bg-red-50 text-red-800 border border-red-200 rounded-lg text-xs">
                {vaultError}
              </div>
            )}
          </div>

          {/* Interactive Cryptographic Demonstration Sandbox */}
          <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="text-sm font-semibold text-slate-900 flex items-center gap-2">
                <Key className="w-4 h-4 text-indigo-600" />
                <span>Zero-Knowledge AES-256-GCM Live Sandbox</span>
              </h3>
              <button
                onClick={handleRunSandboxEncryption}
                disabled={isEncrypting}
                className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-semibold transition-colors"
              >
                {isEncrypting ? 'Encrypting...' : 'Test Encrypt & Decrypt'}
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="font-semibold text-slate-700 block mb-1">Plaintext Input Data:</label>
                <input
                  type="text"
                  value={sandboxPlaintext}
                  onChange={(e) => setSandboxPlaintext(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg text-xs font-mono"
                />
              </div>

              {sandboxCiphertext && (
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">
                    Encrypted Payload (SaltBase64 : IVBase64 : CiphertextBase64):
                  </label>
                  <div className="p-3 bg-slate-900 text-indigo-300 font-mono text-[11px] rounded-lg break-all select-all">
                    {sandboxCiphertext}
                  </div>
                </div>
              )}

              {sandboxDecrypted && (
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">
                    Decrypted Plaintext Verified:
                  </label>
                  <div className="p-2.5 bg-emerald-50 text-emerald-900 border border-emerald-200 font-mono text-xs rounded-lg">
                    {sandboxDecrypted}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Tab 3: Security Audit Log */}
      {activeTab === 'audit' && (
        <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
          <div className="p-4 bg-slate-50/80 border-b border-slate-200 font-semibold text-xs text-slate-700 flex items-center justify-between">
            <span>Immutable Workspace Security Event Log</span>
            <span className="text-[11px] text-slate-500 font-normal">Real-time surveillance</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-slate-200 text-slate-500 font-semibold">
                  <th className="py-2.5 px-4">Timestamp</th>
                  <th className="py-2.5 px-3">User</th>
                  <th className="py-2.5 px-3">Action Type</th>
                  <th className="py-2.5 px-3">Status</th>
                  <th className="py-2.5 px-3">Origin IP / Location</th>
                  <th className="py-2.5 px-4">Event Details</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {auditLogs.map((log) => (
                  <tr key={log.id} className="hover:bg-slate-50/60 font-mono text-[11px]">
                    <td className="py-2.5 px-4 text-slate-600">
                      {new Date(log.timestamp).toLocaleTimeString([], {
                        hour: '2-digit',
                        minute: '2-digit',
                        second: '2-digit'
                      })}
                    </td>
                    <td className="py-2.5 px-3 font-semibold text-slate-900">{log.userName}</td>
                    <td className="py-2.5 px-3 font-bold text-indigo-700">{log.action}</td>
                    <td className="py-2.5 px-3">
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                          log.status === 'SUCCESS'
                            ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                            : 'bg-red-50 text-red-700 border border-red-200'
                        }`}
                      >
                        {log.status}
                      </span>
                    </td>
                    <td className="py-2.5 px-3 text-slate-500">{log.ipAddress}</td>
                    <td className="py-2.5 px-4 text-slate-700">{log.details}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
