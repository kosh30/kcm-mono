import axios from "axios";

const upload = async (file: File): Promise<void> => {
  const presignedResponse = await axios.get(`/presigned?fileName=${file.name}`);

  const client = axios.create();
  await client.put((presignedResponse.data as { url: string }).url, file);
};

export default upload;
