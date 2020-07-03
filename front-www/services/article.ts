import _pickBy from 'lodash/pickBy';
import { api, joinUrl, asyncResolver, resolvedResult } from '../lib/api';
import queryPaging from '../types/queryPaging';
import listResponse from '../types/listResponse';
// import article from '../types/article';
import Logger from '../lib/logger';
import { article, articleResponse } from '../types/article';

const logger = new Logger('services/article.ts');

export const AUTH = 'auth';
export const ARTICLES = 'articles';

export interface getArticlesRequestArg extends queryPaging {
  type?: string;
  tag?: string;
}

export async function getArticles(
  arg?: getArticlesRequestArg
): Promise<resolvedResult<listResponse<articleResponse>>> {
  const _arg = _pickBy(
    arg,
    (key, value) => value !== '' && value !== 0 && value
  );
  const url = joinUrl(ARTICLES, _arg);
  const opts = {
    method: 'get',
    url: `/${url}`,
  };
  logger.log('getArticles()', { opts });
  const req = await asyncResolver<listResponse<articleResponse>>(
    api.request,
    opts
  );
  return req;
}
