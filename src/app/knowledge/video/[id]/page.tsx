import React from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import PageHeader from "@/components/PageHeader";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Video } from "lucide-react";

const VIDEOS: Record<string, { title: string; youtubeId: string; description?: string }> = {
  "0": { title: "Drip Irrigation Installation Guide", youtubeId: "dQw4w9WgXcQ" },
  "1": { title: "Organic Fertilizer Preparation", youtubeId: "dQw4w9WgXcQ" },
  "2": { title: "Crop Rotation Benefits", youtubeId: "dQw4w9WgXcQ" },
};

export default function VideoPage({ params }: { params: { id: string } }) {
  const video = VIDEOS[params.id];

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <PageHeader title={video?.title || "Video"} description="Video Tutorial" icon={Video} />

      <main className="flex-1 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          {video ? (
            <Card>
              <CardHeader>
                <CardTitle>{video.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="aspect-video">
                  <iframe
                    title={video.title}
                    src={`https://www.youtube.com/embed/${video.youtubeId}`}
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    className="w-full h-full"
                  />
                </div>
                <p className="mt-4 text-sm text-muted-foreground">{video.description}</p>
              </CardContent>
            </Card>
          ) : (
            <Card>
              <CardContent>Video not found.</CardContent>
            </Card>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
