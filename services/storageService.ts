import { IEvent, EventStatus, EventType, EventPriority, EventScope, UserSettings } from '../types';

const STORAGE_KEY = 'imb_events_v1';
const SETTINGS_KEY = 'imb_settings_v1';

// Seed data for first run
const SEED_DATA: IEvent[] = [
  {
    id: '1',
    title: 'Review Quarterly Investments',
    type: EventType.LEARNING,
    scope: EventScope.DAY,
    priority: EventPriority.HIGH,
    status: EventStatus.TODO,
    date: new Date().toISOString().split('T')[0],
    time: '10:00',
    description: '# Investment Notes\n- Check S&P 500 trends\n- Rebalance portfolio',
    createdAt: Date.now()
  },
  {
    id: '2',
    title: 'Morning Reading: Atomic Habits',
    type: EventType.ROUTINE,
    scope: EventScope.DAY,
    priority: EventPriority.MEDIUM,
    status: EventStatus.DONE,
    date: new Date().toISOString().split('T')[0],
    description: 'Read 20 pages.',
    createdAt: Date.now() - 10000
  },
  {
    id: '3',
    title: 'Team Sync',
    type: EventType.REMINDER,
    scope: EventScope.DAY,
    priority: EventPriority.LOW,
    status: EventStatus.TODO,
    date: new Date().toISOString().split('T')[0],
    time: '14:30',
    createdAt: Date.now() - 20000
  }
];

const DEFAULT_SETTINGS: UserSettings = {
  enabledScopes: [EventScope.DAY, EventScope.WEEK, EventScope.MONTH, EventScope.YEAR, EventScope.IDEA]
};

export const getEvents = (): IEvent[] => {
  const stored = localStorage.getItem(STORAGE_KEY);
  if (!stored) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(SEED_DATA));
    return SEED_DATA;
  }
  return JSON.parse(stored);
};

export const saveEvent = (event: IEvent): void => {
  const events = getEvents();
  const existingIndex = events.findIndex(e => e.id === event.id);
  
  if (existingIndex >= 0) {
    events[existingIndex] = event;
  } else {
    events.push(event);
  }
  
  localStorage.setItem(STORAGE_KEY, JSON.stringify(events));
};

export const deleteEvent = (id: string): void => {
  const events = getEvents().filter(e => e.id !== id);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(events));
};

export const toggleEventStatus = (id: string): IEvent | undefined => {
  const events = getEvents();
  const event = events.find(e => e.id === id);
  
  if (event) {
    event.status = event.status === EventStatus.DONE ? EventStatus.TODO : EventStatus.DONE;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(events));
    return event;
  }
  return undefined;
};

export const getSettings = (): UserSettings => {
  const stored = localStorage.getItem(SETTINGS_KEY);
  if (!stored) {
    return DEFAULT_SETTINGS;
  }
  return JSON.parse(stored);
};

export const saveSettings = (settings: UserSettings): void => {
  localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
};