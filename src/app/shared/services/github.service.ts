import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';

@Injectable()
export class GithubService {
  gitUrl: string;
  urlReadme: string;

  constructor() {
    this.gitUrl = environment.githubUrl;
    this.urlReadme = environment.urlReadme;
  }
  /**
   *Gets remote github  the readme url with proxy configuration
   * @param subdirectory
   * @returns github url readme
   */
  getGithubUrlReadme(subdirectory: string): string {
    return this.urlReadme + subdirectory + '/README.md';
  }

  /**
   * Gets github url
   * @param subdirectory
   * @returns github url for the template
   */
  getGithubUrl(subdirectory: string): string {
    return this.gitUrl + subdirectory;

  }
}
