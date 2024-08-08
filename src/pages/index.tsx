import Contributions from "@/components/Contributions";
import { Head } from "next/document";

const HomePage = () => {
  return (
    <>
      <Head>
        <title>GitHub Society</title>
      </Head>
      <main>
        <Contributions />
      </main>
    </>
  );
};

export default HomePage;
