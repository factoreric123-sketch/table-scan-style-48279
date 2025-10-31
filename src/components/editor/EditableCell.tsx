import { useState, useRef, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Wheat, Milk, Egg, Fish, Shell, Nut, Sprout as Soy, Beef, Bird, Salad, Sprout, Flame, Sparkles, Star, TrendingUp, ChefHat } from "lucide-react";
import { cn } from "@/lib/utils";

type EditableCellProps =
  | { type: "text"; value: string; onSave: (value: string) => void; options?: never }
  | { type: "textarea"; value: string; onSave: (value: string) => void; options?: never }
  | { type: "number"; value: string | number; onSave: (value: string) => void; options?: never }
  | { type: "multi-select"; value: string[]; onSave: (value: string[]) => void; options: string[] }
  | { type: "boolean-group"; value: Record<string, boolean>; onSave: (value: Record<string, boolean>) => void; options?: never };

const allergenIcons: Record<string, any> = {
  gluten: Wheat,
  dairy: Milk,
  eggs: Egg,
  fish: Fish,
  shellfish: Shell,
  nuts: Nut,
  soy: Soy,
  pork: Beef,
  beef: Beef,
  poultry: Bird,
};

const dietaryIcons: Record<string, any> = {
  vegetarian: Salad,
  vegan: Sprout,
  spicy: Flame,
};

const badgeIcons: Record<string, any> = {
  new: Sparkles,
  special: Star,
  popular: TrendingUp,
  chef: ChefHat,
};

export const EditableCell = (props: EditableCellProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [localValue, setLocalValue] = useState(props.value);
  const inputRef = useRef<HTMLInputElement | HTMLTextAreaElement>(null);

  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isEditing]);

  const handleSave = () => {
    props.onSave(localValue as any);
    setIsEditing(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSave();
    } else if (e.key === "Escape") {
      setLocalValue(props.value);
      setIsEditing(false);
    }
  };

  if (props.type === "text") {
    return (
      <div className="w-full">
        {isEditing ? (
          <Input
            ref={inputRef as any}
            value={localValue as string}
            onChange={(e) => setLocalValue(e.target.value)}
            onBlur={handleSave}
            onKeyDown={handleKeyDown}
            className="h-8 text-sm"
          />
        ) : (
          <div
            onClick={() => setIsEditing(true)}
            className="cursor-pointer hover:bg-muted px-2 py-1 rounded min-h-[32px] flex items-center"
          >
            {(localValue as string) || <span className="text-muted-foreground">Click to edit</span>}
          </div>
        )}
      </div>
    );
  }

  if (props.type === "textarea") {
    return (
      <div className="w-full">
        {isEditing ? (
          <Textarea
            ref={inputRef as any}
            value={localValue as string}
            onChange={(e) => setLocalValue(e.target.value)}
            onBlur={handleSave}
            onKeyDown={handleKeyDown}
            className="min-h-[60px] text-sm resize-none"
          />
        ) : (
          <div
            onClick={() => setIsEditing(true)}
            className="cursor-pointer hover:bg-muted px-2 py-1 rounded min-h-[32px] line-clamp-2 text-sm"
          >
            {(localValue as string) || <span className="text-muted-foreground">Click to edit</span>}
          </div>
        )}
      </div>
    );
  }

  if (props.type === "number") {
    return (
      <div className="w-full">
        {isEditing ? (
          <Input
            ref={inputRef as any}
            type="number"
            value={localValue as string | number}
            onChange={(e) => setLocalValue(e.target.value)}
            onBlur={handleSave}
            onKeyDown={handleKeyDown}
            className="h-8 text-sm"
          />
        ) : (
          <div
            onClick={() => setIsEditing(true)}
            className="cursor-pointer hover:bg-muted px-2 py-1 rounded min-h-[32px] flex items-center"
          >
            {(localValue as string | number) || <span className="text-muted-foreground">-</span>}
          </div>
        )}
      </div>
    );
  }

  if (props.type === "multi-select") {
    const toggleOption = (option: string) => {
      const current = localValue as string[];
      const newValue = current.includes(option)
        ? current.filter((v) => v !== option)
        : [...current, option];
      setLocalValue(newValue);
      props.onSave(newValue);
    };

    return (
      <div className="flex flex-wrap gap-1">
        {props.options.map((option) => {
          const Icon = allergenIcons[option];
          const isSelected = (localValue as string[]).includes(option);
          return (
            <Badge
              key={option}
              variant={isSelected ? "default" : "outline"}
              className="cursor-pointer gap-1 text-xs active:scale-95 transition-transform"
              onClick={() => toggleOption(option)}
            >
              {Icon && <Icon className="h-3 w-3" />}
              {option.charAt(0).toUpperCase() + option.slice(1)}
            </Badge>
          );
        })}
      </div>
    );
  }

  if (props.type === "boolean-group") {
    const handleToggle = (key: string, checked: boolean) => {
      const newValue = { ...(localValue as Record<string, boolean>), [key]: checked };
      setLocalValue(newValue);
      props.onSave(newValue);
    };

    const entries = Object.entries(localValue as Record<string, boolean>);
    const icons = { ...dietaryIcons, ...badgeIcons };

    return (
      <div className="flex flex-col gap-2">
        {entries.map(([key, value]) => {
          const Icon = icons[key];
          return (
            <div key={key} className="flex items-center gap-2">
              <Switch
                checked={value}
                onCheckedChange={(checked) => handleToggle(key, checked)}
                className="scale-75"
              />
              <div className="flex items-center gap-1 text-xs">
                {Icon && <Icon className="h-3 w-3" />}
                <span>{key.charAt(0).toUpperCase() + key.slice(1)}</span>
              </div>
            </div>
          );
        })}
      </div>
    );
  }

  return null;
};
