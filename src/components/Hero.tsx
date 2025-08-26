import { Button } from "@/components/ui/button";
import { ArrowRight, Award, BookOpen, Users, GraduationCap } from "lucide-react";

const Hero = () => {
  return (
    <section className="relative min-h-screen flex items-center justify-center bg-gradient-hero overflow-hidden">
      {/* Modern Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_1px_1px,rgba(255,255,255,0.15)_1px,transparent_0)] bg-[length:50px_50px]"></div>
      </div>

      {/* Enhanced Floating Elements */}
      <div className="absolute top-20 left-10 w-32 h-32 bg-gradient-modern rounded-3xl animate-float opacity-20 morphism"></div>
      <div className="absolute top-40 right-20 w-24 h-24 bg-gradient-success rounded-2xl animate-float opacity-30 morphism" style={{animationDelay: '2s'}}></div>
      <div className="absolute bottom-40 left-20 w-16 h-16 bg-secondary/30 rounded-xl animate-float morphism" style={{animationDelay: '4s'}}></div>
      <div className="absolute top-60 left-1/4 w-12 h-12 bg-white/20 rounded-full animate-float" style={{animationDelay: '1s'}}></div>
      <div className="absolute bottom-60 right-1/4 w-8 h-8 bg-secondary/40 rounded-full animate-float" style={{animationDelay: '3s'}}></div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center min-h-screen py-20">
          {/* Left Content */}
          <div className="animate-fade-in">
            {/* Announcement Badge */}
            <div className="inline-flex items-center px-6 py-3 rounded-full morphism mb-8 animate-bounce-in">
              <Award className="h-5 w-5 text-secondary mr-2" />
              <span className="text-white font-medium">Applications Open for Academic Year 2024-25</span>
            </div>

            {/* Main Heading */}
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-white mb-6 leading-tight">
              Smarter Education
              <br />
              <span className="bg-gradient-to-r from-secondary via-white to-secondary-light bg-clip-text text-transparent text-glow">
                in Your Future
              </span>
            </h1>

            {/* Subtitle */}
            <p className="text-xl md:text-2xl text-white/90 mb-8 max-w-xl leading-relaxed">
              Education isn't just knowledge, it's the power to build a future, support a mission, and create real change in the world.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 mb-12">
              <Button 
                size="lg" 
                className="bg-secondary hover:bg-secondary-light text-foreground font-semibold px-10 py-4 text-lg transition-spring hover:scale-105 shadow-large group rounded-full"
              >
                Apply Now
                <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-smooth" />
              </Button>
              <Button 
                size="lg" 
                variant="outline"
                className="border-2 border-white/30 text-white hover:bg-white/10 backdrop-blur-sm px-10 py-4 text-lg transition-spring hover:scale-105 rounded-full"
              >
                <BookOpen className="mr-2 h-5 w-5" />
                Contact Us
              </Button>
            </div>

            {/* Email Signup */}
            <div className="flex flex-col sm:flex-row gap-3 max-w-md">
              <input 
                type="email" 
                placeholder="Your Email here" 
                className="flex-1 px-6 py-4 rounded-full bg-white/10 border border-white/20 text-white placeholder:text-white/60 backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-secondary"
              />
              <Button className="px-8 py-4 bg-foreground text-white rounded-full hover:bg-foreground/90 transition-spring hover:scale-105">
                Get Started Free
              </Button>
            </div>

            {/* Stats */}
            <div className="flex gap-12 mt-16">
              <div>
                <div className="text-4xl font-bold text-white mb-1">50.3K</div>
                <div className="text-white/70 text-sm">Students Benefited Today</div>
              </div>
              <div>
                <div className="text-4xl font-bold text-white mb-1">1000+</div>
                <div className="text-white/70 text-sm">Education Made Human</div>
              </div>
            </div>
          </div>

          {/* Right Side - Modern Visual Elements */}
          <div className="relative animate-scale-in">
            {/* Main Card */}
            <div className="relative">
              <div className="w-full max-w-md mx-auto morphism rounded-3xl p-8 card-3d">
                <div className="bg-gradient-modern rounded-2xl p-6 mb-6">
                  <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center mb-4">
                    <GraduationCap className="h-8 w-8 text-white" />
                  </div>
                  <h3 className="text-white font-bold text-xl mb-2">Scholarship Portal</h3>
                  <p className="text-white/80 text-sm">Access quality education nationwide</p>
                </div>
                
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 bg-white/10 rounded-xl">
                    <span className="text-white font-medium">Application Status</span>
                    <span className="text-success font-bold">Active</span>
                  </div>
                  <div className="flex items-center justify-between p-4 bg-white/10 rounded-xl">
                    <span className="text-white font-medium">Merit Position</span>
                    <span className="text-secondary font-bold">#1,247</span>
                  </div>
                </div>
              </div>

              {/* Floating Stats Cards */}
              <div className="absolute -top-6 -right-6 morphism rounded-2xl p-4 animate-float" style={{animationDelay: '1s'}}>
                <div className="text-2xl font-bold text-white">₹5000Cr+</div>
                <div className="text-white/70 text-xs">Awarded</div>
              </div>

              <div className="absolute -bottom-6 -left-6 morphism rounded-2xl p-4 animate-float" style={{animationDelay: '2s'}}>
                <div className="flex items-center space-x-2">
                  <div className="w-8 h-8 bg-success rounded-full flex items-center justify-center">
                    <Users className="h-4 w-4 text-white" />
                  </div>
                  <div>
                    <div className="text-white font-bold text-sm">500+ Colleges</div>
                    <div className="text-white/70 text-xs">Nationwide</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Partner Logos */}
        <div className="text-center mt-20 animate-fade-in">
          <p className="text-white/60 mb-8">Trusted by leading educational institutions</p>
          <div className="flex justify-center items-center space-x-12 opacity-40">
            <div className="text-white font-bold text-lg">AICTE</div>
            <div className="text-white font-bold text-lg">UGC</div>
            <div className="text-white font-bold text-lg">Ministry of Education</div>
            <div className="text-white font-bold text-lg">Digital India</div>
            <div className="text-white font-bold text-lg">NSP</div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;