import {
  CollaborationApiGateway,
  MainFrameApiGateway,
} from '@tl8/main-frame-interfaces';

declare const MAIN_FRAME_API: MainFrameApiGateway;
declare const COLLABORATION_API: CollaborationApiGateway | undefined;

export function MainFrameApi() {
  return MAIN_FRAME_API;
}

export function CollaborationApiGateway(): CollaborationApiGateway | undefined {
  try {
    return COLLABORATION_API;
  } catch (error) {
    return undefined;
  }
}

export function isCollaborationMode() {
  try {
    return !!COLLABORATION_API;
  } catch (error) {
    return false;
  }
}
