import { Injectable } from '@angular/core';

import { Movie } from '../model/movie';
import { WikipediaMovieInfo } from '../model/wikipedia-movie-info';
import * as DomParser from 'dom-parser';
import { Route } from './route';

/**
 * Parser for Html respnses from
 * IMDb and Wikipedia
 */
@Injectable({
  providedIn: 'root'
})
export class HtmlParserService {

  constructor() { }

  async extractMoviesFromHtmlDocument(html: string): Promise<Movie[]> {
    let result: Movie[] = [];
    const domParser = new DomParser();
    const dom = domParser.parseFromString(html);
    const article = dom.getElementsByClassName('article')[0]
      ?.getElementsByClassName('lister-list')[0];

    if (article) {
      const movies = article.getElementsByClassName('lister-item mode-advanced');
      if (movies.length > 0) {
        try {
          result = movies.map(x => {
            const rTitle = x.getElementsByClassName('lister-item-content')[0]
              ?.getElementsByTagName('a')[0]?.textContent;

            const rImdbLinkRef = x.getElementsByClassName('lister-item-content')[0]
              ?.getElementsByTagName('a')[0]?.getAttribute('href');
            const rImdbLink = Route.ImdbUrl + rImdbLinkRef?.substr(0, rImdbLinkRef.indexOf('?'));

            const rYear = x.getElementsByClassName('lister-item-content')[0]
              ?.getElementsByClassName('lister-item-year')[0]
              ?.textContent;

            const rRuntime = x.getElementsByClassName('lister-item-content')[0]
              ?.getElementsByClassName('runtime')[0];

            const rGenres = x.getElementsByClassName('lister-item-content')[0]
              ?.getElementsByClassName('genre')[0]?.textContent;

            const rRating = x.getElementsByClassName('lister-item-content')[0]
              ?.getElementsByClassName('ratings-bar')[0]
              ?.getElementsByTagName('strong')[0]?.textContent;

            const rShortDescription = x.getElementsByClassName('lister-item-content')[0]
              ?.getElementsByClassName('text-muted')[2]?.textContent;

            const rImageUrl = x.getElementsByClassName('lister-item-image float-left')[0]
              ?.getElementsByTagName('img')[0]?.getAttribute('loadlate');

            return {
              title: rTitle,
              releaseYearInfo: rYear,
              imdbLink: rImdbLink,
              runtime: rRuntime ? Number(rRuntime.textContent.replace('min', '')) : undefined,
              genres: rGenres,
              rating: rRating,
              imageUrl: rImageUrl,
              shortDescription: rShortDescription
            };
          });
        } catch (error) {
          console.log('Error while parsing the data, please try another search string');
          throw error;
        }
      }
    }
    return result;
  }

  async extractRelatedMoviesFromHtmlDocument(html: string): Promise<Movie[]> {
    let result: Movie[] = [];
    const domParser = new DomParser();
    const dom = domParser.parseFromString(html);
    const relatedMoviesContainer = dom.getElementById('titleRecs')?.getElementsByClassName('rec_overviews')[0];
    if (relatedMoviesContainer) {
      const movies = relatedMoviesContainer.getElementsByClassName('rec_overview');
      if (movies.length > 0) {
        try {
          result = movies.map(x => {
            const rTitle = x.getElementsByClassName('rec-title')[0]
              ?.getElementsByTagName('a')[0]
              ?.textContent;

            const rImdbLinkRef = x.getElementsByClassName('rec-title')[0]
              ?.getElementsByTagName('a')[0]
              ?.getAttribute('href');

            const rImdbLink = Route.ImdbUrl + rImdbLinkRef.substr(0, rImdbLinkRef.indexOf('?'));

            const rYear = x.getElementsByClassName('rec-title')[0]
              ?.getElementsByClassName('nobr')[0]
              ?.textContent;

            const rGenres = x.getElementsByClassName('rec-cert-genre rec-elipsis')[0]
              ?.textContent;

            const rRating = x.getElementsByClassName('rating rating-list')[0]
              ?.getElementsByClassName('rating-rating')[0]
              ?.getElementsByClassName('value')[0]
              ?.textContent;

            const rShortDescription = x.getElementsByClassName('rec-outline')[0]
              ?.textContent;

            const rImageUrl = x.getElementsByClassName('rec_poster')[0]
              ?.getElementsByTagName('img')[0]
              ?.getAttribute('loadlate');

            return {
              title: rTitle,
              releaseYearInfo: rYear,
              imdbLink: rImdbLink,
              runtime: undefined,
              genres: rGenres,
              rating: rRating,
              imageUrl: rImageUrl,
              shortDescription: rShortDescription
            };
          });
        } catch (error) {
          console.log('Error while extracting related movies');
          throw error;
        }
      }
    }
    return result;
  }

  async extractWikipediaMovieLink(html: string, movieTitle: string): Promise<string> {
    const domParser = new DomParser();
    const dom = domParser.parseFromString(html);
    const filmTitleList = dom.getElementById('mw-pages')
      ?.getElementsByClassName('mw-category')[0]
      ?.getElementsByTagName('a');
    return filmTitleList?.find(x => x.textContent.startsWith(movieTitle))?.getAttribute('href');
  }

  async extractWikipediaMovieInfo(html: string, movieTitle: string, movieLink: string): Promise<WikipediaMovieInfo> {
    const domParser = new DomParser();
    const wikiInfoDom = domParser.parseFromString(html);
    const rMainParagraph = wikiInfoDom.getElementById('mw-content-text')
      ?.getElementsByTagName('p')
      .find(x => x.textContent.startsWith(movieTitle))
      ?.textContent;
    const rMoviePosterUrl = wikiInfoDom.getElementsByClassName('image')[0]
      ?.getElementsByTagName('img')[0]
      ?.getAttribute('src');

    return {
      title: movieTitle,
      wikipediaLink: Route.WikipediaUrl + movieLink,
      mainParagraph: rMainParagraph,
      moviePosterUrl: rMoviePosterUrl
    };
  }
}
