import { createAsyncThunk } from '@reduxjs/toolkit';
import article from '../types/article';
import listResponse from '../types/listResponse';
import { resolvedResult } from '../lib/api';
import setArticlesLoadState from './setArticlesLoadState';
import { LOADING } from '../types/loadState';
import queryPaging from '../types/queryPaging';
import { getArticles } from '../services/article';
import Logger from '../lib/logger';

const logger = new Logger('actions/getArticles.ts');

// eslint-disable-next-line
interface getArticlesArg extends queryPaging {
  // ...
}

const getArticlesAction = createAsyncThunk<
  resolvedResult<listResponse<article>>,
  getArticlesArg
>('GET_ARTICLES', async (arg, thunkAPI) => {
  thunkAPI.dispatch(setArticlesLoadState(LOADING));
  const req = await getArticles(arg);
  logger.log('get articles!', req);
  if (req.error) {
    logger.err(req.error);
    thunkAPI.rejectWithValue(req.errorCode);
    return null;
  }
  return req;
});

export default getArticlesAction;
