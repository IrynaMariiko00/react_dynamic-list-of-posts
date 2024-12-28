import { client } from '../utils/fetchClient';
import { User } from '../types/User';
import { Post } from '../types/Post';

export const getUser = () => {
  return client.get<User[]>('/users');
};

export const getPosts = ({ id }: Pick<User, 'id'>) => {
  return client.get<Post[]>(`/posts?userId=${id}`);
};
