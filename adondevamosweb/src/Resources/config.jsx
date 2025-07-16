const config = {
  development: {
    api: {
      baseUrl: 'http://localhost:3001',
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
      baseUrl: 'https://api.yourdomain.com/v1',
      endpoints: {
        users: '/users',
        products: '/products'
      }
    }
  }
};

export default config[process.env.NODE_ENV || 'development'];