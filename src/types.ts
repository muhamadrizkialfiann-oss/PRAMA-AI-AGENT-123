export type DivisionId = 'comercial' | 'hca' | 'fina' | 'lga' | 'spia';

export interface Division {
  id: DivisionId;
  name: string;
  fullName: string;
  shortDescription: string;
  description: string;
  iconName: string;
  accentColor: string; // Tailwind border/text override
  bgGradient: string;  // Tailwind gradient colors
  samplePrompts: string[];
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  isTablePresent?: boolean;
  attachment?: {
    name: string;
    mimeType: string;
    size?: string;
    data?: string;
  };
}

export interface CalculationRow {
  label: string;
  value: string;
  notes: string;
}

export interface CalculationTemplate {
  title: string;
  subtitle: string;
  divisionId: DivisionId;
  headers: string[];
  rows: CalculationRow[];
  totalFormula?: {
    rowLabel: string;
    colIndex: number;
    operation: 'sum' | 'percentage';
  };
}
