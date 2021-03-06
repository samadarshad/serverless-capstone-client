/**
 * This module was automatically generated by `ts-interface-builder`
 */
import * as t from "ts-interface-checker";
// tslint:disable:object-literal-key-quotes

export const MessageType = t.iface([], {
  "name": t.opt("string"),
  "userId": "string",
  "room": "string",
  "message": t.opt("string"),
  "postedAt": "string",
  "subAction": t.opt("string"),
  "deleteMessage": t.opt("boolean"),
});

const exportedTypeSuite: t.ITypeSuite = {
  MessageType,
};
export default exportedTypeSuite;
