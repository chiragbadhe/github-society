// lib/analytics.ts
import ReactGA from 'react-ga4';

export const initGA = (trackingId: string): void => {
  ReactGA.initialize(trackingId);
};

export const logPageView = (): void => {
  ReactGA.send({ hitType: 'pageview', page: window.location.pathname });
};

export const logEvent = (category: string, action: string): void => {
  ReactGA.event({ category, action });
};
