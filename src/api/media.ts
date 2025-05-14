import { supabase } from './supabase';
import { v4 as uuidv4 } from 'uuid';

type UploadOptions = {
  userId: string;
  fileName?: string;
  folder?: string;
  metadata?: Record<string, any>;
};

/**
 * Uploads a file to Supabase Storage
 */
export const uploadFile = async (file: File, options: UploadOptions) => {
  const { userId, fileName = file.name, folder = 'uploads', metadata = {} } = options;

  // Generate a unique file path to prevent overwrites
  const fileExt = fileName.split('.').pop();
  const filePath = `${folder}/${uuidv4()}.${fileExt}`;

  // Upload file to Storage
  const { error: fileError } = await supabase.storage
    .from('media')
    .upload(filePath, file, {
      cacheControl: '3600',
      upsert: false,
    });

  if (fileError) {
    throw new Error(`Error uploading file: ${fileError.message}`);
  }

  // Get the public URL
  const { data: urlData } = supabase.storage.from('media').getPublicUrl(filePath);
  const publicUrl = urlData.publicUrl;

  // Create a record in the media table
  const { data: mediaData, error: mediaError } = await supabase.from('media').insert({
    name: fileName,
    file_path: filePath,
    mime_type: file.type,
    size: file.size,
    user_id: userId,
    metadata,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  }).select().single();

  if (mediaError) {
    throw new Error(`Error creating media record: ${mediaError.message}`);
  }

  return {
    ...mediaData,
    publicUrl,
  };
};

/**
 * Gets a list of media files
 */
export const getMediaList = async (options?: {
  userId?: string;
  limit?: number;
  offset?: number;
  orderBy?: string;
  order?: 'asc' | 'desc';
}) => {
  let query = supabase.from('media').select('*');

  // Filter by user if provided
  if (options?.userId) {
    query = query.eq('user_id', options.userId);
  }

  // Apply pagination if provided
  if (options?.limit) {
    query = query.limit(options.limit);
  }

  if (options?.offset) {
    query = query.range(
      options.offset,
      options.offset + (options.limit || 10) - 1
    );
  }

  // Apply ordering if provided
  if (options?.orderBy) {
    query = query.order(options.orderBy, {
      ascending: options.order === 'asc',
    });
  } else {
    // Default ordering
    query = query.order('created_at', { ascending: false });
  }

  const { data, error } = await query;

  if (error) {
    throw new Error(`Error fetching media: ${error.message}`);
  }

  // Add public URLs to all media items
  return data.map(item => {
    const { data: urlData } = supabase.storage
      .from('media')
      .getPublicUrl(item.file_path);
    
    return {
      ...item,
      publicUrl: urlData.publicUrl,
    };
  });
};

/**
 * Deletes a media file and its record
 */
export const deleteMedia = async (id: string) => {
  // First get the file path
  const { data: media, error: getError } = await supabase
    .from('media')
    .select('file_path')
    .eq('id', id)
    .single();

  if (getError) {
    throw new Error(`Error finding media record: ${getError.message}`);
  }

  // Delete the file from storage
  const { error: storageError } = await supabase.storage
    .from('media')
    .remove([media.file_path]);

  if (storageError) {
    throw new Error(`Error deleting file from storage: ${storageError.message}`);
  }

  // Delete the record from the database
  const { error: dbError } = await supabase
    .from('media')
    .delete()
    .eq('id', id);

  if (dbError) {
    throw new Error(`Error deleting media record: ${dbError.message}`);
  }

  return true;
};
