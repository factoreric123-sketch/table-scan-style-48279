import { Badge } from "@/components/ui/badge";

export interface Dish {
  id: string;
  name: string;
  description: string;
  price: string;
  image: string;
  isNew?: boolean;
  category: string;
  subcategory: string;
}

interface DishCardProps {
  dish: Dish;
}

const DishCard = ({ dish }: DishCardProps) => {
  return (
    <div className="group relative">
      {dish.isNew && (
        <Badge className="absolute top-2 right-2 z-10 bg-new-badge text-white px-3 py-1 rounded-full text-xs font-semibold shadow-lg">
          New Addition
        </Badge>
      )}
      <div className="bg-dish-card rounded-2xl overflow-hidden aspect-square mb-2.5 relative shadow-md">
        <img 
          src={dish.image} 
          alt={`${dish.name} - ${dish.description}`}
          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
          loading="lazy"
        />
      </div>
      <div>
        <h3 className="text-base font-bold text-foreground mb-1">{dish.name}</h3>
        <p className="text-xs text-muted-foreground mb-1.5 line-clamp-2">{dish.description}</p>
        <p className="text-sm font-semibold text-foreground">{dish.price}</p>
      </div>
    </div>
  );
};

export default DishCard;
