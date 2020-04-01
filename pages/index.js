import React, { useState } from "react";
import { EmptyState, Layout, Page } from '@shopify/polaris';
import { ResourcePicker, TitleBar } from "@shopify/app-bridge-react";
import store from "store-js";
import ProductList from "../components/ProductList";
import axios from "axios";

function Index() {

    const [modal, setModal] = useState({ open: false });
    const emptyState = !store.get('ids');

    const makeApiCall = async (product) => {
        const url = '/api/products';
        axios.post(url, product).then(result => {
            console.log("Posted result ", result);
        }).catch(error => {
            console.error(error);
        });
    };

    const deleteApiData = async () => {
        const url = '/api/products';
        axios.delete(url).then((result) => {
            console.log("All items deleted ", result);
        });
    };

    const handleSelection = async (resources) => {
        const idsFromResources = resources.selection.map(({ id }) => id);
        setModal({ open: false });
        store.set('ids', idsFromResources);
        console.log('product ids are ', store.get('ids'));
        await deleteApiData();
        resources.selection.map(product => makeApiCall(product));
    };

    const handleOpenModal = () => {
        setModal({ open: true });
    };

    return (
        <Page>
            <TitleBar primaryAction={{
                content: "Select New Products",
                onAction: handleOpenModal
            }} />
            <ResourcePicker
                resourceType="Product"
                showVariants={false}
                open={modal.open}
                onCancel={() => setModal({ open: false })}
                onSelection={(resources) => handleSelection(resources)}
            />

                {
                    emptyState ? (
                        <Layout>
                            <EmptyState
                                image="https://cdn.shopify.com/s/files/1/0757/9955/files/empty-state.svg"
                                heading="Manage your inventory transfers"
                                action={{
                                    content: 'Add transfer',
                                    onAction: () => setModal({ open: true }),
                                }}
                            >
                                <p>Select products</p>
                            </EmptyState>
                        </Layout>
                    ) : (
                        <ProductList/>
                    )
                }
        </Page>
    );
}

export default Index;