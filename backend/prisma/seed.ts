import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
   const user = await prisma.user.create({
      data: {
         name: 'Felipe Távora',
         email: 'felipetavor4@gmail.com',
         avatarUrl: 'https://github.com/felipetavora.png',
      },
   });

   const pool = await prisma.pool.create({
      data: {
         title: 'Example Pool',
         code: 'BOL123',
         ownerId: user.id,
         participants: {
            create: {
               userId: user.id,
            },
         },
      },
   });

   await prisma.game.create({
      data: {
         date: '2022-11-02T12:00:44.247Z',
         firstTeamCountryCode: 'DE',
         secondTeamCountryCode: 'BR',
      },
   });

   await prisma.game.create({
      data: {
         date: '2022-11-03T12:00:00.247Z',
         firstTeamCountryCode: 'AR',
         secondTeamCountryCode: 'BR',
         guesses: {
            create: {
               firstTeamPoints: 2,
               secondTeamPoints: 0,
               participant: {
                  connect: {
                     userId_poolId: {
                        userId: user.id,
                        poolId: pool.id,
                     },
                  },
               },
            },
         },
      },
   });
}

main();
