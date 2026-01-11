import Navbar from "./Navbar";

interface Props {
  children: React.ReactNode;
}

export default function PageLayout({ children }: Props) {
  return (
    <div>
      <Navbar />
      <main>{children}</main>
    </div>
  );
}
