import { Card, DataTable, Page, Button, Stack, Layout } from "@shopify/polaris";
import { useState, useEffect } from "react";

import { useAppBridge } from "@shopify/app-bridge-react";
import { userLoggedInFetch } from "../../App";

import Templates from "./Templates";

import styled from "styled-components";

const ActiveButton = styled.button`
  padding: 9px 20px;
  border: ${(props) =>
    props.active ? "1px solid #3EB372" : "0.5px solid black"};
  border-radius: 4px;
  background: white;
  color: ${(props) => (props.active ? "#3EB372" : "black")};
`;

export const Table = () => {
  const app = useAppBridge();
  const fetch = userLoggedInFetch(app);

  const [actived, setActive] = useState();

  const [templates, set_templates] = useState([]);
  const [openState, setOpenState] = useState(false);

  async function getTemplate() {
    const count = await fetch(`/announcementBar`).then((res) => res.json());
    set_templates(count);
  }
  async function scriptRun() {
    await fetch("/script_tag").then((res) => res.status);
  }

  async function deleted(e) {
    await fetch(`/delete/${e._id}`, {
      method: "Delete",
    });
    getTemplate();
  }

  async function activate(e, index) {
    setActive(index);
    await fetch(`/update/${e._id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ isActive: true }),
    });
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
    scriptRun();
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
                        width: "100%",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        background: info.background,
                        color: info.fontColor,
                        fontSize: info.fontSize,
                        fontFamily: info.fontFamily,
                        borderRadius: "4px",
                      }}
                    >
                      <h2 style={{ width: "100%", margin: "20px 50px" }}>
                        content
                      </h2>
                    </div>
                    ,
                  </Stack>,
                  <Stack>
                    <ActiveButton
                      active={index === actived}
                      onClick={() => activate(info, index)}
                    >
                      {index === actived ? "Actived " : "Paused"}
                    </ActiveButton>
                    <Button>Edit</Button>
                    <Button onClick={() => deleted(info)}>Delete</Button>
                  </Stack>,
                ];
              })}
            />
          </Card>
        </Layout.Section>
        <Layout.Section>
          {openState ? <Templates getTemplate={getTemplate()} /> : null}
        </Layout.Section>
      </Layout>
    </Page>
  );
};
