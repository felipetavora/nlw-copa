import { useState } from 'react';
import { useNavigation } from '@react-navigation/native';
import { Heading, VStack, useToast } from 'native-base';
import { Header } from '../components/Header';
import { Input } from '../components/Input';
import { Button } from '../components/Button';
import { api } from '../services/api';

export default function Find() {
   const [isLoading, setIsLoading] = useState(false);
   const [code, setCode] = useState('');
   const toast = useToast();
   const { navigate } = useNavigation();

   async function handleJoinPool() {
      try {
         if (!code.trim()) {
            return toast.show({
               title: 'Informe o código.',
               placement: 'top',
               bgColor: 'red.500',
            });
         }
         setIsLoading(true);
         await api.post('/pools/join', { code });
         toast.show({
            title: 'Você entrou no bolão com sucesso!',
            placement: 'top',
            bgColor: 'green.500',
         });
         navigate('pools');
      } catch (error) {
         console.log(error);
         setIsLoading(false);
         if (error.response?.data?.message === 'Pool not found.') {
            toast.show({
               title: 'Bolão não encontrado!',
               placement: 'top',
               bgColor: 'red.500',
            });
            return;
         }
         if (error.response?.data?.message === 'You already joined this pool.') {
            toast.show({
               title: 'Você já está nesse bolão!',
               placement: 'top',
               bgColor: 'red.500',
            });
            return;
         }
      }
   }

   return (
      <VStack flex={1} bgColor="gray.900">
         <Header title="Buscar por código" showBackButton />
         <VStack mt={8} mx={5} alignItems="center">
            <Heading fontFamily="heading" color="white" fontSize="xl" mb={8} textAlign="center">
               Encontre um bolão através de {'\n'} seu código único
            </Heading>
            <Input mb={2} placeholder="Qual o código do bolão?" onChangeText={setCode} autoCapitalize="characters" />
            <Button title="BUSCAR BOLÃO" isLoading={isLoading} onPress={handleJoinPool}></Button>
         </VStack>
      </VStack>
   );
}
