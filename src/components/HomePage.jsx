import {
  Card,
  Layout,
  Page,
  Tag,
  Stack,
  TextField,
  Button,
  DataTable,
  Scrollable,
} from "@shopify/polaris";

import { useAppBridge } from "@shopify/app-bridge-react";
import { userLoggedInFetch } from "../App";

import { useState, useEffect } from "react";

export function HomePage() {
  const app = useAppBridge();
  const fetch = userLoggedInFetch(app);

  const [openstate, setOpenState] = useState(false);
  const [bar, getBar] = useState([]);
  const [name, getDemo] = useState("");
  const [shipbar, getDemo2] = useState("");
  // const [demo3, getDemo3] = useState('');

  const blog = {
    name: name,
    shipBar: shipbar,
  };
  const click = () => {

    fetch("/bar", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(blog),
    }).then(() => {
      console.log("send");
    });
    console.log("working");
  };

  async function create() {
    setOpenState(true);

    
  }
   

  async function reload() {
    const count = await fetch("/bar").then((res) => res.json());
    
    getBar(count);

  }

  function clicking(e){
   console.log('====================================');
   console.log(e.name);
   console.log('====================================');
  }

  

  useEffect(
    () => reload()
    ,


    [bar]);

  return (
    <Page title="Announcement">
      <Scrollable>
        {" "}
        <Layout>
          <Layout.Section>
            <Stack distribution="trailing">
              <Button primary onClick={create}>
                Create new{" "}
              </Button>
            </Stack>
          </Layout.Section>
          <Layout.Section fullWidth>
            <Card title="Products Name">
              <Card.Section>
                <DataTable
                  columnContentTypes={[
                    "text",
                    "numeric",
                    "numeric",
                    "numeric",
                    "numeric",
                  ]}
                  headings={[
                    "Name",
                    "Geo Target",
                    "Excluded Countries",
                    "Actions",
                    "Achievements",
                  ]}
                  rows={bar.map((info,index)=>{
                    return [
                      info.name,
                      info.shipBar,
                      "",
                      <Layout key={index}>
                        <Button >Edit</Button>
                        <Button
                          
                        >
                          Dupilicate
                        </Button>
                        <Button onClick={() => alert("name")}>Delete</Button>
                        <Button onClick={()=>clicking(info)}>Active</Button>
                      </Layout>,
                      ""
                    ]
                  })}
                />
              </Card.Section>
            </Card>
          </Layout.Section>
          {openstate ? (
            <Layout.Section fullWidth>
              <Card title="Content Configuration" sectioned>
                <TextField
                  label="Name"
                  value={name}
                  onChange={getDemo}
                  autoComplete="off"
                />
                <TextField
                  label="FreeShiping Goal"
                  value={shipbar}
                  onChange={getDemo2}
                  autoComplete="off"
                />
                <Stack>
                  {/* <TextField
              label="Initial Message"
              value={demo3}
              onChange={getDemo3}
              autoComplete="off"
            /> */}
                  {/* <TextField
                label="INR 100"
                value={demo3}
                onChange={getDemo3}
                autoComplete="off"
              /> */}
                </Stack>

                <br></br>
                <Stack distribution="trailing">
                  <Button primary onClick={click}>
                    {" "}
                    Add
                  </Button>
                </Stack>
              </Card>
            </Layout.Section>
          ) : null}
        </Layout>
      </Scrollable>
    </Page>
  );
}
