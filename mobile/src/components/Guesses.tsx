import { useEffect, useState } from 'react';
import { useToast, FlatList } from 'native-base';
import { api } from '../services/api';
import { Game, GameProps } from './Game';
import { Loading } from './Loading';
import { EmptyMyPoolList } from './EmptyMyPoolList';

interface Props {
   poolId: string;
   code: string;
}

export function Guesses({ poolId, code }: Props) {
   const [isLoading, setIsLoading] = useState(true);
   const [firstTeamPoints, setFirstTeamPoints] = useState('');
   const [secondTeamPoints, setSecondTeamPoints] = useState('');
   const [games, setGames] = useState<GameProps[]>([]);
   const toast = useToast();

   useEffect(() => {
      fetchGames();
   }, [poolId]);

   async function fetchGames() {
      try {
         setIsLoading(true);
         const response = await api.get(`/pools/${poolId}/games`);
         setGames(response.data.games);
      } catch (error) {
         console.log(error);
         toast.show({
            title: 'Não foi possível carregar os jogos.',
            placement: 'top',
            bgColor: 'red.500',
         });
      } finally {
         setIsLoading(false);
      }
   }

   async function handleGuessConfirm(gameId: string) {
      if (!firstTeamPoints.trim() || !secondTeamPoints.trim()) {
         return toast.show({
            title: 'Informe um placar.',
            placement: 'top',
            bgColor: 'red.500',
         });
      }
      try {
         await api.post(`/pools/${poolId}/games/${gameId}/guesses`, {
            firstTeamPoints: Number(firstTeamPoints),
            secondTeamPoints: Number(secondTeamPoints),
         });
         toast.show({
            title: 'Palpite realizado com sucesso!',
            placement: 'top',
            bgColor: 'green.500',
         });
         fetchGames();
      } catch (error) {
         console.log(error);
         toast.show({
            title: 'Não foi possível enviar o palpite.',
            placement: 'top',
            bgColor: 'red.500',
         });
      }
   }

   if (isLoading) {
      return <Loading />;
   }

   return (
      <FlatList
         keyExtractor={(item) => item.id}
         data={games}
         ListEmptyComponent={() => <EmptyMyPoolList code={code} />}
         renderItem={({ item }) => (
            <Game
               data={item}
               setFirstTeamPoints={setFirstTeamPoints}
               setSecondTeamPoints={setSecondTeamPoints}
               onGuessConfirm={() => handleGuessConfirm(item.id)}
            />
         )}
      />
   );
}
