"use client";
import Image from "next/image";
import Link from "next/link";

import axios from "axios";
import { useState, useEffect, useRef, useContext, createContext } from "react";
import {
  Button,
  Center,
  Container,
  Flex,
  HStack,
  Input,
  SimpleGrid,
  Stack,
} from "@chakra-ui/react";
import { useRouter } from "next/navigation";

const preloadedImages = [
  "/api/static/Sorted Pictures/4S/9b424ba3bbcbb608d119b916f617d725768efad2.png",
  "/api/static/Sorted Pictures/5S/4099577141_11bb8798f7_50530951042_o.jpg",
  "/api/static/Sorted Pictures/4S/android-asset-cd4a47f893009fa34be58d88fc1f889caaaef8633c76e4bc24d4b5130d38df35.jpg",
  "/api/static/Sorted Pictures/4S/image_1.jpeg",
  "/api/static/4KStogram/4K Stogram/top.casts/2022-07-18 12.02.20 2885239223489970260_1953845700.jpg",
  "/api/static/4KStogram/4K Stogram/top.casts/2020-07-16 00.39.32 2354359729337490402_34456773325.jpg",
  "/api/static/4KStogram/4K Stogram/top.casts/2022-07-18 12.02.20 2885239223490149576_1953845700.jpg",
  "/api/static/Sorted Pictures/4S/abigail-llwc.jpg",
  "/api/static/4KStogram/4K Stogram/top.casts/2023-01-18 17.18.32 3018787303903945709_33216583683.jpg",
  "/api/static/Sorted Pictures/4S/pink_llc6.jpg",
  "/api/static/Sorted Pictures/4S/breanne-slc.jpg",
  "/api/static/Sorted Pictures/4S/shop_pics_7_110.jpg",
  "/api/static/4KStogram/4K Stogram/top.casts/2021-06-22 22.37.50 2602171779357415629_4488480470.jpg",
  "/api/static/Sorted Pictures/4S/mod-2_7189436354_o.jpg",
  "/api/static/Sorted Pictures/5S/abbey-llc.jpg",
  "/api/static/Sorted Pictures/4S/diana_-_bootsausflug_mit_llc_-_teil_4-3.jpg",
  "/api/static/Sorted Pictures/4S/48031005503_2790975666_o.jpg",
  "/api/static/4KStogram/4K Stogram/top.casts/2023-05-22 15.43.42 3108581571039698983_58752113401.jpg",
  "/api/static/Sorted Pictures/4S/jessy_-_spaziergang_mit_gips-schlinge-2.jpg",
  "/api/static/Sorted Pictures/4S/bee-slc.jpg",
];

const ImageContext = createContext();

const fetchImages = async (search: string, offset: number = 0) => {
  try {
    // Keep alive
    const response = await axios.get("/api/search/v1", {
      params: {
        query: search,
        offset: offset,
      },
    });
    const data = response.data;
    // You can log or process 'data' as needed
    console.log(data);
    return data;
  } catch (error) {
    // Handle error here
    console.error(error);
    return null;
  }
};

function ImageView({ image_src, key, searchFunction }) {
  const [buttonShown, setButtonShown] = useState(false);

  const { search, setSearch } = useContext(ImageContext);
  const { images, setImages } = useContext(ImageContext);

  return (
    <div
      className="max-w-[450px] max-h-[700px] w-full overflow-hidden relative"
      onMouseEnter={() => {
        setButtonShown(true);
      }}
      onMouseLeave={() => {
        setButtonShown(false);
      }}
      onTouchStartCapture={() => {
        setButtonShown(true);

        setTimeout(() => {
          setButtonShown(false);
        }, 5000);
      }}
    >
      <img
        className="w-full h-full object-contain"
        src={image_src}
        alt={`image-${key}`}
      />
      <div className="absolute bottom-0 -translate-y-full left-1/2 -translate-x-1/2 z-20 text-white p-2">
        {buttonShown && (
          <Button
            // onClick={() => {
            //   const searchQuery = image_src.replace(
            //     "/api/static/",
            //     "/collection/"
            //   );
            //   setSearch(searchQuery);
            //   // Smooth scroll to top
            //   fetchImages(search).then((data) => {
            //     setImages(data);
            //     window.scrollTo({ top: 0, behavior: "smooth" });
            //   });
            // }}

            colorScheme="blue"
            size="sm"
            variant="solid"
          >
            <a
              href={
                "/search?query=" +
                image_src
                  .replace("/api/static/", "/collection/")
                  .replace(/ /g, "+")
              }
            >
              Search this image
            </a>
          </Button>
        )}
      </div>
    </div>
  );
}

export default function Home({ params, searchParams }) {
  const [images, setImages] = useState([]);
  const [search, setSearch] = useState("");
  const imageComponent = useRef();

  const router = useRouter();

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (searchParams.query) {
      setSearch(searchParams.query);
      console.log(searchParams.query);
      fetchImages(searchParams.query).then((data) => {
        setImages(data);
        setLoading(false);
      });
    } else {
      setImages(preloadedImages);
    }
  }, []);

  const handleSearch = () => {
    // Set search query
    router.push("/search?query=" + search);

    setLoading(true);
    console.log(search);
    fetchImages(search).then((data) => {
      setImages(data);
      setLoading(false);
    });
  };

  const searchFunction = (image_src) => {
    const searchQuery = image_src.replace("/api/static/", "/collection/");
    setSearch(searchQuery);
    // Smooth scroll to top
    window.scrollTo({ top: 0, behavior: "smooth" });

    // Force react to re-render the page
  };

  // Create infinite scroll effect

  return (
    <main className="p-4">
      {/* Scroll to top button */}
      <button
        className="fixed bottom-4 right-4 p-2 z-50 bg-blue-500 text-white rounded-md"
        onClick={() => {
          window.scrollTo({ top: 0, behavior: "smooth" });
        }}
      >
        Top
      </button>

      <Container maxW="100vw">
        <Container>
          <HStack>
            <Input
              placeholder="pink long leg cast, crutches, forest, blond"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  handleSearch();
                }
              }}
            />
            <Button
              onClick={handleSearch}
              colorScheme="blue"
              size="md"
              variant="solid"
              isLoading={loading}
            >
              Search
            </Button>
          </HStack>
        </Container>

        {/* <img
        src={preloadedImages[5]}
        className="w-[400px] h-auto"
        // width={300}
        // height={300}
      /> */}

        {/* <SimpleGrid minChildWidth="400px" spacing={1} className="mt-4"> */}
        <ImageContext.Provider value={{ images, setImages, search, setSearch }}>
          <div className="flex flex-wrap gap-2 mt-4 w-full justify-center">
            {images &&
              images.map((image_src, key) => (
                <ImageView
                  key={key}
                  image_src={image_src}
                  searchFunction={searchFunction}
                />
              ))}
          </div>
        </ImageContext.Provider>

        <Container paddingY={8}>
          <Center>
            <Button
              onClick={() => {
                fetchImages(search, images.length).then((data) => {
                  setImages(images.concat(data));
                });
              }}
              colorScheme="blue"
              size="md"
              variant="solid"
              isLoading={loading}
            >
              Show More
            </Button>
          </Center>
        </Container>
        {/* </SimpleGrid> */}
      </Container>
    </main>
  );
}
