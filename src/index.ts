import { PrismaClient, TestRecord } from '@prisma/client'
import { randomBytes } from 'crypto'

const foo: number = 10

console.log("Hello", foo)

async function main(): Promise<void> {
    console.log('in main')
    // get a connection to Prisma
    const prisma = new PrismaClient()

    // random name for this session, findAll can filter out previous runs.
    const sessionName = randomBytes(20).toString('hex').slice(0, 10)

    const testBuffer = Buffer.from([1, 2, 3, 4, 5])
    const testBufferBase64 = testBuffer.toString('base64')
    console.log("buffer: ", testBuffer)
    console.log("base64 buffer: ", testBufferBase64)

    // insert data into the database using the engine
    await prisma.testRecord.create({
        data: {
            name: sessionName + '-create',
            binData: testBuffer
        }
    })

    await prisma.$executeRaw`INSERT INTO "TestRecord" (name, "binData") 
                                            VALUES (${sessionName + '-raw'}, ${testBuffer})`
    // this encodes in base64 the string: `{"type":"Buffer","data":[1,2,3,4,5]}`

    await prisma.$executeRaw`INSERT INTO "TestRecord" (name, "binData") 
                                            VALUES (${sessionName + '-rawBase64'}, ${testBufferBase64})`
    // this encodes in base64, the base64 string.

    await prisma.$executeRawUnsafe(
        'INSERT INTO "TestRecord" (name, "binData") VALUES ($1, $2)',
        sessionName + '-rawUnsafe',
        testBuffer,
    )
    // this does the exact same as -raw.

    const findAllResult = await prisma.testRecord.findMany({
        where: {
            name: {
                startsWith: sessionName
            }
        }
    })
    console.log("Engine Read:", findAllResult)

    type ActualReturnValue = TestRecord & {
        binData: string
    }


    const readRawResult = await prisma.$queryRaw<ActualReturnValue[]>`SELECT * FROM "TestRecord" WHERE name ~ ${sessionName}`

    if (!readRawResult) {
        throw new Error('got nothing back')
    }

    console.log("Raw Read:", readRawResult.map(r => {

        return {
            name: r.name,
            binRaw: r.binData,
            decoded: Buffer.from(r.binData, 'base64'),
            stringForm: Buffer.from(r.binData, 'base64').toString(),
        }
    }))

}

main()
