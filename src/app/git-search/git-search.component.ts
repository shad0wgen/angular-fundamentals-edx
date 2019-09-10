import { Component, OnInit } from '@angular/core';
import { GitSearchService } from '../git-search.service';
import { GitSearch } from '../git-search';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';

@Component({
  selector: 'app-git-search',
  templateUrl: './git-search.component.html',
  styleUrls: ['./git-search.component.css']
})
export class GitSearchComponent implements OnInit {
  searchResults: GitSearch;
  searchQuery: string;
  title: string;
  displayQuery: string;
  currentPage = 1;
  nextActive: boolean;
  previusActive: boolean;

  constructor(
    private gitSearchService: GitSearchService,
    private route: ActivatedRoute,
    private router: Router,
    ) { }

  ngOnInit() {
    this.route.paramMap.subscribe( (params: ParamMap) => {
      this.searchQuery = params.get('query');
      this.gitSearch();
      this.displayQuery = params.get('query');
    });
    this.route.data.subscribe( (result) => {
      this.title = result.title;
    });
  }

  gitSearch = (nextPage: boolean = false, previusPage: boolean = false) => {
    if (nextPage) {
      this.currentPage++;
    } else if (previusPage) {
      this.currentPage--;
    }
    this.gitSearchService.gitSearch(this.searchQuery, this.currentPage).then((response) => {
      this.searchResults = response[0];
      this.nextActive = response[1];
      this.previusActive = response[2];
      alert('Total Libraries Found:' + response[0].total_count);
    }, (error) => {
      alert('Error: ' + error.statusText);
    });
  }

  sendQuery = () => {
    this.searchResults = null;
    this.router.navigate(['/search/' + this.searchQuery]);
  }

  nextPage = () => {
    this.gitSearch(true);
  }

  previusPage = () => {
    this.gitSearch(false, true);
  }

}
