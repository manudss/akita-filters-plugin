import { Injectable } from '@angular/core';
import { PhotosStore, PhotosState } from './photos-store.service';
import {NgEntityService} from '@datorama/akita-ng-entity-service';
import {PhotosQuery} from './users-query.service';

@Injectable({ providedIn: 'root' })
export class PhotosService extends NgEntityService<PhotosState> {


  constructor(protected store: PhotosStore, protected query: PhotosQuery) {
    super(store);
  }

  /*get(params: {
    [param: string]: string | string[];
  }) {
    return this.http.get(`https://jsonplaceholder.typicode.com/photos`, {params});
  }*/

}
