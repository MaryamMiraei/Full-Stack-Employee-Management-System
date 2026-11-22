import { NextResponse } from "next/server";

const avatarDisabledResponse = () =>
  NextResponse.json(
    { message: "Avatar feature is disabled in the demo version." },
    {
      status: 410,
      headers: {
        "Cache-Control": "no-store",
      },
    },
  );

export const GET = avatarDisabledResponse;
export const POST = avatarDisabledResponse;

// import { NextResponse } from "next/server";
// import { randomUUID } from "node:crypto";
// import { fileTypeFromBuffer } from "file-type";

// import { serverApi } from "@/lib/api/serverApi";
// import { getCurrentUser } from "@/lib/auth/auth";

// import {
//   saveAvatarFile,
//   getAvatarFile,
//   deleteAvatarFile,
// } from "@/lib/avatar/avatarStorage";

// // حداکثر حجم مجاز: 2MB
// const MAX_FILE_SIZE = 2 * 1024 * 1024;

// // فرمت‌های مجاز
// const allowedTypes: Record<string, string> = {
//   "image/jpeg": "jpg",
//   "image/png": "png",
//   "image/webp": "webp",
// };

// const mimeTypes: Record<string, string> = {
//   jpg: "image/jpeg",
//   png: "image/png",
//   webp: "image/webp",
// };

// // ======================================
// // POST: Upload Avatar
// // ======================================

// export const POST = async (request: Request) => {
//   let newFileName: string | null = null;

//   try {
//     // 1. احراز هویت
//     const currentUser = await getCurrentUser();

//     if (!currentUser) {
//       return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
//     }

//     // 2. دریافت فایل
//     const formData = await request.formData();
//     const file = formData.get("avatar");

//     if (!(file instanceof File)) {
//       return NextResponse.json(
//         { message: "Please select an image." },
//         { status: 400 },
//       );
//     }

//     // 3. بررسی حجم فایل
//     if (file.size === 0 || file.size > MAX_FILE_SIZE) {
//       return NextResponse.json(
//         { message: "Image must be smaller than 2MB." },
//         { status: 400 },
//       );
//     }

//     // 4. خواندن محتوای فایل
//     const buffer = Buffer.from(await file.arrayBuffer());

//     // 5. بررسی فرمت واقعی تصویر
//     const fileType = await fileTypeFromBuffer(buffer);

//     if (!fileType || !Object.hasOwn(allowedTypes, fileType.mime)) {
//       return NextResponse.json(
//         {
//           message: "Only JPG, PNG and WEBP images are allowed.",
//         },
//         { status: 400 },
//       );
//     }

//     const extension = allowedTypes[fileType.mime];

//     // 6. دریافت اطلاعات حساب کاربر
//     const userResponse = await serverApi.get(`/users/${currentUser.userId}`);

//     const oldFileName: string | null = userResponse.data.avatarFileName ?? null;

//     // 7. تولید نام تصادفی برای فایل
//     newFileName = `${randomUUID()}.${extension}`;

//     // 8. ذخیره تصویر روی دیسک
//     await saveAvatarFile(newFileName, buffer);

//     // 9. ساخت URL جدید تصویر
//     const profileImage = `/api/profile/avatar?v=${Date.now()}`;

//     // 10. به‌روزرسانی اطلاعات کاربر در JSON Server
//     try {
//       await serverApi.patch(`/users/${currentUser.userId}`, {
//         avatarFileName: newFileName,
//         profileImage,
//       });
//     } catch (error) {
//       // اگر ذخیره اطلاعات شکست خورد، فایل جدید حذف شود
//       try {
//         await deleteAvatarFile(newFileName);
//       } catch (deleteError) {
//         console.error("New avatar cleanup error:", deleteError);
//       }

//       newFileName = null;
//       throw error;
//     }

//     // 11. حذف تصویر قبلی پس از موفقیت ذخیره تصویر جدید
//     if (oldFileName && oldFileName !== newFileName) {
//       try {
//         await deleteAvatarFile(oldFileName);
//       } catch (error) {
//         console.error("Old avatar deletion error:", error);
//       }
//     }

//     // 12. پاسخ موفق
//     return NextResponse.json(
//       {
//         message: "Avatar uploaded successfully.",
//         profileImage,
//       },
//       { status: 200 },
//     );
//   } catch (error) {
//     // پاک‌سازی فایل جدید در صورت شکست عملیات
//     if (newFileName) {
//       try {
//         await deleteAvatarFile(newFileName);
//       } catch (deleteError) {
//         console.error("Avatar cleanup error:", deleteError);
//       }
//     }

//     console.error("Avatar upload error:", error);

//     return NextResponse.json(
//       { message: "Failed to upload profile image." },
//       { status: 500 },
//     );
//   }
// };

// // ======================================
// // GET: Display Avatar
// // ======================================

// export const GET = async () => {
//   try {
//     // 1. احراز هویت
//     const currentUser = await getCurrentUser();

//     if (!currentUser) {
//       return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
//     }

//     // 2. دریافت اطلاعات کاربر
//     const userResponse = await serverApi.get(`/users/${currentUser.userId}`);

//     const fileName: string | null = userResponse.data.avatarFileName ?? null;

//     if (!fileName) {
//       return NextResponse.json(
//         { message: "Avatar not found." },
//         { status: 404 },
//       );
//     }

//     // 3. اعتبارسنجی نام فایل
//     const isValidFileName = /^[a-f0-9-]{36}\.(jpg|png|webp)$/i.test(fileName);

//     if (!isValidFileName) {
//       return NextResponse.json(
//         { message: "Invalid avatar file." },
//         { status: 400 },
//       );
//     }

//     // 4. خواندن تصویر از پوشه خصوصی
//     const buffer = await getAvatarFile(fileName);

//     // 5. تعیین MIME Type
//     const extension = fileName.split(".").pop()!;
//     const contentType = mimeTypes[extension];

//     if (!contentType) {
//       return NextResponse.json(
//         { message: "Unsupported image format." },
//         { status: 400 },
//       );
//     }

//     // 6. ارسال تصویر به مرورگر
//     return new Response(new Uint8Array(buffer), {
//       status: 200,
//       headers: {
//         "Content-Type": contentType,
//         "Content-Length": String(buffer.length),
//         "Cache-Control": "private, no-store",
//         "X-Content-Type-Options": "nosniff",
//       },
//     });
//   } catch (error) {
//     if ((error as NodeJS.ErrnoException).code === "ENOENT") {
//       return NextResponse.json(
//         { message: "Avatar file not found." },
//         { status: 404 },
//       );
//     }

//     console.error("Get avatar error:", error);

//     return NextResponse.json(
//       { message: "Failed to load profile image." },
//       { status: 500 },
//     );
//   }
// };
