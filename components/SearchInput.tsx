import Image from 'next/image'
import React from 'react'

export default function SearchInput() {
  return (
    <div className="flex border-2 px-5 py-2 w-[60%] justify-between rounded-full">
      <input 
        type="text" 
        className="focus:outline-none w-full"
        placeholder='Buscar na pilha...'
      />

      <Image
        src="/images/pilha/search.png"
        alt='buscar'
        width={40}
        height={40}
        className="cursor-pointer"
      />
    </div>
  )
}
