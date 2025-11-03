import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export interface Restaurant {
  id: string;
  owner_id: string;
  name: string;
  slug: string;
  tagline: string | null;
  hero_image_url: string | null;
  theme: any;
  published: boolean;
  created_at: string;
  updated_at: string;
  allergen_filter_order?: string[];
  dietary_filter_order?: string[];
  badge_display_order?: string[];
  editor_view_mode?: 'grid' | 'table';
  show_allergen_filter?: boolean;
}

export const useRestaurants = () => {
  return useQuery({
    queryKey: ["restaurants"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("restaurants")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data as Restaurant[];
    },
  });
};

export const useRestaurant = (slug: string) => {
  return useQuery({
    queryKey: ["restaurant", slug],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("restaurants")
        .select("*")
        .eq("slug", slug)
        .maybeSingle();

      if (error) throw error;
      return data as Restaurant | null;
    },
    enabled: !!slug,
  });
};

export const useRestaurantById = (id: string) => {
  return useQuery({
    queryKey: ["restaurant", id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("restaurants")
        .select("*")
        .eq("id", id)
        .single();

      if (error) throw error;
      return data as Restaurant;
    },
    enabled: !!id,
  });
};

export const useCreateRestaurant = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (restaurant: Partial<Restaurant>) => {
      const maxRetries = 4;
      let lastError: any = null;

      for (let attempt = 0; attempt < maxRetries; attempt++) {
        const { data, error } = await supabase
          .from("restaurants")
          .insert([restaurant as any])
          .select("id, slug")
          .single();

        if (!error) {
          return data as Pick<Restaurant, "id" | "slug"> as any;
        }

        lastError = error;
        const msg = String(error?.message || "").toLowerCase();
        const isTransient = msg.includes("schema cache") || msg.includes("failed to fetch") || msg.includes("timeout");

        if (isTransient) {
          // Exponential backoff: 300ms, 600ms, 900ms, 1200ms
          await new Promise((r) => setTimeout(r, 300 * (attempt + 1)));
          continue;
        }
        break;
      }

      // Surface clearer messages for common cases
      const normalized = String(lastError?.message || "Failed to create restaurant");
      if (normalized.toLowerCase().includes("row-level security") || normalized.toLowerCase().includes("permission")) {
        throw new Error("Permission denied. Please sign in again and retry.");
      }
      throw new Error(normalized);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["restaurants"] });
      toast.success("Restaurant created successfully!");
    },
    onError: (error: any) => {
      toast.error(error.message || "Failed to create restaurant");
    },
  });
};

export const useUpdateRestaurant = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, updates }: { id: string; updates: Partial<Restaurant> }) => {
      const { data, error } = await supabase
        .from("restaurants")
        .update(updates)
        .eq("id", id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["restaurants"] });
      queryClient.invalidateQueries({ queryKey: ["restaurant", data.id] });
      queryClient.invalidateQueries({ queryKey: ["restaurant", data.slug] });
    },
  });
};

export const useDeleteRestaurant = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from("restaurants")
        .delete()
        .eq("id", id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["restaurants"] });
      toast.success("Restaurant deleted successfully!");
    },
    onError: (error: any) => {
      toast.error(error.message || "Failed to delete restaurant");
    },
  });
};
