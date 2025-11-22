import { createClient } from "@/utils/supabase/server";
import { notFound } from "next/navigation";
import IframeRenderer from "@/app/components/IframeRenderer";
import { Metadata, ResolvingMetadata } from "next";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata(
  { params }: Props,
  parent: ResolvingMetadata
): Promise<Metadata> {
  const { slug } = await params;
  const supabase = await createClient();

  const { data: category } = await supabase
    .from("categories")
    .select("name, description, is_special_page, is_active")
    .eq("slug", slug)
    .single();

  if (!category || !category.is_special_page || !category.is_active) {
    return {};
  }

  return {
    title: `${category.name} | Enjoy Escapes`,
    description: category.description || `Find the best ${category.name} deals with Enjoy Escapes.`,
    openGraph: {
      title: `${category.name} | Enjoy Escapes`,
      description: category.description || `Find the best ${category.name} deals with Enjoy Escapes.`,
    },
  };
}

export default async function SpecialPage({ params }: Props) {
  const { slug } = await params;
  const supabase = await createClient();

  const { data: category } = await supabase
    .from("categories")
    .select("iframe_embed_code, is_special_page, is_active")
    .eq("slug", slug)
    .single();

  if (!category || !category.is_special_page || !category.is_active || !category.iframe_embed_code) {
    notFound();
  }

  return (
    <div className="w-full min-h-screen flex flex-col">
      <IframeRenderer embedCode={category.iframe_embed_code} />
    </div>
  );
}

