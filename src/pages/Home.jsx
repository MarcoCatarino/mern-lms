import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

import Banner from "../components/Banner";
import HomeCourses from "../components/HomeCourses";
import Testimonial from "../components/Testimonial";

function Home() {
  return (
    <div>
      <Navbar />
      <Banner />
      <HomeCourses />
      <Testimonial />
      <Footer />
    </div>
  );
}

export default Home;
