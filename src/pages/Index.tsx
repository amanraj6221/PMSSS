import Header from "@/components/Header";
import Hero from "@/components/Hero";
import StatsSection from "@/components/StatsSection";
import FeatureStats from "@/components/FeatureStats";
import NoticeBoard from "@/components/NoticeBoard";
import Footer from "@/components/Footer";

const Index = () => {
  return (
    <div className="min-h-screen">
      <Header />
      <main>
        <Hero />
        <StatsSection />
        <FeatureStats />
        <NoticeBoard />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
