export type ErrorType = {
  name: string;
  message: string;
  stack: string;
  isAxiosError?: boolean;
  [x: string]: any;
  fhm_isRestifyClientError?: boolean;
  meta: string;
  toJSON?: boolean;
  code: string;
  data?: Record<string, string>;
  body?: string | Record<string, string>;
};
