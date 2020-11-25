import {
  Button,
  Card,
  Description,
  Divider,
  Link,
  Spacer,
  Text,
} from "@geist-ui/react";
import { useRouter } from "next/router";
import { useEffect } from "react";
import useUser from "../components/firebase/useUser";
import Layout from "../components/Layout";

export default function Home() {
  const Router = useRouter();
  const { user, initialized } = useUser();

  useEffect(
    function () {
      if (initialized && user) {
        Router.push("/dashboard");
      }
    },
    [user]
  );

  return (
    <Layout>
      <Text h4 type="secondary">
        Smarter. Faster. Better.
      </Text>
      <Text h2>A quiz management app which takes away the burden.</Text>
      <Spacer y />
      <Link href="/authenticate">
        <Button type="success">Get Started</Button>
      </Link>
      <Spacer y />
      <Card>
        <Text h4 type="warning">
          Features
        </Text>
        <Divider />
        <Description
          title="Automatic Results"
          content="It automatically generates results an eliminates the chances of mistakes and at the same time saves your valuable time."
        />
        <Spacer />
        <Description
          title="Easy Management"
          content="It makes it dead simple to manage even hundreds of quizzes at the same time on the same spot."
        />
        <Spacer />
        <Description
          title="Fast Creation"
          content="It becomes very easy to create even big quizzes thanks to our beautiful UI."
        />
      </Card>
    </Layout>
  );
}
