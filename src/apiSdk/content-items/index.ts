import axios from 'axios';
import queryString from 'query-string';
import { ContentItemInterface, ContentItemGetQueryInterface } from 'interfaces/content-item';
import { GetQueryInterface } from '../../interfaces';

export const getContentItems = async (query?: ContentItemGetQueryInterface) => {
  const response = await axios.get(`/api/content-items${query ? `?${queryString.stringify(query)}` : ''}`);
  return response.data;
};

export const createContentItem = async (contentItem: ContentItemInterface) => {
  const response = await axios.post('/api/content-items', contentItem);
  return response.data;
};

export const updateContentItemById = async (id: string, contentItem: ContentItemInterface) => {
  const response = await axios.put(`/api/content-items/${id}`, contentItem);
  return response.data;
};

export const getContentItemById = async (id: string, query?: GetQueryInterface) => {
  const response = await axios.get(`/api/content-items/${id}${query ? `?${queryString.stringify(query)}` : ''}`);
  return response.data;
};

export const deleteContentItemById = async (id: string) => {
  const response = await axios.delete(`/api/content-items/${id}`);
  return response.data;
};
