import React, { useEffect, useState } from 'react';
import { EntityList, Paragraph, Spinner, Stack } from '@contentful/f36-components';
import { DialogExtensionSDK } from '@contentful/app-sdk';
import { /* useCMA, */ useAutoResizer, useSDK } from '@contentful/react-apps-toolkit';

export interface Anime {
  name: {
    full: string
  },
  image: {
    medium: string
  },
  description: string
}

const Dialog = () => {
  const sdk = useSDK<DialogExtensionSDK>();
  useAutoResizer();
  const [data, setData] = useState<Anime | undefined>()

  useEffect(() => {
    // @ts-expect-error
    fetchData(sdk.parameters.invocation.name)
  }, [sdk.parameters.invocation])

  const fetchData = async(search: string) => {
    console.log(search)
    const query = `
      query($char:String!) {
        Character(search: $char) {
          name {
            full
          }
          description
          image {
            medium
          }
        }
      }
    `;

    const options = {
      method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
        },
        body: JSON.stringify({
            query: query,
            variables: {
              char: search
            }
        })
    }
    const response = await fetch('https://graphql.anilist.co', options)
    const {data} = await response.json();
    setData(data.Character);
  }

  if(!data) {
    return <Spinner size='large'/>
  }
  return (
    <Stack fullWidth>
      <EntityList style={{
        width: '100%'
      }}>
        <EntityList.Item
          title={data.name.full}
          thumbnailUrl={data.image.medium}
          onClick={()=> sdk.close({
            name: data.name.full,
            image: data.image.medium,
            description: data.description
          })}
        />
      </EntityList>
    </Stack>
  )
};

export default Dialog;
