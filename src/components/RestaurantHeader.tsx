interface RestaurantHeaderProps {
  name: string;
  tagline?: string;
}

const RestaurantHeader = ({ name, tagline }: RestaurantHeaderProps) => {
  return (
    <div className="px-6 py-6 border-b border-border">
      <h1 className="text-3xl font-bold text-foreground mb-1">{name}</h1>
      {tagline && <p className="text-sm text-muted-foreground">{tagline}</p>}
    </div>
  );
};

export default RestaurantHeader;
