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
  NumberDecrementStepper,
  NumberIncrementStepper,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  SimpleGrid,
  Stack,
} from "@chakra-ui/react";
import { useRouter, useSearchParams } from "next/navigation";
import preloadedImages from "./preloadedImages";

const ImageContext = createContext();
const checkHealth = async () => {
  try {
    const response = await axios.get("/api/health");
    const data = response.data;
    return data.status ?? false;
  } catch (error) {
    console.error(error);
    return false;
  }
};

const fetchImages = async (
  search: string = "pink long leg cast, crutches, forest, blond",
  theme: string = "",
  negative: string = "",
  ratingRange = [0, 5],
  offset: number = 0
) => {
  try {
    // Keep alive
    console.log({
      query: search,
      offset: offset,
      themes: theme,
      negs: negative,
      lowerRating: ratingRange[0],
      upperRating: ratingRange[1],
    });

    const response = await axios.get("/api/search", {
      params: {
        query: search,
        offset: offset,
        themes: theme,
        negs: negative,
        lower_rating: Number(ratingRange[0]),
        upper_rating: Number(ratingRange[1]),
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

function ImageView({ image_data, key, searchFunction }) {
  const [buttonShown, setButtonShown] = useState(false);

  const { search, setSearch } = useContext(ImageContext);
  const { images, setImages } = useContext(ImageContext);

  // console.log(image_data);

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
        src={image_data.src}
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
            <a href={"/?query=" + image_data.src}>Search this image</a>
          </Button>
        )}
      </div>
      {buttonShown && (
        <div className="absolute top-2 right-2 z-20 text-white p-1 bg-green-800 rounded-xl">
          {image_data.rating}
        </div>
      )}
    </div>
  );
}

export default function Home() {
  const [images, setImages] = useState([]);
  const [search, setSearch] = useState("");
  const [theme, setTheme] = useState("");
  const [negative, setNegative] = useState("");
  const [ratingLower, setRatingLower] = useState(0);
  const [ratingUpper, setRatingUpper] = useState(5);
  const imageComponent = useRef();
  const searchParams = useSearchParams();
  const [health, setHealth] = useState(true);

  const SearchParamToSetter = {
    query: setSearch,
    theme: setTheme,
    negative: setNegative,
    rating_lower: (value) => {
      setRatingLower(Number(value));
    },
    rating_upper: (value) => {
      setRatingUpper(Number(value));
    },
  };

  const router = useRouter();

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Check health
    checkHealth().then((status) => {
      setHealth(status);
    });

    if (searchParams?.has("query")) {
      searchParams.forEach((value, key) => {
        const setterFunction = SearchParamToSetter[key]; // Use the key to get the setter function
        if (setterFunction) {
          setterFunction(value); // Pass the value to the setter function
        }
      });
      handleSearch();
    } else {
      setImages(preloadedImages);
    }
  }, []);

  const handleSearch = () => {
    // Set search query
    const params = new URLSearchParams(searchParams?.toString());
    params.set("query", search);
    params.set("theme", theme);
    params.set("negative", negative);
    params.set("rating_lower", ratingLower.toString());
    params.set("rating_upper", ratingUpper.toString());
    router.push(`/?${params.toString()}`);

    setLoading(true);

    console.log({
      query: search,
      themes: theme,
      negs: negative,
      rating_range: [ratingLower, ratingUpper],
    });

    // console.log(search);
    fetchImages(search, theme, negative, [ratingLower, ratingUpper]).then(
      (data) => {
        setImages(data);
        setLoading(false);
      }
    );
  };

  const searchFunction = (image_src) => {
    const searchQuery = image_src.replace("/api/static/", "/collection/");
    setSearch(searchQuery);
    // Smooth scroll to top
    window.scrollTo({ top: 0, behavior: "smooth" });

    // Force react to re-render the page
  };

  // Create infinite scroll effect

  return health ? (
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
        <Container maxW={1000}>
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
          <Flex className="flex-wrap align-middle">
            <Input
              minWidth={200}
              maxWidth={300}
              placeholder="See more of"
              value={theme}
              onChange={(e) => setTheme(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  handleSearch();
                }
              }}
            />
            <Input
              minWidth={200}
              maxWidth={300}
              placeholder="See less of"
              value={negative}
              onChange={(e) => setNegative(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  handleSearch();
                }
              }}
            />
            <p className="p-2">Rating:</p>
            <NumberInput
              minWidth={85}
              maxWidth={100}
              defaultValue={2}
              precision={2}
              step={0.25}
              min={0}
              max={ratingUpper}
              value={ratingLower}
              onChange={(e) => {
                // let range = ratingRange;
                // range[0] = Number(e);
                // console.log("Range", range);
                // setRatingRange(range);
                // console.log(ratingRange);
                setRatingLower(e);
              }}
            >
              <NumberInputField />
              <NumberInputStepper>
                <NumberIncrementStepper />
                <NumberDecrementStepper />
              </NumberInputStepper>
            </NumberInput>
            <NumberInput
              minWidth={85}
              maxWidth={100}
              defaultValue={5}
              precision={2}
              step={0.25}
              min={ratingLower}
              max={5}
              value={ratingUpper}
              onChange={(e) => setRatingUpper(e)}
            >
              <NumberInputField />
              <NumberInputStepper>
                <NumberIncrementStepper />
                <NumberDecrementStepper />
              </NumberInputStepper>
            </NumberInput>
          </Flex>
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
              images.map((image_data, key) => (
                <ImageView
                  key={key}
                  image_data={image_data}
                  searchFunction={searchFunction}
                />
              ))}
          </div>
        </ImageContext.Provider>

        <Container paddingY={8}>
          <Center>
            <Button
              onClick={() => {
                fetchImages(
                  search,
                  theme,
                  negative,
                  [ratingLower, ratingUpper],
                  images.length
                ).then((data) => {
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
  ) : (
    <h1>Server is temporarily down, sorry :(</h1>
  );
}
