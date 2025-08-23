
import React from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Flame } from 'lucide-react';
import CustomWordCloud from '@/components/CustomWordCloud';
import { prisma } from '@/lib/db';
type Props = {}

const HotTopicsCard = async (props: Props) => {
  const topics = await prisma.topicCount.findMany({})
  const formattedTopics=topics.map(topic =>{
    return {
      text:topic.topic,
      value:topic.count
    }
  })
  return (
    <Card className='col-span-4'>
        <CardHeader className='flex flex-row items-center justify-between pb-2 space-y-0'>
            <CardTitle className='text-2xl font-bold'>Hot Topics</CardTitle>
            <Flame size={28} strokeWidth={2.5}/>
        </CardHeader>
          <CardDescription className='ml-6'>
            Click on a topic start a quiz on it!
          </CardDescription>
        <CardContent className='pl-2'>
            <CustomWordCloud formattedTopics={formattedTopics}/>
        </CardContent>

    </Card>
  )
}

export default HotTopicsCard