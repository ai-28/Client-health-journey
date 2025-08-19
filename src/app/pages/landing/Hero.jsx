"use client"

import { Button } from "@/app/components/ui/button";
import { Badge } from "@/app/components/ui/badge";
import { User, LogOut } from "lucide-react";
import { Shield, Brain, Users, Award, Play } from "lucide-react";
import VideoPlayer from "./VideoPlayer";
import { useSession, signOut } from "next-auth/react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/app/components/ui/dropdown-menu";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";

const heroImage = "/assets/hero-healthcare.jpg";
const heroImage2 = "/assets/pexels-ahmetkurt-25596881.jpg";
const heroImage3 = "/assets/pexels-beyzahzah-89810429-15391542.jpg";
const heroImage4 = "/assets/pexels-justyzvidz-5646002.jpg";
const heroImage5 = "/assets/pexels-kampus-5992868.jpg";
const heroImage6 = "/assets/pexels-moe-magners-6669027.jpg";
const heroImage7 = "/assets/pexels-rdne-6539802.jpg";
const heroImage8 = "/assets/pexels-yankrukov-5793653.jpg";
const heroImage9 = "/assets/pexels-yaroslav-shuraev-8844379.jpg";
const heroImage10 = "/assets/pexels-yaroslav-shuraev-8844891.jpg";

const heroImages = [
  heroImage,
  heroImage2,
  heroImage3,
  heroImage4,
  heroImage5,
  heroImage6,
  heroImage7,
  heroImage8,
  heroImage9,
  heroImage10
];

const Hero = () => {
  const { data: session } = useSession();
  const router = useRouter();
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [progress, setProgress] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  // Cycle through images every 4 seconds with progress bar
  useEffect(() => {
    if (isPaused) return;

    const interval = setInterval(() => {
      setProgress(0);
      setIsTransitioning(true);
      setTimeout(() => {
        setCurrentImageIndex((prevIndex) => (prevIndex + 1) % heroImages.length);
        setIsTransitioning(false);
      }, 400); // Wait for fade out before changing image
    }, 3000);

    // Progress bar animation
    const progressInterval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) return 0;
        return prev + (100 / 30); // 100% over 3 seconds (30 * 100ms)
      });
    }, 100);

    return () => {
      clearInterval(interval);
      clearInterval(progressInterval);
    };
  }, [isPaused]);

  const goDashboard = () => {
    if (session?.user?.role === "admin") {
      router.push("/admin/dashboard");
    } else if (session?.user?.role === "coach") {
      router.push("/coach/dashboard");
    } else if (session?.user?.role === "client") {
      router.push("/client/dashboard");
    } else if (session?.user?.role === "clinic_admin") {
      router.push("/clinic/dashboard");
    }
  }
  return (
    <section className="relative min-h-screen bg-gradient-medical flex items-center overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-20 left-10 w-72 h-72 bg-primary rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-secondary rounded-full blur-3xl"></div>
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Column - Content */}
          <div className="space-y-8 animate-fade-in">
            {/* Badges */}
            <div className="flex flex-wrap gap-3">
              <Badge className="bg-primary-light text-primary border-primary/20 flex items-center gap-2">
                <Shield className="w-4 h-4" />
                HIPAA Compliant
              </Badge>
              <Badge className="bg-secondary-light text-secondary border-secondary/20 flex items-center gap-2">
                <Brain className="w-4 h-4" />
                AI-Powered
              </Badge>
              <Badge className="bg-accent-light text-accent1 border-accent1/20 flex items-center gap-2">
                <Award className="w-4 h-4" />
                Trusted by Healthcare Professionals
              </Badge>
            </div>

            {/* Headline */}
            <div className="space-y-4">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-text-hero leading-tight">
                AI-Powered Nutrition
                <span className="block text-gradient-hero">
                  Coaching for Health and Wellness
                </span>
                <span className="block">Providers</span>
              </h1>
              
              <p className="text-xl text-text-medical leading-relaxed max-w-2xl">
                Empower your practice with HIPAA-compliant, AI-driven weight loss and nutrition coaching. 
                Custom templates, automated food analysis, and personalized care for every patient.
              </p>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4">
              {
                !session ? (
                  <Button
                    className="w-full sm:w-auto px-8 py-3 text-base font-medium bg-primary-600 hover:bg-primary-700 text-white transform hover:scale-105 transition-all duration-300 ease-in-out shadow-lg hover:shadow-xl h-12"
                    onClick={() => router.push("/login")}
                  >
                    Log In
                  </Button>
                ) : (
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        className="w-full sm:w-auto px-8 py-3 text-base font-medium bg-primary-600 hover:bg-primary-700 text-white transform hover:scale-105 transition-all duration-300 ease-in-out shadow-lg hover:shadow-xl flex items-center gap-2 h-12"
                      >
                        <User size={16} />
                        {session.user.name}
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-40">
                      <DropdownMenuItem className="flex items-center gap-2 cursor-pointer" onClick={goDashboard}>
                        <User size={16} />
                        Dashboard
                      </DropdownMenuItem>
                      <DropdownMenuItem className="flex items-center gap-2 cursor-pointer" onClick={() => signOut()}>
                        <LogOut size={16} />
                        Log Out
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                )
              }
              <Button 
                variant="medical" 
                className="w-full sm:w-auto px-8 py-3 text-base font-medium h-12 transition-all duration-300 ease-in-out hover:scale-105 hover:shadow-lg"
                onClick={() => window.open('https://go.clienthealthtracker.com/widget/booking/Fwe2aulhdV6W58wEhmQZ', '_blank')}
              >
                Schedule Demo
              </Button>
            </div>

            {/* Social Proof */}
            <div className="pt-8">
              <p className="text-sm text-text-medical mb-4">Trusted by healthcare professionals nationwide:</p>
              <div className="flex flex-wrap items-center gap-x-6 gap-y-2 opacity-60">
                <div className="text-sm md:text-base font-semibold">Primary Care Physicians</div>
                <div className="text-sm md:text-base font-semibold">Registered Dietitians</div>
                <div className="text-sm md:text-base font-semibold">Wellness Centers</div>
                <div className="text-sm md:text-base font-semibold">Chiropractors</div>
                <div className="text-sm md:text-base font-semibold">Med Spas</div>
                <div className="text-sm md:text-base font-semibold">Health Coaches</div>
              </div>
            </div>
          </div>

          {/* Right Column - Hero Image/Video */}
          <div className="relative animate-slide-up">
            {/* Option 1: Video Player (uncomment when video URL is available) */}
            {/* <VideoPlayer 
              className="w-full"
              posterImage={heroImage}
              title="Client Health Tracker Demo"
              description="See our platform in action"
              autoplay={true}
              muted={true}
            /> */}
            
            {/* Option 2: Image Carousel with Video CTA */}
            <div 
              className="relative"
              onMouseEnter={() => setIsPaused(true)}
              onMouseLeave={() => setIsPaused(false)}
            >
              <div className="w-full aspect-[2/2] rounded-2xl shadow-elegant overflow-hidden">
                <img
                  src={heroImages[currentImageIndex]}
                  alt="Healthcare provider using Client Health Tracker"
                  className={`w-full h-full object-cover transition-all duration-500 ease-in-out ${isTransitioning ? 'opacity-0 scale-95' : 'opacity-100 scale-100'}`}
                />
              </div>
              
              {/* Progress bar */}
              <div className="absolute bottom-12 left-1/2 transform -translate-x-1/2 w-24 h-1 bg-white/30 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-white rounded-full transition-all duration-100 ease-linear"
                  style={{ width: `${progress}%` }}
                />
                {isPaused && (
                  <div className="absolute inset-0 bg-white/20 rounded-full flex items-center justify-center">
                    <div className="w-1 h-1 bg-white rounded-full mx-0.5"></div>
                    <div className="w-1 h-1 bg-white rounded-full mx-0.5"></div>
                  </div>
                )}
              </div>
              
              {/* Image indicator dots */}
              <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
                {heroImages.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => {
                      setCurrentImageIndex(index);
                      setIsTransitioning(false);
                      setProgress(0);
                    }}
                    className={`w-2 h-2 rounded-full transition-all duration-300 ${
                      index === currentImageIndex 
                        ? 'bg-white scale-125 shadow-lg' 
                        : 'bg-white/50 hover:bg-white/75'
                    }`}
                  />
                ))}
              </div>
                            
              {/* Floating cards */}
              <div className="absolute -top-6 -left-6 bg-white p-4 rounded-xl shadow-card animate-glow z-10">
                <div className="flex items-center space-x-3">
                  <div className="w-3 h-3 bg-secondary rounded-full"></div>
                  <span className="text-sm font-medium">Patient Progress: +15%</span>
                </div>
              </div>
              
              <div className="absolute -bottom-6 -right-6 bg-white p-4 rounded-xl shadow-card z-10">
                <div className="flex items-center space-x-3">
                  <div className="w-3 h-3 bg-accent1 rounded-full"></div>
                  <span className="text-sm font-medium">AI Insights: 24/7</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;