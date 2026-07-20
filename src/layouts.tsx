import { Outlet } from "react-router-dom";
import Header from "@/components/Header/Header";
import MainFooter from "@/components/Footer/MainFooter";

const WebsiteLayout = () => {
  return (
    <>
      <Header />
      <main className="lg:mt-[-94px]">
        <Outlet />
      </main>
      <MainFooter />
    </>
  );
};

export default WebsiteLayout;