import { useState, CSSProperties } from "react";
import { TableCell, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Trash2, Copy } from "lucide-react";
import { EditableCell } from "./EditableCell";
import { useUpdateDish, useDeleteDish, type Dish } from "@/hooks/useDishes";
import { toast } from "sonner";

interface SpreadsheetRowProps {
  dish: Dish;
  isSelected: boolean;
  onSelect: (isSelected: boolean) => void;
  style?: CSSProperties;
}

export const SpreadsheetRow = ({ dish, isSelected, onSelect, style }: SpreadsheetRowProps) => {
  const updateDish = useUpdateDish();
  const deleteDish = useDeleteDish();
  const [localDish, setLocalDish] = useState(dish);

  const handleUpdate = async (field: keyof Dish, value: any) => {
    setLocalDish({ ...localDish, [field]: value });
    
    try {
      await updateDish.mutateAsync({
        id: dish.id,
        updates: { [field]: value },
      });
    } catch (error) {
      setLocalDish(dish);
      toast.error("Failed to update dish");
    }
  };

  const handleDelete = async () => {
    if (confirm("Delete this dish?")) {
      try {
        await deleteDish.mutateAsync({ id: dish.id, subcategoryId: dish.subcategory_id });
        toast.success("Dish deleted");
      } catch (error) {
        toast.error("Failed to delete dish");
      }
    }
  };

  return (
    <TableRow style={style} className="hover:bg-muted/50">
      <TableCell>
        <input
          type="checkbox"
          checked={isSelected}
          onChange={(e) => onSelect(e.target.checked)}
        />
      </TableCell>
      <TableCell>
        {localDish.image_url ? (
          <img
            src={localDish.image_url}
            alt={localDish.name}
            className="w-12 h-12 object-cover rounded"
          />
        ) : (
          <div className="w-12 h-12 bg-muted rounded flex items-center justify-center text-xs text-muted-foreground">
            No image
          </div>
        )}
      </TableCell>
      <TableCell>
        <EditableCell
          type="text"
          value={localDish.name}
          onSave={(value) => handleUpdate("name", value)}
        />
      </TableCell>
      <TableCell>
        <EditableCell
          type="textarea"
          value={localDish.description || ""}
          onSave={(value) => handleUpdate("description", value)}
        />
      </TableCell>
      <TableCell>
        <EditableCell
          type="text"
          value={localDish.price}
          onSave={(value) => handleUpdate("price", value)}
        />
      </TableCell>
      <TableCell>
        <EditableCell
          type="multi-select"
          value={localDish.allergens || []}
          onSave={(value) => handleUpdate("allergens", value)}
          options={["gluten", "dairy", "eggs", "fish", "shellfish", "nuts", "soy", "pork", "beef", "poultry"]}
        />
      </TableCell>
      <TableCell>
        <EditableCell
          type="boolean-group"
          value={{
            vegetarian: localDish.is_vegetarian,
            vegan: localDish.is_vegan,
            spicy: localDish.is_spicy,
          }}
          onSave={(value) => {
            handleUpdate("is_vegetarian", value.vegetarian);
            handleUpdate("is_vegan", value.vegan);
            handleUpdate("is_spicy", value.spicy);
          }}
        />
      </TableCell>
      <TableCell>
        <EditableCell
          type="boolean-group"
          value={{
            new: localDish.is_new,
            special: localDish.is_special,
            popular: localDish.is_popular,
            chef: localDish.is_chef_recommendation,
          }}
          onSave={(value) => {
            handleUpdate("is_new", value.new);
            handleUpdate("is_special", value.special);
            handleUpdate("is_popular", value.popular);
            handleUpdate("is_chef_recommendation", value.chef);
          }}
        />
      </TableCell>
      <TableCell>
        <EditableCell
          type="number"
          value={localDish.calories || ""}
          onSave={(value) => handleUpdate("calories", value ? parseInt(value as string) : null)}
        />
      </TableCell>
      <TableCell>
        <div className="flex items-center gap-1">
          <Button variant="ghost" size="sm" onClick={handleDelete}>
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </TableCell>
    </TableRow>
  );
};
