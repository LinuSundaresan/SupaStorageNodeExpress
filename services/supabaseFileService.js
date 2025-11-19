import { createClient } from "@supabase/supabase-js";
import dotenv from "dotenv";
import fs from "fs";

dotenv.config();

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_ANON_KEY);
const bucket = process.env.SUPABASE_BUCKET;

export const uploadFile = async (localPath, originalName, mimeType) => {
  const buffer = fs.readFileSync(localPath);
  const fileName = Date.now() + "_" + originalName;

  const { data, error } = await supabase.storage.from(bucket).upload(fileName, buffer, { contentType: mimeType });

  fs.unlinkSync(localPath);

  if (error) throw error;

  return {
    fileName,
    path: data.path,
  };
};

export const getSignedUrl = async (fileName, expires = 60) => {
  const { data, error } = await supabase.storage.from(bucket).createSignedUrl(fileName, expires);

  if (error) throw error;

  return data.signedUrl;
};

export const deleteFile = async (fileName) => {
  const { data, error } = await supabase.storage.from(bucket).remove([fileName]);

  if (error) throw error;

  return true;
};
