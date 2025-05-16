import { supabase } from './supabase';
import type { PostgrestFilterBuilder } from '@supabase/postgrest-js';
import type { Database } from '../types/supabase';

// Define the valid table names for type checking
type TableName = keyof Database['public']['Tables'];

/**
 * Generic function to get all items from a specific collection
 */
export const getAll = async <T>(
  table: TableName,
  options?: {
    limit?: number;
    offset?: number;
    orderBy?: { column: string; ascending?: boolean };
    filters?: Record<string, any>;
  }
): Promise<T[]> => {
  let query = supabase.from(table).select('*') as PostgrestFilterBuilder<any, any, any[]>;

  // Apply filters if provided
  if (options?.filters) {
    Object.entries(options.filters).forEach(([key, value]) => {
      query = query.eq(key, value);
    });
  }

  // Apply pagination if provided
  if (options?.limit) {
    query = query.limit(options.limit);
  }

  if (options?.offset) {
    query = query.range(options.offset, options.offset + (options.limit || 10) - 1);
  }

  // Apply ordering if provided
  if (options?.orderBy) {
    query = query.order(options.orderBy.column, {
      ascending: options.orderBy.ascending ?? true,
    });
  }

  const { data, error } = await query;

  if (error) {
    throw new Error(`Error fetching ${table}: ${error.message}`);
  }

  return data as unknown as T[];
};

/**
 * Generic function to get a single item from a collection by id
 */
export const getOne = async <T>(
  table: TableName,
  id: string
): Promise<T> => {
  const { data, error } = await supabase.from(table).select('*').eq('id', id).single();

  if (error) {
    throw new Error(`Error fetching ${table} with id ${id}: ${error.message}`);
  }

  return data as unknown as T;
};

/**
 * Generic function to create a new item in a collection
 */
export const create = async <T>(
  table: TableName,
  item: Record<string, any>
): Promise<T> => {
  const { data, error } = await supabase.from(table).insert(item).select().single();

  if (error) {
    throw new Error(`Error creating item in ${table}: ${error.message}`);
  }

  return data as unknown as T;
};

/**
 * Generic function to update an item in a collection
 */
export const update = async <T>(
  table: TableName,
  id: string,
  updates: Record<string, any>
): Promise<T> => {
  const { data, error } = await supabase
    .from(table)
    .update(updates)
    .eq('id', id)
    .select()
    .single();

  if (error) {
    throw new Error(`Error updating item in ${table}: ${error.message}`);
  }

  return data as unknown as T;
};

/**
 * Generic function to delete an item from a collection
 */
export const remove = async (
  table: TableName,
  id: string
): Promise<void> => {
  const { error } = await supabase.from(table).delete().eq('id', id);

  if (error) {
    throw new Error(`Error deleting item from ${table}: ${error.message}`);
  }
};

/**
 * Function to search items in a collection
 */
export const search = async <T>(
  table: TableName,
  query: string,
  searchColumns: string[],
  options?: {
    limit?: number;
    offset?: number;
  }
): Promise<T[]> => {
  let queryBuilder = supabase.from(table).select('*');

  // Build OR conditions for each column
  const orConditions = searchColumns.map(column => `${column}.ilike.%${query}%`);
  
  // Apply OR conditions
  queryBuilder = orConditions.reduce((acc, condition) => {
    return acc.or(condition);
  }, queryBuilder);

  // Apply pagination if provided
  if (options?.limit) {
    queryBuilder = queryBuilder.limit(options.limit);
  }

  if (options?.offset) {
    queryBuilder = queryBuilder.range(
      options.offset,
      options.offset + (options.limit || 10) - 1
    );
  }

  const { data, error } = await queryBuilder;

  if (error) {
    throw new Error(`Error searching ${table}: ${error.message}`);
  }

  return data as unknown as T[];
};
