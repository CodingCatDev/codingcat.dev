import { GetStaticPropsContext } from 'next';
import { getPaginated, getPaginatedPaths } from '@/components/Pagination';
import Blog from '../index';
import { ModelType } from '@/models/builder.model';

export default Blog;

export async function getStaticProps({
  preview,
  params,
}: GetStaticPropsContext<{ pageNumber: string }>) {
  return getPaginated({
    preview,
    baseUrl: '/podcasts',
    params,
    model: ModelType.podcast,
  });
}

export async function getStaticPaths() {
  return getPaginatedPaths({ model: ModelType.podcast });
}
