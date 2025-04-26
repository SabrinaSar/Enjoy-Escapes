import { createClient } from "@/utils/supabase/server";
import { Metadata } from "next";
import { format } from "date-fns";
import { BarChart, Calendar, ListFilter, TrendingUp } from "lucide-react";

export const metadata: Metadata = {
  title: "Escape Analytics | Admin Panel",
  description: "Track and analyze escape deal clicks",
};

// Define types
interface EscapeDetails {
  id: number;
  title: string;
  price: number | null;
  link: string | null;
  type: string | null;
}

interface ClickData {
  id: number;
  escape_id: number;
  created_at: string;
  source: string | null;
  referrer: string | null;
  user_agent: string | null;
}

export default async function ClickAnalytics() {
  const supabase = await createClient();

  // Get total click count
  const { count: totalClicks, error: countError } = await supabase
    .from("clicks_data")
    .select('*', { count: 'exact', head: true });

  // Get recent clicks with escape details
  const { data: recentClicks, error: recentClicksError } = await supabase
    .from("clicks_data")
    .select(`
      id,
      escape_id,
      created_at,
      source,
      referrer,
      user_agent
    `)
    .order("created_at", { ascending: false })
    .limit(100);

  // Fetch escape details for the click data
  const escapeDetails: Record<number, EscapeDetails> = {};
  if (recentClicks && recentClicks.length > 0) {
    const escapeIds = Array.from(new Set(recentClicks.map(click => click.escape_id)));
    const { data: escapes } = await supabase
      .from("escapes_data")
      .select("id, title, price, link, type")
      .in("id", escapeIds);
      
    if (escapes) {
      escapes.forEach(escape => {
        escapeDetails[escape.id] = escape as EscapeDetails;
      });
    }
  }

  // Process click data to count by escape
  const clicksByEscape = processClicksByEscape(recentClicks || []);
  
  // Sort escapes by click count
  const sortedEscapes = Object.entries(clicksByEscape)
    .map(([escapeId, count]) => {
      const id = parseInt(escapeId);
      return {
        escapeId: id,
        count,
        details: escapeDetails[id] || { 
          id,
          title: 'Unknown Escape', 
          price: 0, 
          link: '#', 
          type: null 
        }
      };
    })
    .sort((a, b) => b.count - a.count)
    .slice(0, 50);

  if (countError || recentClicksError) {
    return (
      <div className="container mx-auto p-4">
        <h1 className="text-2xl font-bold mb-4">Analytics Error</h1>
        <div className="bg-red-50 dark:bg-red-900/20 p-4 rounded-md text-red-800 dark:text-red-200">
          <p>Error loading analytics data:</p>
          <p>{countError?.message || recentClicksError?.message}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-2 sm:p-4 space-y-6 sm:space-y-8">
      <h1 className="text-2xl sm:text-3xl font-bold">Escape Analytics</h1>
      
      {/* Overview Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <div className="bg-card rounded-lg p-3 sm:p-4 shadow-sm border">
          <div className="flex items-center justify-between">
            <h3 className="text-sm sm:text-lg font-medium text-muted-foreground">Total Clicks</h3>
            <TrendingUp className="h-4 w-4 sm:h-5 sm:w-5 text-primary" />
          </div>
          <p className="text-xl sm:text-3xl font-bold mt-1 sm:mt-2">{totalClicks || 0}</p>
        </div>
        
        <div className="bg-card rounded-lg p-3 sm:p-4 shadow-sm border">
          <div className="flex items-center justify-between">
            <h3 className="text-sm sm:text-lg font-medium text-muted-foreground">Top Escape</h3>
            <BarChart className="h-4 w-4 sm:h-5 sm:w-5 text-primary" />
          </div>
          <p className="text-sm sm:text-lg font-medium mt-1 sm:mt-2 truncate">
            {sortedEscapes.length > 0 ? sortedEscapes[0].details.title : 'No data'}
          </p>
        </div>
        
        <div className="bg-card rounded-lg p-3 sm:p-4 shadow-sm border">
          <div className="flex items-center justify-between">
            <h3 className="text-sm sm:text-lg font-medium text-muted-foreground">Recent Date</h3>
            <Calendar className="h-4 w-4 sm:h-5 sm:w-5 text-primary" />
          </div>
          <p className="text-sm sm:text-lg font-medium mt-1 sm:mt-2">
            {recentClicks && recentClicks.length > 0 
              ? format(new Date(recentClicks[0].created_at), 'PP') 
              : 'No data'}
          </p>
        </div>
        
        <div className="bg-card rounded-lg p-3 sm:p-4 shadow-sm border">
          <div className="flex items-center justify-between">
            <h3 className="text-sm sm:text-lg font-medium text-muted-foreground">Tracked Escapes</h3>
            <ListFilter className="h-4 w-4 sm:h-5 sm:w-5 text-primary" />
          </div>
          <p className="text-xl sm:text-3xl font-bold mt-1 sm:mt-2">{Object.keys(clicksByEscape).length || 0}</p>
        </div>
      </div>
      
      {/* Top Escapes Table */}
      <div>
        <h2 className="text-xl sm:text-2xl font-bold mb-3 sm:mb-4">Top Escapes</h2>
        {sortedEscapes.length > 0 ? (
          <div className="overflow-x-auto -mx-2 sm:mx-0">
            <div className="min-w-full px-2 sm:px-0">
              <div className="rounded-md border overflow-hidden">
                <table className="w-full text-sm">
                  <thead className="bg-muted/50">
                    <tr>
                      <th className="py-2 sm:py-3 px-2 sm:px-4 text-left font-medium">Escape</th>
                      <th className="py-2 sm:py-3 px-2 sm:px-4 text-left font-medium">Type</th>
                      <th className="py-2 sm:py-3 px-2 sm:px-4 text-left font-medium">Price</th>
                      <th className="py-2 sm:py-3 px-2 sm:px-4 text-left font-medium">Clicks</th>
                    </tr>
                  </thead>
                  <tbody>
                    {sortedEscapes.map((item) => (
                      <tr key={item.escapeId} className="border-t hover:bg-muted/50">
                        <td className="py-2 sm:py-3 px-2 sm:px-4">
                          <a 
                            href={item.details.link || '#'} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="hover:underline font-medium text-primary"
                          >
                            {item.details.title || 'Untitled Escape'}
                          </a>
                        </td>
                        <td className="py-2 sm:py-3 px-2 sm:px-4">{formatEscapeType(item.details.type)}</td>
                        <td className="py-2 sm:py-3 px-2 sm:px-4">£{item.details.price || 0}</td>
                        <td className="py-2 sm:py-3 px-2 sm:px-4 font-bold">{item.count}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        ) : (
          <div className="py-8 text-center text-muted-foreground">
            No click data available yet
          </div>
        )}
      </div>
      
      {/* Recent Clicks Table */}
      <div>
        <h2 className="text-xl sm:text-2xl font-bold mb-3 sm:mb-4">Recent Clicks</h2>
        {recentClicks && recentClicks.length > 0 ? (
          <div className="overflow-x-auto -mx-2 sm:mx-0">
            <div className="min-w-full px-2 sm:px-0">
              <div className="rounded-md border overflow-hidden">
                <table className="w-full text-sm">
                  <thead className="bg-muted/50">
                    <tr>
                      <th className="py-2 sm:py-3 px-2 sm:px-4 text-left font-medium">Escape</th>
                      <th className="py-2 sm:py-3 px-2 sm:px-4 text-left font-medium">Time</th>
                      <th className="py-2 sm:py-3 px-2 sm:px-4 text-left font-medium">Source</th>
                      <th className="py-2 sm:py-3 px-2 sm:px-4 text-left font-medium">Referrer</th>
                    </tr>
                  </thead>
                  <tbody>
                    {recentClicks.map((click: ClickData) => (
                      <tr key={click.id} className="border-t hover:bg-muted/50">
                        <td className="py-2 sm:py-3 px-2 sm:px-4">
                          {escapeDetails[click.escape_id] ? (
                            <a 
                              href={escapeDetails[click.escape_id].link || '#'} 
                              target="_blank" 
                              rel="noopener noreferrer"
                              className="hover:underline text-primary"
                            >
                              {escapeDetails[click.escape_id].title || 'Untitled Escape'}
                            </a>
                          ) : (
                            `Escape ID: ${click.escape_id}`
                          )}
                        </td>
                        <td className="py-2 sm:py-3 px-2 sm:px-4">{format(new Date(click.created_at), 'PPp')}</td>
                        <td className="py-2 sm:py-3 px-2 sm:px-4 max-w-[100px] sm:max-w-[200px] truncate">{click.source || '-'}</td>
                        <td className="py-2 sm:py-3 px-2 sm:px-4 max-w-[100px] sm:max-w-[200px] truncate">{click.referrer || '-'}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        ) : (
          <div className="py-8 text-center text-muted-foreground">
            No click data available yet
          </div>
        )}
      </div>
    </div>
  );
}

// Helper functions
function formatEscapeType(type: string | null): string {
  if (!type) return 'Unknown';
  
  switch (type) {
    case 'hotel': return 'Hotel';
    case 'flight': return 'Flight';
    case 'hotel+flight': return 'Hotel + Flight';
    default: return type;
  }
}

function processClicksByEscape(clicks: ClickData[]): Record<string, number> {
  return clicks.reduce((acc: Record<string, number>, click) => {
    const escapeId = click.escape_id.toString();
    acc[escapeId] = (acc[escapeId] || 0) + 1;
    return acc;
  }, {});
} 