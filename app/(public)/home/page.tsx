import Cat from "./components/cat";
import Fashion from "./components/fashion";
import Gallery from "./components/gallery";
import GridGallery from "./components/gridgallery";
import Hero from "./components/hero";
import VideoSlider from "./components/video";
import Wave from "./components/wave";
import Partner from "./components/partner";
import Slider from "./components/slider";
import Clip from "./components/clip";
import Why from "./components/why";
import Grid from "./components/grid";


const HomePage = () => {
  return (
    <>
      <Hero />
      <Cat />
      <Wave />
      <VideoSlider />
      <Fashion />
      <Why />
      <Clip />
      <Gallery />
      <Grid />
      <Slider />
      <GridGallery />
      <Partner />
    </>
  );
};

export default HomePage;