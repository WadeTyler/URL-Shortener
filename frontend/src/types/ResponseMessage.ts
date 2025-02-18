export type ResponseMessage<T> = {
  data: T,
  status: string,
  message: string
};
