/* eslint-disable @typescript-eslint/no-explicit-any */

import { useEffect, useMemo, useState } from "react";

import {
  Background,
  Controls,
  Handle,
  MarkerType,
  Position,
  ReactFlow,
  type Edge,
  type Node,
} from "@xyflow/react";

import "@xyflow/react/dist/style.css";

import { Database, KeyRound, Link2, Loader2, Table2 } from "lucide-react";

import { getDBSchema, type ColumnData, type DBSchema } from "../types/dbSchema";

/* =========================================================
   TABLE NODE DATA
========================================================= */

type TableNodeData = {
  tableName: string;
  columns: Record<string, ColumnData>;
};

/* =========================================================
   CONSTANTS
========================================================= */

const TABLE_WIDTH = 360;
const COLUMN_HEIGHT = 43;
const HEADER_HEIGHT = 64;

const HORIZONTAL_GAP = 140;
const VERTICAL_GAP = 180;

const COLUMNS_PER_ROW = 3;

/* =========================================================
   TABLE NODE
========================================================= */

const TableNode = ({ data }: { data: TableNodeData }) => {
  const entries = Object.entries(data.columns);

  return (
    <div className="overflow-hidden rounded-xl border border-slate-300 bg-white shadow-xl">
      {/* =====================================================
          HEADER
      ===================================================== */}

      <div className="flex items-center gap-3 bg-slate-900 px-4 py-3 text-white">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-500">
          <Table2 size={16} />
        </div>

        <div>
          <p className="text-sm font-semibold">{data.tableName}</p>

          <p className="text-[10px] text-slate-400">{entries.length} columns</p>
        </div>
      </div>

      {/* =====================================================
          COLUMNS
      ===================================================== */}

      <div>
        {entries.map(([columnName, column]) => {
          const isPK = column.primaryKey;
          const isFK = column.foreignKey;

          return (
            <div
              key={columnName}
              className="relative flex h-[43px] items-center justify-between border-t border-slate-100 px-4"
            >
              {/* =================================================
                  TARGET HANDLE
              ================================================= */}

              <Handle
                type="target"
                position={Position.Left}
                id={`${columnName}-left`}
                className="!h-2 !w-2 !border-2 !border-white !bg-indigo-500"
              />

              {/* =================================================
                  SOURCE HANDLE
              ================================================= */}

              <Handle
                type="source"
                position={Position.Right}
                id={`${columnName}-right`}
                className="!h-2 !w-2 !border-2 !border-white !bg-indigo-500"
              />

              {/* =================================================
                  COLUMN NAME
              ================================================= */}

              <div className="flex min-w-0 items-center gap-2">
                {isPK ? (
                  <KeyRound size={13} className="shrink-0 text-amber-500" />
                ) : isFK ? (
                  <Link2 size={13} className="shrink-0 text-indigo-500" />
                ) : (
                  <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-slate-300" />
                )}

                <span className="truncate text-xs font-medium text-slate-700">
                  {columnName}
                </span>
              </div>

              {/* =================================================
                  COLUMN TYPE
              ================================================= */}

              <span className="ml-3 shrink-0 rounded bg-slate-100 px-1.5 py-0.5 font-mono text-[10px] text-slate-500">
                {column.type}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

/* =========================================================
   NODE TYPES
========================================================= */

const nodeTypes = {
  tableNode: TableNode,
};

/* =========================================================
   MAIN COMPONENT
========================================================= */

const Db = () => {
  /* =========================================================
     STATE
  ========================================================= */

  const [dbSchema, setDbSchema] = useState<DBSchema>({});

  const [loading, setLoading] = useState(true);

  const [error, setError] = useState("");

  /* =========================================================
     GET DATABASE SCHEMA
  ========================================================= */

  useEffect(() => {
    const fetchDBSchema = async () => {
      try {
        setLoading(true);

        setError("");

        const schema = await getDBSchema();

        setDbSchema(schema);
      } catch (error: any) {
        console.error("Gagal mengambil database schema:", error);

        const message =
          error?.response?.data?.error || "Gagal mengambil database schema";

        setError(message);
      } finally {
        setLoading(false);
      }
    };

    fetchDBSchema();
  }, []);

  /* =========================================================
     TABLES
  ========================================================= */

  const tables = useMemo(() => {
    return Object.entries(dbSchema);
  }, [dbSchema]);

  /* =========================================================
     FILTER
  ========================================================= */

  const filteredTables = useMemo(() => {
    return tables.filter(([tableName, table]) => {
      if (tableName.trim() !== "") {
        return true;
      }

      return Object.keys(table.columns).some((column) => column.trim() !== "");
    });
  }, [tables]);

  /* =========================================================
     TOTAL COLUMNS
  ========================================================= */

  const totalColumns = useMemo(() => {
    return tables.reduce(
      (total, [, table]) => total + Object.keys(table.columns).length,
      0,
    );
  }, [tables]);

  /* =========================================================
     TOTAL PRIMARY KEYS
  ========================================================= */

  const totalPrimaryKeys = useMemo(() => {
    return tables.reduce((total, [, table]) => {
      const primaryKeys = Object.values(table.columns).filter(
        (column) => column.primaryKey,
      );

      return total + primaryKeys.length;
    }, 0);
  }, [tables]);

  /* =========================================================
     RELATIONSHIPS
  ========================================================= */

  const relationships = useMemo(() => {
    return tables.flatMap(([tableName, table]) =>
      Object.entries(table.columns)
        .filter(([, column]) => Boolean(column.foreignKey))
        .map(([columnName, column]) => ({
          tableName,
          columnName,
          target: column.foreignKey,
        })),
    );
  }, [tables]);

  /* =========================================================
     REACT FLOW NODES
  ========================================================= */

  const nodes = useMemo<Node<TableNodeData>[]>(() => {
    /*
      Hitung tinggi masing-masing tabel.
    */

    const tableHeights = filteredTables.map(
      ([, table]) =>
        HEADER_HEIGHT + Object.keys(table.columns).length * COLUMN_HEIGHT,
    );

    /*
      Hitung tinggi maksimum setiap row.
    */

    const rowHeights: number[] = [];

    filteredTables.forEach((_, index) => {
      const rowIndex = Math.floor(index / COLUMNS_PER_ROW);

      const height = tableHeights[index];

      rowHeights[rowIndex] = Math.max(rowHeights[rowIndex] ?? 0, height);
    });

    /*
      Hitung posisi Y masing-masing row.
    */

    const rowPositions: number[] = [];

    rowHeights.forEach((_height, index) => {
      if (index === 0) {
        rowPositions[index] = 0;
        return;
      }

      rowPositions[index] =
        rowPositions[index - 1] + rowHeights[index - 1] + VERTICAL_GAP;
    });

    /*
      Generate nodes.
    */

    return filteredTables.map(([tableName, table], index) => {
      const rowIndex = Math.floor(index / COLUMNS_PER_ROW);

      const columnIndex = index % COLUMNS_PER_ROW;

      return {
        id: tableName,

        type: "tableNode",

        position: {
          x: columnIndex * (TABLE_WIDTH + HORIZONTAL_GAP),

          y: rowPositions[rowIndex],
        },

        data: {
          tableName,

          columns: table.columns as Record<string, ColumnData>,
        },

        style: {
          width: TABLE_WIDTH,
        },
      };
    });
  }, [filteredTables]);

  /* =========================================================
     REACT FLOW EDGES
  ========================================================= */

  const edges = useMemo<Edge[]>(() => {
    const visibleTables = new Set(
      filteredTables.map(([tableName]) => tableName),
    );

    return relationships
      .filter((relationship) => {
        if (!relationship.target) {
          return false;
        }

        const [targetTable] = relationship.target.split(".");

        return (
          visibleTables.has(relationship.tableName) &&
          visibleTables.has(targetTable)
        );
      })
      .map((relationship) => {
        const [targetTable, targetColumn] = relationship.target!.split(".");

        return {
          id: [
            relationship.tableName,
            relationship.columnName,
            targetTable,
            targetColumn,
          ].join("-"),

          source: relationship.tableName,

          target: targetTable,

          sourceHandle: `${relationship.columnName}-right`,

          targetHandle: `${targetColumn}-left`,

          type: "smoothstep",

          animated: true,

          markerEnd: {
            type: MarkerType.ArrowClosed,
            width: 18,
            height: 18,
          },

          style: {
            stroke: "#6366f1",
            strokeWidth: 2,
          },
        };
      });
  }, [filteredTables, relationships]);

  /* =========================================================
     LOADING
  ========================================================= */

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="flex items-center gap-3 text-slate-500">
          <Loader2 size={20} className="animate-spin" />

          <span className="text-sm">Memuat database schema...</span>
        </div>
      </div>
    );
  }

  /* =========================================================
     ERROR
  ========================================================= */

  if (error) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="rounded-xl border border-red-200 bg-red-50 px-6 py-4 text-sm text-red-600">
          {error}
        </div>
      </div>
    );
  }

  /* =========================================================
     MAIN UI
  ========================================================= */

  return (
    <div className="flex min-h-screen flex-col gap-6">
      {/* =====================================================
          HEADER
      ===================================================== */}

      <div className="rounded-2xl bg-slate-100 p-6">
        <div className="mb-8">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-linear-to-r from-indigo-600 to-indigo-500 text-white shadow-lg shadow-indigo-500/25">
              <Database size={24} />
            </div>

            <div>
              <h1 className="text-2xl font-bold text-slate-900">Database</h1>

              <p className="text-sm text-slate-500">
                Database schema and table relationships
              </p>
            </div>
          </div>
        </div>

        {/* =================================================
            STATISTICS
        ================================================= */}

        <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
          <StatCard
            icon={<Table2 size={18} />}
            label="Tables"
            value={tables.length}
          />

          <StatCard
            icon={<Database size={18} />}
            label="Columns"
            value={totalColumns}
          />

          <StatCard
            icon={<KeyRound size={18} />}
            label="Primary Keys"
            value={totalPrimaryKeys}
          />

          <StatCard
            icon={<Link2 size={18} />}
            label="Relationships"
            value={relationships.length}
          />
        </div>
      </div>

      {/* =====================================================
          ERD
      ===================================================== */}

      <div className="rounded-2xl bg-slate-100 p-6">
        <div className="mb-4">
          <h2 className="text-lg font-bold text-slate-900">
            Entity Relationship Diagram
          </h2>

          <p className="text-sm text-slate-500">
            Drag table untuk mengatur posisi dan gunakan scroll untuk zoom.
          </p>
        </div>

        <div className="h-[700px] overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
          <ReactFlow
            nodes={nodes}
            edges={edges}
            nodeTypes={nodeTypes}
            fitView
            fitViewOptions={{
              padding: 0.2,
              minZoom: 0.3,
              maxZoom: 1,
            }}
            nodesDraggable
            nodesConnectable={false}
            elementsSelectable
            minZoom={0.2}
            maxZoom={1.5}
            proOptions={{
              hideAttribution: true,
            }}
          >
            <Background gap={20} size={1} />

            <Controls />
          </ReactFlow>
        </div>
      </div>
    </div>
  );
};

/* =========================================================
   STAT CARD
========================================================= */

const StatCard = ({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: number;
}) => {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="mb-3 flex items-center gap-2 text-slate-500">
        {icon}

        <span className="text-sm">{label}</span>
      </div>

      <p className="text-2xl font-bold text-indigo-500">{value}</p>
    </div>
  );
};

export default Db;
