import { Star } from 'lucide-react'
import React from 'react'

type Props = {
    rating:number
}

const Rating = (props: Props) => {
  return (
    [1,2,3,4,5].map(index=>(
        <Star key={index} className={`h-5 w-5`} color={index<=props.rating ? "#FFc107" : "#E4E4E9"}/>
    ))
  )
}
export default Rating