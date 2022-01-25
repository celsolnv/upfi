/* eslint-disable  */
import { Grid, SimpleGrid, useDisclosure } from '@chakra-ui/react';
import { useState } from 'react';
import { Card } from './Card';
import { ModalViewImage } from './Modal/ViewImage';

interface Card {
  title: string;
  description: string;
  url: string;
  ts: number;
  id: string;
}

interface CardsProps {
  cards: Card[];
}

export function CardList({ cards }: CardsProps): JSX.Element {
  const [hasModalOpen, setHasModalOpen] = useState(false);
  const [imageSelected, setImageSelected] = useState('');

  function handleViewImage(url: string): void {
    setImageSelected(url);
    setHasModalOpen(true);
  }
  function closeModal(): void {
    setHasModalOpen(false);
  }
  return (
    <>
      {hasModalOpen ? (
        <ModalViewImage
          isOpen={hasModalOpen}
          imgUrl={imageSelected}
          onClose={closeModal}
        />
      ) : (
        <SimpleGrid columns={3} spacing={"40px"}>
          {cards.map(imageData => (
            <Card
              key={imageData.id}
              data={imageData}
              viewImage={handleViewImage}
            />
          ))}
        </SimpleGrid>
      )}

    </>
  );
}
