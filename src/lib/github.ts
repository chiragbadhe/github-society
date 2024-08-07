import { GitHubContributionsData } from "../types";

const GITHUB_GRAPHQL_API = "https://api.github.com/graphql";

export const fetchGitHubContributions = async (
  username: string,
  token: string
): Promise<GitHubContributionsData> => {
  const query = `
    query($username: String!) {
      user(login: $username) {
        contributionsCollection {
          contributionCalendar {
            totalContributions
            weeks {
              contributionDays {
                date
                contributionCount
              }
            }
          }
        }
      }
    }
  `;

  const response = await fetch(GITHUB_GRAPHQL_API, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      query,
      variables: { username },
    }),
  });

  if (!response.ok) {
    throw new Error("Failed to fetch contributions");
  }

  const { data } = await response.json();
  return data;
};
