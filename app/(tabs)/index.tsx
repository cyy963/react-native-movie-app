// app/(tabs)/index.tsx
import {
  View,
  Text,
  ActivityIndicator,
  ScrollView,
  Image,
  FlatList,
} from "react-native";
import { useRouter } from "expo-router";

import useFetch from "@/services/useFetch";
import { fetchMovies } from "@/services/api";
import { getTrendingMovies } from "@/services/appwrite";

import { icons } from "@/constants/icons";
import { images } from "@/constants/images";

import SearchBar from "@/components/SearchBar";
import MovieCard from "@/components/MovieCard";
import TrendingCard from "@/components/TrendingCard";

export default function Index() {
  const router = useRouter();

  // Fetch trending IDs from Appwrite
  const {
    data: trending = [],
    loading: trendingLoading,
    error: trendingError,
  } = useFetch<TrendingMovie[]>(async () => {
    const data = await getTrendingMovies();
    return data ?? [];
  });

  // Fetch latest movies from TMDB
  const {
    data: movies = [],
    loading: moviesLoading,
    error: moviesError,
  } = useFetch(() => fetchMovies({ query: "" }));

  return (
    <View className="flex-1 bg-primary">
    <Image
      source={images.bg}
      className="absolute w-full z-0"
      resizeMode="cover"
    />


    <ScrollView
      className="flex-1 px-5"
      showsVerticalScrollIndicator={false}
      contentContainerStyle={{ paddingBottom: 10 }}
    >
      <Image source={icons.logo} className="w-12 h-10 mt-20 mb-5 mx-auto" />

      {moviesLoading || trendingLoading ? (
        <ActivityIndicator
          size="large"
          color="#0000ff"
          className="mt-10 self-center"
        />
      ) : moviesError || trendingError ? (
        <Text>Error: {moviesError?.message || trendingError?.message}</Text>
      ) : (
        <View className="flex-1 mt-5">
          <SearchBar
            onPress={() => router.push("/search")}
            placeholder="Search through 300+ movies online"
          />

          {(trending?.length ?? 0) > 0 && (
            <View className="mt-10">
              <Text className="text-lg text-white font-bold mb-3">
                Trending Movies
              </Text>
              <FlatList
                horizontal
                data={trending}
                showsHorizontalScrollIndicator={false}
                className="mb-4 mt-3"
                contentContainerStyle={{ gap: 26 }}
                renderItem={({ item, index }) => (
                  <TrendingCard movie_id={item.movie_id} index={index} />
                )}
                keyExtractor={(item) => item.movie_id.toString()}
                ItemSeparatorComponent={() => <View className="w-4" />}
              />
            </View>
          )}

          <Text className="text-lg text-white font-bold mt-5 mb-3">
            Latest Movies
          </Text>
          <FlatList
            data={movies}
            renderItem={({ item }) => <MovieCard {...item} />}
            keyExtractor={(item) => item.id.toString()}
            numColumns={3}
            columnWrapperStyle={{
              justifyContent: "flex-start",
              gap: 20,
              paddingRight: 5,
              marginBottom: 10,
            }}
            className="pb-32"
            scrollEnabled={false}
          />
        </View>
      )}
    </ScrollView>
    </View>
  );
}
