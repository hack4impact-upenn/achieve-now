/**
 * A function that takes in a list of items and
 * a function to process each item in a async batch with Promise.
 * @param items List of items.
 * @param limit The limit of promise request that can be done at once.
 * @param fn The function of the request.
 * @returns The response of batch requests in a list{@link results}
 */
const batchReturnList = async (
  items: Array<any>,
  limit: number,
  fn: (item: any) => Promise<any>,
) => {
  let results : any[] = [];
  for (let start = 0; start < items.length; start += limit) {
    const end = start + limit > items.length ? items.length : start + limit;

    const slicedResults = await Promise.all(items.slice(start, end).map(fn));

    results = [
      ...results,
      ...slicedResults,
    ]
  }

  return results;
}

/**
 * A function that takes in a list of items and
 * a function to process each item in a async batch with Promise.
 * @param items List of items.
 * @param limit The limit of promise request that can be done at once.
 * @param fn The function of the request.
 * @returns void
 */
const batchReturnVoid = async (
    items: Array<any>,
    limit: number,
    fn: (item: any) => void,
  ) => {
    for (let start = 0; start < items.length; start += limit) {
      const end = start + limit > items.length ? items.length : start + limit;
  
      await Promise.all(items.slice(start, end).map(fn));
    }

    return;
}

export {
  batchReturnList,
  batchReturnVoid,
};
