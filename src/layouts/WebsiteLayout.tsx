import { Outlet } from "react-router-dom";
import Header from "@/components/Header/Header";
import MainFooter from "@/components/Footer/MainFooter";

const WebsiteLayout = () => {
  return (
    <>


      <Outlet />
    </>
  );
};

export default WebsiteLayout;