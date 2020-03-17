/**
 * Interface representing information of a movie from Wikipedia
 */
export interface WikipediaMovieInfo {
  /**
   * Movie title based on Wikipedia
   */
  title: string;
  /**
   * Wikipedia movie link
   */
  wikipediaLink: string;
  /**
   * First Wikipedia paragraph
   */
  mainParagraph: string;
  /**
   * Wikipedia movie moster url
   */
  moviePosterUrl?: string;
}
