import React, { useRef } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
// import required modules
import { Pagination, Navigation } from "swiper";

import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";

interface CustomSwiperProps {
  list: [
    {
      src: string;
      title: string;
      desc?: string;
    }
  ];
}

export default ({ list }: CustomSwiperProps) => {

  const handleClick = (e) => {
      window.open(e.currentTarget.src)
  }


  return (
    <Swiper
      spaceBetween={50}
      slidesPerView={1}
      pagination={{
        type: "progressbar",
      }}
      navigation={true}
      onSlideChange={() => console.log("slide change")}
      onSwiper={(swiper) => console.log(swiper)}
      modules={[Pagination, Navigation]}
    >
      {list.map((data) => (
        <SwiperSlide>
          <div className="card">
            <div className="card__image">
              <img
  
                src={data.src}
                style={{ objectFit: "fill", width: "100%" }}
                onClick={handleClick}
              />
            </div>
            <div className="card__body" style={{whiteSpace: 'pre-line'}}>
              <h4>{data.title}</h4>
              <small>{data.desc}</small>
            </div>
          </div>
        </SwiperSlide>
      ))}
    </Swiper>
  );
};
