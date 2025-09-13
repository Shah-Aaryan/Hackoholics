import React, { Suspense, useState, useRef, useMemo } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { OrbitControls, Environment, Text, Html } from '@react-three/drei';
import { Vector3, Color } from 'three';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { RefreshCw, TreePine, Users, Sun, Moon, Leaf } from 'lucide-react';
import { HouseholdData, GardenStats } from '@/data/gardenData';

interface EnergyGarden3DProps {
  householdData: HouseholdData[];
  gardenStats: GardenStats;
  onRefresh: () => void;
  isRefreshing: boolean;
}

// 3D Tree Component
const Tree = ({ 
  position, 
  health, 
  scale = 1, 
  season = 'summer' 
}: { 
  position: [number, number, number]; 
  health: number; 
  scale?: number;
  season?: string;
}) => {
  const meshRef = useRef<THREE.Mesh>(null);
  const [hovered, setHovered] = useState(false);

  useFrame((state) => {
    if (meshRef.current) {
      // Gentle swaying animation
      meshRef.current.rotation.z = Math.sin(state.clock.elapsedTime + position[0]) * 0.1;
    }
  });

  const getTreeColor = () => {
    if (health >= 80) return '#4ade80'; // green-400
    if (health >= 60) return '#22c55e'; // green-500
    if (health >= 40) return '#16a34a'; // green-600
    return '#dc2626'; // red-600
  };

  const getSeasonalColor = () => {
    switch (season) {
      case 'spring': return '#fbbf24'; // yellow-400
      case 'summer': return getTreeColor();
      case 'autumn': return '#f97316'; // orange-500
      case 'winter': return '#e5e7eb'; // gray-200
      default: return getTreeColor();
    }
  };

  const treeHeight = health / 100 * 2 + 0.5;
  const trunkHeight = treeHeight * 0.3;

  return (
    <group position={position} scale={[scale, scale, scale]}>
      {/* Trunk */}
      <mesh position={[0, trunkHeight / 2, 0]}>
        <cylinderGeometry args={[0.1, 0.15, trunkHeight, 8]} />
        <meshStandardMaterial color="#8b4513" />
      </mesh>
      
      {/* Foliage */}
      <mesh 
        ref={meshRef}
        position={[0, trunkHeight + treeHeight * 0.3, 0]}
        onPointerOver={() => setHovered(true)}
        onPointerOut={() => setHovered(false)}
      >
        <sphereGeometry args={[treeHeight * 0.4, 8, 6]} />
        <meshStandardMaterial 
          color={getSeasonalColor()} 
          transparent
          opacity={health / 100}
        />
      </mesh>
      
      {/* Additional foliage layers for healthier trees */}
      {health > 60 && (
        <mesh position={[0, trunkHeight + treeHeight * 0.6, 0]}>
          <sphereGeometry args={[treeHeight * 0.3, 8, 6]} />
          <meshStandardMaterial 
            color={getSeasonalColor()} 
            transparent
            opacity={health / 100 * 0.8}
          />
        </mesh>
      )}
      
      {/* Flowers for blooming trees */}
      {health > 80 && season === 'spring' && (
        <mesh position={[0, trunkHeight + treeHeight * 0.2, 0]}>
          <sphereGeometry args={[treeHeight * 0.1, 6, 4]} />
          <meshStandardMaterial color="#ec4899" />
        </mesh>
      )}
    </group>
  );
};

// 3D House Component
const House = ({ 
  position, 
  household, 
  onClick 
}: { 
  position: [number, number, number]; 
  household: HouseholdData;
  onClick: () => void;
}) => {
  const [hovered, setHovered] = useState(false);
  const meshRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (meshRef.current && hovered) {
      meshRef.current.position.y = position[1] + Math.sin(state.clock.elapsedTime * 2) * 0.1;
    } else if (meshRef.current) {
      meshRef.current.position.y = position[1];
    }
  });

  const getHouseColor = () => {
    const efficiency = (household.energySaved / household.baseline) * 100;
    if (efficiency >= 15) return '#22c55e'; // green-500
    if (efficiency >= 5) return '#eab308'; // yellow-500
    return '#ef4444'; // red-500
  };

  const getWindowGlow = () => {
    return household.plantHealth > 70 ? '#fbbf24' : '#64748b'; // yellow-400 or slate-500
  };

  return (
    <group 
      position={position}
      onClick={onClick}
      onPointerOver={() => setHovered(true)}
      onPointerOut={() => setHovered(false)}
    >
      {/* House base */}
      <mesh ref={meshRef}>
        <boxGeometry args={[1.5, 1, 1.5]} />
        <meshStandardMaterial color={getHouseColor()} />
      </mesh>
      
      {/* Roof */}
      <mesh position={[0, 0.8, 0]}>
        <coneGeometry args={[1.2, 0.8, 4]} />
        <meshStandardMaterial color="#8b5cf6" />
      </mesh>
      
      {/* Windows */}
      <mesh position={[0.6, 0.2, 0.76]}>
        <planeGeometry args={[0.3, 0.4]} />
        <meshStandardMaterial color={getWindowGlow()} emissive={getWindowGlow()} emissiveIntensity={0.3} />
      </mesh>
      <mesh position={[-0.6, 0.2, 0.76]}>
        <planeGeometry args={[0.3, 0.4]} />
        <meshStandardMaterial color={getWindowGlow()} emissive={getWindowGlow()} emissiveIntensity={0.3} />
      </mesh>
      
      {/* Door */}
      <mesh position={[0, -0.2, 0.76]}>
        <planeGeometry args={[0.4, 0.6]} />
        <meshStandardMaterial color="#92400e" />
      </mesh>
      
      {/* Garden around house */}
      <mesh position={[0, -0.5, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <circleGeometry args={[1.2, 16]} />
        <meshStandardMaterial color={household.plantHealth > 50 ? '#22c55e' : '#84cc16'} />
      </mesh>
      
      {/* Trees around house based on health */}
      {Array.from({ length: Math.floor(household.plantHealth / 20) }).map((_, i) => {
        const angle = (i / Math.floor(household.plantHealth / 20)) * Math.PI * 2;
        const radius = 1.5;
        return (
          <Tree
            key={i}
            position={[
              Math.cos(angle) * radius,
              0,
              Math.sin(angle) * radius
            ]}
            health={household.plantHealth}
            scale={0.5}
          />
        );
      })}
    </group>
  );
};

// Ground plane
const Ground = ({ size = 50 }: { size?: number }) => {
  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.5, 0]}>
      <planeGeometry args={[size, size]} />
      <meshStandardMaterial color="#22c55e" />
    </mesh>
  );
};

// Individual Garden Plot Scene
const IndividualGardenScene = ({ 
  household, 
  season 
}: { 
  household: HouseholdData; 
  season: string;
}) => {
  const { camera } = useThree();
  
  React.useEffect(() => {
    camera.position.set(0, 5, 8);
    camera.lookAt(0, 0, 0);
  }, [camera]);

  const treeCount = Math.floor(household.plantHealth / 10);
  const treePositions = useMemo(() => {
    const positions: [number, number, number][] = [];
    for (let i = 0; i < treeCount; i++) {
      const angle = (i / treeCount) * Math.PI * 2;
      const radius = 3 + Math.random() * 2;
      positions.push([
        Math.cos(angle) * radius,
        0,
        Math.sin(angle) * radius
      ]);
    }
    return positions;
  }, [treeCount]);

  return (
    <>
      <Ground size={20} />
      <ambientLight intensity={0.4} />
      <directionalLight position={[10, 10, 5]} intensity={1} />
      
      {/* Central garden area */}
      <mesh position={[0, -0.4, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <circleGeometry args={[8, 32]} />
        <meshStandardMaterial color="#16a34a" />
      </mesh>
      
      {/* Trees */}
      {treePositions.map((position, index) => (
        <Tree
          key={index}
          position={position}
          health={household.plantHealth}
          season={season}
        />
      ))}
      
      {/* Center house */}
      <House
        position={[0, 0, 0]}
        household={household}
        onClick={() => {}}
      />
    </>
  );
};

// Community Grid Scene
const CommunityGridScene = ({ 
  households, 
  season,
  onHouseClick
}: { 
  households: HouseholdData[]; 
  season: string;
  onHouseClick: (household: HouseholdData) => void;
}) => {
  const { camera } = useThree();
  
  React.useEffect(() => {
    camera.position.set(15, 10, 15);
    camera.lookAt(0, 0, 0);
  }, [camera]);

  const gridSize = Math.ceil(Math.sqrt(households.length));
  const spacing = 4;

  return (
    <>
      <Ground size={gridSize * spacing + 10} />
      <ambientLight intensity={0.4} />
      <directionalLight position={[20, 20, 10]} intensity={1} />
      
      {households.map((household, index) => {
        const row = Math.floor(index / gridSize);
        const col = index % gridSize;
        const x = (col - gridSize / 2) * spacing;
        const z = (row - gridSize / 2) * spacing;
        
        return (
          <House
            key={household.id}
            position={[x, 0, z]}
            household={household}
            onClick={() => onHouseClick(household)}
          />
        );
      })}
    </>
  );
};

// Main 3D Energy Garden Component
const EnergyGarden3D: React.FC<EnergyGarden3DProps> = ({
  householdData,
  gardenStats,
  onRefresh,
  isRefreshing
}) => {
  const [viewMode, setViewMode] = useState<'individual' | 'community'>('individual');
  const [selectedHousehold, setSelectedHousehold] = useState<HouseholdData | null>(
    householdData[0] || null
  );
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [season, setSeason] = useState<'spring' | 'summer' | 'autumn' | 'winter'>('summer');
  const [isMobile, setIsMobile] = useState(false);

  const currentHousehold = selectedHousehold || householdData[0];

  // Check if mobile
  React.useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const handleHouseClick = (household: HouseholdData) => {
    setSelectedHousehold(household);
    setViewMode('individual');
  };

  return (
    <div className="w-full h-screen relative">
      {/* UI Overlay */}
      <div className={`absolute z-10 space-y-2 ${isMobile ? 'top-2 left-2 right-2' : 'top-4 left-4'}`}>
        <div className={`flex gap-2 ${isMobile ? 'flex-wrap' : ''}`}>
          <Button
            variant={viewMode === 'individual' ? 'default' : 'outline'}
            size={isMobile ? 'sm' : 'sm'}
            onClick={() => setViewMode('individual')}
            className={isMobile ? 'text-xs' : ''}
          >
            <TreePine className={`${isMobile ? 'w-3 h-3' : 'w-4 h-4'} mr-1`} />
            {isMobile ? 'My Garden' : 'My Garden'}
          </Button>
          <Button
            variant={viewMode === 'community' ? 'default' : 'outline'}
            size={isMobile ? 'sm' : 'sm'}
            onClick={() => setViewMode('community')}
            className={isMobile ? 'text-xs' : ''}
          >
            <Users className={`${isMobile ? 'w-3 h-3' : 'w-4 h-4'} mr-1`} />
            {isMobile ? 'Community' : 'Community'}
          </Button>
        </div>
        
        {/* Household Selector */}
        {viewMode === 'individual' && (
          <div className={isMobile ? 'w-full' : ''}>
            <Select
              value={selectedHousehold?.id || ''}
              onValueChange={(value) => {
                const household = householdData.find(h => h.id === value);
                if (household) setSelectedHousehold(household);
              }}
            >
              <SelectTrigger className={isMobile ? 'w-full text-xs' : 'w-48'}>
                <SelectValue placeholder="Select household" />
              </SelectTrigger>
              <SelectContent>
                {householdData.map((household) => (
                  <SelectItem key={household.id} value={household.id}>
                    {household.name} ({household.plantHealth}% health)
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        )}
        
        <div className={`flex gap-2 ${isMobile ? 'flex-wrap' : ''}`}>
          <Button
            variant="outline"
            size={isMobile ? 'sm' : 'sm'}
            onClick={() => setIsDarkMode(!isDarkMode)}
            className={isMobile ? 'text-xs' : ''}
          >
            {isDarkMode ? <Sun className={isMobile ? 'w-3 h-3' : 'w-4 h-4'} /> : <Moon className={isMobile ? 'w-3 h-3' : 'w-4 h-4'} />}
          </Button>
          <Button
            variant="outline"
            size={isMobile ? 'sm' : 'sm'}
            onClick={() => setSeason(
              season === 'spring' ? 'summer' : 
              season === 'summer' ? 'autumn' :
              season === 'autumn' ? 'winter' : 'spring'
            )}
            className={isMobile ? 'text-xs' : ''}
          >
            <Leaf className={`${isMobile ? 'w-3 h-3' : 'w-4 h-4'} mr-1`} />
            {season}
          </Button>
          <Button
            variant="outline"
            size={isMobile ? 'sm' : 'sm'}
            onClick={onRefresh}
            disabled={isRefreshing}
            className={isMobile ? 'text-xs' : ''}
          >
            <RefreshCw className={`${isMobile ? 'w-3 h-3' : 'w-4 h-4'} ${isRefreshing ? 'animate-spin' : ''}`} />
          </Button>
        </div>
      </div>

      {/* Stats Panel */}
      <div className={`absolute z-10 ${isMobile ? 'top-20 right-2 left-2' : 'top-4 right-4'}`}>
        <Card className={isMobile ? 'w-full' : 'w-64'}>
          <CardContent className={isMobile ? 'p-3' : 'p-4'}>
            <h3 className={`font-semibold mb-2 ${isMobile ? 'text-sm' : ''}`}>Garden Stats</h3>
            {viewMode === 'individual' && currentHousehold ? (
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm">Health:</span>
                  <Badge variant={currentHousehold.plantHealth > 70 ? 'default' : 'secondary'}>
                    {currentHousehold.plantHealth}%
                  </Badge>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm">Usage:</span>
                  <span className="text-sm">{currentHousehold.currentUsage} kWh</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm">Saved:</span>
                  <span className="text-sm text-green-600">{currentHousehold.energySaved} kWh</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm">Trees:</span>
                  <span className="text-sm">{Math.floor(currentHousehold.plantHealth / 10)}</span>
                </div>
              </div>
            ) : (
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm">Efficiency:</span>
                  <Badge variant={gardenStats.communityEfficiency > 10 ? 'default' : 'secondary'}>
                    {gardenStats.communityEfficiency.toFixed(1)}%
                  </Badge>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm">Total Saved:</span>
                  <span className="text-sm text-green-600">{gardenStats.totalEnergySaved} kWh</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm">Health:</span>
                  <span className="text-sm">{gardenStats.communityHealth}%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm">Houses:</span>
                  <span className="text-sm">{householdData.length}</span>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* 3D Canvas */}
      <Canvas
        camera={{ 
          position: isMobile ? [0, 8, 12] : [0, 5, 8], 
          fov: isMobile ? 75 : 60 
        }}
        style={{ 
          background: isDarkMode ? '#0f172a' : '#87ceeb',
          height: isMobile ? 'calc(100vh - 120px)' : '100vh'
        }}
      >
        <Suspense fallback={
          <Html center>
            <div className="text-center text-white">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white mx-auto mb-2"></div>
              <p>Loading 3D Garden...</p>
            </div>
          </Html>
        }>
          <Environment preset={isDarkMode ? 'night' : 'sunset'} />
          
          {viewMode === 'individual' && currentHousehold ? (
            <IndividualGardenScene 
              household={currentHousehold} 
              season={season}
            />
          ) : (
            <CommunityGridScene 
              households={householdData} 
              season={season}
              onHouseClick={handleHouseClick}
            />
          )}
          
          <OrbitControls 
            enablePan={!isMobile}
            enableZoom={true}
            enableRotate={true}
            minDistance={isMobile ? 8 : 5}
            maxDistance={isMobile ? 30 : 50}
            touches={{
              ONE: 2, // Pan
              TWO: 1  // Rotate
            }}
          />
        </Suspense>
      </Canvas>
    </div>
  );
};

export default EnergyGarden3D;