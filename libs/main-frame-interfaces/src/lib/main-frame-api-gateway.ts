import {
  ChangeTranslationMessage,
  UserFocusedOnTranslationParams,
} from '@tl8/collaboration/interfaces';
import {
  ActiveTranslations,
  ActiveUsers,
  Collaboration,
  ConnectionStatus,
  CreateCollaborativeProjectParams,
  NavigationStateMessage,
  WorkInProgress,
} from '@tl8/api';
import { ConfirmParams, ModalParams } from '@tl8/extra-ui-interfaces';
import { Rectangle } from 'electron';
import { TargetApplicationConfig, WebAppOverwrittenTranslations } from 'tl8';

export interface MainFrameApiGateway {
  onSetNavigationState(
    cb: (navigationStateMessage: NavigationStateMessage) => void
  ): void;
  navigate(url: string): void;
  goBack(): void;
  refresh(): void;
  onMessageFromTarget(cb: (channel: string, ...args: any[]) => void): void;
  onFocusOnTranslation(cb: (key: string) => void): void;
  openModal<OutputType, InputType = unknown>(
    params: ModalParams<InputType>
  ): Promise<OutputType>;
  importWIP(
    config: TargetApplicationConfig
  ): Promise<WorkInProgress | 'cancel'>;
  postMessageToTarget(event: string, data: any): void;
  triggerResize(bounds: Rectangle): void;
  confirm(params: ConfirmParams): Promise<boolean>;
  changeTranslation(params: { key: string; lang: string; value: string }): void;
  revertTranslation(params: { key: string; lang: string }): void;
  revertAllTranslations(): void;
  onSetOverwrittenTranslations(
    cb: (overwrittenTranslations: WebAppOverwrittenTranslations) => void
  ): void;
  onCreateCollaborativeProject(
    cb: (params: CreateCollaborativeProjectParams) => void
  ): void;
  getUser(): Promise<{ name: string; userId: string } | null>;
  setUser(user: { name: string; id: string }): Promise<void>;
  openTargetView(): void;
  closeTargetView(): void;
  openHome(): void;
}

export interface CollaborationApiGateway {
  onSetConnectionStatus(cb: (connectionStatus: ConnectionStatus) => void): void;
  onSetActiveUsers(cb: (activeUsers: ActiveUsers) => void): void;
  onSetActiveTranslations(
    cb: (activeTranslations: ActiveTranslations) => void
  ): void;
  onSetCollaboration(cb: (collaboration: Collaboration) => void): void;
  onSetTranslation(cb: (change: ChangeTranslationMessage) => void): void;
  declareUserFocusedOnTranslation(params: UserFocusedOnTranslationParams): void;
  declareUserBlurredOfTranslation(params: UserFocusedOnTranslationParams): void;
}
