// package: google.protobuf
// file: Tracer.proto

import * as jspb from "google-protobuf";

export class CreateFileData extends jspb.Message {
  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): CreateFileData.AsObject;
  static toObject(includeInstance: boolean, msg: CreateFileData): CreateFileData.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: CreateFileData, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): CreateFileData;
  static deserializeBinaryFromReader(message: CreateFileData, reader: jspb.BinaryReader): CreateFileData;
}

export namespace CreateFileData {
  export type AsObject = {
  }
}

export class DeleteFileData extends jspb.Message {
  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): DeleteFileData.AsObject;
  static toObject(includeInstance: boolean, msg: DeleteFileData): DeleteFileData.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: DeleteFileData, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): DeleteFileData;
  static deserializeBinaryFromReader(message: DeleteFileData, reader: jspb.BinaryReader): DeleteFileData;
}

export namespace DeleteFileData {
  export type AsObject = {
  }
}

export class ModifyFileData extends jspb.Message {
  getOffsetStart(): number;
  setOffsetStart(value: number): void;

  getOffsetEnd(): number;
  setOffsetEnd(value: number): void;

  getData(): string;
  setData(value: string): void;

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
  }
}

export class SelectFileData extends jspb.Message {
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

export class RenameFileData extends jspb.Message {
  getNewFilePath(): string;
  setNewFilePath(value: string): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): RenameFileData.AsObject;
  static toObject(includeInstance: boolean, msg: RenameFileData): RenameFileData.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: RenameFileData, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): RenameFileData;
  static deserializeBinaryFromReader(message: RenameFileData, reader: jspb.BinaryReader): RenameFileData;
}

export namespace RenameFileData {
  export type AsObject = {
    newFilePath: string,
  }
}

export class TraceTransaction extends jspb.Message {
  getType(): TraceTransaction.TraceTransactionTypeMap[keyof TraceTransaction.TraceTransactionTypeMap];
  setType(value: TraceTransaction.TraceTransactionTypeMap[keyof TraceTransaction.TraceTransactionTypeMap]): void;

  getTimeOffsetMs(): number;
  setTimeOffsetMs(value: number): void;

  getFilePath(): string;
  setFilePath(value: string): void;

  hasCreateFile(): boolean;
  clearCreateFile(): void;
  getCreateFile(): CreateFileData | undefined;
  setCreateFile(value?: CreateFileData): void;

  hasDeleteFile(): boolean;
  clearDeleteFile(): void;
  getDeleteFile(): DeleteFileData | undefined;
  setDeleteFile(value?: DeleteFileData): void;

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
  getRenameFile(): RenameFileData | undefined;
  setRenameFile(value?: RenameFileData): void;

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
    createFile?: CreateFileData.AsObject,
    deleteFile?: DeleteFileData.AsObject,
    modifyFile?: ModifyFileData.AsObject,
    selectFile?: SelectFileData.AsObject,
    cursorFile?: CursorChangeFileData.AsObject,
    renameFile?: RenameFileData.AsObject,
  }

  export interface TraceTransactionTypeMap {
    CREATEFILE: 0;
    DELETEFILE: 1;
    MODIFYFILE: 2;
    SELECTFILE: 3;
    CURSORFILE: 4;
    RENAMEFILE: 5;
  }

  export const TraceTransactionType: TraceTransactionTypeMap;

  export enum DataCase {
    DATA_NOT_SET = 0,
    CREATE_FILE = 4,
    DELETE_FILE = 5,
    MODIFY_FILE = 6,
    SELECT_FILE = 7,
    CURSOR_FILE = 8,
    RENAME_FILE = 9,
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

