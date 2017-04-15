requirejs.config({
  baseUrl: 'libs',
  paths: {
    knockout: 'knockout/build/output/knockout-latest',
    text: 'text/text',
    components: '../components'
  }
});

requirejs(['../main']);
