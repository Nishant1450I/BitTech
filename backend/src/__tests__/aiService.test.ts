import { AIService } from '../services/aiService';

describe('AIService Resilience & Validation', () => {
  let aiService: AIService;

  beforeEach(() => {
    aiService = new AIService();
  });

  it('should analyze infrastructure report and return structured validated output', async () => {
    const result = await aiService.analyzeInfrastructureReport(
      'Streetlight is completely broken and dark for two weeks',
      'STREETLIGHT'
    );

    expect(result).toHaveProperty('issueCategory');
    expect(result).toHaveProperty('severity');
    expect(result).toHaveProperty('summary');
    expect(result).toHaveProperty('confidence');
    expect(typeof result.confidence).toBe('number');
    expect(['BROKEN', 'NOT_WORKING', 'OTHER', 'MISSING', 'UNSAFE']).toContain(result.issueCategory);
  });

  it('should classify high severity dangerous issues accurately', async () => {
    const result = await aiService.classifyInfrastructureIssue(
      'Sparks and live open wires dangling near pedestrian crosswalk - extreme danger'
    );

    expect(result.severity).toBe('CRITICAL');
    expect(result.category).toBe('UNSAFE');
    expect(result.confidence).toBeGreaterThan(0.7);
  });

  it('should summarize verbose citizen report concisely', async () => {
    const result = await aiService.summarizeInfrastructureReport(
      'I was walking near the main library at 9 PM and noticed that the entire sidewalk has collapsed into a 3-foot ditch due to water line rupture.'
    );

    expect(result).toHaveProperty('summary');
    expect(result.summary.length).toBeLessThan(150);
  });
});
