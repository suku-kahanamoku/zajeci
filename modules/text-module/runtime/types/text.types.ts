import type { IItem, IResponse } from "@suku-kahanamoku/common-module/types";

export interface IText extends IItem {
  syscode: string;
  title?: string;
  content?: string;
  language?: string;
  is_active?: boolean;
  created_at?: string;
  updated_at?: string;
}

export interface ITextResponse extends IResponse {
  data?: IText;
}

export interface ITextsResponse extends IResponse {
  data?: IText[];
}
