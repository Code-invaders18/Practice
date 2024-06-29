import React, { useCallback, useEffect, useRef, useState } from "react";

export default function InfiniteScroll() {
  const [query, setQuery] = useState("");
  const page = useRef(1);
  const [listingData, setListingData] = useState([]);
  const [lastElement, setLastElement] = useState(null);
  const [loading, setLoading]=useState(false)
  const observerTarget = useRef(null);
  const handleApiCalls = async () => {
    setLoading(true)
    const response = await fetch(
      "https://openlibrary.org/search.json?" +`q=${query}&page=${page.current}`
    );
    const data = await response.json();
    setListingData((previousData)=>[...previousData,...data.docs]);
    setLoading(false)
    // console.log(data)
  };
  useEffect(() => {
    console.log(query)
      const observer = new IntersectionObserver((entries)=>{
          console.log("I am running", entries)
          if(entries[0].isIntersecting){
              // console.log("I am running")
              page.current+=1;
            handleApiCalls()
        }
    },{
        root: null, // This is the viewport
        threshold: 1.0,
      });
    if(observerTarget.current){
        observer.observe(observerTarget.current)
    }

    return ()=>{
        if(observerTarget.current){
            observer.unobserve(observerTarget.current)
        }
    }
  }, [observerTarget.current]);




  useEffect(() => {
    let timeoutId = setTimeout(() => {
      handleApiCalls();
    }, 900);
    return () => clearTimeout(timeoutId);
  }, [query]);

  return (
    <div>
      <label htmlFor="infinite-input">Enter search : </label>
      <input
        name="infinite-input"
        placeholder="Search"
        onChange={(e) => setQuery(e.target.value)}
        value={query}
      />
      <ul>
        {listingData?.map((item, index) => {
          return  <li key={index}>{item.title}</li>;
        })}
      </ul>
      <div ref={observerTarget}></div>
      {loading &&<h5>Loading</h5>}
    </div>
  );
}
