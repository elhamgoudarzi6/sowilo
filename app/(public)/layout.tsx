import Footer from "./layout/footer";
import GoToTop from "./layout/gototop";
import Header from "./layout/header";

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Header />
      {children}
      <GoToTop />
      <Footer />
    </>
  );
}