import { Card, DataTable, Page, Button, Stack, Layout } from "@shopify/polaris";
import { useState, useEffect } from "react";

import { useAppBridge } from "@shopify/app-bridge-react";
import { userLoggedInFetch } from "../../App";

import Templates from "./Templates";

export const Table = () => {
  const app = useAppBridge();
  const fetch = userLoggedInFetch(app);

  const [shop_details, set_shop_details] = useState({});
  const [templates, set_templates] = useState([]);
  const [openState, setOpenState] = useState(false);

  // async function shopData() {
  //   const data = await fetch("/shop").then((res) => res.json());
  //   set_shop_details(data);
  // }

  async function getTemplate() {
    const count = await fetch(`/announcementBar`).then((res) => res.json());
    set_templates(count);
  }

  async function deleted(e) {
    await fetch(`/delete/${e._id}`, {
      method: "Delete",
    });
  }
  async function activate(e) {
    await fetch(`/update/${e._id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ isActive: true }),
    });

    await fetch("/script_tag").then((res) => res.json());
  }

  const add = () => {
    if (openState === false) {
      setOpenState(true);
    } else {
      setOpenState(false);
    }
  };

  useEffect(() => {
    getTemplate();
  }, []);

  return (
    <Page fullWidth>
      <Layout>
        <Layout.Section>
          <Stack distribution="trailing">
            {" "}
            <Button onClick={add}>Add</Button>{" "}
          </Stack>
        </Layout.Section>
        <Layout.Section>
          <Card>
            <DataTable
              columnContentTypes={["text", "text", "text", "text"]}
              headings={["Name", "Content", "Preview", "Action"]}
              rows={templates.map((info, index) => {
                return [
                  info.name,
                  info.shipBar,
                  <Stack>
                    <div
                      style={{
                        height: "30px",
                        width: "100px",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        background: info.background,
                        color: info.fontColor,
                        fontSize: info.fontSize,
                        fontFamily: info.fontFamily,
                      }}
                    >
                      <h2>content</h2>{" "}
                    </div>{" "}
                    ,
                  </Stack>,
                  <Stack>
                    <Button onClick={() => activate(info)}>Action</Button>
                    <Button>Edit</Button>
                    <Button onClick={() => deleted(info)}>Delete</Button>
                  </Stack>,
                ];
              })}
            />
          </Card>
        </Layout.Section>
        <Layout.Section>
          {openState ? <Templates shopData={shop_details} /> : null}
        </Layout.Section>
      </Layout>
    </Page>
  );
};
