import type { TopicId } from '../domain/types';

export const TOPICS: { id: TopicId; label: string }[] = [
  { id: 'wisdom', label: 'Wisdom' },
  { id: 'discipline', label: 'Discipline' },
  { id: 'speech', label: 'Speech' },
  { id: 'relationships', label: 'Relationships' },
  { id: 'work', label: 'Work' },
  { id: 'money', label: 'Money' },
  { id: 'humility', label: 'Humility' },
  { id: 'integrity', label: 'Integrity' },
  { id: 'decisions', label: 'Decision-making' },
  { id: 'emotions', label: 'Emotions' },
  { id: 'faith', label: 'Trust in God' },
  { id: 'justice', label: 'Justice' },
];

export const topicLabel = (id: TopicId): string => TOPICS.find((t) => t.id === id)?.label ?? id;
