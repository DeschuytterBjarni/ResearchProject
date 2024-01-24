import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class LevenshteinDistanceService {

  constructor() { }

  LevenshteinAfstand(str1: string, str2: string): number {
    const lenStr1 = str1.length;
    const lenStr2 = str2.length;
    const d: number[][] = [];
    for (let i = 0; i <= lenStr1; i++) {
      d[i] = [];
      d[i][0] = i;
    }
    for (let j = 0; j <= lenStr2; j++) {
      d[0][j] = j;
    }
    for (let i = 1; i <= lenStr1; i++) {
      for (let j = 1; j <= lenStr2; j++) {
        let cost: number;
        if (str1[i - 1] === str2[j - 1]) {
          cost = 0;
        } else {
          cost = 1;
        }
        d[i][j] = Math.min(
          d[i - 1][j] + 1,     // verwijdering
          d[i][j - 1] + 1,     // toevoeging
          d[i - 1][j - 1] + cost   // alteratie
        );
      }
    }
    return d[lenStr1][lenStr2];
  }
}
