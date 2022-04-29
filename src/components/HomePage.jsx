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
  const [goal,setGoal]=useState(0)
  // const [demo3, getDemo3] = useState('');

  const blog = {
    name: name,
    shipBar: shipbar,
  };
  const click = async() => {

    await fetch("/bar", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(blog),
    })
    
   
   
   
  };
  //--------------------

  async function create() {
    setOpenState(true);

    
  }
   

  async function reload() {
    const count = await fetch("/bar").then((res) => res.json());
    
    getBar(count);

  }

 async function clicking(e){
  
    await fetch(`/script_tag`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(e),
    })
      
  
    await fetch("/create-script", {
      method: "GET",
      
    })
    
  
  }

  async function deleted(e){
  
   console.log(e._id);

   await fetch("/bar/"+e._id).then((res) => res.json());
 
   
   }

  

  useEffect(
    () => reload()
    ,


    [bar]);

  return (
    <Page title="Announcement" fullWidth>
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
                      "N/A",
                      <Stack key={index} distribution="trailing">
                        <Button  style={{color:"blue"}}>Edit</Button>
                        <Button
                          
                        >
                          Dupilicate
                        </Button>
                        <Button onClick={() =>deleted(info)} destructive>Delete</Button>
                        <Button onClick={()=>clicking(info)} primary>Active</Button>
                      </Stack>,
                      "Premium Only"
                    ]
                  })}
                />
              </Card.Section>
            </Card>
          </Layout.Section>
          {openstate ? (
            <Layout.Section >
              <Card title="Content Configuration" sectioned>
              
               <div style={{width:"45%"}}>
               <TextField
                  label="Name"
                  value={name}
                  onChange={getDemo}
                  autoComplete="off"
                  
                />
               </div>
               <div style={{width:"20%"}}>
                <TextField
                  label="FreeShiping Goal"
                  value={goal}
                  type="number"
                  onChange={setGoal}
                  autoComplete="off"
                />
                </div>
                <div style={{width:"45%"}}>
                <TextField
                  label="initial Message"
                  value={shipbar}
                 
                  onChange={getDemo2}
                  autoComplete="off"
                />
                </div>
             

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
