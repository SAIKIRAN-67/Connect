import React from 'react';
import Slider from 'react-slick';

// Import slick-carousel styles
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

// Slider Settings
const sliderSettings = {
  dots: true, // Enable navigation dots
  infinite: true, // Infinite looping
  speed: 500, // Transition speed
  slidesToShow: 1, // Show one image at a time
  slidesToScroll: 1, 
  autoplay: true, // Enable auto-play
  autoplaySpeed: 3000, // Time between slides
  arrows: false, // Disable navigation arrows
};

const ImageSlider = ({ images }) => {
  return (
    <div style={{ width: '80%', margin: '0 auto', maxWidth: '800px' }}>
      <Slider {...sliderSettings}>
        {images.map((image, index) => (
          <div key={index} style={{ position: 'relative' }}>
            <img 
              src={image} 
              alt={`Slide ${index + 1}`} 
              style={{
                width: '100%',
                height: '400px', // Consistent height
                objectFit: 'cover', // Maintain aspect ratio, crop excess
                borderRadius: '12px', // Rounded corners
                boxShadow: '0 4px 15px rgba(0, 0, 0, 0.2)', // Add shadow for style
              }} 
            />
          </div>
        ))}
      </Slider>
    </div>
  );
};

export default ImageSlider;
