const config = {
  development: {
    api: {
      baseUrl: process.env.REACT_APP_API_BASE_URL || 'http://localhost:3001/v1',
      site:{
        View : '/View'
      },
      endpoints: {
        Facilities:"/Facilities",
        Countries: '/Countries',
        States: '/States',
        Cities: '/Cities',
        Users: '/Users',
        Places: '/Places',
        Trips: '/Trips'
      }
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
        Countries: '/Countries',
        States: '/States',
        Cities: '/Cities',
        Users: '/Users',
        Places: '/Places',
        Trips: '/Trips'
      }
    }
  }
};

export default config[process.env.REACT_APP_ENV || 'development'];