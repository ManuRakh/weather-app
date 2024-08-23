import axios, { AxiosRequestConfig, AxiosResponse } from "axios";

export type ResponseData<T> = AxiosResponse<T>;

export async function sendRequest<T>({
  url,
  method = "GET",
  data,
  headers,
  params,
}: AxiosRequestConfig): Promise<ResponseData<T>> {
  const response = await axios({
    method,
    url,
    data,
    headers,
    params,
  });

  return response as ResponseData<T>;
}
