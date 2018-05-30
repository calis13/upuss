import { Injectable } from '@angular/core';

declare const Pusher: any;

@Injectable()
export class PusherService {
  constructor() {
    var pusher = new Pusher('901eb88fc540343e1602', {
      cluster: 'ap1',
      encrypted: true,
    });
    this.channel = pusher.subscribe('vote-channel');
  }
  channel;

  public init() {
    return this.channel;
  }
}