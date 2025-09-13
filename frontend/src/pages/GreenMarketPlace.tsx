import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Lightbulb, Users, TrendingUp, Leaf } from "lucide-react";
import { toast } from "@/hooks/use-toast";

type HouseholdProfile = {
  household_id: string;
  monthly_kwh: number;
  appliances: Record<string, number>;
};

type GreenMarketplaceProps = {
  householdProfile: HouseholdProfile;
};

type Vendor = {
  name: string;
  description: string;
  estimated_savings: string;
  vendor_url: string;
  category: string;
  rating?: number;
  distance_km?: number;
  discount?: string;
};

type TrendingProduct = {
  name: string;
  popularity: number;
  category: string;
  co2_savings_kg?: number;
};

type CommunityStats = {
  households: number;
  energy_saved_kwh: number;
};

const GreenMarketplace: React.FC<GreenMarketplaceProps> = ({ householdProfile }) => {
  const [vendors, setVendors] = useState<Vendor[]>([]);
  const [insights, setInsights] = useState<string>("");
  const [communityStats, setCommunityStats] = useState<CommunityStats | null>(null);
  const [trending, setTrending] = useState<TrendingProduct[]>([]);
  const [loading, setLoading] = useState(false);

  const householdId = householdProfile.household_id;

  const fetchVendors = async () => {
    try {
      setLoading(true);
      const res = await fetch("http://localhost:8000/api/marketplace/recommend", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(householdProfile),
      });
      const data = await res.json();
      setVendors(data);
    } catch (err) {
      console.error(err);
      toast({ title: "Error", description: "Failed to fetch vendor recommendations." });
    } finally {
      setLoading(false);
    }
  };

  const fetchInsights = async () => {
    try {
      const res = await fetch(`http://localhost:8000/api/marketplace/insights?household_id=${householdId}`);
      const data = await res.json();
      setInsights(data.insights);
    } catch (err) {
      console.error(err);
      toast({ title: "Error", description: "Failed to fetch AI insights." });
    }
  };

  const fetchCommunityStats = async () => {
    try {
      const res = await fetch("http://localhost:8000/api/marketplace/community-stats");
      const data = await res.json();
      setCommunityStats(data);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchTrending = async () => {
    try {
      const res = await fetch("http://localhost:8000/api/marketplace/trending");
      const data = await res.json();
      setTrending(data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchVendors();
    fetchCommunityStats();
    fetchTrending();
  }, [householdProfile]);

  const carbonFootprintKg = Math.round(householdProfile.monthly_kwh * 0.7);

  return (
    <div className="container mx-auto p-6 space-y-6 font-sans">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-4xl font-extrabold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
            Green Marketplace
          </h1>
          <p className="text-base text-muted-foreground mt-1">
            Discover local sustainable products and services to save energy and reduce carbon footprint.
          </p>
        </div>
        <div className="flex gap-2">
          <Button onClick={fetchInsights} className="btn-eco">
            <Lightbulb className="w-4 h-4 mr-1" /> Get Insights
          </Button>
        </div>
      </div>

      {/* Main 4 Holder Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Households Participating */}
        {communityStats && (
          <Card className="card-eco">
            <CardHeader className="flex justify-between items-center">
              <CardTitle className="text-lg font-semibold">Households Participating</CardTitle>
              <Users className="w-5 h-5 text-secondary" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-secondary">{communityStats.households}</div>
            </CardContent>
          </Card>
        )}

        {/* Total Energy Saved */}
        {communityStats && (
          <Card className="card-eco">
            <CardHeader className="flex justify-between items-center">
              <CardTitle className="text-lg font-semibold">Total Energy Saved</CardTitle>
              <TrendingUp className="w-5 h-5 text-success" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-success">{communityStats.energy_saved_kwh} kWh</div>
            </CardContent>
          </Card>
        )}

        {/* AI Insights */}
        <Card className="card-eco">
          <CardHeader>
            <CardTitle className="text-lg font-semibold">💡 AI Insights</CardTitle>
            <CardDescription className="text-sm">Tips based on your energy usage patterns</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-base text-muted-foreground">{insights || "Click 'Get Insights' to view personalized tips."}</p>
          </CardContent>
        </Card>

        {/* Carbon Footprint */}
        <Card className="card-eco">
          <CardHeader>
            <CardTitle className="text-lg font-semibold">🌱 Household Carbon Footprint</CardTitle>
            <CardDescription className="text-sm">Estimated monthly CO₂ emissions</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-success">{carbonFootprintKg} kg CO₂</div>
            {trending.length > 0 && (
              <p className="text-base text-muted-foreground mt-2">
                Top trending eco-friendly products can reduce up to {trending[0].co2_savings_kg || 5} kg CO₂ per month.
              </p>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Vendor Recommendations */}
      <div className="mt-6">
        <h2 className="text-2xl font-bold mb-2">Recommended Vendors</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {vendors.map((vendor, index) => (
            <Card key={index} className="card-eco p-4">
              <CardHeader>
                <CardTitle className="text-lg font-semibold">{vendor.name}</CardTitle>
                <CardDescription className="text-sm">{vendor.category}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-1">
                <p className="text-base text-muted-foreground">{vendor.description}</p>
                <p className="text-base font-medium text-success">💰 {vendor.estimated_savings}</p>
                {vendor.rating && <p className="text-sm">⭐ Rating: {vendor.rating}</p>}
                {vendor.distance_km && <p className="text-sm">📍 {vendor.distance_km} km away</p>}
                {vendor.discount && <p className="text-sm text-accent">🎁 {vendor.discount}</p>}
                <a
                  href={vendor.vendor_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-base text-primary font-medium hover:underline"
                >
                  Visit Vendor
                </a>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {loading && <p className="text-center text-muted-foreground mt-2 text-base">Loading recommendations...</p>}
    </div>
  );
};

export default GreenMarketplace;
