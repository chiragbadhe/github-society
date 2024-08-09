// export const getContributionColor = (count: number): string => {
//     if (count === 0) return "bg-[#d1d5db]"; // Light gray for 0 contributions
//     if (count <= 5) return "bg-[#fbbf24]"; // Yellow for 1-5 contributions
//     if (count <= 10) return "bg-[#f59e0b]"; // Orange for 6-10 contributions
//     if (count <= 20) return "bg-[#f97316]"; // Deep orange for 11-20 contributions
//     return "bg-[#dc2626]"; // Red for more than 20 contributions
//   };

export const getContributionColor = (count: number): string => {
    if (count === 0) return "#ebedf0"; // Very light gray (GitHub's color for 0 contributions)
    if (count <= 5) return "#c6e48b"; // Light green
    if (count <= 10) return "#7bc96f"; // Medium green
    if (count <= 20) return "#239a3b"; // Dark green
    return "#006400"; // Very dark green (GitHub's color for high contributions)
  };
  