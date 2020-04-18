import { Injectable } from '@angular/core';
import { PhotosStore, PhotosState } from './photos-store.service';
import {PhotosQuery} from './users-query.service';
import {HttpClient} from '@angular/common/http';
import {tap} from 'rxjs/operators';

@Injectable({ providedIn: 'root' })
export class PhotosService  {


  constructor(protected store: PhotosStore, protected query: PhotosQuery, private http: HttpClient) {

  }

  get(params: {
    [param: string]: string | string[];
  }) {
    return this.http.get(`https://jsonplaceholder.typicode.com/photos`, {params});
  }

}
