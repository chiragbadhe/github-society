export const getContributionColor = (count: number): string => {
  if (count === 0) return "#ebedf0"; // Very light gray (GitHub's color for 0 contributions)
  if (count <= 5) return "#c6e48b"; // Light green
  if (count <= 10) return "#7bc96f"; // Medium green
  if (count <= 20) return "#239a3b"; // Dark green
  return "#006400"; // Very dark green (GitHub's color for high contributions)
};
