import Document, { Html, Head, Main, NextScript } from "next/document";

class MyDocument extends Document {
  render() {
    return (
      <Html>
        <Head>
          <meta
            name="description"
            content="Visualize your GitHub contributions in 3D and export the 3D model with GitHub Society."
          />
          <meta name="author" content="Chirag Badhe" />
          <meta
            name="keywords"
            content="GitHub, 3D visualization, contributions, export model"
          />
          <meta property="og:title" content="GitHub Society" />
          <meta
            property="og:description"
            content="Visualize your GitHub contributions in 3D and export the 3D model with GitHub Society."
          />
          <meta property="og:image" content="/screenshot.png" />
          <meta
            property="og:url"
            content="https://github.com/chiragbadhe/github-society"
          />
          <meta name="twitter:card" content="summary_large_image" />
          <meta name="twitter:title" content="GitHub Society" />
          <meta
            name="twitter:description"
            content="Visualize your GitHub contributions in 3D and export the 3D model with GitHub Society."
          />
          <meta name="twitter:image" content="/screenshot.png" />
          <link rel="icon" href="/favicon.ico" />
        </Head>
        <body>
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}

export default MyDocument;
