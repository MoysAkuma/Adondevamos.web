const config = {
  development: {
    api: {
      baseUrl: import.meta.env.VITE_API_URL || 'http://localhost:3001/v1',
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
      baseUrl: import.meta.env.VITE_API_URL,
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

export default config[(import.meta.env.VITE_ENV as keyof typeof config) || 'development'];