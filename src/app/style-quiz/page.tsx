'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { FaCheckCircle, FaArrowRight, FaArrowLeft } from 'react-icons/fa';
import { toast } from 'react-hot-toast';

interface Question {
  id: number;
  question: string;
  options: {
    label: string;
    value: string;
    style: 'A' | 'B' | 'C' | 'D';
  }[];
}

const questions: Question[] = [
  {
    id: 1,
    question: "When you think about decorating your home, what is your main priority?",
    options: [
      { label: "A bold, colorful space that impresses visitors", value: "A", style: 'A' },
      { label: "A calm, natural environment that feels like a retreat", value: "B", style: 'B' },
      { label: "A space that tells stories and highlights cultural roots", value: "C", style: 'C' },
      { label: "A clean and modern space with subtle accents", value: "D", style: 'D' },
    ],
  },
  {
    id: 2,
    question: "Which color palette would you choose for a set of handmade pieces?",
    options: [
      { label: "Intense colors: fuchsia, turquoise, yellow, red", value: "A", style: 'A' },
      { label: "Earthy tones: beige, terracotta, olive, navy", value: "B", style: 'B' },
      { label: "Deep tones: black, ochre, gold", value: "C", style: 'C' },
      { label: "Neutrals: white, gray, sand, soft pastels", value: "D", style: 'D' },
    ],
  },
  {
    id: 3,
    question: "When you choose a handcrafted product, what do you evaluate first?",
    options: [
      { label: "That it stands out and is visually striking", value: "A", style: 'A' },
      { label: "That it feels organic, comfortable and natural", value: "B", style: 'B' },
      { label: "That it has a clear cultural or ancestral meaning", value: "C", style: 'C' },
      { label: "That the design is contemporary and well balanced", value: "D", style: 'D' },
    ],
  },
  {
    id: 4,
    question: "In which space would you most like to place a key piece from Latido Ancestral?",
    options: [
      { label: "A social area where color and energy are the protagonists", value: "A", style: 'A' },
      { label: "A terrace, balcony or room with a coastal feeling", value: "B", style: 'B' },
      { label: "A living room or studio where you display unique cultural pieces", value: "C", style: 'C' },
      { label: "A minimalist living room or workspace with curated details", value: "D", style: 'D' },
    ],
  },
  {
    id: 5,
    question: "What type of Colombian craft are you most likely to invest in?",
    options: [
      { label: "Colorful bags, statement accessories and bold textiles", value: "A", style: 'A' },
      { label: "Hammocks, natural fiber pieces and elements that invite you to relax", value: "B", style: 'B' },
      { label: "Symbolic pieces: masks, ceremonial elements, traditional designs", value: "C", style: 'C' },
      { label: "Limited edition designs with a contemporary and exclusive touch", value: "D", style: 'D' },
    ],
  },
  {
    id: 6,
    question: "How do you want people to feel when they see your space?",
    options: [
      { label: "Inspired by your energy and creativity", value: "A", style: 'A' },
      { label: "Relaxed and connected to nature", value: "B", style: 'B' },
      { label: "Curious about your roots and the stories behind each piece", value: "C", style: 'C' },
      { label: "Impressed by the elegance and harmony of the space", value: "D", style: 'D' },
    ],
  },
  {
    id: 7,
    question: "Which word best represents your current lifestyle?",
    options: [
      { label: "Vibrant", value: "A", style: 'A' },
      { label: "Calm", value: "B", style: 'B' },
      { label: "Rooted", value: "C", style: 'C' },
      { label: "Balanced", value: "D", style: 'D' },
    ],
  },
];

const styleProfiles = {
  A: {
    name: "Vibrant & Colorful",
    description: "You love energy, bold colors, and pieces that stand out. Your style is joyful and expressive!",
    products: [
      { id: 'h9', name: 'Design with Essence', image: '/assets/assets1/hamaca-personalizada.webp' },
      { id: 'm9', name: 'Colorful Party', image: '/assets/assets3/mostacilla.webp' },
      { id: 's9', name: 'Festival Colors', image: '/assets/assets2/quinciano-multicolor.webp' },
      { id: 'h3', name: 'Threads with Soul', image: '/assets/assets1/hamaca-bordada.webp' }
    ],
    color: 'from-pink-500 to-yellow-500'
  },
  B: {
    name: "Natural & Coastal",
    description: "You appreciate natural materials, earthy tones, and a relaxed vibe. Your style is calm and organic!",
    products: [
      { id: 'h1', name: 'Cream Braid and Embroidery', image: '/assets/assets1/macrame-matrimonial.webp' },
      { id: 'h6', name: 'Macramé that Embraces', image: '/assets/assets1/hamaca-macrame-personal.webp' },
      { id: 's1', name: 'Roots of Tradition', image: '/assets/assets2/azulejo.webp' },
      { id: 'h4', name: 'Shelter Personal', image: '/assets/assets1/hamaca-personal.webp' }
    ],
    color: 'from-amber-500 to-teal-500'
  },
  C: {
    name: "Cultural & Traditional",
    description: "You value heritage, stories, and authentic craftsmanship. Your style is rich in history and meaning!",
    products: [
      { id: 'h8', name: 'Hand Embroidered Art', image: '/assets/assets1/hamaca-bordada-mano.webp' },
      { id: 'h10', name: 'Name that Weaves Identity', image: '/assets/assets1/hamaca-nombre.webp' },
      { id: 's3', name: 'Zenú Origin', image: '/assets/assets2/caña-flecha.webp' },
      { id: 'm2', name: 'River Crossings', image: '/assets/assets3/acros.webp' }
    ],
    color: 'from-orange-700 to-red-900'
  },
  D: {
    name: "Modern & Minimalist",
    description: "You prefer clean lines, subtle elegance, and contemporary design. Your style is refined and balanced!",
    products: [
      { id: 'm1', name: 'Echo of Earth', image: '/assets/assets3/contemporanea.webp' },
      { id: 'h7', name: 'Sublime Fabric', image: '/assets/assets1/hamaca-premium.webp' },
      { id: 's5', name: 'Style and Root', image: '/assets/assets2/exclusivo.webp' },
      { id: 'h2', name: 'Whisper of Earth and Cream', image: '/assets/assets1/hamaca-tonos-tierra-crema.webp' }
    ],
    color: 'from-gray-400 to-blue-400'
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
      toast.error('Please select an answer before continuing');
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
    const counts = { A: 0, B: 0, C: 0, D: 0 };
    Object.values(answers).forEach((answer) => {
      counts[answer as keyof typeof counts]++;
    });

    setShowResults(true);
  };

  const getDominantStyle = () => {
    const counts = { A: 0, B: 0, C: 0, D: 0 };
    Object.values(answers).forEach(answer => {
      counts[answer as keyof typeof counts]++;
    });

    return Object.entries(counts).reduce((a, b) => 
      counts[a[0] as keyof typeof counts] > counts[b[0] as keyof typeof counts] ? a : b
    )[0] as 'A' | 'B' | 'C' | 'D';
  };

  const handleSubmitSuggestion = (e: React.FormEvent) => {
    e.preventDefault();
    if (!suggestion.trim()) {
      toast.error('Please enter your suggestion');
      return;
    }

    // Save suggestion to localStorage (in production, this would be an API call)
    const suggestions = JSON.parse(localStorage.getItem('productSuggestions') || '[]');
    suggestions.push({
      suggestion,
      date: new Date().toISOString(),
      style: getDominantStyle()
    });
    localStorage.setItem('productSuggestions', JSON.stringify(suggestions));

    toast.success('Thank you for your suggestion!');
    setSuggestion('');
    setShowSuggestionForm(false);
  };

  const progress = ((currentQuestion + 1) / questions.length) * 100;

  if (showResults) {
    const dominantStyle = getDominantStyle();
    const profile = styleProfiles[dominantStyle];

    return (
      <div className="min-h-screen bg-gradient-to-br from-amber-50 via-white to-orange-50 py-12">
        <div className="max-w-4xl mx-auto px-4">
          {/* Results Header */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-green-500 rounded-full mb-4">
              <FaCheckCircle className="text-white text-4xl" />
            </div>
            <h1 className="text-4xl font-bold text-gray-800 mb-2">Your Style Profile</h1>
            <div className={`inline-block bg-gradient-to-r ${profile.color} text-white px-6 py-2 rounded-full text-xl font-semibold`}>
              {profile.name}
            </div>
          </div>

          {/* Description */}
          <div className="bg-white rounded-xl shadow-lg p-8 mb-8">
            <p className="text-lg text-gray-700 text-center mb-6">
              {profile.description}
            </p>
            
            <div className="border-t border-gray-200 pt-6">
              <h2 className="text-2xl font-bold text-gray-800 mb-4 text-center">
                Recommended Products for You
              </h2>
              <p className="text-gray-600 text-center mb-6">
                Based on your style, we think you'll love these handcrafted pieces:
              </p>
              
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                {profile.products.map((product, index) => (
                  <div key={index} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
                    <div className="w-full h-40 bg-gray-100 relative overflow-hidden">
                      <img 
                        src={product.image} 
                        alt={product.name}
                        className="w-full h-full object-cover hover:scale-110 transition-transform duration-300"
                        onError={(e) => {
                          e.currentTarget.src = '/assets/assets1/hat1.jpg'; // Fallback image
                        }}
                      />
                    </div>
                    <div className="p-3">
                      <p className="text-sm font-semibold text-gray-800 text-center">{product.name}</p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="flex gap-4 justify-center">
                <button
                  onClick={() => router.push('/shop')}
                  className="px-8 py-3 bg-gradient-to-r from-primary to-secondary text-white rounded-lg font-semibold hover:shadow-lg transition-all"
                >
                  Shop Now
                </button>
                <button
                  onClick={() => {
                    setShowResults(false);
                    setCurrentQuestion(0);
                    setAnswers({});
                  }}
                  className="px-8 py-3 border-2 border-gray-300 text-gray-700 rounded-lg font-semibold hover:bg-gray-50 transition-all"
                >
                  Retake Quiz
                </button>
              </div>
            </div>
          </div>

          {/* Suggestion Form */}
          <div className="bg-white rounded-xl shadow-lg p-8">
            <h3 className="text-xl font-bold text-gray-800 mb-4 text-center">
              Help Us Improve!
            </h3>
            <p className="text-gray-600 text-center mb-6">
              What products would you like to see in our collection?
            </p>
            
            {!showSuggestionForm ? (
              <button
                onClick={() => setShowSuggestionForm(true)}
                className="w-full px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors"
              >
                Share Your Ideas
              </button>
            ) : (
              <form onSubmit={handleSubmitSuggestion} className="space-y-4">
                <textarea
                  value={suggestion}
                  onChange={(e) => setSuggestion(e.target.value)}
                  placeholder="Tell us what products you'd love to see... (e.g., 'More colorful bags', 'Traditional jewelry', 'Modern home decor')"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary resize-none"
                  rows={4}
                  required
                />
                <div className="flex gap-3">
                  <button
                    type="submit"
                    className="flex-1 px-6 py-3 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700 transition-colors"
                  >
                    Submit Suggestion
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowSuggestionForm(false)}
                    className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg font-semibold hover:bg-gray-50 transition-colors"
                  >
                    Cancel
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
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-white to-orange-50 py-12">
      <div className="max-w-3xl mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">Find Your Style</h1>
          <p className="text-gray-600">Discover which Colombian crafts match your personality</p>
        </div>

        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex justify-between text-sm text-gray-600 mb-2">
            <span>Question {currentQuestion + 1} of {questions.length}</span>
            <span>{Math.round(progress)}% Complete</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
            <div 
              className="bg-gradient-to-r from-primary to-secondary h-full transition-all duration-500 ease-out"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        {/* Question Card */}
        <div className="bg-white rounded-xl shadow-lg p-8 mb-6">
          <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">
            {question.question}
          </h2>

          <div className="space-y-3 mb-8">
            {question.options.map((option) => (
              <button
                key={option.value}
                onClick={(e) => {
                  e.preventDefault();
                  console.log('Option clicked:', option.value);
                  handleAnswer(option.value);
                }}
                type="button"
                className={`w-full p-4 rounded-lg border-2 transition-all text-left ${
                  answers[currentQuestion] === option.value
                    ? 'border-primary bg-primary/10 shadow-md'
                    : 'border-gray-200 hover:border-primary/50 hover:bg-gray-50'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                    answers[currentQuestion] === option.value
                      ? 'border-primary bg-primary'
                      : 'border-gray-300'
                  }`}>
                    {answers[currentQuestion] === option.value && (
                      <FaCheckCircle className="text-white text-sm" />
                    )}
                  </div>
                  <span className="font-medium text-gray-700">{option.label}</span>
                </div>
              </button>
            ))}
          </div>

          {/* Navigation inside card */}
          <div className="grid grid-cols-2 gap-4 pt-6 mt-6 border-t-2 border-gray-200">
            <button
              type="button"
              onClick={(e) => {
                e.preventDefault();
                handlePrevious();
              }}
              disabled={currentQuestion === 0}
              className={`flex items-center justify-center gap-2 px-6 py-4 rounded-lg font-bold transition-all ${
                currentQuestion === 0
                  ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                  : 'bg-gray-100 border-2 border-gray-400 text-gray-800 hover:bg-gray-200'
              }`}
              style={{ minHeight: '56px' }}
            >
              <FaArrowLeft />
              Previous
            </button>
            
            <button
              type="button"
              onClick={(e) => {
                e.preventDefault();
                console.log('Next button clicked!');
                handleNext();
              }}
              className="flex items-center justify-center gap-2 px-6 py-4 text-white rounded-lg font-bold hover:shadow-lg transition-all"
              style={{ 
                minHeight: '56px',
                background: 'linear-gradient(to right, #8B4513, #D2691E)',
              }}
            >
              {currentQuestion === questions.length - 1 ? 'See Results' : 'Next'}
              <FaArrowRight />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
