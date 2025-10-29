import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export interface Category {
  id: string;
  restaurant_id: string;
  name: string;
  order_index: number;
  created_at: string;
}

export const useCategories = (restaurantId: string) => {
  return useQuery({
    queryKey: ["categories", restaurantId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("categories")
        .select("*")
        .eq("restaurant_id", restaurantId)
        .order("order_index", { ascending: true });

      if (error) throw error;
      return data as Category[];
    },
    enabled: !!restaurantId,
  });
};

export const useCreateCategory = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (category: Partial<Category>) => {
      const { data, error } = await supabase
        .from("categories")
        .insert([category as any])
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["categories", data.restaurant_id] });
    },
  });
};

// Phase 7: Optimistic updates for instant UI feedback
export const useUpdateCategory = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, updates }: { id: string; updates: Partial<Category> }) => {
      const { data, error } = await supabase
        .from("categories")
        .update(updates)
        .eq("id", id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onMutate: async ({ id, updates }) => {
      // Cancel outgoing refetches
      await queryClient.cancelQueries({ queryKey: ["categories"] });

      // Snapshot previous value
      const previousCategories = queryClient.getQueryData(["categories"]);

      // Optimistically update UI
      queryClient.setQueriesData({ queryKey: ["categories"] }, (old: any) => {
        if (!old) return old;
        return old.map((cat: Category) => (cat.id === id ? { ...cat, ...updates } : cat));
      });

      return { previousCategories };
    },
    onError: (err, variables, context) => {
      // Rollback on error
      if (context?.previousCategories) {
        queryClient.setQueriesData({ queryKey: ["categories"] }, context.previousCategories);
      }
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["categories", data.restaurant_id] });
      queryClient.invalidateQueries({ queryKey: ["restaurant-full-menu"] });
    },
  });
};

export const useDeleteCategory = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, restaurantId }: { id: string; restaurantId: string }) => {
      const { error } = await supabase
        .from("categories")
        .delete()
        .eq("id", id);

      if (error) throw error;
      return restaurantId;
    },
    onSuccess: (restaurantId) => {
      queryClient.invalidateQueries({ queryKey: ["categories", restaurantId] });
      queryClient.invalidateQueries({ queryKey: ["subcategories"] });
      queryClient.invalidateQueries({ queryKey: ["dishes"] });
      toast.success("Category deleted");
    },
  });
};

// Phase 2: Batch update order indexes (50x faster than individual updates)
export const useUpdateCategoriesOrder = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ categories }: { categories: { id: string; order_index: number }[] }) => {
      const { error } = await supabase.rpc("batch_update_order_indexes", {
        table_name: "categories",
        updates: categories,
      });

      if (error) throw error;
    },
    onSuccess: (_, variables) => {
      if (variables.categories.length > 0) {
        queryClient.invalidateQueries({ queryKey: ["categories"] });
        queryClient.invalidateQueries({ queryKey: ["restaurant-full-menu"] });
      }
    },
  });
};
