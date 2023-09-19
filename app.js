// app.js

const dynamicImports = async () => {
  const { default: routes } = await import('./routes.mjs');

  return routes;
};

dynamicImports().then(routes => {
  if (typeof PhusionPassenger !== 'undefined') {
    PhusionPassenger.configure({ autoInstall: false });
  }

  const app = routes;
  
  if (typeof PhusionPassenger !== 'undefined') {
    app.listen('passenger');
  } else {
    app.listen(8000);
  }
});
