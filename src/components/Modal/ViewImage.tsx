import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalBody,
  Image,
  Link,
  ModalCloseButton,
} from '@chakra-ui/react';

interface ModalViewImageProps {
  isOpen: boolean;
  onClose: () => void;
  imgUrl: string;
}

export function ModalViewImage({
  isOpen,
  onClose,
  imgUrl,
}: ModalViewImageProps): JSX.Element {
  return (
    <Modal onClose={onClose} isOpen={isOpen} size="full" isCentered>
      <ModalOverlay />
      <ModalContent bg="transparent">
        <ModalCloseButton />
        <ModalBody display="flex" flexDir="column" alignItems="center">
          <Image
            maxHeight="600px"
            maxWidth="900px"
            boxSize="full"
            src={imgUrl}
            alt="picture"
            objectFit="contain"
          />
          <Link href={imgUrl} isExternal>
            Abrir original
          </Link>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
}
