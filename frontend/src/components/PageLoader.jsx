import React from 'react'
import { LoaderIcon } from 'lucide-react'

function PageLoader() {
  return (
    <div className="flex flex-col justify-center items-center h-screen gap-4">
        <LoaderIcon className="size-10 animate-spin" />
    </div>
  )
}

export default PageLoader