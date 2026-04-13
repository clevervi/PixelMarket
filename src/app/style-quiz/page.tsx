'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { FaCheckCircle, FaArrowRight, FaArrowLeft, FaMicrochip, FaShieldAlt, FaLayerGroup, FaCode } from 'react-icons/fa';
import { toast } from 'react-hot-toast';

interface Question {
  id: number;
  question: string;
  icon: React.ReactNode;
  options: {
    label: string;
    value: string;
    style: 'Power' | 'Reliability' | 'Integrity' | 'Efficiency';
  }[];
}

const questions: Question[] = [
  {
    id: 1,
    question: "What is your primary objective for this Nexus initialization?",
    icon: <FaLayerGroup className="text-indigo-400" />,
    options: [
      { label: "Design a high-impact, feature-rich interface for users.", value: "Efficiency", style: 'Efficiency' },
      { label: "Build a resilient, high-performance back-end infrastructure.", value: "Reliability", style: 'Reliability' },
      { label: "Preserve and optimize critical legacy system architectures.", value: "Integrity", style: 'Integrity' },
      { label: "Create a balanced, end-to-end fullstack ecosystem.", value: "Power", style: 'Power' },
    ],
  },
  {
    id: 2,
    question: "Which architectural pattern resonates most with your current stack?",
    icon: <FaCode className="text-emerald-400" />,
    options: [
      { label: "Edge-first deployment with lightning-fast response times.", value: "Efficiency", style: 'Efficiency' },
      { label: "Distributed clusters with maximum fault tolerance.", value: "Reliability", style: 'Reliability' },
      { label: "Monolithic stability with deep structural integrity.", value: "Integrity", style: 'Integrity' },
      { label: "Dynamic microservices for scalable power delivery.", value: "Power", style: 'Power' },
    ],
  },
  {
    id: 3,
    question: "Which performance metric is most critical to your system throughput?",
    icon: <FaMicrochip className="text-blue-400" />,
    options: [
      { label: "Visual rendering speed and immediate logic feedback.", value: "Efficiency", style: 'Efficiency' },
      { label: "Raw computational stability and 99.99% uptime.", value: "Reliability", style: 'Reliability' },
      { label: "Historical data preservation and cryptographic truth.", value: "Integrity", style: 'Integrity' },
      { label: "Peak request handling and high-concurrency scaling.", value: "Power", style: 'Power' },
    ],
  },
  {
    id: 4,
    question: "In which environment do you primarily deploy your assets?",
    icon: <FaShieldAlt className="text-amber-400" />,
    options: [
      { label: "Cloud-native serverless environments for maximum agility.", value: "Efficiency", style: 'Efficiency' },
      { label: "Global infrastructure clusters with multi-region support.", value: "Reliability", style: 'Reliability' },
      { label: "On-premise secure vaults with strictly controlled logic.", value: "Integrity", style: 'Integrity' },
      { label: "A hybrid ecosystem balancing old and new deployments.", value: "Power", style: 'Power' },
    ],
  },
  {
    id: 5,
    question: "Which asset category would benefit your repository most?",
    icon: <FaLayerGroup className="text-pink-400" />,
    options: [
      { label: "Premium UI Kits and design components for fast output.", value: "Efficiency", style: 'Efficiency' },
      { label: "Robust infrastructure templates and hardware specs.", value: "Reliability", style: 'Reliability' },
      { label: "Core logic modules and historical architecture schemas.", value: "Integrity", style: 'Integrity' },
      { label: "Integrated full-stack blueprints for total system power.", value: "Power", style: 'Power' },
    ],
  },
];

const styleProfiles = {
  Power: {
    name: "System Architect (Power)",
    description: "You thrive on high-concurrency, scalable systems. Your philosophy is built on raw power and multi-service orchestration.",
    products: [
      { id: 'p1', name: 'High-Performance Cluster', image_url: '/assets/assets11/sombrero-vueltiao.webp' },
      { id: 'p2', name: 'Scalable Node Blueprint', image_url: '/assets/assets11/mochila.webp' },
    ],
    color: 'from-indigo-600 to-blue-800'
  },
  Reliability: {
    name: "Infrastructure Engineer (Reliability)",
    description: "Stability is your primary directive. You prefer resilient, fault-tolerant architectures that handle any load with grace.",
    products: [
      { id: 'r1', name: 'Fault-Tolerant Module', image_url: '/assets/assets1/macrame-matrimonial.webp' },
      { id: 'r2', name: 'Global Cluster Spec', image_url: '/assets/assets1/hamaca-personal.webp' },
    ],
    color: 'from-emerald-600 to-teal-800'
  },
  Integrity: {
    name: "System Preservationist (Integrity)",
    description: "You value structural depth and the heritage of stable code. You prioritize security, truth, and monolithic reliability.",
    products: [
      { id: 'i1', name: 'Security Protocol Alpha', image_url: '/assets/assets2/caña-flecha.webp' },
      { id: 'i2', name: 'Core Heritage Logic', image_url: '/assets/assets1/hamaca-nombre.webp' },
    ],
    color: 'from-slate-600 to-slate-900'
  },
  Efficiency: {
    name: "Frontend Strategist (Efficiency)",
    description: "Speed and user perception are your benchmarks. You build lightning-fast interfaces that represent the pinnacle of modern UX.",
    products: [
      { id: 'e1', name: 'Next-Gen UI Kit', image_url: '/assets/assets3/contemporanea.webp' },
      { id: 'e2', name: 'Dynamic Logic Component', image_url: '/assets/assets1/hamaca-premium.webp' },
    ],
    color: 'from-indigo-400 to-purple-600'
  }
};

export default function StyleQuizPage() {
  const router = useRouter();
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<{ [key: number]: string }>({});
  const [showResults, setShowResults] = useState(false);
  const [showSuggestionForm, setShowSuggestionForm] = useState(false);
  const [suggestion, setSuggestion] = useState('');

  const handleAnswer = (value: string) => {
    const newAnswers = { ...answers, [currentQuestion]: value };
    setAnswers(newAnswers);
  };

  const handleNext = () => {
    if (!answers[currentQuestion]) {
      toast.error('Please select an option before proceeding.');
      return;
    }

    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion((prev) => prev + 1);
    } else {
      calculateResults();
    }
  };

  const handlePrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion((prev) => prev - 1);
    }
  };

  const calculateResults = () => {
    setShowResults(true);
  };

  const getDominantStyle = () => {
    const counts = { Power: 0, Reliability: 0, Integrity: 0, Efficiency: 0 };
    Object.values(answers).forEach(answer => {
      counts[answer as keyof typeof counts]++;
    });

    return Object.entries(counts).reduce((a, b) => 
      counts[a[0] as keyof typeof counts] > counts[b[0] as keyof typeof counts] ? a : b
    )[0] as keyof typeof styleProfiles;
  };

  const handleSubmitSuggestion = (e: React.FormEvent) => {
    e.preventDefault();
    if (!suggestion.trim()) {
      toast.error('Please input your requirements.');
      return;
    }
    toast.success('System optimization requirements received.');
    setSuggestion('');
    setShowSuggestionForm(false);
  };

  const progress = ((currentQuestion + 1) / questions.length) * 100;

  if (showResults) {
    const dominantStyle = getDominantStyle();
    const profile = styleProfiles[dominantStyle];

    return (
      <div className="min-h-screen bg-slate-950 text-white py-12">
        <div className="max-w-4xl mx-auto px-4">
          <div className="text-center mb-12">
            <div className="inline-flex items-center justify-center w-24 h-24 bg-indigo-500/20 rounded-2xl mb-6 border border-indigo-500/30">
              <FaCheckCircle className="text-indigo-400 text-5xl" />
            </div>
            <h1 className="text-5xl font-black mb-4 tracking-tight">Initialization Complete</h1>
            <div className={`inline-block bg-gradient-to-r ${profile.color} text-white px-8 py-3 rounded-xl text-2xl font-black shadow-lg shadow-indigo-500/20`}>
              {profile.name}
            </div>
          </div>

          <div className="bg-slate-900 border border-white/10 rounded-2xl shadow-2xl p-10 mb-8 glass-morphism">
            <p className="text-xl text-slate-300 text-center mb-8 leading-relaxed">
              {profile.description}
            </p>
            
            <div className="border-t border-white/5 pt-8">
              <h2 className="text-3xl font-black text-white mb-6 text-center">
                Recommended Nexus Assets
              </h2>
              <p className="text-slate-400 text-center mb-10">
                Based on your tactical data, we recommend initializing these core assets:
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
                {profile.products.map((product, index) => (
                  <div key={index} className="bg-slate-800/50 border border-white/5 rounded-xl shadow-md overflow-hidden hover:bg-slate-800 transition-all flex items-center p-4">
                    <div className="w-24 h-24 bg-slate-700 rounded-lg relative overflow-hidden flex-shrink-0">
                      <img 
                        src={product.image_url} 
                        alt={product.name}
                        className="w-full h-full object-cover grayscale brightness-75"
                        onError={(e) => {
                          e.currentTarget.src = '/assets/assets11/sombrero-vueltiao.webp';
                        }}
                      />
                    </div>
                    <div className="ml-6 py-2">
                      <p className="text-lg font-bold text-white mb-2">{product.name}</p>
                      <button className="text-indigo-400 text-sm font-bold flex items-center gap-2 hover:text-indigo-300">
                        View Schema <FaArrowRight />
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              <div className="flex gap-4 justify-center">
                <button
                  onClick={() => router.push('/shop')}
                  className="px-10 py-4 bg-indigo-600 text-white rounded-xl font-bold text-lg hover:bg-indigo-500 transition-all shadow-lg shadow-indigo-600/30"
                >
                  Confirm Deployment
                </button>
                <button
                  onClick={() => {
                    setShowResults(false);
                    setCurrentQuestion(0);
                    setAnswers({});
                  }}
                  className="px-10 py-4 bg-slate-800 border border-white/10 text-white rounded-xl font-bold text-lg hover:bg-slate-700 transition-all"
                >
                  Restart Protocol
                </button>
              </div>
            </div>
          </div>

          <div className="bg-slate-900/50 border border-white/5 rounded-2xl p-10 text-center">
            <h3 className="text-2xl font-black text-white mb-4">
              Submit Custom Specs
            </h3>
            <p className="text-slate-400 mb-8">
              Are you missing specific architectural assets? Inform the Nexus.
            </p>
            
            {!showSuggestionForm ? (
              <button
                onClick={() => setShowSuggestionForm(true)}
                className="w-full px-8 py-4 bg-slate-800 border border-white/10 text-slate-300 rounded-xl font-bold hover:text-white hover:bg-slate-700 transition-all"
              >
                Open Terminal Input
              </button>
            ) : (
              <form onSubmit={handleSubmitSuggestion} className="space-y-4">
                <textarea
                  value={suggestion}
                  onChange={(e) => setSuggestion(e.target.value)}
                  placeholder="Input custom system requirements or desired tech assets..."
                  className="w-full px-6 py-4 bg-slate-950 border border-white/10 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-white resize-none"
                  rows={4}
                  required
                />
                <div className="flex gap-4">
                  <button
                    type="submit"
                    className="flex-1 px-8 py-4 bg-indigo-600 text-white rounded-xl font-bold hover:bg-indigo-500 transition-all"
                  >
                    Transmit Specs
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowSuggestionForm(false)}
                    className="px-8 py-4 bg-slate-800 text-slate-400 rounded-xl font-bold hover:text-white transition-all"
                  >
                    Abort
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>
    );
  }

  const question = questions[currentQuestion];

  return (
    <div className="min-h-screen bg-slate-950 text-white py-12 selection:bg-indigo-500/30">
      <div className="max-w-3xl mx-auto px-4">
        <div className="text-center mb-12">
          <h1 className="text-5xl font-black mb-4 tracking-tighter">Nexus Initialization Protocol</h1>
          <p className="text-slate-400 text-xl font-medium">Audit your environment to determine the optimal asset configuration.</p>
        </div>

        <div className="mb-12">
          <div className="flex justify-between text-sm font-bold text-slate-500 mb-3 uppercase tracking-widest">
            <span>Question {currentQuestion + 1} / {questions.length}</span>
            <span>{Math.round(progress)}% Optimized</span>
          </div>
          <div className="w-full bg-slate-900 rounded-full h-3 border border-white/5 overflow-hidden">
            <div 
              className="bg-indigo-500 h-full shadow-[0_0_15px_#6366f1] transition-all duration-700 ease-in-out"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        <div className="bg-slate-900 border border-white/10 rounded-3xl shadow-2xl p-10 mb-8 relative glass-morphism overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/5 blur-3xl rounded-full -mr-16 -mt-16" />
          
          <div className="flex flex-col items-center mb-10">
            <div className="w-20 h-20 bg-slate-800 border border-white/5 rounded-2xl flex items-center justify-center text-4xl mb-6 shadow-inner">
              {question.icon}
            </div>
            <h2 className="text-3xl font-black text-center text-white leading-tight">
              {question.question}
            </h2>
          </div>

          <div className="space-y-4 mb-10">
            {question.options.map((option) => (
              <button
                key={option.value}
                onClick={() => handleAnswer(option.value)}
                className={`w-full p-6 rounded-2xl border-2 transition-all text-left flex items-center gap-5 group ${
                  answers[currentQuestion] === option.value
                    ? 'border-indigo-500 bg-indigo-500/10 shadow-[0_0_20px_rgba(99,102,241,0.2)]'
                    : 'border-white/5 bg-slate-800/40 hover:border-white/20 hover:bg-slate-800'
                }`}
              >
                <div className={`w-8 h-8 rounded-lg border-2 flex items-center justify-center transition-all ${
                  answers[currentQuestion] === option.value
                    ? 'border-indigo-500 bg-indigo-500'
                    : 'border-white/10 bg-slate-950'
                }`}>
                  {answers[currentQuestion] === option.value && (
                    <FaCheckCircle className="text-white text-lg" />
                  )}
                </div>
                <span className={`text-lg font-bold transition-all ${
                  answers[currentQuestion] === option.value ? 'text-white' : 'text-slate-400 group-hover:text-slate-300'
                }`}>
                  {option.label}
                </span>
              </button>
            ))}
          </div>

          <div className="flex gap-4 pt-10 border-t border-white/5">
            <button
              onClick={handlePrevious}
              disabled={currentQuestion === 0}
              className={`flex-1 flex items-center justify-center gap-3 px-8 py-5 rounded-2xl font-black transition-all ${
                currentQuestion === 0
                  ? 'bg-slate-900 text-slate-700 border border-white/5 cursor-not-allowed opacity-50'
                  : 'bg-slate-800 border-2 border-white/5 text-slate-300 hover:text-white hover:border-white/20'
              }`}
            >
              <FaArrowLeft />
              Abort
            </button>
            
            <button
              onClick={handleNext}
              className="flex-[2] flex items-center justify-center gap-3 px-8 py-5 bg-indigo-600 text-white rounded-2xl font-black text-lg hover:bg-indigo-500 hover:shadow-[0_0_30px_rgba(99,102,241,0.4)] transition-all transform active:scale-95"
            >
              {currentQuestion === questions.length - 1 ? 'Execute Audit' : 'Next Protocol'}
              <FaArrowRight />
            </button>
          </div>
        </div>
        
        <div className="text-center font-mono text-xs text-slate-600 tracking-widest uppercase">
          [ Nexus Operational Intelligence Protocol v4.2.0 ]
        </div>
      </div>
    </div>
  );
}
