import { Page } from "@geist-ui/react";

import Navbar from "./Navbar";
import Footer from "./Footer";

export default function Layout({ actionData, showAction = true, children }) {
  return (
    <Page>
      <Navbar {...{ actionData, showAction }} />
      <Page.Content>{children}</Page.Content>
      <Footer />
    </Page>
  );
}
