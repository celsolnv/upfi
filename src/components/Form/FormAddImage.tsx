import { Box, Button, Stack, useToast } from '@chakra-ui/react';
import { useForm } from 'react-hook-form';
import { useState } from 'react';
import { useMutation, useQueryClient } from 'react-query';

import { api } from '../../services/api';
import { FileInput } from '../Input/FileInput';
import { TextInput } from '../Input/TextInput';

interface FormAddImageProps {
  closeModal: () => void;
}

export function FormAddImage({ closeModal }: FormAddImageProps): JSX.Element {
  const [imageUrl, setImageUrl] = useState('');
  const [localImageUrl, setLocalImageUrl] = useState('');
  const toast = useToast();

  const formValidations = {
    image: {
      required: 'Arquivo obrigatório',
      validate: {
        lessThan10Mb: image => {
          if (image[0].size > 10 ** 9) {
            return 'O arquivo deve ser menor que 10MB';
          }
          return true;
        },
        acceptedFormats: value => {
          const mimetypes = ['image/png', 'image/jpeg', 'image/gif'];
          if (mimetypes.includes(value[0].type)) {
            return true;
          }
          return 'Somente são aceitos arquivos PNG, JPEG e GIF';
        },
      },
    },
    title: {
      required: 'Titulo obrigatório',
      minLength: 2,
      maxLength: 20,
    },
    description: {
      required: 'Descrição obrigatória',
      maxLength: 65,
    },
  };

  const queryClient = useQueryClient();
  const mutation = useMutation(
    async (values: Record<string, unknown>) => {
      const data = {
        url: imageUrl,
        title: values.title,
        description: values.description,
      };
      const response = await api.post('/api/images', data);
      return response.data;
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries('images');
      },
    }
  );

  const { register, handleSubmit, reset, formState, setError, trigger } =
    useForm();
  const { errors } = formState;

  const onSubmit = async (data: Record<string, unknown>): Promise<void> => {
    try {
      if (imageUrl === '') {
        toast({
          title: 'Imagem não adicionada',
          description:
            'É preciso adicionar e aguardar o upload de uma imagem antes de realizar o cadastro',
        });
      } else {
        const response = await mutation.mutateAsync(data);
        if (response.success) {
          toast({
            title: 'Imagem cadastrada',
            description: 'Sua imagem foi cadastrada com sucesso.',
          });
        }
      }
    } catch {
      toast({
        title: 'Falha no cadastro',
        description: 'Ocorreu um erro ao tentar cadastrar a sua imagem.',
      });
    } finally {
      reset();
      setLocalImageUrl('');
      setImageUrl('');
      closeModal();
    }
  };

  return (
    <Box as="form" width="100%" onSubmit={handleSubmit(onSubmit)}>
      <Stack spacing={4}>
        <FileInput
          setImageUrl={setImageUrl}
          localImageUrl={localImageUrl}
          setLocalImageUrl={setLocalImageUrl}
          setError={setError}
          trigger={trigger}
          {...register('image', formValidations.image)}
          error={errors.image}
        />

        <TextInput
          placeholder="Título da imagem..."
          {...register('title', formValidations.title)}
          error={errors.title}
        />

        <TextInput
          placeholder="Descrição da imagem..."
          {...register('description', formValidations.description)}
          error={errors.description}
        />
      </Stack>

      <Button
        my={6}
        isLoading={formState.isSubmitting}
        isDisabled={formState.isSubmitting}
        type="submit"
        w="100%"
        py={6}
      >
        Enviar
      </Button>
    </Box>
  );
}
