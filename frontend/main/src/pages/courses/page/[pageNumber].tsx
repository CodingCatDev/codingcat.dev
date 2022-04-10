import { GetStaticPropsContext } from 'next';
import { getPaginated, getPaginatedPaths } from '@/components/Pagination';
import Courses from '../index';
import { ModelType } from '@/models/builder.model';

export default Courses;

export async function getStaticProps({
  preview,
  params,
}: GetStaticPropsContext<{ pageNumber: string }>) {
  return getPaginated({
    preview,
    baseUrl: '/courses',
    params,
    model: ModelType.course,
  });
}

export async function getStaticPaths() {
  return getPaginatedPaths({ model: ModelType.course });
}
