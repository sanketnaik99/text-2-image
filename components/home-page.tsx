'use client'

import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { useState } from "react";
import { Loader2 } from "lucide-react";

export function HomePage() {
  const [imageSrc, setImageSrc] = useState<any>('');
  const [prompt, setPrompt] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  return (
    <div className="bg-gray-50/90 w-full min-h-screen flex flex-col items-center justify-center py-10">
      <div className="container px-4 flex-1 flex flex-col items-center justify-center text-center space-y-4">
        <div className="space-y-2">
          <h1 className="text-4xl font-bold tracking-tighter sm:text-6xl">
            Text2Image
          </h1>
          <p className="text-gray-500 leading-loose md:leading-loose/relaxed dark:text-gray-400">
            Turn your text into beautiful images.
          </p>
        </div>
        <div className="flex flex-col sm:flex-row gap-4 w-full max-w-xl">
          <Input
            className="w-full sm:max-w-[700px] text-white"
            name="prompt"
            placeholder="Enter your text"
            onChange={(e) => setPrompt(e.target.value)}
            value={prompt}
          />
          <Button
            className="sm:w-auto"
            onClick={async () => {
              if (!prompt) {
                return;
              }
              setIsLoading(true);
              fetch("https://text-to-image-worker.sanketnaik99.workers.dev/", {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                },
                body: JSON.stringify({ prompt: prompt }),
              })
                .then((response) => {
                  if (!response.ok) {
                    console.log("Failed to fetch image");
                    setIsLoading(false);
                    throw new Error("Failed to fetch image");
                  }
                  return response.blob();
                })
                .then((blob) => {
                  // Convert the blob to a data URL
                  const reader = new FileReader();
                  reader.onload = () => {
                    setImageSrc(reader.result);
                    setIsLoading(false);
                    console.log("Image fetched");
                  };
                  reader.readAsDataURL(blob);
                })
                .catch((error) => {
                  setIsLoading(false);
                  console.error("Error fetching image:", error);
                });
            }}
            variant="outline"
            disabled={isLoading}
          >
            {
              isLoading
              && <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            }
            {
              isLoading
                ? "Generating..."
                : "Generate"
            }
          </Button>
        </div>
        <div className="w-full">
          {
            imageSrc && (
              <img src={imageSrc} alt="Generated Image" className="w-full mt-4" />
            )
          }
          {
            !imageSrc
            && (
              <div className="w-full h-96 bg-gray-200 flex items-center justify-center">
                <p className="text-gray-500">Your generated image will be shown here</p>
              </div>
            )
          }
        </div>
      </div>
    </div>
  );
}
