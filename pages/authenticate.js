import { Button, Divider, Row, Spacer, Text } from "@geist-ui/react";
import { useRouter } from "next/router";
import { useState } from "react";
import useUser from "../components/firebase/useUser";
import Layout from "../components/Layout";

export default function Authenticate() {
  const Router = useRouter();
  const { user, initialized, login } = useUser();

  const [isAuthenticating, setIsAuthenticating] = useState(false);

  if (initialized && user) {
    Router.push("/dashboard");
  }

  return (
    <Layout showAction={false}>
      <Row align="middle" justify="center">
        <Text h3>Sign in</Text>
      </Row>
      <Divider>with</Divider>
      <Spacer y={2} />
      <Row align="middle" justify="center">
        <Button
          type="success"
          loading={!initialized || isAuthenticating}
          onClick={function () {
            setIsAuthenticating(true);
            login();
          }}
        >
          Google
        </Button>
      </Row>
    </Layout>
  );
}
