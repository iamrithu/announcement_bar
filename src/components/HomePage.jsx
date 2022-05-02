import {
  Card,
  Layout,
  Page,
  Stack,
  TextField,
  Button,
  DataTable,
} from "@shopify/polaris";

import { useAppBridge } from "@shopify/app-bridge-react";
import { userLoggedInFetch } from "../App";

import { useState, useEffect } from "react";

export function HomePage() {
  const app = useAppBridge();
  const fetch = userLoggedInFetch(app);

  const [openstate, setOpenState] = useState(false);
  const [inputFeild, setInputFeild] = useState(false);


  const [bar, getBar] = useState([]);

  const [name, getDemo] = useState("");
  const [shipBar, getDemo2] = useState("");
  const [goal, setGoal] = useState(0);

  const [background, getBackground] = useState("");
  const [fontColor, getFontColor] = useState("");
  const [fontSize, getFontSize] = useState("");
  const [fontFamily, getFontFamily] = useState("");
  // const [demo3, getDemo3] = useState('');


  var demoJson = [

    {
      "name": "Bold and Clear",
      "background": "#1E1E20",
      "fontSize": "16px",
      "fontColor": "#F2BF61",
      "fontFamily": "Helvetica"


    },
    {
      "name": "Shades of grey",
      "background": "#4C4C4C",
      "fontSize": "16px",
      "fontColor": "#C0C8E0",
      "fontFamily": "Helvetica"
    },
    {
      "name": "Bright and Elegant",
      "background": "#F2F2F2",
      "fontSize": "14px",
      "fontColor": "#355897",
      "fontFamily": "Helvetica"
    },
    {
      "name": "Harvest Gold",
      "background": "#FFF0A5",
      "fontSize": "14px",
      "fontColor": "#B67674",
      "fontFamily": "Helvetica"
    },
    {
      "name": "Good Mood",
      "background": "#C6F7D8",
      "fontSize": "14px",
      "fontColor": "#B9B16B",
      "fontFamily": "Helvetica"
    },
    {
      "name": "Trust Me",
      "background": "#34B0F3",
      "fontSize": "14px",
      "fontColor": "#E6DBF3",
      "fontFamily": "Helvetica"
    },
    {
      "name": "Fairy Tale",
      "background": "#FAD8D2",
      "fontSize": "14px",
      "fontColor": "#E28D56",
      "fontFamily": "Helvetica"
    },
    {
      "name": "Important Things",
      "background": "#EB493E",
      "fontSize": "14px",
      "fontColor": "#FCAC4B",
      "fontFamily": "Helvetica"
    },
    {
      "name": "Nature stuff",
      "background": "#70ED96",
      "fontSize": "14px",
      "fontColor": "#FFFFFF",
      "fontFamily": "Helvetica"
    },




  ]




  const blog = {
    name,
    shipBar,
    background,
    fontFamily,
    fontSize,
    fontColor,
  };
  const click = async () => {

    await fetch("/bar", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(blog),
    })




  };
  //--------------------

  const openThemes = () => {
    setOpenState(true);
  }
  const chooseThemes = (val) => {

    setInputFeild(true);
    getBackground(val.background);
    getFontFamily(val.fontFamily);
    getFontSize(val.fontSize);
    getFontColor(val.fontColor);

    console.log(background);
    console.log(fontColor);
    console.log(fontSize);
    console.log(fontFamily);

  }




  async function reload() {
    const count = await fetch("/bar").then((res) => res.json());

    getBar(count);

  }

  async function clicking(e) {

    await fetch(`/script_tag`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(e),
    })


    await fetch("/create-script", {
      method: "GET",

    })


  }

  async function deleted(e) {

    console.log(e._id);

    await fetch(`/delete/${e._id}`, {
      method: "Delete",

    })


  }



  useEffect(
    () => reload()
    ,


    [bar]);

  return (
    <Page title="Announcement" fullWidth>
      <>
        {" "}
        <Layout>
          <Layout.Section>
            <Stack distribution="trailing">
              <Button primary onClick={openThemes}>
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
                    "text",
                    "numeric",
                    "numeric",
                  ]}
                  headings={[
                    "Name",
                    "Geo Target",
                    "preview",
                    "Actions",
                    "Achievements",
                  ]}
                  rows={bar.map((info, index) => {
                    return [
                      info.name,
                      info.shipBar,
                      <Stack>
                        <div style={{ height: "30px", width: "100px", display: "flex", alignItems: "center", justifyContent: "center", background: info.background, color: info.fontColor, fontSize: info.fontSize, fontFamily: info.fontFamily }} ><h2>content</h2> </div> ,

                      </Stack>
                      ,
                      <Stack key={index} distribution="trailing">
                        <Button style={{ color: "blue" }}>Edit</Button>
                       
                        <Button onClick={() => deleted(info)} destructive>Delete</Button>
                        <Button onClick={() => clicking(info)} primary>Active</Button>
                      </Stack>,
                      "Premium Only"
                    ]
                  })}
                />
              </Card.Section>
            </Card>
          </Layout.Section>
          {openstate ? (
            <Layout.Section fullWidth>
              <h1>Basic template</h1>
              <Card>
              <div style={{ display: 'grid', gridTemplateColumns: "auto auto", gap: "10px", padding: "10px 14px" }}>
                {
                  demoJson.map((info, index) => {
                    return <div key={index} style={{ height: "40px", width: "100%", background: info.background, fontSize: info.fontSize, color: info.fontColor, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", borderRadius: "10px", boxShadow: `1px -1px 10px ${info.background}` }} onClick={() => chooseThemes(info)}>{info.name}</div>
                  })
                }
              </div>
              </Card>
            </Layout.Section>

          ) : null}

        </Layout>
        {inputFeild ? <Layout>  <Layout.Section oneHalf>
          <Card title="Content Configuration" sectioned>


            <TextField
              label="Name"
              value={name}
              onChange={getDemo}
              autoComplete="off"

            />
            <TextField
              label="initial Message"
              value={shipBar}

              onChange={getDemo2}
              autoComplete="off"
            />





          </Card>
        </Layout.Section>
          <Layout.Section oneHalf>
            <Card title="Design Configuration" sectioned>

            <div style={{display: 'flex',alignItems: 'center',justifyContent:"space-between" , height:"50px" ,width:"40%"}}>
            <lable>background</lable>
            <input
                
                value={background}
                type="color"
                onChange={(e)=>getBackground(e.target.value)}
                autoComplete="off"

              />
            </div>
              <TextField
                label="Font-Family"
                value={fontFamily}
                onChange={getFontFamily}
                autoComplete="off"

              />
                          <div style={{display: 'flex',alignItems: 'center',justifyContent:"space-between" , height:"50px" ,width:"40%"}}>
           <lable>Font-Color</lable>
              <input
                
                value={fontColor}
                onChange={(e)=>getFontColor(e.target.value)}
                type="color"
                autoComplete="off"

              />
              </div>
              <TextField
                label="Font-Size"
                value={fontSize}
                onChange={getFontSize}
                autoComplete="off"

              />




              <Stack distribution="trailing">
                <Button primary onClick={click}>

                  Add
                </Button>
              </Stack>
            </Card>
          </Layout.Section></Layout> : null}





      </>
    </Page>
  );
}
