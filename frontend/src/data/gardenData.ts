// Data types for the Energy Garden feature

export interface HouseholdData {
  id: string;
  name: string;
  currentUsage: number;
  baseline: number;
  energySaved: number;
  carbonSaved: number;
  plantHealth: number; // 0-100
  plantStage: 'wilting' | 'sprouting' | 'growing' | 'blooming';
  achievements: string[];
}

export interface GardenStats {
  communityEfficiency: number; // percentage below baseline
  totalEnergySaved: number;
  communityHealth: number; // 0-100
  season: 'spring' | 'summer' | 'fall' | 'winter';
  weatherBonus: boolean;
}

// Mock household data
export const mockHouseholdData: HouseholdData[] = [
  {
    id: '1',
    name: 'Chen Family',
    currentUsage: 85,
    baseline: 100,
    energySaved: 15,
    carbonSaved: 10.2,
    plantHealth: 85,
    plantStage: 'blooming',
    achievements: ['Energy Saver', 'Carbon Crusher']
  },
  {
    id: '2',
    name: 'Johnson House',
    currentUsage: 92,
    baseline: 105,
    energySaved: 13,
    carbonSaved: 8.8,
    plantHealth: 78,
    plantStage: 'growing',
    achievements: ['Consistent Saver']
  },
  {
    id: '3',
    name: 'Davis Residence',
    currentUsage: 88,
    baseline: 95,
    energySaved: 7,
    carbonSaved: 4.8,
    plantHealth: 72,
    plantStage: 'growing',
    achievements: ['Green Starter']
  },
  {
    id: '4',
    name: 'Rivera Home',
    currentUsage: 110,
    baseline: 100,
    energySaved: 0,
    carbonSaved: 0,
    plantHealth: 45,
    plantStage: 'sprouting',
    achievements: []
  },
  {
    id: '5',
    name: 'Kim Household',
    currentUsage: 75,
    baseline: 90,
    energySaved: 15,
    carbonSaved: 10.2,
    plantHealth: 90,
    plantStage: 'blooming',
    achievements: ['Energy Champion', 'Tree Hugger']
  },
  {
    id: '6',
    name: 'Brown Family',
    currentUsage: 95,
    baseline: 110,
    energySaved: 15,
    carbonSaved: 10.2,
    plantHealth: 82,
    plantStage: 'blooming',
    achievements: ['Efficiency Expert']
  },
  {
    id: '7',
    name: 'Wilson House',
    currentUsage: 78,
    baseline: 85,
    energySaved: 7,
    carbonSaved: 4.8,
    plantHealth: 68,
    plantStage: 'growing',
    achievements: ['Steady Grower']
  },
  {
    id: '8',
    name: 'Taylor Home',
    currentUsage: 102,
    baseline: 95,
    energySaved: 0,
    carbonSaved: 0,
    plantHealth: 35,
    plantStage: 'wilting',
    achievements: []
  },
  {
    id: '9',
    name: 'Anderson Family',
    currentUsage: 70,
    baseline: 85,
    energySaved: 15,
    carbonSaved: 10.2,
    plantHealth: 88,
    plantStage: 'blooming',
    achievements: ['Super Saver', 'Eco Warrior']
  },
  {
    id: '10',
    name: 'Martinez House',
    currentUsage: 90,
    baseline: 100,
    energySaved: 10,
    carbonSaved: 6.8,
    plantHealth: 75,
    plantStage: 'growing',
    achievements: ['Good Neighbor']
  },
  {
    id: '11',
    name: 'Thompson Home',
    currentUsage: 85,
    baseline: 95,
    energySaved: 10,
    carbonSaved: 6.8,
    plantHealth: 70,
    plantStage: 'growing',
    achievements: ['Consistent Performer']
  },
  {
    id: '12',
    name: 'Garcia Family',
    currentUsage: 98,
    baseline: 90,
    energySaved: 0,
    carbonSaved: 0,
    plantHealth: 40,
    plantStage: 'sprouting',
    achievements: []
  },
  {
    id: '13',
    name: 'Lee Household',
    currentUsage: 72,
    baseline: 88,
    energySaved: 16,
    carbonSaved: 10.9,
    plantHealth: 92,
    plantStage: 'blooming',
    achievements: ['Energy Master', 'Carbon Neutral']
  },
  {
    id: '14',
    name: 'Smith Residence',
    currentUsage: 87,
    baseline: 95,
    energySaved: 8,
    carbonSaved: 5.4,
    plantHealth: 65,
    plantStage: 'growing',
    achievements: ['Progress Maker']
  },
  {
    id: '15',
    name: 'White House',
    currentUsage: 93,
    baseline: 100,
    energySaved: 7,
    carbonSaved: 4.8,
    plantHealth: 62,
    plantStage: 'growing',
    achievements: ['Green Learner']
  },
  {
    id: '16',
    name: 'Clark Family',
    currentUsage: 105,
    baseline: 95,
    energySaved: 0,
    carbonSaved: 0,
    plantHealth: 30,
    plantStage: 'wilting',
    achievements: []
  },
  {
    id: '17',
    name: 'Rodriguez Home',
    currentUsage: 80,
    baseline: 92,
    energySaved: 12,
    carbonSaved: 8.2,
    plantHealth: 80,
    plantStage: 'blooming',
    achievements: ['Efficiency Star']
  },
  {
    id: '18',
    name: 'Hall Household',
    currentUsage: 89,
    baseline: 97,
    energySaved: 8,
    carbonSaved: 5.4,
    plantHealth: 67,
    plantStage: 'growing',
    achievements: ['Steady Saver']
  },
  {
    id: '19',
    name: 'Young Family',
    currentUsage: 76,
    baseline: 90,
    energySaved: 14,
    carbonSaved: 9.5,
    plantHealth: 85,
    plantStage: 'blooming',
    achievements: ['Young Champions']
  },
  {
    id: '20',
    name: 'King Residence',
    currentUsage: 94,
    baseline: 98,
    energySaved: 4,
    carbonSaved: 2.7,
    plantHealth: 58,
    plantStage: 'sprouting',
    achievements: ['Getting Started']
  }
];

// Mock garden stats
export const mockGardenStats: GardenStats = {
  communityEfficiency: 12.5, // 12.5% below baseline
  totalEnergySaved: 187, // total kWh saved across all households
  communityHealth: 75,
  season: 'summer',
  weatherBonus: true
};

// Helper functions for garden calculations
export const calculateCommunityEfficiency = (households: HouseholdData[]): number => {
  const totalBaseline = households.reduce((acc, h) => acc + h.baseline, 0);
  const totalUsage = households.reduce((acc, h) => acc + h.currentUsage, 0);
  return Math.max(0, ((totalBaseline - totalUsage) / totalBaseline) * 100);
};

export const calculateTotalSaved = (households: HouseholdData[]): number => {
  return households.reduce((acc, h) => acc + h.energySaved, 0);
};

export const getSeasonalMultiplier = (season: string): number => {
  switch (season) {
    case 'spring': return 1.2;
    case 'summer': return 1.0;
    case 'fall': return 1.1;
    case 'winter': return 0.9;
    default: return 1.0;
  }
};

export const getPlantRecommendations = (household: HouseholdData): string[] => {
  const recommendations = [];
  
  if (household.plantHealth < 50) {
    recommendations.push('Your plant needs immediate attention! Try reducing peak-hour usage.');
    recommendations.push('Unplug devices when not in use to help your plant recover.');
  }
  
  if (household.energySaved < 5) {
    recommendations.push('Switch to LED bulbs to give your plant a growth boost.');
    recommendations.push('Adjust thermostat by 2°F to help your plant thrive.');
  }
  
  if (household.plantStage === 'blooming') {
    recommendations.push('Congratulations! Your plant is thriving. Keep up the great work!');
    recommendations.push('Consider mentoring neighbors to help the community garden grow.');
  }
  
  return recommendations;
};