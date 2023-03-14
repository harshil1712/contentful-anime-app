import React, { useState } from 'react';
import { AssetCard, Button, Form, FormControl, MenuItem, TextInput } from '@contentful/f36-components';
import { FieldExtensionSDK } from '@contentful/app-sdk';
import { useSDK, useAutoResizer, useFieldValue, useCMA } from '@contentful/react-apps-toolkit';

interface Anime {
  name: string,
  description: string,
  image: string
}

const Field = () => {
  const sdk = useSDK<FieldExtensionSDK>();
  const cma = useCMA();
  useAutoResizer();
  const [search, setSearch] = useState<string>('')
  const [searchResult, setSearchResult] = useState<Anime | null>();
  const [value, setValue] = useFieldValue();
  const titleField = sdk.entry.fields.character;
  const descriptionField = sdk.entry.fields.description;
  const openDialog = async () => {
    const data = await sdk.dialogs.openCurrent({
      width: 500,
      parameters: {
        name: search
      },
      title: "Search Your Favourite Anime",
      shouldCloseOnEscapePress: true,
      shouldCloseOnOverlayClick: true
    })
    if(data) {
      setSearchResult(data)
      setValue({
        image: data.image
      })
      titleField.setValue(data.name)
      descriptionField.setValue(data.description)
    }
  }

  if(!value) {
    return (
      <>
        <Form onSubmit={() => openDialog()}>
          <FormControl>
            <TextInput type="text" onChange={e => setSearch(e.target.value)} isRequired/>
          </FormControl>
          <FormControl>
            <Button type="submit" variant='primary'>Search</Button>
          </FormControl>
        </Form>
      </>
    )
  }
    
  return (
    <>
    {
        searchResult && (
          <AssetCard
            type='image'
            title={searchResult.name}
            src={searchResult.image}
            actions={[
              <MenuItem 
                key="remove" 
                onClick={() => {
                  setValue(null)
                  titleField.setValue('')
                  descriptionField.setValue('')
                }}
              >
                Remove
              </MenuItem>
            ]}
          />          
        )
      }
    </>
  )
};

export default Field;
