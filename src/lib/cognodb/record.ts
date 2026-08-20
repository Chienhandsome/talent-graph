import neo4j from "neo4j-driver";

export interface RecordLike {
  get(key: string): unknown;
}

export interface EntityLike {
  properties: Record<string, unknown>;
}

export function readString(value: unknown, field: string): string {
  if (typeof value !== "string") {
    throw new TypeError(`Expected ${field} to be a string.`);
  }
  return value;
}

export function readOptionalString(
  value: unknown,
  field: string,
): string | undefined {
  if (value === null || value === undefined) {
    return undefined;
  }
  return readString(value, field);
}

export function readBoolean(value: unknown, field: string): boolean {
  if (typeof value !== "boolean") {
    throw new TypeError(`Expected ${field} to be a boolean.`);
  }
  return value;
}

export function readNumber(value: unknown, field: string): number {
  if (typeof value === "number" && Number.isFinite(value)) {
    return value;
  }
  if (neo4j.isInt(value)) {
    return value.toNumber();
  }
  throw new TypeError(`Expected ${field} to be a number.`);
}

export function readEntity(value: unknown, field: string): EntityLike {
  if (
    typeof value !== "object" ||
    value === null ||
    !("properties" in value) ||
    typeof value.properties !== "object" ||
    value.properties === null
  ) {
    throw new TypeError(`Expected ${field} to be a graph entity.`);
  }
  return value as EntityLike;
}

export function readEntityArray(value: unknown, field: string): EntityLike[] {
  if (!Array.isArray(value)) {
    throw new TypeError(`Expected ${field} to be an array.`);
  }
  return value.map((entity, index) =>
    readEntity(entity, `${field}.${index}`),
  );
}
