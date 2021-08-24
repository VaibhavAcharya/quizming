import { Link, Page, Row, Text } from "@geist-ui/react";

export default function Footer() {
  return (
    <Page.Footer>
      <Row align="middle" justify="space-between">
        <Text>&copy; 2020</Text>
        <Link
          href="https://vaibhavacharya.github.io"
          target="_blank"
          rel="noreferrer noopener"
          color
        >
          Vaibhav Acharya
        </Link>
      </Row>
    </Page.Footer>
  );
}
