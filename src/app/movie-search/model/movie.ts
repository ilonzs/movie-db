import { WikipediaMovieInfo } from './wikipedia-movie-info';

/**
 * Interface representing an IMDb movie.
 */
export interface Movie {
  /**
   * Movie title based on IMDb
   */
  title: string;
  /**
   * Release year information based on IMDb
   */
  releaseYearInfo: string;
  /**
   * IMDb movie link
   */
  imdbLink: string;
  /**
   * Movie runtime
   */
  runtime?: number;
  /**
   * Movie genres
   */
  genres?: string;
  /**
   * Movie rating (out of 10) based on IMDb
   */
  rating?: string;
  /**
   * IMDb movie poster url
   */
  imageUrl?: string;
  /**
   * Short description based on IMDb
   */
  shortDescription?: string;
  /**
   * Corresponding Wikipedia information for this movie
   */
  wikipediaInfo?: WikipediaMovieInfo;
}
