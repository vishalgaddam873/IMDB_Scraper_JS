const cheerio = require("cheerio");
const request = require("request-promise");

// Task 1
var scrapeTopList = request("https://www.imdb.com/india/top-rated-indian-movies/")
scrapeTopList.then((response)=>{
  var $ = cheerio.load(response);
  var topMoviesList = [], urlList = [], titleList = [];
  var  yearList = [], ratingList = [];
  $('.titleColumn').find('a').each((index,element)=>{
    titleList.push($(element).text());
    urlList.push("https://www.imdb.com" + $(element).attr('href').slice(0,17));
  });
  $('.titleColumn').find('span').each((index,element)=>{
    yearList.push(parseInt($(element).text().slice(1,5)));
  });
  $('.ratingColumn').find('strong').each((index,element)=>{
    ratingList.push(parseFloat($(element).text()))
  });
  for(let i = 0;i<titleList.length;i++){
    Movie = {
      'position':i+1,
      'name':titleList[i],
      'year':yearList[i],
      'imdb_rating':ratingList[i],
      'url':urlList[i]
    }
    topMoviesList.push(Movie)
  }
  // Task 1 is completed
  // Task 2
  var movies_by_year = (movieslist)=>{
    var movie_by_year = {}
    for(let movie of movieslist){
      movie_by_year[movie.year] = []
    }
    for(let movie_year in movie_by_year){
      // console.log(typeof movie_year)
      for(let movie of movieslist){
        if(parseInt(movie_year) == movie.year){
          movie_by_year[movie_year].push(movie.name)
        }
      }
    }
    return(movie_by_year)
  }
  // console.log(movies_by_year(topMoviesList))

  // Task 3
  var movies_by_decade = (movieslist)=>{
    var movie_by_decade = {}
    for(let movie of movieslist){
      let year = Math.floor(movie.year / 10) * 10
      movie_by_decade[year] = []
    }
    for(let movie_decade in movie_by_decade){
      for(let movie of movieslist){
        let year = Math.floor(movie.year / 10) * 10
        if(parseInt(movie_decade) == year){
          movie_by_decade[year].push(movie.name)
        }
      }
    }
    return(movie_by_decade)
  }
  // console.log(movies_by_decade(topMoviesList))
  return(topMoviesList)
}) // Task 4
.then((movieslist)=>{
  var movies_detail = (movie_url)=>{
    var movie_details = request(movie_url);
    movie_details.then((response)=>{
      var generList = [];
      var $ = cheerio.load(response);
      var movie_name = $('.title_wrapper').find('h1').text().split('(')[0].trim()
      var gener = $('.title_wrapper').find('div').text().split('|')[2].trim().split(/(?:\n|,)+/)
      for(let type of gener){
        if(!type.includes(" ")){
          generList.push(type);
        }
      }
      var time = $('.title_wrapper').find('div').text().split('|')[1].split('h');
      if(time.length > 1){
        var runtime = (parseInt(time[0].trim()) * 60) + parseInt(time[1].split('min')[0].trim());
      }else{
        var runtime = parseInt(time[0].trim());
      }
      var movie_bio = $('.summary_text').text().trim();
      var image_url = "https://www.imdb.com" + $('.poster').find('a').attr('href').slice(0,41)
      var details = {
        'name':movie_name,
        'runtime':runtime,
        'gener':generList,
        'bio':movie_bio,
        'image_url':image_url
      }
      console.log(details)
    })
  }
  movies_detail(movieslist[0]['url'])
})
