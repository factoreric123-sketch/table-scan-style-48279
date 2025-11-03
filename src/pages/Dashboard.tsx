import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useRestaurants } from "@/hooks/useRestaurants";
import { useSubscription } from "@/hooks/useSubscription";
import { Button } from "@/components/ui/button";
import { Plus, LogOut, Crown } from "lucide-react";
import { CreateRestaurantModal } from "@/components/CreateRestaurantModal";
import { RestaurantCard } from "@/components/RestaurantCard";
import { PremiumBadge } from "@/components/PremiumBadge";
import { PaywallModal } from "@/components/PaywallModal";
import { toast } from "@/hooks/use-toast";

const Dashboard = () => {
  const { signOut } = useAuth();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const { data: restaurants, isLoading, error } = useRestaurants();
  const restaurantList = restaurants ?? [];
  const { hasPremium, subscription, refetch } = useSubscription();
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showPaywall, setShowPaywall] = useState(false);
  // removed timeout gating to avoid blocking auth/dashboard on slow backend

  const handleSignOut = async () => {
    await signOut();
    navigate("/auth");
  };

  // Handle successful payment redirect
  useEffect(() => {
    const success = searchParams.get('success');
    const canceled = searchParams.get('canceled');

    if (success) {
      toast({
        title: "Welcome to Premium! 🎉",
        description: "Your subscription is now active. Enjoy all premium features!",
      });
      // Remove query params
      setSearchParams({});
      // Refetch subscription status
      refetch();
    } else if (canceled) {
      toast({
        title: "Checkout Canceled",
        description: "You can upgrade to premium anytime from your dashboard.",
      });
      setSearchParams({});
    }
  }, [searchParams, setSearchParams, refetch]);

  // Removed blocking timeout; show skeletons instead while loading

  // Do not block the page during loading

  // No more timeout screen; we render dashboard skeletons instead

  // If error occurs, show inline banner below

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">My Restaurants</h1>
            <div className="flex items-center gap-2 mt-1">
              <PremiumBadge isPremium={hasPremium} />
              {!hasPremium && (
                <Button
                  variant="link"
                  size="sm"
                  className="h-auto p-0 text-primary"
                  onClick={() => setShowPaywall(true)}
                >
                  Upgrade to Premium
                </Button>
              )}
            </div>
          </div>
          <Button variant="ghost" size="sm" onClick={handleSignOut}>
            <LogOut className="h-4 w-4 mr-2" />
            Sign Out
          </Button>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        {error && (
          <div role="alert" className="mb-4 rounded-md border border-border bg-card p-4 text-sm text-muted-foreground">
            We’re having trouble loading your restaurants. You can still create a new one or try again later.
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Create New Restaurant Card */}
          <button
            onClick={() => setShowCreateModal(true)}
            className="border-2 border-dashed border-border rounded-lg p-8 flex flex-col items-center justify-center gap-4 hover:border-primary transition-colors min-h-[300px]"
          >
            <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center">
              <Plus className="h-8 w-8 text-primary" />
            </div>
            <div className="text-center">
              <h3 className="font-semibold text-lg mb-1">Create New Restaurant</h3>
              <p className="text-sm text-muted-foreground">
                Start building your digital menu
              </p>
            </div>
          </button>

          {/* Restaurant Cards or Skeletons */}
          {isLoading && restaurantList.length === 0 && (
            <>
              {Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="rounded-lg border border-border p-6 animate-pulse space-y-4">
                  <div className="h-40 w-full rounded-md bg-muted" />
                  <div className="h-4 w-2/3 bg-muted rounded" />
                  <div className="h-4 w-1/2 bg-muted rounded" />
                </div>
              ))}
            </>
          )}

          {!isLoading && restaurantList.map((restaurant) => (
            <RestaurantCard key={restaurant.id} restaurant={restaurant} />
          ))}
        </div>

        {!isLoading && restaurantList.length === 0 && (
          <div className="text-center py-12">
            <p className="text-muted-foreground">
              You haven't created any restaurants yet. Click the card above to get started!
            </p>
          </div>
        )}
      </main>

      <CreateRestaurantModal
        open={showCreateModal}
        onOpenChange={setShowCreateModal}
      />

      <PaywallModal
        open={showPaywall}
        onOpenChange={setShowPaywall}
        feature="Premium Features"
      />
    </div>
  );
};

export default Dashboard;
