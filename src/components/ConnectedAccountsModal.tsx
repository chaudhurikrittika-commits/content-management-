import React from 'react';
import { X, CheckCircle2, AlertCircle, RefreshCw, ExternalLink, ShieldCheck } from 'lucide-react';
import { PlatformAccount, SocialPlatform } from '../types/index.ts';

interface ConnectedAccountsModalProps {
  isOpen: boolean;
  onClose: () => void;
  platformAccounts: PlatformAccount[];
  onToggleConnect: (platform: SocialPlatform) => void;
}

export const ConnectedAccountsModal: React.FC<ConnectedAccountsModalProps> = ({
  isOpen,
  onClose,
  platformAccounts,
  onToggleConnect
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-xl w-full p-6 shadow-2xl space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div>
            <h2 className="text-lg font-bold text-slate-900">Connected Social Networks</h2>
            <p className="text-xs text-slate-500">Manage OAuth API integrations and automated feed sync.</p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="space-y-3">
          {platformAccounts.map((account) => (
            <div
              key={account.platform}
              className="p-3.5 rounded-xl border border-slate-200 bg-slate-50/50 flex items-center justify-between gap-3 text-xs"
            >
              <div className="flex items-center gap-3">
                <img
                  src={account.avatar}
                  alt=""
                  className="w-10 h-10 rounded-full object-cover border border-slate-200"
                />
                <div>
                  <div className="flex items-center gap-1.5">
                    <span className="font-bold text-slate-900 capitalize text-sm">
                      {account.platform}
                    </span>
                    <span className="text-[11px] text-slate-500 font-mono">
                      {account.handle}
                    </span>
                  </div>
                  <div className="text-[11px] text-slate-500 mt-0.5">
                    {account.connected ? (
                      <span className="text-emerald-700 font-medium flex items-center gap-1">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                        Connected · {(account.followers / 1000).toFixed(1)}k audience · Synced {account.lastSynced}
                      </span>
                    ) : (
                      <span className="text-slate-400">Disconnected · Feed paused</span>
                    )}
                  </div>
                </div>
              </div>

              <div>
                <button
                  onClick={() => onToggleConnect(account.platform)}
                  className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                    account.connected
                      ? 'bg-slate-200 text-slate-700 hover:bg-slate-300'
                      : 'bg-indigo-600 text-white hover:bg-indigo-700'
                  }`}
                >
                  {account.connected ? 'Disconnect' : 'Connect Account'}
                </button>
              </div>
            </div>
          ))}
        </div>

        <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
          <div className="flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span>End-to-end encrypted API tokens with TLS 1.3</span>
          </div>
          <button
            onClick={onClose}
            className="px-4 py-1.5 bg-slate-900 text-white font-semibold rounded-lg hover:bg-slate-800"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
