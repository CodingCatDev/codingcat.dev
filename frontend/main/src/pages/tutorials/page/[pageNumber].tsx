import { GetStaticPropsContext } from 'next';
import { getPaginated, getPaginatedPaths } from '@/components/Pagination';
import Tutorials from '../index';
import { ModelType } from '@/models/builder.model';

export default Tutorials;

export async function getStaticProps({
  preview,
  params,
}: GetStaticPropsContext<{ pageNumber: string }>) {
  return getPaginated({
    preview,
    baseUrl: '/tutorials',
    params,
    model: ModelType.tutorial,
  });
}

export async function getStaticPaths() {
  return getPaginatedPaths({ model: ModelType.tutorial });
}
