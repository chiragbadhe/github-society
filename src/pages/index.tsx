import Contributions from "@/components/Contributions";
import Head from "next/head";

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
