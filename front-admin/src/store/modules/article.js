import { getArticles, getArticle, getTags, removeArticle } from '@/api/article';
import asyncHandler from '@/utils/asyncHandler';
import { mapArticle } from '@/vo/article.vo';

const getDefaultArticleState = () => ({
  // paged response
  articles: [],
  page: 1,
  // single response
  id: null,
  count: 0,
  article: {},
  pageSize: 10,
  tag: '',
  // tags for autocomplete
  // tagKeyword: '',
  // tags: [],
});

export const INIT = 'INIT';
export const SET_ARTICLES = 'SET_ARTICLES';
export const SET_PAGE = 'SET_PAGE';
export const SET_ARTICLE_ID = 'SET_ARTICLE_ID';
export const SET_COUNT = 'SET_COUNT';
export const SET_PAGE_SIZE = 'SET_PAGE_SIZE';
export const SET_TAG = 'SET_TAG';
// export const SET_TAG_KEYWORD = 'SET_TAG_KEYWORD';
// export const SET_TAGS = 'SET_TAGS';

const mutations = {
  [INIT](state) {
    Object.entries(getDefaultArticleState()).forEach(([key, value]) => {
      state[key] = value;
    });
  },
  [SET_ARTICLES]: (state, articles) => (state.articles = articles),
  [SET_PAGE]: (state, page) => (state.page = page),
  [SET_ARTICLE_ID]: (state, articleId) => (state.articleId = articleId),
  [SET_COUNT]: (state, count) => (state.count = count),
  [SET_PAGE_SIZE]: (state, pageSize) => (state.pageSize = pageSize),
  [SET_TAG]: (state, tag) => (state.tag = tag),
  // [SET_TAG_KEYWORD]: (state, keyword) => (state.keyword = keyword),
  // [SET_TAGS]: (state, tags) => (state.tags = tags),
};

export const GET_ARTICLES = 'GET_ARTICLES';
export const GET_ARTICLE = 'GET_ARTICLE';
export const GET_TAGS = 'GET_TAGS';
export const REMOVE_ARTICLE = 'REMOVE_ARTICLE';
export const REMOVE_ARTICLES = 'REMOVE_ARTICLES';

const actions = {
  async [GET_ARTICLES]({ commit, state }) {
    const opt = { page: state.page, size: state.pageSize };
    if (state.tag !== '') opt.tag = state.tag;
    const req = await asyncHandler(getArticles, opt);
    if (req.error) {
      return req;
    }
    commit(SET_PAGE_SIZE, req.result.size);
    commit(SET_ARTICLES, req.result.list.map(mapArticle));
    commit(SET_COUNT, req.result.count);
    return req;
  },
  async [GET_ARTICLE]({ commit, state }, articleId) {
    commit(SET_ARTICLE_ID, articleId);
    const req = await asyncHandler(getArticle, articleId);
    if (req.error) {
      return req;
    }
    commit(SET_ARTICLE_ID, articleId);
    commit(SET_COUNT, req.result.count);
    return req;
  },
  async [GET_TAGS]({ commit, state }, keyword) {
    const req = await asyncHandler(getTags, keyword);
    if (req.error) {
      console.error(req.error);
      return [];
    }
    return req.result.tags;
  },
  async [REMOVE_ARTICLE]({ dispatch }, articleId) {
    const req = await asyncHandler(removeArticle, articleId);
    if (req.error) {
      return req;
    }
    // await dispatch(GET_ARTICLES);
    return req;
  },
  async [REMOVE_ARTICLES]({ dispatch }, articleIds) {
    const ops = articleIds.map((articleId) =>
      dispatch(REMOVE_ARTICLE, articleId),
    );
    const reqs = await Promise.all(ops);
    await dispatch(GET_ARTICLES);
    return reqs;
  },
};

export default {
  namespaced: true,
  state: getDefaultArticleState(),
  mutations,
  actions,
};
