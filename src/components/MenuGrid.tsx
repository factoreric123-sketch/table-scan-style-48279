import DishCard, { Dish } from "./DishCard";

interface MenuGridProps {
  dishes: Dish[];
}

const MenuGrid = ({ dishes }: MenuGridProps) => {
  if (dishes.length === 0) {
    return (
      <div className="px-6 py-12 text-center">
        <p className="text-muted-foreground">No dishes available in this category.</p>
      </div>
    );
  }

  return (
    <div className="px-6 py-6">
      <div className="grid grid-cols-2 gap-5 md:grid-cols-3 lg:grid-cols-4">
        {dishes.map((dish) => (
          <DishCard key={dish.id} dish={dish} />
        ))}
      </div>
    </div>
  );
};

export default MenuGrid;
