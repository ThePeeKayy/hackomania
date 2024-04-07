import React, { useEffect, useState, Suspense } from 'react'
import { useDebouncedCallback } from "use-debounce"
import { universalSearch } from '@/utils/supabase/actions'

export default function SearchComponent() {
  const [query, setQuery] = useState("")
  const [queryResults, setQueryResults] = useState([])
  const [isSearching, setIsSearching] = useState(false)

  const handleRedirect = (redirecturl, redirectsection, event) => {
    // Your existing code for handleRedirect
  }

  const handleSearch = useDebouncedCallback((term) => {
    setQuery(term)
  }, 600)

  useEffect(() => {
    const getResults = async (queryTerm) => {
      setIsSearching(true)
      try {
        const results = await universalSearch(queryTerm)
        setQueryResults(results)
      } catch (error) {
        console.log("error fetching search results", error)
      }
      setIsSearching(false)
    }
    if (query) {
      getResults(query)
    } else {
      setQueryResults([])
    }
  }, [query])

  return (
    <div className='relative flex flex-col'>
      <input
        id="search"
        name="search"
        className="block w-full rounded-md border-0 bg-gray-700 py-1.5 pl-10 pr-3 text-gray-300 focus:outline-none placeholder:text-gray-400  sm:text-sm sm:leading-6"
        placeholder="Search"
        onChange={(e) => handleSearch(e.target.value)}
        type="search"
        autoComplete='off'
      />
      <Suspense fallback={<div>Loading...</div>}>
        <ul className={`absolute left-0 top-8 w-full mt-2 border-gray-300 rounded shadow-md z-10 ${queryResults?.length && 'bg-white border'}`}>
          {isSearching && <div>Loading...</div>}
          {!isSearching && queryResults?.length > 0 && queryResults.map((result, i) => (
            <li onClick={() => handleRedirect(result.tag, result.html_id, event)} className='py-2 px-4 hover:bg-gray-100 border-y-[1px] border-grey-100' key={i}>
              <div className='max-w-full'>
                <h4 className='font-bold'>{result.title}</h4>
                <span className='flex flex-wrap max-w-full whitespace-normal text-wrap break-all'>{result.description.length > 100 ? result.description.slice(0, 100) + '...' : result.description}</span>
              </div>
            </li>
          ))}
        </ul>
      </Suspense>
    </div>
  )
}
