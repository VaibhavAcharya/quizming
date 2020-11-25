import { Link, Page, Row, Text } from "@geist-ui/react";

export default function Footer() {
  return (
    <Page.Footer>
      <Row align="middle" justify="space-between">
        <Text>&copy; 2020</Text>
        <Link
          href="https://instagram.com/vaibhavacharya_/"
          target="_blank"
          color
        >
          Vaibhav Acharya
        </Link>
      </Row>
    </Page.Footer>
  );
}
