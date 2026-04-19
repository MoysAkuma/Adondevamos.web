const config = {
  development: {
    api: {
      baseUrl: process.env.REACT_APP_API_BASE_URL || 'http://localhost:3001/v1',
      site:{
        View : '/View'
      },
      endpoints: {
        Facilities:"/Facilities",
        Catalogues: '/Catalogues',
        Users: '/Users',
        Places: '/Places',
        Trips: '/Trips',
        Votes: '/Votes',
        Ranking: '/ranking'
      }
    },
    cache: {
      cataloguesExpirationMinutes: 60 // Cache catalogues for 1 hour
    }
  },
  production: {
    api: {
      baseUrl: process.env.REACT_APP_API_BASE_URL,
      site:{
        View : '/View'
      },
      endpoints: {
        Facilities:"/Facilities",
        Catalogues: '/Catalogues',
        Users: '/Users',
        Places: '/Places',
        Trips: '/Trips',
        Votes: '/Votes',
        Ranking: '/ranking'
      }
    },
    cache: {
      cataloguesExpirationMinutes: 120 // Cache catalogues for 2 hours in production
    }
  }
};

export default config[process.env.REACT_APP_ENV || 'development'];