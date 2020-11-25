import { useRouter } from "next/router";
import useUser from "../firebase/useUser";

import {
  Avatar,
  Button,
  ButtonGroup,
  Link,
  Page,
  Row,
  Spacer,
  Text,
} from "@geist-ui/react";
import { LogOut } from "@geist-ui/react-icons";
import { memo } from "react";

export default memo(function Navbar({ actionData, showAction }) {
  const Router = useRouter();
  const { user, initialized, logout } = useUser();

  const actionButton = (data) => (
    <Button loading={!initialized} onClick={() => Router.push(data.to)}>
      {data.label}
    </Button>
  );

  return (
    <Page.Header style={{ paddingTop: "2vh" }}>
      <Row align="middle" justify="space-between">
        <Row align="middle" justify="start">
          <Avatar src="/logo.png" />
          <Spacer inline x={0.5} />
          <Link href="/">
            <Text b>Quizming</Text>
          </Link>
        </Row>
        <Row align="middle" justify="end">
          <ButtonGroup size="small">
            {showAction &&
              actionButton(
                actionData ||
                  (user
                    ? { label: "Dashboard", to: "/dashboard" }
                    : { label: "Authenticate", to: "/authenticate" })
              )}
            {initialized && user && (
              <Button icon={<LogOut />} onClick={logout} />
            )}
          </ButtonGroup>
        </Row>
      </Row>
    </Page.Header>
  );
});
