const config = {
  development: {
    api: {
      baseUrl: 'http://localhost:3001',
      endpoints: {
        Facility: '/Facility',
        Facilities:"/Facilities",
        Country: '/Country',
        Countries: '/Countries',
        State: '/State',
        States: '/States',
        City: '/City',
        Cities: '/Cities',
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