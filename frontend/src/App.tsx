import { useState, useEffect } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import Navbar from "./components/Navbar";
import Chatbot from "./components/Chatbot";
import ProtectedRoute from "./components/ProtectedRoute";
import Landing from "./pages/Landing";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Dashboard from "./pages/Dashboard";
import EnergyGarden from "./pages/EnergyGarden";
import Gamification from "./pages/Gamification";
import Community from "./pages/Community";
import Bills from "./pages/Bills";
import Profile from "./pages/Profile";
import NotFound from "./pages/NotFound";
import GreenMarketplace from "./pages/GreenMarketPlace";
const queryClient = new QueryClient();

const App = () => {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isChatbotOpen, setIsChatbotOpen] = useState(false);

  useEffect(() => {
    // Check for saved theme preference or default to light mode
    const savedTheme = localStorage.getItem('theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    
    if (savedTheme === 'dark' || (!savedTheme && prefersDark)) {
      setIsDarkMode(true);
      document.documentElement.classList.add('dark');
    }
  }, []);

  const toggleDarkMode = () => {
    const newMode = !isDarkMode;
    setIsDarkMode(newMode);
    
    if (newMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  };

  const toggleChatbot = () => {
    setIsChatbotOpen(!isChatbotOpen);
  };

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <AuthProvider>
            <div className="min-h-screen bg-background transition-colors duration-300">
              <Navbar 
                isDarkMode={isDarkMode}
                toggleDarkMode={toggleDarkMode}
                toggleChatbot={toggleChatbot}
              />
              
              <main>
                <Routes>
                  <Route path="/" element={<Landing />} />
                  <Route path="/login" element={<Login />} />
                  <Route path="/signup" element={<Signup />} />
                  <Route 
                    path="/dashboard" 
                    element={
                      <ProtectedRoute>
                        <Dashboard />
                      </ProtectedRoute>
                    } 
                  />
                  <Route 
                    path="/garden" 
                    element={
                      <ProtectedRoute>
                        <EnergyGarden />
                      </ProtectedRoute>
                    } 
                  />
                  <Route 
                    path="/gamification" 
                    element={
                      <ProtectedRoute>
                        <Gamification />
                      </ProtectedRoute>
                    } 
                  />
                  <Route 
                    path="/community" 
                    element={
                      <ProtectedRoute>
                        <Community />
                      </ProtectedRoute>
                    } 
                  />
                  <Route 
                    path="/bills" 
                    element={
                      <ProtectedRoute>
                        <Bills />
                      </ProtectedRoute>
                    } 
                  />
                  <Route 
                    path="/profile" 
                    element={
                      <ProtectedRoute>
                        <Profile />
                      </ProtectedRoute>
                    } 
                  />
                  <Route
                    path="/marketplace"
                    element={
                      <ProtectedRoute>
                        <GreenMarketplace
                          householdProfile={{
                            household_id: "household_123",
                            monthly_kwh: 350,
                            appliances: {
                              Refrigerator: 150,
                              "Washing Machine": 100,
                              "Air Conditioner": 100,
                            },
                          }}
                        />
                      </ProtectedRoute>
                    }
                  />
                  <Route path="*" element={<NotFound />} />
                </Routes>
              </main>

              <Chatbot 
                isOpen={isChatbotOpen}
                onClose={() => setIsChatbotOpen(false)}
              />
            </div>
          </AuthProvider>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
