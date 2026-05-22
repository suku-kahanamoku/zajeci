import type { IResponse } from "@suku-kahanamoku/common-module/types";

export interface IMailTemplate {
  template: string;
}

export interface IMailTemplatesResponse extends IResponse {
  data?: IMailTemplate[];
}
