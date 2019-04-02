import { Injectable } from '@angular/core';
import { Leader } from '../shared/Leader';
import { LEADERS } from '../shared/Leaders';
@Injectable({
  providedIn: 'root'
})
export class LeaderService {

  constructor() { }

  getLeaders(): Leader[] {
    return LEADERS;
  }

  getLeader(id: string) : Leader {
    return LEADERS.filter((Leader) => (Leader.id === id))[0]
  }

  getFeaturedLeader() : Leader {
    return LEADERS.filter((Leader) => Leader.featured)[0];
  }
}
