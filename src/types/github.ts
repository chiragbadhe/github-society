export interface Contribution {
    date: string;
    contributionCount: number;
  }
  
  export interface Week {
    contributionDays: Contribution[];
  }
  
  export interface GitHubContributionsData {
    user: {
      contributionsCollection: {
        contributionCalendar: {
          totalContributions: number;
          weeks: Week[];
        };
      };
    };
  }
  
  export interface ContributionsProps {
    username: string;
    token: string;
    modelDepth?: number; // Optional prop for model depth (scaling factor)
    height: number;
    width: number;
  }
  