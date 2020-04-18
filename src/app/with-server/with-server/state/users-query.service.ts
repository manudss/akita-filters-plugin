import { Injectable } from '@angular/core';
import { QueryEntity } from '@datorama/akita';
import { PhotosStore, PhotosState } from './photos-store.service';

@Injectable({ providedIn: 'root' })
export class PhotosQuery extends QueryEntity<PhotosState> {

  constructor(protected store: PhotosStore) {
    super(store);
  }

}
