interface Attributes {
  trait_type?: string;
  value?: string;
}

interface Properties {
  files?: AttachedFile[];
  category: string;
}

interface AttachedFile {
  uri?: string;
  type?: string;
  cdn?: boolean;
}

interface MetaData {
  name: string;
  description: string;
  image: string;
  animation_uri?: string;
  external_uri?: string;
  attributes: Attributes[];
  properties?: Properties;
}

export const createMetaData = (imageUri: string): MetaData => {
  const metaData: MetaData = {
    name: "DAIZU",
    description: "xxxxxxxxxx",
    image: imageUri,
    attributes: [{ trait_type: "traia1", value: "value1" }],
    properties: {
      category: "harigami",
    },
  };

  return metaData;
};
