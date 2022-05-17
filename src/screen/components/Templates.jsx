import {
  Card,
  Button,
  Stack,
  Layout,
  TextField,
  Select,
} from "@shopify/polaris";

import { useAppBridge } from "@shopify/app-bridge-react";
import { userLoggedInFetch } from "../../App";

import { useState, useCallback } from "react";

const Templates = ({ getTemplate }) => {
  const app = useAppBridge();
  const fetch = userLoggedInFetch(app);

  const handleSelectChange = useCallback((value) => setSelected(value), []);

  const options = [
    { label: "Fixed", value: "fixed" },
    { label: "Scrollable ", value: "relative" },
  ];

  const [openTextField, setOpenTextField] = useState(false);
  const [name, set_name] = useState("My First Free Shipping Bar");
  const [goal, set_goal] = useState(100);
  const [content, set_content] = useState("");
  const [background_color, set_background_color] = useState("");
  const [font_color, set_font_color] = useState("");
  const [font_family, set_font_family] = useState("");
  const [font_size, set_font_size] = useState("");
  const [selected, setSelected] = useState("");

  var templates = [
    {
      name: "Bold and Clear",
      background: "#1E1E20",
      fontSize: "16px",
      fontColor: "#F2BF61",
      fontFamily: "Helvetica",
    },
    {
      name: "Shades of grey",
      background: "#4C4C4C",
      fontSize: "16px",
      fontColor: "#C0C8E0",
      fontFamily: "Helvetica",
    },
    {
      name: "Bright and Elegant",
      background: "#F2F2F2",
      fontSize: "14px",
      fontColor: "#355897",
      fontFamily: "Helvetica",
    },
    {
      name: "Harvest Gold",
      background: "#FFF0A5",
      fontSize: "14px",
      fontColor: "#B67674",
      fontFamily: "Helvetica",
    },
    {
      name: "Good Mood",
      background: "#C6F7D8",
      fontSize: "14px",
      fontColor: "#B9B16B",
      fontFamily: "Helvetica",
    },
    {
      name: "Trust Me",
      background: "#34B0F3",
      fontSize: "14px",
      fontColor: "#E6DBF3",
      fontFamily: "Helvetica",
    },
    {
      name: "Fairy Tale",
      background: "#FAD8D2",
      fontSize: "14px",
      fontColor: "#E28D56",
      fontFamily: "Helvetica",
    },
    {
      name: "Important Things",
      background: "#EB493E",
      fontSize: "14px",
      fontColor: "#FCAC4B",
      fontFamily: "Helvetica",
    },
    {
      name: "Nature stuff",
      background: "#70ED96",
      fontSize: "14px",
      fontColor: "#FFFFFF",
      fontFamily: "Helvetica",
    },
  ];

  const choose_template = (info) => {
    set_background_color(info.background);
    set_font_color(info.fontColor);
    set_font_family(info.fontFamily);
    set_font_size(info.fontSize);
    setOpenTextField(true);
  };
  async function create() {
    var template = {
      name: name,
      shipBar: content,
      background: background_color,
      position: selected,
      fontColor: font_color,
      fontFamily: font_family,
      fontSize: font_size,
      isActive: true,
    };

    await fetch("/announcementBar", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(template),
    });
    getTemplate;
  }

  return (
    <Layout>
      <Layout.Section fullWidth>
        <Stack distribution="center">
          <h1>Basic Templates</h1>
        </Stack>
      </Layout.Section>
      <Layout.Section fullWidth>
        <Card>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "auto auto",
              gap: "10px",
              padding: "10px 14px",
            }}
          >
            {templates.map((info, index) => {
              return (
                <div
                  key={index}
                  style={{
                    height: "40px",
                    width: "100%",
                    background: info.background,
                    fontSize: info.fontSize,
                    color: info.fontColor,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    cursor: "pointer",
                    borderRadius: "4px",
                  }}
                  onClick={() => choose_template(info)}
                >
                  {info.name}
                </div>
              );
            })}
          </div>
        </Card>
      </Layout.Section>
      {openTextField ? (
        <>
          <Layout.Section oneHalf>
            <Card title="Content Configuration" sectioned>
              <TextField
                label="Name"
                value={name}
                onChange={set_name}
                autoComplete="off"
              />
              <TextField
                label="Free Shipping Goal:"
                type="number"
                value={goal}
                onChange={set_goal}
                autoComplete="off"
              />
              <Stack>
                <TextField
                  label="Initial Message:"
                  value="Free shipping for orders over "
                  onChange={set_content}
                  autoComplete="off"
                />{" "}
                <h2>{goal}</h2>
                <TextField
                  value="away from free shipping"
                  onChange={set_content}
                  autoComplete="off"
                />
              </Stack>
              <TextField
                label="Content"
                value={content}
                onChange={set_content}
                autoComplete="off"
              />
              <Select
                label="Date range"
                options={options}
                onChange={handleSelectChange}
                value={selected}
              />
            </Card>
          </Layout.Section>
          <Layout.Section oneHalf>
            <Card title="Design Configuration" sectioned>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "flex-start",
                  height: "50px",
                  width: "95%",
                }}
              >
                <lable
                  style={{
                    fontSize: "15px",
                    fontWeight: "200",
                    marginRight: "5%",
                  }}
                >
                  Background :
                </lable>
                <input
                  value={background_color}
                  type="color"
                  onChange={(e) => set_background_color(e.target.value)}
                  autoComplete="off"
                  style={{ width: "200px", height: "40px" }}
                />
              </div>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "flex-start",
                  height: "50px",
                  width: "95%",
                }}
              >
                <lable
                  style={{
                    fontSize: "15px",
                    fontWeight: "200",
                    marginRight: "6.8%",
                  }}
                >
                  Font-Color :
                </lable>
                <input
                  value={font_color}
                  type="color"
                  onChange={(e) => set_font_color(e.target.value)}
                  autoComplete="off"
                  style={{ width: "200px", height: "40px" }}
                />
              </div>
              <TextField
                label="Font-Family"
                value={font_family}
                onChange={set_font_family}
                autoComplete="off"
              />

              <TextField
                label="Font-Size"
                value={font_size}
                onChange={set_font_size}
                autoComplete="off"
              />
            </Card>
          </Layout.Section>
          <Layout.Section fullWidth>
            <Stack distribution="trailing">
              <Button onClick={() => create()}>Create</Button>
            </Stack>
          </Layout.Section>
        </>
      ) : null}
    </Layout>
  );
};

export default Templates;
