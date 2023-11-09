import { useState, useEffect, useRef } from "react";
import StarRating from "./StarRating";

const tempMovieData = [
  {
    imdbID: "tt1375666",
    Title: "Inception",
    Year: "2010",
    Poster:
      "https://m.media-amazon.com/images/M/MV5BMjAxMzY3NjcxNF5BMl5BanBnXkFtZTcwNTI5OTM0Mw@@._V1_SX300.jpg",
  },
  {
    imdbID: "tt0133093",
    Title: "The Matrix",
    Year: "1999",
    Poster:
      "https://m.media-amazon.com/images/M/MV5BNzQzOTk3OTAtNDQ0Zi00ZTVkLWI0MTEtMDllZjNkYzNjNTc4L2ltYWdlXkEyXkFqcGdeQXVyNjU0OTQ0OTY@._V1_SX300.jpg",
  },
  {
    imdbID: "tt6751668",
    Title: "Parasite",
    Year: "2019",
    Poster:
      "https://m.media-amazon.com/images/M/MV5BYWZjMjk3ZTItODQ2ZC00NTY5LWE0ZDYtZTI3MjcwN2Q5NTVkXkEyXkFqcGdeQXVyODk4OTc3MTY@._V1_SX300.jpg",
  },
];

const tempWatchedData = [
  {
    imdbID: "tt1375666",
    Title: "Inception",
    Year: "2010",
    Poster:
      "https://m.media-amazon.com/images/M/MV5BMjAxMzY3NjcxNF5BMl5BanBnXkFtZTcwNTI5OTM0Mw@@._V1_SX300.jpg",
    runtime: 148,
    imdbRating: 8.8,
    userRating: 10,
  },
  {
    imdbID: "tt0088763",
    Title: "Back to the Future",
    Year: "1985",
    Poster:
      "https://m.media-amazon.com/images/M/MV5BZmU0M2Y1OGUtZjIxNi00ZjBkLTg1MjgtOWIyNThiZWIwYjRiXkEyXkFqcGdeQXVyMTQxNzMzNDI@._V1_SX300.jpg",
    runtime: 116,
    imdbRating: 8.5,
    userRating: 9,
  },
];

const average = (arr) =>
  arr.reduce((acc, cur, i, arr) => acc + cur / arr.length, 0);

const KEY = "cb84075d";

export default function App() {
  const [query, setQuery] = useState("");
  const [movies, setMovies] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [selectedId, setSelectedId] = useState(null);
  
  // const [watched, setWatched] = useState([]);
  // 在useState中的回調函數不能有傳遞參數
  // 且這個回調函數只會在初始化render中調用
  // 之後的re-render並不會調用
  // 這個功能會滿常用的
  const [watched, setWatched] = useState(()=>{
    const storedValue = localStorage.getItem('watched');
    return JSON.parse(storedValue);
  });


  // useEffect(function() {
  //   console.log('After initial render');
  // }, [])

  // useEffect(function() {
  //   console.log('After every render');
  // });

  // useEffect(function() {
  //   console.log("D")
  // }, [query])

  // console.log('During render');

  function handleSelectMovie(id) {
    setSelectedId((prevId) => (id === prevId ? null : id));
  }

  function handleCloseMoive() {
    setSelectedId(null);
  }

  function handleAddWatched(movie) {
    setWatched((watched) => [...watched, movie]);

    // localStorage.setItem('watched', JSON.stringify([...watched, movie]))
  }
  
  function handleDeleteWatched(id) {
    setWatched(watched => watched.filter((movie)=> movie.imdbID !== id))
  }
  
  useEffect(()=>{
    localStorage.setItem('watched', JSON.stringify([...watched]))
    
  }, [watched])

  useEffect(() => {
    const controller = new AbortController();
    (async () => {
      if (query.length < 3) {
        setMovies([]);
        setError("");
        return;
      }
      handleCloseMoive();
      try {
        setIsLoading(true);
        setError("");
        const res = await fetch(
          `http://www.omdbapi.com/?apikey=${KEY}&s=${query}`, { signal: controller.signal }
        );
        if (!res.ok)
          throw new Error("Something went wrong with fetching movies.");

        const data = await res.json();
        if (data.Response === "False") throw new Error("Movie not found");
        setMovies(data.Search);
        // console.log(data.Search);
        setError("");
      } catch (error) {
        // console.error(error.message);
        if(error.name !== 'AbortError') {
          setError(error.message);
        }
      } finally {
        setIsLoading(false);
      }
      
    })();

    return () => {
      controller.abort()
    };
  }, [query]); // 這樣意味著這個效果只會在組件第一次掛載時執行

  return (
    <>
      <NavBar>
        <Logo />
        <Search query={query} setQuery={setQuery} />
        <Numresults movies={movies} />
      </NavBar>
      <Main>
        {/* 顯式element寫法 */}
        {/* <Box element={<MovieList movies={movies} />} />
        <Box
          element={
            <>
              <WatchedSummary watched={watched} />
              <WatchedMoviesList watched={watched} />
            </>
          }
        /> */}
        {/* 隱式children寫法 */}
        <Box>
          {isLoading && <Loader />}
          {isLoading && !error && <Loader />}
          {error && <ErrorMessage message={error} />}
          {!isLoading && !error && (
            <MovieList movies={movies} onSelectMovie={handleSelectMovie} />
          )}
        </Box>
        <Box>
          {selectedId ? (
            <MovieDetail
              watched={watched}
              selectedId={selectedId}
              onCloseMoive={handleCloseMoive}
              onAddWatched={handleAddWatched}
            />
          ) : (
            <>
              <WatchedSummary watched={watched} />
              <WatchedMoviesList watched={watched} onDeleteWatched={handleDeleteWatched}/>
            </>
          )}
        </Box>
      </Main>
    </>
  );
}

function Loader() {
  return <p className="loader">Loading...</p>;
}

function ErrorMessage({ message }) {
  return (
    <p className="error">
      <span>🚫</span>
      {message}
    </p>
  );
}

// Structural Component
function NavBar({ children }) {
  return <nav className="nav-bar">{children}</nav>;
}

// StateLess Component
function Logo() {
  return (
    <div className="logo">
      <span role="img">🍿</span>
      <h1>usePopcorn</h1>
    </div>
  );
}

function Search({ query, setQuery }) {
  // 這樣做其實不好，因為這樣直接操作DOM，就脫離使用React了
  // useEffect(()=>{
  //   const el = document.querySelector('.search');
  //   console.log(el);
  //   el.focus();
  // }, [])

  // 我們使用useRef會是比較好的做法
  const inputEl = useRef(null);

  useEffect(()=> {
    function callback(e){
      
      if(document.activeElement === inputEl.current) return;

      if(e.code === 'Enter') {
        inputEl.current.focus();
        setQuery('')
      }
    }
    document.addEventListener('keydown', callback);

    return ()=> document.addEventListener('keydown', callback);
  }, [setQuery])
  return (
    <input
      className="search"
      type="text"
      placeholder="Search movies..."
      value={query}
      onChange={(e) => setQuery(e.target.value)}
      ref={inputEl}
    />
  );
}

function Numresults({ movies }) {
  return (
    <p className="num-results">
      Found <strong>{movies.length}</strong> results
    </p>
  );
}

function Main({ children }) {
  return <main className="main">{children}</main>;
}

function Box({ children }) {
  const [isOpen, setIsOpen] = useState(true);
  return (
    <div className="box">
      <button className="btn-toggle" onClick={() => setIsOpen((open) => !open)}>
        {isOpen ? "–" : "+"}
      </button>
      {isOpen && children}
    </div>
  );
}

function MovieList({ movies, onSelectMovie }) {
  return (
    <ul className="list list-movie">
      {movies?.map((movie) => (
        <Movie key={movie.imdbID} movie={movie} onSelectMovie={onSelectMovie} />
      ))}
    </ul>
  );
}

function Movie({ movie, onSelectMovie }) {
  return (
    <li onClick={() => onSelectMovie(movie.imdbID)}>
      <img src={movie.Poster} alt={`${movie.Title} poster`} />
      <h3>{movie.Title}</h3>
      <div>
        <p>
          <span>🗓</span>
          <span>{movie.Year}</span>
        </p>
      </div>
    </li>
  );
}

function MovieDetail({ selectedId, watched, onCloseMoive, onAddWatched }) {
  const [movie, setMovie] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [userRating, setUserRating] = useState(0);

  const countRef = useRef(0);
  // 這樣子count不會有作用，只會記錄到最後一次
  // 因為只要re-render就又會變成0了
  let count = 0;

  useEffect(()=> {
    if(userRating) countRef.current ++;
    if(userRating) count++;
  }, [userRating, count])

  const isWatched = watched.map((movie) => movie.imdbID).includes(selectedId);
  const watchedUserRating = watched.find(movie=> movie.imdbID === selectedId)?.userRating;

  const {
    Title: title,
    Year: year,
    Poster: poster,
    Runtime: runtime,
    imdbRating,
    Plot: plot,
    Released: released,
    Actors: actors,
    Director: director,
    Genre: genre,
  } = movie;
  // console.log(title, year);


  // // eslint-disable-next-line react-hooks/rules-of-hooks, no-undef
  // if(imdbRating > 8) [isTop, setIsTop] = useState(true)

  // // 在render 到useEffect前可能就被return，這樣也會破壞Linked List的結構，所以這種return應該被放在最後面
  // if(imdbRating > 8) return <p>Greatest ever!</p>;

  // // 在init render的時候，imdbRating > 8 永遠都會是false
  // const [isTop, setIsTop] = useState( imdbRating > 8);
  // console.log(isTop);

  // // 我們要在re-render中去用useEffect偵測imdbRating的變化，才能改變state
  // useEffect(()=> {
  //   setIsTop(imdbRating > 8)
  // }, [imdbRating])

  // // 這樣就是隨著render去做改變，這樣也可以自動偵測state的變化
  // const isTop = imdbRating > 8;
  // console.log(isTop);

  useEffect(() => {
    (async () => {
      setIsLoading(true);
      const res = await fetch(
        `http://www.omdbapi.com/?apikey=${KEY}&i=${selectedId}`
      );
      const data = await res.json();
      // console.log(data);
      setMovie(data);
      setIsLoading(false);
    })();
  }, [selectedId, watched]);

  useEffect(()=> {
    if(!title) return;
    document.title = `Movie | ${title}`;
    return () => {
      document.title = 'usePopcorn';
      // 因為閉包的特性，所以clean up function 可以讀取到component原本的變數
      // console.log(`Clean up effect for movie ${title}`);
    }
  }, [title])

  useEffect(()=> {
    function callback (e) {
      if(e.code === 'Escape'){
        // 如果沒有使用cleanup function的話，我們還是可以觸發這個event
        onCloseMoive();
        // console.log('CLOSE');
      }
    }
    document.addEventListener('keydown' ,callback);
    return ()=> {
      document.removeEventListener('keydown', callback);
    }
  }, [onCloseMoive])

  // const [avgRating, setAvgRating] = useState(0);

  function handleAdd() {
    const newWatchedMovie = {
      imdbID: selectedId,
      title,
      year,
      poster,
      userRating,
      imdbRating: Number(imdbRating),
      runtime: Number(runtime.split(" ").at(0)),
      countRatingDecisions: countRef.current,
      count,
    };
    onAddWatched(newWatchedMovie);
    onCloseMoive();
    
    // 這樣只會拿到0，因為這是異步操作
    // setAvgRating(+imdbRating);
    // alert(avgRating); 
    
    // 這樣才是對的
    // setAvgRating(+imdbRating);
    // setAvgRating((avgRating)=>(avgRating + Number(userRating)) / 2);
  }

  return (
    <div className="details">
      {isLoading ? (
        <Loader />
      ) : (
        <>
          <header>
            <button className="btn-back" onClick={onCloseMoive}>
              &larr;
            </button>
            <img src={poster} alt={`Poster of ${movie} movie`} />
            <div className="details-overview">
              <h2>{title}</h2>
              <p>
                {released} &bull; {runtime}
              </p>
              <p>{genre}</p>
              <p>
                <span>⭐</span>IMDB Rating
              </p>
            </div>
          </header>

          {/* <p>{avgRating}</p> */}

          <section>
            <div className="rating">
              {!isWatched ? (
                <>
                  <StarRating
                    size={24}
                    maxRating={10}
                    defaultRating={+imdbRating}
                    onSetRating={setUserRating}
                  />
                  {userRating > 0 && (
                    <button className="btn-add" onClick={handleAdd}>
                      + Add to list
                    </button>
                  )}
                </>
              ) : (
                <p>You rated with movie {watchedUserRating}<span>⭐</span></p>
              )}
            </div>
            <p>
              <em>{plot}</em>
            </p>
            <p>Starring {actors}</p>
            <p>Director by {director}</p>
          </section>
        </>
      )}
    </div>
  );
}

function WatchedSummary({ watched }) {
  const avgImdbRating = average(watched.map((movie) => movie.imdbRating));
  const avgUserRating = average(watched.map((movie) => movie.userRating));
  const avgRuntime = average(watched.map((movie) => movie.runtime));
  return (
    <div className="summary">
      <h2>Movies you watched</h2>
      <div>
        <p>
          <span>#️⃣</span>
          <span>{watched.length} movies</span>
        </p>
        <p>
          <span>⭐️</span>
          <span>{avgImdbRating.toFixed(2)}</span>
        </p>
        <p>
          <span>🌟</span>
          <span>{avgUserRating.toFixed(2)}</span>
        </p>
        <p>
          <span>⏳</span>
          <span>{avgRuntime} min</span>
        </p>
      </div>
    </div>
  );
}

function WatchedMoviesList({ watched, onDeleteWatched }) {
  return (
    <ul className="list">
      {watched.map((movie) => (
        <WatchedMoive key={movie.imdbID} movie={movie} onDeleteWatched={onDeleteWatched}/>
      ))}
    </ul>
  );
}

function WatchedMoive({ movie, onDeleteWatched }) {
  return (
    <li>
      <img src={movie.poster} alt={`${movie.title} poster`} />
      <h3>{movie.title}</h3>
      <div>
        <p>
          <span>⭐️</span>
          <span>{movie.imdbRating}</span>
        </p>
        <p>
          <span>🌟</span>
          <span>{movie.userRating}</span>
        </p>
        <p>
          <span>⏳</span>
          <span>{movie.runtime} min</span>
        </p>

        <button className="btn-delete" onClick={()=> {onDeleteWatched(movie.imdbID)}}>X</button>
      </div>
    </li>
  );
}
