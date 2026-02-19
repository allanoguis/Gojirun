"use client";
import Link from "next/link";

export default function Footer() {
  return (
    <footer className="fixed bottom-0 left-0 w-full bg-background shadow-lg rounded-t-xl transition-all duration-500 transform translate-y-[83%] hover:translate-y-[60%]">
      <div className="container mx-auto px-3 py-3">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 text-center md:text-left text-sm">
          <div>
            <h2 className="text-lg font-bold hover:text-accent transition-all duration-500">
              Gojirun
            </h2>
            <p className="mt-1">Run, jump, and enjoy the adventure!</p>
          </div>

          <div>
            <h2 className="text-base font-semibold hover:text-accent transition-all duration-500">
              Open Source
            </h2>
            <div className="mt-2 flex flex-col sm:flex-row sm:justify-center md:justify-start gap-2">
              <Link
                href="https://github.com/allanoguis/Hacktoberfest-2024"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center space-x-1 hover:text-accent transition-all duration-500"
              >
                <svg
                  className="w-4 h-4"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <path
                    fillRule="evenodd"
                    d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
                    clipRule="evenodd"
                  />
                </svg>
                <span>GitHub</span>
              </Link>
              <button
                onClick={() =>
                  window.open(
                    "https://github.com/allanoguis/Hacktoberfest-2024/issues"
                  )
                }
                className="hover:text-accent transition-all duration-500"
              >
                Issues
              </button>
            </div>
          </div>

          <div>
            <h2 className="text-base font-semibold hover:text-accent transition-all duration-500">
              Subscribe
            </h2>
            <form className="mt-2 flex gap-2">
              <input
                type="email"
                placeholder="Email"
                className="flex-1 px-2 py-1 rounded-md text-sm placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-accent transition-all duration-500"
              />
              <button
                type="submit"
                className="px-3 py-1 bg-card-foreground text-white rounded-md hover:bg-accent transition-all duration-500 text-sm"
              >
                Go
              </button>
            </form>
          </div>
        </div>

        <div className="mt-3 text-center text-xs">
          © {new Date().getFullYear()} Gojirun. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
