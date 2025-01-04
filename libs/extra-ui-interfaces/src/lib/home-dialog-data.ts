import { Collaboration } from '@tl8/api';

export interface HomeDialogInput {
  currentHost: string;
  collaboration?: Collaboration;
}

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface HomeDialogOutput {}
