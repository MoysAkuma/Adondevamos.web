const config = {
  development: {
    api: {
      baseUrl: process.env.APIBASEHOST || 'http://localhost:3001',
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
      baseUrl: process.env.APIBASEHOST,
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

export default config[process.env.NODE_ENV || 'development'];