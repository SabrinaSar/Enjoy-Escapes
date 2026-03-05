import React from "react";
import EditMailPoup from "@/app/components/newsletterComponents/EditMailPoup";

import { supabase } from "@/lib/supabase";

const NewsletterPage = async ({
  searchParams,
}: {
  searchParams: Promise<{ page?: string }>;
}) => {
  const resolvedSearchParams = await searchParams;
  // ✅ Fetch popup data on server to pass to client component
  const { data: popupData } = await supabase
    .from("newsletter_popup_settings")
    .select("*")
    .eq("is_active", true)
    .order("id", { ascending: false })
    .limit(1)
    .maybeSingle();

  return (
    <div className="container mx-auto py-10 px-4 max-w-7xl min-h-screen">
      <div className="mb-8 space-y-2">
        <h1 className="text-3xl font-bold tracking-tight text-foreground">
          Newsletter Management
        </h1>
        <p className="text-muted-foreground">
          Manage your audience and customize your subscription popup.
        </p>
      </div>

      <div className="rounded-xl border border-border bg-card shadow-sm p-6">
        <EditMailPoup initialData={popupData} />
      </div>
    </div>
  );
};

export default NewsletterPage;
