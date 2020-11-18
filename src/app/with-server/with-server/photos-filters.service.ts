import {Injectable} from '@angular/core';
import {PhotosState} from './state/photos-store.service';
import {AkitaFiltersPlugin} from 'akita-filters-plugin';
import {PhotosQuery} from './state/users-query.service';
import {HashMap, PaginationResponse} from '@datorama/akita';
import {PhotosService} from './state/photos.service';
import {map, tap} from 'rxjs/operators';
import {PhotosModel} from './state/photosModel';
import {HttpResponse} from '@angular/common/http';
import {BehaviorSubject, Observable} from 'rxjs';


@Injectable({providedIn: 'root'})
export class PhotosFiltersService extends AkitaFiltersPlugin<PhotosState> {
  get total$(): Observable<number> {
    return this._total$.asObservable();
  }
  private _total$ = new BehaviorSubject<number>(0);

  constructor(protected query: PhotosQuery, protected photosApi: PhotosService) {
    super(query);
    this.withServer(this.getOnChangeFilter());
  }


  public getOnChangeFilter() {
    return (filtersNormalized: string | HashMap<any>) => {
      const filtersObject = filtersNormalized as HashMap<any>;
      if (filtersObject?._page) {
        filtersObject._page = filtersObject._page + 1;
      }
      return this.photosApi.get({params: filtersObject,
        mapResponseFn: (res: HttpResponse<PhotosModel[]>): PhotosModel[] => {
          this._total$.next(Number(res.headers.get('x-total-count')));

          return res.body;
        },
          observe: 'response', // <----- this
      });
    };
  }
}
