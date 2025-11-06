import { useEffect, useState } from "react";
import { useParams, Navigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";

// Redirects /m/:restaurantHash/:menuId -> /menu/:slug
// Resolves via public menu_links table and published restaurants only
const MenuShortRedirect = () => {
  const { restaurantHash, menuId } = useParams<{
    restaurantHash: string;
    menuId: string;
  }>();

  const [target, setTarget] = useState<string | null>(null);
  const [status, setStatus] = useState<"loading" | "not-found" | "unpublished">(
    "loading"
  );

  // Basic sanitation
  const cleanHash = (restaurantHash || "")
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]/g, "");
  const cleanMenuId = (menuId || "").trim().replace(/[^0-9]/g, "");

  useEffect(() => {
    let isMounted = true;
    const resolve = async () => {
      try {
        if (!cleanHash || !cleanMenuId) {
          setStatus("not-found");
          return;
        }

        // 1) Find active link
        const { data: link, error: linkErr } = await supabase
          .from("menu_links")
          .select("restaurant_id")
          .eq("restaurant_hash", cleanHash)
          .eq("menu_id", cleanMenuId)
          .eq("active", true)
          .maybeSingle();

        if (linkErr) {
          console.error("[MenuShortRedirect] link error", linkErr);
          setStatus("not-found");
          return;
        }
        if (!link) {
          setStatus("not-found");
          return;
        }

        // 2) Fetch restaurant and verify published
        const { data: restaurant, error: rErr } = await supabase
          .from("restaurants")
          .select("slug, published")
          .eq("id", link.restaurant_id)
          .maybeSingle();

        if (rErr) {
          console.error("[MenuShortRedirect] restaurant error", rErr);
          setStatus("not-found");
          return;
        }
        if (!restaurant) {
          setStatus("not-found");
          return;
        }
        if (!restaurant.published) {
          setStatus("unpublished");
          return;
        }

        if (!isMounted) return;
        setTarget(`/menu/${restaurant.slug}`);
      } catch (e) {
        console.error("[MenuShortRedirect] unexpected", e);
        setStatus("not-found");
      }
    };

    resolve();
    return () => {
      isMounted = false;
    };
  }, [cleanHash, cleanMenuId]);

  if (target) return <Navigate to={target} replace />;
  if (status === "not-found") return <Navigate to="/" replace />;
  if (status === "unpublished") return <Navigate to="/" replace />;

  return null; // minimal flash while resolving
};

export default MenuShortRedirect;
