/**
 * Helper to upload files directly to Supabase Storage using the standard REST API.
 * This runs entirely on the server side using the secure service role key.
 */

const supabaseUrl = process.env.SUPABASE_URL;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const bucketName = process.env.SUPABASE_BUCKET || "band-covers";

export async function uploadToSupabase(file: File): Promise<string> {
  if (!supabaseUrl || !serviceRoleKey) {
    throw new Error("Missing Supabase configuration in environment variables.");
  }

  // Validate that it is an image
  if (!file.type.startsWith("image/")) {
    throw new Error("El archivo seleccionado no es una imagen válida.");
  }

  // Validate file size (max 5MB)
  const maxSize = 5 * 1024 * 1024;
  if (file.size > maxSize) {
    throw new Error("La imagen supera el tamaño máximo permitido de 5MB.");
  }

  // Generate a unique filename using timestamp and a random string
  const fileExtension = file.name.split(".").pop() || "jpg";
  const uniqueId = Math.random().toString(36).substring(2, 8);
  const fileName = `${Date.now()}-${uniqueId}.${fileExtension}`;

  const uploadUrl = `${supabaseUrl}/storage/v1/object/${bucketName}/${fileName}`;

  // Convert File to ArrayBuffer and then to Buffer for the fetch body
  const arrayBuffer = await file.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);

  const response = await fetch(uploadUrl, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${serviceRoleKey}`,
      "Content-Type": file.type || "application/octet-stream",
      // Bypass any cache/duplicate conflicts
      "x-upsert": "true",
    },
    body: buffer,
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(
      `Error al subir la imagen a Supabase Storage: ${errorData.message || response.statusText}`
    );
  }

  // Return the public URL for the uploaded file
  return `${supabaseUrl}/storage/v1/object/public/${bucketName}/${fileName}`;
}
