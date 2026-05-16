import type { IItem, IResponse } from "@suku-kahanamoku/common-module/types";

export interface IText extends IItem {
  syscode: string;
  title?: string;
  content?: string;
  language?: string;
  published?: 0 | 1;
  created_by?: number | null;
}

export interface ITextResponse extends IResponse {
  data?: IText;
}

export interface ITextsResponse extends IResponse {
  data?: IText[];
}
