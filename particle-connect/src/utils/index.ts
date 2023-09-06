export function formatRespData(value: string) {
  const result = JSON.parse(value);

  if (typeof result?.data !== 'object') {
    const message = result?.data;
    return {
      ...result,
      data: {
        code: 0,
        message,
      },
    };
  }

  return result;
}
