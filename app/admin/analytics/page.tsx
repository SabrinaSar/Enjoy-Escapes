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

interface AllClicksData {
  escape_id: number;
}

interface ClickCountData {
  escape_id: number;
  click_count: number;
}

export default async function ClickAnalytics() {
  const supabase = await createClient();

  // Get total click count (lifetime)
  const { count: totalClicks, error: countError } = await supabase
    .from("clicks_data")
    .select('*', { count: 'exact', head: true });

  // Get click counts per escape using SQL aggregation (much more efficient)
  const { data: clickCounts, error: clickCountsError } = await supabase
    .rpc('get_click_counts_by_escape');

  // Get recent 10 clicks for the "Recent Clicks" table
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
    .limit(10);

  // Fetch escape details for all escapes that have clicks
  const escapeDetails: Record<number, EscapeDetails> = {};
  const allEscapeIds = Array.from(new Set([
    ...(clickCounts?.map((item: ClickCountData) => item.escape_id) || []),
    ...(recentClicks?.map(click => click.escape_id) || [])
  ]));

  if (allEscapeIds.length > 0) {
    const { data: escapes } = await supabase
      .from("escapes_data")
      .select("id, title, price, link, type")
      .in("id", allEscapeIds);
      
    if (escapes) {
      escapes.forEach(escape => {
        escapeDetails[escape.id] = escape as EscapeDetails;
      });
    }
  }

  // Convert click counts to the format expected by the UI
  const clicksByEscape: Record<string, number> = {};
  if (clickCounts) {
    clickCounts.forEach((item: ClickCountData) => {
      clicksByEscape[item.escape_id.toString()] = item.click_count;
    });
  }
  
  // Sort escapes by lifetime click count
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
    .slice(0, 20); // Show top 20 instead of 50 for cleaner UI

  if (countError || clickCountsError || recentClicksError) {
    return (
      <div className="container mx-auto p-4">
        <h1 className="text-2xl font-bold mb-4">Analytics Error</h1>
        <div className="bg-red-50 dark:bg-red-900/20 p-4 rounded-md text-red-800 dark:text-red-200">
          <p>Error loading analytics data:</p>
          <p>{countError?.message || clickCountsError?.message || recentClicksError?.message}</p>
          {clickCountsError && (
            <p className="mt-2 text-sm">
              Note: If you see a "function get_click_counts_by_escape() does not exist" error, 
              you need to create the database function. Check the console for the SQL to run.
            </p>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="p-2 sm:p-4 space-y-6 sm:space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
        <h1 className="text-2xl sm:text-3xl font-bold">Escape Analytics</h1>
        <div className="text-sm text-muted-foreground">
          Lifetime statistics • Last updated: {format(new Date(), 'PPp')}
        </div>
      </div>
      
      {/* Overview Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <div className="bg-card rounded-lg p-3 sm:p-4 shadow-sm border">
          <div className="flex items-center justify-between">
            <h3 className="text-sm sm:text-base font-medium text-muted-foreground">Total Clicks</h3>
            <TrendingUp className="h-4 w-4 sm:h-5 sm:w-5 text-primary" />
          </div>
          <p className="text-xl sm:text-3xl font-bold mt-1 sm:mt-2">{totalClicks || 0}</p>
          <p className="text-xs text-muted-foreground mt-1">Lifetime total</p>
        </div>
        
        <div className="bg-card rounded-lg p-3 sm:p-4 shadow-sm border">
          <div className="flex items-center justify-between">
            <h3 className="text-sm sm:text-base font-medium text-muted-foreground">Tracked Escapes</h3>
            <ListFilter className="h-4 w-4 sm:h-5 sm:w-5 text-primary" />
          </div>
          <p className="text-xl sm:text-3xl font-bold mt-1 sm:mt-2">{Object.keys(clicksByEscape).length || 0}</p>
          <p className="text-xs text-muted-foreground mt-1">Unique escapes clicked</p>
        </div>
        
        <div className="bg-card rounded-lg p-3 sm:p-4 shadow-sm border">
          <div className="flex items-center justify-between">
            <h3 className="text-sm sm:text-base font-medium text-muted-foreground">Top Escape</h3>
            <BarChart className="h-4 w-4 sm:h-5 sm:w-5 text-primary" />
          </div>
          <p className="text-sm sm:text-base font-medium mt-1 sm:mt-2 truncate">
            {sortedEscapes.length > 0 ? sortedEscapes[0].details.title : 'No data'}
          </p>
          <p className="text-xs text-muted-foreground mt-1">
            {sortedEscapes.length > 0 ? `${sortedEscapes[0].count} clicks` : 'Most clicked escape'}
          </p>
        </div>
        
        <div className="bg-card rounded-lg p-3 sm:p-4 shadow-sm border">
          <div className="flex items-center justify-between">
            <h3 className="text-sm sm:text-base font-medium text-muted-foreground">Latest Click</h3>
            <Calendar className="h-4 w-4 sm:h-5 sm:w-5 text-primary" />
          </div>
          <p className="text-sm sm:text-base font-medium mt-1 sm:mt-2">
            {recentClicks && recentClicks.length > 0 
              ? format(new Date(recentClicks[0].created_at), 'PP') 
              : 'No data'}
          </p>
          <p className="text-xs text-muted-foreground mt-1">
            {recentClicks && recentClicks.length > 0 
              ? format(new Date(recentClicks[0].created_at), 'p')
              : 'Most recent activity'}
          </p>
        </div>
      </div>
      
      {/* Top Escapes Table */}
      <div>
        <div className="flex items-center justify-between mb-3 sm:mb-4">
          <h2 className="text-xl sm:text-2xl font-bold">Top Escapes</h2>
          <div className="text-sm text-muted-foreground">
            Lifetime click counts
          </div>
        </div>
        {sortedEscapes.length > 0 ? (
          <div className="overflow-x-auto -mx-2 sm:mx-0">
            <div className="min-w-full px-2 sm:px-0">
              <div className="rounded-md border overflow-hidden">
                <table className="w-full text-sm">
                  <thead className="bg-muted/50">
                    <tr>
                      <th className="py-2 sm:py-3 px-2 sm:px-4 text-left font-medium">Rank</th>
                      <th className="py-2 sm:py-3 px-2 sm:px-4 text-left font-medium">Escape</th>
                      <th className="py-2 sm:py-3 px-2 sm:px-4 text-left font-medium">Type</th>
                      <th className="py-2 sm:py-3 px-2 sm:px-4 text-left font-medium">Price</th>
                      <th className="py-2 sm:py-3 px-2 sm:px-4 text-left font-medium">Total Clicks</th>
                    </tr>
                  </thead>
                  <tbody>
                    {sortedEscapes.map((item, index) => (
                      <tr key={item.escapeId} className="border-t hover:bg-muted/50">
                        <td className="py-2 sm:py-3 px-2 sm:px-4 font-medium text-muted-foreground">
                          #{index + 1}
                        </td>
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
                        <td className="py-2 sm:py-3 px-2 sm:px-4 font-bold text-primary">{item.count}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        ) : (
          <div className="py-8 text-center text-muted-foreground bg-muted/20 rounded-lg">
            <BarChart className="h-8 w-8 mx-auto mb-2 opacity-50" />
            <p>No click data available yet</p>
            <p className="text-xs mt-1">Clicks will appear here once users start interacting with escapes</p>
          </div>
        )}
      </div>
      
      {/* Recent Clicks Table */}
      <div>
        <div className="flex items-center justify-between mb-3 sm:mb-4">
          <h2 className="text-xl sm:text-2xl font-bold">Recent Activity</h2>
          <div className="text-sm text-muted-foreground">
            Last 10 clicks
          </div>
        </div>
        {recentClicks && recentClicks.length > 0 ? (
          <div className="overflow-x-auto -mx-2 sm:mx-0">
            <div className="min-w-full px-2 sm:px-0">
              <div className="rounded-md border overflow-hidden">
                <table className="w-full text-sm">
                  <thead className="bg-muted/50">
                    <tr>
                      <th className="py-2 sm:py-3 px-2 sm:px-4 text-left font-medium">Escape</th>
                      <th className="py-2 sm:py-3 px-2 sm:px-4 text-left font-medium">Time</th>
                      <th className="py-2 sm:py-3 px-2 sm:px-4 text-left font-medium">Source Page</th>
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
                              className="hover:underline text-primary font-medium"
                            >
                              {escapeDetails[click.escape_id].title || 'Untitled Escape'}
                            </a>
                          ) : (
                            <span className="text-muted-foreground">Escape ID: {click.escape_id}</span>
                          )}
                        </td>
                        <td className="py-2 sm:py-3 px-2 sm:px-4">
                          <div className="flex flex-col">
                            <span className="font-medium">{format(new Date(click.created_at), 'MMM d')}</span>
                            <span className="text-xs text-muted-foreground">{format(new Date(click.created_at), 'HH:mm')}</span>
                          </div>
                        </td>
                        <td className="py-2 sm:py-3 px-2 sm:px-4 max-w-[100px] sm:max-w-[200px] truncate">
                          {click.source ? (
                            <span className="text-xs bg-muted px-2 py-1 rounded">{click.source}</span>
                          ) : (
                            <span className="text-muted-foreground">-</span>
                          )}
                        </td>
                        <td className="py-2 sm:py-3 px-2 sm:px-4 max-w-[100px] sm:max-w-[200px] truncate text-xs text-muted-foreground">
                          {click.referrer || '-'}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        ) : (
          <div className="py-8 text-center text-muted-foreground bg-muted/20 rounded-lg">
            <Calendar className="h-8 w-8 mx-auto mb-2 opacity-50" />
            <p>No recent activity</p>
            <p className="text-xs mt-1">Recent clicks will appear here as users interact with escapes</p>
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
    case 'other': return 'Other';
    default: return type;
  }
}

function processClicksByEscape(clicks: AllClicksData[]): Record<string, number> {
  return clicks.reduce((acc: Record<string, number>, click) => {
    const escapeId = click.escape_id.toString();
    acc[escapeId] = (acc[escapeId] || 0) + 1;
    return acc;
  }, {});
} 