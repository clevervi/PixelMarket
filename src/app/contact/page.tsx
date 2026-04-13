"use client";

import { useState } from "react";

export default function ContactoPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });

  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Inbound payload received:", formData);
    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      setFormData({ name: "", email: "", message: "" });
    }, 5000);
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <div className="bg-slate-950 min-h-screen text-slate-100 selection:bg-primary/30">
      <div className="container mx-auto px-4 py-24 relative overflow-hidden">
        {/* Background Ambient Effects */}
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-primary/10 rounded-full blur-[180px] -z-10" />
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-accent/5 rounded-full blur-[150px] -z-10" />

        <div className="text-center mb-16 relative z-10">
          <h1 className="text-5xl md:text-7xl font-black mb-4 tracking-tighter text-white">
            Communications<span className="text-primary">.</span>Terminal
          </h1>
          <p className="text-slate-400 text-lg font-medium max-w-2xl mx-auto uppercase tracking-[0.2em]">
            Establish a high-bandwidth connection with our technical ops.
          </p>
        </div>

        <div className="max-w-6xl mx-auto">
          <div className="grid lg:grid-cols-5 gap-12 mb-16">
            {/* Contact Information Cards */}
            <div className="lg:col-span-2 space-y-6">
              <div className="bg-white/5 border border-white/10 backdrop-blur-xl rounded-3xl p-10 group hover:border-primary/50 transition-all duration-300">
                <h2 className="text-[10px] font-black uppercase tracking-[0.4em] mb-10 text-primary">Node_Contact_Directory</h2>

                <div className="space-y-10">
                  <div className="group/item">
                    <h3 className="text-xs font-black uppercase tracking-widest text-slate-500 mb-2 group-hover/item:text-primary transition-colors">
                      Inbound Protocols
                    </h3>
                    <p className="text-xl font-bold text-white tracking-tight">ops@pixelmarket.tech</p>
                  </div>

                  <div className="group/item">
                    <h3 className="text-xs font-black uppercase tracking-widest text-slate-500 mb-2 group-hover/item:text-primary transition-colors">
                      Nexus Location
                    </h3>
                    <p className="text-xl font-bold text-white tracking-tight">Distributed Network / SF Node</p>
                  </div>

                  <div className="group/item">
                    <h3 className="text-xs font-black uppercase tracking-widest text-slate-500 mb-2 group-hover/item:text-primary transition-colors">
                      Operational Uplink
                    </h3>
                    <p className="text-slate-300 font-medium leading-relaxed">
                      Mon - Fri: 0800 - 1800 UTC<br />
                      Sat: 1000 - 1400 UTC Special Ops
                    </p>
                  </div>
                </div>

                <div className="mt-16 pt-10 border-t border-white/5">
                  <h3 className="text-xs font-black uppercase tracking-widest text-primary mb-6">
                    Professional Standards
                  </h3>
                  <ul className="space-y-4 text-slate-400 font-medium text-sm">
                    <li className="flex items-center gap-3">
                      <div className="h-1 w-1 rounded-full bg-emerald-500" />
                      Enterprise-Grade Asset Deployment
                    </li>
                    <li className="flex items-center gap-3">
                      <div className="h-1 w-1 rounded-full bg-emerald-500" />
                      SLA-Backed Technical Support
                    </li>
                    <li className="flex items-center gap-3">
                      <div className="h-1 w-1 rounded-full bg-emerald-500" />
                      Zero-Knowledge Privacy Policy
                    </li>
                    <li className="flex items-center gap-3">
                      <div className="h-1 w-1 rounded-full bg-emerald-500" />
                      Secure Global Distribution
                    </li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Contact Form Terminal */}
            <div className="lg:col-span-3">
              <div className="bg-white/5 border border-white/10 backdrop-blur-xl rounded-[2.5rem] p-10 md:p-14 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full blur-3xl -mr-16 -mt-16" />
                
                <h2 className="text-3xl font-black mb-10 text-white tracking-tight">
                  Initialize <span className="text-primary italic">Inbound_Buffer</span>
                </h2>

                {submitted ? (
                  <div className="mb-10 p-6 bg-emerald-500/10 border border-emerald-500/30 rounded-2xl flex items-center gap-4 text-emerald-400 animate-in fade-in slide-in-from-top-4 duration-500">
                    <div className="h-10 w-10 rounded-full bg-emerald-500 text-slate-950 flex items-center justify-center font-black">✓</div>
                    <div>
                      <p className="font-black uppercase tracking-widest text-xs mb-1">Packet Transmitted Successfully</p>
                      <p className="text-sm font-medium opacity-80">Syncing with response nodes. Standby for operational update.</p>
                    </div>
                  </div>
                ) : null}

                <form onSubmit={handleSubmit} className="space-y-8">
                  <div className="grid md:grid-cols-2 gap-8">
                    <div className="space-y-2">
                      <label htmlFor="name" className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-4">
                        Sender_Identity
                      </label>
                      <input
                        type="text"
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        required
                        className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-white focus:outline-none focus:border-primary/50 focus:ring-4 focus:ring-primary/10 transition-all font-medium placeholder:text-slate-600"
                        placeholder="e.g. Lead Architect"
                      />
                    </div>

                    <div className="space-y-2">
                      <label htmlFor="email" className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-4">
                        Delivery_Node
                      </label>
                      <input
                        type="email"
                        id="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                        className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-white focus:outline-none focus:border-primary/50 focus:ring-4 focus:ring-primary/10 transition-all font-medium placeholder:text-slate-600"
                        placeholder="architect@nexus.tech"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label htmlFor="message" className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-4">
                      Payload_Data
                    </label>
                    <textarea
                      id="message"
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      required
                      rows={6}
                      className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-white focus:outline-none focus:border-primary/50 focus:ring-4 focus:ring-primary/10 transition-all font-medium resize-none placeholder:text-slate-600"
                      placeholder="Specify your technical requirements or system queries..."
                    />
                  </div>

                  <button 
                    type="submit" 
                    className="w-full bg-primary hover:bg-primary/90 text-white font-black uppercase tracking-[0.3em] py-5 rounded-2xl transition-all duration-300 shadow-xl shadow-primary/20 hover:shadow-primary/30 active:scale-[0.98]"
                  >
                    Execute Connection
                  </button>
                </form>
              </div>
            </div>
          </div>

          {/* Auxiliary Operations Info */}
          <div className="bg-white/5 border border-white/10 rounded-[2.5rem] p-12 md:p-20 text-center relative overflow-hidden group">
            <div className="absolute inset-0 bg-gradient-to-r from-primary/5 via-transparent to-accent/5 opacity-0 group-hover:opacity-100 transition-opacity duration-1000" />
            <div className="relative z-10">
              <h2 className="text-4xl font-black mb-6 text-white tracking-tight">
                System Status: <span className="text-emerald-500">Fully Operational</span>
              </h2>
              <p className="text-lg text-slate-400 font-medium max-w-2xl mx-auto leading-relaxed mb-10">
                Our infrastructure is architected for maximum transparency. If you have specific queries regarding our digital asset standards or security protocols, our engineering team is available for deep-dive technical consultations.
              </p>
              <div className="flex justify-center gap-12">
                <div className="text-center">
                  <p className="text-3xl font-black text-white mb-1">99.9%</p>
                  <p className="text-[10px] font-black uppercase tracking-widest text-primary">SLA_Uptime</p>
                </div>
                <div className="h-12 w-px bg-white/10" />
                <div className="text-center">
                  <p className="text-3xl font-black text-white mb-1">&lt; 15m</p>
                  <p className="text-[10px] font-black uppercase tracking-widest text-primary">Avg_Response</p>
                </div>
                <div className="h-12 w-px bg-white/10" />
                <div className="text-center">
                  <p className="text-3xl font-black text-white mb-1">24/7</p>
                  <p className="text-[10px] font-black uppercase tracking-widest text-primary">Sys_Monitoring</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
