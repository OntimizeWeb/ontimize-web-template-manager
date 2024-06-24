import { Injectable } from '@angular/core';

@Injectable()
export class GithubService {

  constructor() { }
  /**
   *Gets remote github  the readme url with proxy configuration
   * @param subdirectory
   * @returns github url readme
   */
  getGithubUrlReadme(subdirectory: string): string {
    return '/ontimize-web-templates/develop/templates/' + subdirectory + '/README.md';
  }

  /**
   * Gets github url
   * @param subdirectory
   * @returns github url for the template
   */
  getGithubUrl(subdirectory: string): string {
    return 'https://github.com/OntimizeWeb/ontimize-web-templates/blob/develop/templates/' + subdirectory;

  }
}
