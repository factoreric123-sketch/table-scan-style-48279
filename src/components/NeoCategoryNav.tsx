import { memo } from "react";

interface NeoCategoryNavProps {
  categories: string[];
  activeCategory: string;
  onCategoryChange: (category: string) => void;
}

const NeoCategoryNav = memo(({ categories, activeCategory, onCategoryChange }: NeoCategoryNavProps) => {
  return (
    <nav className="flex gap-6 overflow-x-auto pb-2 pt-4 px-6 scrollbar-hide border-b border-border">
      {categories.map((category) => (
        <button
          key={category}
          onClick={() => onCategoryChange(category)}
          className={`
            whitespace-nowrap pb-3 relative text-base font-medium transition-all
            ${activeCategory === category 
              ? 'text-foreground' 
              : 'text-muted-foreground hover:text-foreground'
            }
          `}
        >
          {category}
          {activeCategory === category && (
            <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-foreground" />
          )}
        </button>
      ))}
    </nav>
  );
});

NeoCategoryNav.displayName = 'NeoCategoryNav';

export default NeoCategoryNav;
