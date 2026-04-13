import { Gavel, Globe, Cpu, CreditCard, Ship, RefreshCcw, ShieldAlert, MessageSquare, Scale, Terminal, CheckCircle2 } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Nexus Operating Guidelines | PixelMarket',
  description: 'Framework for operational engagement and system utilization within the PixelMarket Nexus ecosystem.',
};

export default function TerminosServicioPage() {
  return (
    <div className="min-h-screen bg-slate-950 py-20 px-4 relative overflow-hidden">
      {/* Background Decorative Elements */}
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none overflow-hidden">
        <div className="absolute bottom-[-10%] left-[-10%] w-[40%] h-[40%] bg-emerald-600/5 rounded-full blur-[120px]" />
        <div className="absolute top-[-10%] right-[-10%] w-[40%] h-[40%] bg-indigo-600/5 rounded-full blur-[120px]" />
      </div>

      <div className="max-w-4xl mx-auto relative z-10">
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center p-3 bg-emerald-500/10 rounded-2xl border border-emerald-500/20 mb-6 text-emerald-400">
            <Gavel size={32} />
          </div>
          <h1 className="text-5xl font-black text-white mb-4 tracking-tighter uppercase italic">
            Nexus <span className="text-emerald-500 tracking-normal">Operating Guidelines</span>
          </h1>
          <p className="text-slate-400 font-medium tracking-wide max-w-2xl mx-auto">
            Governing framework for resource utilization, asset acquisition, and system engagement within the PixelMarket ecosystem.
          </p>
        </div>
        
        <div className="bg-slate-900/50 backdrop-blur-xl rounded-[2.5rem] shadow-2xl p-8 md:p-12 border border-white/5 space-y-12">
          <section>
            <div className="flex items-center gap-4 mb-6">
              <div className="p-2 bg-emerald-500/20 rounded-lg text-emerald-400">
                <CheckCircle2 size={20} />
              </div>
              <h2 className="text-2xl font-black text-white uppercase tracking-tight italic">01. Operational Acceptance</h2>
            </div>
            <p className="text-slate-400 leading-relaxed font-medium">
              By initializing a session and engaging with the <strong>PixelMarket Nexus</strong> infrastructure, you acknowledge full compliance with these operational guidelines. Failure to adhere to these protocols will result in immediate session termination and identity blacklisting.
            </p>
          </section>

          <section>
            <div className="flex items-center gap-4 mb-6">
              <div className="p-2 bg-emerald-500/20 rounded-lg text-emerald-400">
                <Globe size={20} />
              </div>
              <h2 className="text-2xl font-black text-white uppercase tracking-tight italic">02. Infrastructure Ecosystem</h2>
            </div>
            <p className="text-slate-400 leading-relaxed font-medium mb-4">
              PixelMarket Nexus is a high-availability digital asset marketplace specializing in premium engineering resources, including:
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 ml-4">
              {[
                'Enterprise-grade code repositories',
                'Modular architectural templates',
                'Optimized UI/UX asset clusters',
                'Production-ready backend microservices',
                'Cloud-native deployment configurations'
              ].map((item, i) => (
                <div key={i} className="flex items-center gap-3">
                  <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                  <span className="text-slate-300 text-sm font-semibold">{item}</span>
                </div>
              ))}
            </div>
          </section>

          <section>
            <div className="flex items-center gap-4 mb-6">
              <div className="p-2 bg-emerald-500/20 rounded-lg text-emerald-400">
                <Cpu size={20} />
              </div>
              <h2 className="text-2xl font-black text-white uppercase tracking-tight italic">03. Entity Identification</h2>
            </div>
            <p className="text-slate-400 leading-relaxed font-medium mb-6">
              Access to core operational nodes requires valid entity initialization. You are solely responsible for:
            </p>
            <ul className="space-y-3 ml-4">
              <li className="flex gap-4">
                <span className="text-emerald-500 font-bold font-mono">/01</span>
                <span className="text-slate-300 text-sm font-semibold">Maintenance of access key confidentiality</span>
              </li>
              <li className="flex gap-4">
                <span className="text-emerald-500 font-bold font-mono">/02</span>
                <span className="text-slate-300 text-sm font-semibold">All unauthorized sub-routine execution under your identifier</span>
              </li>
              <li className="flex gap-4">
                <span className="text-emerald-500 font-bold font-mono">/03</span>
                <span className="text-slate-300 text-sm font-semibold">Prompt reporting of identity compromise to Nexus security</span>
              </li>
            </ul>
          </section>

          <section>
            <div className="flex items-center gap-4 mb-6">
              <div className="p-2 bg-emerald-500/20 rounded-lg text-emerald-400">
                <CreditCard size={20} />
              </div>
              <h2 className="text-2xl font-black text-white uppercase tracking-tight italic">04. Asset Acquisition & Valuation</h2>
            </div>
            <p className="text-slate-400 leading-relaxed font-medium mb-6">
              Valuation metrics for all Nexus assets are dynamic and subject to engineering overhead:
            </p>
            <div className="bg-black/30 p-6 rounded-3xl border border-white/5 space-y-4">
              <p className="text-xs text-slate-500 uppercase tracking-widest font-black">Acquisition Protocols:</p>
              <ul className="list-disc list-inside text-slate-300 text-sm space-y-2 font-semibold ml-2">
                <li>All valuations are expressed in USD (System Default)</li>
                <li>Nexus reserves the right to modify asset valuation without notification</li>
                <li>Digital assets may exhibit slight variances based on implementation context</li>
                <li>Availability is prioritized based on pull-request sequence</li>
              </ul>
            </div>
          </section>

          <section>
            <div className="flex items-center gap-4 mb-6">
              <div className="p-2 bg-emerald-500/20 rounded-lg text-emerald-400">
                <Ship size={20} />
              </div>
              <h2 className="text-2xl font-black text-white uppercase tracking-tight italic">05. Deployment & Logistics</h2>
            </div>
            <p className="text-slate-400 leading-relaxed font-medium mb-4">
              Asset distribution protocols follow global logistics standards:
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {[
                { title: 'Coverage', desc: 'Secure global asset distribution' },
                { title: 'Latency', desc: 'Estimated based on carrier throughput' },
                { title: 'Subsidies', desc: 'Enterprise tier includes free distribution' }
              ].map((item, i) => (
                <div key={i} className="p-4 bg-slate-800/40 rounded-2xl border border-white/5">
                  <span className="text-[10px] font-black text-emerald-500 uppercase tracking-widest block mb-1">{item.title}</span>
                  <span className="text-slate-300 text-xs font-bold leading-tight block">{item.desc}</span>
                </div>
              ))}
            </div>
          </section>

          <section>
            <div className="flex items-center gap-4 mb-6">
              <div className="p-2 bg-emerald-500/20 rounded-lg text-emerald-400">
                <RefreshCcw size={20} />
              </div>
              <h2 className="text-2xl font-black text-white uppercase tracking-tight italic">06. Integrity Rollback (Returns)</h2>
            </div>
            <p className="text-slate-400 leading-relaxed font-medium mb-4">
              Should an asset fail to meet architectural specifications:
            </p>
            <ul className="list-disc list-inside text-slate-300 text-sm space-y-2 font-semibold ml-4">
              <li>Initiate rollback request within 15 solar days from acquisition</li>
              <li>Assets must remain in "original/unused" state (no fork/modification)</li>
              <li>Customized architectural solutions are ineligible for rollback</li>
              <li>Logistics overhead for rollbacks is the responsibility of the entity</li>
            </ul>
          </section>

          <section>
            <div className="flex items-center gap-4 mb-6">
              <div className="p-2 bg-emerald-500/20 rounded-lg text-emerald-400">
                <ShieldAlert size={20} />
              </div>
              <h2 className="text-2xl font-black text-white uppercase tracking-tight italic">07. Intellectual Sovereignty</h2>
            </div>
            <p className="text-slate-400 leading-relaxed font-medium">
              All infrastructure components, codebase, identifiers, and architectural designs are the exclusive property of <strong>PixelMarket Nexus</strong> Core Operations or its upstream contributors. Unauthorized mirroring, distribution, or reverse-engineering is strictly prohibited.
            </p>
          </section>

          <section>
            <div className="flex items-center gap-4 mb-6">
              <div className="p-2 bg-emerald-500/20 rounded-lg text-emerald-400">
                <Scale size={20} />
              </div>
              <h2 className="text-2xl font-black text-white uppercase tracking-tight italic">08. Legal Jurisdiction</h2>
            </div>
            <p className="text-slate-400 leading-relaxed font-medium">
              These guidelines are governed by international tech commerce statutes. Any conflict resolution will be conducted via specialized arbitration terminals under global digital governance.
            </p>
          </section>

          <section>
            <div className="flex items-center gap-4 mb-6">
              <div className="p-2 bg-emerald-500/20 rounded-lg text-emerald-400">
                <Terminal size={20} />
              </div>
              <h2 className="text-2xl font-black text-white uppercase tracking-tight italic">09. Support & Oversight</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div className="p-6 bg-slate-800/40 rounded-3xl border border-white/5">
                <div className="flex items-center gap-3 mb-4 text-emerald-400">
                  <MessageSquare size={18} />
                  <span className="text-xs font-black uppercase tracking-widest">Support Node</span>
                </div>
                <p className="text-slate-400 text-sm font-semibold mb-1">ops@pixelmarket.tech</p>
                <p className="text-slate-500 text-[10px] font-black uppercase tracking-widest">Active Monitoring: 09:00 - 18:00 UTC</p>
              </div>
              <div className="flex items-center justify-center p-6 border-2 border-dashed border-white/5 rounded-3xl group hover:border-emerald-500/30 transition-colors">
                <p className="text-slate-600 text-[10px] font-black uppercase tracking-widest text-center">
                  By persisting in this environment, <br/>
                  you <span className="text-emerald-500">Agree</span> to the above.
                </p>
              </div>
            </div>
          </section>

          <div className="mt-12 pt-8 border-t border-white/5 flex justify-between items-center text-[10px] font-black text-slate-600 uppercase tracking-[0.2em]">
            <span>PixelMarket Core Architecture</span>
            <span>Last Synced: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }).toUpperCase()}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
