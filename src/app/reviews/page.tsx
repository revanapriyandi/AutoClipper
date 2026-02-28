'use client';
import { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Copy, ExternalLink, Trash2, CheckCircle, XCircle, Clock } from 'lucide-react';
import { format } from 'date-fns';

interface ReviewLink {
  id: string;
  status: string;
  createdAt: string;
  cloudUrl: string;
  comments?: string;
  project?: {
    title: string;
  };
}

export default function ReviewsPage() {
  const [links, setLinks] = useState<ReviewLink[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchLinks = async () => {
    if (!window.electronAPI?.supabaseGetReviewLinks) return;
    setLoading(true);
    try {
      const res = await window.electronAPI.supabaseGetReviewLinks({});
      if (res.success && res.links) {
        setLinks(res.links as ReviewLink[]);
      }
    } catch (e) {
      console.error(e);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchLinks();
  }, []);

  const handleDelete = async (id: string) => {
    if (!window.electronAPI?.supabaseDeleteReviewLink) return;
    try {
      const res = await window.electronAPI.supabaseDeleteReviewLink({ id });
      if (res.success) {
        setLinks(prev => prev.filter(l => l.id !== id));
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleCopy = (url: string) => {
    navigator.clipboard.writeText(url);
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'APPROVED': return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'REJECTED': return <XCircle className="w-4 h-4 text-red-500" />;
      default: return <Clock className="w-4 h-4 text-amber-500" />;
    }
  };

  return (
    <div className="p-8 max-w-5xl mx-auto space-y-6 select-none">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Client Approvals</h1>
          <p className="text-muted-foreground mt-1">Manage shareable review links sent to your clients.</p>
        </div>
        <Button onClick={fetchLinks} disabled={loading} variant="outline" className="border-white/10">
          Refresh
        </Button>
      </div>

      {loading ? (
        <div className="text-center py-12 text-white/40">Loading approval links...</div>
      ) : links.length === 0 ? (
        <Card className="bg-white/5 border-white/10">
          <CardContent className="flex flex-col items-center justify-center py-12 text-center">
            <div className="w-12 h-12 rounded-full bg-indigo-500/20 flex items-center justify-center mb-4">
              <ExternalLink className="w-6 h-6 text-indigo-400" />
            </div>
            <p className="text-lg font-medium">No Review Links Yet</p>
            <p className="text-sm text-white/60 max-w-sm mt-1">
              Export a video clip from the Job Queue and specify it for Client Approval to generate a secure sharing link.
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4">
          {links.map((link) => (
            <Card key={link.id} className="bg-white/5 border-white/10 overflow-hidden">
              <div className="flex flex-col md:flex-row">
                <div className="p-4 flex-1 flex flex-col justify-center">
                  <div className="flex items-center gap-2 mb-1">
                    {getStatusIcon(link.status)}
                    <span className="font-semibold text-sm">{link.status}</span>
                    <span className="text-xs text-white/50 ml-2">
                       {format(new Date(link.createdAt), 'MMM d, yyyy h:mm a')}
                    </span>
                  </div>
                  <h3 className="text-lg font-medium">{link.project?.title || "Untitled Project"}</h3>
                  {link.comments && (
                    <div className="mt-2 text-sm bg-black/30 p-2 rounded text-white/80 border border-white/5">
                      <span className="text-indigo-400 font-medium">Client Note:</span> {link.comments}
                    </div>
                  )}
                </div>
                <div className="bg-black/20 p-4 border-t md:border-t-0 md:border-l border-white/5 flex flex-col items-start md:items-end justify-center gap-2 md:w-64">
                   <Button variant="secondary" size="sm" className="w-full justify-start md:justify-center" onClick={() => handleCopy(link.cloudUrl)}>
                     <Copy className="w-4 h-4 mr-2" />
                     Copy Link
                   </Button>
                   <div className="flex gap-2 w-full">
                     <Button variant="outline" size="sm" className="flex-1 border-white/10 hover:bg-white/10" asChild>
                        <a href={link.cloudUrl} target="_blank" rel="noreferrer">Open</a>
                     </Button>
                     <Button variant="ghost" size="sm" className="text-red-400 hover:text-red-300 hover:bg-red-500/10 px-2" onClick={() => handleDelete(link.id)}>
                        <Trash2 className="w-4 h-4" />
                     </Button>
                   </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
