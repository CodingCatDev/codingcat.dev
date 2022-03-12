import { CodingCatBuilderContent, ModelType } from '@/models/builder.model';
import { getAllBuilder } from '@/services/builder.server';
import builder from '@builder.io/react';
import { GetStaticPropsContext } from 'next';
import Link from 'next/link';

export const PER_PAGE = 20;

export const Pagination = ({
  pageNumber,
  list,
  baseUrl,
  showNext,
}: {
  pageNumber: number;
  list: CodingCatBuilderContent[] | null;
  baseUrl: string;
  showNext: boolean;
}) => {
  return (
    <>
      {list && (pageNumber > 1 || showNext) && (
        <div className="flex items-center justify-center w-full my-4 space-x-2">
          {pageNumber > 1 && (
            <Link href={`/${baseUrl}/page/${pageNumber - 1}`}>
              <a className="btn-secondary">‹ Previous</a>
            </Link>
          )}

          {showNext && (
            <Link href={`/${baseUrl}/page/${pageNumber + 1}`}>
              <a className="btn-primary">Next ›</a>
            </Link>
          )}
        </div>
      )}
    </>
  );
};

interface GetPaginated extends GetStaticPropsContext<{ pageNumber: string }> {
  baseUrl: string;
  model: ModelType;
}

export const getPaginated = async ({
  preview,
  baseUrl,
  model,
  params,
}: GetPaginated) => {
  const pageNumber = params?.pageNumber ? parseInt(params?.pageNumber) : 1;
  console.log(pageNumber);
  const [header, footer, modelData, list] = await Promise.all([
    getAllBuilder({
      preview,
      model: 'header',
      limit: 1,
    }),
    getAllBuilder({
      preview,
      model: 'footer',
      limit: 1,
    }),
    getAllBuilder({
      preview,
      model: 'page',
      limit: 1,
      userAttributes: {
        urlPath: baseUrl,
      },
    }),
    getAllBuilder({
      preview,
      model: model,
      omit: 'data.blocks',
      limit: PER_PAGE + 1,
      offset: (pageNumber - 1) * PER_PAGE,
    }) as Promise<CodingCatBuilderContent[]>,
  ]);
  return {
    props: {
      modelData: modelData?.[0] ? modelData[0] : null,
      model: 'page',
      header: header?.[0] ? header[0] : null,
      footer: footer?.[0] ? footer[0] : null,
      list: list ? list.slice(0, PER_PAGE) : null,
      showNext: list.length > PER_PAGE,
      baseUrl,
      pageNumber,
    },
    revalidate: 300,
  };
};
export const getPaginatedPaths = async ({ model }: { model: ModelType }) => {
  const pages = (await getAllBuilder({
    model,
    fields: 'data.url',
    limit: 10000,
  })) as CodingCatBuilderContent[];
  const paths = sliceIntoChunks(pages, PER_PAGE).map((_chunk, index) => ({
    params: { pageNumber: `${index + 1}` },
  }));
  console.log('paths', paths);
  return {
    paths,
    fallback: 'blocking',
  };
};

export const sliceIntoChunks = (arr: any[], chunkSize: number) => {
  const res = [];
  for (let i = 0; i < arr.length; i += chunkSize) {
    const chunk = arr.slice(i, i + chunkSize);
    res.push(chunk);
  }
  return res;
};
