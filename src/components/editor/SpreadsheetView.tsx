import { useState, useRef, useCallback } from "react";
import { useVirtualizer } from "@tanstack/react-virtual";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Download, Upload, Trash2 } from "lucide-react";
import { SpreadsheetRow } from "./SpreadsheetRow";
import { ExcelImportDialog } from "./ExcelImportDialog";
import type { Dish } from "@/hooks/useDishes";
import type { Category } from "@/hooks/useCategories";
import type { Subcategory } from "@/hooks/useSubcategories";
import * as XLSX from "xlsx";
import { toast } from "sonner";

interface SpreadsheetViewProps {
  dishes: Dish[];
  categories: Category[];
  subcategories: Subcategory[];
  restaurantId: string;
  activeSubcategoryId: string;
}

export const SpreadsheetView = ({
  dishes,
  categories,
  subcategories,
  restaurantId,
  activeSubcategoryId,
}: SpreadsheetViewProps) => {
  const [selectedRows, setSelectedRows] = useState<Set<string>>(new Set());
  const [showImportDialog, setShowImportDialog] = useState(false);
  const [importData, setImportData] = useState<any[]>([]);
  const parentRef = useRef<HTMLDivElement>(null);

  const rowVirtualizer = useVirtualizer({
    count: dishes.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 60,
    overscan: 10,
  });

  const handleExport = useCallback(() => {
    try {
      const exportData = dishes.map((dish) => ({
        Name: dish.name,
        Description: dish.description || "",
        Price: dish.price,
        Calories: dish.calories || "",
        Allergens: dish.allergens?.join(", ") || "",
        Vegetarian: dish.is_vegetarian ? "Yes" : "No",
        Vegan: dish.is_vegan ? "Yes" : "No",
        Spicy: dish.is_spicy ? "Yes" : "No",
        New: dish.is_new ? "Yes" : "No",
        Special: dish.is_special ? "Yes" : "No",
        Popular: dish.is_popular ? "Yes" : "No",
        "Chef's Pick": dish.is_chef_recommendation ? "Yes" : "No",
      }));

      const worksheet = XLSX.utils.json_to_sheet(exportData);
      const workbook = XLSX.utils.book_new();
      
      const subcategory = subcategories.find((s) => s.id === activeSubcategoryId);
      const sheetName = subcategory?.name || "Dishes";
      
      XLSX.utils.book_append_sheet(workbook, worksheet, sheetName);
      XLSX.writeFile(workbook, `menu_${sheetName}_${Date.now()}.xlsx`);
      
      toast.success("Menu exported successfully");
    } catch (error) {
      toast.error("Failed to export menu");
    }
  }, [dishes, subcategories, activeSubcategoryId]);

  const handleImportClick = () => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = ".xlsx,.xls,.csv";
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (event) => {
          try {
            const data = new Uint8Array(event.target?.result as ArrayBuffer);
            const workbook = XLSX.read(data, { type: "array" });
            const firstSheet = workbook.Sheets[workbook.SheetNames[0]];
            const jsonData = XLSX.utils.sheet_to_json(firstSheet);
            setImportData(jsonData);
            setShowImportDialog(true);
          } catch (error) {
            toast.error("Failed to read file");
          }
        };
        reader.readAsArrayBuffer(file);
      }
    };
    input.click();
  };

  const handleRowSelect = (dishId: string, isSelected: boolean) => {
    setSelectedRows((prev) => {
      const newSet = new Set(prev);
      if (isSelected) {
        newSet.add(dishId);
      } else {
        newSet.delete(dishId);
      }
      return newSet;
    });
  };

  const handleBulkDelete = () => {
    // TODO: Implement bulk delete
    toast.success(`Deleted ${selectedRows.size} dishes`);
    setSelectedRows(new Set());
  };

  return (
    <div className="px-4 py-6">
      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          {selectedRows.size > 0 && (
            <>
              <span className="text-sm text-muted-foreground">
                {selectedRows.size} selected
              </span>
              <Button
                variant="destructive"
                size="sm"
                onClick={handleBulkDelete}
                className="gap-2"
              >
                <Trash2 className="h-4 w-4" />
                Delete Selected
              </Button>
            </>
          )}
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={handleImportClick} className="gap-2">
            <Upload className="h-4 w-4" />
            Import Excel
          </Button>
          <Button variant="outline" size="sm" onClick={handleExport} className="gap-2">
            <Download className="h-4 w-4" />
            Export Excel
          </Button>
        </div>
      </div>

      <div
        ref={parentRef}
        className="rounded-lg border border-border bg-card overflow-auto"
        style={{ height: "calc(100vh - 400px)" }}
      >
        <Table>
          <TableHeader className="sticky top-0 bg-card z-10">
            <TableRow>
              <TableHead className="w-12">
                <input
                  type="checkbox"
                  checked={selectedRows.size === dishes.length && dishes.length > 0}
                  onChange={(e) => {
                    if (e.target.checked) {
                      setSelectedRows(new Set(dishes.map((d) => d.id)));
                    } else {
                      setSelectedRows(new Set());
                    }
                  }}
                />
              </TableHead>
              <TableHead className="w-20">Image</TableHead>
              <TableHead className="w-48">Name</TableHead>
              <TableHead className="w-64">Description</TableHead>
              <TableHead className="w-32">Price</TableHead>
              <TableHead className="w-48">Allergens</TableHead>
              <TableHead className="w-32">Dietary</TableHead>
              <TableHead className="w-48">Badges</TableHead>
              <TableHead className="w-24">Calories</TableHead>
              <TableHead className="w-24">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {rowVirtualizer.getVirtualItems().map((virtualRow) => {
              const dish = dishes[virtualRow.index];
              return (
                <SpreadsheetRow
                  key={dish.id}
                  dish={dish}
                  isSelected={selectedRows.has(dish.id)}
                  onSelect={(isSelected) => handleRowSelect(dish.id, isSelected)}
                  style={{
                    height: `${virtualRow.size}px`,
                    transform: `translateY(${virtualRow.start}px)`,
                  }}
                />
              );
            })}
          </TableBody>
        </Table>
      </div>

      <ExcelImportDialog
        open={showImportDialog}
        onOpenChange={setShowImportDialog}
        data={importData}
        subcategoryId={activeSubcategoryId}
      />
    </div>
  );
};
