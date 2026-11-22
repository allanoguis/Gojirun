"use client";
import { useEffect, useState } from "react";
import Image from "next/image";
import { Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

// Your GitHub repository details
const owner = "allanoguis"; // Replace with the repository owner
const repo = "Hacktoberfest-2024"; // Replace with the repository name

function GithubIcon({ className }) {
  return (
    <svg
      aria-hidden="true"
      className={className}
      fill="currentColor"
      viewBox="0 0 24 24"
    >
      <path
        fillRule="evenodd"
        d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
        clipRule="evenodd"
      />
    </svg>
  );
}

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
                      <GithubIcon className="h-5 w-5" />
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
                        <GithubIcon className="h-4 w-4" />
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
