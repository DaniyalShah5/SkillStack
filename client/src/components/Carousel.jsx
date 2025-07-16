import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import React from "react";
import Slider from "react-slick";


const HeroCarousel = () => {
  const slides = [
    { 
      image: "/hero_img/hero1.webp",
      title: "Stop Searching, Start Learning",
      subheading: "Curated Web Dev Resources at Your Fingertips!",
    },
    {
      image: "/hero_img/hero2.jpg",
      title: "Learn from the Best",
      subheading: "Hand-picked tutorials from expert developers",
    },
    {
      image: "/hero_img/hero3.jpg",
      title: "Code, Connect, Create",
      subheading: "Your journey to web development mastery starts here",
    },
  ];

  const settings = {
    dots: true,
    infinite: true,
    speed: 1000,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 5000,
    arrows: false,
  };

  return (
    <div className="relative w-full h-[570px]">
      <Slider {...settings}>
        {slides.map((slide, index) => (
          <div key={index} className="relative">
            <img
              src={slide.image}
              alt={slide.title}
              className="w-full h-[550px] object-cover"
            />
            <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-start">
              <div className="text-center ml-10 text-white space-y-4">
                <h1 className="text-3xl md:text-5xl font-bold">{slide.title}</h1>
                <p className="text-lg md:text-2xl">{slide.subheading}</p>
              </div>
            </div>
          </div>
        ))}
      </Slider>
    </div>
  );
};

export default HeroCarousel;
