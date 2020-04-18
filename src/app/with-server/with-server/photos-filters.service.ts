import {Injectable} from '@angular/core';
import {PhotosState} from './state/photos-store.service';
import {AkitaFiltersPlugin} from 'akita-filters-plugin';
import {PhotosQuery} from './state/users-query.service';
import {HashMap} from '@datorama/akita';
import {PhotosService} from './state/photos.service';


@Injectable({providedIn: 'root'})
export class PhotosFiltersService extends AkitaFiltersPlugin<PhotosState> {

  constructor(protected query: PhotosQuery, protected photosApi: PhotosService) {
    super(query);
    this.withServer((filtersNormalized: string | HashMap<any>) => {
      console.log('filters normalized :', filtersNormalized);
      return this.photosApi.get(filtersNormalized as HashMap<any>);
    });



  }

  load() {
    this.setFilter({id: '_limit', server: true, value: '30' });
  }

}
