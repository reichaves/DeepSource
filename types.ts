import { SimulationNodeDatum, SimulationLinkDatum } from 'd3';

export enum EntityType {
  PERSON = 'PERSON',
  ORGANIZATION = 'ORGANIZATION',
  LOCATION = 'LOCATION',
  DATE = 'DATE',
  EVENT = 'EVENT'
}

export type EntityFilterState = Record<EntityType, boolean>;

export interface Entity {
  id: string; // Unique ID (usually the normalized name)
  name: string;
  type: EntityType;
  sourceDocIds: string[]; // IDs of documents where this entity appears
  context?: string; // Brief snippet of context
  normalizedDate?: string; // Specific for DATE type
}

export interface CaseFile {
  id: string;
  name: string;
  type: string;
  content: string | ArrayBuffer | null; // Text content or Base64 for images/PDFs
  base64?: string;
  mimeType: string;
  uploadDate: number;
  status: 'pending' | 'analyzing' | 'analyzed' | 'error';
}

export interface AnalysisResult {
  entities: Array<{
    name: string;
    type: EntityType;
    context: string;
    normalizedDate?: string; // Specific for DATE type
  }>;
  summary: string;
}

export interface GraphNode extends SimulationNodeDatum {
  id: string;
  type: 'DOCUMENT' | EntityType;
  name: string;
  group: number;
  val: number; // Size
  context?: string; // Added for details panel
  sourceDocIds?: string[]; // Added for details panel
  x?: number;
  y?: number;
  fx?: number | null;
  fy?: number | null;
}

export interface GraphLink extends SimulationLinkDatum<GraphNode> {
  source: string | GraphNode;
  target: string | GraphNode;
  value: number;
}