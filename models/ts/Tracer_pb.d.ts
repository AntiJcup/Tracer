// package: google.protobuf
// file: Tracer.proto

import * as jspb from "google-protobuf";

export class CreateItemData extends jspb.Message {
  getIsFolder(): boolean;
  setIsFolder(value: boolean): void;

  getNewFilePath(): string;
  setNewFilePath(value: string): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): CreateItemData.AsObject;
  static toObject(includeInstance: boolean, msg: CreateItemData): CreateItemData.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: CreateItemData, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): CreateItemData;
  static deserializeBinaryFromReader(message: CreateItemData, reader: jspb.BinaryReader): CreateItemData;
}

export namespace CreateItemData {
  export type AsObject = {
    isFolder: boolean,
    newFilePath: string,
  }
}

export class DeleteItemData extends jspb.Message {
  getPreviousData(): string;
  setPreviousData(value: string): void;

  getIsFolder(): boolean;
  setIsFolder(value: boolean): void;

  getPreviousFilePath(): string;
  setPreviousFilePath(value: string): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): DeleteItemData.AsObject;
  static toObject(includeInstance: boolean, msg: DeleteItemData): DeleteItemData.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: DeleteItemData, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): DeleteItemData;
  static deserializeBinaryFromReader(message: DeleteItemData, reader: jspb.BinaryReader): DeleteItemData;
}

export namespace DeleteItemData {
  export type AsObject = {
    previousData: string,
    isFolder: boolean,
    previousFilePath: string,
  }
}

export class ModifyFileData extends jspb.Message {
  getOffsetStart(): number;
  setOffsetStart(value: number): void;

  getOffsetEnd(): number;
  setOffsetEnd(value: number): void;

  getData(): string;
  setData(value: string): void;

  getPreviousData(): string;
  setPreviousData(value: string): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): ModifyFileData.AsObject;
  static toObject(includeInstance: boolean, msg: ModifyFileData): ModifyFileData.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: ModifyFileData, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): ModifyFileData;
  static deserializeBinaryFromReader(message: ModifyFileData, reader: jspb.BinaryReader): ModifyFileData;
}

export namespace ModifyFileData {
  export type AsObject = {
    offsetStart: number,
    offsetEnd: number,
    data: string,
    previousData: string,
  }
}

export class SelectFileData extends jspb.Message {
  getNewFilePath(): string;
  setNewFilePath(value: string): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): SelectFileData.AsObject;
  static toObject(includeInstance: boolean, msg: SelectFileData): SelectFileData.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: SelectFileData, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): SelectFileData;
  static deserializeBinaryFromReader(message: SelectFileData, reader: jspb.BinaryReader): SelectFileData;
}

export namespace SelectFileData {
  export type AsObject = {
    newFilePath: string,
  }
}

export class CursorChangeFileData extends jspb.Message {
  getOffsetStart(): number;
  setOffsetStart(value: number): void;

  getOffsetEnd(): number;
  setOffsetEnd(value: number): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): CursorChangeFileData.AsObject;
  static toObject(includeInstance: boolean, msg: CursorChangeFileData): CursorChangeFileData.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: CursorChangeFileData, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): CursorChangeFileData;
  static deserializeBinaryFromReader(message: CursorChangeFileData, reader: jspb.BinaryReader): CursorChangeFileData;
}

export namespace CursorChangeFileData {
  export type AsObject = {
    offsetStart: number,
    offsetEnd: number,
  }
}

export class RenameItemData extends jspb.Message {
  getNewFilePath(): string;
  setNewFilePath(value: string): void;

  getPreviousData(): string;
  setPreviousData(value: string): void;

  getIsFolder(): boolean;
  setIsFolder(value: boolean): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): RenameItemData.AsObject;
  static toObject(includeInstance: boolean, msg: RenameItemData): RenameItemData.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: RenameItemData, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): RenameItemData;
  static deserializeBinaryFromReader(message: RenameItemData, reader: jspb.BinaryReader): RenameItemData;
}

export namespace RenameItemData {
  export type AsObject = {
    newFilePath: string,
    previousData: string,
    isFolder: boolean,
  }
}

export class UploadFileData extends jspb.Message {
  getResourceId(): string;
  setResourceId(value: string): void;

  getNewFilePath(): string;
  setNewFilePath(value: string): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): UploadFileData.AsObject;
  static toObject(includeInstance: boolean, msg: UploadFileData): UploadFileData.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: UploadFileData, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): UploadFileData;
  static deserializeBinaryFromReader(message: UploadFileData, reader: jspb.BinaryReader): UploadFileData;
}

export namespace UploadFileData {
  export type AsObject = {
    resourceId: string,
    newFilePath: string,
  }
}

export class ScrollFileData extends jspb.Message {
  getScrollStart(): number;
  setScrollStart(value: number): void;

  getScrollEnd(): number;
  setScrollEnd(value: number): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): ScrollFileData.AsObject;
  static toObject(includeInstance: boolean, msg: ScrollFileData): ScrollFileData.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: ScrollFileData, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): ScrollFileData;
  static deserializeBinaryFromReader(message: ScrollFileData, reader: jspb.BinaryReader): ScrollFileData;
}

export namespace ScrollFileData {
  export type AsObject = {
    scrollStart: number,
    scrollEnd: number,
  }
}

export class MouseMoveData extends jspb.Message {
  getX(): number;
  setX(value: number): void;

  getY(): number;
  setY(value: number): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): MouseMoveData.AsObject;
  static toObject(includeInstance: boolean, msg: MouseMoveData): MouseMoveData.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: MouseMoveData, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): MouseMoveData;
  static deserializeBinaryFromReader(message: MouseMoveData, reader: jspb.BinaryReader): MouseMoveData;
}

export namespace MouseMoveData {
  export type AsObject = {
    x: number,
    y: number,
  }
}

export class CustomActionData extends jspb.Message {
  getAction(): string;
  setAction(value: string): void;

  getData(): string;
  setData(value: string): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): CustomActionData.AsObject;
  static toObject(includeInstance: boolean, msg: CustomActionData): CustomActionData.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: CustomActionData, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): CustomActionData;
  static deserializeBinaryFromReader(message: CustomActionData, reader: jspb.BinaryReader): CustomActionData;
}

export namespace CustomActionData {
  export type AsObject = {
    action: string,
    data: string,
  }
}

export class TraceTransaction extends jspb.Message {
  getType(): TraceTransaction.TraceTransactionTypeMap[keyof TraceTransaction.TraceTransactionTypeMap];
  setType(value: TraceTransaction.TraceTransactionTypeMap[keyof TraceTransaction.TraceTransactionTypeMap]): void;

  getTimeOffsetMs(): number;
  setTimeOffsetMs(value: number): void;

  getFilePath(): string;
  setFilePath(value: string): void;

  getMetaData(): string;
  setMetaData(value: string): void;

  hasCreateFile(): boolean;
  clearCreateFile(): void;
  getCreateFile(): CreateItemData | undefined;
  setCreateFile(value?: CreateItemData): void;

  hasDeleteFile(): boolean;
  clearDeleteFile(): void;
  getDeleteFile(): DeleteItemData | undefined;
  setDeleteFile(value?: DeleteItemData): void;

  hasModifyFile(): boolean;
  clearModifyFile(): void;
  getModifyFile(): ModifyFileData | undefined;
  setModifyFile(value?: ModifyFileData): void;

  hasSelectFile(): boolean;
  clearSelectFile(): void;
  getSelectFile(): SelectFileData | undefined;
  setSelectFile(value?: SelectFileData): void;

  hasCursorFile(): boolean;
  clearCursorFile(): void;
  getCursorFile(): CursorChangeFileData | undefined;
  setCursorFile(value?: CursorChangeFileData): void;

  hasRenameFile(): boolean;
  clearRenameFile(): void;
  getRenameFile(): RenameItemData | undefined;
  setRenameFile(value?: RenameItemData): void;

  hasUploadFile(): boolean;
  clearUploadFile(): void;
  getUploadFile(): UploadFileData | undefined;
  setUploadFile(value?: UploadFileData): void;

  hasScrollFile(): boolean;
  clearScrollFile(): void;
  getScrollFile(): ScrollFileData | undefined;
  setScrollFile(value?: ScrollFileData): void;

  hasMouseMove(): boolean;
  clearMouseMove(): void;
  getMouseMove(): MouseMoveData | undefined;
  setMouseMove(value?: MouseMoveData): void;

  hasCustomAction(): boolean;
  clearCustomAction(): void;
  getCustomAction(): CustomActionData | undefined;
  setCustomAction(value?: CustomActionData): void;

  getDataCase(): TraceTransaction.DataCase;
  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): TraceTransaction.AsObject;
  static toObject(includeInstance: boolean, msg: TraceTransaction): TraceTransaction.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: TraceTransaction, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): TraceTransaction;
  static deserializeBinaryFromReader(message: TraceTransaction, reader: jspb.BinaryReader): TraceTransaction;
}

export namespace TraceTransaction {
  export type AsObject = {
    type: TraceTransaction.TraceTransactionTypeMap[keyof TraceTransaction.TraceTransactionTypeMap],
    timeOffsetMs: number,
    filePath: string,
    metaData: string,
    createFile?: CreateItemData.AsObject,
    deleteFile?: DeleteItemData.AsObject,
    modifyFile?: ModifyFileData.AsObject,
    selectFile?: SelectFileData.AsObject,
    cursorFile?: CursorChangeFileData.AsObject,
    renameFile?: RenameItemData.AsObject,
    uploadFile?: UploadFileData.AsObject,
    scrollFile?: ScrollFileData.AsObject,
    mouseMove?: MouseMoveData.AsObject,
    customAction?: CustomActionData.AsObject,
  }

  export interface TraceTransactionTypeMap {
    CREATEFILE: 0;
    DELETEFILE: 1;
    MODIFYFILE: 2;
    SELECTFILE: 3;
    CURSORFILE: 4;
    RENAMEFILE: 5;
    UPLOADFILE: 6;
    SCROLLFILE: 7;
    MOUSEMOVE: 8;
    CUSTOMACTION: 9;
  }

  export const TraceTransactionType: TraceTransactionTypeMap;

  export enum DataCase {
    DATA_NOT_SET = 0,
    CREATE_FILE = 5,
    DELETE_FILE = 6,
    MODIFY_FILE = 7,
    SELECT_FILE = 8,
    CURSOR_FILE = 9,
    RENAME_FILE = 10,
    UPLOAD_FILE = 11,
    SCROLL_FILE = 12,
    MOUSE_MOVE = 13,
    CUSTOM_ACTION = 14,
  }
}

export class TraceTransactionLog extends jspb.Message {
  getPartition(): number;
  setPartition(value: number): void;

  clearTransactionsList(): void;
  getTransactionsList(): Array<TraceTransaction>;
  setTransactionsList(value: Array<TraceTransaction>): void;
  addTransactions(value?: TraceTransaction, index?: number): TraceTransaction;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): TraceTransactionLog.AsObject;
  static toObject(includeInstance: boolean, msg: TraceTransactionLog): TraceTransactionLog.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: TraceTransactionLog, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): TraceTransactionLog;
  static deserializeBinaryFromReader(message: TraceTransactionLog, reader: jspb.BinaryReader): TraceTransactionLog;
}

export namespace TraceTransactionLog {
  export type AsObject = {
    partition: number,
    transactionsList: Array<TraceTransaction.AsObject>,
  }
}

export class TraceTransactionLogs extends jspb.Message {
  clearLogsList(): void;
  getLogsList(): Array<TraceTransactionLog>;
  setLogsList(value: Array<TraceTransactionLog>): void;
  addLogs(value?: TraceTransactionLog, index?: number): TraceTransactionLog;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): TraceTransactionLogs.AsObject;
  static toObject(includeInstance: boolean, msg: TraceTransactionLogs): TraceTransactionLogs.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: TraceTransactionLogs, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): TraceTransactionLogs;
  static deserializeBinaryFromReader(message: TraceTransactionLogs, reader: jspb.BinaryReader): TraceTransactionLogs;
}

export namespace TraceTransactionLogs {
  export type AsObject = {
    logsList: Array<TraceTransactionLog.AsObject>,
  }
}

export class TraceProject extends jspb.Message {
  getId(): string;
  setId(value: string): void;

  getDuration(): number;
  setDuration(value: number): void;

  getPartitionSize(): number;
  setPartitionSize(value: number): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): TraceProject.AsObject;
  static toObject(includeInstance: boolean, msg: TraceProject): TraceProject.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: TraceProject, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): TraceProject;
  static deserializeBinaryFromReader(message: TraceProject, reader: jspb.BinaryReader): TraceProject;
}

export namespace TraceProject {
  export type AsObject = {
    id: string,
    duration: number,
    partitionSize: number,
  }
}

