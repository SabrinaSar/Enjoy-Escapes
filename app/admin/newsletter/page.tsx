import React from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Users, Settings2 } from "lucide-react"; // Optional: for icons
import AllSubscribers from "@/app/components/newsletterComponents/AllSubscribers";
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

      <Tabs defaultValue="subscribers" className="w-full space-y-6">
        {/* Tab Switcher Bar */}
        <div className="flex justify-center sm:justify-start border-b border-border pb-1">
          <TabsList className="bg-muted/50 p-1">
            <TabsTrigger
              value="subscribers"
              className="flex items-center gap-2 px-6"
            >
              <Users className="w-4 h-4" />
              All Subscribers
            </TabsTrigger>
            <TabsTrigger value="popup" className="flex items-center gap-2 px-6">
              <Settings2 className="w-4 h-4" />
              Popup Settings
            </TabsTrigger>
          </TabsList>
        </div>

        {/* Tab Content Areas */}
        <TabsContent
          value="subscribers"
          className="mt-0 border-none p-0 outline-none"
        >
          <div className="rounded-xl border border-border bg-card shadow-sm p-6">
            <AllSubscribers searchParams={resolvedSearchParams} />
          </div>
        </TabsContent>

        <TabsContent
          value="popup"
          className="mt-0 border-none p-0 outline-none"
        >
          <div className="rounded-xl border border-border bg-card shadow-sm p-6">
            <EditMailPoup initialData={popupData} />
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default NewsletterPage;
