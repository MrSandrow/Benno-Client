type MyError = {
  field: string;
  message: string;
}[];

export const toErrorMap = (errors: MyError) => {
  const errorMap = errors.reduce((acc, cur) => ({
    ...acc,
    [cur.field]: cur.message,
  }), {});

  return errorMap;
};
