"use client";
import Image from "next/image";
import Link from "next/link";

import axios from "axios";
import { useState, useEffect } from "react";

import "react-responsive-carousel/lib/styles/carousel.min.css"; // requires a loader
import { Carousel } from "react-responsive-carousel";

const fetchImages = async (start: string) => {
  try {
    const response = await axios.get("/api/image/list?start=" + start);
    const data = response.data;
    // You can log or process 'data' as needed
    // console.log(data);
    return data;
  } catch (error) {
    // Handle error here
    console.error(error);
    return null;
  }
};

export default function Home() {
  const [images, setImages] = useState([]);

  const handleChange = (index: number, item: any) => {
    if (images.length - index < 5) {
      fetchImages(images.length.toString()).then((data) => {
        setImages(images.concat(data));
      });
    }
    // console.log(item);
  };
  useEffect(() => {
    fetchImages("0").then((data) => {
      setImages(data);
      // console.log(images);
    });
  }, []);

  //   console.log(images);

  return (
    <main className="flex justify-center flex-col items-center w-full px-4">
      {/* <div className="py-2">Information</div> */}

      {/* <div>Image</div> */}
      <Carousel
        className="w-full"
        onChange={handleChange}
        // showStatus={false}
        showIndicators={false}
      >
        {images &&
          images.map((image, key) => (
            <div className="flex items-center justify-center h-full" key={key}>
              <img
                src={image["src"]}
                className="max-w-full object-contain max-h-screen"
              />
              <p className="legend">{image["rating"]}</p>
            </div>
          ))}
      </Carousel>
      {/* <p>{images["0"]["rating"]}</p> */}
      {/* <img src={images[0]["src"]} /> */}
    </main>
  );
}
