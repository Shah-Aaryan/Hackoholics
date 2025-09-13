import React from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Leaf, Zap, Users, BarChart3, ArrowRight } from "lucide-react";

const Landing: React.FC = () => {
  const features = [
    {
      icon: <BarChart3 className="w-8 h-8 text-white" />,
      title: "Track Energy Usage",
      description:
        "Monitor your household's energy consumption with detailed analytics.",
      img: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=600&q=80",
    },
    {
      icon: <Users className="w-8 h-8 text-white" />,
      title: "Community Engagement",
      description:
        "Connect with neighbors and share sustainable practices.",
      img: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=600&q=80",
    },
    {
      icon: <Zap className="w-8 h-8 text-white" />,
      title: "Smart Recommendations",
      description:
        "Get personalized tips to reduce energy consumption and save money.",
      img: "https://images.unsplash.com/photo-1610878180933-1c7983d0fc1d?auto=format&fit=crop&w=600&q=80",
    },
  ];

  const news = [
    {
      headline: "Solar Energy Adoption Surges Worldwide",
      source: "EcoTimes",
      date: "Sept 10, 2025",
      preview:
        "The global adoption of solar energy has reached unprecedented levels, with households and businesses switching to renewable sources at record pace.",
    },
    {
      headline: "Community Initiatives Lower Carbon Emissions",
      source: "GreenDaily",
      date: "Sept 8, 2025",
      preview:
        "Local communities are implementing green initiatives, reducing local carbon footprints significantly and inspiring neighboring regions.",
    },
    {
      headline: "AI Technology Helps Save Household Energy",
      source: "EnergyTech",
      date: "Sept 5, 2025",
      preview:
        "Smart AI-based energy monitors are helping households optimize consumption and save money while being eco-friendly.",
    },
  ];

  const heroes = [
    {
      name: "Greta Thunberg",
      contribution: "Climate Activist",
      img: "https://upload.wikimedia.org/wikipedia/commons/4/48/Greta_Thunberg_-_2019.jpg",
    },
    {
      name: "Elon Musk",
      contribution: "Sustainable Transport",
      img: "https://upload.wikimedia.org/wikipedia/commons/e/ed/Elon_Musk_Royal_Society.jpg",
    },
    {
      name: "Wangari Maathai",
      contribution: "Environmental Conservation",
      img: "https://upload.wikimedia.org/wikipedia/commons/4/4e/Wangari_Maathai_2004.jpg",
    },
  ];

  return (
    <div className="relative min-h-screen bg-gradient-to-br from-green-50 via-white to-emerald-50 overflow-hidden">
      {/* Floating Leaves */}
      {[...Array(10)].map((_, i) => (
        <div
          key={i}
          className="absolute text-green-500 animate-fall"
          style={{
            left: `${Math.random() * 100}vw`,
            top: `-${Math.random() * 20}vh`,
            fontSize: `${16 + Math.random() * 24}px`,
            animationDuration: `${5 + Math.random() * 5}s`,
          }}
        >
          🍃
        </div>
      ))}

      {/* Hero Section */}
      <section className="relative z-10 flex flex-col items-center justify-center text-center py-28 px-4">
        <div className="max-w-4xl">
          <div className="flex justify-center mb-8">
            <div className="flex items-center justify-center w-24 h-24 bg-gradient-to-r from-green-500 to-emerald-600 rounded-full shadow-2xl animate-bounce">
              <Leaf className="w-12 h-12 text-white" />
            </div>
          </div>
          <h1 className="text-5xl md:text-6xl font-bold mb-6 text-gray-900">
            <span className="bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
              Connect. Track. Save the Planet.
            </span>
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Join EcoConnect and take control of your energy consumption.
            Track, analyze, and optimize your household's energy usage while
            building a sustainable community.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/login">
              <Button className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white px-8 py-4 text-lg font-semibold shadow-lg hover:shadow-2xl transition-all duration-300">
                Get Started <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
            </Link>
            <Link to="/signup">
              <Button variant="outline" className="border-green-600 text-green-600 hover:bg-green-50 px-8 py-4 text-lg font-semibold transition-all duration-300">
                Create Account
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-28 relative z-10 bg-gradient-to-r from-green-50 to-emerald-50">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-bold text-center mb-16 text-gray-900">
            Why Choose EcoConnect?
          </h2>
          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {features.map((f, idx) => (
              <div
                key={idx}
                className="relative rounded-xl overflow-hidden shadow-2xl transform hover:scale-105 transition-transform duration-500 cursor-pointer"
              >
                <img src={f.img} alt={f.title} className="w-full h-64 object-cover" />
                <div className="absolute inset-0 bg-black bg-opacity-40 flex flex-col justify-center items-center text-center p-6">
                  {f.icon}
                  <h3 className="text-xl font-semibold text-white mt-4 mb-2">{f.title}</h3>
                  <p className="text-white">{f.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Latest News Section */}
      <section className="py-28 z-10 relative bg-green-50">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-bold text-center mb-12 text-gray-900">
            Latest Energy News
          </h2>
          <div className="space-y-8 max-w-4xl mx-auto">
            {news.map((n, idx) => (
              <div key={idx} className="flex flex-col md:flex-row bg-white rounded-xl shadow-2xl overflow-hidden hover:shadow-3xl transition-shadow duration-500">
                <div className="md:w-1/3 h-48 md:h-auto">
                  <img
                    src={`https://source.unsplash.com/600x400/?energy,${idx}`}
                    alt={n.headline}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="md:w-2/3 p-6 flex flex-col justify-between">
                  <div>
                    <h3 className="text-2xl font-bold mb-2">{n.headline}</h3>
                    <p className="text-gray-500 mb-2">{n.source} • {n.date}</p>
                    <p className="text-gray-600">{n.preview}</p>
                  </div>
                  <Link to="#" className="mt-4 text-green-600 font-semibold hover:underline">
                    Read More →
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Heroes Section */}
      <section className="py-28 z-10 relative">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-bold text-center mb-16 text-gray-900">
            Great People in Sustainability
          </h2>
          <div className="grid md:grid-cols-3 gap-12 max-w-6xl mx-auto">
            {heroes.map((h, idx) => (
              <div key={idx} className="relative flex flex-col items-center bg-white rounded-2xl p-8 shadow-lg border-2 border-green-400 hover:shadow-2xl hover:scale-105 transition-transform duration-500">
                <img src={h.img} alt={h.name} className="w-28 h-28 rounded-full mb-4 border-4 border-green-200" />
                <h3 className="text-xl font-bold">{h.name}</h3>
                <p className="text-gray-500">{h.contribution}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Leaf Animation */}
      <style>
        {`
          @keyframes fall {
            0% { transform: translateY(0) rotate(0deg); opacity: 1; }
            50% { transform: translateY(50vh) rotate(180deg); opacity: 0.8; }
            100% { transform: translateY(100vh) rotate(360deg); opacity: 0; }
          }
          .animate-fall {
            animation-name: fall;
            animation-timing-function: linear;
            animation-iteration-count: infinite;
          }
        `}
      </style>
    </div>
  );
};

export default Landing;
