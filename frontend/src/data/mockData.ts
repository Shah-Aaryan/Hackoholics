// Mock data for the Energy Tracker app

export interface EnergyData {
  household: {
    currentUsage: number;
    monthlyAverage: number;
    carbonFootprint: number;
    dailyUsage: number[];
    weeklyUsage: number[];
    monthlyUsage: number[];
  };
  neighborhood: {
    averageUsage: number;
    totalSavings: number;
    participatingHomes: number;
    trendDirection: 'up' | 'down';
  };
  tree: {
    health: number; // 0-100
    stage: 'seedling' | 'young' | 'mature' | 'giant';
    co2Absorbed: number;
  };
}

export interface Bill {
  id: string;
  date: string;
  units: number;
  amount: number;
  carbonFootprint: number;
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  unlocked: boolean;
  points: number;
}

export interface Challenge {
  id: string;
  title: string;
  description: string;
  progress: number;
  target: number;
  reward: number;
  timeLeft: string;
}

export interface LeaderboardEntry {
  id: string;
  name: string;
  points: number;
  energySaved: number;
  avatar: string;
  rank: number;
}

export interface ChatMessage {
  id: string;
  question: string;
  answer: string;
  timestamp: Date;
}

// Mock energy data
export const mockEnergyData: EnergyData = {
  household: {
    currentUsage: 420,
    monthlyAverage: 450,
    carbonFootprint: 285.6,
    dailyUsage: [25, 28, 22, 30, 26, 24, 27],
    weeklyUsage: [180, 175, 165, 170],
    monthlyUsage: [420, 450, 485, 430, 410, 395]
  },
  neighborhood: {
    averageUsage: 485,
    totalSavings: 2840,
    participatingHomes: 156,
    trendDirection: 'down'
  },
  tree: {
    health: 78,
    stage: 'young',
    co2Absorbed: 145.2
  }
};

// Mock bills data
export const mockBills: Bill[] = [
  {
    id: '1',
    date: '2024-01-15',
    units: 420,
    amount: 89.50,
    carbonFootprint: 285.6
  },
  {
    id: '2',
    date: '2023-12-15',
    units: 485,
    amount: 103.20,
    carbonFootprint: 329.95
  }
];

// Mock achievements
export const mockAchievements: Achievement[] = [
  {
    id: '1',
    title: 'Energy Saver',
    description: 'Reduced usage by 10% this month',
    icon: '🌱',
    unlocked: true,
    points: 100
  },
  {
    id: '2',
    title: 'Carbon Crusher',
    description: 'Saved 100kg CO₂ this year',
    icon: '🌍',
    unlocked: true,
    points: 250
  },
  {
    id: '3',
    title: 'Tree Hugger',
    description: 'Planted your first virtual tree',
    icon: '🌳',
    unlocked: false,
    points: 500
  }
];

// Mock challenges
export const mockChallenges: Challenge[] = [
  {
    id: '1',
    title: 'Week Without Waste',
    description: 'Reduce energy consumption by 15% this week',
    progress: 65,
    target: 100,
    reward: 200,
    timeLeft: '3 days'
  },
  {
    id: '2',
    title: 'Neighborhood Champion',
    description: 'Help your neighborhood save 1000 kWh',
    progress: 45,
    target: 100,
    reward: 500,
    timeLeft: '12 days'
  }
];

// Mock leaderboard
export const mockLeaderboard: LeaderboardEntry[] = [
  { id: '1', name: 'Sarah Chen', points: 2450, energySaved: 156, avatar: '👩‍💼', rank: 1 },
  { id: '2', name: 'Mike Johnson', points: 2380, energySaved: 142, avatar: '👨‍🔧', rank: 2 },
  { id: '3', name: 'Emma Davis', points: 2210, energySaved: 138, avatar: '👩‍🎓', rank: 3 },
  { id: '4', name: 'You', points: 1850, energySaved: 98, avatar: '👤', rank: 4 },
  { id: '5', name: 'Alex Rivera', points: 1720, energySaved: 89, avatar: '👨‍💻', rank: 5 }
];

// Mock chatbot Q&A
export const mockChatData: ChatMessage[] = [
  {
    id: '1',
    question: 'How can I reduce my energy consumption?',
    answer: 'Great question! Here are some effective tips: 1) Use LED bulbs (save up to 80% energy), 2) Unplug devices when not in use, 3) Set your thermostat 2°F lower in winter, 4) Use energy-efficient appliances, 5) Take shorter showers. These simple changes can reduce your bill by 15-25%!',
    timestamp: new Date()
  },
  {
    id: '2',
    question: 'What is my carbon footprint?',
    answer: 'Your current carbon footprint is 285.6 kg CO₂ this month. This is 12% lower than the neighborhood average of 324 kg CO₂! You\'re doing great. To improve further, consider switching to renewable energy sources or adding solar panels.',
    timestamp: new Date()
  },
  {
    id: '3',
    question: 'How does the tree visualization work?',
    answer: 'Your virtual tree represents your environmental impact! The healthier your energy habits, the more your tree grows. Currently at 78% health (Young Tree stage). Reduce energy by another 10% to reach Mature Tree stage and unlock special rewards!',
    timestamp: new Date()
  }
];

// AI Recommendations based on usage patterns
export const getAIRecommendations = (data: EnergyData, season: 'summer' | 'winter') => {
  const recommendations = [];
  
  if (data.household.currentUsage > data.household.monthlyAverage) {
    recommendations.push({
      title: 'High Usage Alert',
      description: 'Your energy usage is 7% above average this month.',
      tip: season === 'summer' 
        ? 'Consider raising your AC temperature by 2°F to save 10-15% on cooling costs.'
        : 'Lower your heating by 2°F and add layers - save up to 8% on heating bills.',
      savings: '$12-18/month'
    });
  }
  
  recommendations.push({
    title: 'Peak Hour Optimization',
    description: 'You use 35% of energy during peak hours (4-9 PM).',
    tip: 'Shift dishwasher, laundry to off-peak hours (10 PM - 6 AM) for lower rates.',
    savings: '$8-12/month'
  });
  
  if (data.tree.health < 80) {
    recommendations.push({
      title: 'Tree Growth Opportunity',
      description: 'Your tree needs more eco-friendly habits to thrive!',
      tip: 'Install a programmable thermostat to optimize heating/cooling automatically.',
      savings: '$15-25/month'
    });
  }
  
  return recommendations;
};

// Emission factor for carbon calculation (kg CO₂ per kWh)
export const EMISSION_FACTOR = 0.68;

// Mock marketplace items
export const mockMarketplaceItems = [
  {
    id: '1',
    name: 'Solar Panel Installation',
    points: 5000,
    description: '50% off solar panel installation',
    category: 'renewable'
  },
  {
    id: '2',
    name: 'Smart Thermostat',
    points: 1200,
    description: 'Energy-efficient smart thermostat',
    category: 'devices'
  },
  {
    id: '3',
    name: 'LED Bulb Set',
    points: 300,
    description: '10-pack of energy-efficient LED bulbs',
    category: 'lighting'
  }
];