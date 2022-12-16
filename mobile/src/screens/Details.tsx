import { useEffect, useState } from 'react';
import { HStack, useToast, VStack } from 'native-base';
import { Share } from 'react-native';
import { Header } from '../components/Header';
import { useRoute } from '@react-navigation/native';
import { Loading } from '../components/Loading';
import { api } from '../services/api';
import { PoolCardPros } from '../components/PoolCard';
import { PoolHeader } from '../components/PoolHeader';
import { EmptyMyPoolList } from '../components/EmptyMyPoolList';
import { Option } from '../components/Option';
import { Guesses } from '../components/Guesses';

interface RouteParams {
   id: string;
}

export function Details() {
   const [optionSelected, setOptionSelected] = useState<'guesses' | 'ranking'>('guesses');
   const route = useRoute();
   const toast = useToast();
   const { id } = route.params as RouteParams;
   const [isLoading, setIsLoading] = useState(false);
   const [poolDetails, setPoolDetails] = useState<PoolCardPros>({} as PoolCardPros);

   useEffect(() => {
      fetchPoolDatails();
   }, [id]);

   async function fetchPoolDatails() {
      try {
         setIsLoading(true);
         const response = await api.get(`/pools/${id}`);
         setPoolDetails(response.data.pool);
      } catch (error) {
         console.log(error);
         toast.show({
            title: 'Não foi possível carregar os detalhes do bolão.',
            placement: 'top',
            bgColor: 'red.500',
         });
      } finally {
         setIsLoading(false);
      }
   }

   async function handleCodeShare() {
      await Share.share({
         message: poolDetails.code,
      });
   }

   if (isLoading) {
      return <Loading />;
   }

   return (
      <VStack flex={1} bgColor="gray.900">
         <Header onShare={handleCodeShare} title={poolDetails.title} showBackButton showShareButton />
         {poolDetails._count?.participants > 0 ? (
            <VStack flex={1} px={5}>
               <PoolHeader data={poolDetails} />
               <HStack bgColor="gray.800" p={1} rounded="sm" mb={5}>
                  <Option
                     title="Seus palpites"
                     isSelected={optionSelected === 'guesses'}
                     onPress={() => setOptionSelected('guesses')}
                  />
                  <Option
                     title="Ranking do grupo"
                     isSelected={optionSelected === 'ranking'}
                     onPress={() => setOptionSelected('ranking')}
                  />
               </HStack>
               <Guesses poolId={poolDetails.id} code={poolDetails.code} />
            </VStack>
         ) : (
            <EmptyMyPoolList code={poolDetails.code} />
         )}
      </VStack>
   );
}
