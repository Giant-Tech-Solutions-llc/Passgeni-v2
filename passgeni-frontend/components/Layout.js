import Header from "./layout/Header.js";
import Footer from "./layout/Footer.js";

export default function Layout({ children }) {
  return (
    <>
      <Header />
      <main style={{ paddingTop: 64 }}>
        {children}
      </main>
      <Footer />
    </>
  );
}
