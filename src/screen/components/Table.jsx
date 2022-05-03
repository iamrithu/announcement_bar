import React from 'react'

import { Page, DataTable, Layout, Card } from '@shopify/polaris'
import {useState,useEffect} from 'react'



export const Table = () => {
 const [shop_details,get_shop_details]=useState();






 const getShopDetails=async()=>{
    const details = await fetch('/shop');
    get_shop_details(details);
 }



useEffect(getShopDetails,[])


    return (
        <Page>
            <Layout fullWidth>
                <Card>
                    <Layout.Section fullWidth>
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
                        
                        />
                    </Layout.Section>
                </Card>
            </Layout>

        </Page>
    )
}



