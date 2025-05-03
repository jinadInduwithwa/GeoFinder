import HeroSection from "../components/Home/HeroSection";
import AsiaCountrySection from "../components/Home/AsiaCountrySection";
import AmericasCountrySection from "../components/Home/AmericasCountrySection";
import EuropeCountrySection from "../components/Home/EuropeCountrySection";


function Home() {
  return (
    <div className="w-full overflow-hidden">
      <HeroSection />
      <AsiaCountrySection />
       <AmericasCountrySection />
      <EuropeCountrySection /> 
    </div>
  );
}

export default Home;