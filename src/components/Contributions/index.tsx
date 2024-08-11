import { useRef, useState } from "react";
import Contributions3D from "@/components/Contributions/Canvas";
import Header from "@/components/Header";
import useWindowSize from "@/hooks/usewindow";
import { logEvent } from "../../lib/analytics";
import { Footer } from "../Footer";

export default function Contributions() {
  const [username, setUsername] = useState("");
  const [showContributions, setShowContributions] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const contributionsRef = useRef<any>(null);

  const { width, height } = useWindowSize();

  const token = process.env.NEXT_PUBLIC_GITHUB_TOKEN;

  if (!token) {
    return (
      <p className="text-red-500">
        GitHub token is missing. Please set `NEXT_PUBLIC_GITHUB_TOKEN` in your
        environment variables.
      </p>
    );
  }

  const adjustedWidth =
    width < 500 ? width - 24 : width < 1024 ? width * 0.9 : 1200;
  const adjustedHeight = 600; // Set height according to your design

  const handleExport = () => {
    if (contributionsRef.current) {
      contributionsRef.current.exportModel();
    }
  };

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setUsername(event.target.value);
    setShowContributions(false); // Reset contributions view on username change
  };

  const handleSubmit = async () => {
    if (!username.trim()) {
      setError("Username cannot be empty.");
      return;
    }

    setLoading(true);
    setError(null);
    setShowContributions(false); // Hide contributions until data is fetched

    try {
      // Simulate data fetching or validation if needed
      setShowContributions(true);
    } catch (err) {
      console.error("Error fetching contributions:", err); // Log detailed error for debugging
      setError("An error occurred while fetching contributions.");
    } finally {
      setLoading(false);
      logEvent("User", "Click Button");
    }
  };

  return (
    <div className="container mx-auto flex flex-col items-center justify-center mb-[60px] px-[12px]">
      <Header />
      <div className="mb-4   md:flex-row md:flex flex-col items-center space-y-[12px] md:space-y-0 mt-[45px]">
        <input
          type="text"
          value={username}
          onChange={handleInputChange}
          placeholder="Enter GitHub username"
          className="p-2 text-lg border font-thin px-[18px] w-full   lg:min-w-[600px] border-white/10 rounded-md bg-transparent outline-none"
        />
        <button
          onClick={handleSubmit}
          className="md:ml-4 px-2 py-2 w-full md:w-auto md:flex font-thin text-md bg-cyan-900 text-white rounded-md hover:bg-cyan-600 disabled:bg-gray-400 whitespace-nowrap flex-shrink-0"
          disabled={loading}
        >
          {loading ? "Loading..." : "View Contributions"}
        </button>

        {showContributions && !loading && (
          <button
            onClick={handleExport}
            className="md:ml-4 px-2 py-2 w-full md:w-auto md:flex  font-thin text-md bg-cyan-900 text-white rounded-md hover:bg-cyan-600 disabled:bg-gray-400 whitespace-nowrap flex-shrink-0"
            disabled={loading}
          >
            {loading ? "Loading..." : "Export Model"}
          </button>
        )}
      </div>

      {error && <p className="text-red-500">{error}</p>}

      {showContributions && !loading ? (
        <div className="relative">
          <Contributions3D
            ref={contributionsRef}
            username={username}
            token={token}
            height={adjustedHeight}
            width={adjustedWidth}
          />
        </div>
      ) : (
        <div className="canvas-container  bg-[rgb(13,13,13)] border rounded-2xl border-white/10 h-[600px] w-full text-center items-center justify-center flex">
          <span className="md:text-[32px] text-[22px] opacity-40 font-thin">
            Your github society will display here...
          </span>
        </div>
      )}
      <Footer />
    </div>
  );
}
