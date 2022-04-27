
import {
  Card,
  Layout,
  Page, Tag, Stack, TextField, Button, DataTable, Scrollable
} from "@shopify/polaris";

import { useAppBridge } from "@shopify/app-bridge-react";
import { userLoggedInFetch } from "../App";





import { useState } from "react";



export function HomePage() {
  const app = useAppBridge();
  const fetch = userLoggedInFetch(app);

  const [demo, getDemo] = useState('');
  const [demo2, getDemo2] = useState('');
  const [demo3, getDemo3] = useState('');






  const blog = {
    js: `const announcementBar = document.getElementById("shopify-section-announcement-bar");announcementBar.innerHTML ="rithi"`
  }
  const click = () => {

    fetch('/demo', {
      method: "POST",
      headers: { 'Content-Type': "application/json" },
      body: JSON.stringify(blog)
    }).then(() => {
      console.log("send");
    })
    console.log("working");


  }


  async function create() {


    const res = await fetch("/create-script")
    console.log(res);

  }












  return (
    <Page title="Announcement">
      <Scrollable>  <Layout>
        <Layout.Section><Stack distribution="trailing"><Button primary onClick={create}>Create new </Button></Stack></Layout.Section>
        <Layout.Section fullWidth>
          <Card title="Products Name" >

            <Card.Section>
              <DataTable
                columnContentTypes={[
                  'text',
                  'numeric',
                  'numeric',
                  'numeric',
                  'numeric',
                ]}
                headings={[
                  'Name',
                  'Geo Target',
                  'Excluded Countries',
                  'Actions',
                  'Achievements',
                ]}
                rows={[
                  ['Emerald Silk Gown', '$875.00', 124689, <Layout><Button onClick={() => alert('demo')}>Edit</Button><Button onClick={(demo, demo2, demo3) => alert('demo')}>Dupilicate</Button><Button onClick={() => alert('demo')}>Delete</Button></Layout>, '$122,500.00'],

                ]}

              />
            </Card.Section>
          </Card>
        </Layout.Section>
        <Layout.Section fullWidth>
          <Card title="Content Configuration" sectioned >

            <TextField
              label="Name"
              value={demo}
              onChange={getDemo}
              autoComplete="off"
            />
            <TextField
              label="FreeShiping Goal"
              value={demo2}
              onChange={getDemo2}
              autoComplete="off"
            />
            <Stack><TextField
              label="Initial Message"
              value={demo3}
              onChange={getDemo3}
              autoComplete="off"
            />
              <TextField
                label="INR 100"
                value={demo3}
                onChange={getDemo3}
                autoComplete="off"
              /></Stack>


            <br></br>
            <Stack distribution="trailing"><Button primary onClick={click}> Add</Button></Stack>
          </Card>

        </Layout.Section>

      </Layout></Scrollable>

    </Page>
  );
}
