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
        .select("id, owner_id, name, slug, tagline, hero_image_url, theme, published, created_at, updated_at, allergen_filter_order, dietary_filter_order, badge_display_order, editor_view_mode, show_allergen_filter")
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data as Restaurant[];
    },
    staleTime: 60000,
    retry: 2,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 5000),
  });
};

export const useRestaurant = (slug: string) => {
  return useQuery({
    queryKey: ["restaurant", slug],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("restaurants")
        .select("id, owner_id, name, slug, tagline, hero_image_url, theme, published, created_at, updated_at, allergen_filter_order, dietary_filter_order, badge_display_order, editor_view_mode, show_allergen_filter")
        .eq("slug", slug)
        .maybeSingle();

      if (error) throw error;
      return data as Restaurant | null;
    },
    enabled: !!slug,
    staleTime: 60000,
    retry: 2,
  });
};

export const useRestaurantById = (id: string) => {
  return useQuery({
    queryKey: ["restaurant", id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("restaurants")
        .select("id, owner_id, name, slug, tagline, hero_image_url, theme, published, created_at, updated_at, allergen_filter_order, dietary_filter_order, badge_display_order, editor_view_mode, show_allergen_filter")
        .eq("id", id)
        .maybeSingle();

      if (error) throw error;
      return data as Restaurant;
    },
    enabled: !!id,
    staleTime: 60000,
    retry: 2,
  });
};

export const useCreateRestaurant = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (restaurant: Partial<Restaurant>) => {
      const { data, error } = await supabase
        .from("restaurants")
        .insert([restaurant as any])
        .select()
        .single();

      if (error) throw error;
      return data;
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
      // Only invalidate what's necessary
      queryClient.setQueryData(["restaurant", data.id], data);
      queryClient.setQueryData(["restaurant", data.slug], data);
    },
    retry: 1,
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
