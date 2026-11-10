import type { ReactNode } from "react";

const Layout = ({ children }: { children: ReactNode }) => {
  return (
    <div className="admin-theme ">
      {children}
    </div>
  );
}

export default Layout;



