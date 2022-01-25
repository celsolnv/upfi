import { Button, Box } from '@chakra-ui/react';
import { useMemo } from 'react';
import { useInfiniteQuery } from 'react-query';

import { Header } from '../components/Header';
import { CardList } from '../components/CardList';
import { api } from '../services/api';
import { Loading } from '../components/Loading';
import { Error } from '../components/Error';
import { ImagesQueryResponse } from './api/images';

export default function Home(): JSX.Element {
  async function fetchImages({
    pageParam = null,
  }): Promise<ImagesQueryResponse> {
    const response = await api.get(`/api/images`, {
      params: { after: pageParam },
    });
    return response.data;
  }
  function getNextPageParam(lastPage): string {
    if (lastPage.after) {
      return lastPage.after;
    }
    return null;
  }
  const {
    data,
    isLoading,
    isError,
    isFetchingNextPage,
    fetchNextPage,
    hasNextPage,
  } = useInfiniteQuery('images', fetchImages, { getNextPageParam });
  const formattedData = useMemo(() => {
    return data?.pages
      .map(page => {
        return page.data.map(dataImage => ({
          title: dataImage.title,
          description: dataImage.description,
          url: dataImage.url,
          ts: dataImage.ts,
          id: dataImage.id,
        }));
      })
      .flat();
  }, [data]);

  if (isError) {
    return <Error />;
  }
  return (
    <>
      {isLoading ? (
        <Loading />
      ) : (
        <>
          <Header />

          <Box maxW={1120} px={20} mx="auto" my={20}>
            <CardList cards={formattedData} />
            {hasNextPage && (
              <Button
                onClick={() => {
                  fetchNextPage();
                }}
                mt={2}
              >
                {isFetchingNextPage ? 'Carregando...' : 'Carregar mais'}
              </Button>
            )}
          </Box>
        </>
      )}
    </>
  );
}
