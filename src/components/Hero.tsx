import { Button } from "@/components/ui/button";
import { ArrowRight, Award, BookOpen, Users } from "lucide-react";

const Hero = () => {
  return (
    <section className="relative min-h-[90vh] flex items-center justify-center bg-gradient-hero overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_1px_1px,rgba(255,255,255,0.15)_1px,transparent_0)] bg-[length:50px_50px]"></div>
      </div>

      {/* Floating Elements */}
      <div className="absolute top-20 left-10 w-20 h-20 bg-secondary/20 rounded-full animate-float"></div>
      <div className="absolute top-40 right-20 w-16 h-16 bg-success-light/20 rounded-full animate-float" style={{animationDelay: '2s'}}></div>
      <div className="absolute bottom-40 left-20 w-12 h-12 bg-primary-light/20 rounded-full animate-float" style={{animationDelay: '4s'}}></div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center max-w-5xl mx-auto">
          {/* Announcement Badge */}
          <div className="inline-flex items-center px-6 py-3 rounded-full glass mb-8 animate-glow">
            <Award className="h-5 w-5 text-secondary mr-2" />
            <span className="text-white font-medium">Applications Open for Academic Year 2024-25</span>
          </div>

          {/* Main Heading */}
          <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 leading-tight">
            Empowering Dreams,
            <br />
            <span className="bg-gradient-to-r from-secondary to-secondary-light bg-clip-text text-transparent">
              Transforming Futures
            </span>
          </h1>

          {/* Subtitle */}
          <p className="text-xl md:text-2xl text-white/90 mb-8 max-w-3xl mx-auto leading-relaxed">
            Prime Minister's Special Scholarship Scheme for Jammu & Kashmir - 
            Opening doors to quality education and boundless opportunities
          </p>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12 max-w-3xl mx-auto">
            <div className="text-center">
              <div className="text-3xl md:text-4xl font-bold text-white mb-2">50K+</div>
              <div className="text-white/80">Students Benefited</div>
            </div>
            <div className="text-center">
              <div className="text-3xl md:text-4xl font-bold text-white mb-2">500+</div>
              <div className="text-white/80">Partner Institutions</div>
            </div>
            <div className="text-center">
              <div className="text-3xl md:text-4xl font-bold text-white mb-2">₹5000Cr+</div>
              <div className="text-white/80">Scholarships Awarded</div>
            </div>
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Button 
              size="lg" 
              className="bg-secondary hover:bg-secondary-light text-foreground font-semibold px-8 py-6 text-lg transition-spring hover:scale-105 shadow-large group"
            >
              Apply Now
              <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-smooth" />
            </Button>
            <Button 
              size="lg" 
              variant="outline"
              className="border-2 border-white/30 text-white hover:bg-white/10 backdrop-blur-sm px-8 py-6 text-lg transition-spring hover:scale-105"
            >
              <BookOpen className="mr-2 h-5 w-5" />
              View Schemes
            </Button>
          </div>

          {/* Quick Links */}
          <div className="mt-16 flex flex-wrap justify-center gap-6 text-white/80">
            <a href="#" className="flex items-center hover:text-white transition-smooth">
              <Users className="h-4 w-4 mr-2" />
              Student Portal
            </a>
            <a href="#" className="flex items-center hover:text-white transition-smooth">
              <BookOpen className="h-4 w-4 mr-2" />
              Institution Portal
            </a>
            <a href="#" className="flex items-center hover:text-white transition-smooth">
              <Award className="h-4 w-4 mr-2" />
              Guidelines
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;