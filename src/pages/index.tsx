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
  async function fetchImages({ pageParam = null }): Promise<any> {
    console.log('Esperando');
    const response = await api.get(`/images?after=${pageParam}`);
    return response.data;
  }
  function getNextPageParam(lastPage: ImagesQueryResponse): string {
    console.log('Aqui ');
    if (lastPage?.after) {
      return lastPage.after.id;
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
    return data?.pages.map(page => {
      return page.data.map(dataImage => ({
        title: dataImage.title,
        description: dataImage.description,
        url: dataImage.url,
        ts: dataImage.ts,
        id: dataImage.id,
      }));
    })[0];
  }, [data]);

  if (isError) {
    return <Error />;
  }
  console.log('Formated Data', data);
  return (
    <>
      {isLoading ? (
        <Loading />
      ) : (
        <>
          <Header />

          <Box maxW={1120} px={20} mx="auto" my={20}>
            <CardList cards={formattedData} />
            {/* TODO RENDER LOAD MORE BUTTON IF DATA HAS NEXT PAGE */}
          </Box>
        </>
      )}
    </>
  );
}
