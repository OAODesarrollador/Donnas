import { list, put } from "@vercel/blob";
import { isAdminSessionValid } from "@/lib/adminAuth";

const IMAGE_EXTENSIONS = [".jpg", ".jpeg", ".png", ".webp", ".gif", ".avif"];

const sanitizeFileName = (fileName: string) =>
  fileName
    .toLowerCase()
    .replace(/[^a-z0-9.]+/g, "-")
    .replace(/^-+|-+$/g, "");

const isImagePathname = (pathname: string) =>
  IMAGE_EXTENSIONS.some((extension) => pathname.toLowerCase().endsWith(extension));

export async function GET() {
  if (!(await isAdminSessionValid())) {
    return Response.json({ error: "No autorizado." }, { status: 401 });
  }

  const result = await list({ limit: 100 });
  const images = result.blobs
    .filter((blob) => isImagePathname(blob.pathname))
    .map((blob) => ({
      url: blob.url,
      pathname: blob.pathname,
      size: blob.size,
      uploadedAt: blob.uploadedAt.toISOString(),
    }));

  return Response.json({ images });
}

export async function POST(request: Request) {
  if (!(await isAdminSessionValid())) {
    return Response.json({ error: "No autorizado." }, { status: 401 });
  }

  const formData = await request.formData();
  const file = formData.get("file");

  if (!(file instanceof File)) {
    return Response.json({ error: "Falta el archivo de imagen." }, { status: 400 });
  }

  if (!file.type.startsWith("image/")) {
    return Response.json({ error: "El archivo debe ser una imagen." }, { status: 400 });
  }

  const safeFileName = sanitizeFileName(file.name) || "product-image.jpg";
  const pathname = `products/${Date.now()}-${safeFileName}`;
  const blob = await put(pathname, file, {
    access: "public",
    contentType: file.type,
    addRandomSuffix: false,
  });

  return Response.json({
    image: {
      url: blob.url,
      pathname: blob.pathname,
      uploadedAt: new Date().toISOString(),
      size: file.size,
    },
  });
}
