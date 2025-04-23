// components/TrendingCard.tsx
import { Link } from "expo-router";
import MaskedView from "@react-native-masked-view/masked-view";
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  ActivityIndicator,
} from "react-native";
import useFetch from "@/services/useFetch";
import { fetchMovieDetails } from "@/services/api";
import { images } from "@/constants/images";
import { icons } from "@/constants/icons";
import { TMDB_GENRES } from "@/constants/genres"; // ← import your genre map

type TrendingCardProps = {
  movie_id: number;
  index: number;
};

export default function TrendingCard({ movie_id, index }: TrendingCardProps) {
  const {
    data: details,
    loading,
    error,
  } = useFetch<MovieDetails>(() => fetchMovieDetails(movie_id.toString()));

  if (loading) {
    return (
      <View className="w-32 h-48 rounded-lg bg-gray-800 relative pl-5">
        <ActivityIndicator
          size="small"
          color="#fff"
          className="absolute inset-0 m-auto"
        />
      </View>
    );
  }
  if (!details || error) return null;

  const {
    title,
    poster_path,
    vote_average,
    release_date, // ← pull release_date
    genres, // ← pull genre_ids
  } = details;

  // compute first genre like in MovieCard
  const firstGenre = genres.length > 0 ? genres[0].name : "";

  const posterUrl = poster_path
    ? `https://image.tmdb.org/t/p/w500${poster_path}`
    : "https://placehold.co/600x400/1a1a1a/FFFFFF.png";

  return (
    <Link href={`/movies/${movie_id}`} asChild>
      <TouchableOpacity className="w-32 relative pl-5">
        <Image
          source={{ uri: posterUrl }}
          className="w-32 h-48 rounded-lg"
          resizeMode="cover"
        />

        {/* ⭐ vote_average */}
        <View className="absolute top-1.5 -right-3.5 flex-row items-center rounded-md bg-black/30 p-1">
          <Image source={icons.star} className="size-4" />
          <Text className="text-xs text-white font-bold uppercase">
            {vote_average.toFixed(1)}
          </Text>
        </View>

        {/* ranking badge */}
        <View className="absolute bottom-[47px] -left-[2px] px-2 py-1 rounded-full">
          <MaskedView
            maskElement={
              <Text className="font-bold text-white text-6xl">{index + 1}</Text>
            }
          >
            <Image
              source={images.rankingGradient}
              className="size-14"
              resizeMode="cover"
            />
          </MaskedView>
        </View>

        {/* title */}
        <Text
          className="text-sm font-bold mt-2 text-light-200"
          numberOfLines={2}
        >
          {title}
        </Text>

        {/* release year + first genre */}
        <View className="flex-row items-center justify-between mt-1">
          <Text className="text-xs text-light-300">
            {release_date?.split("-")[0]}
          </Text>
          <Text className="text-xs font-medium text-light-300 uppercase text-start">
            {firstGenre}
          </Text>
        </View>
      </TouchableOpacity>
    </Link>
  );
}
