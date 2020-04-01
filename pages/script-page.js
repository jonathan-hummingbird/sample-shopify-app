import React from "react";
import gql from "graphql-tag";
import { useQuery, useMutation } from "@apollo/react-hooks";
import { Button, Card, Layout, Page, ResourceList, Stack } from "@shopify/polaris";

const CREATE_SCRIPT_TAG = gql`
    mutation scriptTagCreate($input : ScriptTagInput!) {
        scriptTagCreate(input: $input) {
            scriptTag {
                id
            }
            userErrors {
                field
                message
            }
        }
    }
`;

const QUERY_SCRIPT_TAGS = gql`
    query queryScriptTags {
        scriptTags(first: 5) {
            edges {
                node {
                    id
                    src
                    displayScope
                }
            }
        }
    }
`;

const DELETE_SCRIPT_TAGS = gql`
    mutation scriptTagDelete($id: ID!) {
        scriptTagDelete(id: $id) {
            deletedScriptTagId
            userErrors {
                field
                message
            }
        }
    }
`;

const ScriptPage = () => {

    const [createScripts] = useMutation(CREATE_SCRIPT_TAG);
    const [deleteScripts] = useMutation(DELETE_SCRIPT_TAGS);
    const { loading, error, data } = useQuery(QUERY_SCRIPT_TAGS);

    const handleCreateButtonClick = () => {
        createScripts({
            variables: {
                input: {
                    src: "https://f7fc29ad.ngrok.io/test-script.js",
                    displayScope: "ALL"
                }
            },
            refetchQueries: [{ query: QUERY_SCRIPT_TAGS }]
        }).then(data => {
            console.log("Create button after ", data);
        });
    };

    const handleDeleteButtonClick = (id) => {
        deleteScripts({
            variables: { id },
            refetchQueries: [{ query: QUERY_SCRIPT_TAGS }]
        }).then(data => {
            console.log(`Delete ID ${id} button after `, data);
        });
    };

    if (loading) return <div>Loading ...</div>;
    if (error) return <div>Error!!! {error.message}</div>

    return (
        <Page>
            <Layout>
                <Layout.Section>
                    <Card title="These are the script tags right now" sectioned>
                        <p>Create / Delete a Script Tag</p>
                    </Card>
                </Layout.Section>
                <Layout.Section secondary>
                    <Card title="Create a Script Tag" sectioned>
                        <Button
                            size="slim"
                            onClick={handleCreateButtonClick}
                        >
                            Create Script Tag
                        </Button>
                    </Card>
                </Layout.Section>
                <Layout.Section>
                    <Card>
                        <ResourceList
                            showHeader
                            resourceName={{ singular: "Script", plural: "Scripts" }}
                            items={data.scriptTags.edges}
                            renderItem={item => (
                                <ResourceList.Item
                                    id={item.node.id}
                                >
                                    <Stack>
                                        <Stack.Item>
                                            <p>
                                                {item.node.id}
                                            </p>
                                        </Stack.Item>
                                        <Stack.Item>
                                            <Button
                                                onClick={() => handleDeleteButtonClick(item.node.id)}
                                            >
                                                Delete Script Tag
                                            </Button>
                                        </Stack.Item>
                                    </Stack>
                                </ResourceList.Item>
                            )}
                        />
                    </Card>
                </Layout.Section>
            </Layout>
        </Page>
    );
};

export default ScriptPage;