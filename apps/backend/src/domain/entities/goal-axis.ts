export interface GoalAxis {
  id: string;
  label: string;
}

export const STRATEGY_AXES: GoalAxis[] = [
  { id: 'positioning', label: 'Positioning' },
  { id: 'readiness', label: 'Readiness' },
  { id: 'opportunity-flow', label: 'Opportunity Flow' },
  { id: 'performance', label: 'Performance' },
];
