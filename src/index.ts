import { PrismaClient } from '@prisma/client'
import { randomBytes } from 'crypto'

const foo: number = 10

console.log("Hello", foo)

async function main(): Promise<void> {
    console.log('in main')
    // get a connection to Prisma
    const prisma = new PrismaClient()

    // name for this session, so you can find all the stuff from this go
    const sessionName = randomBytes(20).toString('base64').slice(0, 10)

    const testBuffer = Buffer.from([1, 2, 3, 4, 5])
    console.log("buffer: ", testBuffer)

    // insert data into the database using the engine
    await prisma.testRecord.create({
        data: {
            name: sessionName + '-create',
            binData: testBuffer
        }
    })

    await prisma.$queryRaw`INSERT INTO "TestRecord" (name, "binData") 
                                            VALUES (${sessionName + '-raw'}, ${testBuffer})`


    const findAllResult = await prisma.testRecord.findMany({
        where: {
            name: {
                startsWith: sessionName
            }
        }
    })

    console.log("GOT", findAllResult)

}

main()
