// github.ts
import axios from "axios";

export const fetchGitHubContributions = async (
  username: string,
  token: string
) => {
  const query = `
    query ($username: String!) {
      user(login: $username) {
        contributionsCollection {
          contributionCalendar {
            weeks {
              contributionDays {
                contributionCount
                date
              }
            }
          }
        }
      }
    }
  `;

  try {
    const response = await axios.post(
      "https://api.github.com/graphql",
      { query, variables: { username } },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (response.status !== 200) {
      throw new Error(
        `GitHub API responded with status code ${response.status}`
      );
    }

    return response.data.data;
  } catch (error: any) {
    console.error(
      "Error in fetchGitHubContributions:",
      error.response?.data || error.message
    );
    throw new Error("Failed to fetch contributions");
  }
};
