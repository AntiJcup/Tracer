// package: google.protobuf
// file: Tracer.proto

import * as jspb from "google-protobuf";

export class CreateFileData extends jspb.Message {
  getFilePath(): string;
  setFilePath(value: string): void;

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
    filePath: string,
  }
}

export class DeleteFileData extends jspb.Message {
  getFilePath(): string;
  setFilePath(value: string): void;

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
    filePath: string,
  }
}

export class InsertFileData extends jspb.Message {
  getFilePath(): string;
  setFilePath(value: string): void;

  getLine(): number;
  setLine(value: number): void;

  getOffsetStart(): number;
  setOffsetStart(value: number): void;

  getOffsetEnd(): number;
  setOffsetEnd(value: number): void;

  getData(): string;
  setData(value: string): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): InsertFileData.AsObject;
  static toObject(includeInstance: boolean, msg: InsertFileData): InsertFileData.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: InsertFileData, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): InsertFileData;
  static deserializeBinaryFromReader(message: InsertFileData, reader: jspb.BinaryReader): InsertFileData;
}

export namespace InsertFileData {
  export type AsObject = {
    filePath: string,
    line: number,
    offsetStart: number,
    offsetEnd: number,
    data: string,
  }
}

export class EraseFileData extends jspb.Message {
  getFilePath(): string;
  setFilePath(value: string): void;

  getLine(): number;
  setLine(value: number): void;

  getOffsetStart(): number;
  setOffsetStart(value: number): void;

  getOffsetEnd(): number;
  setOffsetEnd(value: number): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): EraseFileData.AsObject;
  static toObject(includeInstance: boolean, msg: EraseFileData): EraseFileData.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: EraseFileData, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): EraseFileData;
  static deserializeBinaryFromReader(message: EraseFileData, reader: jspb.BinaryReader): EraseFileData;
}

export namespace EraseFileData {
  export type AsObject = {
    filePath: string,
    line: number,
    offsetStart: number,
    offsetEnd: number,
  }
}

export class TraceTransaction extends jspb.Message {
  getType(): TraceTransaction.TraceTransactionTypeMap[keyof TraceTransaction.TraceTransactionTypeMap];
  setType(value: TraceTransaction.TraceTransactionTypeMap[keyof TraceTransaction.TraceTransactionTypeMap]): void;

  getTimeOffsetMs(): number;
  setTimeOffsetMs(value: number): void;

  hasCreateFile(): boolean;
  clearCreateFile(): void;
  getCreateFile(): CreateFileData | undefined;
  setCreateFile(value?: CreateFileData): void;

  hasDeleteFile(): boolean;
  clearDeleteFile(): void;
  getDeleteFile(): DeleteFileData | undefined;
  setDeleteFile(value?: DeleteFileData): void;

  hasInsertFile(): boolean;
  clearInsertFile(): void;
  getInsertFile(): InsertFileData | undefined;
  setInsertFile(value?: InsertFileData): void;

  hasEraseFile(): boolean;
  clearEraseFile(): void;
  getEraseFile(): EraseFileData | undefined;
  setEraseFile(value?: EraseFileData): void;

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
    createFile?: CreateFileData.AsObject,
    deleteFile?: DeleteFileData.AsObject,
    insertFile?: InsertFileData.AsObject,
    eraseFile?: EraseFileData.AsObject,
  }

  export interface TraceTransactionTypeMap {
    CREATEFILE: 0;
    DELETEFILE: 1;
    INSERTFILE: 2;
    ERASEFILE: 3;
  }

  export const TraceTransactionType: TraceTransactionTypeMap;

  export enum DataCase {
    DATA_NOT_SET = 0,
    CREATE_FILE = 3,
    DELETE_FILE = 4,
    INSERT_FILE = 5,
    ERASE_FILE = 6,
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

