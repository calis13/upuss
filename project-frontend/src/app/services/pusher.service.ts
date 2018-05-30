import { Injectable } from '@angular/core';

declare const Pusher: any;

@Injectable()
export class PusherService {
  constructor() {
    var pusher = new Pusher('76d42233dc960acca83f', {
      cluster: 'eu',
      encrypted: true,
    });
    this.channel = pusher.subscribe('vote-channel');
  }
  channel;

  public init() {
    return this.channel;
  }
}