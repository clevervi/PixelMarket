import type { Metadata } from 'next';
import { Shield, Lock, Eye, Users, Cookie, FileText, Mail, Info, Cpu, ArrowRight } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Operations Security Policy | PixelMarket Nexus',
  description: 'Enterprise-grade data protection and transparency protocols for PixelMarket Nexus operations.',
};

export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen bg-slate-950 py-20 px-4 relative overflow-hidden">
      {/* Background Decorative Elements */}
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none overflow-hidden">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-indigo-600/5 rounded-full blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-violet-600/5 rounded-full blur-[120px]" />
      </div>

      <div className="max-w-4xl mx-auto relative z-10">
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center p-3 bg-indigo-500/10 rounded-2xl border border-indigo-500/20 mb-6 text-indigo-400">
            <Shield size={32} />
          </div>
          <h1 className="text-5xl font-black text-white mb-4 tracking-tighter uppercase italic">
            Operations <span className="text-indigo-500 tracking-normal">Security Protocol</span>
          </h1>
          <p className="text-slate-400 font-medium tracking-wide max-w-2xl mx-auto">
            Our commitment to data integrity, transparency, and the protection of digital identities within the PixelMarket Nexus.
          </p>
        </div>
        
        <div className="bg-slate-900/50 backdrop-blur-xl rounded-[2.5rem] shadow-2xl p-8 md:p-12 border border-white/5 space-y-12">
          <section className="relative">
            <div className="flex items-center gap-4 mb-6">
              <div className="p-2 bg-indigo-500/20 rounded-lg text-indigo-400">
                <Info size={20} />
              </div>
              <h2 className="text-2xl font-black text-white uppercase tracking-tight italic">01. Data Acquisition Sequence</h2>
            </div>
            <p className="text-slate-400 leading-relaxed mb-6 font-medium">
              Within the <strong>PixelMarket Nexus</strong>, we synchronize identity identifiers that are voluntarily provided during operational sequences:
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 ml-4">
              {[
                'Nexus Entity Registration',
                'Asset Pull Request Execution',
                'Operational Support Communication',
                'System Update Subscription',
                'Deployment Review Submission'
              ].map((item, i) => (
                <div key={i} className="flex items-start gap-3 group">
                  <div className="w-1.5 h-1.5 rounded-full bg-indigo-500 mt-2 group-hover:scale-150 transition-transform" />
                  <span className="text-slate-300 text-sm font-semibold">{item}</span>
                </div>
              ))}
            </div>
            <p className="mt-6 text-slate-500 text-sm bg-black/30 p-4 rounded-xl border border-white/5 italic">
              Synchronized data includes: Legal identifiers, primary communication channels, distribution vectors (shipping), and cryptographic transaction keys (processed via secure gateway).
            </p>
          </section>

          <section>
            <div className="flex items-center gap-4 mb-6">
              <div className="p-2 bg-indigo-500/20 rounded-lg text-indigo-400">
                <Cpu size={20} />
              </div>
              <h2 className="text-2xl font-black text-white uppercase tracking-tight italic">02. Operational Utilization</h2>
            </div>
            <p className="text-slate-400 leading-relaxed mb-6 font-medium">
              Identity data is utilized to maintain system integrity and execute the following protocols:
            </p>
            <ul className="space-y-4 ml-4">
              {[
                { label: 'Process and coordinate asset deployments', icon: <ArrowRight size={14} /> },
                { label: 'Maintain encrypted communication channels', icon: <ArrowRight size={14} /> },
                { label: 'Optimize Nexus architectural performance', icon: <ArrowRight size={14} /> },
                { label: 'Execute proactive threat prevention and security filtering', icon: <ArrowRight size={14} /> },
                { label: 'Ensure compliance with regional data sovereignty laws', icon: <ArrowRight size={14} /> }
              ].map((item, i) => (
                <li key={i} className="flex items-center gap-3 text-slate-300 text-sm font-semibold">
                  <span className="text-indigo-500">{item.icon}</span>
                  {item.label}
                </li>
              ))}
            </ul>
          </section>

          <section>
            <div className="flex items-center gap-4 mb-6">
              <div className="p-2 bg-indigo-500/20 rounded-lg text-indigo-400">
                <Lock size={20} />
              </div>
              <h2 className="text-2xl font-black text-white uppercase tracking-tight italic">03. Fortification Measures</h2>
            </div>
            <p className="text-slate-400 leading-relaxed font-medium">
              We implement enterprise-grade cryptographic standards and tiered access control to safeguard operational data against:
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mt-6">
              {['Unauthorized Intrusions', 'Data Manipulation', 'Operational Leakage'].map((item, i) => (
                <div key={i} className="bg-black/20 p-4 rounded-2xl border border-white/5 text-center">
                  <span className="text-xs font-black text-indigo-400 uppercase tracking-widest">{item}</span>
                </div>
              ))}
            </div>
            <p className="mt-6 text-slate-500 text-xs italic">
              All financial synchronizations are processed via specialized gateways compliant with global SOC2 and PCI-DSS standards.
            </p>
          </section>

          <section>
            <div className="flex items-center gap-4 mb-6">
              <div className="p-2 bg-indigo-500/20 rounded-lg text-indigo-400">
                <Users size={20} />
              </div>
              <h2 className="text-2xl font-black text-white uppercase tracking-tight italic">04. External Synchronization</h2>
            </div>
            <p className="text-slate-400 leading-relaxed font-medium">
              We do not lease, trade, or expose your identity profile to third-party entities, with the following exceptions:
            </p>
            <ul className="list-disc list-inside mt-4 text-slate-300 space-y-2 ml-4 text-sm font-semibold">
              <li>Logistics operators necessary for physical asset distribution</li>
              <li>Compromise required by international legal mandates</li>
              <li>Verification sequences authorized by explicit entity consent</li>
            </ul>
          </section>

          <section>
            <div className="flex items-center gap-4 mb-6">
              <div className="p-2 bg-indigo-500/20 rounded-lg text-indigo-400">
                <Cookie size={20} />
              </div>
              <h2 className="text-2xl font-black text-white uppercase tracking-tight italic">05. Tracking Oscilloscopes (Cookies)</h2>
            </div>
            <p className="text-slate-400 leading-relaxed font-medium">
              The Nexus utilizes persistent state-tracking tokens to optimize interface latency, maintain session stability, and analyze traffic bandwidth. Entities may manage these tokens via browser terminal settings.
            </p>
          </section>

          <section>
            <div className="flex items-center gap-4 mb-6">
              <div className="p-2 bg-indigo-500/20 rounded-lg text-indigo-400">
                <FileText size={20} />
              </div>
              <h2 className="text-2xl font-black text-white uppercase tracking-tight italic">06. Entity Sovereignty</h2>
            </div>
            <p className="text-slate-400 leading-relaxed font-medium">
              In accordance with global Data Protection mandates (GDPR/CCPA/Habeas Data), every Nexus entity maintains the right to:
            </p>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mt-4">
              {['Profile Access', 'Data Rectification', 'Account Purge', 'Processing Objection', 'Consent Revocation'].map((right, i) => (
                <div key={i} className="px-4 py-2 bg-indigo-500/5 rounded-lg border border-indigo-500/10 text-[10px] font-black text-slate-300 uppercase tracking-widest text-center">
                  {right}
                </div>
              ))}
            </div>
          </section>

          <section>
            <div className="flex items-center gap-4 mb-6">
              <div className="p-2 bg-indigo-500/20 rounded-lg text-indigo-400">
                <Mail size={20} />
              </div>
              <h2 className="text-2xl font-black text-white uppercase tracking-tight italic">07. Support Terminal</h2>
            </div>
            <p className="text-slate-400 leading-relaxed mb-6 font-medium">
              For inquiries regarding identity security or data protection protocols, contact our oversight terminal:
            </p>
            <div className="bg-slate-800/50 p-6 rounded-3xl border border-white/5">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <span className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] block mb-1">Encrypted Mail</span>
                  <span className="text-indigo-400 font-bold">ops@pixelmarket.tech</span>
                </div>
                <div>
                  <span className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] block mb-1">Status Hotline</span>
                  <span className="text-slate-300 font-bold">+1 (555) NEXUS-OP</span>
                </div>
              </div>
            </div>
          </section>

          <div className="mt-12 pt-8 border-t border-white/5 flex justify-between items-center text-[10px] font-black text-slate-600 uppercase tracking-[0.2em]">
            <span>PixelMarket Nexus Engineering</span>
            <span>Revision: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }).toUpperCase()}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
