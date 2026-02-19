"use client"; // Marks this component as client-side

import { Button } from "@/components/ui/button";
import { useUser } from "@clerk/nextjs"; // Clerk's useUser hook
import { motion } from "framer-motion"; // Added useAnimation
import Image from "next/image";
import herogojira from "@/app/images/herogojira.png";
import herotank from "@/app/images/herotank.png";
import cloud1 from "@/app/images/cloud1.png";
import { useRouter } from "next/navigation";

export default function Hero() {
  const { isLoaded, isSignedIn, user } = useUser(); // useUser hook for client-side user data
  // Safely get the username, or use firstName, or fallback to "Guest"
  const username = isLoaded && isSignedIn && user ? user.firstName : "Guest";

  // Animation variants
  const loadingVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { duration: 0.5 } },
  };

  // Calculate screen height
  const screenHeight = typeof window !== "undefined" ? window.innerHeight : 0; // Get screen height
  const screenWidth = typeof window !== "undefined" ? window.innerWidth : 0; // Get screen width

  const router = useRouter();
  const Start = () => {
    router.push("/pages/game");
  };

  return (
    <>
      <section className="flex items-center justify-center  min-h-screen min-w-full bg-gradient-to-b from-blue-400 to-orange-400 dark:from-blue-900 dark:to-orange-900 bg-fill">
        {/* Loading Screen */}
        {!isLoaded && (
          <motion.div
            variants={loadingVariants}
            initial="hidden"
            animate="visible"
            className="absolute inset-0 flex items-center justify-center bg-background z-20"
          >
            <h2 className="text-2xl font-bold">Loading...</h2>
          </motion.div>
        )}

        {/* Main Content */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: isLoaded ? 1 : 0 }}
          transition={{ duration: 0.5 }}
          className="relative z-10 text-center"
        >
          <p className="text-5xl font-extrabold mb-4 uppercase">
            Welcome to Gojirun! {username}
          </p>

          {/* Tagline */}
          <p className="text-lg mb-8">
            A 2D platformer inspired by the classic Chrome T-Rex run.
          </p>

          {/* Play Now Button */}
          <Button
            asChild
            className="px-8 py-6 bg-gradient-to-r from-accent to-pink-600 text-lg font-bold rounded-full hover:animate-ping-once transition-transform duration-1000 shadow-lg animate-bounce"
            onClick={Start}
          >
            <span>Play Now</span>
          </Button>
        </motion.div>

        {/* gojira */}
        <motion.div
          initial={{
            opacity: 0,
            x: -800, // gojira initial position
            y: 0,
          }}
          animate={{
            opacity: 1,
            x: 20, // End at left 0
            y: screenHeight - 480, // Move to the calculated bottom of the screen
          }}
          exit={{ opacity: 0, transition: { duration: 0.5 } }} // Added transition for exit
          transition={{ duration: 1 }} // Duration of the animation
          className="absolute top-0 left-0" // Positioning the image
        >
          <Image src={herogojira} alt="Gojira Hero" height={500} />
        </motion.div>

        {/* tank */}
        <motion.div
          initial={{
            opacity: 0,
            x: screenWidth,
            y: screenHeight - 250, // tank initial position
          }}
          animate={{
            opacity: 1,
            x: screenWidth - 600,
            y: screenHeight - 250, // scroll tank to left
          }}
          exit={{ opacity: 0, transition: { duration: 0.5 } }} // Added transition for exit
          transition={{ duration: 1, delay: 0.2 }}
          className="absolute top-0 left-0"
        >
          <Image src={herotank} alt="Tank Hero" width={500} />
        </motion.div>

        {/* cloud1 */}
        <motion.div
          initial={{
            opacity: 0,
            x: screenWidth * 1,
            y: screenHeight * 0.1,
          }}
          animate={{
            opacity: 1,
            x: screenWidth * 0.1,
            y: screenHeight * 0.1,
          }}
          exit={{ opacity: 0, transition: { duration: 0.5 } }} // Added transition for exit
          transition={{ duration: 1, delay: 1 }}
          className="absolute top-0 left-0"
        >
          <Image src={cloud1} alt="cloud1" />
        </motion.div>

        {/* cloud2 */}
        <motion.div
          initial={{
            opacity: 0,
            x: screenWidth * 1,
            y: screenHeight * 0.25,
          }}
          animate={{
            opacity: 1,
            x: screenWidth * 0.4,
            y: screenHeight * 0.25,
          }}
          exit={{ opacity: 0, transition: { duration: 0.5 } }} // Added transition for exit
          transition={{ duration: 1, delay: 1 }}
          className="absolute top-0 left-0"
        >
          <Image src={cloud1} alt="cloud1" />
        </motion.div>

        {/* cloud3 */}
        <motion.div
          initial={{
            opacity: 0,
            x: screenWidth * 1,
            y: screenHeight * 0.15,
          }}
          animate={{
            opacity: 1,
            x: screenWidth * 0.7,
            y: screenHeight * 0.15,
          }}
          exit={{ opacity: 0, transition: { duration: 0.5 } }} // Added transition for exit
          transition={{ duration: 1, delay: 1 }}
          className="absolute top-0 left-0"
        >
          <Image src={cloud1} alt="cloud1" />
        </motion.div>
      </section>
    </>
  );
}
