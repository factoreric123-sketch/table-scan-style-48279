import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import type { Restaurant } from "@/hooks/useRestaurants";

interface RestaurantSettingsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  restaurant: Restaurant;
  onFilterToggle: () => void;
}

export const RestaurantSettingsDialog = ({
  open,
  onOpenChange,
  restaurant,
  onFilterToggle,
}: RestaurantSettingsDialogProps) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Restaurant Settings</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6 py-4">
          <div>
            <h3 className="text-sm font-semibold mb-4">Customer View Options</h3>
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="filter-toggle" className="text-base">
                  Show Filter Options
                </Label>
                <p className="text-sm text-muted-foreground">
                  Allow customers to filter menu by allergens, dietary preferences, and badges
                </p>
              </div>
              <Switch
                id="filter-toggle"
                checked={restaurant.show_allergen_filter !== false}
                onCheckedChange={onFilterToggle}
              />
            </div>
          </div>
          
          <Separator />
          
          <div className="text-xs text-muted-foreground">
            More settings coming soon...
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
