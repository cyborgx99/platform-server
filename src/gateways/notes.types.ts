export enum NotesGatewayMessages {
  joinRoom = 'joinRoom',
  textChange = 'textChange',
  leaveRoom = 'leaveRoom',
  saveDocument = 'saveDocument',
}

export enum SocketEmits {
  loadNotes = 'loadNotes',
  receiveChanges = 'receiveChanges',
}

export interface JoinRoomData {
  roomId: string;
}

export interface TextChangeData {
  roomId: string;
  notes: string;
}
