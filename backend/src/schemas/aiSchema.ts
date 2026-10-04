import { z } from 'zod';
import { InfrastructureTypeEnum, SeverityLevelEnum } from './infrastructureSchema';
import { IssueTypeEnum } from './reportSchema';

export const analyzeReportRequestSchema = z.object({
  description: z.string().min(5, 'Description must be at least 5 characters').max(3000),
  infrastructureType: InfrastructureTypeEnum.optional(),
});

export const classifyIssueRequestSchema = z.object({
  description: z.string().min(5, 'Description must be at least 5 characters').max(3000),
});

export const summarizeReportRequestSchema = z.object({
  description: z.string().min(10, 'Description must be at least 10 characters').max(5000),
});

// Zod schemas for validating AI outputs
export const aiAnalysisOutputSchema = z.object({
  issueCategory: IssueTypeEnum.catch('OTHER'),
  severity: SeverityLevelEnum.catch('MEDIUM'),
  summary: z.string().min(3).max(500),
  confidence: z.number().min(0).max(1).catch(0.85),
});

export const aiClassificationOutputSchema = z.object({
  category: IssueTypeEnum.catch('OTHER'),
  severity: SeverityLevelEnum.catch('MEDIUM'),
  confidence: z.number().min(0).max(1).catch(0.85),
});

export const aiSummarizationOutputSchema = z.object({
  summary: z.string().min(3).max(500),
});

export type AnalyzeReportRequest = z.infer<typeof analyzeReportRequestSchema>;
export type ClassifyIssueRequest = z.infer<typeof classifyIssueRequestSchema>;
export type SummarizeReportRequest = z.infer<typeof summarizeReportRequestSchema>;
export type AIAnalysisOutput = z.infer<typeof aiAnalysisOutputSchema>;
export type AIClassificationOutput = z.infer<typeof aiClassificationOutputSchema>;
export type AISummarizationOutput = z.infer<typeof aiSummarizationOutputSchema>;
