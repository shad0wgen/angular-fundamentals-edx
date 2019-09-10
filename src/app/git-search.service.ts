import { Injectable } from '@angular/core';
import { GitSearch } from './git-search';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class GitSearchService {
  cachedValues: Array<{
    [query: string]: GitSearch
  }> = [];

  constructor(private http: HttpClient) {
  }

  gitSearch = (query: string, page: number = 0): Promise<[GitSearch, boolean, boolean]> => {
    const promise = new Promise<[GitSearch, boolean, boolean]>((resolve, reject) => {
      if (this.cachedValues[query]) {
        resolve(this.cachedValues[query]);
      } else {
        this.http.get('https://api.github.com/search/repositories?q=' + query + '&page=' + page, {observe: 'response'})
        .toPromise()
        .then((response) => {
          const linkKey = response.headers.get('link');
          const nextActive = linkKey.includes('next');
          const previusActive = linkKey.includes('prev');
          resolve([response.body as GitSearch, nextActive, previusActive]);
        }, (error) => {
          reject(error);
        });
      }
    });
    return promise;
  }

  gitSearchUser = (query: string): Promise<GitSearch> => {
    const promise = new Promise<GitSearch>((resolve, reject) => {
      if (this.cachedValues[query]) {
        resolve(this.cachedValues[query]);
      } else {
        this.http.get('https://api.github.com/search/users?q=tom' + query)
        .toPromise()
        .then((response) => {
          resolve(response as GitSearch);
        }, (error) => {
          reject(error);
        });
      }
    });
    return promise;
  }

}
