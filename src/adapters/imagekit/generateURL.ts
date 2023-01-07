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
    
    /* const fileDetailsResponse = await getImageKit().getFileDetails(cloudImageID); */ //More accurate but slower way to get the URL

    const url = getImageKit().url({
      path: path.posix.join(prefix, filename),
      urlEndpoint: urlEndpoint,
      /*transformation : [{
          "height" : "300",
          "width" : "400"
      }]*/
    });
    return decodeURIComponent(
      url
    );
  };
