import CustomFetch from "../config/db";

export type ColumnData = {
  type: string;
  primaryKey?: boolean;
  foreignKey?: string;
};

export type TableData = {
  columns: Record<string, ColumnData>;
};

export type DBSchema = Record<string, TableData>;

type DBSchemaResponse = {
  message: string;
  schema: DBSchema;
};

export const getDBSchema = async (): Promise<DBSchema> => {
  const response = await CustomFetch.get<DBSchemaResponse>("/db/schema");

  return response.data.schema;
};
