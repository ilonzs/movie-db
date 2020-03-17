import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SearchComponent } from './search.component';
import { MovieService } from '../services/movie.service';
import { MaterialModule, MessageBarService } from 'src/app/material/material.module';
import { HttpClientModule } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { Movie } from '../model/movie';
import { By } from '@angular/platform-browser';
import { MovieCardComponent } from '../movie-card/movie-card.component';

describe('SearchComponent', () => {
  let component: SearchComponent;
  let fixture: ComponentFixture<SearchComponent>;

  let fakeMovieService: MovieService;
  let fakeMessageBarService: MessageBarService;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SearchComponent, MovieCardComponent ],
      imports: [
        MaterialModule,
        HttpClientModule,
        BrowserAnimationsModule
      ],
      providers: [MovieService]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SearchComponent);
    component = fixture.componentInstance;
    fakeMovieService = fixture.debugElement.injector.get(MovieService);
    fakeMessageBarService = fixture.debugElement.injector.get(MessageBarService);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('searching for movies should return a non empty result', async () => {
    // Arrange
    const searchResult: Movie[] = [{
      title: 'Movie1',
      releaseYearInfo: '1991',
      imdbLink: 'link1'
    },
    {
      title: 'Movie2',
      releaseYearInfo: '1992',
      imdbLink: 'link2'
    }];

    spyOn(fakeMessageBarService, 'showMessage').and.callFake(() => { });
    spyOn(fakeMovieService, 'getMoviesByTitle').and.callFake(async (m) => {
      return searchResult;
    });

    component.searchForm.title.setValue('movie');
    fixture.detectChanges();

    // Act
    await component.searchMovies();
    fixture.detectChanges();

    // Assert
    expect(component.isLoading).toBeFalse();
    expect(component.movieList).toEqual(searchResult);
    const movieList = fixture.debugElement.queryAll(By.directive(MovieCardComponent));
    expect(movieList.length).toEqual(2);
    const movieLinks = movieList.map(x => x.query(By.css('.movie-link')).nativeElement as HTMLElement);
    for (let index = 0; index < movieLinks.length; index++) {
      expect(movieLinks[index].innerText).toContain(searchResult[index].title);
      expect(movieLinks[index].innerText).toContain(searchResult[index].releaseYearInfo);
    }
  });

  it('if search string is empty, a message should display', async () => {
    // Arrange
    spyOn(fakeMessageBarService, 'showMessage').and.callFake(() => { });
    spyOn(fakeMovieService, 'getMoviesByTitle').and.callFake(async (m) => {
      return null;
    });

    component.searchForm.title.setValue('');
    fixture.detectChanges();

    // Act
    await component.searchMovies();
    fixture.detectChanges();

    // Assert
    expect(fakeMessageBarService.showMessage).toHaveBeenCalled();
  });

  it('if searching for a movie fails, an error message should display', async () => {
    // Arrange
    spyOn(fakeMessageBarService, 'showMessage').and.callFake(() => { });
    spyOn(fakeMovieService, 'getMoviesByTitle').and.callFake(async (m) => {
      throw new Error('Error');
    });

    component.searchForm.title.setValue('Title');
    fixture.detectChanges();

    // Act
    await component.searchMovies();
    fixture.detectChanges();

    // Assert
    expect(fakeMessageBarService.showMessage).toHaveBeenCalled();
  });

  it('loading related movies should change the loaded movie list', () => {
    // Arrange
    const movies: Movie[] = [{
      title: 'Movie1',
      releaseYearInfo: '1991',
      imdbLink: 'link1'
    },
    {
      title: 'Movie2',
      releaseYearInfo: '1992',
      imdbLink: 'link2'
    }];

    spyOn(fakeMessageBarService, 'showMessage').and.callFake(() => { });

    component.searchForm.title.setValue('movie');
    fixture.detectChanges();

    // Act
    component.loadMovies(movies);
    fixture.detectChanges();

    // Assert
    expect(fakeMessageBarService.showMessage).toHaveBeenCalled();
    expect(component.isLoading).toBeFalse();
    expect(component.movieList).toEqual(movies);
    const movieList = fixture.debugElement.queryAll(By.directive(MovieCardComponent));
    expect(movieList.length).toEqual(2);
    const movieLinks = movieList.map(x => x.query(By.css('.movie-link')).nativeElement as HTMLElement);
    for (let index = 0; index < movieLinks.length; index++) {
      expect(movieLinks[index].innerText).toContain(movies[index].title);
      expect(movieLinks[index].innerText).toContain(movies[index].releaseYearInfo);
    }
  });
});
