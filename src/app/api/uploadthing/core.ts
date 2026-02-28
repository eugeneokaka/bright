import { createUploadthing, type FileRouter } from "uploadthing/next";
import { UploadThingError } from "uploadthing/server";
import { auth } from "@clerk/nextjs/server";

const f = createUploadthing();

export const ourFileRouter = {
  propertyImageUploader: f({
    image: {
      maxFileSize: "8MB",
      maxFileCount: 5,
    },
  })
    .middleware(async ({ req }) => {
      const { userId } = await auth();

      if (!userId) throw new UploadThingError("Unauthorized");

      return { userId };
    })
    .onUploadComplete(async ({ metadata, file }) => {
      console.log("Upload complete for userId:", metadata.userId);
      console.log("file url", file.appUrl);

      return { uploadedBy: metadata.userId, url: file.appUrl };
    }),
} satisfies FileRouter;

export type OurFileRouter = typeof ourFileRouter;
