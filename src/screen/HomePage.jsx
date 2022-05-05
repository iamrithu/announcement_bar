import { Page } from "@shopify/polaris";
import { Table } from "./components/Table.jsx";

export function HomePage() {
  return (
    <Page title="Announcement" fullWidth>
      <Table />
    </Page>
  );
}
