import type { IItem, IResponse } from "@suku-kahanamoku/common-module/types";

export interface IText extends IItem {
  syscode: string;
  title?: string;
  content?: string;
  language?: string;
  published?: boolean;
}

export interface ITextResponse extends IResponse {
  data?: IText;
}

export interface ITextsResponse extends IResponse {
  data?: IText[];
}
