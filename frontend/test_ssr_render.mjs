import { createServer } from 'vite';

async function testRender() {
  const vite = await createServer({
    server: { middlewareMode: true },
    appType: 'custom'
  });

  try {
    const React = await vite.ssrLoadModule('react');
    const ReactDOMServer = await vite.ssrLoadModule('react-dom/server');
    const { App } = await vite.ssrLoadModule('/src/App.jsx');
    
    console.log('Rendering <App /> to string...');
    const html = ReactDOMServer.renderToString(React.createElement(App));
    console.log('SUCCESS! <App /> rendered cleanly with length:', html.length);

    const { AIToolsForgeView } = await vite.ssrLoadModule('/src/components/AIToolsForgeView.jsx');
    console.log('Rendering <AIToolsForgeView />...');
    const toolsHtml = ReactDOMServer.renderToString(React.createElement(AIToolsForgeView));
    console.log('SUCCESS! <AIToolsForgeView /> rendered cleanly with length:', toolsHtml.length);

    const { PublicPortfolioView } = await vite.ssrLoadModule('/src/components/PublicPortfolioView.jsx');
    console.log('Rendering <PublicPortfolioView />...');
    const portHtml = ReactDOMServer.renderToString(React.createElement(PublicPortfolioView));
    console.log('SUCCESS! <PublicPortfolioView /> rendered cleanly with length:', portHtml.length);

  } catch (err) {
    console.error('SSR RENDER ERROR CAUGHT:');
    console.error(err);
  } finally {
    await vite.close();
  }
}

testRender();
