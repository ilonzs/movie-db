import { TestBed } from '@angular/core/testing';

import { HtmlParserService } from './html-parser.service';
import { assertNotNull } from '@angular/compiler/src/output/output_ast';
import { Route } from './route';

describe('HtmlParserService', () => {
  let service: HtmlParserService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(HtmlParserService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('extract movies from an html document with the incorrect format should return an empty result', async () => {
    // Arrange
    const htmlDocuemnt =
      `<div class="article">
        <div class="lister-list">
          <div class="error">
            Error
          </div>
        </div>
      </div>`;

    // Act
    const result = await service.extractMoviesFromHtmlDocument(htmlDocuemnt);

    // Assert
    expect(result).toBeTruthy();
    expect(result.length).toEqual(0);
  });

  it('extract movies from an html document with the correct format should return a movie array', async () => {
    // Arrange
    const title = 'Gladiator';
    const year = '2000';
    const htmlDocuemnt =
      `<div class="article">
        <div class="lister-list">
          <div class="lister-item mode-advanced">
            <div class="lister-item-content">
              <a>${title}</a>
              <div class="lister-item-year">${year}</div>
            </div>
          </div>
        </div>
      </div>`;

    // Act
    const result = await service.extractMoviesFromHtmlDocument(htmlDocuemnt);

    // Assert
    expect(result).toBeTruthy();
    expect(result.length).toEqual(1);
    expect(result[0].title).toEqual(title);
    expect(result[0].releaseYearInfo).toEqual(year);
  });

  it('extracting a wikipedia movie link from a wikipedia index page that contains the move should return a link', async () => {
    // Arrange
    const titleToSearchFor = 'Gladiator';
    const resultLink = 'link1';
    const htmlDocuemnt =
    `<div id="mw-pages">
      <div class="mw-category">
        <a href="${resultLink}">${titleToSearchFor} (2000)</a>
        <a href="link2">Movie 2 (2002)</a>
        <a href="link3">Movie 3 (2003)</a>
      </div>
    </div>`;

    // Act
    const result = await service.extractWikipediaMovieLink(htmlDocuemnt, titleToSearchFor);

    // Assert
    expect(result).toBeTruthy();
    expect(result).toEqual(resultLink);
  });

  it('extracting a wikipedia movie link from a wikipedia index page that does not contain the move should return undefined', async () => {
    // Arrange
    const titleToSearchFor = 'Gladiator';
    const resultLink = 'link1';
    const htmlDocuemnt =
      `<div id="mw-pages">
        <div class="mw-category">
          <a href="link2">Movie 2 (2002)</a>
          <a href="link3">Movie 3 (2003)</a>
        </div>
      </div>`;

    // Act
    const result = await service.extractWikipediaMovieLink(htmlDocuemnt, titleToSearchFor);

    // Assert
    expect(result).toBeFalsy();
  });

  it('extracting a wikipedia movie info from a correct wikipedia movie html should return a result', async () => {
    // Arrange
    const movieTitle = 'Gladiator';
    const movieLink = 'link1';
    const mainParagraph = 'Gladiator is a movie. This is a paragraph.';
    const posterUrl = 'movie_image';
    const htmlDocument =
      `<div id="mw-content-text">
        <p>${mainParagraph}</p>
        <div class="image">
          <img src="${posterUrl}">
        </div>
      </div>`;

    // Act
    const result = await service.extractWikipediaMovieInfo(htmlDocument, movieTitle, movieLink);

    // Assert
    expect(result).toBeTruthy();
    expect(result.title).toEqual(movieTitle);
    expect(result.wikipediaLink).toEqual(Route.WikipediaUrl + movieLink);
    expect(result.mainParagraph).toEqual(mainParagraph);
    expect(result.moviePosterUrl).toEqual(posterUrl);
  });

});
