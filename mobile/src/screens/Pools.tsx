import { VStack, Icon, useToast, FlatList } from 'native-base';
import { useCallback, useState } from 'react';
import { useNavigation } from '@react-navigation/native';
import { Octicons } from '@expo/vector-icons';
import { Button } from '../components/Button';
import { Header } from '../components/Header';
import { api } from '../services/api';
import { PoolCard, PoolCardPros } from '../components/PoolCard';
import { Loading } from '../components/Loading';
import { EmptyPoolList } from '../components/EmptyPoolList';
import { useFocusEffect } from '@react-navigation/native';

export default function Pools() {
   //this hook update data after focus on page again
   useFocusEffect(
      useCallback(() => {
         fetchPools();
      }, [])
   );

   const [isLoading, setIsLoading] = useState(true);
   const [pools, setPools] = useState<PoolCardPros[]>([]);
   const { navigate } = useNavigation();
   const toast = useToast();

   async function fetchPools() {
      try {
         setIsLoading(true);
         const response = await api.get('/pools');
         setPools(response.data.pools);
      } catch (error) {
         console.log(error);
         return toast.show({
            title: 'Não foi possível carregar os bolões.',
            placement: 'top',
            bgColor: 'red.500',
         });
      } finally {
         setIsLoading(false);
      }
   }
   return (
      <VStack flex={1} bgColor="gray.900">
         <Header title="Meus bolões" />
         <VStack mt={6} mx={5} borderBottomWidth={1} borderBottomColor="gray.600" pb={4} mb={4}>
            <Button
               title="BUSCAR BOLÃO POR CÓDIGO"
               leftIcon={<Icon as={Octicons} name="search" color="black" size="md" />}
               onPress={() => navigate('find')}
            />
         </VStack>

         {isLoading ? (
            <Loading />
         ) : (
            <FlatList
               keyExtractor={(item) => item.id}
               data={pools}
               renderItem={({ item }) => <PoolCard onPress={() => navigate('details', { id: item.id })} data={item} />}
               showsVerticalScrollIndicator={false}
               _contentContainerStyle={{ pb: 10 }}
               ListEmptyComponent={() => <EmptyPoolList />}
               px={5}
            />
         )}
      </VStack>
   );
}
