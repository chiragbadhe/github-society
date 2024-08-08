// types/analytics.d.ts
declare module 'react-ga4' {
    export interface EventOptions {
      category?: string;
      action?: string;
      label?: string;
      value?: number;
    }
  
    export function initialize(trackingId: string): void;
    export function send(hit: { hitType: string; page: string }): void;
    export function event(options: EventOptions): void;
  }
  