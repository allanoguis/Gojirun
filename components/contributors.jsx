"use client";
import { useEffect, useState } from "react";
import Image from "next/image";
import { Github, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

// Your GitHub repository details
const owner = "allanoguis"; // Replace with the repository owner
const repo = "Hacktoberfest-2024"; // Replace with the repository name

export default function Collaborators() {
  const [contributors, setContributors] = useState([]);

  useEffect(() => {
    // Fetch contributors from GitHub API
    const fetchContributors = async () => {
      try {
        const res = await fetch(
          `https://api.github.com/repos/${owner}/${repo}/contributors`
        );
        if (!res.ok) throw new Error("Failed to fetch contributors");
        const data = await res.json();
        setContributors(data);
      } catch (error) {
        console.error("Error fetching contributors:", error);
      }
    };

    fetchContributors();
  }, []);

  return (
    <>
      <section id="contibutors" className="min-h-fit w-full mt-10">
        <div className="container mx-auto px-4 py-12">
          <div className="mb-12 text-center">
            <h1 className="text-4xl font-bold mb-4">Credits and Attribution</h1>
            <div className="flex items-center justify-center gap-2">
              <Users className="h-6 w-6" />
              <span className="text-xl">
                {contributors.length} Brave Participants
              </span>
            </div>
          </div>
          <div className=" mb-20 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {contributors.map((contributor) => (
              <Card key={contributor.id}>
                <CardHeader>
                  <CardTitle>
                    <Image
                      src={contributor.avatar_url}
                      alt={contributor.login}
                      width={70}
                      height={70}
                      className="rounded-full ring-2 ring-white"
                    />
                    <div>
                      <div className="font-light text-xl ml-2 text-white">
                        {contributor.login}
                      </div>
                      <div className="text-sm font-light ml-2 text-white">
                        {contributor.contributions} contributions
                      </div>
                    </div>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex justify-between items-center mt-4">
                    <div className="flex items-center gap-2 text-white">
                      <Github className="h-5 w-5" />
                      <span>{contributor.contributions} commits</span>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      className="hover:bg-accent hover:text-white border-none transition-all duration-500"
                    >
                      <a
                        href={contributor.html_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2"
                      >
                        View Profile
                        <Github className="h-4 w-4" />
                      </a>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
