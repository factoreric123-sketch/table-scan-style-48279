import DishCard, { Dish } from "./DishCard";

interface MenuGridProps {
  dishes: Dish[];
  sectionTitle: string;
}

const MenuGrid = ({ dishes, sectionTitle }: MenuGridProps) => {
  if (dishes.length === 0) {
    return (
      <div className="px-6 py-12 text-center">
        <p className="text-muted-foreground">No dishes available in this category.</p>
      </div>
    );
  }

  return (
    <div className="px-6 py-8">
      <h2 className="text-3xl font-bold text-foreground mb-6">{sectionTitle}</h2>
      <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
        {dishes.map((dish) => (
          <DishCard key={dish.id} dish={dish} />
        ))}
      </div>
    </div>
  );
};

export default MenuGrid;
