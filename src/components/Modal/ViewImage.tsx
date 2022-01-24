import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalFooter,
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
  // TODO MODAL WITH IMAGE AND EXTERNAL LINK
  return (
    <Modal onClose={onClose} isOpen={isOpen} size="full" isCentered>
      <ModalOverlay />
      <ModalContent bg="transparent">
        <ModalCloseButton />
        <ModalBody>
          <Image boxSize="full" src={imgUrl} alt="picture" objectFit="cover" />
          <Link href={imgUrl} isExternal>
            Abrir original
          </Link>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
}
