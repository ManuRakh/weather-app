export type ErrorType = {
  name: string;
  message: any;
  stack: string;
  isAxiosError?: boolean;
  [x: string]: any;
  fhm_isRestifyClientError?: boolean;
  meta: any;
  toJSON?: boolean;
  code: any;
  data?: Record<string, any>;
  body?: string | Record<string, any>;
};
