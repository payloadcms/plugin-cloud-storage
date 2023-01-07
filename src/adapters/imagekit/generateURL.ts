import ImageKit from "imagekit";
import path from "path";
import type { GenerateURL } from "../../types";

interface Args {
  getImageKit: () => ImageKit;
  urlEndpoint: string;
}

export const getGenerateURL =
  ({ getImageKit, urlEndpoint }: Args): GenerateURL =>
  async ({ filename, prefix = "", cloudImageID }) => {

    const fileDetailsResponse = await getImageKit().getFileDetails(cloudImageID);

    return decodeURIComponent(
      fileDetailsResponse.url
    );
  };
